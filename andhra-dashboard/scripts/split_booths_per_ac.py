import json
import os

with open('public/data/booths/ap_polling_stations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

os.makedirs('public/data/booths', exist_ok=True)

for ac_str, booths in data.items():
    ac_file = f'public/data/booths/ac_{ac_str}.json'
    with open(ac_file, 'w', encoding='utf-8') as out:
        json.dump(booths, out, indent=2, ensure_ascii=False)

print(f"Generated 175 per-AC booth files in public/data/booths/ (ac_1.json to ac_175.json)!")

