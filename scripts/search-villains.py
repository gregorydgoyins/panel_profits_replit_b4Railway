#!/usr/bin/env python3
import kagglehub
import os
import json

print("😈 SEARCHING KAGGLE FOR SUPERVILLAINS...\n")

# Search for villain datasets
datasets_to_try = [
    # General superhero datasets (usually include villains)
    "claudiodavi/superhero-set",
    "dannielr/marvel-superheroes",
    "fivethirtyeight/fivethirtyeight-comic-characters-dataset",
    
    # Try villain-specific or comprehensive datasets
    "jonathanbesomi/marvel-characters",
    "rounakbanik/the-marvel-universe-social-network",
]

print("🔍 Searching existing datasets for villain data...\n")

# Check what we already have
manifest_files = [
    'data/kaggle-downloads.json',
    'data/all-comic-eras.json'
]

existing_datasets = []
for manifest_file in manifest_files:
    try:
        if os.path.exists(manifest_file):
            with open(manifest_file, 'r') as f:
                data = json.load(f)
                if 'downloaded' in data:
                    existing_datasets.extend(data['downloaded'])
                elif isinstance(data, list):
                    existing_datasets.extend(data)
    except:
        pass

print(f"📦 Already have {len(existing_datasets)} datasets downloaded\n")

# Check for villain data in existing datasets
villain_data = []

for dataset in existing_datasets:
    path = dataset.get('path', '')
    if not path:
        continue
        
    print(f"🔍 Checking: {dataset.get('dataset', 'unknown')}")
    
    try:
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.csv'):
                    full_path = os.path.join(root, file)
                    
                    # Read first few lines to check for villain data
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read(5000)  # Read first 5KB
                        
                        # Look for villain indicators
                        villain_indicators = ['villain', 'evil', 'bad', 'alignment', 'hero']
                        has_villains = any(indicator.lower() in content.lower() for indicator in villain_indicators)
                        
                        if has_villains:
                            size = os.path.getsize(full_path) / (1024 * 1024)
                            villain_data.append({
                                'dataset': dataset.get('dataset'),
                                'file': file,
                                'path': full_path,
                                'size_mb': round(size, 2)
                            })
                            print(f"   ✅ {file} ({size:.2f} MB) - Contains villain data!")
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:50]}")

print(f"\n\n🏁 FOUND {len(villain_data)} FILES WITH VILLAIN DATA!\n")

if villain_data:
    with open('data/villain-datasets.json', 'w') as f:
        json.dump(villain_data, f, indent=2)
    
    print("✅ VILLAIN DATA SOURCES:\n")
    for v in villain_data:
        print(f"   😈 {v['file']} ({v['size_mb']} MB)")
        print(f"      Dataset: {v['dataset']}")
        print(f"      Path: {v['path']}\n")

