const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class KillerCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.killer, org, loc_col, loc_row);
        this.org.anatomy.has_killer = true;
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of Hyperparams.killableNeighbors) {
            var cell = env.grid_map.cellAt(c+loc[0], r+loc[1]);
            this.killNeighbor(cell);
        }
    }

    // The killer eats part of the carcass on the spot; those carcass cells are removed
    feedOnKill(prey) {
        var env = this.org.env;
        var n = Math.round(prey.anatomy.cells.length * Hyperparams.killFeedFraction);
        var eaten = 0;
        for (var cell of prey.anatomy.cells) {
            if (eaten >= n) break;
            var c = prey.c + cell.rotatedCol(prey.rotation);
            var r = prey.r + cell.rotatedRow(prey.rotation);
            var grid_cell = env.grid_map.cellAt(c, r);
            if (grid_cell && grid_cell.owner == null && CellStates.isEdible(grid_cell.state)) {
                env.changeCell(c, r, CellStates.empty, null);
                eaten++;
            }
        }
        this.org.food_collected += eaten * Hyperparams.meatNutrition;
    }

    killNeighbor(n_cell) {
        if(n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || n_cell.state == CellStates.armor || n_cell.state == CellStates.horn) 
            return;
        if (!Hyperparams.killersHarmPlants && !n_cell.owner.anatomy.is_mover)
            return;
        if (Hyperparams.noFriendlyFire && n_cell.owner.lineage && n_cell.owner.lineage == this.org.lineage)
            return;
        // a killer that is not part of jaws (no mouth beside it, e.g. a zebra's rear kick) is a defensive weapon
        var damage = Hyperparams.killerDamage;
        if (!this.org.anatomy.isCarnivore()) {
            if (Hyperparams.weaponsOnlyHitPredators && !n_cell.owner.anatomy.isCarnivore())
                return;
            if (Hyperparams.weaponDamage >= 0)
                damage = Hyperparams.weaponDamage;
        }
        var is_hit = n_cell.state == CellStates.killer; // has to be calculated before death
        var prey = n_cell.owner; // the grid cell loses its owner if the prey dies mid-loop
        for (var i=0; i<damage && prey.living; i++)
            prey.harm();
        if (!prey.living) {
            prey.env.eco_stats.recordKill(this.org, prey);
            if (Hyperparams.killFeedFraction > 0 && this.org.anatomy.isCarnivore())
                this.feedOnKill(prey);
        }
        if (Hyperparams.instaKill && is_hit) {
            this.org.harm();
        }
    }
}

module.exports = KillerCell;
