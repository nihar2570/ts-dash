import json

d = json.load(open('public/data/andhra_elections.json'))['results']['2024']
out = [
    '// Official CEO Andhra Pradesh 2024 General Election Form-20 (Polling Station Result Sheets)',
    '// State Code: S01 (Andhra Pradesh) - 175 Assembly Constituencies',
    '// ECI Portal: https://voters.eci.gov.in/ | CEO AP: https://ceoandhra.nic.in/',
    '',
    'export const FORM_20_URLS: Record<number, string> = {',
]

for i in range(1, 176):
    name = d[str(i)]['ac_name'].replace(' ', '%20')
    out.append(f'  {i}: "https://ceoandhra.nic.in/GE_2024/FORM-20/{i}-{name}.pdf",')

out.append('};')
out.append('')

with open('src/data/form20Urls.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print('Updated form20Urls.ts for all 175 AP ACs!')

