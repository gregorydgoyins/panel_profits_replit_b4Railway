#!/usr/bin/env python3
import os
import json
from csv import DictReader

print("✍️ SEARCHING FOR COMIC BOOK CREATORS...\n")

# Check existing datasets for creator data
existing_datasets = [
    {
        "path": "/home/runner/.cache/kagglehub/datasets/fivethirtyeight/fivethirtyeight-comic-characters-dataset/versions/111",
        "name": "FiveThirtyEight"
    },
    {
        "path": "/home/runner/.cache/kagglehub/datasets/dannielr/marvel-superheroes/versions/3",
        "name": "Marvel Superheroes"
    },
    {
        "path": "/home/runner/.cache/kagglehub/datasets/claudiodavi/superhero-set/versions/1",
        "name": "Superhero Set"
    },
    {
        "path": "/home/runner/.cache/kagglehub/datasets/csanhueza/the-marvel-universe-social-network/versions/1",
        "name": "Marvel Network"
    }
]

creator_files = []

for dataset in existing_datasets:
    if not os.path.exists(dataset['path']):
        continue
        
    print(f"🔍 Checking: {dataset['name']}")
    
    for root, dirs, files in os.walk(dataset['path']):
        for file in files:
            if not file.endswith('.csv'):
                continue
                
            full_path = os.path.join(root, file)
            
            try:
                # Read first 1000 chars to check columns
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    sample = f.read(2000).lower()
                    
                    # Look for creator-related columns
                    creator_indicators = [
                        'writer', 'artist', 'creator', 'author', 
                        'penciller', 'inker', 'colorist', 'letterer',
                        'staff', 'contributor'
                    ]
                    
                    has_creators = any(ind in sample for ind in creator_indicators)
                    
                    if has_creators:
                        size = os.path.getsize(full_path) / (1024 * 1024)
                        creator_files.append({
                            'dataset': dataset['name'],
                            'file': file,
                            'path': full_path,
                            'size_mb': round(size, 2)
                        })
                        print(f"   ✅ {file} ({size:.2f} MB) - Has creator data!")
                        
                        # Sample the data
                        with open(full_path, 'r', encoding='utf-8', errors='ignore') as cf:
                            reader = DictReader(cf)
                            rows = []
                            for i, row in enumerate(reader):
                                if i >= 5:
                                    break
                                rows.append(row)
                            
                            if rows:
                                print(f"      Columns: {', '.join(rows[0].keys())[:100]}...")
                                
            except Exception as e:
                pass

print(f"\n\n🏁 FOUND {len(creator_files)} FILES WITH CREATOR DATA!\n")

if creator_files:
    with open('data/creator-datasets.json', 'w') as f:
        json.dump(creator_files, f, indent=2)
    
    print("✍️ CREATOR DATA SOURCES:\n")
    for c in creator_files:
        print(f"   📄 {c['file']} ({c['size_mb']} MB)")
        print(f"      Dataset: {c['dataset']}")
        print(f"      Path: {c['path']}\n")

