# Builds a tick-by-tick observation log for runs that saved frames:
#   python obs_log.py  -> output/observation-log.md
# For every saved frame it records the logged state at that tick, what changed since the previous
# frame, and the events (collapses, extinctions, fires) in between.
import csv, json, os, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'output')


def num(x):
    try: return float(x)
    except: return 0.0


def state(r):
    return {k: num(r.get(k)) for k in ['zebra', 'rhino', 'leopard', 'grass', 'bush', 'tree', 'food', 'browse', 'meat',
                                       'mean_water', 'zebra_mouths', 'zebra_killer_frac', 'zebra_stripe_frac',
                                       'rhino_horn_frac', 'leopard_cache_frac', 'leopard_cache_store', 'shannon']}


def describe(s, prev):
    parts = [f"zebra {int(s['zebra'])}, rhino {int(s['rhino'])}, leopard {int(s['leopard'])}",
             f"grass {int(s['grass'])}, bush {int(s['bush'])}" + (f", tree {int(s['tree'])}" if s['tree'] else ''),
             f"food cells {int(s['food'])}" + (f", browse {int(s['browse'])}" if s['browse'] else ''),
             f"mouths/zebra {s['zebra_mouths']:.2f}"]
    if s['zebra_killer_frac']: parts.append(f"zebras with killer {s['zebra_killer_frac']:.0%}")
    if s['zebra_stripe_frac']: parts.append(f"striped {s['zebra_stripe_frac']:.0%}")
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


def main():
    lines = ['# Observation log', '',
             'Generated from the logger (every 100 ticks) at each saved screenshot. Paths are relative to `savanna-experiments/output/`.', '']
    for group in ['base', 'main', 'mech', 'extra']:
        for d in sorted(glob.glob(os.path.join(OUT, group, '*'))):
            if not os.path.exists(os.path.join(d, 'log.csv')):
                continue
            rows = list(csv.DictReader(open(os.path.join(d, 'log.csv'))))
            by_tick = {int(num(r['tick'])): r for r in rows}
            ev = json.load(open(os.path.join(d, 'events.json')))
            frames = sorted(glob.glob(os.path.join(d, '*.png')), key=lambda p: int(os.path.basename(p).split('-')[1].split('.')[0]))
            rel = os.path.relpath(d, OUT).replace(os.sep, '/')
            lines += [f'## {rel}', '', '| tick | screenshot | state | events since previous frame |', '|---|---|---|---|']
            prev, prev_t = None, -1
            for f in frames:
                t = int(os.path.basename(f).split('-')[1].split('.')[0])
                near = max([k for k in by_tick if k <= t] or [0])
                s = state(by_tick[near])
                evs = [e for e in ev['events'] if prev_t < e['tick'] <= t]
                fires = [e for e in evs if e['event'] == 'fire']
                other = [f"{e['lineage']} {e['event']} at {e['tick']} (peak {e.get('peak')} at {e.get('peak_tick')})" for e in evs if e['event'] != 'fire']
                if fires: other.append(f"{len(fires)} fire(s), {sum(e['burnt'] for e in fires)} cells burnt")
                lines.append(f"| {t} | `{rel}/{os.path.basename(f)}` | {describe(s, prev)} | {'; '.join(other) or '-'} |")
                prev, prev_t = s, t
            if ev.get('all_animals_extinct_at') is not None:
                lines.append(f"\nAll animals extinct at tick {ev['all_animals_extinct_at']}.")
            lines.append('')
    open(os.path.join(OUT, 'observation-log.md'), 'w', encoding='utf8').write('\n'.join(lines))
    print('written')


if __name__ == '__main__':
    main()
