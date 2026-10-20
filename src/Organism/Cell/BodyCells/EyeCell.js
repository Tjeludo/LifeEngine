const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");
const Directions = require("../../Directions");
const Observation = require("../../Perception/Observation")
const StripeCell = require("./StripeCell");
const TreeCell = require("./TreeCell");

class EyeCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.eye, org, loc_col, loc_row);
        this.org.anatomy.has_eyes = true;
    }

    initInherit(parent) {
        // deep copy parent values
        super.initInherit(parent);
        this.direction = parent.direction;
    }
    
    initRandom() {
        // initialize values randomly
        this.direction = Directions.getRandomDirection();
    }

    initDefault() {
        // initialize to default values
        this.direction = Directions.up;
    }

    getAbsoluteDirection() {
        var dir = this.org.rotation + this.direction;
        if (dir > 3)
            dir -= 4;
        return dir;
    }

    performFunction() {
        var obs = this.look();
        this.org.brain.observe(obs);
    }

    look() {
        var env = this.org.env;
        var direction = this.getAbsoluteDirection();
        var addCol = 0;
        var addRow = 0;
        switch(direction) {
            case Directions.up:
                addRow = -1;
                break;
            case Directions.down:
                addRow = 1;
                break;
            case Directions.right:
                addCol = 1;
                break;
            case Directions.left:
                addCol = -1;
                break;
        }
        var start_col = this.getRealCol();
        var start_row = this.getRealRow();
        var col = start_col;
        var row = start_row;
        var cell = null;
        for (var i=0; i<Hyperparams.lookRange; i++){
            col+=addCol;
            row+=addRow;
            cell = env.grid_map.cellAt(col, row);
            if (cell == null) {
                break;
            }
            if (cell.owner === this.org && Hyperparams.seeThroughSelf) {
                continue;
            }
            if (cell.owner != null && cell.owner.anatomy.has_stripe && this.org.anatomy.isCarnivore() &&
                Math.random() < StripeCell.camouflageChance(cell.owner)) {
                continue; // predator loses the striped organism against its herd and looks past it
            }
            if (Hyperparams.treeCoverProb > 0 && cell.owner != null && cell.owner.anatomy.is_mover &&
                cell.owner.anatomy.isCarnivore() != this.org.anatomy.isCarnivore() &&
                TreeCell.nearTree(env, col, row) && Math.random() < Hyperparams.treeCoverProb) {
                continue; // an animal beside a tree is hidden from the other diet: refuge for prey, ambush for predators
            }
            if (cell.state !== CellStates.empty) {
                var distance = Math.abs(start_col-col) + Math.abs(start_row-row);
                return new Observation(cell, distance, direction);
            }
        }
        return new Observation(cell, Hyperparams.lookRange, direction);
    }
}

module.exports = EyeCell;