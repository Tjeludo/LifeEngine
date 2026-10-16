# Serves dist/ and lets the in-page harness save run outputs (CSV, JSON, PNG frames)
# into savanna-experiments/output/. Local use only.
import base64, os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, '..', 'dist')
OUT = os.path.join(ROOT, 'output')

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=DIST, **k)

    def translate_path(self, path):
        # /exp/* is served from savanna-experiments/ (worlds and harness)
        if path.startswith('/exp/'):
            rel = path[len('/exp/'):].split('?')[0]
            return os.path.join(ROOT, *rel.split('/'))
        return super().translate_path(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        m = re.match(r'^/save/([A-Za-z0-9_\-./]+)$', self.path)
        if not m or '..' in m.group(1):
            self.send_error(400); return
        name = m.group(1)
        body = self.rfile.read(int(self.headers['Content-Length']))
        if name.endswith('.png'):
            body = base64.b64decode(body.split(b',', 1)[1])
        dest = os.path.join(OUT, *name.split('/'))
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, 'wb') as f:
            f.write(body)
        self.send_response(200); self.end_headers(); self.wfile.write(b'ok')

    def log_message(self, *a):
        pass

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8137
ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
