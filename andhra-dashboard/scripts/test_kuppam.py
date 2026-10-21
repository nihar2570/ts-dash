import sys
import urllib.request
import re
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

def fetch_constituency(cid):
    url = f"https://www.myneta.info/AndhraPradesh2024/index.php?action=show_candidates&constituency_id={cid}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def parse_currency(text):
    if not text:
        return 0, '₹0'
    clean_txt = text.replace('\xa0', ' ').strip()
    # Pattern like Rs 53,11,36,363~ 53 Crore+
    m = re.search(r'Rs\.?\s*([0-9,]+)', clean_txt, re.IGNORECASE)
    if m:
        num_str = m.group(1).replace(',', '')
        try:
            val = int(num_str)
            # Generate clean formatted string (in Indian notation: Cr / Lacs / K)
            if val >= 10000000:
                fmt = f"₹{val / 10000000:.2f} Cr"
            elif val >= 100000:
                fmt = f"₹{val / 100000:.2f} L"
            elif val >= 1000:
                fmt = f"₹{val / 1000:.1f} K"
            elif val > 0:
                fmt = f"₹{val:,}"
            else:
                fmt = "₹0"
            return val, fmt
        except ValueError:
            pass
    return 0, '₹0'

# Test with Kuppam (cid=186)
html = fetch_constituency(186)
soup = BeautifulSoup(html, 'html.parser')
tables = soup.find_all('table')

print("--- KUPPAM CANDIDATES ---")
for r in tables[2].find_all('tr'):
    tds = r.find_all('td')
    if not tds:
        continue
    cand_a = tds[1].find('a')
    cand_name = cand_a.get_text(strip=True) if cand_a else tds[1].get_text(strip=True)
    is_winner = 'winner' in tds[1].get_text(strip=True).lower()
    party = tds[2].get_text(strip=True)
    
    # Criminal cases
    crime_str = tds[3].get_text(strip=True)
    crime = int(crime_str) if crime_str.isdigit() else 0
    
    # Education
    edu = tds[4].get_text(strip=True) or 'Not Given'
    
    # Age
    age_str = tds[5].get_text(strip=True)
    age = int(age_str) if age_str.isdigit() else 0
    
    # Assets & Liab
    assets_raw = tds[6].get_text(strip=True)
    liab_raw = tds[7].get_text(strip=True)
    
    assets_val, assets_fmt = parse_currency(assets_raw)
    liab_val, liab_fmt = parse_currency(liab_raw)
    net_val = assets_val - liab_val
    if net_val >= 10000000:
        net_fmt = f"₹{net_val / 10000000:.2f} Cr"
    elif net_val >= 100000:
        net_fmt = f"₹{net_val / 100000:.2f} L"
    elif net_val >= 1000:
        net_fmt = f"₹{net_val / 1000:.1f} K"
    elif net_val > 0:
        net_fmt = f"₹{net_val:,}"
    elif net_val < 0:
        if abs(net_val) >= 10000000:
            net_fmt = f"-₹{abs(net_val) / 10000000:.2f} Cr"
        elif abs(net_val) >= 100000:
            net_fmt = f"-₹{abs(net_val) / 100000:.2f} L"
        else:
            net_fmt = f"-₹{abs(net_val):,}"
    else:
        net_fmt = "₹0"
        
    is_crorepati = assets_val >= 10000000
    
    print(f"{cand_name} ({party}) [{'WINNER' if is_winner else 'CONT'}] - Age: {age}, Edu: {edu}, Cases: {crime}, Assets: {assets_fmt} ({assets_val:,}), Liab: {liab_fmt}, Net: {net_fmt}, Crorepati: {is_crorepati}")
