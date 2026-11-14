"""
Download All Form-20 & Official Election Results for 2014, 2019, 2024 to D:\apdata\form20
"""

import os
import sys
import json
import time
import ssl
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_DIR = r"D:\apdata\form20"
DIR_2024 = os.path.join(BASE_DIR, "2024")
DIR_2019 = os.path.join(BASE_DIR, "2019")
DIR_2014 = os.path.join(BASE_DIR, "2014")

os.makedirs(DIR_2024, exist_ok=True)
os.makedirs(DIR_2019, exist_ok=True)
os.makedirs(DIR_2014, exist_ok=True)

URLS_FILE = "public/data/form20_urls.json"
ELECTIONS_FILE = "public/data/andhra_elections.json"

def is_valid_pdf(path):
    if not os.path.exists(path):
        return False
    if os.path.getsize(path) < 1000:
        return False
    try:
        with open(path, "rb") as f:
            header = f.read(5)
            return header.startswith(b"%PDF-")
    except Exception:
        return False

def download_file(url, target_path, label, retries=3):
    if is_valid_pdf(target_path):
        size_kb = os.path.getsize(target_path) / 1024
        return {"status": "SKIPPED", "path": target_path, "size_kb": size_kb, "label": label}
        
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, context=ctx, timeout=45) as resp:
                data = resp.read()
                if len(data) > 1000 and data[:5] == b"%PDF-":
                    with open(target_path, "wb") as f:
                        f.write(data)
                    size_kb = len(data) / 1024
                    return {"status": "DOWNLOADED", "path": target_path, "size_kb": size_kb, "label": label}
                elif attempt == retries - 1:
                    return {"status": "INVALID_DATA", "path": target_path, "size_kb": 0, "label": label}
        except Exception as e:
            if attempt == retries - 1:
                return {"status": "ERROR", "path": target_path, "size_kb": 0, "label": label, "error": str(e)}
            time.sleep(1.0 * (attempt + 1))
            
    return {"status": "FAILED", "path": target_path, "size_kb": 0, "label": label}

