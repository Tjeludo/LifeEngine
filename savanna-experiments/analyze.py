# Builds charts and summary tables from every run in output/.
#   python analyze.py            -> output/charts/*, output/summary.csv, output/summary.md
# Classification follows the evidence rules from our Assignment 3 submission: a collapse only counts as a
# suicide candidate if the lineage first grew, a trait changed, its resource fell, and starvation (not
# predation) dominated the decline. Anything else is failure to adapt, predation, or unresolved.
import csv, json, os, glob, statistics
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'output')
CH = os.path.join(OUT, 'charts')
os.makedirs(CH, exist_ok=True)

COL = {'zebra': '#2b2b2b', 'rhino': '#7a5c3e', 'leopard': '#d97706', 'grass': '#16a34a', 'bush': '#4d7c0f',
       'tree': '#78350f', 'food': '#2563eb', 'browse': '#7c3aed', 'meat': '#b91c1c'}
ANIMALS = ['zebra', 'rhino', 'leopard']


def load(d):
    rows = list(csv.DictReader(open(os.path.join(d, 'log.csv'))))
    for r in rows:
        for k, v in r.items():
            try: r[k] = float(v)
            except: pass
    ev = json.load(open(os.path.join(d, 'events.json')))
    return rows, ev


def col(rows, k):
    return [r.get(k, 0) or 0 for r in rows]


def deaths(rows, lin, i0=0, i1=None):
    out = {}
    for r in rows[i0:i1]:
        for cause in ['age', 'attack', 'starvation', 'grazed', 'trampled', 'gored', 'fire', 'other']:
            out[cause] = out.get(cause, 0) + (r.get(f'{lin}_death_{cause}', 0) or 0)
    return out


def classify(rows, lin, ev, start_n):
    """Returns (outcome, details) for one animal lineage in one run."""
    n = col(rows, lin)
    t = col(rows, 'tick')
    ext = next((e['tick'] for e in ev['events'] if e['lineage'] == lin and e['event'] == 'extinct'), None)
    peak = max(n) if n else 0
    ip = n.index(peak) if n else 0
    det = {'start': start_n, 'peak': int(peak), 'peak_tick': int(t[ip]) if t else 0, 'final': int(n[-1]) if n else 0,
           'extinct_tick': ext}
    if lin == 'zebra':
        m = col(rows, 'zebra_mouths')
        det['mouths_start'] = m[0]
        det['mouths_max'] = max(m)
        det['mouths_at_peak'] = m[ip]
    if ext is None and (n and n[-1] > 0):
        return 'persisted', det
    iext = next((i for i, x in enumerate(t) if x >= ext), len(t) - 1) if ext else len(t) - 1
    grew = peak >= 1.5 * max(start_n, 1)
    # decline phase = from the peak to extinction
    d = deaths(rows, lin, ip, iext + 1)
    det['decline_deaths'] = d
    attack = d.get('attack', 0) + d.get('gored', 0)
    by_leopard = sum(r.get(f'leopard_kills_{lin}', 0) or 0 for r in rows[ip:iext + 1])
    self_kills = sum(r.get(f'{lin}_kills_{lin}', 0) or 0 for r in rows[ip:iext + 1]) if lin == 'zebra' else 0
    killer_rise = max(col(rows, f'{lin}_killer_frac')[:iext + 1] or [0]) - (rows[0].get(f'{lin}_killer_frac', 0) or 0)
    det['killer_frac_rise'] = round(killer_rise, 2)
    # killings by the lineage's own evolved killers count as self-inflicted, not predation
    if lin != 'leopard' and killer_rise >= 0.3:
        other_kills = by_leopard
    else:
        other_kills = max(by_leopard, attack - self_kills)
    self_caused = d.get('starvation', 0) + d.get('age', 0) + (attack - other_kills)
    det['killed_by_other_lineages'], det['self_caused_deaths'] = other_kills, self_caused
    plants = [a + b for a, b in zip(col(rows, 'grass'), col(rows, 'bush'))]
    food_fell = plants[iext] < 0.75 * plants[ip] if plants[ip] else False
    det['plants_at_peak'], det['plants_at_end'] = int(plants[ip]), int(plants[iext])
    if lin == 'leopard':
        z = col(rows, 'zebra')
        prey_fell = z[iext] < 0.7 * max(z[:ip + 1]) if ip < len(z) else False
        det['prey_fell'] = prey_fell
        if grew and prey_fell: return 'boom-bust: over-predation', det
        if grew: return 'boom-bust: cohort aged out', det
        return 'failure to adapt', det
    m = col(rows, f'{lin}_mouths')
    mouth_rise = max(m[:iext + 1] or [0]) - m[0]
    horn = lin == 'rhino' and (rows[ip].get('rhino_horn_frac', 0) or 0) > 0.5 and (rows[0].get('rhino_horn_frac', 0) or 0) > 0
    trait = mouth_rise >= 0.4 or killer_rise >= 0.3
    det['mouth_rise'] = round(mouth_rise, 2)
    det['suicide_evidence'] = {'grew': grew, 'trait_spread': trait, 'plants_fell': food_fell, 'self_caused_decline': self_caused > other_kills}
    score = sum(det['suicide_evidence'].values())
    if score == 4: return 'evolutionary suicide (all 4 criteria)', det
    if score == 3 and grew and trait: return 'suicide candidate (3 of 4)', det
    if other_kills > self_caused: return 'collapse under predation', det
    if not grew: return 'failure to adapt', det
    return 'boom then collapse, no trait (unresolved)', det
    return 'extinct', det


