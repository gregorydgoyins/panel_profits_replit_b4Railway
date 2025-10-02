#!/usr/bin/env python3
"""
Kaggle Bulk Dataset Downloader V2 - Using kagglehub Library
============================================================

This script downloads comic/collectible datasets using the kagglehub library,
which is more reliable and efficient than the CLI approach.

Requirements:
- Python 3.7+
- kagglehub package (already installed)
- KAGGLE_USERNAME and KAGGLE_KEY environment variables

Usage:
    python scripts/kaggle-bulk-download-v2.py

Features:
- Uses kagglehub.dataset_download() for direct API access
- Two-phase strategy: known high-value datasets + search discovery
- Automatic symlink creation for easy access
- Progress tracking with comprehensive manifest
- Resume capability with cache detection
- Error handling with exponential backoff retry
"""

import os
import sys
import json
import time
import subprocess
import csv
import io
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Set, Tuple, Optional
import shutil

try:
    import kagglehub
except ImportError:
    print("❌ Error: kagglehub not installed. Run: pip install kagglehub")
    sys.exit(1)

# Known high-value datasets (Phase A)
KNOWN_HIGH_VALUE_DATASETS = [
    "arunasivapragasam/dc-comics",  # 6,897 DC characters
    "fivethirtyeight/fivethirtyeight-comic-characters-dataset",  # 23,272 characters
    "mmmarchetti/dc-characters-dataset",  # DC Universe data
    "dannielr/marvel-superheroes",  # Marvel characters
    "claudiodavi/superhero-set",  # Cross-publisher superhero data
    "jonathanbesomi/comic-characters-dataset",  # Multi-publisher characters
    "deepcontractor/dc-wikia-data",  # DC Comics wiki data
    "deepcontractor/marvel-wikia-data",  # Marvel Comics wiki data
    "psycon/comic-book-sales-data",  # Sales and pricing data
    "rounakbanik/pokemon",  # Pokemon collectibles
    "mylesoneill/game-of-thrones",  # Fantasy character data
]

# Search terms for Phase B discovery
SEARCH_TERMS = [
    "marvel", "dc comics", "pokemon", "funko pop", 
    "comic prices", "superhero", "manga", "anime", 
    "collectibles", "cgc grading", "box office", 
    "comic sales", "comic characters", "comic books",
    "trading cards", "action figures", "memorabilia"
]

# Configuration
BASE_DIR = Path("data/kaggle")
MANIFEST_FILE = Path("data/kaggle-manifest.json")
ERROR_LOG = BASE_DIR / "download-errors-v2.log"
SUMMARY_REPORT = Path("data/kaggle-summary.json")
KAGGLE_CACHE = Path.home() / ".cache" / "kagglehub"
MAX_RETRIES = 3
BACKOFF_FACTOR = 2
RETRY_DELAY = 5  # Base delay in seconds


