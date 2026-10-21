import json
import re

with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

total_before = sum(len(ac['candidates']) for ac in d.values())
print(f"Total candidates before clean deduplication: {total_before}")

def clean_key(cand):
    name = re.sub(r'[^a-zA-Z0-9]', '', cand['name'].lower())
    party = cand.get('party', '')
    is_nota = cand.get('is_nota', False)
    return (name, party, is_nota)

total_after = 0
for ac_no, ac in d.items():
    seen = set()
    deduped = []
    # Keep ranked / voting candidates first
    # Sort with key: votes descending (or existing rank)
    sorted_cands = sorted(ac['candidates'], key=lambda c: (-c.get('votes', 0), c.get('rank', 999)))
    
    nota_cand = None
    rank = 1
    for c in sorted_cands:
        if c.get('is_nota'):
            nota_cand = c
            continue
        key = clean_key(c)
        if key in seen:
            continue
        seen.add(key)
        c['rank'] = rank
        rank += 1
        deduped.append(c)

    if nota_cand:
        nota_cand['rank'] = rank
        deduped.append(nota_cand)

    ac['candidates'] = deduped
    ac['total_candidates'] = len(deduped)
    ac['candidates_above_1000'] = sum(1 for c in deduped if c.get('votes', 0) >= 1000)
    total_after += len(deduped)

print(f"Total candidates after clean deduplication: {total_after}")

with open('public/data/andhra_candidates_2024.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("Saved deduplicated dataset to public/data/andhra_candidates_2024.json!")

