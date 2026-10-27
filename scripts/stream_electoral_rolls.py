#!/usr/bin/env python3
"""
Streaming ECI Electoral Roll Harvester & Immediate Data Processor
-----------------------------------------------------------------
Downloads Electoral Roll PDFs directly in-memory, extracts structured 
booth metrics (page counts, file sizes, estimated electorate, and optional 
OCR metadata for polling station names and exact gender voter counts),
saves clean CSV and JSON records, and discards raw PDF bytes immediately 
to completely prevent disk space pileup.

Usage:
    python scripts/stream_electoral_rolls.py --start-ac 1 --end-ac 1 --workers 5
    python scripts/stream_electoral_rolls.py --start-ac 1 --end-ac 175 --workers 10
"""

import os
import sys
import csv
import json
import time
import io
import argparse
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import requests
import pypdf

# Suppress cryptography deprecation warning if present
import warnings
warnings.filterwarnings('ignore', category=UserWarning)

# Thread safety lock for appending to consolidated CSV
csv_lock = threading.Lock()

def parse_args():
    parser = argparse.ArgumentParser(description="Stream and process ECI electoral rolls with zero PDF pileup.")
    parser.add_argument("--year", type=int, default=2026, help="Draft revision year (default: 2026)")
    parser.add_argument("--state", type=str, default="S01", help="State code (default: S01 for Andhra Pradesh, S29 for Telangana)")
    parser.add_argument("--start-ac", type=int, default=1, help="Starting AC number (default: 1)")
    parser.add_argument("--end-ac", type=int, default=175, help="Ending AC number (default: 175)")
    parser.add_argument("--max-booth", type=int, default=500, help="Maximum booths per AC to probe (default: 500)")
    parser.add_argument("--skip-ac", type=int, nargs="*", default=[28], help="AC numbers to skip (default: 28)")
    parser.add_argument("--workers", type=int, default=10, help="Concurrent worker threads (default: 10)")
    parser.add_argument("--batch-size", type=int, default=20, help="Booth batch size per wave (default: 20)")
    parser.add_argument("--stop-after-missing", type=int, default=3, help="Consecutive missing booths before moving to next AC (default: 3)")
    parser.add_argument("--ocr", action="store_true", help="Run OCR on first and last page for exact PS names and voter counts")
    parser.add_argument("--force", action="store_true", help="Force re-processing of booths even if already in catalog")
    parser.add_argument("--out-dir", type=str, default="electoral_rolls_2026", help="Output directory for structured data")
    return parser.parse_args()


def run_ocr_on_images(img1_bytes, img_last_bytes, ocr_worker_script):
    """
    Runs tesseract.js worker via Node on first and last page images.
    Returns dict with psName, address, mandal, village, district, male, female, total.
    """
    tmp_dir = Path("temp_ocr")
    tmp_dir.mkdir(exist_ok=True)
    
    t_id = threading.get_ident()
    p1_file = tmp_dir / f"p1_{t_id}_{time.time_ns()}.jpg"
    plast_file = tmp_dir / f"plast_{t_id}_{time.time_ns()}.jpg"

    try:
        if img1_bytes:
            p1_file.write_bytes(img1_bytes)
        if img_last_bytes:
            plast_file.write_bytes(img_last_bytes)

        cmd = ["node", str(ocr_worker_script), str(p1_file), str(plast_file)]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        if res.returncode == 0:
            return json.loads(res.stdout)
    except Exception as e:
        pass
    finally:
        if p1_file.exists():
            p1_file.unlink(missing_ok=True)
        if plast_file.exists():
            plast_file.unlink(missing_ok=True)

    return {}


