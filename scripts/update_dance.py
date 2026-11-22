#!/usr/bin/env python3
"""Refreshes dance-top25.json: Billboard's Hot Dance/Electronic Songs Top 25, from a fan-made Spotify playlist that copies
the chart each week ("Billboard Hot Dance/Electronic/EDM Songs Top 25 Weekly").

Spotify won't let personal developer apps read other people's playlists, so this reads the playlist's public embed page
(no sign-in, no API, nothing tied to Josh's Spotify account) from GitHub's servers. Covers come from Spotify's public
oEmbed info. Run daily by .github/workflows/update-dance.yml; safe to run by hand.
"""
import json, re, sys, time, urllib.parse, urllib.request
from datetime import date, datetime
from pathlib import Path

PL = '3X8oqr3qpVuTkreQwa0DAO'
OUT = Path(__file__).resolve().parent.parent / 'dance-top25.json'
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8', 'replace')

def find(o, key):
    if isinstance(o, dict):
        if key in o: return o[key]
        for v in o.values():
            x = find(v, key)
            if x is not None: return x
    elif isinstance(o, list):
        for v in o:
            x = find(v, key)
            if x is not None: return x
    return None

def chart_date(text):
    m = re.search(r'([A-Z][a-z]+)\.? (\d{1,2}),? (\d{4})', text or '')
    if not m: return None
    for f in ('%B %d %Y', '%b %d %Y'):
        try: return datetime.strptime(f'{m[1]} {m[2]} {m[3]}', f).date().isoformat()
        except ValueError: pass
    return None

def main():
    html = get(f'https://open.spotify.com/embed/playlist/{PL}')
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m: sys.exit('No data in the embed page')
    data = json.loads(m[1])
    tl = find(data, 'trackList') or []
    rows = []
    for t in tl[:25]:
        uri = t.get('uri') or ''
        if not uri.startswith('spotify:track:'): continue
        rows.append({'id': uri.split(':')[-1], 'uri': uri, 'name': t.get('title') or '', 'artist': t.get('subtitle') or '',
                     'duration': t.get('duration') or 0})
    print(f'{len(tl)} items in the embed page, {len(rows)} songs')
    if len(rows) < 10: sys.exit(f'Only {len(rows)} songs found; leaving the old list alone')
    # the chart date is in the playlist's description ("November 21, 2026 (Week of …)")
    desc = find(data, 'description') or ''
    if not chart_date(desc):
        try:
            page = get(f'https://open.spotify.com/playlist/{PL}')
            for mm in re.finditer(r'<meta[^>]+(?:name|property)="(?:og:)?description"[^>]+content="([^"]*)"', page):
                if chart_date(mm[1]): desc = mm[1]; break
        except Exception as e:
            print('playlist page:', e)
    print('description:', desc[:160])
    old = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else None
    ids = [r['id'] for r in rows]
    if old and [r['id'] for r in old['rows']] == ids:
        print('No change'); return
    d = chart_date(desc) or date.today().isoformat()
    prev = old.get('prev') if old else None
    if old and old.get('date') != d:
        prev = {'date': old['date'], 'ids': [r['id'] for r in old['rows']]}
    have = {r['id']: r.get('img') for r in (old['rows'] if old else [])}
    for r in rows:
        r['img'] = have.get(r['id']) or ''
        if r['img']: continue
        try:
            j = json.loads(get('https://open.spotify.com/oembed?url=' + urllib.parse.quote(f'https://open.spotify.com/track/{r["id"]}')))
            r['img'] = j.get('thumbnail_url') or ''
        except Exception as e:
            print('cover', r['id'], e)
        time.sleep(0.5)
    OUT.write_text(json.dumps({'date': d, 'updated': date.today().isoformat(), 'prev': prev, 'rows': rows}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'Saved {len(rows)} songs for {d}; #1 {rows[0]["name"]} – {rows[0]["artist"]}')

if __name__ == '__main__':
    main()
