import json

with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
    cand_data = json.load(f)

with open('public/data/andhra_elections.json', 'r', encoding='utf-8') as f:
    elec_data = json.load(f)

res_2024 = elec_data['results'].get('2024', {})
enriched_winners = 0
enriched_runners = 0

for ac_str, ac_res in res_2024.items():
    ac_cands = cand_data.get(ac_str, {}).get('candidates', [])
    if not ac_cands:
        continue
    
    r1 = next((c for c in ac_cands if c.get('rank') == 1), None)
    r2 = next((c for c in ac_cands if c.get('rank') == 2), None)
    
    if r1 and r1.get('myneta'):
        ac_res['winner']['myneta'] = r1['myneta']
        enriched_winners += 1
    if r2 and r2.get('myneta'):
        ac_res['runner_up']['myneta'] = r2['myneta']
        enriched_runners += 1

print(f"Enriched 2024 results: {enriched_winners} winners, {enriched_runners} runner-ups with MyNeta disclosures!")

with open('public/data/andhra_elections.json', 'w', encoding='utf-8') as f:
    json.dump(elec_data, f, indent=2, ensure_ascii=False)

print("Saved enriched public/data/andhra_elections.json!")

