const CellStates = require("../CellStates");
const WoodyCell = require("./WoodyCell");
const Hyperparams = require("../../../Hyperparameters");

// Tree cell. A slow, thirsty producer that drops a little browse. Its real role is structural:
// animals standing next to a tree are hard for animals of the other diet to see (cover and ambush,
// see EyeCell.look), leopards can only cache food near trees (see CacheCell), and trees resist fire.
class TreeCell extends WoodyCell{
    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
        this.state = CellStates.tree;
    }

    prodProb() {
        return Hyperparams.foodProdProb * Hyperparams.treeProdFactor;
    }

    waterUse() {
        return Hyperparams.treeWaterUse;
    }

    // true if any of the 8 grid cells around (c, r) holds a tree cell
    static nearTree(env, c, r, radius=1) {
        for (var dc=-radius; dc<=radius; dc++) {
            for (var dr=-radius; dr<=radius; dr++) {
                var cell = env.grid_map.cellAt(c+dc, r+dr);
                if (cell != null && cell.state == CellStates.tree)
                    return true;
            }
        }
        return false;
    }
}

module.exports = TreeCell;
