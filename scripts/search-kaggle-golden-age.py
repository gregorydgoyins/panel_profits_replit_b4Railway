#!/usr/bin/env python3
import kagglehub
import os
import json

print("🔍 SEARCHING KAGGLE FOR GOLDEN AGE COMICS...\n")

# Search for golden age comic datasets
search_terms = [
    "golden age comics",
    "vintage comics",
    "comic book archive",
    "classic comics",
    "1930s 1940s comics",
    "public domain comics"
]

all_datasets = []

for term in search_terms:
    print(f"\n🔎 Searching: {term}")
    try:
        # Note: kagglehub doesn't have direct search, so we'll try known datasets
        pass
    except Exception as e:
        print(f"   Search error: {e}")

# Try downloading known golden age comic datasets
golden_age_datasets = [
    "Cornell-University/comic-books-analysis",
    "cclark/comic-book-sales",
]

downloaded = []

for dataset_name in golden_age_datasets:
    try:
        print(f"\n📦 Trying: {dataset_name}...")
        path = kagglehub.dataset_download(dataset_name)
        print(f"✅ Downloaded to: {path}")
        
        # List files
        for root, dirs, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path) / (1024 * 1024)
                print(f"   📄 {file} ({size:.2f} MB)")
                
        downloaded.append({
            "dataset": dataset_name,
            "path": path
        })
        
    except Exception as e:
        print(f"❌ Not found or error: {e}")

print(f"\n\n🏁 Found {len(downloaded)} golden age datasets!")

if downloaded:
    with open('data/golden-age-datasets.json', 'w') as f:
        json.dump(downloaded, f, indent=2)
    print("📝 Saved to: data/golden-age-datasets.json")

