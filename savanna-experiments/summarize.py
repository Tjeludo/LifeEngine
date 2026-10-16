# Prints a compact table of a run's log.csv: python summarize.py output/runs/full-1 [every]
import csv, sys, os

d = sys.argv[1]
every = int(sys.argv[2]) if len(sys.argv) > 2 else 5
cols = sys.argv[3].split(',') if len(sys.argv) > 3 else \
    ['tick', 'zebra', 'rhino', 'leopard', 'grass', 'bush', 'food', 'browse', 'meat', 'mean_water',
     'zebra_mouths', 'zebra_births', 'zebra_death_attack', 'zebra_death_starvation', 'leopard_births', 'leopard_death_starvation']
rows = list(csv.DictReader(open(os.path.join(d, 'log.csv'))))
print(' '.join(c.replace('zebra_', 'z_').replace('leopard_', 'l_').replace('death_', 'd_') for c in cols))
for i, r in enumerate(rows):
    if i % every == 0 or i == len(rows) - 1:
        print(' '.join(str(r.get(c, '')) for c in cols))
ev = os.path.join(d, 'events.json')
if os.path.exists(ev):
    import json
    for e in json.load(open(ev))['events']:
        print('EVENT', e)
