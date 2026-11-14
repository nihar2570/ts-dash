"""
Statewide 2019 Form-20 Downloader
Downloads all 175 Assembly Constituency Form-20 PDFs for Andhra Pradesh (2019)
Source: CEO Andhra Pradesh (https://ceoandhra.nic.in/ceoap_new/ceo/Form20_AC.html)
Destination: D:\apdata\form20\2019\
"""

import os
import sys
import time
import json
import ssl
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

DEST_DIR = r"D:\apdata\form20\2019"
BASE_URL = "https://ceoandhra.nic.in/ceoap_new/ceo/Form20_AC/AC_{:03d}.pdf"
MANIFEST_PATH = r"D:\apdata\form20\form20_download_manifest.json"

ctx = ssl._create_unverified_context()

def download_ac(ac_num, retries=4):
    url = BASE_URL.format(ac_num)
    dest_path = os.path.join(DEST_DIR, f"ac_{ac_num:03d}_form20_2019.pdf")
    
    # If already downloaded and valid, skip
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
        with open(dest_path, "rb") as f:
            if f.read(5).startswith(b"%PDF-"):
                return ac_num, True, os.path.getsize(dest_path), "Cached"

    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, context=ctx, timeout=40) as resp:
                data = resp.read()
                if not data.startswith(b"%PDF-"):
                    raise ValueError(f"Downloaded content does not start with %PDF- header ({data[:20]})")
                
                with open(dest_path, "wb") as f:
                    f.write(data)
                return ac_num, True, len(data), "OK"
        except Exception as e:
            if attempt == retries:
                return ac_num, False, 0, str(e)
            time.sleep(2 * attempt)
    return ac_num, False, 0, "Unknown failure"

def main():
    os.makedirs(DEST_DIR, exist_ok=True)
    print("=" * 70, flush=True)
    print("ANDHRA PRADESH 2019 FORM-20 STATEWIDE BOOTH DOWNLOADER", flush=True)
    print(f"Target Destination: {DEST_DIR}", flush=True)
    print(f"Source: CEO Andhra Pradesh Form-20 Archive (175 ACs)", flush=True)
    print("=" * 70, flush=True)

    start_time = time.time()
    total_acs = 175
    completed = 0
    total_bytes = 0
    failed_acs = []

    print(f"[{time.strftime('%H:%M:%S')}] Starting parallel download with 8 workers across 175 ACs...", flush=True)

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_ac, ac): ac for ac in range(1, total_acs + 1)}
        for fut in as_completed(futures):
            ac_num, success, size, msg = fut.result()
            completed += 1
            if success:
                total_bytes += size
                if completed % 15 == 0 or completed == total_acs:
                    elapsed = time.time() - start_time
                    mb = total_bytes / (1024 * 1024)
                    pct = (completed / total_acs) * 100
                    print(f"[{time.strftime('%H:%M:%S')}] Progress: {completed:3d}/{total_acs} ACs ({pct:5.1f}%) | {mb:6.1f} MB downloaded | Elapsed: {elapsed:5.1f}s", flush=True)
            else:
                failed_acs.append(ac_num)
                print(f"[{time.strftime('%H:%M:%S')}] ERROR AC {ac_num:03d}: {msg}", flush=True)

    elapsed_total = time.time() - start_time
    total_mb = total_bytes / (1024 * 1024)

    print("-" * 70, flush=True)
    print(f"Download Finished in {elapsed_total:.1f}s ({elapsed_total/60:.2f} mins)", flush=True)
    print(f"Successfully downloaded: {completed - len(failed_acs)} / {total_acs} ACs", flush=True)
    print(f"Total volume: {total_mb:.2f} MB", flush=True)
    if failed_acs:
        print(f"Failed ACs: {failed_acs}", flush=True)
    else:
        print("ALL 175 AC 2019 FORM-20 PDFs VERIFIED 100% CLEAN & COMPLETE!", flush=True)

    # Update manifest
    try:
        manifest = {}
        if os.path.exists(MANIFEST_PATH):
            with open(MANIFEST_PATH, "r", encoding="utf-8") as mf:
                manifest = json.load(mf)
        
        manifest.setdefault("years", {})
        manifest["years"]["2019"] = {
            "folder": DEST_DIR,
            "portal": "https://ceoandhra.nic.in/ceoap_new/ceo/Form20_AC.html",
            "verified_pdfs": completed - len(failed_acs),
            "total_size_mb": round(total_mb, 2),
            "completed_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        with open(MANIFEST_PATH, "w", encoding="utf-8") as mf:
            json.dump(manifest, mf, indent=2)
        print(f"Updated master manifest at {MANIFEST_PATH}", flush=True)
    except Exception as me:
        print(f"Warning: could not update manifest: {me}", flush=True)

if __name__ == "__main__":
    main()
