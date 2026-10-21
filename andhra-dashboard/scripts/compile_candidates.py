import urllib.request
import io
import re
import sys
import json
import openpyxl
from concurrent.futures import ThreadPoolExecutor, as_completed

# Fix Windows console UTF-8 output
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def normalize_party(p):
    if not p:
        return 'OTH'
    p_up = p.strip().upper()
    if p_up in ['TRS', 'BHARAT RASHTRA SAMITHI', 'TELANGANA RASHTRA SAMITHI', 'BRS']:
        return 'BRS'
    if p_up in ['INC', 'INDIAN NATIONAL CONGRESS', 'CONGRESS']:
        return 'INC'
    if p_up in ['BJP', 'BHARATIYA JANATA PARTY']:
        return 'BJP'
    if p_up in ['AIMIM', 'ALL INDIA MAJLIS-E-ITTEHADUL MUSLIMEEN']:
        return 'AIMIM'
    if p_up in ['TDP', 'TELUGU DESAM', 'TELUGU DESAM PARTY']:
        return 'TDP'
    if p_up in ['CPI', 'COMMUNIST PARTY OF INDIA']:
        return 'CPI'
    if p_up in ['CPM', 'COMMUNIST PARTY OF INDIA (MARXIST)', 'CPI(M)']:
        return 'CPM'
    if p_up in ['BSP', 'BAHUJAN SAMAJ PARTY']:
        return 'BSP'
    if p_up in ['IND', 'INDEPENDENT']:
        return 'IND'
    if 'FORWARD BLOC' in p_up or p_up == 'AIFB':
        return 'AIFB'
    return 'OTH'

def parse_money(s):
    if not s:
        return 0, '₹0'
    m = re.search(r'Rs\s*([\d,]+)', s)
    if m:
        num = int(m.group(1).replace(',', ''))
        if num >= 10000000:
            fmt = f"₹{num / 10000000:.2f} Cr"
        elif num >= 100000:
            fmt = f"₹{num / 100000:.2f} L"
        elif num >= 1000:
            fmt = f"₹{num / 1000:.1f} K"
        else:
            fmt = f"₹{num:,}"
        return num, fmt
    return 0, '₹0'

def norm_tokens(name):
    clean = re.sub(r'^(dr|sri|smt|mr|mrs|prof)\.?\s+', '', name.lower().strip())
    tokens = [t for t in re.split(r'[^a-z0-9]+', clean) if len(t) > 1]
    return set(tokens)

# Load reference AC metadata from telangana_elections.json
with open('public/data/telangana_elections.json', 'r', encoding='utf-8') as f:
    elections_data = json.load(f)

results_2023 = elections_data['results']['2023']
ac_meta = {}
for ac_no_str, res in results_2023.items():
    ac_no = int(ac_no_str)
    ac_meta[ac_no] = {
        'ac_no': ac_no,
        'ac_name': res['ac_name'],
        'district': res['district'],
        'pc_name': res['pc_name'],
        'total_valid_votes': res.get('total_valid_votes', 0)
    }

print(f"Loaded reference metadata for {len(ac_meta)} constituencies.")

# 1. Fetch all 119 azadecon Excel files
print("Fetching 2023 official election candidate ballots (azadecon)...")
azadecon_data = {}

