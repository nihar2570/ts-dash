import json
import re
from bs4 import BeautifulSoup

with open('homepage_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

myneta_acs = []
for a in soup.find_all('a', href=True):
    href = a['href']
    if 'action=show_candidates' in href and 'constituency_id=' in href:
        m = re.search(r'constituency_id=(\d+)', href)
        if m:
            cid = int(m.group(1))
            name = a.get_text(strip=True)
            myneta_acs.append({'cid': cid, 'raw_name': name, 'href': href})

with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
    our_data = json.load(f)

def clean_name(s):
    s = s.upper()
    s = re.sub(r'\(SC\)|\(ST\)', '', s)
    s = re.sub(r'[^A-Z0-9]', '', s)
    return s

our_cleaned = {}
for ac_no_str, ac_info in our_data.items():
    cname = clean_name(ac_info['ac_name'])
    our_cleaned[cname] = int(ac_no_str)

EXPLICIT_MAP = {
    'TADPATRI': 151,
    'SATYAVEDU': 169,
    'PONNUR': 88,
    'YELAMANCHILI': 32,
    'CHEEPURUPALLE': 15,
}

full_map = {}
for m in myneta_acs:
    cid = m['cid']
    raw = m['raw_name']
    cl = clean_name(raw)
    
    if 'PRATHIPADU' in cl:
        if cid == 38:
            full_map[cid] = 36
        elif cid == 98:
            full_map[cid] = 93
    elif cl in EXPLICIT_MAP:
        full_map[cid] = EXPLICIT_MAP[cl]
    elif cl in our_cleaned:
        full_map[cid] = our_cleaned[cl]
    else:
        print("COULD NOT MAP:", m)

print(f"Total mapped: {len(full_map)} / 175")
all_our_acs = set(range(1, 176))
mapped_our_acs = set(full_map.values())
missing = all_our_acs - mapped_our_acs
print("Missing our ACs:", missing)
assert len(full_map) == 175 and len(missing) == 0, "Mapping is not complete!"
print("PERFECT 175/175 MAPPING ESTABLISHED!")

