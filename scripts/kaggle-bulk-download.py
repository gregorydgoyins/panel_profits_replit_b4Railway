#!/usr/bin/env python3
"""
Kaggle Bulk Dataset Downloader for Comic/Collectible Data
===========================================================

This script downloads ALL Kaggle datasets matching comic and collectible keywords.
Designed to acquire millions of records for comprehensive market analysis.

Requirements:
- Python 3.7+
- kaggle package (pip install kaggle)
- KAGGLE_USERNAME and KAGGLE_KEY environment variables

Usage:
    python scripts/kaggle-bulk-download.py

Features:
- Downloads from 70+ search terms across comics, collectibles, and pop culture
- Automatic retry with exponential backoff for rate limits
- Resume capability (skips already downloaded datasets)
- Progress tracking with manifest and error logs
- Comprehensive summary report after completion
"""

import os
import sys
import json
import time
import subprocess
import csv
import zipfile
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Set, Tuple
import io

# Search terms organized by category
SEARCH_TERMS = {
    "core_publishers": [
        "marvel comics", "dc comics", "dark horse comics", "idw comics", 
        "image comics", "vertigo comics", "wildstorm", "milestone comics", 
        "valiant comics"
    ],
    "franchise_universes": [
        "pokemon", "digimon", "yu-gi-oh", "magic gathering", "dragon ball", 
        "naruto", "one piece", "bleach", "attack on titan"
    ],
    "trading_cards": [
        "pokemon tcg", "magic the gathering cards", "yu-gi-oh cards", 
        "comic trading cards", "sports cards"
    ],
    "toys_figurines": [
        "funko pop", "action figures", "collectible toys", "nendoroid", 
        "figma", "hot toys", "lego", "transformers"
    ],
    "memorabilia_auctions": [
        "comic auction", "collectible prices", "comic grading", 
        "cgc census", "comic sales data", "auction results"
    ],
    "art_creative": [
        "comic art", "manga art", "character designs", "comic creators", 
        "illustrators", "graphic novels"
    ],
    "box_office_media": [
        "box office", "superhero movies", "anime ratings", 
        "comic adaptations", "streaming data"
    ],
    "character_encyclopedias": [
        "superhero database", "character roster", "villain database", 
        "anime characters", "manga characters"
    ],
    "financial_pricing": [
        "comic book prices", "collectible values", "grading data", 
        "price guide", "market values"
    ],
    "meta_terms": [
        "comics", "superheroes", "manga", "anime", "collectibles", 
        "memorabilia", "pop culture", "comic books", "graphic novel"
    ],
    "gaming_collectibles": [
        "retro gaming", "video game collectibles", "nintendo", "playstation", 
        "xbox", "gaming merchandise"
    ],
    "additional_publishers": [
        "boom studios", "dynamite entertainment", "oni press"
    ]
}

# Configuration
BASE_DIR = Path("data/kaggle")
MANIFEST_FILE = BASE_DIR / "download-manifest.json"
ERROR_LOG = BASE_DIR / "download-errors.log"
SUMMARY_REPORT = BASE_DIR / "summary-report.json"
DOWNLOAD_DELAY = 2  # seconds between downloads
MAX_RETRIES = 3
BACKOFF_FACTOR = 2


