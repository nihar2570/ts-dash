import urllib.request
import csv
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== PHASE 2: ANDHRA PRADESH POLLING STATION DIRECTORY EXTRACTION ===")

URL_ID = 'https://raw.githubusercontent.com/raphael-susewind/india-religion-politics/master/andhraid/andhraid.csv'
URL_GIS = 'https://raw.githubusercontent.com/raphael-susewind/india-religion-politics/master/andhragis/andhragis.csv'

# Load current election metadata for AC name verification
with open('public/data/andhra_elections.json', 'r', encoding='utf-8') as f:
    elections_meta = json.load(f)['results']['2024']

# 1. Download and parse GIS coordinates
print("Downloading GIS coordinates (andhragis.csv)...")
req_gis = urllib.request.Request(URL_GIS, headers={'User-Agent': 'Mozilla/5.0'})
gis_content = urllib.request.urlopen(req_gis, timeout=30).read().decode('utf-8', errors='ignore')
gis_reader = csv.DictReader(io.StringIO(gis_content))

gis_map = {} # (ac_no, booth_no) -> {lat, lng, is_urban, name}
for row in gis_reader:
    ac_old_str = row.get('ac_id_09', '').strip()
    if not ac_old_str.isdigit():
        continue
    ac_old = int(ac_old_str)
    if 120 <= ac_old <= 294:
        ac_new = ac_old - 119
        booth_str = row.get('booth_id_14', '').strip()
        if not booth_str.isdigit():
            continue
        booth_no = int(booth_str)
        try:
            lat = float(row.get('latitude', 0)) if row.get('latitude') else None
            lng = float(row.get('longitude', 0)) if row.get('longitude') else None
        except:
            lat, lng = None, None
        
        modis = row.get('modis', '').strip().lower()
        is_urban = modis == 'urban' or row.get('modis_rank') in ['1', '2', '3']
        
        gis_map[(ac_new, booth_no)] = {
            'lat': lat,
            'lng': lng,
            'is_urban': is_urban,
            'raw_name': row.get('booth_name_14', '').strip(),
            'district_14': row.get('district_name_14', '').strip(),
        }

print(f"Loaded GIS records for {len(gis_map)} polling stations across AP.")

# 2. Download and parse ID / directory metadata
print("Downloading directory metadata (andhraid.csv)...")
req_id = urllib.request.Request(URL_ID, headers={'User-Agent': 'Mozilla/5.0'})
id_content = urllib.request.urlopen(req_id, timeout=45).read().decode('utf-8', errors='ignore')
id_reader = csv.reader(io.StringIO(id_content))
id_header = next(id_reader)

# Map header positions
# ['ac_id_09', 'booth_id_14', 'booth_name_14', 'booth_address_14', 'parts_14', 'town_14', 'thana_14', 'mandal_14', 'revenue_14', 'district_14', 'pincode_14', 'pc_id_09', 'pc_name_09', 'pc_reserved_09', 'ac_name_14', 'ac_reserved_14']

booths_by_ac = {i: [] for i in range(1, 176)}

for row in id_reader:
    if not row or len(row) < 4:
        continue
    ac_old_str = row[0].strip()
    if not ac_old_str.isdigit():
        continue
    ac_old = int(ac_old_str)
    if 120 <= ac_old <= 294:
        ac_new = ac_old - 119
        booth_str = row[1].strip()
        if not booth_str.isdigit():
            continue
        booth_no = int(booth_str)
        
        village_locality = row[2].strip().strip('"')
        building_address = row[3].strip().strip('"') if len(row) > 3 else ''
        sections = row[4].strip().strip('"') if len(row) > 4 else ''
        town = row[5].strip().strip('"') if len(row) > 5 else ''
        mandal = row[7].strip().strip('"') if len(row) > 7 else ''
        district_raw = row[9].strip().strip('"') if len(row) > 9 else ''
        pincode = row[10].strip().strip('"') if len(row) > 10 else ''
        
        gis = gis_map.get((ac_new, booth_no), {})
        
        # Determine best display name
        display_name = building_address if building_address else village_locality
        if display_name and not display_name.startswith('Mandal') and not display_name.startswith('Zilla') and not display_name.startswith('Zph'):
            if 'School' in display_name or 'Hall' in display_name or 'Building' in display_name:
                pass
            elif village_locality and village_locality != display_name:
                display_name = f"{display_name}, {village_locality}"
        
        booths_by_ac[ac_new].append({
            'booth_no': booth_no,
            'name': display_name or f"Polling Station #{booth_no}",
            'building': building_address,
            'locality': village_locality or town,
            'sections': sections,
            'mandal': mandal,
            'pincode': pincode,
            'lat': gis.get('lat'),
            'lng': gis.get('lng'),
            'is_urban': gis.get('is_urban', False),
        })

# Check which ACs had no entries in ID file and backfill from GIS
backfilled_count = 0
for ac_new in range(1, 176):
    if len(booths_by_ac[ac_new]) == 0:
        # Find in GIS
        for (ac_k, b_k), gis in gis_map.items():
            if ac_k == ac_new:
                booths_by_ac[ac_new].append({
                    'booth_no': b_k,
                    'name': gis.get('raw_name') or f"Polling Station #{b_k}",
                    'building': gis.get('raw_name') or '',
                    'locality': elections_meta[str(ac_new)]['ac_name'],
                    'sections': '',
                    'mandal': elections_meta[str(ac_new)]['ac_name'],
                    'pincode': '',
                    'lat': gis.get('lat'),
                    'lng': gis.get('lng'),
                    'is_urban': gis.get('is_urban', False),
                })
                backfilled_count += 1

print(f"Backfilled {backfilled_count} stations from GIS coordinates.")

# Sort booths by booth_no within each AC
for ac_new in range(1, 176):
    booths_by_ac[ac_new].sort(key=lambda x: x['booth_no'])

# Save unified booths directory
os.makedirs('public/data/booths', exist_ok=True)
output_file = 'public/data/booths/ap_polling_stations.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(booths_by_ac, f, indent=2, ensure_ascii=False)

total_booths = sum(len(b) for b in booths_by_ac.values())
print(f"Saved {total_booths} official polling stations across all 175 ACs to {output_file}!")

# Print quick sample
for test_ac in [1, 37, 129, 137, 175]:
    meta = elections_meta[str(test_ac)]
    b_list = booths_by_ac[test_ac]
    print(f"\nAC {test_ac} ({meta['ac_name']}, {meta['district']}): {len(b_list)} booths")
    for b in b_list[:3]:
        print(f"  Booth #{b['booth_no']}: {b['name']} | Mandal: {b['mandal']} | GPS: ({b['lat']}, {b['lng']})")

print("\n=== PHASE 2 COMPLETED SUCCESSFULLY ===")

