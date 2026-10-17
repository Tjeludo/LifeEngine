# Builds the report/presentation figures from run outputs:  python make_figures.py
# Writes output/figures/*.png (screenshot timelines with logged state, species sheets, comparison charts).
import csv, json, os
from PIL import Image, ImageDraw, ImageFont
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'output')
FIG = os.path.join(OUT, 'figures')
os.makedirs(FIG, exist_ok=True)


def font(size, bold=False):
    for name in (['arialbd.ttf', 'Arial Bold.ttf'] if bold else ['arial.ttf', 'Arial.ttf']):
        try: return ImageFont.truetype(name, size)
        except OSError: pass
    return ImageFont.load_default()


def rows_of(run):
    rows = list(csv.DictReader(open(os.path.join(OUT, run, 'log.csv'))))
    return {int(float(r['tick'])): r for r in rows}


def at(rows, t):
    k = max([x for x in rows if x <= t] or [0])
    return rows[k]


def timeline(run, frames, out, title, cols=3, extra=lambda r: ''):
    rows = rows_of(run)
    tiles = []
    for fname, label in frames:
        im = Image.open(os.path.join(OUT, run, fname)).convert('RGB')
        t = int(fname.split('-')[1].split('.')[0])
        r = at(rows, t)
        n = lambda k: int(float(r.get(k) or 0))
        cap1 = f'tick {t:,}  {label}'
        cap2 = f'zebra {n("zebra")}  rhino {n("rhino")}  leopard {n("leopard")}  |  grass {n("grass")}  bush {n("bush")}' + (f'  tree {n("tree")}' if n('tree') else '')
        cap3 = extra(r)
        w, h = im.size
        tile = Image.new('RGB', (w, h + 74), 'white')
        tile.paste(im, (0, 74))
        d = ImageDraw.Draw(tile)
        d.text((8, 4), cap1, fill='black', font=font(20, True))
        d.text((8, 30), cap2, fill='#333', font=font(16))
        d.text((8, 52), cap3, fill='#555', font=font(15))
        tiles.append(tile)
    w, h = tiles[0].size
    rws = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * w + (cols + 1) * 12, rws * h + (rws + 1) * 12 + 50), 'white')
    ImageDraw.Draw(sheet).text((12, 10), title, fill='black', font=font(26, True))
    for i, t in enumerate(tiles):
        sheet.paste(t, (12 + (i % cols) * (w + 12), 50 + 12 + (i // cols) * (h + 12)))
    sheet.save(os.path.join(FIG, out), optimize=True)


def species_sheet(folder, names, out, title):
    ims = [Image.open(os.path.join(OUT, 'species', folder, n + '.png')).convert('RGB') for n in names]
    H = max(i.size[1] for i in ims)
    W = sum(i.size[0] for i in ims) + 16 * (len(ims) + 1)
    sheet = Image.new('RGB', (W, H + 70), '#0E1318')
    ImageDraw.Draw(sheet).text((16, 14), title, fill='white', font=font(26, True))
    x = 16
    for i in ims:
        sheet.paste(i, (x, 60 + (H - i.size[1]) // 2)); x += i.size[0] + 16
    sheet.save(os.path.join(FIG, out))


def traits_extra(r):
    f = lambda k: float(r.get(k) or 0)
    s = f'mouths/zebra {f("zebra_mouths"):.2f}'
    if f('zebra_killer_frac'): s += f'  zebras with killer {f("zebra_killer_frac"):.0%}'
    if f('zebra_n_eye'): s += f'  eyes/zebra {f("zebra_n_eye"):.2f}'
    if f('zebra_stripe_frac'): s += f'  striped {f("zebra_stripe_frac"):.0%}'
    return s


species_sheet('base', ['zebra', 'rhino', 'leopard', 'grass', 'bush'], 'species-base.png', 'Base-engine species (original cell types only)')
species_sheet('modified', ['zebra', 'rhino', 'leopard', 'grass', 'bush', 'tree'], 'species-modified.png', 'Modified-engine species (with stripe, horn, cache, woody and tree cells)')

timeline('base/base-plantkill-control-2', [
    ('frame-000000.png', 'seeded: no zebra has a killer'), ('frame-002500.png', 'killer cells spreading'),
    ('event-006000-bush-extinct.png', 'bushes destroyed'), ('frame-010000.png', 'grass being destroyed'),
    ('event-011900-grass-extinct.png', 'last grass gone'), ('event-014100-zebra-collapse.png', 'zebras collapse')],
    'timeline-base-suicide.png', 'Base engine, plant-kill control seed 2: an evolved killer trait destroys the food supply', extra=traits_extra)

timeline('main/full-1', [
    ('frame-000000.png', 'seeded savanna'), ('frame-002500.png', 'leopards peak'), ('event-004400-leopard-extinct.png', 'leopards gone'),
    ('event-012600-rhino-extinct.png', 'rhinos gone'), ('frame-040000.png', 'zebras streamlining'), ('frame-100000.png', 'end of run')],
    'timeline-main-full-1.png', 'Modified engine, main seed 1 (100k ticks): predator boom-bust, rhino failure, zebras adapt', extra=traits_extra)

timeline('main/full-4', [
    ('frame-000000.png', 'seeded savanna'), ('frame-005000.png', 'rhinos collapsing'), ('event-005900-leopard-extinct.png', 'leopards gone'),
    ('frame-020000.png', 'zebras declining'), ('event-055900-zebra-extinct.png', 'zebras extinct'), ('frame-100000.png', 'bush and grass only')],
    'timeline-main-full-4.png', 'Modified engine, main seed 4: zebras fail to adapt and fade out with food still available', extra=traits_extra)

mech = 'mech/full-5'
timeline(mech, [('frame-000000.png', 'seeded'), ('frame-010000.png', ''), ('frame-020000.png', ''), ('frame-040000.png', 'streamlined zebras')],
         'timeline-mech-full-5.png', 'Mechanism check, seed 5: zebras trade eyes, kick and stripes for a second mouth', cols=4, extra=traits_extra)

# trait mechanism chart (eyes vs mouths) from the mechanism runs
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
for run, ls in [('mech/full-5', '-'), ('mech/rain-high-1', '--')]:
    rr = list(csv.DictReader(open(os.path.join(OUT, run, 'log.csv'))))
    t = [float(r['tick']) / 1000 for r in rr]
    g = lambda k: [float(r.get(k) or 0) for r in rr]
    ax[0].plot(t, g('zebra_mouths'), ls=ls, color='#111', label=f'mouths ({run.split("/")[1]})')
    ax[0].plot(t, g('zebra_n_eye'), ls=ls, color='#0ea5e9', label=f'eyes ({run.split("/")[1]})')
    ax[0].plot(t, g('zebra_n_stripe'), ls=ls, color='#9ca3af', label=f'stripes ({run.split("/")[1]})')
    ax[1].plot(t, g('zebra'), ls=ls, color='#111', label=f'zebras ({run.split("/")[1]})')
    ax[1].plot(t, g('leopard'), ls=ls, color='#d97706', label=f'leopards ({run.split("/")[1]})')
ax[0].set_title('Cells per zebra'); ax[1].set_title('Population')
for a in ax: a.set_xlabel('tick (thousands)'); a.grid(alpha=.3); a.legend(fontsize=8)
fig.tight_layout(); fig.savefig(os.path.join(FIG, 'mechanism-traits.png'), dpi=120); plt.close(fig)

# 40k comparison: zebra survival at tick 40k and leopard persistence, reference = main runs truncated at 40k
S = json.load(open(os.path.join(OUT, 'summary.json')))
def alive40(r):
    e = r.get('zebra_extinct_tick')
    return 0 if (e and float(e) <= 40000) else 1
conds = {}
for r in S:
    if r['group'] in ('main', 'ablation', 'sweep'):
        conds.setdefault((r['group'], r['condition']), []).append(r)
order = [('main', 'full')] + sorted(k for k in conds if k[0] == 'ablation') + sorted(k for k in conds if k[0] == 'sweep')
labels, zs, lext, mm = [], [], [], []
for k in order:
    rs = conds[k]
    labels.append('FULL DESIGN' if k[0] == 'main' else k[1])
    zs.append(sum(alive40(r) for r in rs) / len(rs))
    lt = [float(r['leopard_extinct_tick']) / 1000 for r in rs if r.get('leopard_extinct_tick')]
    lext.append(sum(lt) / len(lt) if lt else 0)
    mm.append(sum(float(r.get('zebra_mouths_max') or 0) for r in rs) / len(rs))
fig, ax = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
x = range(len(labels))
colors = ['#d97706' if l == 'FULL DESIGN' else ('#475569' if i <= 10 else '#16a34a') for i, l in enumerate(labels)]
ax[0].bar(x, zs, color=colors); ax[0].set_ylabel('zebra lineages\nalive at 40k'); ax[0].set_ylim(0, 1.05)
ax[1].bar(x, lext, color=colors); ax[1].set_ylabel('leopard extinction\n(thousand ticks)')
ax[2].bar(x, mm, color=colors); ax[2].set_ylabel('max mouths\nper zebra'); ax[2].axhline(1, color='#999', lw=.8)
ax[2].set_xticks(list(x)); ax[2].set_xticklabels(labels, rotation=40, ha='right', fontsize=9)
ax[0].set_title('Ablations (grey) and sweeps (green) against the full design (orange), 3 seeds each, 5 for the full design')
for a in ax: a.grid(axis='y', alpha=.3)
fig.tight_layout(); fig.savefig(os.path.join(FIG, 'comparison-40k.png'), dpi=120); plt.close(fig)
print('figures written to', FIG)

# ---- follow-up runs ----
if os.path.exists(os.path.join(OUT, 'extra', 'leopards48-1')):
    timeline('extra/leopards48-1', [
        ('frame-000000.png', '48 leopards seeded'), ('event-000500-zebra-collapse.png', 'herd eaten'), ('event-001300-zebra-extinct.png', 'last zebra'),
        ('event-003800-leopard-extinct.png', 'leopards starve'), ('frame-020000.png', 'rhinos alone'), ('frame-060000.png', 'end of run')],
        'timeline-leopards48.png', 'Follow-up: 48 leopards eat every zebra within 1,300 ticks, then starve', extra=traits_extra)
    timeline('extra/long-dry-3', [
        ('frame-000000.png', 'seeded, low rain'), ('frame-050000.png', 'zebras at 2 mouths'), ('frame-100000.png', ''),
        ('frame-150000.png', 'food cells falling'), ('event-160100-zebra-extinct.png', 'zebras extinct'), ('frame-200000.png', 'grass crowds the map')],
        'timeline-long-dry-3.png', 'Follow-up: 200k ticks with low rain. Food falls and zebras evolve 2 to 2.8 mouths, but food keeps falling after they die', extra=traits_extra)
    # follow-up summary chart: zebra survival, leopard extinction, max mouths, burnt cells
    S2 = [r for r in json.load(open(os.path.join(OUT, 'summary.json'))) if r['group'] == 'extra']
    order2 = ['long-default', 'long-dry', 'leopards32', 'leopards48', 'fire-strong', 'fire-extreme']
    burnt = {}
    for c in order2:
        tot = []
        for s in (1, 2, 3):
            ev = json.load(open(os.path.join(OUT, 'extra', f'{c}-{s}', 'events.json')))
            tot.append(sum(e['burnt'] for e in ev['events'] if e['event'] == 'fire'))
        burnt[c] = sum(tot) / 3
    fig, ax = plt.subplots(1, 3, figsize=(15, 4))
    alive = [sum(1 for r in S2 if r['condition'] == c and r['zebra'] == 'persisted') for c in order2]
    lext = [sum(float(r['leopard_extinct_tick']) for r in S2 if r['condition'] == c) / 3000 for c in order2]
    ax[0].bar(order2, alive, color='#1F1A14'); ax[0].set_title('Zebra lineages alive at the end (of 3)'); ax[0].set_ylim(0, 3)
    ax[1].bar(order2, lext, color='#D98E04'); ax[1].set_title('Leopard extinction (thousand ticks, mean)')
    ax[2].bar(order2, [burnt[c] for c in order2], color='#B23A3A'); ax[2].set_title('Cells burnt per run (mean)')
    for a in ax: a.tick_params(axis='x', rotation=35); a.grid(axis='y', alpha=.3)
    fig.tight_layout(); fig.savefig(os.path.join(FIG, 'followup-summary.png'), dpi=120); plt.close(fig)
    print('follow-up burnt', burnt)
