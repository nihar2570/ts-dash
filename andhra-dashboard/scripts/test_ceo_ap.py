import urllib.request
import ssl
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://ceoandhra.nic.in/'
content = urllib.request.urlopen(url, context=ctx).read().decode('utf-8', errors='ignore')
matches = re.findall(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', content, re.DOTALL)
for href, text in matches:
    clean_text = ' '.join(re.sub(r'<[^>]+>', '', text).split())
    if any(k in href.lower() or k in clean_text.lower() for k in ['general election', 'form-20', 'form 20', 'result', 'eroll', 'polling station', '2024']):
        print(f'{clean_text[:50]} --> {href}')

