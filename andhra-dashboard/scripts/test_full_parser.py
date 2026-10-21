import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import time
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

CACHE_DIR = 'data/myneta_raw'
os.makedirs(CACHE_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
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
            return f.read()
    
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read().decode('utf-8', errors='ignore')
                with open(cache_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return content
        except Exception as e:
            if attempt == 2:
                print(f"Failed to fetch {url}: {e}")
                return ""
            time.sleep(1)
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
    # Decode any script tags that contain obfuscated document.write
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
        
        # Criminal cases
        crime_txt = tds[3].get_text(strip=True)
        m_crime = re.search(r'(\d+)', crime_txt)
        criminal_cases = int(m_crime.group(1)) if m_crime else 0

        # Education
        education = tds[4].get_text(strip=True) or 'Not Given'

        # Age
        age_txt = tds[5].get_text(strip=True)
        m_age = re.search(r'(\d+)', age_txt)
        age = int(m_age.group(1)) if m_age else 0

        # Assets & Liabilities
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

# Test on Kuppam (cid=186)
html_kuppam = fetch_url("https://www.myneta.info/AndhraPradesh2024/index.php?action=show_candidates&constituency_id=186", "ac_186.html")
cands = parse_constituency_html(html_kuppam, 186)
print(f"Parsed {len(cands)} candidates for Kuppam (cid 186):")
for c in cands:
    print(f"  [{c['party']}] {c['name']} (Winner: {c['is_winner']}) - Age {c['age']}, Edu: {c['education']}, Cases: {c['criminal_cases']}, Net: {c['net_worth_formatted']}, Assets: {c['total_assets_formatted']}")