def fetch_azadecon(ac_no):
    url = f"https://raw.githubusercontent.com/azadecon/assembly_elections_2023/main/ts/{ac_no}.xlsx"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            wb = openpyxl.load_workbook(io.BytesIO(content))
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            cands = []
            valid_votes = 0
            for r in rows[1:]:
                c_name = str(r[1]).strip() if r[1] is not None else ''
                if not c_name or c_name.lower() == 'total' or r[0] is None:
                    if c_name.lower() == 'total' and r[5] is not None:
                        valid_votes = int(r[5])
                    continue
                is_nota = (c_name.upper() == 'NOTA' or 'NONE OF THE ABOVE' in c_name.upper())
                total_v = int(r[5]) if r[5] is not None else 0
                pct = float(r[6]) if r[6] is not None else 0.0
                cands.append({
                    'candidate': 'NOTA' if is_nota else c_name.title(),
                    'party': 'NOTA' if is_nota else normalize_party(str(r[2]).strip() if r[2] else 'IND'),
                    'raw_party': 'None of the Above' if is_nota else (str(r[2]).strip() if r[2] else 'Independent'),
                    'evm_votes': int(r[3]) if r[3] is not None else 0,
                    'postal_votes': int(r[4]) if r[4] is not None else 0,
                    'total_votes': total_v,
                    'vote_share': pct,
                    'is_nota': is_nota
                })
            # sort descending
            cands_sorted = sorted(cands, key=lambda x: x['total_votes'], reverse=True)
            return ac_no, cands_sorted, valid_votes
    except Exception as e:
        print(f"Error fetching azadecon AC {ac_no}: {e}")
        return ac_no, [], 0

with ThreadPoolExecutor(max_workers=20) as pool:
    futures = [pool.submit(fetch_azadecon, ac) for ac in range(1, 120)]
    for f in as_completed(futures):
        ac, cands, v_votes = f.result()
        azadecon_data[ac] = (cands, v_votes)

print(f"Fetched {len(azadecon_data)} AC ballots from azadecon.")

# 2. Fetch MyNeta data for all constituencies
print("Fetching 2023 MyNeta candidate disclosures...")
myneta_by_ac_name = {}

def fetch_myneta_cid(cid):
    url = f"https://www.myneta.info/Telangana2023/index.php?action=show_candidates&constituency_id={cid}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            title_m = re.search(r'List of Candidates in\s+([^\:]+)', content)
            cname = title_m.group(1).strip() if title_m else ""
            
            tables = re.findall(r'<table[^>]*>([\s\S]*?)<\/table>', content)
            cands = []
            if len(tables) > 2:
                rows = re.findall(r'<tr[^>]*>([\s\S]*?)<\/tr>', tables[2])
                for r in rows[1:]:
                    cells = re.findall(r'<td[^>]*>([\s\S]*?)<\/td>', r)
                    if len(cells) >= 8:
                        def clean_cell(html):
                            return ' '.join(re.sub(r'<[^>]+>', ' ', html).replace('&nbsp;', ' ').split())
                        
                        cand_name = clean_cell(cells[1]).replace('Winner', '').strip()
                        raw_party = clean_cell(cells[2])
                        crim_str = clean_cell(cells[3])
                        crim = int(crim_str) if crim_str.isdigit() else 0
                        edu = clean_cell(cells[4])
                        age_str = clean_cell(cells[5])
                        age = int(age_str) if age_str.isdigit() else 0
                        assets_num, assets_fmt = parse_money(clean_cell(cells[6]))
                        liab_num, liab_fmt = parse_money(clean_cell(cells[7]))
                        net_num = assets_num - liab_num
                        
                        if net_num >= 10000000:
                            net_fmt = f"₹{net_num / 10000000:.2f} Cr"
                        elif net_num >= 100000:
                            net_fmt = f"₹{net_num / 100000:.2f} L"
                        elif net_num < 0:
                            net_fmt = f"-₹{abs(net_num) / 100000:.2f} L"
                        else:
                            net_fmt = f"₹{net_num:,}"

                        cands.append({
                            'candidate': cand_name,
                            'party': normalize_party(raw_party),
                            'raw_party': raw_party,
                            'criminal_cases': crim,
                            'education': edu,
                            'age': age,
                            'total_assets': assets_num,
                            'total_assets_formatted': assets_fmt,
                            'liabilities': liab_num,
                            'liabilities_formatted': liab_fmt,
                            'net_worth': net_num,
                            'net_worth_formatted': net_fmt,
                            'is_crorepati': net_num >= 10000000
                        })
            return cid, cname, cands
    except Exception as e:
        print(f"Error fetching MyNeta CID {cid}: {e}")
        return cid, "", []

