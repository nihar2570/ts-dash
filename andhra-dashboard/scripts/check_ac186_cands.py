import re
from bs4 import BeautifulSoup
import sys
sys.path.append('scripts')
from extract_all_myneta_2024 import parse_constituency_html

with open('data/myneta_raw/ac_186.html', 'r', encoding='utf-8') as f:
    html = f.read()

cands = parse_constituency_html(html, 186)
print(f"Total cands extracted from ac_186.html: {len(cands)}")
for c in cands:
    print("  ", c['name'], c['party'], c['total_assets_formatted'])

