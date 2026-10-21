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
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://voters.eci.gov.in/download-eroll?stateCode=S01',
    'Origin': 'https://voters.eci.gov.in',
}

endpoints = [
    'https://gateway-voters.eci.gov.in/api/v1/common/states',
    'https://gateway-voters.eci.gov.in/api/v1/common/districts/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/districts?stateCode=S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-list?stateCode=S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-list/S01',
    'https://gateway-voters.eci.gov.in/api/v1/e-roll/get-ac-list?stateCode=S01',
    'https://gateway-voters.eci.gov.in/api/v1/e-roll/district-list?stateCode=S01',
]

for url in endpoints:
    print(f"Testing: {url}")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
            print("Status:", resp.status)
            body = resp.read().decode('utf-8', errors='ignore')
            print("Response:", body[:200])
    except Exception as e:
        print("Error:", e)

