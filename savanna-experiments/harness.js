// In-page experiment harness. Load with:
//   var s=document.createElement('script'); s.src='/exp/harness.js'; document.body.appendChild(s);
// It steps the real engine (env.update) as fast as possible, lets EcoStats record every 100 ticks,
// and saves CSV / JSON / PNG frames to savanna-experiments/output via the local server.
// Yield via MessageChannel: unlike setTimeout it is not throttled when the tab is hidden
const _yieldChannel = new MessageChannel();
const _yieldQueue = [];
_yieldChannel.port1.onmessage = () => { const r = _yieldQueue.shift(); if (r) r(); };
const yieldToPage = () => new Promise(r => { _yieldQueue.push(r); _yieldChannel.port2.postMessage(0); });

window.Savanna = {
    env() { return lifeEngine.env; },

    async load(variant, seed, overrides = {}) {
        const H = lifeEngineConfig.Hyperparams;
        lifeEngineConfig.WorldConfig.auto_pause = false; // the harness stops by itself on total extinction
        lifeEngineConfig.WorldConfig.auto_reset = false;
        H.setDefaults();
        const resp = await fetch(`/exp/worlds/savanna-${variant}-${seed}.json`);
        const world = await resp.json();
        lifeEngine.controlpanel.setPaused(true);
        lifeEngine.controlpanel.loadEnv(world);
        lifeEngine.controlpanel.setPaused(true);
        Object.assign(H, overrides);
        this.world = world;
        this.env().eco_stats.record();
        this.env().renderFull();
        return this.env().organisms.length;
    },

    animalsAlive() {
        return this.env().organisms.some(o => o.living && o.anatomy.is_mover);
    },

    step(n) {
        const env = this.env();
        for (let i = 0; i < n; i++) {
            env.update();
            if (env.organisms.length === 0) break;
        }
        env.renderer.cells_to_render.clear();
        return env.eco_stats.latest();
    },

    async post(name, body) {
        for (let attempt = 0; ; attempt++) { // the local server occasionally drops a connection; retry
            try { await fetch('/save/' + name, {method: 'POST', body}); return; }
            catch (e) { if (attempt >= 4) throw e; await new Promise(r => setTimeout(r, 500)); }
        }
    },

    async frame(name) {
        const env = this.env();
        env.renderFull();
        await this.post(name, env.renderer.canvas.toDataURL('image/png'));
    },

    summary() {
        const r = this.env().eco_stats.latest() || {};
        return {tick: r.tick, zebra: r.zebra, rhino: r.rhino, leopard: r.leopard, grass: r.grass, bush: r.bush, tree: r.tree,
                food: r.food, browse: r.browse, water: r.mean_water, zebra_mouths: r.zebra_mouths};
    },

    table(every = 5, cols = ['tick','zebra','rhino','leopard','grass','bush','tree','food','browse','meat','mean_water','zebra_mouths']) {
        return this.env().eco_stats.rows.filter((r, i) => i % every == 0).map(r => cols.map(c => r[c]).join(' '));
    },

    // Starts a queue of trials in the background; poll Savanna.status
    queue(jobs) {
        this.status = {running: true, done: [], current: null, error: null};
        (async () => {
            try {
                for (const j of jobs) {
                    this.status.current = j;
                    const res = await this.trial(j);
                    this.status.done.push(res);
                    await this.post(this.statusFile || 'queue-status.json', JSON.stringify(this.status));
                }
            } catch (e) {
                this.status.error = String(e && e.stack || e);
                await this.post(this.statusFile || 'queue-status.json', JSON.stringify(this.status));
            }
            this.status.running = false;
            this.status.current = null;
            await this.post(this.statusFile || 'queue-status.json', JSON.stringify(this.status));
        })();
        return 'queued ' + jobs.length;
    },

    // One trial. job = {variant, seed, total, frames:[ticks], dir, overrides, eventFrames}
    async trial(job) {
        const {variant, seed, total} = job;
        const frames = job.frames || [];
        await this.load(variant, seed, job.overrides || {});
        const dir = job.dir || `runs/${variant}-${seed}`;
        const stats = this.env().eco_stats;
        const t0 = performance.now();
        if (frames.includes(0)) await this.frame(`${dir}/frame-000000.png`);
        let done = 0, seenEvents = 0, extinctAt = null;
        const stops = frames.filter(f => f > 0 && f < total).concat([total]).sort((a, b) => a - b);
        for (const stop of stops) {
            while (done < stop) {
                // step for ~400 ms at a time, then yield so the page and the server stay responsive
                const until = performance.now() + 400;
                while (done < stop && performance.now() < until) {
                    this.step(Math.min(50, stop - done));
                    done = this.env().total_ticks;
                    if (!this.animalsAlive()) break;
                }
                this.progress = done;
                // capture the world whenever a lineage collapses or goes extinct
                while (job.eventFrames && seenEvents < stats.events.length) {
                    const e = stats.events[seenEvents++];
                    if (e.event === 'collapse' || e.event === 'extinct')
                        await this.frame(`${dir}/event-${String(e.tick).padStart(6, '0')}-${e.lineage}-${e.event}.png`);
                }
                if (!this.animalsAlive()) { extinctAt = done; break; }
                await yieldToPage();
            }
            if (frames.includes(stop) || extinctAt !== null) await this.frame(`${dir}/frame-${String(done).padStart(6, '0')}.png`);
            if (extinctAt !== null) break;
        }
        stats.record();
        await this.post(`${dir}/log.csv`, stats.toCSV());
        const result = {variant, seed, total, overrides: job.overrides || {}, ticks_run: done, all_animals_extinct_at: extinctAt,
                        secs: +((performance.now() - t0) / 1000).toFixed(1), final: this.summary(), events: stats.events, peaks: stats.peaks};
        await this.post(`${dir}/events.json`, JSON.stringify(result, null, 1));
        return {variant, seed, dir, secs: result.secs, final: result.final, extinctAt};
    },

    // Draws each seeded species' body plan as a labelled diagram (PNG) using the engine's colours
    async drawSpecies(variant, seed, prefix) {
        const world = await (await fetch(`/exp/worlds/savanna-${variant}-${seed}.json`)).json();
        const colors = {};
        for (const s of ['mouth','producer','mover','killer','armor','eye','woody','horn','stripe','cache','tree'])
            colors[s] = (el => el ? getComputedStyle(el).backgroundColor : '#888')(document.querySelector('#' + s + '.cell-legend-type'));
        const order = ['zebra', 'rhino', 'leopard', 'grass', 'bush', 'tree'];
        for (const sp of order) {
            const d = world.species_designs[sp];
            if (!d) continue;
            if (sp === 'tree' && !world.organisms.some(o => o.lineage === 'tree')) continue;
            const S = 70, pad = 30;
            const cs = d.cells.map(c => c.loc_col), rs = d.cells.map(c => c.loc_row);
            const minc = Math.min(...cs), maxc = Math.max(...cs), minr = Math.min(...rs), maxr = Math.max(...rs);
            const w = (maxc - minc + 1) * S + pad * 2, h = (maxr - minr + 1) * S + pad * 2 + 40;
            const cv = document.createElement('canvas'); cv.width = Math.max(w, 260); cv.height = h;
            const ctx = cv.getContext('2d');
            ctx.fillStyle = '#0E1318'; ctx.fillRect(0, 0, cv.width, h);
            const ox = (cv.width - (maxc - minc + 1) * S) / 2;
            for (const c of d.cells) {
                const x = ox + (c.loc_col - minc) * S, y = pad + (c.loc_row - minr) * S;
                ctx.fillStyle = colors[c.state.name]; ctx.fillRect(x, y, S - 2, S - 2);
                ctx.fillStyle = ['stripe', 'horn', 'eye'].includes(c.state.name) ? '#111' : '#fff';
                ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(c.state.name, x + S / 2, y + S / 2 + 4);
                if (c.state.name === 'eye') { // slit shows the direction the eye looks
                    ctx.fillStyle = '#0E1318';
                    const dir = c.direction || 0, cx = x + S / 2, cy = y + S / 2;
                    const dx = [0, 1, 0, -1][dir], dy = [-1, 0, 1, 0][dir];
                    ctx.beginPath(); ctx.moveTo(cx + dx * 26, cy + dy * 26); ctx.lineTo(cx + dx * 12 - dy * 6, cy + dy * 12 + dx * 6);
                    ctx.lineTo(cx + dx * 12 + dy * 6, cy + dy * 12 - dx * 6); ctx.fill();
                }
            }
            ctx.fillStyle = '#eee'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(`${sp} (${d.cells.length} cells)`, cv.width / 2, h - 14);
            await this.post(`${prefix}/${sp}.png`, cv.toDataURL('image/png'));
        }
        return 'drawn';
    },
};
'harness ready';