def run_chart(d, rows, ev, title):
    t = [x / 1000 for x in col(rows, 'tick')]
    fig, ax = plt.subplots(2, 2, figsize=(12, 7.5))
    a = ax[0][0]
    for k in ANIMALS:
        a.plot(t, col(rows, k), color=COL[k], label=k, lw=1.6)
    a.set_title('Animal populations'); a.set_xlabel('tick (thousands)'); a.legend(); a.grid(alpha=.3)
    a = ax[0][1]
    for k in ['grass', 'bush', 'tree']:
        a.plot(t, col(rows, k), color=COL[k], label=k + ' plants', lw=1.4)
    a2 = a.twinx()
    for k in ['food', 'browse']:
        a2.plot(t, col(rows, k), color=COL[k], label=k + ' cells', lw=1, ls='--')
    a.set_title('Producers and food'); a.set_xlabel('tick (thousands)'); a.grid(alpha=.3)
    h1, l1 = a.get_legend_handles_labels(); h2, l2 = a2.get_legend_handles_labels(); a.legend(h1 + h2, l1 + l2, fontsize=8)
    a = ax[1][0]
    a.plot(t, col(rows, 'zebra_mouths'), color=COL['zebra'], label='mouths per zebra')
    a.plot(t, col(rows, 'zebra_cells'), color='#64748b', label='cells per zebra', ls=':')
    if any(col(rows, 'zebra_n_eye')):
        a.plot(t, col(rows, 'zebra_n_eye'), color='#0ea5e9', label='eyes per zebra', lw=1)
    a.set_ylabel('count')
    a3 = a.twinx()
    a3.plot(t, col(rows, 'zebra_stripe_frac'), color='#9ca3af', label='zebras with stripes')
    a3.plot(t, col(rows, 'rhino_horn_frac'), color=COL['rhino'], label='rhinos with horn')
    a3.plot(t, col(rows, 'leopard_cache_frac'), color=COL['leopard'], label='leopards with cache')
    a3.plot(t, col(rows, 'zebra_killer_frac'), color='#db2777', label='zebras with killer cell', ls='--')
    a3.set_ylim(-0.05, 1.05); a3.set_ylabel('fraction')
    h1, l1 = a.get_legend_handles_labels(); h2, l2 = a3.get_legend_handles_labels(); a.legend(h1 + h2, l1 + l2, fontsize=8)
    a.set_title('Traits'); a.set_xlabel('tick (thousands)'); a.grid(alpha=.3)
    a = ax[1][1]
    causes = ['age', 'starvation', 'attack', 'gored', 'grazed', 'fire']
    for k, c in zip(ANIMALS, ['-', '--', ':']):
        for cause, colr in zip(['starvation', 'attack'], ['#dc2626', '#1d4ed8']):
            ys = col(rows, f'{k}_death_{cause}')
            if sum(ys) > 0:
                a.plot(t, ys, ls=c, color=colr, label=f'{k} {cause}', lw=1)
    a.set_title('Deaths per 100 ticks (red = starvation, blue = killed)'); a.set_xlabel('tick (thousands)'); a.legend(fontsize=7); a.grid(alpha=.3)
    fig.suptitle(title)
    fig.tight_layout()
    rel = os.path.relpath(d, OUT).replace(os.sep, '_')
    p = os.path.join(CH, rel + '.png')
    fig.savefig(p, dpi=110)
    plt.close(fig)
    return p


