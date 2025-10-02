#!/usr/bin/env python3
"""
Kaggle Comic Dataset Bulk Downloader
====================================
This script aggressively searches and downloads ALL comic-related datasets from Kaggle.
It searches for multiple keywords and downloads EVERYTHING it finds.

Requirements:
- Kaggle API credentials (KAGGLE_USERNAME and KAGGLE_KEY environment variables)
- Or kaggle.json file in ~/.kaggle/

Usage:
    python scripts/kaggle-bulk-download.py
"""

import os
import sys
import json
import subprocess
import zipfile
import csv
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple
import time

# Comic-related search keywords - COMPREHENSIVE coverage
SEARCH_KEYWORDS = [
    "comics",
    "superheroes",
    "DC",
    "Marvel",
    "Dark Horse",
    "IDW",
    "independent comics",
    "comic creators",
    "manga",
]

# Base directories
BASE_DATA_DIR = Path("data/kaggle")
LOG_DIR = Path("logs")


class KaggleBulkDownloader:
    """Aggressive bulk downloader for comic-related Kaggle datasets"""
    
    def __init__(self):
        self.downloaded_datasets = []
        self.failed_downloads = []
        self.total_files = 0
        self.total_rows = 0
        self.start_time = datetime.now()
        
        # Create directories
        BASE_DATA_DIR.mkdir(parents=True, exist_ok=True)
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        
        # Setup logging
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_file = LOG_DIR / f"kaggle_download_{timestamp}.log"
        
        self.log("=" * 80)
        self.log("KAGGLE COMIC DATASET BULK DOWNLOADER")
        self.log("=" * 80)
        self.log(f"Started at: {self.start_time}")
        self.log("")
    
    def log(self, message: str):
        """Log message to both console and file"""
        print(message)
        with open(self.log_file, 'a') as f:
            f.write(message + '\n')
    
    def check_kaggle_credentials(self) -> bool:
        """Check if Kaggle API credentials are configured"""
        self.log("Checking Kaggle API credentials...")
        
        # Check environment variables
        has_env = os.getenv('KAGGLE_USERNAME') and os.getenv('KAGGLE_KEY')
        
        # Check kaggle.json
        kaggle_json = Path.home() / '.kaggle' / 'kaggle.json'
        has_json = kaggle_json.exists()
        
        if not has_env and not has_json:
            self.log("")
            self.log("❌ ERROR: Kaggle API credentials not found!")
            self.log("")
            self.log("Please configure your Kaggle credentials using ONE of these methods:")
            self.log("")
            self.log("METHOD 1: Environment Variables")
            self.log("  export KAGGLE_USERNAME='your-username'")
            self.log("  export KAGGLE_KEY='your-api-key'")
            self.log("")
            self.log("METHOD 2: kaggle.json file")
            self.log("  1. Go to https://www.kaggle.com/account")
            self.log("  2. Click 'Create New API Token'")
            self.log("  3. Save the downloaded kaggle.json to ~/.kaggle/kaggle.json")
            self.log("  4. chmod 600 ~/.kaggle/kaggle.json")
            self.log("")
            return False
        
        if has_env:
            self.log("✅ Found credentials in environment variables")
        if has_json:
            self.log("✅ Found credentials in ~/.kaggle/kaggle.json")
        
        return True
    
    def search_datasets(self, keyword: str) -> List[Dict]:
        """Search Kaggle for datasets matching keyword"""
        self.log(f"\n🔍 Searching for datasets with keyword: '{keyword}'")
        
        try:
            # Use kaggle CLI to search
            cmd = ['kaggle', 'datasets', 'list', '-s', keyword, '--csv']
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Parse CSV output
            datasets = []
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:  # Has header + data
                reader = csv.DictReader(lines)
                datasets = list(reader)
            
            self.log(f"   Found {len(datasets)} datasets for '{keyword}'")
            return datasets
        
        except subprocess.CalledProcessError as e:
            self.log(f"   ⚠️  Error searching for '{keyword}': {e}")
            return []
        except Exception as e:
            self.log(f"   ⚠️  Unexpected error searching for '{keyword}': {e}")
            return []
    
    def download_dataset(self, dataset_ref: str, keyword: str) -> Tuple[bool, str]:
        """Download a single dataset"""
        # Create keyword-specific directory
        download_dir = BASE_DATA_DIR / keyword.replace(' ', '_')
        download_dir.mkdir(parents=True, exist_ok=True)
        
        self.log(f"   📥 Downloading: {dataset_ref}")
        
        try:
            # Download using kaggle CLI
            cmd = [
                'kaggle', 'datasets', 'download',
                '-d', dataset_ref,
                '-p', str(download_dir),
                '--unzip'
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
                timeout=600  # 10 minute timeout per dataset
            )
            
            self.log(f"      ✅ Downloaded successfully")
            return True, str(download_dir)
        
        except subprocess.TimeoutExpired:
            error_msg = f"Timeout after 10 minutes"
            self.log(f"      ❌ Failed: {error_msg}")
            return False, error_msg
        
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr if e.stderr else str(e)
            self.log(f"      ❌ Failed: {error_msg}")
            return False, error_msg
        
        except Exception as e:
            error_msg = str(e)
            self.log(f"      ❌ Failed: {error_msg}")
            return False, error_msg
    
    def count_rows_in_file(self, file_path: Path) -> int:
        """Count rows in CSV file"""
        try:
            if file_path.suffix.lower() == '.csv':
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return sum(1 for line in f) - 1  # Subtract header
            return 0
        except Exception:
            return 0
    
    def analyze_downloaded_data(self, download_dir: Path) -> Dict:
        """Analyze downloaded data in directory"""
        stats = {
            'total_files': 0,
            'csv_files': 0,
            'total_rows': 0,
            'file_details': []
        }
        
        try:
            for file_path in download_dir.rglob('*'):
                if file_path.is_file():
                    stats['total_files'] += 1
                    
                    if file_path.suffix.lower() == '.csv':
                        stats['csv_files'] += 1
                        rows = self.count_rows_in_file(file_path)
                        stats['total_rows'] += rows
                        
                        stats['file_details'].append({
                            'name': file_path.name,
                            'size': file_path.stat().st_size,
                            'rows': rows
                        })
        except Exception as e:
            self.log(f"      ⚠️  Error analyzing data: {e}")
        
        return stats
    
    def process_keyword(self, keyword: str):
        """Process all datasets for a keyword"""
        self.log(f"\n{'=' * 80}")
        self.log(f"Processing keyword: '{keyword}'")
        self.log(f"{'=' * 80}")
        
        # Search for datasets
        datasets = self.search_datasets(keyword)
        
        if not datasets:
            self.log(f"   No datasets found for '{keyword}'")
            return
        
        # Download each dataset
        for i, dataset in enumerate(datasets, 1):
            dataset_ref = dataset.get('ref', '')
            title = dataset.get('title', 'Unknown')
            size = dataset.get('size', 'Unknown')
            
            self.log(f"\n   [{i}/{len(datasets)}] {title}")
            self.log(f"      Reference: {dataset_ref}")
            self.log(f"      Size: {size}")
            
            if not dataset_ref:
                self.log(f"      ⚠️  Skipping: No dataset reference")
                continue
            
            # Download
            success, info = self.download_dataset(dataset_ref, keyword)
            
            if success:
                # Analyze downloaded data
                download_dir = Path(info)
                stats = self.analyze_downloaded_data(download_dir)
                
                self.log(f"      📊 Files: {stats['total_files']} ({stats['csv_files']} CSV)")
                if stats['total_rows'] > 0:
                    self.log(f"      📊 Total rows: {stats['total_rows']:,}")
                
                self.downloaded_datasets.append({
                    'keyword': keyword,
                    'dataset_ref': dataset_ref,
                    'title': title,
                    'size': size,
                    'stats': stats
                })
                
                self.total_files += stats['total_files']
                self.total_rows += stats['total_rows']
            else:
                self.failed_downloads.append({
                    'keyword': keyword,
                    'dataset_ref': dataset_ref,
                    'title': title,
                    'error': info
                })
            
            # Small delay to avoid rate limiting
            time.sleep(2)
    
    def generate_summary_report(self):
        """Generate comprehensive summary report"""
        end_time = datetime.now()
        duration = end_time - self.start_time
        
        self.log("\n\n")
        self.log("=" * 80)
        self.log("DOWNLOAD SUMMARY REPORT")
        self.log("=" * 80)
        self.log(f"Started:  {self.start_time}")
        self.log(f"Finished: {end_time}")
        self.log(f"Duration: {duration}")
        self.log("")
        
        self.log(f"✅ Successfully downloaded: {len(self.downloaded_datasets)} datasets")
        self.log(f"❌ Failed downloads: {len(self.failed_downloads)} datasets")
        self.log(f"📁 Total files: {self.total_files:,}")
        self.log(f"📊 Total CSV rows: {self.total_rows:,}")
        self.log("")
        
        if self.downloaded_datasets:
            self.log("\nSUCCESSFULLY DOWNLOADED DATASETS:")
            self.log("-" * 80)
            for dataset in self.downloaded_datasets:
                self.log(f"\n  • {dataset['title']}")
                self.log(f"    Keyword: {dataset['keyword']}")
                self.log(f"    Reference: {dataset['dataset_ref']}")
                self.log(f"    Size: {dataset['size']}")
                self.log(f"    Files: {dataset['stats']['total_files']} ({dataset['stats']['csv_files']} CSV)")
                if dataset['stats']['total_rows'] > 0:
                    self.log(f"    Rows: {dataset['stats']['total_rows']:,}")
        
        if self.failed_downloads:
            self.log("\n\nFAILED DOWNLOADS:")
            self.log("-" * 80)
            for failed in self.failed_downloads:
                self.log(f"\n  • {failed['title']}")
                self.log(f"    Keyword: {failed['keyword']}")
                self.log(f"    Reference: {failed['dataset_ref']}")
                self.log(f"    Error: {failed['error']}")
        
        # Save detailed JSON report
        report_file = LOG_DIR / f"download_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_data = {
            'start_time': str(self.start_time),
            'end_time': str(end_time),
            'duration_seconds': duration.total_seconds(),
            'summary': {
                'total_downloaded': len(self.downloaded_datasets),
                'total_failed': len(self.failed_downloads),
                'total_files': self.total_files,
                'total_rows': self.total_rows
            },
            'downloaded_datasets': self.downloaded_datasets,
            'failed_downloads': self.failed_downloads
        }
        
        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        self.log(f"\n📝 Detailed report saved to: {report_file}")
        self.log(f"📝 Log file saved to: {self.log_file}")
        self.log("\n" + "=" * 80)
    
    def run(self):
        """Main execution method"""
        # Check credentials
        if not self.check_kaggle_credentials():
            sys.exit(1)
        
        self.log(f"\n🚀 Starting bulk download for {len(SEARCH_KEYWORDS)} keywords")
        self.log(f"   Keywords: {', '.join(SEARCH_KEYWORDS)}")
        
        # Process each keyword
        for keyword in SEARCH_KEYWORDS:
            try:
                self.process_keyword(keyword)
            except KeyboardInterrupt:
                self.log("\n\n⚠️  Download interrupted by user")
                break
            except Exception as e:
                self.log(f"\n❌ Error processing keyword '{keyword}': {e}")
                continue
        
        # Generate summary
        self.generate_summary_report()
        
        self.log("\n✨ BULK DOWNLOAD COMPLETE!")
        self.log("\nData location: data/kaggle/")
        self.log("Each keyword has its own subdirectory with downloaded datasets")
        self.log("")


def main():
    """Entry point"""
    try:
        downloader = KaggleBulkDownloader()
        downloader.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Script interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
