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
            if len(content) > 500:
                return content
    
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=18) as resp:
                content = resp.read().decode('utf-8', errors='ignore')
                if len(content) > 500:
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

def fetch_candidate_profile(cand_id):
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

def parse_all_constituencies():
    print("=== PASS 1: PARSING ALL 175 CONSTITUENCY HTML FILES WITH DEOBFUSCATION ===")
    
    with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
        existing_data = json.load(f)

    def clean_name(s):
        s = s.upper()
        s = re.sub(r'\(SC\)|\(ST\)', '', s)
        s = re.sub(r'[^A-Z0-9]', '', s)
        return s

    our_cleaned = {}
    for ac_no_str, ac_info in existing_data.items():
        cname = clean_name(ac_info['ac_name'])
        our_cleaned[cname] = int(ac_no_str)

    EXPLICIT_MAP = {
        'TADPATRI': 151,
        'SATYAVEDU': 169,
        'PONNUR': 88,
        'YELAMANCHILI': 32,
        'CHEEPURUPALLE': 15,
    }

    with open('data/myneta_raw/homepage.html', 'r', encoding='utf-8') as f:
        soup_home = BeautifulSoup(f.read(), 'html.parser')

    cid_to_ac_no = {}
    for a in soup_home.find_all('a', href=True):
        href = a['href']
        if 'action=show_candidates' in href and 'constituency_id=' in href:
            m = re.search(r'constituency_id=(\d+)', href)
            if m:
                cid = int(m.group(1))
                raw = a.get_text(strip=True)
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

    print(f"Mapped {len(cid_to_ac_no)} / 175 constituencies.")

    # Parse each constituency HTML
    all_cands_by_ac = {}
    cands_needing_page_fetch = []

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

    for cid, ac_no in cid_to_ac_no.items():
        cache_file = os.path.join(CACHE_DIR, f"ac_{cid}.html")
        if not os.path.exists(cache_file):
            print(f"Missing file for cid {cid}")
            continue
        with open(cache_file, 'r', encoding='utf-8') as f:
            html = f.read()

        # Generic deobfuscation of any obfuscated candidate rows
        processed_html = re.sub(r'<script>(\s*var _0x[a-f0-9]+=\["","split".*?)</script>', replace_script, html, flags=re.DOTALL)
        soup = BeautifulSoup(processed_html, 'html.parser')

        target_table = None
        for t in soup.find_all('table'):
            headers = [th.get_text(strip=True).lower() for th in t.find_all('th')]
            if any('candidate' in h for h in headers) and any('party' in h for h in headers):
                target_table = t
                break

        if not target_table:
            print(f"Warning: No candidate table found for AC #{ac_no} (cid {cid})")
            continue

        cands = []
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
                m_cid = re.search(r'candidate_id=(\d+)', cand_a['href'])
                if m_cid:
                    cand_id = int(m_cid.group(1))

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

            has_text_assets = assets_td and 'Rs' in assets_td.get_text()
            if has_text_assets:
                assets_val, _ = parse_currency(assets_td.get_text())

            has_text_liab = liab_td and 'Rs' in liab_td.get_text()
            if has_text_liab:
                liab_val, _ = parse_currency(liab_td.get_text())

            cand_obj = {
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
                'net_worth': assets_val - liab_val,
                'net_worth_formatted': format_inr(assets_val - liab_val),
                'is_crorepati': assets_val >= 10000000,
                'ac_no': ac_no
            }

            if cand_id and (not has_text_assets or (assets_val == 0 and not has_text_liab)):
                cands_needing_page_fetch.append(cand_obj)

            cands.append(cand_obj)

        all_cands_by_ac[ac_no] = cands

    total_scraped = sum(len(c) for c in all_cands_by_ac.values())
    print(f"Total candidates scraped across 175 ACs: {total_scraped}")
    print(f"Candidates needing individual profile fetch for assets/liabilities: {len(cands_needing_page_fetch)}")

    # Fetch missing candidate profiles in parallel
    if cands_needing_page_fetch:
        print("Fetching candidate profile pages for missing asset declarations...")
        
        def fetch_cand(c):
            cand_id = c['candidate_id']
            a_val, l_val = fetch_candidate_profile(cand_id)
            c['total_assets'] = a_val
            c['total_assets_formatted'] = format_inr(a_val)
            c['liabilities'] = l_val
            c['liabilities_formatted'] = format_inr(l_val)
            c['net_worth'] = a_val - l_val
            c['net_worth_formatted'] = format_inr(a_val - l_val)
            c['is_crorepati'] = a_val >= 10000000
            return cand_id

        with ThreadPoolExecutor(max_workers=8) as executor:
            futs = [executor.submit(fetch_cand, c) for c in cands_needing_page_fetch]
            done_cnt = 0
            for f in as_completed(futs):
                done_cnt += 1
                if done_cnt % 25 == 0 or done_cnt == len(futs):
                    print(f"  Fetched {done_cnt}/{len(futs)} candidate profiles")

    # PASS 3: MATCHING AND MERGING INTO public/data/andhra_candidates_2024.json
    print("=== PASS 3: MERGING INTO andhra_candidates_2024.json ===")

    party_aliases = {
        'TDP': ['TDP', 'Telugu Desam', 'Telugu Desam Party'],
        'YSRCP': ['YSRCP', 'YSR Congress', 'YSR Congress Party', 'Yuvajana Sramika Rythu Congress Party'],
        'JSP': ['JSP', 'Janasena', 'Jana Sena Party', 'Janasena Party'],
        'BJP': ['BJP', 'Bharatiya Janata Party'],
        'INC': ['INC', 'Congress', 'Indian National Congress'],
        'CPI': ['CPI', 'Communist Party of India'],
        'CPM': ['CPM', 'CPI(M)', 'Communist Party of India (Marxist)'],
        'BSP': ['BSP', 'Bahujan Samaj Party'],
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
        return re.sub(r'[^a-zA-Z]', '', n.lower())

    matched_count = 0
    updated_placeholders = 0

    for ac_no in range(1, 176):
        ac_str = str(ac_no)
        ac_data = existing_data.get(ac_str)
        if not ac_data:
            continue

        myneta_cands = all_cands_by_ac.get(ac_no, [])
        existing_cands = ac_data.get('candidates', [])

        used_myneta = set()

        # 1. Match Winner (Rank 1)
        r1 = next((c for c in existing_cands if c.get('rank') == 1), None)
        if r1:
            # Find MyNeta winner
            m_win = next((c for c in myneta_cands if c['is_winner']), None)
            if not m_win:
                # Find by party match
                m_win = next((c for c in myneta_cands if normalize_party(c['party']) == r1['party']), None)
            if m_win:
                used_myneta.add(id(m_win))
                matched_count += 1
                r1['name'] = m_win['name']
                r1['myneta'] = {
                    'criminal_cases': m_win['criminal_cases'],
                    'education': m_win['education'],
                    'age': m_win['age'],
                    'total_assets': m_win['total_assets'],
                    'total_assets_formatted': m_win['total_assets_formatted'],
                    'liabilities': m_win['liabilities'],
                    'liabilities_formatted': m_win['liabilities_formatted'],
                    'net_worth': m_win['net_worth'],
                    'net_worth_formatted': m_win['net_worth_formatted'],
                    'is_crorepati': m_win['is_crorepati']
                }

        # 2. Match Runner-up (Rank 2)
        r2 = next((c for c in existing_cands if c.get('rank') == 2), None)
        if r2:
            r2_party = r2['party']
            m_runner = None
            # Look for exact party match among remaining MyNeta candidates
            candidates_with_party = [c for c in myneta_cands if id(c) not in used_myneta and normalize_party(c['party']) == r2_party]
            if candidates_with_party:
                m_runner = candidates_with_party[0]
            else:
                # Try name similarity
                r2_clean = normalize_name(r2['name'])
                for c in myneta_cands:
                    if id(c) not in used_myneta:
                        c_clean = normalize_name(c['name'])
                        if r2_clean and (r2_clean in c_clean or c_clean in r2_clean):
                            m_runner = c
                            break
            if m_runner:
                used_myneta.add(id(m_runner))
                matched_count += 1
                r2['name'] = m_runner['name']
                r2['myneta'] = {
                    'criminal_cases': m_runner['criminal_cases'],
                    'education': m_runner['education'],
                    'age': m_runner['age'],
                    'total_assets': m_runner['total_assets'],
                    'total_assets_formatted': m_runner['total_assets_formatted'],
                    'liabilities': m_runner['liabilities'],
                    'liabilities_formatted': m_runner['liabilities_formatted'],
                    'net_worth': m_runner['net_worth'],
                    'net_worth_formatted': m_runner['net_worth_formatted'],
                    'is_crorepati': m_runner['is_crorepati']
                }

        # 3. Match Rank 3 (often INC or INDIA alliance partner CPI/CPM)
        r3 = next((c for c in existing_cands if c.get('rank') == 3), None)
        if r3:
            m_r3 = None
            # Check for INC candidates first
            inc_cands = [c for c in myneta_cands if id(c) not in used_myneta and normalize_party(c['party']) == 'INC']
            if inc_cands:
                m_r3 = inc_cands[0]
            else:
                # Check for CPI or CPM (INDIA alliance partners in AP 2024)
                left_cands = [c for c in myneta_cands if id(c) not in used_myneta and normalize_party(c['party']) in ['CPI', 'CPM']]
                if left_cands:
                    m_r3 = left_cands[0]
                    # Update party to the true alliance party
                    r3['party'] = normalize_party(m_r3['party'])
                    r3['raw_party'] = m_r3['party']
            if not m_r3:
                # Check BSP or IND
                other_major = [c for c in myneta_cands if id(c) not in used_myneta and normalize_party(c['party']) == r3.get('party')]
                if other_major:
                    m_r3 = other_major[0]

            if m_r3:
                used_myneta.add(id(m_r3))
                matched_count += 1
                if 'candidate' in r3['name'].lower():
                    updated_placeholders += 1
                r3['name'] = m_r3['name']
                r3['myneta'] = {
                    'criminal_cases': m_r3['criminal_cases'],
                    'education': m_r3['education'],
                    'age': m_r3['age'],
                    'total_assets': m_r3['total_assets'],
                    'total_assets_formatted': m_r3['total_assets_formatted'],
                    'liabilities': m_r3['liabilities'],
                    'liabilities_formatted': m_r3['liabilities_formatted'],
                    'net_worth': m_r3['net_worth'],
                    'net_worth_formatted': m_r3['net_worth_formatted'],
                    'is_crorepati': m_r3['is_crorepati']
                }

        # 4. Add remaining MyNeta candidates
        nota_cand = next((c for c in existing_cands if c.get('is_nota')), None)
        base_cands = [c for c in existing_cands if not c.get('is_nota')]
        cur_rank = max((c['rank'] for c in base_cands), default=0)

        for mc in myneta_cands:
            if id(mc) in used_myneta:
                continue
            cur_rank += 1
            base_cands.append({
                'rank': cur_rank,
                'name': mc['name'],
                'party': normalize_party(mc['party']),
                'raw_party': mc['party'],
                'votes': 0,
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
            cur_rank += 1
            nota_cand['rank'] = cur_rank
            base_cands.append(nota_cand)

        ac_data['candidates'] = base_cands
        ac_data['total_candidates'] = len(base_cands)

    print(f"Matched major candidates: {matched_count}")
    print(f"Updated placeholders to real names: {updated_placeholders}")

    output_path = 'public/data/andhra_candidates_2024.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully written to {output_path}!")

if __name__ == '__main__':
    parse_all_constituencies()