def main():
    summary = []
    for f in sorted(glob.glob(os.path.join(OUT, '*', '*', 'events.json'))):
        d = os.path.dirname(f)
        try:
            rows, ev = load(d)
        except Exception as e:
            print('skip', d, e); continue
        group = os.path.basename(os.path.dirname(d))
        name = os.path.basename(d)
        run_chart(d, rows, ev, f'{group}/{name}')
        rec = {'group': group, 'run': name, 'condition': name.rsplit('-', 1)[0], 'seed': name.rsplit('-', 1)[1],
               'ticks': int(rows[-1]['tick']), 'fires': len([e for e in ev['events'] if e['event'] == 'fire'])}
        for lin in ANIMALS:
            start = int(rows[0].get(lin, 0) or 0)
            if start == 0:
                rec[lin] = 'not seeded'; continue
            out, det = classify(rows, lin, ev, start)
            rec[lin] = out
            rec[lin + '_peak'] = det['peak']; rec[lin + '_peak_tick'] = det['peak_tick']
            rec[lin + '_extinct_tick'] = det['extinct_tick']; rec[lin + '_final'] = det['final']
            if lin == 'zebra':
                rec['zebra_mouths_max'] = round(det['mouths_max'], 2)
                if 'suicide_evidence' in det: rec['zebra_evidence'] = det['suicide_evidence']
        for k in ['grass', 'bush', 'tree']:
            rec[k + '_final'] = int(rows[-1].get(k, 0) or 0)
        rec['zebra_mouths_final'] = rows[-1].get('zebra_mouths', 0)
        summary.append(rec)
    keys = []
    for r in summary:
        for k in r:
            if k not in keys: keys.append(k)
    with open(os.path.join(OUT, 'summary.csv'), 'w', newline='') as fh:
        w = csv.DictWriter(fh, keys); w.writeheader(); [w.writerow(r) for r in summary]
    json.dump(summary, open(os.path.join(OUT, 'summary.json'), 'w'), indent=1, default=str)

    # condition-level table and comparison chart
    conds = {}
    for r in summary:
        conds.setdefault((r['group'], r['condition']), []).append(r)
    lines = ['| group | condition | seeds | zebra outcomes | rhino outcomes | leopard outcomes | max zebra mouths (mean) |', '|---|---|---|---|---|---|---|']
    comp = []
    for (g, c), rs in sorted(conds.items()):
        def tally(lin):
            cnt = {}
            for r in rs: cnt[r.get(lin, '?')] = cnt.get(r.get(lin, '?'), 0) + 1
            return '; '.join(f'{k} x{v}' for k, v in cnt.items())
        mm = [r.get('zebra_mouths_max', 0) or 0 for r in rs]
        lines.append(f'| {g} | {c} | {len(rs)} | {tally("zebra")} | {tally("rhino")} | {tally("leopard")} | {statistics.mean(mm):.2f} |')
        ext = lambda lin: sum(1 for r in rs if r.get(lin) not in ('persisted', 'not seeded')) / len(rs)
        comp.append((g, c, ext('zebra'), ext('rhino'), ext('leopard'), statistics.mean(mm)))
    open(os.path.join(OUT, 'summary.md'), 'w').write('\n'.join(lines) + '\n')

    ref = [x for x in comp if x[0] == 'main']
    for g in sorted(set(x[0] for x in comp)):
        items = [x for x in comp if x[0] == g]
        if g in ('ablation', 'sweep') and ref:
            items = [('main', 'full design (ref)') + ref[0][2:]] + items
        fig, ax = plt.subplots(figsize=(max(7, len(items) * 0.9), 4.2))
        xs = range(len(items)); w = 0.27
        for j, (lin, idx) in enumerate([('zebra', 2), ('rhino', 3), ('leopard', 4)]):
            ax.bar([x + (j - 1) * w for x in xs], [it[idx] for it in items], w, color=COL[lin], label=lin)
        ax.set_xticks(list(xs)); ax.set_xticklabels([it[1] for it in items], rotation=35, ha='right', fontsize=8)
        ax.set_ylabel('fraction of seeds extinct'); ax.set_ylim(0, 1.05); ax.legend(); ax.set_title(f'{g}: extinction frequency by condition')
        fig.tight_layout(); fig.savefig(os.path.join(CH, f'compare_{g}.png'), dpi=110); plt.close(fig)

    # main runs overlay
    mains = [r for r in summary if r['group'] == 'main']
    if mains:
        fig, ax = plt.subplots(1, 3, figsize=(15, 4))
        for r in mains:
            rows, _ = load(os.path.join(OUT, 'main', r['run']))
            t = [x / 1000 for x in col(rows, 'tick')]
            for a, lin in zip(ax, ANIMALS):
                a.plot(t, col(rows, lin), lw=1, label='seed ' + r['seed'])
        for a, lin in zip(ax, ANIMALS):
            a.set_title(f'{lin} population, all main seeds'); a.set_xlabel('tick (thousands)'); a.grid(alpha=.3)
        ax[0].legend(fontsize=8)
        fig.tight_layout(); fig.savefig(os.path.join(CH, 'main_overlay.png'), dpi=110); plt.close(fig)
    print(len(summary), 'runs summarised')


if __name__ == '__main__':
    main()
