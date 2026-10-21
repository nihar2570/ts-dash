import re
import subprocess
import json

def extract_rows(html):
    # Standard <tr> rows
    # Check how many scripts with eval(function(h,u,n,t,e,r) exist
    pattern = r'<script>(var _0xc77e=.*?eval\(function\(h,u,n,t,e,r\).*?\))\s*</script>'
    matches = re.findall(pattern, html, re.DOTALL)
    print(f"Obfuscated scripts found: {len(matches)}")
    return len(matches)

with open('kuppam.html', 'r', encoding='utf-8') as f:
    extract_rows(f.read())

with open('sample_constituency.html', 'r', encoding='utf-8') as f:
    extract_rows(f.read())

