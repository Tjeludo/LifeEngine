# Builds the observation log:  python obs_log.py  -> output/observation-log.md
# The log follows the project's story:
#   Part 1  base engine: what it can and cannot do, how we tried to get suicide or failure to adapt,
#           what each condition did (screenshot by screenshot), and why
#   Part 2  modified engine: what we changed and which base limit each change answers, then whether we
#           achieved suicide or failure to adapt, and why not
# Every state line is read from the logger (every 100 ticks) at the tick of a saved screenshot.
import csv, json, os, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'output')


def num(x):
    try: return float(x)
    except: return 0.0


def state(r):
    return {k: num(r.get(k)) for k in ['zebra', 'rhino', 'leopard', 'grass', 'bush', 'tree', 'food', 'browse', 'meat',
                                       'mean_water', 'zebra_mouths', 'zebra_killer_frac', 'zebra_stripe_frac', 'zebra_n_eye',
                                       'rhino_horn_frac', 'rhino_killer_frac', 'leopard_cache_frac', 'leopard_cache_store']}


def describe(s, prev, modified):
    parts = [f"zebra {int(s['zebra'])}, rhino {int(s['rhino'])}, leopard {int(s['leopard'])}",
             f"grass {int(s['grass'])}, bush {int(s['bush'])}" + (f", tree {int(s['tree'])}" if s['tree'] else ''),
             f"food cells {int(s['food'])}" + (f", browse {int(s['browse'])}" if s['browse'] else ''),
             f"mouths/zebra {s['zebra_mouths']:.2f}"]
    if s['zebra_killer_frac']: parts.append(f"zebras with killer {s['zebra_killer_frac']:.0%}")
    if s['rhino_killer_frac']: parts.append(f"rhinos with killer {s['rhino_killer_frac']:.0%}")
    if modified:
        if s['zebra_stripe_frac']: parts.append(f"striped {s['zebra_stripe_frac']:.0%}")
        if s['zebra_n_eye']: parts.append(f"eyes/zebra {s['zebra_n_eye']:.2f}")
        if s['rhino_horn_frac']: parts.append(f"horned rhinos {s['rhino_horn_frac']:.0%}")
        if s['leopard_cache_frac']: parts.append(f"leopards with cache {s['leopard_cache_frac']:.0%}")
        if s['mean_water']: parts.append(f"soil water {s['mean_water']:.2f}")
    txt = '; '.join(parts)
    if prev:
        ch = []
        for k in ['zebra', 'rhino', 'leopard', 'grass', 'bush', 'tree']:
            d = s[k] - prev[k]
            if prev[k] and abs(d) >= max(3, 0.25 * prev[k]):
                ch.append(f"{k} {'+' if d > 0 else ''}{int(d)} ({d / prev[k]:+.0%})")
            elif not prev[k] and s[k]:
                ch.append(f"{k} appears")
        if ch: txt += '. Change since last frame: ' + ', '.join(ch)
    return txt


def why(rows, ev, lin):
    """One line explaining a lineage's fate from the logged numbers."""
    n = [num(r.get(lin)) for r in rows]
    if not n or n[0] == 0:
        return None
    t = [num(r['tick']) for r in rows]
    ext = next((e['tick'] for e in ev['events'] if e['lineage'] == lin and e['event'] == 'extinct'), None)
    peak = max(n); ip = n.index(peak)
    iend = next((i for i, x in enumerate(t) if ext and x >= ext), len(t) - 1)
    deaths = {}
    for r in rows[ip:iend + 1]:
        for c in ['age', 'starvation', 'attack', 'gored', 'grazed', 'fire']:
            deaths[c] = deaths.get(c, 0) + num(r.get(f'{lin}_death_{c}'))
    main_cause = max(deaths, key=deaths.get) if any(deaths.values()) else 'none'
    plants = [num(r.get('grass')) + num(r.get('bush')) for r in rows]
    bits = [f"{int(n[0])} -> peak {int(peak)} at tick {int(t[ip])}"]
    bits.append(f"extinct at tick {int(ext)}" if ext else f"{int(n[-1])} alive at the end")
    kr = max(num(r.get(f'{lin}_killer_frac')) for r in rows[:iend + 1]) - num(rows[0].get(f'{lin}_killer_frac'))
    mr = max(num(r.get(f'{lin}_mouths')) for r in rows[:iend + 1]) - num(rows[0].get(f'{lin}_mouths'))
    if kr >= 0.3: bits.append(f"share with a killer cell rose by {kr:.0%}")
    if mr >= 0.4: bits.append(f"mouths per animal rose by {mr:.2f}")
    if ext and plants[ip]:
        bits.append(f"food plants {int(plants[ip])} at the peak -> {int(plants[iend])} at extinction")
    if ext:
        bits.append(f"main cause of death after the peak: {main_cause} ({int(deaths[main_cause])})")
    return '; '.join(bits)


