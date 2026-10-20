const Neighbors = require("./Grid/Neighbors");

const Hyperparams = {
    setDefaults: function() {
        this.lifespanMultiplier = 100;
        this.foodProdProb = 5;
        this.killableNeighbors = Neighbors.adjacent;
        this.edibleNeighbors = Neighbors.adjacent;
        this.growableNeighbors = Neighbors.adjacent;

        this.useGlobalMutability = false;
        this.globalMutability = 5;
        this.addProb = 33;
        this.changeProb = 33;
        this.removeProb = 33;
        
        this.rotationEnabled = true;

        this.foodBlocksReproduction = true;
        this.moversCanProduce = false;

        this.instaKill = false;

        this.lookRange = 20;
        this.seeThroughSelf = false;

        this.foodDropProb = 0;

        this.extraMoverFoodCost = 0;

        this.maxOrganisms = -1;

        // ---- Savanna ecology extensions (all defaults reproduce the original engine) ----
        // Diet: how much reproduction energy each edible cell gives
        this.grassNutrition = 1;            // food from grass producers
        this.browseNutrition = 1;           // browse from woody (bush) producers, for non-killers
        this.meatNutrition = 1;             // meat, for organisms with a killer cell
        this.carnivorePlantNutrition = 1;   // food/browse eaten by organisms with a killer cell
        this.herbivoreMeatNutrition = 1;    // meat eaten by organisms without a killer cell
        this.carcassMeat = false;           // dead movers leave meat instead of food
        this.meatDecayProb = 0;             // per-tick chance a meat cell rots away
        this.killerDamage = 1;              // damage a killer cell deals per hit
        this.weaponDamage = -1;             // damage of killers that are not jaws (-1 = same as killerDamage)
        this.weaponsOnlyHitPredators = false; // non-jaw killers only strike organisms that have jaws
        this.killFeedFraction = 0;          // fraction of a kill's carcass the killer eats immediately
        this.killersHarmPlants = true;      // killer cells damage non-moving producers
        this.grazeProb = 0;                 // per-tick chance a mouth damages an adjacent grass producer cell

        // Metabolism: every N ticks a mover pays metabolismCost energy, or goes hungry
        this.metabolismInterval = 0;        // 0 = off
        this.metabolismCost = 1;
        this.starvationTolerance = 4;       // missed payments in a row before death

        // Soil water and fertility
        this.waterEnabled = false;
        this.rainRate = 0.004;              // fraction of the gap to soil capacity refilled per tick
        this.rainSeasonPeriod = 0;          // ticks per wet/dry cycle, 0 = no seasons
        this.rainSeasonAmplitude = 0;       // 0..1, how strongly rain varies with season
        this.grassWaterUse = 0.3;           // water drawn from the soil each time grass produces
        this.woodyWaterUse = 0.15;          // bushes are deep rooted and draw less from any one cell
        this.soilUpdateInterval = 10;

        // New cells
        this.hornGoreProb = 0.5;            // chance a horn hurts an adjacent killer each tick
        this.trampleProb = 0.05;            // chance a horn damages an adjacent plant cell each tick
        this.stripeCamoPerNeighbor = 0.25;  // detection loss per extra striped organism nearby
        this.stripeCamoMax = 0.85;
        this.stripeHerdRadius = 4;
        this.cacheCapacity = 3;             // energy units each cache cell can store
        this.cacheDepositProb = 0.1;        // per-tick chance a cache cell banks 1 unit of surplus food
        this.cacheSurplusFraction = 0.5;    // food in hand (as a fraction of foodNeeded) before banking starts

        this.moversAddSpeed = false;        // extra mover cells give extra steps per tick
        this.maxSpeed = 3;

        // River, trees and fire
        this.riverCrossCells = 0;           // organisms with at least this many cells can wade water (0 = nobody)
        this.riparianWidth = 6;             // soil this close to water is fertile
        this.riparianRefill = 3;            // and refills this many times faster
        this.treeProdFactor = 0.3;          // trees produce browse at this fraction of foodProdProb
        this.treeWaterUse = 0.4;
        this.treeCoverProb = 0;             // chance an animal beside a tree is hidden from the other diet
        this.cacheNeedsTree = false;        // caches only fill near trees
        this.cacheTreeRadius = 5;
        this.fireProb = 0;                  // per-tick chance a fire starts (scaled up in the dry season)
        this.fireSpread = 0.45;             // spread chance into dry neighbouring fuel
        this.treeFireResist = 0.3;
        this.fireMaxCells = 1500;
        this.treeLifespanFactor = 1;        // tree cells live this many times longer than other cells
        this.armorFoodCost = 0;             // extra food per armour cell needed to reproduce
        this.armorHealth = 0;               // extra health per armour cell
        this.noFriendlyFire = false;        // killers do not harm their own lineage
        this.lineageCellCaps = {};          // e.g. {zebra: {mouth: 1}} for the mouth-cap control

        this.disabledCells = [];            // cell types that mutation may not create (ablation runs)
    },

    loadJsonObj(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}

Hyperparams.setDefaults();

module.exports = Hyperparams;