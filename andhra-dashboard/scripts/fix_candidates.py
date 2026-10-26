import urllib.request
import json
import re

url = 'https://en.wikipedia.org/w/api.php?action=parse&page=2024_Andhra_Pradesh_Legislative_Assembly_election&prop=wikitext&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    wikitext = data['parse']['wikitext']['*']

start_idx = wikitext.find('===Results by constituency===')
end_idx = wikitext.find('==Aftermath==')
section = wikitext[start_idx:end_idx]

def clean_cand(s):
    s = s.strip()
    if s.startswith('|'):
        s = s[1:].strip()
    m = re.search(r'\[\[(?:[^\|\]]+\|)?([^\]]+)\]\]', s)
    if m:
        return m.group(1).strip()
    return re.sub(r'[\[\]]', '', s).strip()

def parse_num(s):
    cleaned = re.sub(r'[^\d]', '', s)
    return int(cleaned) if cleaned else 0

PARTY_MAP = {
    'Telugu Desam Party': 'TDP',
    'YSR Congress Party': 'YSRCP',
    'Jana Sena Party': 'JSP',
    'Bharatiya Janata Party': 'BJP',
    'Indian National Congress': 'INC',
    'Communist Party of India': 'CPI',
    'Communist Party of India (Marxist)': 'CPM',
    'Independent': 'IND'
}

candidates_map = {}
for b in section.split('|-'):
    ac_m = re.search(r'!\s*(\d+)', b)
    if not ac_m:
        continue
    ac_no = int(ac_m.group(1))

    pipe_lines = [l.strip() for l in b.split('\n') if l.strip().startswith('|') and not l.strip().startswith('|-')]
    pipe_lines = [l for l in pipe_lines if 'rowspan' not in l]

    if len(pipe_lines) >= 6:
        w_cand = clean_cand(pipe_lines[1])
        r_cand = clean_cand(pipe_lines[5])
        candidates_map[ac_no] = (w_cand, r_cand)

print(f"Extracted candidate names for {len(candidates_map)} ACs.")
print(f"AC 137 Kurnool: {candidates_map.get(137)}")
print(f"AC 175 Kuppam: {candidates_map.get(175)}")

# Update andhra_elections.json
with open('public/data/andhra_elections.json', 'r', encoding='utf-8') as f:
    ae = json.load(f)

for ac_no_str, res in ae['results']['2023'].items():
    ac_no = int(ac_no_str)
    if ac_no in candidates_map:
        w_cand, r_cand = candidates_map[ac_no]
        res['winner']['candidate'] = w_cand
        res['runner_up']['candidate'] = r_cand

with open('public/data/andhra_elections.json', 'w', encoding='utf-8') as f:
    json.dump(ae, f, indent=2, ensure_ascii=False)
with open('public/data/telangana_elections.json', 'w', encoding='utf-8') as f:
    json.dump(ae, f, indent=2, ensure_ascii=False)

# Update andhra_demographics.json
with open('public/data/andhra_demographics.json', 'r', encoding='utf-8') as f:
    demo = json.load(f)

for ac_no_str, c in demo['constituencies'].items():
    ac_no = int(ac_no_str)
    if ac_no in candidates_map:
        w_cand, r_cand = candidates_map[ac_no]
        c['winner_2023']['candidate'] = w_cand
        c['runner_up_2023']['candidate'] = r_cand

with open('public/data/andhra_demographics.json', 'w', encoding='utf-8') as f:
    json.dump(demo, f, indent=2, ensure_ascii=False)

print("Saved updated elections and demographics files with verified candidate names!")