def run_section(d, modified, lines, summary):
    rows = list(csv.DictReader(open(os.path.join(d, 'log.csv'))))
    by_tick = {int(num(r['tick'])): r for r in rows}
    ev = json.load(open(os.path.join(d, 'events.json')))
    rel = os.path.relpath(d, OUT).replace(os.sep, '/')
    rec = summary.get(rel, {})
    lines += [f'#### {rel}', '']
    for lin in ['zebra', 'rhino', 'leopard']:
        w = why(rows, ev, lin)
        if w:
            lines.append(f"- **{lin}: {rec.get(lin, '?')}.** {w}.")
    lines += ['', '| tick | screenshot | state | events since previous frame |', '|---|---|---|---|']
    frames = sorted(glob.glob(os.path.join(d, '*.png')), key=lambda p: int(os.path.basename(p).split('-')[1].split('.')[0]))
    prev, prev_t = None, -1
    for f in frames:
        t = int(os.path.basename(f).split('-')[1].split('.')[0])
        near = max([k for k in by_tick if k <= t] or [0])
        s = state(by_tick[near])
        evs = [e for e in ev['events'] if prev_t < e['tick'] <= t]
        fires = [e for e in evs if e['event'] == 'fire']
        other = [f"{e['lineage']} {e['event']} at {e['tick']} (peak {e.get('peak')} at {e.get('peak_tick')})" for e in evs if e['event'] != 'fire']
        if fires: other.append(f"{len(fires)} fire(s), {sum(e['burnt'] for e in fires)} cells burnt")
        lines.append(f"| {t} | `{rel}/{os.path.basename(f)}` | {describe(s, prev, modified)} | {'; '.join(other) or '-'} |")
        prev, prev_t = s, t
    lines.append('')


def condition_block(group, cond, purpose, modified, lines, summary):
    runs = sorted(d for d in glob.glob(os.path.join(OUT, group, cond + '-*')) if os.path.exists(os.path.join(d, 'log.csv')))
    if not runs:
        return
    tally = {}
    for d in runs:
        r = summary.get(os.path.relpath(d, OUT).replace(os.sep, '/'), {})
        for lin in ['zebra', 'rhino', 'leopard']:
            tally.setdefault(lin, []).append(r.get(lin, '?'))
    lines += [f'### {cond}', '', f'**What we tried:** {purpose}', '', '**Outcome across seeds:**', '']
    for lin, outs in tally.items():
        counts = {}
        for o in outs: counts[o] = counts.get(o, 0) + 1
        lines.append(f"- {lin}: " + '; '.join(f"{k} x{v}" for k, v in counts.items()))
    lines.append('')
    for d in runs:
        run_section(d, modified, lines, summary)


BASE_LIMITS = """The base engine is the original Life Engine rules (plus our Assignment 2 change that lets plants reproduce from the food they make). None of the new settings are on, and mutation cannot create the new cell types. As the engine's creator explains, an organism needs only one mover cell, and extra movers do not make it faster, so base zebras and leopards have one mover each.

What the base engine allows:
- Killer cells damage anything they touch, plants included, and a dead plant turns into food. A plant-killing trait is therefore rewarded with a meal, while each kill removes a producer for good.
- Uneaten food blocks births, so plants can choke the world.

What it cannot do:
- Nothing starves. Animals die only of old age or killer damage, so scarcity only bites through failure to breed.
- Grass and bush drop identical food, so there is no worse fallback food.
- Leopards can eat plant food and carcasses become plant food, so predators never depend on prey.
- Mouths cannot hurt plants, so grazing cannot deplete them (more grazing frees space and raises production).
- All animals move one cell per tick, so a predator cannot outrun prey."""

