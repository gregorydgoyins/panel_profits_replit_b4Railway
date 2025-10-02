#!/usr/bin/env python3
import os

print("🔍 SEARCHING KAGGLE FOR COMIC BOOK DATASETS\n")
print("=" * 60)

# Search for comic book covers
print("\n📚 COMIC BOOK COVERS:\n")
os.system('kaggle datasets list -s "comic book covers"')

print("\n" + "=" * 60)
print("\n🎬 COMIC BOOK MOVIE STILLS:\n")
os.system('kaggle datasets list -s "comic movie"')

print("\n" + "=" * 60)
print("\n🦸 SUPERHERO IMAGES:\n")
os.system('kaggle datasets list -s "superhero images"')

print("\n" + "=" * 60)
print("\n🎨 MARVEL IMAGES:\n")
os.system('kaggle datasets list -s "marvel images"')

print("\n" + "=" * 60)
print("\n🦇 DC COMICS IMAGES:\n")
os.system('kaggle datasets list -s "dc comics"')

print("\n" + "=" * 60)
print("\n📖 COMIC IMAGES:\n")
os.system('kaggle datasets list -s "comic images"')
