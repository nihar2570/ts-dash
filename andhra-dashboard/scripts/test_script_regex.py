import re
import urllib.parse
from bs4 import BeautifulSoup

CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"

def _0xe18c(d, e, f):
    h = CHARS[:e]
    i = CHARS[:f]
    j = 0
    for c, b in enumerate(reversed(d)):
        if b in h:
            j += h.index(b) * (e ** c)
    k = ""
    while j > 0:
        k = i[j % f] + k
        j = j // f
    return k or "0"

def decode_myneta(h, u, n, t, e, r=None):
    res = ""
    i = 0
    length = len(h)
    delimiter = n[e]
    while i < length:
        s = ""
        while i < length and h[i] != delimiter:
            s += h[i]
            i += 1
        i += 1
        if s:
            for j in range(len(n)):
                s = s.replace(n[j], str(j))
            code = int(_0xe18c(s, e, 10)) - t
            res += chr(code)
    try:
        res = urllib.parse.unquote(res)
    except Exception:
        pass
    return res

with open('kuppam.html', 'r', encoding='utf-8') as f:
    text = f.read()

def replace_script(m):
    script_content = m.group(1)
    m_args = re.search(r'eval\(function\(h,u,n,t,e,r\).*?\}\("([^"]+)",\s*(\d+),\s*"([^"]+)",\s*(\d+),\s*(\d+),\s*(\d+)\)\)', script_content, re.DOTALL)
    if m_args:
        h = m_args.group(1)
        u = int(m_args.group(2))
        n = m_args.group(3)
        t = int(m_args.group(4))
        e = int(m_args.group(5))
        r = int(m_args.group(6))
        decoded = decode_myneta(h, u, n, t, e, r)
        dw_match = re.search(r"document\.write\('(.*?)'\);", decoded, re.DOTALL)
        if dw_match:
            return dw_match.group(1)
        return decoded
    return ""

new_text = re.sub(r'<script>(\s*var _0xc77e=.*?)</script>', replace_script, text, flags=re.DOTALL)
print("Is Bharath in new_text?", "Bharath" in new_text)

soup = BeautifulSoup(new_text, 'html.parser')
for t in soup.find_all('table'):
    for r in t.find_all('tr'):
        if 'Bharath' in r.get_text():
            print("Found Bharath row in table!")
            print([c.get_text(strip=True) for c in r.find_all(['th','td'])])

