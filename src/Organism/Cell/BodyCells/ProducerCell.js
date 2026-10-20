const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class ProducerCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.producer, org, loc_col, loc_row);
        this.org.anatomy.is_producer = true;
    }

    producedState() {
        return CellStates.food;
    }

    waterUse() {
        return Hyperparams.grassWaterUse;
    }

    prodProb() {
        return Hyperparams.foodProdProb;
    }

    performFunction() {
        if (this.org.anatomy.is_mover && !Hyperparams.moversCanProduce)
            return;
        var env = this.org.env;
        var prob = this.prodProb();
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        if (Math.random() * 100 <= prob) {
            var loc = Hyperparams.growableNeighbors[Math.floor(Math.random() * Hyperparams.growableNeighbors.length)]
            var loc_c=loc[0];
            var loc_r=loc[1];
            var cell = env.grid_map.cellAt(real_c+loc_c, real_r+loc_r);
            if (cell != null && cell.state == CellStates.empty){
                if (Hyperparams.waterEnabled) {
                    // production succeeds in proportion to the soil water under the plant or the target
                    // cell, and uses it up
                    var own = this.getRealCell();
                    var avail = Math.max(cell.water, own ? own.water : 0);
                    if (Math.random() > avail)
                        return;
                    cell.water = Math.max(0, cell.water - this.waterUse());
                    if (own) own.water = Math.max(0, own.water - this.waterUse() / 2);
                }
                env.changeCell(real_c+loc_c, real_r+loc_r, this.producedState(), null);
                this.org.food_collected++;
                return;
            }
        }
    }
}

module.exports = ProducerCell;
