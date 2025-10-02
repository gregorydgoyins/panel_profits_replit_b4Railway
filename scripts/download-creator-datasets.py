#!/usr/bin/env python3
import kagglehub
import os
import json

print("✍️ SEARCHING KAGGLE FOR COMIC CREATOR DATASETS...\n")

# Try creator-specific datasets
datasets_to_try = [
    # Try various comic creator datasets
    "dannielr/marvel-superheroes",  # Might have creator info we missed
]

# Also generate creators from Pinecone data we have
print("📊 Note: We have 63,934 Pinecone records including creator data!\n")
print("🔍 Trying Kaggle datasets...\n")

downloaded = []

for dataset_name in datasets_to_try:
    try:
        print(f"📦 Checking: {dataset_name}...")
        path = kagglehub.dataset_download(dataset_name)
        
        # Deep dive into all CSV files
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.csv'):
                    full_path = os.path.join(root, file)
                    
                    # Actually read the CSV headers
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        first_line = f.readline()
                        print(f"   📄 {file}")
                        print(f"      Columns: {first_line.strip()[:150]}...")
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:60]}")

print("\n\n💡 SOLUTION: Use Pinecone Creator Data!")
print("   We already have 63,934 records including Marvel creators")
print("   Let's import those instead!\n")

