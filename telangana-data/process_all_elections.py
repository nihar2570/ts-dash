import json
import gzip
import io
import csv
import urllib.request
import openpyxl

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
    if p_up in ['AIMIM', 'ALL INDIA MAJLIS-E-ITTEHADUL MUSLIMEEN', 'AIMIM']:
        return 'AIMIM'
    if p_up in ['TDP', 'TELUGU DESAM', 'TELUGU DESAM PARTY']:
        return 'TDP'
    if p_up in ['CPI', 'COMMUNIST PARTY OF INDIA']:
        return 'CPI'
    if p_up in ['CPM', 'COMMUNIST PARTY OF INDIA (MARXIST)', 'CPI(M)']:
        return 'CPM'
    if p_up in ['YSRCP', 'YUVAJANA SRAMIKA RYTHU CONGRESS PARTY']:
        return 'YSRCP'
    if p_up in ['BSP', 'BAHUJAN SAMAJ PARTY']:
        return 'BSP'
    if p_up in ['IND', 'INDEPENDENT']:
        return 'IND'
    if 'FORWARD BLOC' in p_up or p_up == 'AIFB':
        return 'AIFB'
    return 'OTH'

# 1. Load GeoJSON to get reference AC metadata
with open('telangana-data/telangana_assembly.geojson', 'r', encoding='utf-8') as f:
    geo = json.load(f)

ac_meta = {}
for feat in geo['features']:
    props = feat['properties']
    ac_no = int(props.get('AC_NO'))
    if ac_no not in ac_meta:
        ac_meta[ac_no] = {
            'ac_no': ac_no,
            'ac_name': props.get('AC_NAME', '').strip(),
            'district': props.get('DIST_NAME', '').strip(),
            'pc_no': props.get('PC_NO'),
            'pc_name': props.get('PC_NAME', '').strip()
        }

print(f"Loaded {len(ac_meta)} constituencies from GeoJSON.")

