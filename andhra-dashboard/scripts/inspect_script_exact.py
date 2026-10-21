import re

with open('data/myneta_raw/ac_186.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the script tag containing eval(function(h,u,n,t,e,r)
idx = text.find('eval(function(h,u,n,t,e,r)')
script_start = text.rfind('<script>', 0, idx)
script_end = text.find('</script>', idx)
script_code = text[script_start:script_end]

print("Script code:")
print(script_code[:400])

