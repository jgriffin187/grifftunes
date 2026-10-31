#!/usr/bin/env python3
"""Adds any new weekly Billboard Hot 100 charts (Top 20) to hot100-top20.json.

Data: utdata/rwd-billboard-data (MIT), the same source the archive was built from.
Run by .github/workflows/update-charts.yml once a week; safe to run by hand any time.
"""
import csv, io, json, sys, urllib.request
from pathlib import Path

SRC = 'https://raw.githubusercontent.com/utdata/rwd-billboard-data/main/data-out/hot-100-current.csv'
OUT = Path(__file__).resolve().parent.parent / 'hot100-top20.json'

def num(v):
    try: return int(v)
    except (TypeError, ValueError): return 0

def main():
    data = json.loads(OUT.read_text(encoding='utf-8'))
    weeks = data['weeks']
    newest = max(weeks)
    with urllib.request.urlopen(SRC, timeout=120) as r:
        rows = csv.DictReader(io.TextIOWrapper(r, encoding='utf-8'))
        new = {}
        for row in rows:
            d, pos = row['chart_week'], num(row['current_week'])
            if d <= newest or not 1 <= pos <= 20:
                continue
            new.setdefault(d, []).append([pos, row['title'], row['performer'], num(row['last_week']), num(row['peak_pos']), num(row['wks_on_chart'])])
    added = []
    for d in sorted(new):
        chart = sorted(new[d])
        if len(chart) < 20:          # skip a week that's only partly published
            continue
        weeks[d] = chart
        added.append(d)
    if not added:
        print(f'No new charts (newest is {newest}).')
        return 0
    data['weeks'] = dict(sorted(weeks.items()))
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('Added charts:', ', '.join(added))
    return 0

if __name__ == '__main__':
    sys.exit(main())
