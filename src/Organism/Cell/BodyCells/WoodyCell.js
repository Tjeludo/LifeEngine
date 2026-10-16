const CellStates = require("../CellStates");
const ProducerCell = require("./ProducerCell");
const Hyperparams = require("../../../Hyperparameters");

// Producer cell of bushes. Drops browse (lower quality food) and draws less water per event,
// standing in for deep roots that compete less with shallow grass for surface water.
class WoodyCell extends ProducerCell{
    constructor(org, loc_col, loc_row){
        super(org, loc_col, loc_row);
        this.state = CellStates.woody;
    }

    producedState() {
        return CellStates.browse;
    }

    waterUse() {
        return Hyperparams.woodyWaterUse;
    }
}

module.exports = WoodyCell;
