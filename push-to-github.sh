#!/bin/bash
cd /home/runner/workspace || exit 1

# Add all changes, commit with timestamp
git add .
git commit -m "Auto backup: $(date -u +"%Y-%m-%d %H:%M:%S UTC")" || exit 0

# Push to GitHub
git push origin main
