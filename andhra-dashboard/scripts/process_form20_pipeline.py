"""
Form-20 Polling Station Result Sheet Pipeline
Downloads, processes, extracts booth-level candidate tallies, updates public/data/booths/ac_{acNo}.json,
and deletes the PDF AC by AC to save disk space.
"""

import os
import sys
import ssl
import json
import asyncio
import urllib.request
import re
import argparse
from datetime import datetime

import pypdf
import pypdfium2 as pdfium
import cv2
import numpy as np

from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.graphics.imaging import BitmapDecoder
from winsdk.windows.storage import StorageFile

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

TRACKER_FILE = 'public/data/form20_extraction_tracker.json'

def load_tracker():
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        'total_acs': 175,
        'completed_acs': [],
        'failed_acs': [],
        'total_booths_updated': 0,
        'last_updated': None,
        'status': {}
    }

def save_tracker(tracker):
    tracker['last_updated'] = datetime.now().isoformat()
    with open(TRACKER_FILE, 'w', encoding='utf-8') as f:
        json.dump(tracker, f, indent=2)

async def ocr_image_file(abs_path, engine):
    file = await StorageFile.get_file_from_path_async(abs_path)
    stream = await file.open_async(0)
    decoder = await BitmapDecoder.create_async(stream)
    bitmap = await decoder.get_software_bitmap_async()
    return await engine.recognize_async(bitmap)

def parse_page_spatial(res, page_idx, expected_start_booth, winner_party, runner_party):
    words = []
    for line in res.lines:
        for w in line.words:
            words.append({
                'text': w.text.strip(),
                'x': w.bounding_rect.x,
                'y': w.bounding_rect.y,
                'w': w.bounding_rect.width,
                'h': w.bounding_rect.height,
                'cx': w.bounding_rect.x + w.bounding_rect.width / 2.0,
                'cy': w.bounding_rect.y + w.bounding_rect.height / 2.0,
            })

    if not words:
        return {}, expected_start_booth

    # Extract all digits in data area (cy > 700)
    num_words = []
    for w in words:
        if w['cy'] > 700:
            clean = re.sub(r'[^\d]', '', w['text'])
            if clean and len(clean) <= 5:
                w_copy = dict(w)
                w_copy['val'] = int(clean)
                num_words.append(w_copy)

    if not num_words:
        return {}, expected_start_booth

    num_words.sort(key=lambda w: w['cy'])

    # Cluster into horizontal Y-rows (+- 22px)
    rows = []
    for w in num_words:
        placed = False
        for r in rows:
            if abs(r['cy'] - w['cy']) < 22:
                r['words'].append(w)
                r['cy'] = sum(x['cy'] for x in r['words']) / len(r['words'])
                placed = True
                break
        if not placed:
            rows.append({'cy': w['cy'], 'words': [w]})

    # Keep rows that look like table data (at least 3 numeric cells)
    data_rows = [r for r in rows if len(r['words']) >= 3]
    data_rows.sort(key=lambda r: r['cy'])

    if not data_rows:
        return {}, expected_start_booth

    # Find column X-clusters across all data rows
    all_cx = [w['cx'] for r in data_rows for w in r['words']]
    all_cx.sort()

    col_clusters = []
    for cx in all_cx:
        placed = False
        for c in col_clusters:
            if abs(c['cx'] - cx) < 35:
                c['points'].append(cx)
                c['cx'] = sum(c['points']) / len(c['points'])
                placed = True
                break
        if not placed:
            col_clusters.append({'cx': cx, 'points': [cx]})

    col_clusters.sort(key=lambda c: c['cx'])
    main_cols = [c for c in col_clusters if len(c['points']) >= max(3, len(data_rows) * 0.22)]

    if len(main_cols) < 3:
        return {}, expected_start_booth

    # Find anchor booth from leftmost columns
    anchor_booth = None
    anchor_idx = None
    for idx, r in enumerate(data_rows):
        left_nums = [w['val'] for w in r['words'] if w['cx'] < 600 and 1 <= w['val'] <= 600]
        if left_nums:
            b_val = left_nums[-1]
            if expected_start_booth - 5 <= b_val <= expected_start_booth + 35:
                anchor_booth = b_val
                anchor_idx = idx
                break

    booth_mapping = {}
    for idx in range(len(data_rows)):
        if anchor_booth is not None and anchor_idx is not None:
            b_no = anchor_booth + (idx - anchor_idx)
        else:
            b_no = expected_start_booth + idx
        booth_mapping[idx] = b_no

    # Create column boundary intervals for midpoint assignment
    # Boundaries between adjacent columns are midpoints
    col_bounds = []
    for i in range(len(main_cols)):
        left = (main_cols[i-1]['cx'] + main_cols[i]['cx']) / 2.0 if i > 0 else 0
        right = (main_cols[i]['cx'] + main_cols[i+1]['cx']) / 2.0 if i < len(main_cols) - 1 else 99999
        col_bounds.append((left, right))

    grid = []
    for idx, r in enumerate(data_rows):
        row_dict = {}
        for w in r['words']:
            for c_idx, (left, right) in enumerate(col_bounds):
                if left <= w['cx'] < right:
                    row_dict[c_idx] = w['val']
                    break
        grid.append(row_dict)

    col_means = {}
    for c_idx in range(len(main_cols)):
        vals = [grid[r_idx].get(c_idx, 0) for r_idx in range(len(grid))]
        col_means[c_idx] = sum(vals) / len(vals)

    # Total columns are on the right side with high average (mean > 250 and cx > 1200)
    high_cols = [c for c in range(len(main_cols)) if col_means[c] > 250 and main_cols[c]['cx'] > 1200]
    if len(high_cols) >= 2:
        tot_valid_col = high_cols[0]
        grand_tot_col = high_cols[-1]
    elif len(high_cols) == 1:
        tot_valid_col = high_cols[0]
        grand_tot_col = high_cols[0]
    else:
        tot_valid_col = len(main_cols) - 1
        grand_tot_col = len(main_cols) - 1

    # Candidate columns are between booth cols (cx > 500) and tot_valid_col
    cand_cols = [c for c in range(len(main_cols)) if c < tot_valid_col and main_cols[c]['cx'] > 500 and col_means[c] > 10]
    cand_cols.sort(key=lambda c: col_means[c], reverse=True)

    win_col = cand_cols[0] if len(cand_cols) > 0 else None
    run_col = cand_cols[1] if len(cand_cols) > 1 else None

    results = {}
    next_start = expected_start_booth

    for idx, r_dict in enumerate(grid):
        b_no = booth_mapping[idx]
        if b_no <= 0 or b_no > 650:
            continue

        w_v = r_dict.get(win_col, 0) if win_col is not None else 0
        r_v = r_dict.get(run_col, 0) if run_col is not None else 0
        tot = r_dict.get(grand_tot_col, 0)
        valid = r_dict.get(tot_valid_col, 0)

        final_tot = max(tot, valid, w_v + r_v)
        if final_tot > 0 and (w_v + r_v) <= final_tot * 1.05:
            oth_v = max(0, final_tot - w_v - r_v)
            results[b_no] = {
                'booth_no': b_no,
                'total_votes': final_tot,
                'votes': {
                    winner_party: w_v,
                    runner_party: r_v,
                    'OTH': oth_v
                }
            }
            next_start = max(next_start, b_no + 1)

    return results, next_start

