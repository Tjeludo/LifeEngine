const Hyperparams = require("../../Hyperparameters");

// A cell state is used to differentiate type and render the cell
class CellState{
    constructor(name) {
        this.name = name;
        this.color = 'black';
    }

    render(ctx, cell, size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(cell.x, cell.y, size, size);
    }
}

class Empty extends CellState {
    constructor() {
        super('empty');
        this.dry_color = [42, 31, 18];
        this.wet_color = [14, 19, 24];
        this.show_soil = false;
    }
    render(ctx, cell, size) {
        // When the soil-water system is on, empty ground is tinted by how much water it holds
        if (!this.show_soil || cell.water === undefined) {
            super.render(ctx, cell, size);
            return;
        }
        var w = Math.max(0, Math.min(1, cell.water));
        var d = this.dry_color, e = this.wet_color;
        ctx.fillStyle = 'rgb(' + Math.round(d[0] + (e[0]-d[0])*w) + ',' + Math.round(d[1] + (e[1]-d[1])*w) + ',' + Math.round(d[2] + (e[2]-d[2])*w) + ')';
        ctx.fillRect(cell.x, cell.y, size, size);
    }
}
class Food extends CellState {
    constructor() {
        super('food');
    }
}
// Food dropped by woody (bush) producers. Lower nutrition for grazers than grass food.
class Browse extends CellState {
    constructor() {
        super('browse');
    }
}
// Carcass left by a dead animal. Only killer-bearing organisms digest it well.
class Meat extends CellState {
    constructor() {
        super('meat');
    }
}
// River water. Terrain rather than an organism: it comes back whenever something leaves the cell.
class Water extends CellState {
    constructor() {
        super('water');
    }
}
class Wall extends CellState {
    constructor() {
        super('wall');
    }
}
class Mouth extends CellState {
    constructor() {
        super('mouth');
    }
}
class Producer extends CellState {
    constructor() {
        super('producer');
    }
}
class Mover extends CellState {
    constructor() {
        super('mover');
    }
}
class Killer extends CellState {
    constructor() {
        super('killer');
    }
}
class Armor extends CellState {
    constructor() {
        super('armor');
    }
}
// Producer cell of bushes: deep-rooted, produces browse instead of food
class Woody extends CellState {
    constructor() {
        super('woody');
    }
}
// Tree: slow producer that gives cover and caching sites
class Tree extends CellState {
    constructor() {
        super('tree');
    }
}
// Rhino horn: immune to killers, gores attackers, tramples plants and pushes through food
class Horn extends CellState {
    constructor() {
        super('horn');
    }
}
// Zebra stripe: herd camouflage against predator eyes
class Stripe extends CellState {
    constructor() {
        super('stripe');
    }
}
// Leopard cache: stores surplus energy for times of scarcity
class Cache extends CellState {
    constructor() {
        super('cache');
    }
}
class Eye extends CellState {
    constructor() {
        super('eye');
        this.slit_color = 'black';
    }
    render(ctx, cell, size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(cell.x, cell.y, size, size);
        if(size == 1)
            return;
        var half = size/2;
        var x = -(size)/8
        var y = -half;
        var h = size/2 + size/4;
        var w = size/4;
        ctx.translate(cell.x+half, cell.y+half);
        ctx.rotate((cell.cell_owner.getAbsoluteDirection() * 90) * Math.PI / 180);
        ctx.fillStyle = this.slit_color;
        ctx.fillRect(x, y, w, h);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

const CellStates = {
    empty: new Empty(),
    food: new Food(),
    wall: new Wall(),
    mouth: new Mouth(),
    producer: new Producer(),
    mover: new Mover(),
    killer: new Killer(),
    armor: new Armor(),
    eye: new Eye(),
    browse: new Browse(),
    meat: new Meat(),
    woody: new Woody(),
    horn: new Horn(),
    stripe: new Stripe(),
    cache: new Cache(),
    water: new Water(),
    tree: new Tree(),
    defineLists() {
        this.all = [this.empty, this.food, this.wall, this.mouth, this.producer, this.mover, this.killer, this.armor, this.eye,
                    this.browse, this.meat, this.woody, this.horn, this.stripe, this.cache, this.water, this.tree]
        this.living = [this.mouth, this.producer, this.mover, this.killer, this.armor, this.eye,
                       this.woody, this.horn, this.stripe, this.cache, this.tree];
        this.plant_food = [this.food, this.browse];
    },
    isPlantCell(state) {
        return state === this.producer || state === this.woody || state === this.tree;
    },
    isEdible(state) {
        return state === this.food || state === this.browse || state === this.meat;
    },
    getRandomName: function() {
        return this.all[Math.floor(Math.random() * this.all.length)].name;
    },
    getRandomLivingType: function() {
        // cell types listed in Hyperparams.disabledCells cannot arise by mutation (used for ablation runs)
        var options = this.living;
        if (Hyperparams.disabledCells && Hyperparams.disabledCells.length)
            options = this.living.filter(c => Hyperparams.disabledCells.indexOf(c.name) < 0);
        return options[Math.floor(Math.random() * options.length)];
    }
}

CellStates.defineLists();

module.exports = CellStates;
