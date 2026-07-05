from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json({"ok": True})

    def do_GET(self):
        if self.path in ["/", "/health"]:
            self._send_json({
                "status": "ok",
                "service": "ml-service",
                "message": "ML placeholder server is running without dependencies",
                "health": "/health",
                "analyze": "/analyze"
            })
        else:
            self._send_json({
                "status": "ok",
                "message": "ML placeholder server",
                "path": self.path
            })

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            self.rfile.read(content_length)

        if self.path.startswith("/analyze"):
            self._send_json({
                "status": "ok",
                "message": "Placeholder analysis completed",
                "analysis": {
                    "exercise": "squat",
                    "repCount": 1,
                    "angles": {
                        "knee": 92,
                        "hip": 78,
                        "back": 165
                    },
                    "feedback": [
                        "Keep your chest up.",
                        "Try to maintain a neutral spine.",
                        "Depth looks close to parallel."
                    ]
                }
            })
        else:
            self._send_json({
                "status": "ok",
                "message": "POST received",
                "path": self.path
            })

server = HTTPServer(("0.0.0.0", 8001), Handler)
print("ML placeholder server running on http://localhost:8001")
print("Health: http://localhost:8001/health")
server.serve_forever()