def parse_digital_pdf(reader, ac_no, winner_party, runner_party):
    results = {}
    for p_idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if not text:
            continue
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            parts = re.split(r'\s+', line)
            num_parts = []
            for p in parts:
                clean = re.sub(r'[^\d]', '', p)
                if clean and clean.isdigit():
                    num_parts.append(int(clean))

            if len(num_parts) >= 6:
                b_no = None
                data = None
                if num_parts[0] == num_parts[1] and 1 <= num_parts[0] <= 600:
                    b_no = num_parts[0]
                    data = num_parts[2:]
                elif 1 <= num_parts[0] <= 600:
                    b_no = num_parts[0]
                    data = num_parts[1:]
                elif 1 <= num_parts[1] <= 600:
                    b_no = num_parts[1]
                    data = num_parts[2:]

                if b_no and data and len(data) >= 4:
                    tot_votes = max(data)
                    if tot_votes >= 50:
                        cand_data = [v for v in data if v < tot_votes * 0.90]
                        if not cand_data:
                            cand_data = [v for v in data if v < tot_votes]
                        cand_sorted = sorted(cand_data, reverse=True)
                        w_v = cand_sorted[0] if len(cand_sorted) > 0 else 0
                        r_v = cand_sorted[1] if len(cand_sorted) > 1 else 0
                        oth_v = max(0, tot_votes - w_v - r_v)

                        results[b_no] = {
                            'booth_no': b_no,
                            'total_votes': tot_votes,
                            'votes': {
                                winner_party: w_v,
                                runner_party: r_v,
                                'OTH': oth_v
                            }
                        }
    return results

