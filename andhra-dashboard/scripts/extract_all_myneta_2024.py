import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

CACHE_DIR = 'data/myneta_raw'
os.makedirs(CACHE_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"

def _0xe18c(d, e, f):
    h = CHARS[:e]
    i = CHARS[:f]
    j = 0
    for c, b in enumerate(reversed(d)):
        if b in h:
            j += h.index(b) * (e ** c)
    k = ""
    while j > 0:
        k = i[j % f] + k
        j = j // f
    return k or "0"

def decode_myneta(h, u, n, t, e, r=None):
    res = ""
    i = 0
    length = len(h)
    delimiter = n[e]
    while i < length:
        s = ""
        while i < length and h[i] != delimiter:
            s += h[i]
            i += 1
        i += 1
        if s:
            for j in range(len(n)):
                s = s.replace(n[j], str(j))
            code = int(_0xe18c(s, e, 10)) - t
            res += chr(code)
    try:
        res = urllib.parse.unquote(res)
    except Exception:
        pass
    return res

def fetch_url(url, cache_filename):
    cache_path = os.path.join(CACHE_DIR, cache_filename)
    if os.path.exists(cache_path):
        with open(cache_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if len(content) > 1000:
                return content
    
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=18) as resp:
                content = resp.read().decode('utf-8', errors='ignore')
                if len(content) > 1000:
                    with open(cache_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    return content
        except Exception as e:
            if attempt == 3:
                print(f"Error fetching {url}: {e}")
                return ""
            time.sleep(1 + attempt)
    return ""

def format_inr(val):
    if val >= 10000000:
        return f"₹{val / 10000000:.2f} Cr"
    elif val >= 100000:
        return f"₹{val / 100000:.2f} L"
    elif val >= 1000:
        return f"₹{val / 1000:.1f} K"
    elif val > 0:
        return f"₹{val:,}"
    elif val < 0:
        abs_v = abs(val)
        if abs_v >= 10000000:
            return f"-₹{abs_v / 10000000:.2f} Cr"
        elif abs_v >= 100000:
            return f"-₹{abs_v / 100000:.2f} L"
        else:
            return f"-₹{abs_v:,}"
    return "₹0"

def parse_currency(text):
    if not text:
        return 0, '₹0'
    clean_txt = text.replace('\xa0', ' ').replace('&nbsp;', ' ').strip()
    m = re.search(r'Rs\.?\s*([0-9,]+)', clean_txt, re.IGNORECASE)
    if m:
        num_str = m.group(1).replace(',', '')
        try:
            val = int(num_str)
            return val, format_inr(val)
        except ValueError:
            pass
    return 0, '₹0'

def fetch_candidate_page(cand_id):
    url = f"https://www.myneta.info/AndhraPradesh2024/candidate.php?candidate_id={cand_id}"
    html = fetch_url(url, f"cand_{cand_id}.html")
    if not html:
        return 0, 0
    soup = BeautifulSoup(html, 'html.parser')
    assets_val = 0
    liab_val = 0
    for t in soup.find_all('table'):
        for r in t.find_all('tr'):
            txt = r.get_text()
            if 'Assets:' in txt:
                for c in r.find_all(['td', 'th']):
                    if 'Rs' in c.get_text():
                        assets_val, _ = parse_currency(c.get_text())
            if 'Liabilities:' in txt:
                for c in r.find_all(['td', 'th']):
                    if 'Rs' in c.get_text():
                        liab_val, _ = parse_currency(c.get_text())
    return assets_val, liab_val

def parse_constituency_html(html, cid):
    def replace_script(m):
        script_content = m.group(1)
        m_args = re.search(r'eval\(function\(h,u,n,t,e,r\).*?\}\("([^"]+)",\s*(\d+),\s*"([^"]+)",\s*(\d+),\s*(\d+),\s*(\d+)\)\)', script_content, re.DOTALL)
        if m_args:
            h = m_args.group(1)
            u = int(m_args.group(2))
            n = m_args.group(3)
            t = int(m_args.group(4))
            e = int(m_args.group(5))
            r = int(m_args.group(6))
            decoded = decode_myneta(h, u, n, t, e, r)
            dw_match = re.search(r"document\.write\('(.*?)'\);", decoded, re.DOTALL)
            if dw_match:
                return dw_match.group(1)
            return decoded
        return ""

    processed_html = re.sub(r'<script>(\s*var _0xc77e=.*?)</script>', replace_script, html, flags=re.DOTALL)
    soup = BeautifulSoup(processed_html, 'html.parser')

    target_table = None
    for t in soup.find_all('table'):
        headers = [th.get_text(strip=True).lower() for th in t.find_all('th')]
        if any('candidate' in h for h in headers) and any('party' in h for h in headers):
            target_table = t
            break

    if not target_table:
        return []

    candidates = []
    for r in target_table.find_all('tr'):
        tds = r.find_all('td')
        if len(tds) < 6:
            continue
        
        cand_td = tds[1]
        cand_a = cand_td.find('a')
        raw_name = cand_a.get_text(strip=True) if cand_a else cand_td.get_text(strip=True)
        cand_name = re.sub(r'Winner$', '', raw_name, flags=re.IGNORECASE).strip()
        is_winner = 'winner' in cand_td.get_text(strip=True).lower()
        
        cand_id = None
        if cand_a and 'href' in cand_a.attrs:
            m = re.search(r'candidate_id=(\d+)', cand_a['href'])
            if m:
                cand_id = int(m.group(1))

        party = tds[2].get_text(strip=True)
        
        crime_txt = tds[3].get_text(strip=True)
        m_crime = re.search(r'(\d+)', crime_txt)
        criminal_cases = int(m_crime.group(1)) if m_crime else 0

        education = tds[4].get_text(strip=True) or 'Not Given'

        age_txt = tds[5].get_text(strip=True)
        m_age = re.search(r'(\d+)', age_txt)
        age = int(m_age.group(1)) if m_age else 0

        assets_td = tds[6] if len(tds) > 6 else None
        liab_td = tds[7] if len(tds) > 7 else None

        assets_val = 0
        liab_val = 0

        if assets_td and 'Rs' in assets_td.get_text():
            assets_val, _ = parse_currency(assets_td.get_text())
        elif cand_id:
            assets_val, liab_val = fetch_candidate_page(cand_id)

        if liab_td and 'Rs' in liab_td.get_text():
            liab_val, _ = parse_currency(liab_td.get_text())
        elif cand_id and liab_val == 0:
            if assets_val == 0:
                assets_val, liab_val = fetch_candidate_page(cand_id)

        net_worth = assets_val - liab_val
        is_crorepati = assets_val >= 10000000

        candidates.append({
            'candidate_id': cand_id,
            'name': cand_name,
            'is_winner': is_winner,
            'party': party,
            'criminal_cases': criminal_cases,
            'education': education,
            'age': age,
            'total_assets': assets_val,
            'total_assets_formatted': format_inr(assets_val),
            'liabilities': liab_val,
            'liabilities_formatted': format_inr(liab_val),
            'net_worth': net_worth,
            'net_worth_formatted': format_inr(net_worth),
            'is_crorepati': is_crorepati
        })

    return candidates

def main():
    print("=== STARTING OFFICIAL MYNETA EXTRACTION FOR ALL 175 ANDHRA PRADESH ACS ===")
    
    # 1. Load Homepage to get all 175 AC links
    homepage_html = fetch_url('https://www.myneta.info/AndhraPradesh2024/', 'homepage.html')
    soup = BeautifulSoup(homepage_html, 'html.parser')

    myneta_acs = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if 'action=show_candidates' in href and 'constituency_id=' in href:
            m = re.search(r'constituency_id=(\d+)', href)
            if m:
                cid = int(m.group(1))
                name = a.get_text(strip=True)
                myneta_acs.append({'cid': cid, 'raw_name': name, 'href': href})

    print(f"Discovered {len(myneta_acs)} constituencies on MyNeta.")

    # 2. Build 100% verified 175 AC map
    with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
        existing_cand_data = json.load(f)

    def clean_name(s):
        s = s.upper()
        s = re.sub(r'\(SC\)|\(ST\)', '', s)
        s = re.sub(r'[^A-Z0-9]', '', s)
        return s

    our_cleaned = {}
    for ac_no_str, ac_info in existing_cand_data.items():
        cname = clean_name(ac_info['ac_name'])
        our_cleaned[cname] = int(ac_no_str)

    EXPLICIT_MAP = {
        'TADPATRI': 151,
        'SATYAVEDU': 169,
        'PONNUR': 88,
        'YELAMANCHILI': 32,
        'CHEEPURUPALLE': 15,
    }

    cid_to_ac_no = {}
    for m in myneta_acs:
        cid = m['cid']
        raw = m['raw_name']
        cl = clean_name(raw)
        if 'PRATHIPADU' in cl:
            if cid == 38:
                cid_to_ac_no[cid] = 36
            elif cid == 98:
                cid_to_ac_no[cid] = 93
        elif cl in EXPLICIT_MAP:
            cid_to_ac_no[cid] = EXPLICIT_MAP[cl]
        elif cl in our_cleaned:
            cid_to_ac_no[cid] = our_cleaned[cl]
        else:
            raise ValueError(f"Unmapped constituency: {m}")

    print(f"Verified mapping: {len(cid_to_ac_no)} / 175 constituencies mapped.")

    # 3. Fetch all 175 constituency pages with ThreadPoolExecutor
    print("Fetching and caching all 175 constituency pages...")
    results_by_ac = {}

    def process_ac(item):
        cid = item['cid']
        ac_no = cid_to_ac_no[cid]
        url = f"https://www.myneta.info/AndhraPradesh2024/{item['href']}"
        html = fetch_url(url, f"ac_{cid}.html")
        if not html:
            print(f"Warning: Empty HTML for AC #{ac_no} (cid {cid})")
            return ac_no, []
        cands = parse_constituency_html(html, cid)
        return ac_no, cands

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(process_ac, item): item for item in myneta_acs}
        count = 0
        for f in as_completed(futures):
            ac_no, cands = f.result()
            results_by_ac[ac_no] = cands
            count += 1
            if count % 25 == 0 or count == len(myneta_acs):
                print(f"  Processed {count}/175 ACs (latest: AC #{ac_no} with {len(cands)} candidates)")

    total_candidates_scraped = sum(len(c) for c in results_by_ac.values())
    print(f"Extraction complete! Total candidates scraped: {total_candidates_scraped}")

    # 4. Merge MyNeta data into existing_cand_data
    print("Merging MyNeta ADR records into public/data/andhra_candidates_2024.json...")
    
    party_aliases = {
        'TDP': ['TDP', 'Telugu Desam', 'Telugu Desam Party'],
        'YSRCP': ['YSRCP', 'YSR Congress', 'YSR Congress Party', 'Yuvajana Sramika Rythu Congress Party'],
        'JSP': ['JSP', 'Janasena', 'Jana Sena Party', 'Janasena Party'],
        'BJP': ['BJP', 'Bharatiya Janata Party'],
        'INC': ['INC', 'Congress', 'Indian National Congress'],
        'BSP': ['BSP', 'Bahujan Samaj Party'],
        'CPI': ['CPI', 'Communist Party of India'],
        'CPM': ['CPM', 'CPI(M)', 'Communist Party of India (Marxist)'],
        'AIFB': ['AIFB', 'All India Forward Bloc'],
        'IND': ['IND', 'Independent'],
    }

    def normalize_party(p):
        p_up = p.upper().strip()
        for code, aliases in party_aliases.items():
            for a in aliases:
                if a.upper() == p_up or a.upper() in p_up:
                    return code
        return 'OTH'

    def normalize_name(n):
        n = re.sub(r'[^a-zA-Z]', '', n.lower())
        return n

    total_matched = 0

    for ac_no_int in range(1, 176):
        ac_str = str(ac_no_int)
        ac_data = existing_cand_data.get(ac_str)
        if not ac_data:
            continue

        myneta_cands = results_by_ac.get(ac_no_int, [])
        existing_cands = ac_data.get('candidates', [])

        # Map myneta cands by party and name
        myneta_winner = next((c for c in myneta_cands if c['is_winner']), None)
        myneta_by_party = {}
        for c in myneta_cands:
            p_norm = normalize_party(c['party'])
            myneta_by_party.setdefault(p_norm, []).append(c)

        used_myneta_ids = set()

        # Update existing candidates
        for idx, cand in enumerate(existing_cands):
            if cand.get('is_nota'):
                continue

            c_party = cand.get('party', '')
            matched_myneta = None

            # Rank 1: match with myneta winner
            if cand['rank'] == 1 and myneta_winner:
                matched_myneta = myneta_winner
            # If not matched or rank 2, 3...
            if not matched_myneta:
                # Try party match
                p_cands = [c for c in myneta_by_party.get(c_party, []) if id(c) not in used_myneta_ids]
                if len(p_cands) == 1:
                    matched_myneta = p_cands[0]
                elif len(p_cands) > 1:
                    # Match by name similarity
                    cand_clean = normalize_name(cand['name'])
                    for pc in p_cands:
                        pc_clean = normalize_name(pc['name'])
                        if cand_clean and (cand_clean in pc_clean or pc_clean in cand_clean):
                            matched_myneta = pc
                            break
                    if not matched_myneta:
                        matched_myneta = p_cands[0]

            # If cand has placeholder name like "INC Candidate" and we found a matched MyNeta cand
            if matched_myneta:
                used_myneta_ids.add(id(matched_myneta))
                total_matched += 1
                if 'candidate' in cand['name'].lower() or not cand['name']:
                    cand['name'] = matched_myneta['name']
                
                # Attach ADR disclosure
                cand['myneta'] = {
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
                }

        # Add remaining MyNeta candidates into candidate list if not already present
        # Sort existing by rank
        max_rank = max((c['rank'] for c in existing_cands if not c.get('is_nota')), default=0)
        nota_cand = next((c for c in existing_cands if c.get('is_nota')), None)
        other_existing = [c for c in existing_cands if not c.get('is_nota')]

        for mc in myneta_cands:
            if id(mc) in used_myneta_ids:
                continue
            max_rank += 1
            other_existing.append({
                'rank': max_rank,
                'name': mc['name'],
                'party': normalize_party(mc['party']),
                'raw_party': mc['party'],
                'votes': 0, # not available individually for sub-1k minor independents
                'vote_share': 0.0,
                'evm_votes': 0,
                'postal_votes': 0,
                'is_nota': False,
                'deposit_status': 'FORFEITED',
                'myneta': {
                    'criminal_cases': mc['criminal_cases'],
                    'education': mc['education'],
                    'age': mc['age'],
                    'total_assets': mc['total_assets'],
                    'total_assets_formatted': mc['total_assets_formatted'],
                    'liabilities': mc['liabilities'],
                    'liabilities_formatted': mc['liabilities_formatted'],
                    'net_worth': mc['net_worth'],
                    'net_worth_formatted': mc['net_worth_formatted'],
                    'is_crorepati': mc['is_crorepati']
                }
            })

        if nota_cand:
            max_rank += 1
            nota_cand['rank'] = max_rank
            other_existing.append(nota_cand)

        ac_data['candidates'] = other_existing
        ac_data['total_candidates'] = len(other_existing)

    # Save enriched dataset
    output_path = 'public/data/andhra_candidates_2024.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(existing_cand_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully enriched {output_path}!")
    print(f"Total matched major candidates: {total_matched}")

if __name__ == '__main__':
    main()