BASE_CONDITIONS = [
    ('base-default', 'The original settings as shipped (food production 5, lifespan multiplier 100, food blocks births). Baseline: does anything collapse on its own?'),
    ('base-plantkill-control', 'Route to suicide 1. Zebras start WITHOUT a killer cell; insta-kill is on, killers reach all 8 neighbours and food production is 3. If a killer evolves, each plant it destroys is a meal, so the trait should spread and then remove the producers.'),
    ('base-plantkill', 'Same as route 1 but zebras start WITH the rear killer. The same mechanism, with the trait given rather than evolved.'),
    ('base-harsh', 'Scarcity: food production 2. Does a species fail, or adapt?'),
    ('base-nomut', 'Failure-to-adapt baseline: food production 2 and mutation switched off, so no species can change.'),
    ('base-clog', 'Route to suicide 2. Fast plants (food production 10, growing into all 8 neighbours) with few grazers: can plants choke themselves with their own food?'),
]

BASE_RESULT = """**The base engine destroyed itself through killer cells, every time the kick was present.** In the original engine a killer cell hurts everything it touches: plants, rhinos and the zebra's own herd. In every condition where zebras started with the rear kick (default, harsh, no mutation, seeded plant-kill), all bushes were gone by tick 500-1,500 and all grass by tick 700-6,100, and the zebras died out by tick 2,800-8,000. The seeded plant-kill runs had no leopards at all, so zebra kicks alone were enough. Other zebras' kicks caused 81-100% of zebra deaths in those conditions (leopards 0-10%), and kicks killed most rhinos too (69 of 90 rhino deaths in default seed 1). Because the kick was given at the start rather than evolved, these runs fail our "trait spread" criterion: they show a self-destroying design, not evolutionary suicide.

**Evolutionary suicide did happen when the killer had to evolve.** In the plant-kill control, zebras started without a killer cell. In seed 2 one evolved, spread to 89-100% of the herd, destroyed every bush (by tick 4,900) and every grass plant (by tick 11,700), and the zebras died out at tick 14,005: all four criteria. In seeds 1 and 3 the evolved killers mostly killed other zebras instead of plants. Each carcass became food, food piled up to 5,000-7,400 cells, and because uneaten food blocks births the herd stopped breeding and died out (ticks 28,000 and 11,850) while grass survived. That is a self-made collapse, but it misses the "food plants fell" criterion.

**Failure to adapt:** with mutation switched off, zebras still died out by about tick 5,000 (no change was possible), and leopards in every base condition boomed to 22-35 and died out by tick 1,300, because they could not catch prey moving at their own speed. Clogging (fast plants, few grazers) killed the animals while grass covered the map: an engine artefact of food blocking births.

**Why the base engine cannot test our hypothesis:** zebras cannot overgraze (mouths do not hurt plants), bush food is the same as grass food, nothing starves, and leopards do not need prey. The only road to collapse in the base engine is killer cells, which is why we built the modifications in Part 2."""

MODIFICATIONS = """Each change answers a base-engine limit, and each adds an escape so collapse stays possible but not automatic. All are off by default.

| Base-engine limit | Our change | Who |
| --- | --- | --- |
| Grazing cannot hurt plants | Mouths next to grass damage the plant (2% per tick) | Shared |
| Bush food is the same as grass food | Bushes drop browse worth 0.35 of grass | Shared |
| Nothing starves | Hunger: pay 1 food every 80 ticks, die after 10 misses | Shared |
| Leopards eat plants | Carcasses become meat; jaws (killer beside mouth) digest only meat; leopards eat their kill on the spot | Shared |
| Every animal moves 1 cell per tick (extra movers do nothing in the original engine) | **Our own rule:** each extra mover adds one step per tick, only while chasing or fleeing | Shared |
| Rhinos have nothing special | Horn cell: immune to killers, gores attackers, tramples plants | Vimbai |
| Zebras have no herd defence | Stripe cell: leopards miss striped zebras in a herd (up to 85%) | Moreblessing |
| Predators cannot store energy | Cache cell: banks surplus food near trees, spent when starving | Ashley |
| Plant growth is unlimited | Soil water and fertility; deep-rooted bushes use less water | Shared |
| The map is uniform | River (only 9-cell animals cross), trees (cover and caching sites), fire | Shared |"""