async def process_single_ac(ac_no, engine, form20_urls, cand_data, elections_data):
    ac_str = str(ac_no)
    url = form20_urls.get(ac_str)
    if not url:
        print(f"[AC {ac_no:3d}] Skipping: No Form-20 URL found")
        return 0

    res = elections_data['results']['2024'].get(ac_str, {})
    winner_party = res.get('winner', {}).get('party', 'TDP')
    runner_party = res.get('runner_up', {}).get('party', 'YSRCP')

    pdf_temp = f"temp_form20_{ac_no}.pdf"
    print(f"\n[AC {ac_no:3d}] Downloading Form-20 PDF...")

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=45) as resp:
            with open(pdf_temp, 'wb') as f:
                f.write(resp.read())

        pdf_size = os.path.getsize(pdf_temp)
        print(f"[AC {ac_no:3d}] Downloaded {pdf_size:,} bytes")

        reader = pypdf.PdfReader(pdf_temp)
        num_pages = len(reader.pages)
        print(f"[AC {ac_no:3d}] Processing {num_pages} pages...")

        all_booths_extracted = {}

        # 1. Check if PDF contains native digital text first
        total_text = sum(len(p.extract_text() or '') for p in reader.pages)
        if total_text > 2000:
            print(f"[AC {ac_no:3d}] Detected native digital text ({total_text:,} chars), using direct parser...")
            all_booths_extracted = parse_digital_pdf(reader, ac_no, winner_party, runner_party)

        # 2. If no booths extracted from text, render pages via pypdfium2
        if not all_booths_extracted:
            pdf_doc = pdfium.PdfDocument(pdf_temp)
            num_pages = len(pdf_doc)
            print(f"[AC {ac_no:3d}] Rendering {num_pages} pages with PDFium...")

            next_expected_booth = 1
            for p_idx in range(num_pages):
                temp_proc = f"temp_ac_{ac_no}_p{p_idx}_proc.jpg"
                try:
                    page = pdf_doc[p_idx]
                    bitmap = page.render(scale=2.0)
                    pil_image = bitmap.to_pil()
                    pil_image.save(temp_proc)

                    im = cv2.imread(temp_proc)
                    if im is None:
                        continue
                    h, w = im.shape[:2]

                    rotations = [None, cv2.ROTATE_90_COUNTERCLOCKWISE, cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180] if w > h else [cv2.ROTATE_90_COUNTERCLOCKWISE, None, cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180]
                    page_booths = {}

                    for rot in rotations:
                        r_im = cv2.rotate(im, rot) if rot is not None else im
                        rh, rw = r_im.shape[:2]
                        scale = 1.0
                        if max(rh, rw) > 2400:
                            scale = 2400.0 / max(rh, rw)
                        elif rw < 2000:
                            scale = 2000.0 / rw
                        resized = cv2.resize(r_im, (int(rw * scale), int(rh * scale)), interpolation=cv2.INTER_AREA if scale < 1.0 else cv2.INTER_CUBIC)
                        cv2.imwrite(temp_proc, resized)

                        abs_proc_path = os.path.abspath(temp_proc)
                        ocr_res = await ocr_image_file(abs_proc_path, engine)
                        page_booths, next_expected = parse_page_spatial(
                            ocr_res, p_idx, next_expected_booth, winner_party, runner_party
                        )
                        if page_booths:
                            next_expected_booth = next_expected
                            all_booths_extracted.update(page_booths)
                            break
                except Exception as page_err:
                    pass
                finally:
                    if os.path.exists(temp_proc):
                        try: os.remove(temp_proc)
                        except Exception: pass

            pdf_doc.close()

        print(f"[AC {ac_no:3d}] Extracted {len(all_booths_extracted)} booth returns from Form-20")

        booth_file = f"public/data/booths/ac_{ac_no}.json"
        updated_count = 0
        if all_booths_extracted:
            existing_booths = []
            if os.path.exists(booth_file):
                with open(booth_file, 'r', encoding='utf-8') as f:
                    try: existing_booths = json.load(f)
                    except Exception: existing_booths = []

            existing_by_no = {b.get('booth_no'): b for b in existing_booths}

            for b_no, extracted in all_booths_extracted.items():
                if b_no in existing_by_no:
                    b = existing_by_no[b_no]
                else:
                    b = {
                        'booth_no': b_no,
                        'name': f"Station {b_no}",
                        'building': f"Station {b_no}",
                        'locality': "",
                        'sections': "",
                        'mandal': "",
                        'pincode': "",
                        'lat': None,
                        'lng': None,
                        'is_urban': False,
                        'electorate': None
                    }
                    existing_booths.append(b)
                    existing_by_no[b_no] = b

                b['total_votes'] = extracted['total_votes']
                b['votes'] = extracted['votes']

                w_votes = extracted['votes'].get(winner_party, 0)
                r_votes = extracted['votes'].get(runner_party, 0)
                if w_votes >= r_votes:
                    b['winner_party'] = winner_party
                    b['margin'] = w_votes - r_votes
                else:
                    b['winner_party'] = runner_party
                    b['margin'] = r_votes - w_votes

                if b['total_votes'] > 0:
                    b['margin_pct'] = round((b['margin'] / b['total_votes']) * 100, 1)
                    if b.get('electorate'):
                        b['turnout_pct'] = round((b['total_votes'] / b['electorate']) * 100, 1)

                if b['winner_party'] in ['TDP', 'JSP', 'BJP']:
                    b['tier'] = 'STRONGHOLD' if b.get('margin_pct', 0) >= 20 else 'LEAN'
                else:
                    b['tier'] = 'DEFICIT_CRITICAL' if b.get('margin_pct', 0) >= 15 else 'DEFICIT_MODERATE'

                updated_count += 1

            existing_booths.sort(key=lambda x: x.get('booth_no', 0))
            with open(booth_file, 'w', encoding='utf-8') as f:
                json.dump(existing_booths, f, indent=2, ensure_ascii=False)
            print(f"[AC {ac_no:3d}] Merged into {booth_file} ({updated_count} booths updated)")

        return updated_count

    except Exception as e:
        print(f"[AC {ac_no:3d}] Error: {e}")
        return 0

    finally:
        if os.path.exists(pdf_temp):
            try: os.remove(pdf_temp)
            except Exception: pass

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ac', type=int, help='Process single AC number')
    parser.add_argument('--limit', type=int, default=175, help='Limit number of ACs to process')
    parser.add_argument('--reset', action='store_true', help='Reset tracker before processing')
    parser.add_argument('--force', action='store_true', help='Re-process even if already completed')
    parser.add_argument('--only-partial', action='store_true', help='Only run ACs currently marked PARTIAL')
    args = parser.parse_args()

    tracker = load_tracker()
    if args.reset:
        tracker = {
            'total_acs': 175,
            'completed_acs': [],
            'failed_acs': [],
            'total_booths_updated': 0,
            'last_updated': None,
            'status': {}
        }
        save_tracker(tracker)

    with open('public/data/form20_urls.json', 'r', encoding='utf-8') as f:
        form20_urls = json.load(f)

    with open('public/data/andhra_candidates_2024.json', 'r', encoding='utf-8') as f:
        cand_data = json.load(f)

    with open('public/data/andhra_elections.json', 'r', encoding='utf-8') as f:
        elections_data = json.load(f)

    engine = OcrEngine.try_create_from_user_profile_languages()
    if not engine:
        print("Error: Windows Media OCR engine could not be initialized.")
        return

    if args.ac:
        acs_to_run = [args.ac]
    elif args.only_partial:
        acs_to_run = [ac for ac in range(1, 176) if tracker.get('status', {}).get(str(ac)) != 'COMPLETED']
    else:
        # Prioritize key constituencies first, then remaining
        key_acs = [175, 1, 87, 37, 21, 147, 100, 50, 75, 125]
        remaining = [ac for ac in range(1, 176) if ac not in key_acs]
        acs_to_run = (key_acs + remaining)[:args.limit]

    print(f"Starting Form-20 Polling Station Pipeline for {len(acs_to_run)} ACs...")

    for ac in acs_to_run:
        if tracker.get('status', {}).get(str(ac)) == 'COMPLETED' and not args.force:
            print(f"[AC {ac:3d}] Already completed in tracker, skipping")
            continue
        updated = await process_single_ac(ac, engine, form20_urls, cand_data, elections_data)
        if ac not in tracker['completed_acs']:
            tracker['completed_acs'].append(ac)
        tracker['status'][str(ac)] = 'COMPLETED' if updated > 0 else 'PARTIAL'
        tracker['total_booths_updated'] += updated
        save_tracker(tracker)

    print(f"\nForm-20 Batch Completed! Total booths updated across ACs: {tracker['total_booths_updated']}")

if __name__ == '__main__':
    asyncio.run(main())
