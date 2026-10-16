const Environment = require('./Environment');
const Renderer = require('../Rendering/Renderer');
const GridMap = require('../Grid/GridMap');
const Organism = require('../Organism/Organism');
const CellStates = require('../Organism/Cell/CellStates');
const EnvironmentController = require('../Controllers/EnvironmentController');
const Hyperparams = require('../Hyperparameters.js');
const FossilRecord = require('../Stats/FossilRecord');
const WorldConfig = require('../WorldConfig');
const SerializeHelper = require('../Utils/SerializeHelper');
const Species = require('../Stats/Species');
const EcoStats = require('../Stats/EcoStats');
const Perlin = require('../Utils/Perlin');

class WorldEnvironment extends Environment{
    constructor(cell_size) {
        super();
        this.renderer = new Renderer('env-canvas', 'env', cell_size);
        this.controller = new EnvironmentController(this, this.renderer.canvas);
        this.num_rows = Math.ceil(this.renderer.height / cell_size);
        this.num_cols = Math.ceil(this.renderer.width / cell_size);
        this.grid_map = new GridMap(this.num_cols, this.num_rows, cell_size);
        this.organisms = [];
        this.walls = [];
        this.total_mutability = 0;
        this.largest_cell_count = 0;
        this.reset_count = 0;
        this.total_ticks = 0;
        this.data_update_rate = 100;
        this.eco_stats = new EcoStats(this);
        this.initSoil();
        FossilRecord.setEnv(this);
    }

    update() {
        var to_remove = [];
        for (var i in this.organisms) {
            var org = this.organisms[i];
            if (!org.living || !org.update()) {
                to_remove.push(i);
            }
        }
        this.removeOrganisms(to_remove);
        if (Hyperparams.foodDropProb > 0) {
            this.generateFood();
        }
        if (this.total_ticks % Hyperparams.soilUpdateInterval == 0) {
            this.updateSoil();
            if (Hyperparams.fireProb > 0 && Math.random() < Hyperparams.fireProb * Hyperparams.soilUpdateInterval * Math.max(0, 2 - this.rainFactor()))
                this.igniteFire();
        }
        this.total_ticks ++;
        this.eco_stats.tick();
        if (this.total_ticks % this.data_update_rate == 0) {
            FossilRecord.updateData();
        }
    }

    render() {
        if (WorldConfig.headless) {
            this.renderer.cells_to_render.clear();
            return;
        }
        this.renderer.renderCells();
        this.renderer.renderHighlights();
    }

    renderFull() {
        this.renderer.renderFullGrid(this.grid_map.grid);
    }

    removeOrganisms(org_indeces) {
        let start_pop = this.organisms.length;
        for (var i of org_indeces.reverse()){
            this.total_mutability -= this.organisms[i].mutability;
            this.organisms.splice(i, 1);
        }
        if (this.organisms.length === 0 && start_pop > 0) {
            if (WorldConfig.auto_pause)
                $('.pause-button')[0].click();
            else if(WorldConfig.auto_reset) {
                this.reset_count++;
                this.reset(false);
            }
        }
    }

    // Soil capacity (fertility) is a smooth Perlin field; water starts full and refills by rain
    initSoil() {
        Perlin.seed();
        var scale = 0.06;
        for (var col of this.grid_map.grid) {
            for (var cell of col) {
                var n = Perlin.get(cell.col * scale, cell.row * scale); // roughly -0.7..0.7
                cell.capacity = Math.max(0.15, Math.min(1, 0.6 + n));
                cell.riparian = 0;
            }
        }
        this.initRiverbank();
        for (var col of this.grid_map.grid)
            for (var cell of col)
                cell.water = cell.capacity;
        CellStates.empty.show_soil = Hyperparams.waterEnabled;
    }

    // Soil within riparianWidth cells of the river is fertile and refills faster
    initRiverbank() {
        var width = Hyperparams.riparianWidth;
        var queue = [];
        for (var col of this.grid_map.grid)
            for (var cell of col) {
                cell.river_dist = Infinity;
                if (cell.terrain === 'water') { cell.river_dist = 0; queue.push(cell); }
            }
        for (var i=0; i<queue.length; i++) {
            var cur = queue[i];
            if (cur.river_dist >= width) continue;
            for (var d of [[1,0],[-1,0],[0,1],[0,-1]]) {
                var n = this.grid_map.cellAt(cur.col+d[0], cur.row+d[1]);
                if (n && n.river_dist === Infinity) { n.river_dist = cur.river_dist + 1; queue.push(n); }
            }
        }
        for (var c of queue) {
            c.riparian = 1 - c.river_dist / width;
            c.capacity = Math.max(c.capacity, Math.min(1, 0.5 + 0.5 * c.riparian));
        }
    }

