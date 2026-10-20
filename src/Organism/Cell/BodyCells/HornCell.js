const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

// Rhino horn. Like armor it cannot be harmed by killer cells, and it gores adjacent killer cells.
// It also tramples: adjacent plant cells may be damaged and adjacent food/browse crushed,
// and an organism with a horn can push through food/browse while moving (see Organism.isClear).
class HornCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.horn, org, loc_col, loc_row);
        this.org.anatomy.has_horn = true;
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of Hyperparams.killableNeighbors) {
            var cell = env.grid_map.cellAt(c+loc[0], r+loc[1]);
            if (cell == null)
                continue;
            if (cell.owner == null) {
                if ((cell.state == CellStates.food || cell.state == CellStates.browse) && Math.random() < Hyperparams.trampleProb)
                    env.changeCell(cell.col, cell.row, CellStates.empty, null);
                continue;
            }
            if (cell.owner == this.org || !cell.owner.living)
                continue;
            if (cell.state == CellStates.killer) {
                if (Math.random() < Hyperparams.hornGoreProb)
                    cell.owner.harm('gored');
            }
            else if (!cell.owner.anatomy.is_mover && (cell.state == CellStates.producer || cell.state == CellStates.woody)) { // trees are too big to trample
                if (Math.random() < Hyperparams.trampleProb)
                    cell.owner.harm('trampled');
            }
        }
    }
}

module.exports = HornCell;