def process_booth(ac: int, booth: int, base_url: str, year: int, state: str, do_ocr: bool, ocr_worker: Path):
    """
    Streams a single booth PDF into memory, extracts metadata, and releases PDF memory immediately.
    """
    filename = f"{year}-EROLLGEN-{state}-{ac}-SIR-DraftRoll-Revision1-ENG-{booth}-WI.pdf"
    url = f"{base_url}/{ac}/{filename}"

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    for attempt in range(2):
        try:
            with requests.get(url, headers=headers, timeout=35, stream=True) as r:
                if r.status_code == 404:
                    return {
                        "ac": ac,
                        "booth": booth,
                        "status": "missing",
                        "pages": 0,
                        "size_kb": 0,
                        "est_electors": 0,
                        "url": url,
                    }
                r.raise_for_status()

                # Read PDF directly into memory
                pdf_bytes = r.content
                if not pdf_bytes.startswith(b"%PDF"):
                    return {
                        "ac": ac,
                        "booth": booth,
                        "status": "invalid_format",
                        "pages": 0,
                        "size_kb": len(pdf_bytes) // 1024,
                        "est_electors": 0,
                        "url": url,
                    }

                size_kb = len(pdf_bytes) // 1024

                # Parse PDF in-memory with pypdf
                reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
                total_pages = len(reader.pages)
                # Standard ECI rolls have 3 intro/outro pages and 30 electors per inner page
                est_electors = max(0, (total_pages - 3) * 30)

                ocr_data = {}
                if do_ocr and ocr_worker.exists() and total_pages >= 2:
                    p1_img = None
                    plast_img = None
                    try:
                        if len(reader.pages[0].images) > 0:
                            p1_img = reader.pages[0].images[0].data
                        if len(reader.pages[-1].images) > 0:
                            plast_img = reader.pages[-1].images[0].data
                        ocr_data = run_ocr_on_images(p1_img, plast_img, ocr_worker)
                    except Exception:
                        pass

                # Explicitly delete raw bytes from memory immediately!
                del pdf_bytes

                res = {
                    "ac": ac,
                    "booth": booth,
                    "status": "processed",
                    "pages": total_pages,
                    "size_kb": size_kb,
                    "est_electors": ocr_data.get("total") or est_electors,
                    "ps_name": ocr_data.get("psName", f"Polling Station #{booth}"),
                    "ps_address": ocr_data.get("address", ""),
                    "mandal": ocr_data.get("mandal", ""),
                    "village": ocr_data.get("village", ""),
                    "district": ocr_data.get("district", ""),
                    "male": ocr_data.get("male", 0),
                    "female": ocr_data.get("female", 0),
                    "total": ocr_data.get("total", est_electors),
                    "url": url,
                    "processed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                }
                return res

        except (requests.RequestException, Exception) as err:
            if attempt == 0:
                time.sleep(1.5)
            else:
                return {
                    "ac": ac,
                    "booth": booth,
                    "status": "error",
                    "error_msg": str(err)[:100],
                    "pages": 0,
                    "size_kb": 0,
                    "est_electors": 0,
                    "url": url,
                }

    return {
        "ac": ac,
        "booth": booth,
        "status": "error",
        "error_msg": "Max retries exceeded",
        "pages": 0,
        "size_kb": 0,
        "est_electors": 0,
        "url": url,
    }


def main():
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    base_url = f"https://voters.eci.gov.in/eroll/{args.year}/{args.state.lower()}/sir-draftroll"
    ocr_worker = Path(__file__).parent / "ocr_page_worker.cjs"

    # Files for immediate append and streaming
    catalog_csv_path = out_dir / "booth_catalog_2026.csv"
    totals_csv_path = out_dir / "ac_booth_totals.csv"

    # Load existing processed booths for resume capability
    existing_processed = set()
    if catalog_csv_path.exists():
        with open(catalog_csv_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("AC") and row.get("Booth"):
                    existing_processed.add((int(row["AC"]), int(row["Booth"])))

    # Initialize catalog CSV if not present
    catalog_fields = [
        "AC", "Booth", "Status", "Pages", "Size_KB", "Est_Electors",
        "PS_Name", "PS_Address", "Mandal", "Village", "District",
        "Male_Electors", "Female_Electors", "Total_Electors", "URL", "Processed_At"
    ]
    if not catalog_csv_path.exists():
        with open(catalog_csv_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=catalog_fields)
            writer.writeheader()

    skip_acs = set(args.skip_ac)
    summary_records = []

    print(f"\n========================================================")
    print(f"🚀 ECI Electoral Roll Streaming Processor ({args.year})")
    print(f"State: {args.state} | AC Range: {args.start_ac} -> {args.end_ac} | Workers: {args.workers}")
    print(f"PDF Strategy: In-Memory Streaming -> Immediate Extract -> Discard (ZERO PDF pileup)")
    print(f"Output Directory: {out_dir.resolve()}")
    print(f"========================================================\n")

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for ac in range(args.start_ac, args.end_ac + 1):
            if ac in skip_acs:
                print(f"⏩ Skipping AC {ac:03d} (in skip list)")
                continue

            print(f"\n🏛️ === AC {ac:03d} ===")
            ac_folder = out_dir / f"AC_{ac:03d}"
            ac_folder.mkdir(parents=True, exist_ok=True)

            missing_set = set()
            available_booths = []
            errors_count = 0
            stopped = False
            last_available_booth = 0

            for start in range(1, args.max_booth + 1, args.batch_size):
                booth_batch = list(range(start, min(start + args.batch_size, args.max_booth + 1)))
                
                # Check which booths in this batch are already in catalog
                futures = {}
                for b in booth_batch:
                    if not args.force and (ac, b) in existing_processed:
                        # Already done in previous run
                        continue
                    futures[pool.submit(process_booth, ac, b, base_url, args.year, args.state, args.ocr, ocr_worker)] = b

                if futures:
                    results = []
                    for f in as_completed(futures):
                        try:
                            results.append(f.result())
                        except Exception as e:
                            results.append({"ac": ac, "booth": futures[f], "status": "error", "error_msg": str(e)})

                    results.sort(key=lambda x: x["booth"])

                    for item in results:
                        b_no = item["booth"]
                        status = item["status"]

                        if status == "processed":
                            last_available_booth = max(last_available_booth, b_no)
                            available_booths.append(item)
                            existing_processed.add((ac, b_no))

                            # Immediately write to CSV (thread-safe)
                            with csv_lock:
                                with open(catalog_csv_path, "a", newline="", encoding="utf-8-sig") as f:
                                    writer = csv.DictWriter(f, fieldnames=catalog_fields)
                                    writer.writerow({
                                        "AC": ac,
                                        "Booth": b_no,
                                        "Status": "Available",
                                        "Pages": item.get("pages", 0),
                                        "Size_KB": item.get("size_kb", 0),
                                        "Est_Electors": item.get("est_electors", 0),
                                        "PS_Name": item.get("ps_name", ""),
                                        "PS_Address": item.get("ps_address", ""),
                                        "Mandal": item.get("mandal", ""),
                                        "Village": item.get("village", ""),
                                        "District": item.get("district", ""),
                                        "Male_Electors": item.get("male", 0),
                                        "Female_Electors": item.get("female", 0),
                                        "Total_Electors": item.get("total", item.get("est_electors", 0)),
                                        "URL": item.get("url", ""),
                                        "Processed_At": item.get("processed_at", ""),
                                    })

                        elif status == "missing":
                            missing_set.add(b_no)
                        else:
                            errors_count += 1
                            print(f"    ⚠️ Booth #{b_no}: {status} ({item.get('error_msg', '')})")

                # Check consecutive missing stop condition
                for b_no in booth_batch:
                    if all(m in missing_set for m in range(b_no - args.stop_after_missing + 1, b_no + 1)):
                        stopped = True
                        break

                print(f"  Checked through Booth #{booth_batch[-1]:03d} | Available: {len(available_booths)} | Missing: {len(missing_set)} | Errors: {errors_count}")

                if stopped:
                    print(f"  🛑 {args.stop_after_missing} consecutive missing booths encountered. Reached end of AC {ac:03d} at Booth #{last_available_booth}.")
                    break

            # Save clean AC-level JSON (zero PDFs, just lightweight JSON dataset)
            ac_json_file = ac_folder / "booths.json"
            total_est_electors = sum(b.get("est_electors", 0) for b in available_booths)
            total_size_mb = round(sum(b.get("size_kb", 0) for b in available_booths) / 1024, 2)

            with open(ac_json_file, "w", encoding="utf-8") as f:
                json.dump({
                    "ac_no": ac,
                    "year": args.year,
                    "state": args.state,
                    "total_booths": len(available_booths),
                    "total_electors": total_est_electors,
                    "last_booth_no": last_available_booth,
                    "booths": available_booths,
                }, f, indent=2)

            summary_records.append({
                "AC": ac,
                "Last_Available_Booth": last_available_booth,
                "Total_Available_Booths": len(available_booths),
                "Total_Est_Electors": total_est_electors,
                "Total_Size_MB": total_size_mb,
                "Errors": errors_count,
                "Status": f"{args.stop_after_missing} consecutive missing" if stopped else "limit reached",
            })

            # Update overall AC totals CSV after every AC
            with open(totals_csv_path, "w", newline="", encoding="utf-8-sig") as f:
                writer = csv.DictWriter(f, fieldnames=[
                    "AC", "Last_Available_Booth", "Total_Available_Booths",
                    "Total_Est_Electors", "Total_Size_MB", "Errors", "Status"
                ])
                writer.writeheader()
                writer.writerows(summary_records)

    print(f"\n✅ Finished processing!")
    print(f"📁 Booth Catalog CSV: {catalog_csv_path.resolve()}")
    print(f"📊 AC Summary Totals: {totals_csv_path.resolve()}")

    tmp_dir = Path("temp_ocr")
    if tmp_dir.exists():
        try:
            for p in tmp_dir.glob("*"):
                p.unlink(missing_ok=True)
            tmp_dir.rmdir()
        except Exception:
            pass


if __name__ == "__main__":
    main()
