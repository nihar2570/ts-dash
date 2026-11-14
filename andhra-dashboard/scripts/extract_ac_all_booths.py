#!/usr/bin/env python3
"""
Statewide / AC Batch SIR 2026 Draft Roll Extractor
--------------------------------------------------
Extracts all polling stations for an AC using local PDFs from D:\\apdata\\sir2026.
Multi-threaded, streaming into RAM, zero disk clutter, saves compact JSONs to:
    andhra-dashboard/public/data/voters/ac_{ac}/booth_{booth}.json
And updates andhra-dashboard/public/data/booths/ac_{ac}.json with isAuthenticExtract = True.
"""

import os
import sys
import json
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse

# Ensure scripts dir is in path to import extract_booth_voters
sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_booth_voters import extract_booth_voters, find_local_booth_pdf

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def run_batch_extraction(ac_no: int, max_workers: int = 8, limit: int = None):
    t0 = time.time()
    print(f"\n========================================================")
    print(f"🚀 STARTING BATCH EXTRACTION: AC #{ac_no} (SIR 2026 DRAFT ROLLS)")
    print(f"========================================================")

    # Locate ac booths metadata
    booth_file = Path(f"andhra-dashboard/public/data/booths/ac_{ac_no}.json")
    if not booth_file.exists():
        booth_file = Path(f"public/data/booths/ac_{ac_no}.json")

    if not booth_file.exists():
        print(f"❌ Error: Could not find metadata file {booth_file}")
        return

    with open(booth_file, "r", encoding="utf-8") as f:
        booths = json.load(f)

    total_booths = len(booths)
    print(f"📊 Cataloged Polling Stations in AC #{ac_no}: {total_booths}")

    if limit and limit > 0:
        booths = booths[:limit]
        print(f"⚠️ Limiting extraction to first {limit} booths as requested.")

    # Target directory
    out_dir = Path("andhra-dashboard/public/data/voters") / f"ac_{ac_no}"
    if not Path("andhra-dashboard").exists() and Path("public/data").exists():
        out_dir = Path("public/data/voters") / f"ac_{ac_no}"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"💾 Destination Folder: {out_dir.resolve()}")
    print(f"🧵 Parallel Workers: {max_workers}\n")

    completed = 0
    total_electors = 0
    errors = []

    def extract_single(b_item):
        b_no = b_item.get("booth_no")
        try:
            res = extract_booth_voters(ac=ac_no, booth=b_no, year=2026, state="S01", out_dir=str(out_dir), verbose=False)
            return {"booth_no": b_no, "success": True, "electors": res.get("totalElectors", 0), "res": res}
        except Exception as e:
            return {"booth_no": b_no, "success": False, "error": str(e)}

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(extract_single, b): b for b in booths}
        for future in as_completed(futures):
            res = future.result()
            completed += 1
            b_no = res["booth_no"]
            if res["success"]:
                e_count = res["electors"]
                total_electors += e_count
                pct = (completed / len(booths)) * 100
                print(f"[{completed:3d}/{len(booths):3d} - {pct:5.1f}%] ✅ Booth #{b_no:3d} Extracted: {e_count:4d} Electors")
            else:
                errors.append(b_no)
                print(f"[{completed:3d}/{len(booths):3d}] ❌ Booth #{b_no:3d} Failed: {res.get('error')}")

    # Update booths metadata with isAuthenticExtract = True
    print(f"\n🔄 Updating AC #{ac_no} booth metadata with authentic extraction status...")
    with open(booth_file, "r", encoding="utf-8") as f:
        meta_booths = json.load(f)

    for b in meta_booths:
        b_json = out_dir / f"booth_{b.get('booth_no')}.json"
        if b_json.exists():
            b["isAuthenticExtract"] = True
            b["roll_extracted"] = True
            b["electors_verified"] = True

    with open(booth_file, "w", encoding="utf-8") as f:
        json.dump(meta_booths, f, indent=2)

    elapsed = time.time() - t0
    print(f"\n========================================================")
    print(f"🎉 EXTRACTION COMPLETE: AC #{ac_no}")
    print(f"--------------------------------------------------------")
    print(f"  • Successfully Extracted: {completed - len(errors)} / {len(booths)} booths")
    print(f"  • Total Registered Electors: {total_electors:,}")
    print(f"  • Failures: {len(errors)}")
    print(f"  • Time Elapsed: {elapsed:.1f}s ({elapsed / max(1, completed):.2f}s per booth)")
    print(f"  • Status: AC #{ac_no} marked as isAuthenticExtract = True")
    print(f"========================================================\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch extract all voter rolls for an AC.")
    parser.add_argument("--ac", type=int, default=1, help="Assembly Constituency Number (e.g. 1)")
    parser.add_argument("--workers", type=int, default=8, help="Number of parallel worker threads")
    parser.add_argument("--limit", type=int, default=None, help="Optional limit for testing")
    args = parser.parse_args()

    run_batch_extraction(ac_no=args.ac, max_workers=args.workers, limit=args.limit)
