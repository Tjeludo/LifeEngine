# Prints total runs finished across the parallel harness tabs: python progress.py
import json, os
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output')
total, running, errors = 0, 0, []
for name in ['queue-status.json', 'queue-status-b.json', 'queue-status-c.json']:
    p = os.path.join(out, name)
    if not os.path.exists(p):
        continue
    try:
        d = json.load(open(p))
    except Exception:
        continue
    total += len(d['done'])
    running += 1 if d['running'] else 0
    if d.get('error'): errors.append(d['error'][:200])
print(total, running, errors)
