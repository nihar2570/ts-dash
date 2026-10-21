import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

# Let's search by query on myneta
url = 'https://www.myneta.info/AndhraPradesh2024/index.php?action=summary&subAction=candidates_analyzed&sort=candidate'
# Can we search or see if Bharath is in another summary?
# Let's check 'winner' or other summaries
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=20) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')
# Are there page numbers on this table?
pagination = soup.find('div', {'class': 'pagination'}) or soup.find('ul', {'class': 'pagination'}) or soup.find_all('a', href=lambda h: h and 'page=' in h)
print('Pagination links found:', len(pagination) if pagination else 0)
for p in pagination[:10]:
    print('  ', p)

