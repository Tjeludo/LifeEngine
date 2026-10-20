const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class MouthCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.mouth, org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var real_c = this.getRealCol();
        var real_r = this.getRealRow();
        for (var loc of Hyperparams.edibleNeighbors){
            var cell = env.grid_map.cellAt(real_c+loc[0], real_r+loc[1]);
            this.eatNeighbor(cell, env);
        }
    }

    eatNeighbor(n_cell, env) {
        if (n_cell == null)
            return;
        if (CellStates.isEdible(n_cell.state)){
            var nutrition = this.nutritionOf(n_cell.state);
            if (nutrition <= 0)
                return; // indigestible for this organism, leave it
            env.changeCell(n_cell.col, n_cell.row, CellStates.empty, null);
            this.org.food_collected += nutrition;
        }
        else if (Hyperparams.grazeProb > 0 && n_cell.state == CellStates.producer && n_cell.owner != null &&
                 n_cell.owner != this.org && !n_cell.owner.anatomy.is_mover && !this.org.anatomy.isCarnivore()) {
            // grazing bites the grass plant itself, not just the food it dropped
            if (Math.random() < Hyperparams.grazeProb) {
                n_cell.owner.harm('grazed');
                this.org.food_collected += Hyperparams.grassNutrition;
            }
        }
    }

    nutritionOf(state) {
        var carnivore = this.org.anatomy.isCarnivore();
        if (state == CellStates.meat)
            return carnivore ? Hyperparams.meatNutrition : Hyperparams.herbivoreMeatNutrition;
        if (carnivore)
            return Hyperparams.carnivorePlantNutrition;
        return state == CellStates.browse ? Hyperparams.browseNutrition : Hyperparams.grassNutrition;
    }
}

module.exports = MouthCell;