    rainFactor() {
        if (Hyperparams.rainSeasonPeriod <= 0)
            return 1;
        var phase = 2 * Math.PI * this.total_ticks / Hyperparams.rainSeasonPeriod;
        return Math.max(0, 1 + Hyperparams.rainSeasonAmplitude * Math.sin(phase));
    }

    updateSoil() {
        var water_on = Hyperparams.waterEnabled;
        CellStates.empty.show_soil = water_on;
        var refill = Math.min(1, Hyperparams.rainRate * Hyperparams.soilUpdateInterval * this.rainFactor());
        var rot = Hyperparams.meatDecayProb * Hyperparams.soilUpdateInterval;
        for (var col of this.grid_map.grid) {
            for (var cell of col) {
                if (water_on && cell.water < cell.capacity) {
                    var r = cell.riparian ? Math.min(1, refill * (1 + (Hyperparams.riparianRefill - 1) * cell.riparian)) : refill;
                    cell.water += (cell.capacity - cell.water) * r;
                    if (cell.state === CellStates.empty)
                        this.renderer.addToRender(cell);
                }
                if (rot > 0 && cell.state === CellStates.meat && Math.random() < rot) {
                    // carcasses rot back into the soil, enriching it a little
                    this.changeCell(cell.col, cell.row, CellStates.empty, null);
                    cell.capacity = Math.min(1, cell.capacity + 0.05);
                }
            }
        }
    }

    isFuel(cell) {
        if (cell.owner == null)
            return cell.state === CellStates.food || cell.state === CellStates.browse;
        return !cell.owner.anatomy.is_mover && CellStates.isPlantCell(cell.state);
    }

    // A fire starts on a random patch of vegetation and spreads through dry, connected fuel.
    // Wet soil and gaps (grazed or trampled ground, the river) stop it; tree cells resist.
    igniteFire() {
        var start = null;
        for (var t=0; t<60 && !start; t++) {
            var c = this.grid_map.cellAt(Math.floor(Math.random()*this.grid_map.cols), Math.floor(Math.random()*this.grid_map.rows));
            if (this.isFuel(c)) start = c;
        }
        if (!start) return 0;
        var burning = [start], seen = new Set([start]), burnt = 0, plants = 0;
        for (var i=0; i<burning.length && burnt < Hyperparams.fireMaxCells; i++) {
            var cell = burning[i];
            if (!this.isFuel(cell)) continue;
            if (cell.owner != null) {
                if (cell.owner.living) { cell.owner.last_harm = 'fire'; cell.owner.die(); plants++; }
            }
            else {
                this.changeCell(cell.col, cell.row, CellStates.empty, null);
            }
            cell.water = 0;
            burnt++;
            for (var d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
                var n = this.grid_map.cellAt(cell.col+d[0], cell.row+d[1]);
                if (!n || seen.has(n) || !this.isFuel(n)) continue;
                var p = Hyperparams.fireSpread * (1 - 0.7 * (n.water || 0)); // wet ground slows fire
                if (n.state === CellStates.tree) p *= Hyperparams.treeFireResist;
                seen.add(n);
                if (Math.random() < p) burning.push(n);
            }
        }
        this.eco_stats.fires++;
        this.eco_stats.burnt += burnt;
        this.eco_stats.events.push({tick: this.total_ticks, lineage: 'fire', event: 'fire', burnt: burnt, plants_killed: plants});
        return burnt;
    }

    OriginOfLife() {
        var center = this.grid_map.getCenter();
        var org = new Organism(center[0], center[1], this);
        org.anatomy.addDefaultCell(CellStates.mouth, 0, 0);
        org.anatomy.addDefaultCell(CellStates.producer, 1, 1);
        org.anatomy.addDefaultCell(CellStates.producer, -1, -1);
        this.addOrganism(org);
        FossilRecord.addSpecies(org, null);
    }

    addOrganism(organism) {
        organism.updateGrid();
        this.total_mutability += organism.mutability;
        this.organisms.push(organism);
        if (organism.anatomy.cells.length > this.largest_cell_count) 
            this.largest_cell_count = organism.anatomy.cells.length;
    }

    canAddOrganism() {
        return this.organisms.length < Hyperparams.maxOrganisms || Hyperparams.maxOrganisms < 0;
    }

    averageMutability() {
        if (this.organisms.length < 1)
            return 0;
        if (Hyperparams.useGlobalMutability) {
            return Hyperparams.globalMutability;
        }
        return this.total_mutability / this.organisms.length;
    }

    changeCell(c, r, state, owner) {
        if (state === CellStates.empty) {
            let cell = this.grid_map.cellAt(c, r);
            if (cell && cell.terrain === 'water')
                state = CellStates.water; // the river returns when an organism or food leaves
        }
        super.changeCell(c, r, state, owner);
        this.renderer.addToRender(this.grid_map.cellAt(c, r));
        if(state == CellStates.wall)
            this.walls.push(this.grid_map.cellAt(c, r));
    }

