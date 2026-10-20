const CellStates = require("./Cell/CellStates");
const BodyCellFactory = require("./Cell/BodyCells/BodyCellFactory");
const SerializeHelper = require("../Utils/SerializeHelper");

class Anatomy {
    constructor(owner) {
        this.owner = owner;
        this.birth_distance = 4;
        this.clear();
    }

    clear() {
        this.cells = [];
        this.is_producer = false;
        this.is_mover = false;
        this.has_eyes = false;
        this.has_killer = false;
        this.has_horn = false;
        this.has_stripe = false;
        this.has_cache = false;
        this.diet_cache = undefined;
    }

    // Jaws = a killer cell orthogonally next to a mouth cell. Organisms with jaws digest meat
    // (and not plants); a killer elsewhere on the body (e.g. a zebra's rear kick) is only a weapon.
    isCarnivore() {
        if (this.diet_cache !== undefined)
            return this.diet_cache;
        var carn = false;
        for (var a of this.cells) {
            if (a.state !== CellStates.killer) continue;
            for (var b of this.cells) {
                if (b.state === CellStates.mouth && Math.abs(a.loc_col-b.loc_col) + Math.abs(a.loc_row-b.loc_row) == 1) {
                    carn = true; break;
                }
            }
            if (carn) break;
        }
        this.diet_cache = carn;
        return carn;
    }

    countCells(state) {
        var n = 0;
        for (var cell of this.cells)
            if (cell.state == state) n++;
        return n;
    }

    canAddCellAt(c, r) {
        for (var cell of this.cells) {
            if (cell.loc_col == c && cell.loc_row == r){
                return false;
            }
        }
        return true;
    }

    addDefaultCell(state, c, r) {
        var new_cell = BodyCellFactory.createDefault(this.owner, state, c, r);
        this.cells.push(new_cell);
        this.diet_cache = undefined;
        return new_cell;
    }

    addRandomizedCell(state, c, r) {
        if (state==CellStates.eye && !this.has_eyes) {
            this.owner.brain.randomizeDecisions();
        }
        var new_cell = BodyCellFactory.createRandom(this.owner, state, c, r);
        this.cells.push(new_cell);
        this.diet_cache = undefined;
        return new_cell;
    }

    addInheritCell(parent_cell) {
        var new_cell = BodyCellFactory.createInherited(this.owner, parent_cell);
        this.cells.push(new_cell);
        this.diet_cache = undefined;
        return new_cell;
    }

    replaceCell(state, c, r, randomize=true) {
        this.removeCell(c, r, true);
        if (randomize) {
            return this.addRandomizedCell(state, c, r);
        }
        else {
            return this.addDefaultCell(state, c, r);
        }
    }

    removeCell(c, r, allow_center_removal=false) {
        if (c == 0 && r == 0 && !allow_center_removal)
            return false;
        for (var i=0; i<this.cells.length; i++) {
            var cell = this.cells[i];
            if (cell.loc_col == c && cell.loc_row == r){
                this.cells.splice(i, 1);
                this.diet_cache = undefined;
                break;
            }
        }
        this.checkTypeChange();
        return true;
    }

    getLocalCell(c, r) {
        for (var cell of this.cells) {
            if (cell.loc_col == c && cell.loc_row == r){
                return cell;
            }
        }
        return null;
    }

    checkTypeChange() {
        this.is_producer = false;
        this.is_mover = false;
        this.has_eyes = false;
        this.has_killer = false;
        this.has_horn = false;
        this.has_stripe = false;
        this.has_cache = false;
        for (var cell of this.cells) {
            if (cell.state == CellStates.producer || cell.state == CellStates.woody || cell.state == CellStates.tree)
                this.is_producer = true;
            if (cell.state == CellStates.mover)
                this.is_mover = true;
            if (cell.state == CellStates.eye)
                this.has_eyes = true;
            if (cell.state == CellStates.killer)
                this.has_killer = true;
            if (cell.state == CellStates.horn)
                this.has_horn = true;
            if (cell.state == CellStates.stripe)
                this.has_stripe = true;
            if (cell.state == CellStates.cache)
                this.has_cache = true;
        }
    }

    moverCount() {
        var n = 0;
        for (var cell of this.cells)
            if (cell.state == CellStates.mover) n++;
        return n;
    }

    getRandomCell() {
        return this.cells[Math.floor(Math.random() * this.cells.length)];
    }

    getNeighborsOfCell(col, row) {
        var neighbors = [];
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {

                var neighbor = this.getLocalCell(col + x, row + y);
                if (neighbor)
                    neighbors.push(neighbor)
            }
        }

        return neighbors;
    }

    isEqual(anatomy) { // currently unused helper func. inefficient, avoid usage in prod.
        if (this.cells.length !== anatomy.cells.length) return false;
        for (let i in this.cells) {
            let my_cell = this.cells[i];
            let their_cell = anatomy.cells[i];
            if (my_cell.loc_col !== their_cell.loc_col ||
                my_cell.loc_row !== their_cell.loc_row ||
                my_cell.state !== their_cell.state)
                return false;
        }
        return true;
    }

    serialize() {
        let anatomy = SerializeHelper.copyNonObjects(this);
        anatomy.cells = [];
        for (let cell of this.cells) {
            let newcell = SerializeHelper.copyNonObjects(cell);
            newcell.state = {name: cell.state.name};
            anatomy.cells.push(newcell)
        }
        return anatomy;
    }

    loadRaw(anatomy) {
        this.clear();
        for (let cell of anatomy.cells){
            this.addInheritCell(cell);
        }
    }
}

module.exports = Anatomy;