#!/usr/bin/env python3
import kagglehub
import os
import json

print("🔍 SEARCHING KAGGLE FOR ALL COMIC BOOK ERAS...\n")
print("📚 Golden Age (1938-1956)")
print("🥈 Silver Age (1956-1970)")
print("🥉 Bronze Age (1970-1985)")
print("🔶 Copper Age (1985-1992)")
print("🆕 Modern Age (1992-present)\n")

# Comprehensive search for comic datasets
datasets_to_try = [
    # General comic datasets
    "fivethirtyeight/fivethirtyeight-comic-characters-dataset",
    "dannielr/marvel-superheroes",
    "claudiodavi/superhero-set",
    
    # Try various comic-related searches
    "thedevastator/comic-books-data",
    "rounakbanik/marvel-universe",
    "jonathanbesomi/marvel-cinematic-universe",
    "corydonbaylor/comic-book-character-network",
    "csanhueza/the-marvel-universe-social-network",
]

downloaded = []
failed = []

for dataset_name in datasets_to_try:
    try:
        print(f"\n📦 Trying: {dataset_name}...")
        path = kagglehub.dataset_download(dataset_name)
        
        # List all files
        files_found = []
        total_size = 0
        for root, dirs, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path) / (1024 * 1024)
                total_size += size
                files_found.append(file)
                print(f"   📄 {file} ({size:.2f} MB)")
        
        print(f"✅ SUCCESS: {len(files_found)} files, {total_size:.2f} MB total")
        
        downloaded.append({
            "dataset": dataset_name,
            "path": path,
            "files": files_found,
            "total_size_mb": round(total_size, 2)
        })
        
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg or "Permission" in error_msg:
            print(f"❌ Private or restricted")
            failed.append({"dataset": dataset_name, "reason": "private/restricted"})
        else:
            print(f"❌ Not found")
            failed.append({"dataset": dataset_name, "reason": "not_found"})

print(f"\n\n🏁 SEARCH COMPLETE!")
print(f"   ✅ Downloaded: {len(downloaded)} datasets")
print(f"   ❌ Failed: {len(failed)} datasets\n")

# Save results
results = {
    "downloaded": downloaded,
    "failed": failed,
    "total_datasets_found": len(downloaded)
}

os.makedirs('data', exist_ok=True)
with open('data/all-comic-eras.json', 'w') as f:
    json.dump(results, f, indent=2)

print("📝 Results saved to: data/all-comic-eras.json\n")

# Print summary
if downloaded:
    print("✅ SUCCESSFULLY DOWNLOADED:\n")
    for d in downloaded:
        print(f"   📦 {d['dataset']}")
        print(f"      Files: {len(d['files'])}, Size: {d['total_size_mb']} MB")
        print(f"      Path: {d['path']}\n")

