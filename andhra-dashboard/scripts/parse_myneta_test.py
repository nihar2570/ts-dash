import re
from bs4 import BeautifulSoup

with open('homepage_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print("Page Title:", soup.title.string if soup.title else "No title")

links = soup.find_all('a', href=True)
print(f"Total links found: {len(links)}")

constituency_links = []
candidate_links = []
other_interesting = []

for a in links:
    href = a['href']
    text = a.get_text(strip=True)
    if 'constituency_id' in href or 'action=show_candidates' in href:
        constituency_links.append((text, href))
    elif 'candidate_id' in href:
        candidate_links.append((text, href))
    elif any(k in href.lower() for k in ['winner', 'crorepati', 'crime', 'education', 'asset', 'all_candidates', 'show_all']):
        other_interesting.append((text, href))

print(f"Constituency links found: {len(constituency_links)}")
for t, h in constituency_links[:10]:
    print(f"  AC: {t} -> {h}")

print(f"Other interesting links found: {len(other_interesting)}")
for t, h in other_interesting[:15]:
    print(f"  {t} -> {h}")

