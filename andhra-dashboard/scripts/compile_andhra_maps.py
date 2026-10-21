"""
Compile and Standardize Andhra Pradesh Assembly & District GeoJSON
------------------------------------------------------------------
1. Combines 193 raw assembly features into exactly 175 unified AC features (1-175).
2. Standardizes properties: AC_NO, AC_NAME, DIST_NAME, PC_NAME, etc.
3. Groups ACs into 26 AP districts, computing centroids, AC lists, and constituency counts.
4. Generates:
   - public/data/andhra_assembly.geojson
   - public/data/andhra_districts.geojson
   - public/data/telangana_assembly.geojson (backward-compatible mirror)
   - public/data/telangana_districts.geojson (backward-compatible mirror)
"""

import json
import os
from collections import defaultdict

def round_coords(geom, precision=5):
    if not geom: return geom
    t = geom['type']
    coords = geom['coordinates']
    def round_pt(pt):
        return [round(pt[0], precision), round(pt[1], precision)]
    def round_ring(ring):
        return [round_pt(p) for p in ring]
    def round_poly(poly):
        return [round_ring(r) for r in poly]
    
    if t == 'Polygon':
        geom['coordinates'] = round_poly(coords)
    elif t == 'MultiPolygon':
        geom['coordinates'] = [round_poly(p) for p in coords]
    return geom

def compute_centroid(coords, geom_type):
    # Quick bounding-box midpoint approximation for label positioning
    pts = []
    if geom_type == 'Polygon':
        for ring in coords:
            for pt in ring:
                pts.append(pt)
    elif geom_type == 'MultiPolygon':
        for poly in coords:
            for ring in poly:
                for pt in ring:
                    pts.append(pt)
    if not pts:
        return [80.0, 16.0]
    lons = [p[0] for p in pts]
    lats = [p[1] for p in pts]
    return [round((min(lons) + max(lons)) / 2, 5), round((min(lats) + max(lats)) / 2, 5)]

def main():
    print("Loading raw Andhra Pradesh GeoJSON datasets...")
    with open('public/data/andhra_assembly_raw.geojson', 'r', encoding='utf-8') as f:
        ac_raw = json.load(f)

    with open('public/data/andhra_elections.json', 'r', encoding='utf-8') as f:
        elections = json.load(f)
    results_2023 = elections['results']['2023']

    # 1. Group features by AC Number (1-175)
    ac_map = defaultdict(list)
    for feat in ac_raw['features']:
        props = feat.get('properties', {})
        ac_no = int(round(float(props['ac_no'])))
        ac_map[ac_no].append(feat)

    print(f"Aggregating {len(ac_raw['features'])} raw features into {len(ac_map)} Assembly Constituencies...")
    unified_ac_features = []
    district_ac_map = defaultdict(list)

    for ac_no in range(1, 176):
        feats = ac_map.get(ac_no, [])
        if not feats:
            print(f"Warning: AC #{ac_no} missing from GeoJSON!")
            continue

        base_props = feats[0]['properties']
        ac_str = str(ac_no)
        elect_meta = results_2023.get(ac_str, {})

        ac_name = elect_meta.get('ac_name') or base_props.get('ac_name') or f"AC {ac_no}"
        district_name = elect_meta.get('district') or base_props.get('district_name') or "Andhra Pradesh"
        pc_name = elect_meta.get('pc_name') or base_props.get('loksabha_constituency_name') or ""
        reservation = elect_meta.get('category') or base_props.get('reservation', 'GEN')

        # Combine geometry coordinates if multiple
        polygons = []
        for feat in feats:
            geom = feat.get('geometry', {})
            geom_type = geom.get('type')
            coords = geom.get('coordinates', [])
            if geom_type == 'Polygon':
                polygons.append(coords)
            elif geom_type == 'MultiPolygon':
                polygons.extend(coords)

        if len(polygons) == 1:
            unified_geom = {
                'type': 'Polygon',
                'coordinates': polygons[0]
            }
        else:
            unified_geom = {
                'type': 'MultiPolygon',
                'coordinates': polygons
            }

        round_coords(unified_geom, 5)

        props = {
            'AC_NO': ac_no,
            'AC_NAME': ac_name,
            'DIST_NAME': district_name,
            'PC_NAME': pc_name,
            'RESERVATION': reservation,
            'ac_no': ac_no,
            'ac_name': ac_name,
            'district': district_name,
            'ST_CODE': '28',
            'ST_NAME': 'ANDHRA PRADESH'
        }

        district_ac_map[district_name].append(ac_no)

        unified_ac_features.append({
            'type': 'Feature',
            'properties': props,
            'geometry': unified_geom
        })

    unified_ac_geojson = {
        'type': 'FeatureCollection',
        'name': 'Andhra_Pradesh_Assembly_Constituencies_2024',
        'features': unified_ac_features
    }

    # 2. Build 26 District GeoJSON Features
    print(f"Processing 26 Districts across {len(district_ac_map)} district groupings...")
    with open('public/data/andhra_districts_raw.geojson', 'r', encoding='utf-8') as f:
        dist_raw = json.load(f)

    # Group district raw features by canonical district name
    raw_dist_features = defaultdict(list)
    for feat in dist_raw['features']:
        props = feat.get('properties', {})
        dname = props.get('district_name') or props.get('NEW_DIST')
        if dname:
            # Normalize casing/names if needed
            raw_dist_features[dname].append(feat)

    district_features = []
    dist_id = 1
    for dist_name, feats in sorted(raw_dist_features.items()):
        polygons = []
        for feat in feats:
            geom = feat.get('geometry', {})
            geom_type = geom.get('type')
            coords = geom.get('coordinates', [])
            if geom_type == 'Polygon':
                polygons.append(coords)
            elif geom_type == 'MultiPolygon':
                polygons.extend(coords)

        if not polygons:
            continue

        if len(polygons) == 1:
            geom = {'type': 'Polygon', 'coordinates': polygons[0]}
        else:
            geom = {'type': 'MultiPolygon', 'coordinates': polygons}

        round_coords(geom, 5)
        center = compute_centroid(geom['coordinates'], geom['type'])
        acs = district_ac_map.get(dist_name, [])

        district_features.append({
            'type': 'Feature',
            'properties': {
                'DIST_NAME': dist_name,
                'DIST_ID': dist_id,
                'district_name': dist_name,
                'constituency_count': len(acs),
                'acs': acs,
                'center': center,
                'grey_shade': '#f1f5f9',
                'border_grey': '#64748b'
            },
            'geometry': geom
        })
        dist_id += 1

    district_geojson = {
        'type': 'FeatureCollection',
        'name': 'Andhra_Pradesh_Districts_2024',
        'features': district_features
    }

    # Save to public/data/
    paths = [
        ('public/data/andhra_assembly.geojson', unified_ac_geojson),
        ('public/data/andhra_districts.geojson', district_geojson),
        ('public/data/telangana_assembly.geojson', unified_ac_geojson),
        ('public/data/telangana_districts.geojson', district_geojson),
    ]

    for path, data in paths:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        sz = os.path.getsize(path)
        print(f"Saved {path} ({sz:,} bytes, {len(data['features'])} features)")

    print("GeoJSON compilation finished successfully!")

if __name__ == '__main__':
    main()

