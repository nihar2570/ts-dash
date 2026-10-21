from bs4 import BeautifulSoup
import re

with open('homepage_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# Find all links with action=show_candidates
ac_links = []
for a in soup.find_all('a', href=True):
    href = a['href']
    if 'action=show_candidates' in href and 'constituency_id=' in href:
        m = re.search(r'constituency_id=(\d+)', href)
        if m:
            cid = int(m.group(1))
            name = a.get_text(strip=True)
            ac_links.append((cid, name, href))

print(f"Total constituency links: {len(ac_links)}")
for cid, name, href in ac_links[:30]:
    print(f"ID {cid:3d}: {name} -> {href}")

