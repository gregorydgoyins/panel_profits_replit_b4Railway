#!/usr/bin/env python3
"""
Metron DB Expansion Service
Uses mokkari Python wrapper to scrape comic metadata from Metron DB
"""

import os
import sys
import json
import mokkari
from datetime import datetime, timedelta

# Metron credentials from environment
USERNAME = os.getenv('METRON_USERNAME')
PASSWORD = os.getenv('METRON_PASSWORD')

def fetch_recent_issues(days=7):
    """Fetch recent issues from Metron DB"""
    if not USERNAME or not PASSWORD:
        print("ERROR: METRON_USERNAME and METRON_PASSWORD required", file=sys.stderr)
        return []
    
    m = mokkari.api(username=USERNAME, passwd=PASSWORD)
    
    # Get issues from the past week
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    params = {
        "store_date_range_after": start_date.strftime("%Y-%m-%d"),
        "store_date_range_before": end_date.strftime("%Y-%m-%d"),
    }
    
    try:
        issues = m.issues_list(params=params)
        results = []
        
        for issue in issues:
            results.append({
                'id': issue.id,
                'issue_name': issue.issue_name,
                'series_name': issue.series,
                'number': issue.number,
                'publisher': issue.publisher,
                'store_date': str(issue.store_date),
                'cover_date': str(issue.cover_date),
                'description': getattr(issue, 'desc', ''),
                'cover_url': getattr(issue, 'image', ''),
            })
        
        return results
    except Exception as e:
        print(f"ERROR fetching issues: {e}", file=sys.stderr)
        return []

def fetch_series_by_name(series_name):
    """Fetch series information by name"""
    if not USERNAME or not PASSWORD:
        print("ERROR: METRON_USERNAME and METRON_PASSWORD required", file=sys.stderr)
        return None
    
    m = mokkari.api(username=USERNAME, passwd=PASSWORD)
    
    try:
        series_list = m.series_list(params={'name': series_name})
        if series_list:
            return {
                'id': series_list[0].id,
                'name': series_list[0].name,
                'publisher': series_list[0].publisher,
                'year_began': series_list[0].year_began,
                'issue_count': series_list[0].issue_count,
                'volume': series_list[0].volume,
            }
        return None
    except Exception as e:
        print(f"ERROR fetching series: {e}", file=sys.stderr)
        return None

if __name__ == '__main__':
    command = sys.argv[1] if len(sys.argv) > 1 else 'recent'
    
    if command == 'recent':
        days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
        issues = fetch_recent_issues(days)
        print(json.dumps(issues, indent=2))
    
    elif command == 'series':
        if len(sys.argv) < 3:
            print("ERROR: series name required", file=sys.stderr)
            sys.exit(1)
        series_name = sys.argv[2]
        series = fetch_series_by_name(series_name)
        print(json.dumps(series, indent=2))
    
    else:
        print(f"ERROR: Unknown command '{command}'", file=sys.stderr)
        sys.exit(1)
