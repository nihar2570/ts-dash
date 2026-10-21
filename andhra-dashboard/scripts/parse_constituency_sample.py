from bs4 import BeautifulSoup
import re

with open('sample_constituency.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
tables = soup.find_all('table')
print(f"Number of tables: {len(tables)}")

for idx, t in enumerate(tables):
    rows = t.find_all('tr')
    print(f"\n--- Table {idx} (rows: {len(rows)}) ---")
    for r in rows[:5]:
        cells = [c.get_text(strip=True) for c in r.find_all(['th', 'td'])]
        print("   ", cells)

