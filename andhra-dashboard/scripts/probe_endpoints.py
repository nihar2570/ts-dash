import urllib.request
import ssl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

def probe(name, url):
    print(f"\n--- Probing: {name} ({url}) ---")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12, context=ctx) as resp:
            print("Status:", resp.status)
            content_type = resp.headers.get('Content-Type')
            print("Content-Type:", content_type)
            body = resp.read()
            print("Body Length:", len(body))
            text = body[:1000].decode('utf-8', errors='ignore')
            print("Preview:\n", text[:300])
            return True, body
    except Exception as e:
        print("Failed:", e)
        return False, str(e)

# 1. ECI download-eroll
probe("ECI Download E-Roll", "https://voters.eci.gov.in/download-eroll?stateCode=S01")

# 2. CEO AP Rolls Portal
probe("CEO AP E-Rolls 2023", "https://ceoaperolls.ap.gov.in/AP_Eroll_2023/Rolls.aspx")
probe("CEO AP E-Rolls Main", "https://ceoaperolls.ap.gov.in/AP_Eroll/Rolls")

# 3. ECI Polling Station Locator
probe("ECI PS Search", "https://electoralsearch.eci.gov.in/pollingstation")