with ThreadPoolExecutor(max_workers=20) as pool:
    futures = [pool.submit(fetch_myneta_cid, cid) for cid in range(1, 125)]
    for f in as_completed(futures):
        cid, cname, cands = f.result()
        if cname and cands:
            clean_name = re.sub(r'\(.*?\)', '', cname).strip().upper()
            myneta_by_ac_name[clean_name] = cands

print(f"Fetched MyNeta data for {len(myneta_by_ac_name)} constituencies.")

# 3. Merge ballots with MyNeta disclosures
print("Compiling final candidate dataset...")
final_candidates_data = {}

for ac_no in range(1, 120):
    meta = ac_meta.get(ac_no, {})
    cands, valid_votes = azadecon_data.get(ac_no, ([], 0))
    if not valid_votes and cands:
        valid_votes = sum(c['total_votes'] for c in cands)
    
    clean_ac_name = re.sub(r'\(.*?\)', '', meta.get('ac_name', '')).strip().upper()
    myneta_cands = myneta_by_ac_name.get(clean_ac_name, [])
    if not myneta_cands:
        # Try fuzzy match on AC name
        for k, v in myneta_by_ac_name.items():
            if k in clean_ac_name or clean_ac_name in k:
                myneta_cands = v
                break

    compiled_cands = []
    deposit_cutoff = valid_votes / 6.0 if valid_votes > 0 else 0

    for rank, c in enumerate(cands, start=1):
        # Match with MyNeta
        matched_myneta = None
        c_party = c['party']
        c_tokens = norm_tokens(c['candidate'])
        
        # Priority 1: Match by recognized party
        if c_party not in ['IND', 'OTH', 'NOTA']:
            for m in myneta_cands:
                if m['party'] == c_party:
                    matched_myneta = m
                    break
        
        # Priority 2: Match by name tokens
        if not matched_myneta and not c['is_nota']:
            best_score = 0
            best_m = None
            for m in myneta_cands:
                m_tokens = norm_tokens(m['candidate'])
                intersection = len(c_tokens & m_tokens)
                if intersection > best_score:
                    best_score = intersection
                    best_m = m
            if best_score >= 1:
                matched_myneta = best_m

        is_retained = (c['total_votes'] >= deposit_cutoff) and not c['is_nota']

        cand_obj = {
            'rank': rank,
            'name': c['candidate'],
            'party': c['party'],
            'raw_party': c['raw_party'],
            'votes': c['total_votes'],
            'vote_share': c['vote_share'],
            'evm_votes': c['evm_votes'],
            'postal_votes': c['postal_votes'],
            'is_nota': c['is_nota'],
            'deposit_status': 'RETAINED' if is_retained else 'FORFEITED',
            'myneta': {
                'criminal_cases': matched_myneta['criminal_cases'],
                'education': matched_myneta['education'],
                'age': matched_myneta['age'],
                'total_assets': matched_myneta['total_assets'],
                'total_assets_formatted': matched_myneta['total_assets_formatted'],
                'liabilities': matched_myneta['liabilities'],
                'liabilities_formatted': matched_myneta['liabilities_formatted'],
                'net_worth': matched_myneta['net_worth'],
                'net_worth_formatted': matched_myneta['net_worth_formatted'],
                'is_crorepati': matched_myneta['is_crorepati']
            } if matched_myneta else None
        }
        compiled_cands.append(cand_obj)

    final_candidates_data[str(ac_no)] = {
        'ac_no': ac_no,
        'ac_name': meta.get('ac_name', ''),
        'district': meta.get('district', ''),
        'pc_name': meta.get('pc_name', ''),
        'total_valid_votes': valid_votes,
        'deposit_threshold_votes': round(deposit_cutoff),
        'deposit_threshold_pct': 16.67,
        'total_candidates': len(cands),
        'candidates_above_1000': sum(1 for c in cands if c['total_votes'] >= 1000),
        'candidates': compiled_cands
    }

# Save to public/data/telangana_candidates_2023.json
output_path = 'public/data/telangana_candidates_2023.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_candidates_data, f, indent=2, ensure_ascii=False)

print(f"Successfully compiled and saved {len(final_candidates_data)} ACs into {output_path}!")

