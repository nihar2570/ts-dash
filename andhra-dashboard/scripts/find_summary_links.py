from bs4 import BeautifulSoup
import re

with open('homepage_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print("All menu/nav links:")
for a in soup.find_all('a', href=True):
    href = a['href']
    t = a.get_text(strip=True)
    if 'summary' in href or 'candidate' in href or 'all' in href.lower() or 'party' in href.lower():
        print(f"  {t} -> {href}")

