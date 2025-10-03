#!/bin/bash
while true; do
  npx tsx scripts/cover-beast.ts >> data/beast.log 2>&1
  echo "$(date '+%H:%M:%S') Restarting..." >> data/supervisor.log
  sleep 2
done
