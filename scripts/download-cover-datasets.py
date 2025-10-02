#!/usr/bin/env python3
import kagglehub
import os
import json

print("📥 DOWNLOADING COMIC COVER DATASETS\n")

datasets = [
    {
        'name': 'mauryansshivam/marvel',
        'description': '3900+ MARVEL Comic Covers & 900+ Characters',
        'size': '928MB'
    },
    {
        'name': 'mauryansshivam/dc-comics-characters-images-data-160',
        'description': 'DC Comics Characters Images (160+)',
        'size': '10MB'
    }
]

downloaded_paths = {}

for ds in datasets:
    print(f"\n{'='*60}")
    print(f"📦 {ds['description']} ({ds['size']})")
    print(f"   Dataset: {ds['name']}")
    print(f"{'='*60}\n")
    
    try:
        path = kagglehub.dataset_download(ds['name'])
        print(f"✅ Downloaded to: {path}\n")
        downloaded_paths[ds['name']] = path
        
        # List files
        print("📁 Files:")
        os.system(f"ls -lh {path} | head -20")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}\n")

# Save paths
with open('data/kaggle-cover-datasets.json', 'w') as f:
    json.dump(downloaded_paths, f, indent=2)

print("\n🏁 DOWNLOADS COMPLETE!")
print(f"   Paths saved to: data/kaggle-cover-datasets.json")