MODIFIED_RESULT = """**Did we achieve evolutionary suicide in the modified engine? No.** Zebras did evolve a second mouth (up to 2.8 mouths per zebra), but grass food never collapsed because of it: water-limited regrowth, the bush fallback and the river refuge kept the trait from removing its own food. Where food did fall (long dry runs), it kept falling after the zebras died, so plant crowding caused it, not grazing. Capping zebras at one mouth made them die out more often, so the trait was adaptive.

**Did we achieve failure to adapt? Yes.** Rhinos failed in every main seed: they bred too slowly (16 food per calf) and died of old age without replacing themselves. Zebra lineages that never evolved the second mouth faded out the same way, with food still on the map.

**What we got instead of suicide:** leopards boomed and crashed every time. With 16 leopards the first generation aged out or was kicked to death before the prey crashed. With 48 leopards they ate every zebra within about 1,300 ticks and then starved, which is ecological over-exploitation set up by the starting density, not an evolved trait."""

MOD_CONDITIONS = [
    ('main', 'full', 'The full modified design for 100,000 ticks: every feature on, 36 zebras, 12 rhinos, 16 leopards, river, trees and fire.'),
    ('mech', 'full', 'Mechanism check with extra logging (cells per zebra), default settings, 40,000 ticks.'),
    ('mech', 'rain-high', 'Mechanism check with double rain, 40,000 ticks.'),
    ('extra', 'long-default', 'Follow-up: the full design for 200,000 ticks, to give overgrazing more time.'),
    ('extra', 'long-dry', 'Follow-up: 200,000 ticks with 40% of normal rain, to make regrowth slower than grazing.'),
    ('extra', 'leopards32', 'Follow-up: twice the starting leopards, to see if a denser predator persists.'),
    ('extra', 'leopards48', 'Follow-up: three times the starting leopards.'),
    ('extra', 'fire-strong', 'Follow-up: 5 times the fire chance with full spread.'),
    ('extra', 'fire-extreme', 'Follow-up: 10 times the fire chance.'),
]


def main():
    summary = {}
    sp = os.path.join(OUT, 'summary.json')
    if os.path.exists(sp):
        for r in json.load(open(sp)):
            summary[f"{r['group']}/{r['run']}"] = r
    lines = ['# Observation log', '',
             'Every state line below is read from the logger at the tick of a saved screenshot. Screenshot paths are relative to `savanna-experiments/output/`. Ablations and sweeps (40,000 ticks, 3 seeds each) are summarised in `summary.md`; their screenshots are in `output/ablation/` and `output/sweep/`.', '',
             '## Part 1: base engine', '', '### What the base engine can and cannot do', '', BASE_LIMITS, '',
             '### How we tried to get suicide or failure to adapt', '', '| Condition | Aim |', '| --- | --- |']
    lines += [f'| {c} | {p} |' for c, p in BASE_CONDITIONS]
    lines += ['', '### What happened in each condition', '']
    for c, p in BASE_CONDITIONS:
        condition_block('base', c, p, False, lines, summary)
    lines += ['### What the base runs showed, and why', '', BASE_RESULT, '']
    lines += ['## Part 2: modified engine', '', '### What we changed and why', '', MODIFICATIONS, '',
              '### Did we achieve it?', '', MODIFIED_RESULT, '', '### What happened in each condition', '']
    for g, c, p in MOD_CONDITIONS:
        condition_block(g, c, p, True, lines, summary)
    open(os.path.join(OUT, 'observation-log.md'), 'w', encoding='utf8').write('\n'.join(lines))
    print('written')


if __name__ == '__main__':
    main()
