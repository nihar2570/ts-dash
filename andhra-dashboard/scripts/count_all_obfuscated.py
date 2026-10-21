import os
import re

files = [f for f in os.listdir('data/myneta_raw') if f.startswith('ac_')]
obfuscated_count = 0
files_with_obfuscation = 0

for fn in files:
    with open(os.path.join('data/myneta_raw', fn), 'r', encoding='utf-8') as f:
        txt = f.read()
    m = re.findall(r'<script>(\s*var _0x[a-f0-9]+=\["","split".*?)</script>', txt, flags=re.DOTALL)
    if m:
        obfuscated_count += len(m)
        files_with_obfuscation += 1

print(f"Total AC files: {len(files)}")
print(f"Files with obfuscated script rows: {files_with_obfuscation}")
print(f"Total obfuscated candidate script rows across all ACs: {obfuscated_count}")

