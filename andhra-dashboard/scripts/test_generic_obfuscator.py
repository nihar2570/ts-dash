import re

with open('data/myneta_raw/ac_186.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Match any script tag that contains eval(function(h,u,n,t,e,r)
m = re.findall(r'<script>(.*?eval\(function\(h,u,n,t,e,r\).*?)</script>', text, flags=re.DOTALL)
print(f"Matched scripts in ac_186.html: {len(m)}")
if m:
    s = m[0]
    print("Script prefix:", s[:60])
    m_args = re.search(r'eval\(function\(h,u,n,t,e,r\).*?\}\("([^"]+)",\s*(\d+),\s*"([^"]+)",\s*(\d+),\s*(\d+),\s*(\d+)\)\)', s, re.DOTALL)
    if m_args:
        print("Arguments found successfully!")
        print("arg 1 len:", len(m_args.group(1)))
        print("args 2..6:", m_args.groups()[1:])

