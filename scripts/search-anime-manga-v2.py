#!/usr/bin/env python3
import kagglehub
import os
import json

print("🎌 SEARCHING FOR ANIME/MANGA DATASETS (V2)...\n")

# Try more specific anime/manga datasets
datasets_to_try = [
    "hernan4444/anime-recommendation-database-2020",
    "canggih/anime-data-score-staff-synopsis-and-genre",
    "marlesson/myanimelist-dataset-animes-profiles-reviews",
    "CooperUnion/anime-characters-database",
    "dbdmobile/myanimelist-dataset",
    "svanoo/myanimelist-dataset",
    "victorsoeiro/netflix-tv-shows-and-movies",
]

# Also try known working ones
working_datasets = []

print("Trying known working anime datasets...\n")

for dataset in datasets_to_try:
    try:
        print(f"📦 {dataset}...")
        path = kagglehub.dataset_download(dataset)
        
        files_found = []
        total_size = 0
        for root, dirs, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path) / (1024 * 1024)
                total_size += size
                files_found.append(file)
                print(f"   ✅ {file} ({size:.2f} MB)")
        
        working_datasets.append({
            "dataset": dataset,
            "path": path,
            "files": files_found,
            "size_mb": round(total_size, 2)
        })
        
        print(f"   SUCCESS!\n")
        
    except Exception as e:
        print(f"   ❌ {str(e)[:50]}...\n")

print(f"\n🏁 Found {len(working_datasets)} working datasets")

if working_datasets:
    with open('data/anime-manga-found.json', 'w') as f:
        json.dump(working_datasets, f, indent=2)
    
    for d in working_datasets:
        print(f"\n✅ {d['dataset']}")
        print(f"   Files: {len(d['files'])}")
        print(f"   Size: {d['size_mb']} MB")
        print(f"   Path: {d['path']}")

