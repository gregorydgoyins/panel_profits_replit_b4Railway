#!/usr/bin/env python3
import kagglehub
import os
import json

print("🌏 SEARCHING KAGGLE FOR MANGA & FOREIGN COMICS...\n")
print("🇯🇵 Manga (Japanese)")
print("🇰🇷 Manhwa (Korean)")
print("🇨🇳 Manhua (Chinese)")
print("🇫🇷 Bandes Dessinées (French/Belgian)")
print("🌍 International Comics\n")

# Comprehensive manga and foreign comics datasets
datasets_to_try = [
    # Manga datasets
    "aludvigsson/myanimelist-anime-dataset-as-20190204",
    "azathoth42/myanimelist",
    "CooperUnion/anime-characters-database",
    "marlesson/myanimelist-dataset-animes-profiles-reviews",
    
    # Anime/Manga related
    "canggih/anime-data-score-staff-synopsis-and-genre",
    "hernan4444/anime-recommendation-database-2020",
    "svanoo/myanimelist-dataset",
    "andreuvallhernandez/myanimelist",
    
    # More specific searches
    "dbdmobile/myanimelist-dataset",
    "victorsoeiro/netflix-tv-shows-and-movies",
]

downloaded = []
failed = []

for dataset_name in datasets_to_try:
    try:
        print(f"\n📦 Trying: {dataset_name}...")
        path = kagglehub.dataset_download(dataset_name)
        
        files_found = []
        total_size = 0
        for root, dirs, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path) / (1024 * 1024)
                total_size += size
                files_found.append(file)
                if size > 0.01:  # Only show files > 10KB
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
            print(f"❌ Private/restricted")
            failed.append({"dataset": dataset_name, "reason": "private"})
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
with open('data/manga-foreign-comics.json', 'w') as f:
    json.dump(results, f, indent=2)

print("📝 Results saved to: data/manga-foreign-comics.json\n")

if downloaded:
    print("✅ SUCCESSFULLY DOWNLOADED:\n")
    for d in downloaded:
        print(f"   📦 {d['dataset']}")
        print(f"      Files: {len(d['files'])}, Size: {d['total_size_mb']} MB")
        print(f"      Path: {d['path']}\n")

