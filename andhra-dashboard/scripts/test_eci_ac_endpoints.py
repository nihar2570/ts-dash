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

candidates = [
    'https://gateway-voters.eci.gov.in/api/v1/common/districts/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/acs/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-list',
    'https://gateway-voters.eci.gov.in/api/v1/common/assembly-constituencies/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-by-district/S01/4',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-by-dist/S01/4',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-by-district-code/S0104',
    'https://gateway-voters.eci.gov.in/api/v1/common/district-ac/S01/4',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac-details/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/ac/S01/4',
    'https://gateway-voters.eci.gov.in/api/v1/common/polling-stations/S01',
    'https://gateway-voters.eci.gov.in/api/v1/common/parts/S01',
]

for url in candidates:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=4, context=ctx) as resp:
            print(f"SUCCESS ({resp.status}): {url}")
            body = resp.read().decode('utf-8', errors='ignore')
            print("  Preview:", body[:150])
    except urllib.error.HTTPError as e:
        if e.code != 404:
            print(f"HTTP {e.code}: {url}")
    except Exception as e:
        pass