class KaggleHubDownloader:
    """Enhanced Kaggle downloader using kagglehub library"""
    
    def __init__(self):
        self.manifest = self.load_manifest()
        self.downloaded_datasets: Set[str] = set(self.manifest.get("downloaded", []))
        self.dataset_paths: Dict[str, str] = self.manifest.get("dataset_paths", {})
        self.failed_downloads: List[Dict] = self.manifest.get("failed", [])
        self.total_downloaded = 0
        self.total_failed = 0
        self.session_start = datetime.now().isoformat()
        
        # Ensure directories exist
        BASE_DIR.mkdir(parents=True, exist_ok=True)
        
    def load_manifest(self) -> Dict:
        """Load existing manifest or create new one"""
        if MANIFEST_FILE.exists():
            with open(MANIFEST_FILE, 'r') as f:
                return json.load(f)
        return {
            "downloaded": [],
            "dataset_paths": {},
            "failed": [],
            "datasets_by_category": {},
            "total_files": 0,
            "total_records_estimated": 0,
            "last_updated": None,
            "version": "2.0"
        }
    
    def save_manifest(self):
        """Save current manifest state"""
        self.manifest["downloaded"] = list(self.downloaded_datasets)
        self.manifest["dataset_paths"] = self.dataset_paths
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
    
    def check_if_cached(self, dataset_ref: str) -> Optional[Path]:
        """Check if dataset is already in kagglehub cache"""
        # kagglehub stores datasets in ~/.cache/kagglehub/datasets/{owner}/{dataset-name}/versions/{version}
        parts = dataset_ref.split('/')
        if len(parts) != 2:
            return None
        
        owner, dataset_name = parts
        dataset_cache_dir = KAGGLE_CACHE / "datasets" / owner / dataset_name / "versions"
        
        if dataset_cache_dir.exists():
            # Find the latest version
            versions = list(dataset_cache_dir.iterdir())
            if versions:
                # Get the most recent version
                latest_version = max(versions, key=lambda p: p.stat().st_mtime)
                return latest_version
        
        return None
    
    def download_dataset_with_kagglehub(self, dataset_ref: str, category: str = "general", retry_count: int = 0) -> Optional[str]:
        """Download dataset using kagglehub library"""
        
        # Check if already downloaded
        if dataset_ref in self.downloaded_datasets:
            print(f"  ⏭️  Skipping {dataset_ref} (already in manifest)")
            cached_path = self.dataset_paths.get(dataset_ref)
            if cached_path and Path(cached_path).exists():
                return cached_path
        
        # Check cache first
        cached_path = self.check_if_cached(dataset_ref)
        if cached_path and cached_path.exists():
            print(f"  ♻️  Found in cache: {dataset_ref}")
            path_str = str(cached_path)
            self.downloaded_datasets.add(dataset_ref)
            self.dataset_paths[dataset_ref] = path_str
            self.total_downloaded += 1
            
            # Update category
            if category not in self.manifest["datasets_by_category"]:
                self.manifest["datasets_by_category"][category] = []
            if dataset_ref not in self.manifest["datasets_by_category"][category]:
                self.manifest["datasets_by_category"][category].append(dataset_ref)
            
            return path_str
        
        try:
            print(f"  ⬇️  Downloading {dataset_ref}...")
            
            # Use kagglehub to download
            path = kagglehub.dataset_download(dataset_ref)
            
            print(f"  ✅ Downloaded to: {path}")
            
            # Record success
            self.downloaded_datasets.add(dataset_ref)
            self.dataset_paths[dataset_ref] = path
            self.total_downloaded += 1
            
            # Update category
            if category not in self.manifest["datasets_by_category"]:
                self.manifest["datasets_by_category"][category] = []
            if dataset_ref not in self.manifest["datasets_by_category"][category]:
                self.manifest["datasets_by_category"][category].append(dataset_ref)
            
            # Create symlink for easy access
            self.create_symlink(dataset_ref, path)
            
            return path
            
        except Exception as e:
            error_str = str(e)
            
            # Check for rate limiting or temporary errors
            if retry_count < MAX_RETRIES and ("rate" in error_str.lower() or "timeout" in error_str.lower()):
                wait_time = RETRY_DELAY * (BACKOFF_FACTOR ** retry_count)
                print(f"  ⏳ Error (retry {retry_count + 1}/{MAX_RETRIES}): {error_str[:100]}")
                print(f"     Waiting {wait_time}s before retry...")
                time.sleep(wait_time)
                return self.download_dataset_with_kagglehub(dataset_ref, category, retry_count + 1)
            
            # Permanent failure
            error_msg = error_str[:200]
            print(f"  ❌ Failed: {dataset_ref}")
            print(f"     Error: {error_msg}")
            self.log_error(dataset_ref, error_msg)
            self.total_failed += 1
            return None
    
    def create_symlink(self, dataset_ref: str, source_path: str):
        """Create symlink in data/kaggle/ for easy access"""
        try:
            # Create safe directory name
            safe_name = dataset_ref.replace("/", "_")
            symlink_path = BASE_DIR / safe_name
            
            # Remove existing symlink if it exists
            if symlink_path.exists() or symlink_path.is_symlink():
                symlink_path.unlink()
            
            # Create new symlink
            source = Path(source_path)
            if source.exists():
                symlink_path.symlink_to(source, target_is_directory=True)
                print(f"  🔗 Symlink created: {symlink_path}")
        except Exception as e:
            print(f"  ⚠️  Could not create symlink: {e}")
    
    def search_datasets_cli(self, search_term: str) -> List[str]:
        """Search Kaggle for datasets using CLI (for discovery)"""
        try:
            cmd = ["kaggle", "datasets", "list", "-s", search_term, "--csv"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=30)
            
            # Parse CSV output
            csv_reader = csv.DictReader(io.StringIO(result.stdout))
            datasets = []
            
            for row in csv_reader:
                if 'ref' in row:
                    datasets.append(row['ref'])
            
            return datasets
            
        except Exception as e:
            print(f"  ⚠️  Search error for '{search_term}': {e}")
            return []
    
    def analyze_dataset_files(self, dataset_path: str) -> Dict:
        """Analyze files in a dataset directory"""
        path = Path(dataset_path)
        
        stats = {
            "csv_files": [],
            "json_files": [],
            "total_files": 0,
            "estimated_records": 0,
            "total_size_bytes": 0
        }
        
        if not path.exists():
            return stats
        
        # Find all files
        all_files = list(path.rglob("*"))
        stats["total_files"] = len([f for f in all_files if f.is_file()])
        
        # Find CSV files
        csv_files = list(path.rglob("*.csv"))
        for csv_file in csv_files:
            try:
                size = csv_file.stat().st_size
                stats["total_size_bytes"] += size
                
                # Count rows (quick estimate)
                with open(csv_file, 'r', encoding='utf-8', errors='ignore') as f:
                    row_count = sum(1 for _ in f) - 1  # Subtract header
                    if row_count > 0:
                        stats["estimated_records"] += row_count
                        stats["csv_files"].append({
                            "name": csv_file.name,
                            "path": str(csv_file.relative_to(path)),
                            "size_bytes": size,
                            "records": row_count
                        })
            except Exception as e:
                print(f"    ⚠️  Error analyzing {csv_file.name}: {e}")
        
        # Find JSON files
        json_files = list(path.rglob("*.json"))
        for json_file in json_files:
            try:
                size = json_file.stat().st_size
                stats["total_size_bytes"] += size
                
                with open(json_file, 'r', encoding='utf-8', errors='ignore') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        record_count = len(data)
                        stats["estimated_records"] += record_count
                        stats["json_files"].append({
                            "name": json_file.name,
                            "path": str(json_file.relative_to(path)),
                            "size_bytes": size,
                            "records": record_count
                        })
                    else:
                        stats["json_files"].append({
                            "name": json_file.name,
                            "path": str(json_file.relative_to(path)),
                            "size_bytes": size,
                            "records": 1
                        })
                        stats["estimated_records"] += 1
            except Exception as e:
                print(f"    ⚠️  Error analyzing {json_file.name}: {e}")
        
        return stats
    
    def run_phase_a(self):
        """Phase A: Download known high-value datasets"""
        print("=" * 80)
        print("PHASE A: Known High-Value Datasets")
        print("=" * 80)
        print(f"📋 {len(KNOWN_HIGH_VALUE_DATASETS)} curated datasets to download")
        print()
        
        for i, dataset_ref in enumerate(KNOWN_HIGH_VALUE_DATASETS, 1):
            print(f"[{i}/{len(KNOWN_HIGH_VALUE_DATASETS)}] {dataset_ref}")
            path = self.download_dataset_with_kagglehub(dataset_ref, category="high-value")
            
            if path:
                # Analyze files
                stats = self.analyze_dataset_files(path)
                print(f"    📊 Files: {stats['total_files']} | Records: {stats['estimated_records']:,}")
            
            print()
            
            # Save progress periodically
            if i % 5 == 0:
                self.save_manifest()
        
        self.save_manifest()
    
    def run_phase_b(self, max_datasets_per_term: int = 5):
        """Phase B: Search and discover additional datasets"""
        print("=" * 80)
        print("PHASE B: Search Discovery")
        print("=" * 80)
        print(f"🔍 Searching {len(SEARCH_TERMS)} terms for additional datasets")
        print()
        
        discovered_datasets = []
        
        for term in SEARCH_TERMS:
            print(f"🔍 Searching: '{term}'")
            results = self.search_datasets_cli(term)
            
            if results:
                print(f"   Found {len(results)} datasets")
                # Take top N results per term
                for dataset_ref in results[:max_datasets_per_term]:
                    if dataset_ref not in self.downloaded_datasets:
                        discovered_datasets.append((dataset_ref, term))
            else:
                print(f"   No results")
            print()
        
        # Remove duplicates
        unique_discovered = list(set(discovered_datasets))
        print(f"📊 Discovered {len(unique_discovered)} unique new datasets")
        print()
        
        if not unique_discovered:
            print("✅ No new datasets to download")
            return
        
        print("⬇️  Downloading discovered datasets...")
        print()
        
        for i, (dataset_ref, search_term) in enumerate(unique_discovered, 1):
            print(f"[{i}/{len(unique_discovered)}] {dataset_ref} (from '{search_term}')")
            path = self.download_dataset_with_kagglehub(dataset_ref, category=f"search-{search_term}")
            
            if path:
                stats = self.analyze_dataset_files(path)
                print(f"    📊 Files: {stats['total_files']} | Records: {stats['estimated_records']:,}")
            
            print()
            
            # Save progress periodically
            if i % 5 == 0:
                self.save_manifest()
        
        self.save_manifest()
    
    def generate_summary(self):
        """Generate comprehensive summary report"""
        print("=" * 80)
        print("GENERATING SUMMARY REPORT")
        print("=" * 80)
        print()
        
        summary = {
            "generated_at": datetime.now().isoformat(),
            "session_start": self.session_start,
            "version": "2.0",
            "total_datasets": len(self.downloaded_datasets),
            "total_failed": len(self.failed_downloads),
            "datasets_by_category": {},
            "total_files": 0,
            "total_records": 0,
            "total_size_bytes": 0,
            "dataset_details": []
        }
        
        # Analyze each downloaded dataset
        for dataset_ref in self.downloaded_datasets:
            dataset_path = self.dataset_paths.get(dataset_ref)
            if dataset_path:
                print(f"📊 Analyzing: {dataset_ref}")
                stats = self.analyze_dataset_files(dataset_path)
                
                summary["total_files"] += stats["total_files"]
                summary["total_records"] += stats["estimated_records"]
                summary["total_size_bytes"] += stats["total_size_bytes"]
                
                summary["dataset_details"].append({
                    "dataset": dataset_ref,
                    "path": dataset_path,
                    "symlink": str(BASE_DIR / dataset_ref.replace("/", "_")),
                    "files": stats["total_files"],
                    "csv_files": len(stats["csv_files"]),
                    "json_files": len(stats["json_files"]),
                    "estimated_records": stats["estimated_records"],
                    "size_bytes": stats["total_size_bytes"],
                    "size_mb": stats["total_size_bytes"] / 1024 / 1024,
                    "file_list": stats["csv_files"] + stats["json_files"]
                })
        
        # Category breakdown
        for category, datasets in self.manifest.get("datasets_by_category", {}).items():
            summary["datasets_by_category"][category] = len(datasets)
        
        # Calculate totals
        summary["total_size_gb"] = summary["total_size_bytes"] / 1024 / 1024 / 1024
        
        # Sort datasets by record count
        summary["dataset_details"].sort(key=lambda x: x["estimated_records"], reverse=True)
        summary["largest_datasets"] = summary["dataset_details"][:10]
        
        # Save summary
        with open(SUMMARY_REPORT, 'w') as f:
            json.dump(summary, indent=2, fp=f)
        
        # Print summary
        print()
        print("=" * 80)
        print("SUMMARY REPORT")
        print("=" * 80)
        print(f"✅ Successfully downloaded: {summary['total_datasets']}")
        print(f"❌ Failed: {summary['total_failed']}")
        print(f"📁 Total files: {summary['total_files']}")
        print(f"📝 Total records: {summary['total_records']:,}")
        print(f"💾 Total size: {summary['total_size_gb']:.2f} GB")
        print()
        print("📦 Datasets by category:")
        for category, count in sorted(summary["datasets_by_category"].items()):
            print(f"   - {category}: {count}")
        print()
        print("🏆 Top 5 datasets by record count:")
        for i, dataset in enumerate(summary["largest_datasets"][:5], 1):
            print(f"   {i}. {dataset['dataset']}")
            print(f"      Records: {dataset['estimated_records']:,} | Files: {dataset['files']} | Size: {dataset['size_mb']:.1f} MB")
        print()
        print(f"📋 Manifest saved: {MANIFEST_FILE}")
        print(f"📊 Full summary: {SUMMARY_REPORT}")
        print(f"🔗 Symlinks created in: {BASE_DIR}")
        print("=" * 80)
    
    def run(self, skip_phase_b: bool = False):
        """Main execution"""
        print("=" * 80)
        print("KAGGLE BULK DOWNLOADER V2 (kagglehub)")
        print("Comic & Collectible Data Acquisition")
        print("=" * 80)
        print()
        
        # Check credentials
        if not os.getenv("KAGGLE_USERNAME") or not os.getenv("KAGGLE_KEY"):
            print("❌ Error: KAGGLE_USERNAME and KAGGLE_KEY environment variables must be set")
            print("   Set them in your ~/.kaggle/kaggle.json or as environment variables")
            sys.exit(1)
        
        print(f"📁 Base directory: {BASE_DIR.absolute()}")
        print(f"📋 Manifest: {MANIFEST_FILE}")
        print(f"💾 Cache directory: {KAGGLE_CACHE}")
        print(f"📦 Previously downloaded: {len(self.downloaded_datasets)}")
        print()
        
        # Phase A: Known high-value datasets
        self.run_phase_a()
        
        # Phase B: Search discovery (optional)
        if not skip_phase_b:
            self.run_phase_b(max_datasets_per_term=5)
        
        # Generate summary
        self.generate_summary()
        
        print()
        print("✅ Download complete!")


def main():
    """Main entry point"""
    downloader = KaggleHubDownloader()
    
    try:
        # Check command line arguments
        skip_phase_b = "--skip-search" in sys.argv
        
        if skip_phase_b:
            print("🔧 Running with --skip-search (Phase A only)")
            print()
        
        downloader.run(skip_phase_b=skip_phase_b)
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Download interrupted by user")
        print("💾 Saving progress...")
        downloader.save_manifest()
        print("✅ Progress saved. Run script again to resume.")
        sys.exit(0)
        
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        downloader.save_manifest()
        sys.exit(1)


if __name__ == "__main__":
    main()
