import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://ceoandhra.nic.in', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    content = urllib.request.urlopen(req, timeout=12, context=ctx).read().decode('utf-8', errors='ignore')
    links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', content)
    print("Found total links:", len(links))
    for l in links:
        if any(k in l.lower() for k in ['roll', 'ssr', 'elector', 'pdf', 'ps', 'polling', 'erolls', 'form']):
            print("  ->", l)
except Exception as e:
    print("Error:", e)

