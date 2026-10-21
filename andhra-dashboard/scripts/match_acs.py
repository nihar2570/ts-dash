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

print(f"MyNeta AC count: {len(myneta_acs)}")
print(f"Our AC count: {len(our_data)}")

def clean_name(s):
    s = s.upper()
    s = re.sub(r'\(SC\)|\(ST\)', '', s)
    s = re.sub(r'[^A-Z0-9]', '', s)
    return s

our_cleaned = {}
for ac_no_str, ac_info in our_data.items():
    cname = clean_name(ac_info['ac_name'])
    our_cleaned[cname] = int(ac_no_str)

matched = 0
unmatched = []
mapping = {}

for m in myneta_acs:
    mc = clean_name(m['raw_name'])
    if mc in our_cleaned:
        matched += 1
        mapping[m['cid']] = our_cleaned[mc]
    else:
        unmatched.append(m)

print(f"Direct clean matches: {matched} / {len(myneta_acs)}")
if unmatched:
    print("\nUnmatched MyNeta ACs:")
    for u in unmatched:
        print("  MyNeta:", u['raw_name'], "(clean:", clean_name(u['raw_name']), ")")

print("\nOur ACs not matched yet:")
matched_our = set(mapping.values())
for ac_no_str, ac_info in our_data.items():
    ac_num = int(ac_no_str)
    if ac_num not in matched_our:
        print(f"  #{ac_num}: {ac_info['ac_name']} (clean: {clean_name(ac_info['ac_name'])})")

