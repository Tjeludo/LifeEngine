const CellStates = require("../Organism/Cell/CellStates");

// Ecological logger. Every `interval` ticks it records population per lineage (the seeded species
// an organism descends from), producer and food abundance, soil water, trait frequencies, and the
// births and deaths (with cause) since the last record. It only observes; it changes nothing.
class EcoStats {
    constructor(env) {
        this.env = env;
        this.interval = 100;
        this.collapse_threshold = 3;
        this.clear();
    }

    clear() {
        this.rows = [];
        this.events = [];
        this.peaks = {};
        this.resetCounters();
    }

    resetCounters() {
        this.births = {};
        this.deaths = {};
        this.cache_withdrawals = 0;
        this.kills = {};
        this.fires = 0;
        this.burnt = 0;
    }

    recordKill(killer, prey) {
        let k = this.key(killer) + '_kills_' + this.key(prey);
        this.kills[k] = (this.kills[k] || 0) + 1;
    }

    key(org) {
        return org.lineage || 'unnamed';
    }

    recordBirth(org) {
        let k = this.key(org);
        this.births[k] = (this.births[k] || 0) + 1;
    }

    recordDeath(org) {
        let k = this.key(org);
        let cause = org.lifetime > org.lifespan() ? 'age' : (org.last_harm || 'other');
        if (!this.deaths[k]) this.deaths[k] = {};
        this.deaths[k][cause] = (this.deaths[k][cause] || 0) + 1;
    }

    tick() {
        if (this.env.total_ticks % this.interval == 0)
            this.record();
    }

    record() {
        let env = this.env;
        let row = {tick: env.total_ticks};
        let groups = {};
        for (let org of env.organisms) {
            if (!org.living) continue;
            let k = this.key(org);
            if (!groups[k]) groups[k] = {n:0, cells:0, mouths:0, stripe:0, horn:0, cache:0, killer:0, cache_store:0, food:0, mover:0};
            let g = groups[k];
            g.n++;
            g.cells += org.anatomy.cells.length;
            g.food += org.food_collected;
            g.cache_store += org.cache;
            for (let c of org.anatomy.cells) {
                if (c.state == CellStates.mouth) g.mouths++;
                g['n_' + c.state.name] = (g['n_' + c.state.name] || 0) + 1;
            }
            if (org.anatomy.has_stripe) g.stripe++;
            if (org.anatomy.has_horn) g.horn++;
            if (org.anatomy.has_cache) g.cache++;
            if (org.anatomy.has_killer) g.killer++;
            if (org.anatomy.is_mover) g.mover++;
        }
        for (let k of ['zebra', 'rhino', 'leopard', 'grass', 'bush', 'tree']) {
            if (!groups[k]) groups[k] = {n:0, cells:0, mouths:0, stripe:0, horn:0, cache:0, killer:0, cache_store:0, food:0};
        }
        for (let k in groups) {
            let g = groups[k];
            row[k] = g.n;
            row[k+'_cells'] = g.n ? +(g.cells/g.n).toFixed(2) : 0;
            row[k+'_mouths'] = g.n ? +(g.mouths/g.n).toFixed(2) : 0;
            row[k+'_stripe_frac'] = g.n ? +(g.stripe/g.n).toFixed(2) : 0;
            row[k+'_horn_frac'] = g.n ? +(g.horn/g.n).toFixed(2) : 0;
            row[k+'_cache_frac'] = g.n ? +(g.cache/g.n).toFixed(2) : 0;
            row[k+'_killer_frac'] = g.n ? +(g.killer/g.n).toFixed(2) : 0;
            row[k+'_mover_frac'] = g.n ? +((g.mover||0)/g.n).toFixed(2) : 0;
            row[k+'_cache_store'] = g.n ? +(g.cache_store/g.n).toFixed(2) : 0;
            for (let st of ['eye', 'mover', 'killer', 'armor', 'stripe'])
                row[k+'_n_'+st] = g.n ? +((g['n_'+st] || 0)/g.n).toFixed(2) : 0;
            row[k+'_births'] = this.births[k] || 0;
            let d = this.deaths[k] || {};
            for (let cause of ['age', 'attack', 'starvation', 'grazed', 'trampled', 'gored', 'fire', 'other'])
                row[k+'_death_'+cause] = d[cause] || 0;
            this.trackPeak(k, g.n, env.total_ticks);
        }
        let food=0, browse=0, meat=0, water=0, cells=0;
        for (let col of env.grid_map.grid) {
            for (let cell of col) {
                if (cell.state === CellStates.food) food++;
                else if (cell.state === CellStates.browse) browse++;
                else if (cell.state === CellStates.meat) meat++;
                water += cell.water || 0;
                cells++;
            }
        }
        row.food = food;
        row.browse = browse;
        row.meat = meat;
        row.mean_water = +(water / cells).toFixed(3);
        row.cache_withdrawals = this.cache_withdrawals;
        row.kills = Object.values(this.kills).reduce((a, b) => a + b, 0);
        for (let k of ['leopard_kills_zebra', 'leopard_kills_rhino', 'zebra_kills_leopard', 'rhino_kills_leopard', 'zebra_kills_zebra',
                       'zebra_kills_rhino', 'rhino_kills_zebra', 'rhino_kills_rhino', 'leopard_kills_leopard'])
            row[k] = this.kills[k] || 0;
        row.fires = this.fires;
        row.burnt = this.burnt;
        // Shannon diversity over extant species (morphological species, not lineages)
        let pops = Object.values(require("./FossilRecord").extant_species).map(s => s.population).filter(p => p > 0);
        let tot = pops.reduce((a, b) => a + b, 0);
        row.shannon = tot ? +(-pops.reduce((h, p) => h + (p/tot) * Math.log(p/tot), 0)).toFixed(3) : 0;
        row.species = Object.keys(require("./FossilRecord").extant_species).length;
        this.rows.push(row);
        this.resetCounters();
    }

    // Logs a lineage's population peak, and when it later falls below the collapse threshold or to zero
    trackPeak(k, n, tick) {
        let p = this.peaks[k];
        if (!p) p = this.peaks[k] = {peak: n, peak_tick: tick, collapsed: false, extinct: false};
        if (n > p.peak) {
            p.peak = n; p.peak_tick = tick; p.collapsed = false;
        }
        if (!p.collapsed && p.peak >= 3*this.collapse_threshold && n < this.collapse_threshold) {
            p.collapsed = true;
            this.events.push({tick, lineage: k, event: 'collapse', peak: p.peak, peak_tick: p.peak_tick});
        }
        if (!p.extinct && n == 0 && p.peak > 0) {
            p.extinct = true;
            this.events.push({tick, lineage: k, event: 'extinct', peak: p.peak, peak_tick: p.peak_tick});
        }
        if (n > 0) p.extinct = false;
    }

    latest() {
        return this.rows.length ? this.rows[this.rows.length-1] : null;
    }

    toCSV() {
        if (!this.rows.length) return '';
        let cols = [];
        for (let r of this.rows)
            for (let k in r)
                if (cols.indexOf(k) < 0) cols.push(k);
        let lines = [cols.join(',')];
        for (let r of this.rows)
            lines.push(cols.map(c => r[c] === undefined ? 0 : r[c]).join(','));
        return lines.join('\n');
    }
}

module.exports = EcoStats;
