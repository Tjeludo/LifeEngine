// Generates the seeded savanna worlds used in the experiments.
// Usage: node make-world.js <variant> [seed]  -> writes worlds/savanna-<variant>-<seed>.json
//
// "base-*" variants use only the original Life Engine rules and cell types (all new settings stay at
// their defaults, which reproduce the original engine). Every other variant uses the modified engine;
// ablation variants switch one feature off so its contribution can be isolated.
// Nothing here sets an outcome: it only places the starting organisms and sets the rules.
const fs = require('fs');
const path = require('path');

const variant = process.argv[2] || 'full';
const seedArg = process.argv[3] || '1';
let seed = parseInt(seedArg);
function rand() { // mulberry32, so worlds are reproducible
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

const BASE = variant.startsWith('base');
const COLS = 160, ROWS = 100, CELL = 5;
const ADJ = [[0,1],[0,-1],[1,0],[-1,0]];
const ALL8 = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

const cell = (state, c, r, extra={}) => Object.assign({loc_col: c, loc_row: r, state: {name: state}}, extra);

// ---- species (facing "up": row -1 is the front) ----
// Zebra: fast (2 movers), forward eye + side eye, one mouth, rear kick, two stripes. Herd grazer.
// Rhino: one mover (slow), one mouth, horn, 4 armour, forward eye. Big, armoured, slow-breeding grazer.
// Leopard: sprint (2 movers), jaws (2 killers beside the mouth), forward eye, cache. Meat eater.
const SPECIES = {
    grass: {cells: [cell('producer',0,0), cell('producer',-1,0), cell('producer',1,0)], mut: 2},
    bush: {cells: [cell('woody',0,0), cell('woody',-1,0), cell('woody',1,0), cell('woody',0,-1), cell('woody',0,1)], mut: 2},
    tree: {cells: [-1,0,1].flatMap(c => [-1,0,1].map(r => cell('tree', c, r))), mut: 1},
    zebra: {cells: [cell('mover',0,0), cell('mover',0,1), cell('mouth',0,-1), cell('eye',-1,0,{direction:0}),
                    cell('eye',1,0,{direction:1}), cell('killer',0,2), cell('stripe',-1,1), cell('stripe',1,1)],
            brain: {food:2, browse:0, killer:0, meat:0}, move_range: 4, mut: 4}, // no flight response at the start; it can evolve
    rhino: {cells: [cell('mover',0,0), cell('horn',0,-1), cell('mouth',-1,-1), cell('eye',1,-1,{direction:0}),
                    cell('armor',-1,0), cell('armor',-1,1), cell('armor',0,1), cell('armor',1,1)],
            brain: {food:2, browse:0, killer:0, meat:0}, move_range: 3, mut: 3},
    leopard: {cells: [cell('mover',0,0), cell('mover',0,1), cell('killer',0,-1), cell('mouth',1,-1), cell('killer',1,0),
                      cell('eye',-1,0,{direction:0}), cell('cache',0,2)],
              brain: {food:0, browse:0, meat:2, mouth:2, mover:2, eye:2, stripe:2, killer:1, horn:1}, move_range: 4, mut: 3},
};
let COUNTS = {grass: 140, bush: 45, tree: 14, zebra: 36, rhino: 12, leopard: 16};

const swap = (sp, from, to) => { SPECIES[sp].cells = SPECIES[sp].cells.map(c => c.state.name === from ? cell(to, c.loc_col, c.loc_row) : c); };
const drop = (sp, name) => { SPECIES[sp].cells = SPECIES[sp].cells.filter(c => c.state.name !== name); };

let controls, river = true;
if (BASE) {
    // Original engine: no new cell types exist, so new cells are removed or replaced by original ones
    drop('zebra', 'stripe'); swap('rhino', 'horn', 'armor'); drop('leopard', 'cache'); swap('bush', 'woody', 'producer');
    SPECIES.zebra.brain = {food:2};
    SPECIES.rhino.brain = {food:2};
    SPECIES.leopard.brain = {food:2, mouth:2, mover:2, eye:2, killer:1};
    COUNTS.tree = 0;
    river = false;
    controls = {
        lifespanMultiplier: 100, foodProdProb: 5, killableNeighbors: ADJ, edibleNeighbors: ADJ, growableNeighbors: ADJ,
        useGlobalMutability: false, globalMutability: 5, addProb: 33, changeProb: 33, removeProb: 33,
        rotationEnabled: true, foodBlocksReproduction: true, moversCanProduce: false, instaKill: false,
        lookRange: 20, seeThroughSelf: false, foodDropProb: 0, extraMoverFoodCost: 0, maxOrganisms: -1,
        // the original engine has none of the new cell types, so mutation may not create them either
        disabledCells: ['woody', 'horn', 'stripe', 'cache', 'tree'],
    };
    if (variant === 'base-plantkill' || variant === 'base-plantkill-control') {
        // Route 1: zebras whose kick destroys plants get a food windfall from each dead plant
        Object.assign(controls, {instaKill: true, killableNeighbors: ALL8, foodProdProb: 3});
        COUNTS.leopard = 0;
        if (variant === 'base-plantkill-control') swap('zebra', 'killer', 'armor');
    }
    if (variant === 'base-clog') {
        // Route 2: fast plants surrounded by uneaten food, few grazers
        Object.assign(controls, {foodProdProb: 10, growableNeighbors: ALL8});
        COUNTS = Object.assign(COUNTS, {zebra: 6, rhino: 3, leopard: 0});
    }
    if (variant === 'base-harsh') Object.assign(controls, {foodProdProb: 2});
    if (variant === 'base-nomut') Object.assign(controls, {foodProdProb: 2, useGlobalMutability: true, globalMutability: 0});
}
else {
    controls = {
        lifespanMultiplier: 150, foodProdProb: 5, killableNeighbors: ADJ, edibleNeighbors: ADJ, growableNeighbors: ADJ,
        useGlobalMutability: false, globalMutability: 5, addProb: 33, changeProb: 33, removeProb: 33,
        rotationEnabled: true, foodBlocksReproduction: false, moversCanProduce: false, instaKill: false,
        lookRange: 20, seeThroughSelf: false, foodDropProb: 0, extraMoverFoodCost: 0, maxOrganisms: -1,
        grassNutrition: 1, browseNutrition: 0.35, meatNutrition: 1, carnivorePlantNutrition: 0, herbivoreMeatNutrition: 0,
        carcassMeat: true, meatDecayProb: 0.005, killersHarmPlants: false, grazeProb: 0.02,
        killerDamage: 4, weaponDamage: 2, weaponsOnlyHitPredators: true, killFeedFraction: 1, noFriendlyFire: true, treeLifespanFactor: 6, armorFoodCost: 2, armorHealth: 3,
        metabolismInterval: 80, metabolismCost: 1, starvationTolerance: 10,
        moversAddSpeed: true, maxSpeed: 3,
        waterEnabled: true, rainRate: 0.002, rainSeasonPeriod: 0, rainSeasonAmplitude: 0,
        grassWaterUse: 0.5, woodyWaterUse: 0.25, soilUpdateInterval: 10,
        riverCrossCells: 9, riparianWidth: 6, riparianRefill: 3,
        treeProdFactor: 0.15, treeWaterUse: 0.4, treeCoverProb: 0.6, cacheNeedsTree: true, cacheTreeRadius: 5,
        fireProb: 0.0004, fireSpread: 0.9, treeFireResist: 0.3, fireMaxCells: 1500,
        hornGoreProb: 0.5, trampleProb: 0.05, stripeCamoPerNeighbor: 0.25, stripeCamoMax: 0.85, stripeHerdRadius: 4,
        cacheCapacity: 3, cacheDepositProb: 0.1, cacheSurplusFraction: 0.5,
        disabledCells: [], lineageCellCaps: {},
    };
    // ablations: one feature off each
    if (variant === 'nostripe') { swap('zebra', 'stripe', 'armor'); controls.disabledCells.push('stripe'); }
    if (variant === 'nohorn') { swap('rhino', 'horn', 'armor'); controls.disabledCells.push('horn'); }
    if (variant === 'nocache') { swap('leopard', 'cache', 'armor'); controls.disabledCells.push('cache'); }
    if (variant === 'nowater') controls.waterEnabled = false;
    if (variant === 'nograze') controls.grazeProb = 0;
    if (variant === 'noleopard') COUNTS.leopard = 0;
    if (variant === 'leopards32') COUNTS.leopard = 32; // follow-up: can a denser predator population persist?
    if (variant === 'leopards48') COUNTS.leopard = 48;
    if (variant === 'mouthcap') controls.lineageCellCaps = {zebra: {mouth: 1}};
    if (variant === 'noriver') river = false;
    if (variant === 'notrees') { COUNTS.tree = 0; controls.cacheNeedsTree = false; }
    if (variant === 'nofire') controls.fireProb = 0;
}

// ---- river: a meandering 3-cell channel; zebras and leopards cannot cross, rhinos (9 cells) can ----
const occupied = new Set();
const water = [];
if (river) {
    for (let r = 0; r < ROWS; r++) {
        const centre = Math.round(108 + 7 * Math.sin(r / 11));
        for (let c = centre - 1; c <= centre + 1; c++) { water.push({c, r}); occupied.add(c + ',' + r); }
    }
}

const organisms = [];
const HERDS = Array.from({length: 6}, () => [15 + Math.floor(rand() * (COLS - 30)), 15 + Math.floor(rand() * (ROWS - 30))]);
function place(sp, idx) {
    const s = SPECIES[sp];
    for (let tries = 0; tries < 800; tries++) {
        let c = 3 + Math.floor(rand() * (COLS - 6)), r = 3 + Math.floor(rand() * (ROWS - 6));
        if (sp === 'zebra') { // zebras start in herds
            const h = HERDS[idx % HERDS.length];
            c = h[0] + Math.floor(rand() * 15) - 7; r = h[1] + Math.floor(rand() * 15) - 7;
        }
        let ok = true; // keep a one-cell gap so nothing starts touching
        for (const x of s.cells) for (let dc=-1; dc<=1; dc++) for (let dr=-1; dr<=1; dr++)
            if (occupied.has((c+x.loc_col+dc)+','+(r+x.loc_row+dr))) ok = false;
        if (!ok) continue;
        for (const x of s.cells) occupied.add((c+x.loc_col)+','+(r+x.loc_row));
        const decisions = {};
        for (const n of ['empty','food','wall','mouth','producer','mover','killer','armor','eye','browse','meat','woody','horn','stripe','cache','water','tree'])
            decisions[n] = 0;
        Object.assign(decisions, s.brain || {});
        const is_mover = s.cells.some(x => x.state.name === 'mover');
        const org = {c, r, lifetime: Math.floor(rand() * 100), food_collected: is_mover ? 4 : 0, living: true, direction: Math.floor(rand()*4),
            rotation: 0, can_rotate: true, move_count: 0, move_range: s.move_range || 4, ignore_brain_for: 0, mutability: s.mut, damage: 0,
            cache: 0, hunger: 0, lineage: sp, species_name: sp,
            anatomy: {birth_distance: 4, is_producer: !is_mover, is_mover, has_eyes: is_mover, cells: JSON.parse(JSON.stringify(s.cells))}};
        if (is_mover) org.brain = {decisions};
        organisms.push(org);
        return true;
    }
    return false;
}
for (const sp of ['tree', 'bush', 'grass', 'rhino', 'zebra', 'leopard'])
    for (let i = 0; i < COUNTS[sp]; i++) place(sp, i);

const species = {};
for (const sp in COUNTS) {
    const n = organisms.filter(o => o.species_name === sp).length;
    if (n) species[sp] = {population: n, cumulative_pop: n, start_tick: 0, end_tick: -1, extinct: false};
}
const world = {
    num_rows: ROWS, num_cols: COLS, total_mutability: 0, largest_cell_count: 9, reset_count: 0, total_ticks: 0, data_update_rate: 100,
    grid: {cell_size: CELL, cols: COLS, rows: ROWS, food: [], walls: [], water},
    organisms,
    fossil_record: {min_discard: 10, record_size_limit: 500,
        records: {tick_record: [], pop_counts: [], species_counts: [], av_mut_rates: [], av_cells: [], av_cell_counts: []}, species},
    controls,
    species_designs: SPECIES,
};
const out = path.join(__dirname, 'worlds');
fs.mkdirSync(out, {recursive: true});
const file = path.join(out, `savanna-${variant}-${seedArg}.json`);
fs.writeFileSync(file, JSON.stringify(world));
const counts = {};
for (const o of organisms) counts[o.lineage] = (counts[o.lineage] || 0) + 1;
console.log(path.basename(file), JSON.stringify(counts));
