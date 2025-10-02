#!/usr/bin/env python3
import kagglehub
import os
import json

print("🔍 SEARCHING FOR ALL COMIC DATASETS ON KAGGLE...\n")

# Download major comic datasets
datasets_to_download = [
    "fivethirtyeight/fivethirtyeight-comic-characters-dataset",
    "dannielr/marvel-superheroes",
    "claudiodavi/superhero-set",
    "jonathanbesomi/marvel-characters",
    "rounakbanik/the-marvel-universe-social-network"
]

downloaded = []

for dataset_name in datasets_to_download:
    try:
        print(f"\n📦 Downloading: {dataset_name}...")
        path = kagglehub.dataset_download(dataset_name)
        print(f"✅ Downloaded to: {path}")
        
        # List all files
        for root, dirs, files in os.walk(path):
            for file in files:
                full_path = os.path.join(root, file)
                size = os.path.getsize(full_path) / (1024 * 1024)  # MB
                print(f"   📄 {file} ({size:.2f} MB)")
                
        downloaded.append({
            "dataset": dataset_name,
            "path": path
        })
        
    except Exception as e:
        print(f"❌ Failed: {e}")

print(f"\n\n🏁 Downloaded {len(downloaded)} datasets!")

# Save manifest
with open('data/kaggle-downloads.json', 'w') as f:
    json.dump(downloaded, f, indent=2)

print("📝 Manifest saved to: data/kaggle-downloads.json")

for d in downloaded:
    print(f"\n✅ {d['dataset']}")
    print(f"   {d['path']}")

