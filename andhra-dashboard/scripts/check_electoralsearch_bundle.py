import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://electoralsearch.eci.gov.in/pollingstation'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', html)
        print("Scripts found:", scripts)
        for s in scripts:
            if 'main' in s or 'chunk' in s or 'bundle' in s:
                s_url = s if s.startswith('http') else 'https://electoralsearch.eci.gov.in' + s
                print("Fetching script:", s_url)
                s_req = urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(s_req, timeout=10, context=ctx) as s_resp:
                    js = s_resp.read().decode('utf-8', errors='ignore')
                    apis = re.findall(r'["\'](https?://[^"\']+|/api/[^"\']+)["\']', js)
                    print(f"  APIs found in {s}:", len(apis))
                    for a in apis:
                        if any(k in a.lower() for k in ['polling', 'station', 'booth', 'dist', 'ac', 'gateway']):
                            print("    Matched API:", a)
except Exception as e:
    print("Error:", e)