    clearWalls() {
        for(var wall of this.walls){
            let wcell = this.grid_map.cellAt(wall.col, wall.row);
            if (wcell && wcell.state == CellStates.wall)
                this.changeCell(wall.col, wall.row, CellStates.empty, null);
        }
    }

    clearOrganisms() {
        for (var org of this.organisms)
            org.die();
        this.organisms = [];
    }
    
    clearDeadOrganisms() {
        let to_remove = [];
        for (let i in this.organisms) {
            let org = this.organisms[i];
            if (!org.living)
                to_remove.push(i);
        }
        this.removeOrganisms(to_remove);
    }

    generateFood() {
        var num_food = Math.max(Math.floor(this.grid_map.cols*this.grid_map.rows*Hyperparams.foodDropProb/50000), 1)
        var prob = Hyperparams.foodDropProb;
        for (var i=0; i<num_food; i++) {
            if (Math.random() <= prob){
                var c=Math.floor(Math.random() * this.grid_map.cols);
                var r=Math.floor(Math.random() * this.grid_map.rows);

                if (this.grid_map.cellAt(c, r).state == CellStates.empty){
                    this.changeCell(c, r, CellStates.food, null);
                }
            }
        }
    }

    reset(confirm_reset=true, reset_life=true) {
        if (confirm_reset && !confirm('The current environment will be lost. Proceed?'))
            return false;

        this.organisms = [];
        this.grid_map.fillGrid(CellStates.empty, !WorldConfig.clear_walls_on_reset);
        this.renderer.renderFullGrid(this.grid_map.grid);
        this.total_mutability = 0;
        this.total_ticks = 0;
        FossilRecord.clear_record();
        this.eco_stats.clear();
        this.initSoil();
        if (reset_life)
            this.OriginOfLife();
        return true;
    }

    resizeGridColRow(cell_size, cols, rows) {
        this.renderer.cell_size = cell_size;
        this.renderer.fillShape(rows*cell_size, cols*cell_size);
        this.grid_map.resize(cols, rows, cell_size);
        this.initSoil();
    }

    resizeFillWindow(cell_size) {
        this.renderer.cell_size = cell_size;
        this.renderer.fillWindow('env');
        this.num_cols = Math.ceil(this.renderer.width / cell_size);
        this.num_rows = Math.ceil(this.renderer.height / cell_size);
        this.grid_map.resize(this.num_cols, this.num_rows, cell_size);
        this.initSoil();
    }

    serialize() {
        this.clearDeadOrganisms();
        let env = SerializeHelper.copyNonObjects(this);
        env.grid = this.grid_map.serialize();
        env.organisms = [];
        for (let org of this.organisms){
            env.organisms.push(org.serialize());
        }
        env.fossil_record = FossilRecord.serialize();
        env.controls = Hyperparams;
        return env;
    }

    loadRaw(env) { // species name->stats map, evolution controls, 
        this.organisms = [];
        FossilRecord.clear_record();
        let cell_size = env.grid.cell_size ? env.grid.cell_size : this.grid_map.cell_size;
        this.resizeGridColRow(cell_size, env.grid.cols, env.grid.rows)
        this.grid_map.loadRaw(env.grid);
        for (let wall of env.grid.walls) {
            this.walls.push(this.grid_map.cellAt(wall.c, wall.r));
        }

        // create species map
        let species = {};
        for (let name in env.fossil_record.species) {
            let s = new Species(null, null, 0);
            SerializeHelper.overwriteNonObjects(env.fossil_record.species[name], s)
            species[name] = s; // the species needs an anatomy obj still
        }

        for (let orgRaw of env.organisms) {
            let org = new Organism(orgRaw.col, orgRaw.row, this);
            org.loadRaw(orgRaw);
            this.addOrganism(org);
            let s = species[orgRaw.species_name];
            if (!s){ // ideally, every organisms species should exists, but there is a bug that misses some species sometimes
                s = new Species(org.anatomy, null, env.total_ticks);
                species[orgRaw.species_name] = s;
            }
            if (!s.anatomy) {
                //if the species doesn't have anatomy we need to initialize it
                s.anatomy = org.anatomy;
                s.calcAnatomyDetails();
            }
            s.name = orgRaw.species_name;
            org.species = s;
        }
        for (let name in species)
            FossilRecord.addSpeciesObj(species[name]);
        FossilRecord.loadRaw(env.fossil_record);
        this.eco_stats.clear();
        this.initSoil();
        SerializeHelper.overwriteNonObjects(env, this);
        if ($('#override-controls').is(':checked'))
            Hyperparams.loadJsonObj(env.controls)
        CellStates.empty.show_soil = Hyperparams.waterEnabled;
        this.renderer.renderFullGrid(this.grid_map.grid);
    }
}

module.exports = WorldEnvironment;

