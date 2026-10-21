import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://ceoandhra.nic.in/General%20Elections-2024.html'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        print('Status:', resp.status)
        content = resp.read().decode('utf-8', errors='ignore')
        print('Length:', len(content))
        links = re.findall(r'href=["\']([^"\']+)["\']', content)
        print('Total links:', len(links))
        for l in links:
            print('Link:', l)
except Exception as e:
    print('Error:', e)

