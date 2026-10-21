from bs4 import BeautifulSoup

with open('sample_constituency.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
tables = soup.find_all('table')
t2 = tables[2]

for r in t2.find_all('tr'):
    tds = r.find_all('td')
    if not tds:
        continue
    cand_td = tds[1]
    cand_a = cand_td.find('a')
    cand_name = cand_a.get_text(strip=True) if cand_a else cand_td.get_text(strip=True)
    is_winner = bool(cand_td.find('span') and 'winner' in cand_td.find('span').get_text(strip=True).lower()) or 'winner' in cand_td.get_text(strip=True).lower()
    cand_link = cand_a['href'] if cand_a else ''
    party = tds[2].get_text(strip=True)
    crime = tds[3].get_text(strip=True)
    edu = tds[4].get_text(strip=True)
    age = tds[5].get_text(strip=True)
    assets_raw = tds[6].get_text(strip=True)
    liab_raw = tds[7].get_text(strip=True)
    print(f"Name: {cand_name} | Winner: {is_winner} | Party: {party} | Crime: {crime} | Edu: {edu} | Age: {age} | Assets: {assets_raw} | Liab: {liab_raw} | Link: {cand_link}")

