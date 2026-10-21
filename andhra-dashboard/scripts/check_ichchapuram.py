from bs4 import BeautifulSoup
import re
import urllib.request

with open('homepage_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

for a in soup.find_all('a', href=True):
    if 'ICHCHAPURAM' in a.get_text().upper():
        print(a.get_text(), a['href'])
        url = 'https://www.myneta.info/AndhraPradesh2024/' + a['href']
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            ac_html = resp.read().decode('utf-8', errors='ignore')
        ac_soup = BeautifulSoup(ac_html, 'html.parser')
        tables = ac_soup.find_all('table')
        for r in tables[2].find_all('tr'):
            tds = r.find_all('td')
            if tds:
                name = tds[1].find('a').get_text(strip=True) if tds[1].find('a') else tds[1].get_text(strip=True)
                party = tds[2].get_text(strip=True)
                crime = tds[3].get_text(strip=True)
                edu = tds[4].get_text(strip=True)
                age = tds[5].get_text(strip=True)
                assets = tds[6].get_text(strip=True)
                liab = tds[7].get_text(strip=True)
                print(f"  Candidate: {name} | Party: {party} | Crime: {crime} | Edu: {edu} | Age: {age} | Assets: {assets} | Liab: {liab}")

