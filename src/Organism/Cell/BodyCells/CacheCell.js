const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");
const TreeCell = require("./TreeCell");

// Leopard cache. When the organism holds surplus food it may bank one unit into its store
// (delaying reproduction). Stored units are spent automatically when metabolism would
// otherwise cause starvation damage (see Organism.metabolise).
class CacheCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.cache, org, loc_col, loc_row);
        this.org.anatomy.has_cache = true;
    }

    performFunction() {
        var org = this.org;
        if (org.cache >= org.cacheCapacity())
            return;
        // only bank surplus: the organism must already hold enough food for half an offspring
        if (org.food_collected >= Math.max(1, org.foodNeeded() * Hyperparams.cacheSurplusFraction) &&
            Math.random() < Hyperparams.cacheDepositProb &&
            (!Hyperparams.cacheNeedsTree || TreeCell.nearTree(org.env, org.c, org.r, Hyperparams.cacheTreeRadius))) {
            org.food_collected -= 1;
            org.cache += 1;
        }
    }
}

module.exports = CacheCell;
