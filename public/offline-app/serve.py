#!/usr/bin/env python3
"""ClassNest Offline APP — local server with SPA routing so /class/... works."""
from __future__ import annotations

import os
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
PORT = int(os.environ.get("CLASSNEST_PORT", "8765"))


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".wasm": "application/wasm",
        ".woff2": "font/woff2",
        ".svg": "image/svg+xml",
    }

    def _rewrite_spa(self) -> bool:
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        rel = path.lstrip("/")
        full = os.path.normpath(os.path.join(ROOT, rel.replace("/", os.sep)))
        if not full.startswith(ROOT):
            self.send_error(403)
            return False
        if rel and not os.path.exists(full):
            if "." not in os.path.basename(rel):
                self.path = "/index.html"
        return True

    def do_GET(self):
        if not self._rewrite_spa():
            return
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_HEAD(self):
        if not self._rewrite_spa():
            return
        return SimpleHTTPRequestHandler.do_HEAD(self)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def main():
    httpd = None
    port = PORT
    for try_port in (PORT, PORT + 1, PORT + 2, PORT + 3):
        try:
            httpd = ThreadingHTTPServer(("127.0.0.1", try_port), Handler)
            port = try_port
            break
        except OSError:
            continue
    if httpd is None:
        print("Could not open a local port.")
        sys.exit(1)
    url = "http://127.0.0.1:%d/" % port
    print("ClassNest Offline — full app")
    print("Leave this window open while you teach.")
    print(url)
    print("")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
