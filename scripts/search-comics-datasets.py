#!/usr/bin/env python3
import kagglehub
import os
import json

print("📚 SEARCHING KAGGLE FOR COMIC BOOK DATASETS...\n")

# Comprehensive comic book dataset search
datasets_to_try = [
    # Already have these
    "dannielr/marvel-superheroes",  # Has 41K comics
    "fivethirtyeight/fivethirtyeight-comic-characters-dataset",
    
    # Try new comic datasets
    "rounakbanik/comic-books",
    "cclark/comic-book-sales", 
    "Cornell-University/comic-books-analysis",
    "thedevastator/comic-books-data",
    "andrewmvd/comic-books-dataset",
]

downloaded = []
failed = []

for dataset_name in datasets_to_try:
    try:
        print(f"\n📦 Trying: {dataset_name}...")
        path = kagglehub.dataset_download(dataset_name)
        
        files_found = []
        comic_files = []
        total_size = 0
        
        for root, dirs, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path) / (1024 * 1024)
                total_size += size
                files_found.append(file)
                
                if file.endswith('.csv'):
                    # Check if it's comic data
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        first_line = f.readline().lower()
                        
                        if any(term in first_line for term in ['comic', 'issue', 'title', 'series', 'volume']):
                            comic_files.append({
                                'file': file,
                                'path': full_path,
                                'size_mb': round(size, 2),
                                'columns': first_line.strip()[:200]
                            })
                            print(f"   ✅ {file} ({size:.2f} MB)")
                            print(f"      Columns: {first_line.strip()[:150]}...")
        
        if comic_files:
            print(f"   SUCCESS: {len(comic_files)} comic files, {total_size:.2f} MB total")
            downloaded.append({
                "dataset": dataset_name,
                "path": path,
                "files": comic_files,
                "total_size_mb": round(total_size, 2)
            })
        
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg or "Permission" in error_msg:
            print(f"   ❌ Private/restricted")
            failed.append({"dataset": dataset_name, "reason": "private"})
        elif "122" in error_msg or "Disk quota" in error_msg:
            print(f"   ❌ Disk quota exceeded")
            failed.append({"dataset": dataset_name, "reason": "disk_quota"})
        else:
            print(f"   ❌ Not found or error")
            failed.append({"dataset": dataset_name, "reason": "not_found"})

print(f"\n\n🏁 SEARCH COMPLETE!")
print(f"   ✅ Downloaded: {len(downloaded)} datasets")
print(f"   ❌ Failed: {len(failed)} datasets\n")

if downloaded:
    with open('data/comic-datasets.json', 'w') as f:
        json.dump(downloaded, f, indent=2)
    
    print("📚 COMIC DATASETS FOUND:\n")
    for d in downloaded:
        print(f"   📦 {d['dataset']}")
        print(f"      Files: {len(d['files'])}, Size: {d['total_size_mb']} MB")
        for cf in d['files']:
            print(f"         📄 {cf['file']} ({cf['size_mb']} MB)")
        print()

