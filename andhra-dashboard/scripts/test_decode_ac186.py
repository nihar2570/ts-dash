import re
import urllib.parse

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

with open('data/myneta_raw/ac_186.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('eval(function(h,u,n,t,e,r)')
script_start = text.rfind('<script>', 0, idx)
script_end = text.find('</script>', idx)
script_code = text[script_start:script_end]

m_args = re.search(r'eval\(function\(h,u,n,t,e,r\).*?\}\("([^"]+)",\s*(\d+),\s*"([^"]+)",\s*(\d+),\s*(\d+),\s*(\d+)\)\)', script_code, re.DOTALL)
if m_args:
    h = m_args.group(1)
    u = int(m_args.group(2))
    n = m_args.group(3)
    t = int(m_args.group(4))
    e = int(m_args.group(5))
    r = int(m_args.group(6))
    decoded = decode_myneta(h, u, n, t, e, r)
    print("Decoded length:", len(decoded))
    print("Decoded snippet:")
    print(decoded[:200])
    print("...")
    print(decoded[-200:])

