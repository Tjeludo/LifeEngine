const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

// Zebra stripe. Has no active function; its effect is applied when a predator's eye looks at
// a striped organism (see EyeCell.look): the more other striped organisms nearby, the more
// likely the predator fails to pick it out of the herd.
class StripeCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.stripe, org, loc_col, loc_row);
        this.org.anatomy.has_stripe = true;
    }

    // Probability that a predator looking at org fails to detect it
    static camouflageChance(org) {
        var radius = Hyperparams.stripeHerdRadius;
        var env = org.env;
        var herd = new Set();
        for (var dc=-radius; dc<=radius; dc++) {
            for (var dr=-radius; dr<=radius; dr++) {
                var cell = env.grid_map.cellAt(org.c+dc, org.r+dr);
                if (cell == null || cell.owner == null || cell.owner == org)
                    continue;
                if (cell.owner.anatomy.has_stripe && cell.owner.living)
                    herd.add(cell.owner);
            }
        }
        return Math.min(Hyperparams.stripeCamoMax, herd.size * Hyperparams.stripeCamoPerNeighbor);
    }
}

module.exports = StripeCell;
