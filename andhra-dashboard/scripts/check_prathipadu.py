from bs4 import BeautifulSoup
import re

with open('homepage_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

for a in soup.find_all('a', href=True):
    if 'PRATHIPADU' in a.get_text():
        # find the parent or preceding header to see the district
        parent = a.find_parent('div') or a.find_parent('td') or a.find_parent('tr')
        # find closest preceding h3 or b
        print("Link:", a.get_text(), "href:", a['href'])

