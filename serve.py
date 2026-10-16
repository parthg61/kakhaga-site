import http.server, os, sys
class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p=self.path.split('?')[0]
        if p.startswith('/collection/'):
            self.path='/collection/integrated-communications-in-2026/index.html'
        return super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
    def log_message(self,*a): pass
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'public'))
http.server.ThreadingHTTPServer(('',8767),H).serve_forever()
