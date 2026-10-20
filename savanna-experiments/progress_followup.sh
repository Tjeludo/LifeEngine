python - <<'P'
import json,os
t=r=0
for n in 'abc':
    p=f'output/followup-{n}.json'
    if os.path.exists(p):
        try:
            d=json.load(open(p)); t+=len(d['done']); r+=d['running']
            if d.get('error'): print('ERR',d['error'][:200])
        except Exception: pass
print(t, r)
P