class KaggleDownloader:
    def __init__(self):
        self.manifest = self.load_manifest()
        self.downloaded_datasets: Set[str] = set(self.manifest.get("downloaded", []))
        self.failed_downloads: List[Dict] = self.manifest.get("failed", [])
        self.total_downloaded = 0
        self.total_failed = 0
        self.session_start = datetime.now().isoformat()
        
    def load_manifest(self) -> Dict:
        """Load existing manifest or create new one"""
        if MANIFEST_FILE.exists():
            with open(MANIFEST_FILE, 'r') as f:
                return json.load(f)
        return {
            "downloaded": [],
            "failed": [],
            "datasets_by_category": {},
            "total_size_bytes": 0,
            "last_updated": None
        }
    
    def save_manifest(self):
        """Save current manifest state"""
        self.manifest["downloaded"] = list(self.downloaded_datasets)
        self.manifest["failed"] = self.failed_downloads
        self.manifest["last_updated"] = datetime.now().isoformat()
        
        with open(MANIFEST_FILE, 'w') as f:
            json.dump(self.manifest, indent=2, fp=f)
    
    def log_error(self, dataset_ref: str, error: str):
        """Log download error"""
        with open(ERROR_LOG, 'a') as f:
            timestamp = datetime.now().isoformat()
            f.write(f"[{timestamp}] {dataset_ref}: {error}\n")
        
        self.failed_downloads.append({
            "dataset": dataset_ref,
            "error": error,
            "timestamp": timestamp
        })
    
    def search_datasets(self, search_term: str) -> List[str]:
        """Search Kaggle for datasets matching term"""
        try:
            cmd = ["kaggle", "datasets", "list", "-s", search_term, "--csv"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Parse CSV output
            csv_reader = csv.DictReader(io.StringIO(result.stdout))
            datasets = []
            
            for row in csv_reader:
                if 'ref' in row:
                    datasets.append(row['ref'])
            
            print(f"  Found {len(datasets)} datasets for '{search_term}'")
            return datasets
            
        except subprocess.CalledProcessError as e:
            print(f"  Error searching for '{search_term}': {e}")
            self.log_error(search_term, f"Search failed: {e}")
            return []
    
    def download_dataset(self, dataset_ref: str, category: str, search_term: str, retry_count: int = 0) -> bool:
        """Download and extract a single dataset"""
        # Skip if already downloaded
        if dataset_ref in self.downloaded_datasets:
            print(f"  ⏭️  Skipping {dataset_ref} (already downloaded)")
            return True
        
        # Create download directory
        safe_term = search_term.replace(" ", "_").replace("/", "_")
        dataset_name = dataset_ref.split("/")[-1]
        download_path = BASE_DIR / safe_term / dataset_name
        download_path.mkdir(parents=True, exist_ok=True)
        
        try:
            # Download dataset
            cmd = ["kaggle", "datasets", "download", "-d", dataset_ref, "-p", str(download_path), "--unzip"]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                print(f"  ✅ Downloaded: {dataset_ref}")
                self.downloaded_datasets.add(dataset_ref)
                self.total_downloaded += 1
                
                # Update category stats
                if category not in self.manifest["datasets_by_category"]:
                    self.manifest["datasets_by_category"][category] = []
                self.manifest["datasets_by_category"][category].append(dataset_ref)
                
                # Calculate size
                total_size = sum(f.stat().st_size for f in download_path.rglob('*') if f.is_file())
                self.manifest["total_size_bytes"] = self.manifest.get("total_size_bytes", 0) + total_size
                
                return True
            
            # Handle rate limiting
            elif "429" in result.stderr or "rate limit" in result.stderr.lower():
                if retry_count < MAX_RETRIES:
                    wait_time = DOWNLOAD_DELAY * (BACKOFF_FACTOR ** retry_count)
                    print(f"  ⏳ Rate limited. Waiting {wait_time}s before retry {retry_count + 1}/{MAX_RETRIES}")
                    time.sleep(wait_time)
                    return self.download_dataset(dataset_ref, category, search_term, retry_count + 1)
                else:
                    error_msg = f"Rate limit exceeded after {MAX_RETRIES} retries"
                    print(f"  ❌ {dataset_ref}: {error_msg}")
                    self.log_error(dataset_ref, error_msg)
                    self.total_failed += 1
                    return False
            
            else:
                error_msg = result.stderr[:200] if result.stderr else "Unknown error"
                print(f"  ❌ Failed: {dataset_ref} - {error_msg}")
                self.log_error(dataset_ref, error_msg)
                self.total_failed += 1
                return False
                
        except subprocess.TimeoutExpired:
            error_msg = "Download timeout (>5 min)"
            print(f"  ❌ {dataset_ref}: {error_msg}")
            self.log_error(dataset_ref, error_msg)
            self.total_failed += 1
            return False
            
        except Exception as e:
            error_msg = str(e)[:200]
            print(f"  ❌ {dataset_ref}: {error_msg}")
            self.log_error(dataset_ref, error_msg)
            self.total_failed += 1
            return False
    
    def run(self):
        """Main download orchestration"""
        print("=" * 80)
        print("KAGGLE BULK DATASET DOWNLOADER")
        print("Comic & Collectible Data Acquisition")
        print("=" * 80)
        print()
        
        # Check credentials
        if not os.getenv("KAGGLE_USERNAME") or not os.getenv("KAGGLE_KEY"):
            print("❌ Error: KAGGLE_USERNAME and KAGGLE_KEY environment variables must be set")
            sys.exit(1)
        
        print(f"📁 Base directory: {BASE_DIR.absolute()}")
        print(f"📋 Manifest: {MANIFEST_FILE}")
        print(f"📝 Error log: {ERROR_LOG}")
        print()
        
        # Gather all datasets
        all_datasets: List[Tuple[str, str, str]] = []  # (dataset_ref, category, search_term)
        
        print("🔍 PHASE 1: Searching for datasets...")
        print()
        
        for category, terms in SEARCH_TERMS.items():
            print(f"Category: {category}")
            for term in terms:
                datasets = self.search_datasets(term)
                for dataset_ref in datasets:
                    all_datasets.append((dataset_ref, category, term))
            print()
        
        # Remove duplicates (same dataset may match multiple terms)
        unique_datasets = list(set(all_datasets))
        total_datasets = len(unique_datasets)
        
        print(f"📊 Found {total_datasets} unique datasets across {len(SEARCH_TERMS)} categories")
        print(f"📦 Already downloaded: {len(self.downloaded_datasets)}")
        remaining = total_datasets - len(self.downloaded_datasets)
        print(f"⬇️  To download: {remaining}")
        print()
        
        if remaining == 0:
            print("✅ All datasets already downloaded!")
            self.generate_summary()
            return
        
        # Download datasets
        print("⬇️  PHASE 2: Downloading datasets...")
        print()
        
        for i, (dataset_ref, category, search_term) in enumerate(unique_datasets, 1):
            print(f"[{i}/{total_datasets}] {dataset_ref}")
            success = self.download_dataset(dataset_ref, category, search_term)
            
            # Progress update every 10 downloads
            if i % 10 == 0:
                progress_pct = (i / total_datasets) * 100
                print()
                print(f"📈 Progress: {i}/{total_datasets} ({progress_pct:.1f}%)")
                print(f"   ✅ Downloaded: {self.total_downloaded}")
                print(f"   ❌ Failed: {self.total_failed}")
                print()
                # Save manifest periodically
                self.save_manifest()
            
            # Delay between downloads
            if success and i < total_datasets:
                time.sleep(DOWNLOAD_DELAY)
        
        # Final save
        self.save_manifest()
        
        print()
        print("=" * 80)
        print("DOWNLOAD COMPLETE")
        print("=" * 80)
        print(f"✅ Successfully downloaded: {self.total_downloaded}")
        print(f"❌ Failed: {self.total_failed}")
        print(f"📋 Manifest saved: {MANIFEST_FILE}")
        print()
        
        # Generate summary report
        self.generate_summary()
    
    def generate_summary(self):
        """Generate comprehensive summary report"""
        print("📊 PHASE 3: Generating summary report...")
        print()
        
        summary = {
            "generated_at": datetime.now().isoformat(),
            "session_start": self.session_start,
            "total_datasets": len(self.downloaded_datasets),
            "total_failed": len(self.failed_downloads),
            "datasets_by_category": {},
            "total_records": 0,
            "records_by_file_type": {},
            "largest_datasets": [],
            "ready_files": []
        }
        
        # Analyze datasets by category
        for category, datasets in self.manifest.get("datasets_by_category", {}).items():
            summary["datasets_by_category"][category] = len(datasets)
        
        # Scan all CSV and JSON files
        csv_files = list(BASE_DIR.rglob("*.csv"))
        json_files = list(BASE_DIR.rglob("*.json"))
        
        print(f"📁 Found {len(csv_files)} CSV files")
        print(f"📁 Found {len(json_files)} JSON files")
        print()
        
        file_sizes = []
        
        # Count CSV records
        csv_records = 0
        for csv_file in csv_files:
            try:
                with open(csv_file, 'r', encoding='utf-8', errors='ignore') as f:
                    row_count = sum(1 for _ in f) - 1  # Subtract header
                    if row_count > 0:
                        csv_records += row_count
                        file_size = csv_file.stat().st_size
                        file_sizes.append({
                            "file": str(csv_file.relative_to(BASE_DIR)),
                            "size_bytes": file_size,
                            "size_mb": file_size / 1024 / 1024,
                            "records": row_count
                        })
                        summary["ready_files"].append(str(csv_file.relative_to(BASE_DIR)))
            except Exception as e:
                print(f"⚠️  Error reading {csv_file}: {e}")
        
        summary["records_by_file_type"]["csv"] = csv_records
        
        # Count JSON records
        json_records = 0
        for json_file in json_files:
            # Skip manifest and summary files
            if json_file.name in ["download-manifest.json", "summary-report.json"]:
                continue
            
            try:
                with open(json_file, 'r', encoding='utf-8', errors='ignore') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        record_count = len(data)
                        json_records += record_count
                        file_size = json_file.stat().st_size
                        file_sizes.append({
                            "file": str(json_file.relative_to(BASE_DIR)),
                            "size_bytes": file_size,
                            "size_mb": file_size / 1024 / 1024,
                            "records": record_count
                        })
                        summary["ready_files"].append(str(json_file.relative_to(BASE_DIR)))
            except Exception as e:
                print(f"⚠️  Error reading {json_file}: {e}")
        
        summary["records_by_file_type"]["json"] = json_records
        summary["total_records"] = csv_records + json_records
        
        # Find largest datasets
        file_sizes.sort(key=lambda x: x["size_bytes"], reverse=True)
        summary["largest_datasets"] = file_sizes[:20]  # Top 20
        
        # Calculate total size
        summary["total_size_bytes"] = self.manifest.get("total_size_bytes", 0)
        summary["total_size_gb"] = summary["total_size_bytes"] / 1024 / 1024 / 1024
        
        # Save summary report
        with open(SUMMARY_REPORT, 'w') as f:
            json.dump(summary, indent=2, fp=f)
        
        print("=" * 80)
        print("SUMMARY REPORT")
        print("=" * 80)
        print(f"📊 Total datasets downloaded: {summary['total_datasets']}")
        print(f"📝 Total records: {summary['total_records']:,}")
        print(f"   - CSV records: {summary['records_by_file_type'].get('csv', 0):,}")
        print(f"   - JSON records: {summary['records_by_file_type'].get('json', 0):,}")
        print(f"💾 Total storage used: {summary['total_size_gb']:.2f} GB")
        print()
        print("📦 Datasets by category:")
        for category, count in sorted(summary["datasets_by_category"].items()):
            print(f"   - {category}: {count}")
        print()
        print(f"🏆 Top 5 largest datasets:")
        for i, dataset in enumerate(summary["largest_datasets"][:5], 1):
            print(f"   {i}. {dataset['file']}")
            print(f"      Size: {dataset['size_mb']:.1f} MB | Records: {dataset.get('records', 'N/A'):,}")
        print()
        print(f"📋 Full summary report: {SUMMARY_REPORT}")
        print(f"📁 Ready-to-process files: {len(summary['ready_files'])}")
        print()
        print("✅ Summary generation complete!")
        print("=" * 80)


if __name__ == "__main__":
    # Ensure base directory exists
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    
    # Run downloader
    downloader = KaggleDownloader()
    try:
        downloader.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Download interrupted by user")
        print("💾 Saving progress...")
        downloader.save_manifest()
        print("✅ Progress saved. Run script again to resume.")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        downloader.save_manifest()
        sys.exit(1)