def main():
    print("===================================================================", flush=True)
    print("🚀 DOWNLOADING FORM-20 & ELECTION RESULTS (2014, 2019, 2024)")
    print(f"📁 Target Destination: {BASE_DIR}")
    print("===================================================================\n", flush=True)
    
    t0 = time.time()
    
    # -------------------------------------------------------------
    # 1. Official 2019 ECI Form-20 & Results Volume
    # -------------------------------------------------------------
    print("[1/3] Downloading 2019 Official ECI Form-20 Results Volume...", flush=True)
    url_2019 = "https://hindi.eci.gov.in/files/file/10252-andhra-pradesh-legislative-assembly-election-2019/?do=download&r=25075&confirm=1&t=1&csrfKey=d081708d13ba26a71f41d1cdd9ad3cc4"
    path_2019 = os.path.join(DIR_2019, "eci_andhra_2019_assembly_results.pdf")
    res_2019 = download_file(url_2019, path_2019, "2019 ECI Assembly Volume")
    print(f"  ✔ 2019 File: {os.path.basename(path_2019)} ({res_2019['size_kb']:.1f} KB) - {res_2019['status']}", flush=True)
    
    # Save 2019 tabular dataset
    if os.path.exists(ELECTIONS_FILE):
        el_data = json.load(open(ELECTIONS_FILE, encoding="utf-8"))
        res_19 = el_data.get("results", {}).get("2019", {})
        with open(os.path.join(DIR_2019, "andhra_2019_constituency_results.json"), "w", encoding="utf-8") as f:
            json.dump(res_19, f, indent=2)
        print(f"  ✔ 2019 Tabular JSON: andhra_2019_constituency_results.json saved ({len(res_19)} ACs)\n", flush=True)

    # -------------------------------------------------------------
    # 2. Official 2014 ECI Form-20 & Results Volume
    # -------------------------------------------------------------
    print("[2/3] Downloading 2014 Official ECI Form-20 Results Volume...", flush=True)
    url_2014 = "https://hindi.eci.gov.in/files/file/4055-%E0%A4%86%E0%A4%82%E0%A4%A7%E0%A5%8D%E0%A4%B0-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A6%E0%A5%87%E0%A4%B6-2014/?do=download&r=9614&confirm=1&t=1&csrfKey=d79445a7c4801a7230c4ff0eae8245df"
    path_2014 = os.path.join(DIR_2014, "eci_andhra_2014_assembly_results.pdf")
    res_2014 = download_file(url_2014, path_2014, "2014 ECI Assembly Volume")
    print(f"  ✔ 2014 File: {os.path.basename(path_2014)} ({res_2014['size_kb']:.1f} KB) - {res_2014['status']}", flush=True)
    
    # Save 2014 tabular dataset
    if os.path.exists(ELECTIONS_FILE):
        el_data = json.load(open(ELECTIONS_FILE, encoding="utf-8"))
        res_14 = el_data.get("results", {}).get("2014", {})
        with open(os.path.join(DIR_2014, "andhra_2014_constituency_results.json"), "w", encoding="utf-8") as f:
            json.dump(res_14, f, indent=2)
        print(f"  ✔ 2014 Tabular JSON: andhra_2014_constituency_results.json saved ({len(res_14)} ACs)\n", flush=True)

    # -------------------------------------------------------------
    # 3. Official 2024 Form-20 PDFs for all 175 ACs
    # -------------------------------------------------------------
    print("[3/3] Downloading 2024 Form-20 PDFs for all 175 Assembly Constituencies...", flush=True)
    urls_2024 = json.load(open(URLS_FILE, encoding="utf-8"))
    
    # Save reference copy of URLs
    with open(os.path.join(DIR_2024, "form20_urls_2024.json"), "w", encoding="utf-8") as f:
        json.dump(urls_2024, f, indent=2)
        
    tasks = []
    for ac_str, url in urls_2024.items():
        ac_no = int(ac_str)
        # Extract filename slug from URL
        base_name = url.split("/")[-1].replace("%20", "_").replace(" ", "_")
        target_name = f"ac_{ac_no:03d}_{base_name}"
        target_path = os.path.join(DIR_2024, target_name)
        tasks.append((ac_no, url, target_path, target_name))
        
    tasks.sort(key=lambda t: t[0])
    
    completed = 0
    total = len(tasks)
    total_bytes = 0
    
    # Run with 4 concurrent download threads
    with ThreadPoolExecutor(max_workers=4) as executor:
        future_map = {}
        for ac_no, url, target_path, target_name in tasks:
            time.sleep(0.05) # subtle stagger
            fut = executor.submit(download_file, url, target_path, f"AC {ac_no}")
            future_map[fut] = (ac_no, target_name)
            
        for fut in as_completed(future_map):
            ac_no, target_name = future_map[fut]
            res = fut.result()
            completed += 1
            status = res["status"]
            size_kb = res["size_kb"]
            total_bytes += size_kb * 1024
            pct = (completed / total) * 100
            
            icon = "✔" if status in ["DOWNLOADED", "SKIPPED"] else "✖"
            print(f"[{completed:3d}/{total:3d}] ({pct:5.1f}%) {icon} [AC {ac_no:3d}] {target_name} ({size_kb:.1f} KB) - {status}", flush=True)
            
    # -------------------------------------------------------------
    # 4. Final Validation & Summary
    # -------------------------------------------------------------
    elapsed = time.time() - t0
    print("\n===================================================================", flush=True)
    print("📊 FINAL AUDIT & INTEGRITY CHECK")
    print("===================================================================", flush=True)
    
    files_2024 = [f for f in os.listdir(DIR_2024) if f.endswith(".pdf")]
    valid_2024 = sum(1 for f in files_2024 if is_valid_pdf(os.path.join(DIR_2024, f)))
    total_size_2024_mb = sum(os.path.getsize(os.path.join(DIR_2024, f)) for f in files_2024) / (1024 * 1024)
    
    size_2019_mb = os.path.getsize(path_2019) / (1024 * 1024) if os.path.exists(path_2019) else 0
    size_2014_mb = os.path.getsize(path_2014) / (1024 * 1024) if os.path.exists(path_2014) else 0
    
    grand_total_mb = total_size_2024_mb + size_2019_mb + size_2014_mb
    
    print(f"📁 2024 Form-20 AC Files:  {valid_2024} / 175 PDFs verified ({total_size_2024_mb:.2f} MB)")
    print(f"📁 2019 ECI Results:       {size_2019_mb:.2f} MB ({os.path.basename(path_2019)})")
    print(f"📁 2014 ECI Results:       {size_2014_mb:.2f} MB ({os.path.basename(path_2014)})")
    print(f"💾 Total Storage Used:     {grand_total_mb:.2f} MB ({grand_total_mb/1024:.2f} GB)")
    print(f"⏱️ Total Time Elapsed:     {elapsed:.1f}s ({elapsed/60:.1f} mins)")
    print("===================================================================\n", flush=True)
    
    # Save summary manifest
    summary = {
        "destination": BASE_DIR,
        "completed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_time_seconds": round(elapsed, 1),
        "years": {
            "2024": {
                "folder": DIR_2024,
                "verified_pdfs": valid_2024,
                "total_size_mb": round(total_size_2024_mb, 2)
            },
            "2019": {
                "folder": DIR_2019,
                "file": os.path.basename(path_2019),
                "size_mb": round(size_2019_mb, 2)
            },
            "2014": {
                "folder": DIR_2014,
                "file": os.path.basename(path_2014),
                "size_mb": round(size_2014_mb, 2)
            }
        }
    }
    with open(os.path.join(BASE_DIR, "form20_download_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    main()