# 2. Load 2014 & 2018 from TCPD
url_tcpd = 'https://raw.githubusercontent.com/tcpd/tcpd-ld-data-archive/main/downloads/Telangana/Telangana_AE.csv.gz'
req = urllib.request.Request(url_tcpd, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    gz_bytes = resp.read()

tcpd_data = {2014: {}, 2018: {}}

with gzip.GzipFile(fileobj=io.BytesIO(gz_bytes)) as gz:
    reader = csv.DictReader(io.TextIOWrapper(gz, encoding='utf-8', errors='ignore'))
    for row in reader:
        year = row.get('Year')
        if year in ['2014', '2018'] and row.get('Poll_No') == '0':
            y = int(year)
            ac_no = int(row['Constituency_No'])
            if ac_no not in tcpd_data[y]:
                tcpd_data[y][ac_no] = []
            tcpd_data[y][ac_no].append(row)

print("TCPD 2014 AC count:", len(tcpd_data[2014]))
print("TCPD 2018 AC count:", len(tcpd_data[2018]))

results = {2014: {}, 2018: {}, 2023: {}}

# Process 2014 & 2018
for y in [2014, 2018]:
    for ac_no, cands in tcpd_data[y].items():
        # sort candidates by Votes descending
        def get_votes(c):
            try:
                return int(float(c.get('Votes', 0)))
            except:
                return 0
        cands_sorted = sorted(cands, key=get_votes, reverse=True)
        winner = cands_sorted[0] if len(cands_sorted) > 0 else {}
        runner = cands_sorted[1] if len(cands_sorted) > 1 else {}
        
        meta = ac_meta.get(ac_no, {})
        valid_votes = int(float(winner.get('Valid_Votes') or 0)) if winner.get('Valid_Votes') else sum(get_votes(c) for c in cands_sorted)
        w_votes = get_votes(winner)
        r_votes = get_votes(runner)
        margin = w_votes - r_votes
        margin_pct = round((margin / valid_votes * 100), 2) if valid_votes > 0 else 0
        w_pct = round((w_votes / valid_votes * 100), 2) if valid_votes > 0 else 0
        r_pct = round((r_votes / valid_votes * 100), 2) if valid_votes > 0 else 0
        turnout_pct = float(winner.get('Turnout_Percentage') or 0)
        
        results[y][ac_no] = {
            'ac_no': ac_no,
            'ac_name': meta.get('ac_name') or winner.get('Constituency_Name', '').title(),
            'district': meta.get('district') or winner.get('District_Name', '').title(),
            'pc_name': meta.get('pc_name', ''),
            'category': winner.get('Constituency_Type', 'GEN'),
            'winner': {
                'candidate': winner.get('Candidate', '').title(),
                'party': normalize_party(winner.get('Party')),
                'raw_party': winner.get('Party', ''),
                'votes': w_votes,
                'vote_share': w_pct
            },
            'runner_up': {
                'candidate': runner.get('Candidate', '').title(),
                'party': normalize_party(runner.get('Party')),
                'raw_party': runner.get('Party', ''),
                'votes': r_votes,
                'vote_share': r_pct
            },
            'margin': margin,
            'margin_pct': margin_pct,
            'total_valid_votes': valid_votes,
            'turnout_pct': turnout_pct
        }

# Process 2023 from azadecon repo with concurrent downloads
from concurrent.futures import ThreadPoolExecutor, as_completed

print("Fetching 2023 results from azadecon repo concurrently...", flush=True)

def fetch_ac_2023(ac_no):
    url_ac = f"https://raw.githubusercontent.com/azadecon/assembly_elections_2023/main/ts/{ac_no}.xlsx"
    try:
        req = urllib.request.Request(url_ac, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            wb = openpyxl.load_workbook(io.BytesIO(content))
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            cands = []
            total_valid_votes = 0
            for r in rows[1:]:
                cand_name = str(r[1]).strip() if r[1] is not None else ''
                if not cand_name:
                    continue
                if cand_name.lower() == 'total' or r[0] is None:
                    total_valid_votes = int(r[5]) if r[5] is not None else total_valid_votes
                    continue
                if cand_name.upper() == 'NOTA' or 'NONE OF THE ABOVE' in cand_name.upper():
                    continue
                cands.append({
                    'candidate': cand_name,
                    'party': str(r[2]).strip() if r[2] is not None else 'IND',
                    'total_votes': int(r[5]) if r[5] is not None else 0,
                    'perc_of_votes': float(r[6]) if r[6] is not None else 0.0
                })
            cands_sorted = sorted(cands, key=lambda x: x['total_votes'], reverse=True)
            winner = cands_sorted[0] if len(cands_sorted) > 0 else {}
            runner = cands_sorted[1] if len(cands_sorted) > 1 else {}
            
            meta = ac_meta.get(ac_no, {})
            valid_votes = total_valid_votes if total_valid_votes > 0 else sum(c['total_votes'] for c in cands_sorted)
            w_votes = winner.get('total_votes', 0)
            r_votes = runner.get('total_votes', 0)
            margin = w_votes - r_votes
            margin_pct = round((margin / valid_votes * 100), 2) if valid_votes > 0 else 0
            w_pct = winner.get('perc_of_votes', 0.0)
            r_pct = runner.get('perc_of_votes', 0.0)
            
            return ac_no, {
                'ac_no': ac_no,
                'ac_name': meta.get('ac_name', ''),
                'district': meta.get('district', ''),
                'pc_name': meta.get('pc_name', ''),
                'category': 'GEN',
                'winner': {
                    'candidate': winner.get('candidate', '').title(),
                    'party': normalize_party(winner.get('party')),
                    'raw_party': winner.get('party', ''),
                    'votes': w_votes,
                    'vote_share': w_pct
                },
                'runner_up': {
                    'candidate': runner.get('candidate', '').title(),
                    'party': normalize_party(runner.get('party')),
                    'raw_party': runner.get('party', ''),
                    'votes': r_votes,
                    'vote_share': r_pct
                },
                'margin': margin,
                'margin_pct': margin_pct,
                'total_valid_votes': valid_votes,
                'turnout_pct': 0.0
            }
    except Exception as e:
        print(f"Error fetching AC {ac_no}: {e}", flush=True)
        return ac_no, None

with ThreadPoolExecutor(max_workers=16) as executor:
    futures = [executor.submit(fetch_ac_2023, i) for i in range(1, 120)]
    for f in as_completed(futures):
        ac_no, data = f.result()
        if data:
            results[2023][ac_no] = data

print(f"2023 processed count: {len(results[2023])}", flush=True)

# Calculate swings and state-level tallies
tally = {}
for y in [2014, 2018, 2023]:
    p_tally = {}
    total_v = 0
    total_margin = 0
    for ac_no, res in results[y].items():
        w_party = res['winner']['party']
        p_tally[w_party] = p_tally.get(w_party, 0) + 1
        total_v += res['total_valid_votes']
        total_margin += res['margin']
        
        # calculate swing if previous election exists
        prev_y = 2014 if y == 2018 else (2018 if y == 2023 else None)
        if prev_y and ac_no in results[prev_y]:
            prev_party = results[prev_y][ac_no]['winner']['party']
            res['swing'] = {
                'prev_party': prev_party,
                'status': 'HOLD' if prev_party == w_party else 'GAIN',
                'gained_from': prev_party if prev_party != w_party else None
            }
        else:
            res['swing'] = None

    tally[y] = {
        'total_seats': len(results[y]),
        'seat_tally': dict(sorted(p_tally.items(), key=lambda x: x[1], reverse=True)),
        'total_valid_votes': total_v,
        'avg_margin': round(total_margin / len(results[y]), 0) if len(results[y]) > 0 else 0
    }

output_data = {
    'summary': tally,
    'results': results
}

with open('telangana-data/telangana_elections.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2)

print("\nProcessing complete! State summaries:")
for y in [2014, 2018, 2023]:
    print(f"{y}: {tally[y]['seat_tally']}")

