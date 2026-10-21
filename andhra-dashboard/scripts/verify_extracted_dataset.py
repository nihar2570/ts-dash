import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print(f"Total ACs: {len(d)}")
total_cands = sum(len(ac['candidates']) for ac in d.values())
cands_with_myneta = sum(1 for ac in d.values() for c in ac['candidates'] if c.get('myneta'))
placeholder_cands = sum(1 for ac in d.values() for c in ac['candidates'] if 'candidate' in c['name'].lower())

print(f"Total candidates across all ACs: {total_cands}")
print(f"Candidates with MyNeta ADR profile: {cands_with_myneta}")
print(f"Candidates with placeholder name like 'candidate': {placeholder_cands}")

vip_acs = [
    (175, 'Kuppam (Nara Chandrababu Naidu)'),
    (37, 'Pithapuram (Pawan Kalyan)'),
    (87, 'Mangalagiri (Nara Lokesh)'),
    (129, 'Pulivendla (YS Jagan Mohan Reddy)'),
    (151, 'Tadipatri (JC Asmit Reddy)'),
    (58, 'Bhimavaram (Pulaparthi Ramanjaneyulu / Anji Babu)'),
]

for ac_no, desc in vip_acs:
    ac = d.get(str(ac_no))
    if not ac:
        print(f"AC #{ac_no} NOT FOUND")
        continue
    print(f"\n=== AC #{ac_no} {ac['ac_name']} ({desc}) ===")
    print(f"Total Candidates: {len(ac['candidates'])}")
    for c in ac['candidates'][:5]:
        mn = c.get('myneta')
        mn_str = f"Age: {mn['age']}, Edu: {mn['education']}, Cases: {mn['criminal_cases']}, Net: {mn['net_worth_formatted']}, Assets: {mn['total_assets_formatted']}" if mn else "No MyNeta"
        print(f"  Rank {c['rank']}: {c['name']} ({c['party']}) | Votes: {c.get('votes', 0):,} ({c.get('vote_share', 0)}%) | {mn_str}")

