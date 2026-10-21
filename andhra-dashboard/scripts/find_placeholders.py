import json

with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for ac_no, ac in d.items():
    for c in ac['candidates']:
        if 'candidate' in c['name'].lower():
            print(f"AC #{ac_no} {ac['ac_name']}: Rank {c['rank']} '{c['name']}' ({c['party']})")

