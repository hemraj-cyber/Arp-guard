import http.server
import socketserver
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

print(f"Frontend running at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
