# GriffTunes changelog

Newest first. Version numbers also show in GriffTunes under **Settings → About GriffTunes**.

## 1.1 — November 1, 2026

- **Couch remote:** Settings → *Couch remote for your phone* shows a private QR code. The phone that scans it (and saves it to the home screen as "Couch Remote") gets owner controls: free songs, play/pause, skip, volume (even when guest volume is off), the speaker picker and removing songs from Up Next. *New code* revokes it. Ordinary guest phones are unchanged.
- **Couch remote screen switches:** turn the full-screen turntable on/off on the touchscreen, and turn lyrics on/off for the turntable and screensaver. The buttons light up to match what the touchscreen is showing.
- Phone links saved to the home screen now reopen the phone remote instead of the jukebox screen. Remote pages no longer offer the jukebox's app manifest (iPhone used its start page for the icon), and an iPhone icon that still opens the plain jukebox page is sent back to the remote link it was saved from.

## 1.0.1 — November 1, 2026

- **Reload while a song plays on the speaker:** GriffTunes now picks the song back up (Now Playing, time, lights, volume) and carries on to the next song, instead of showing an empty Now Playing. Up Next was already kept.
- **Volume sliders** in the screensaver mini player and on the full-screen turntable's control bar (they stay in sync with the main volume, the WiiM and phones).
- **Speaker picker during a Spotify wait:** tapping the speaker button now asks Spotify directly instead of showing "slow down". If Spotify answers, the wait clears right away and the badge shows "Spotify is back".
- Spotify back-off resets after 6 quiet hours, so yesterday's slow-downs don't make today's waits longer.
- **Spotify's search quota** (new from Spotify in July 2026, shared by every app on the developer account): when Spotify says `QUOTA_EXCEEDED`, GriffTunes now pauses only searches (badge: "Spotify · search paused", re-checks every 2 hours). Playback, the speaker picker and songs already in the library keep working.
- **Song library file:** `song-library.json` now ships with 7,149 of the 8,590 Top 20 chart songs, matched from a public Billboard Hot 100 dataset with Spotify track IDs (TidyTuesday, Sept 2021) — no Spotify searches used. Album art fills in from Spotify's public embed info the first time a song is used.
- Overnight song-library builder is much gentler (one lookup every 20 seconds, stays far under the request budget) and stops for the night after any slow-down.

## 1.0 — October 31, 2026

First official release. Highlights:

- **Jukebox:** credits and coins (1 / 2 / 3 credits to queue, play next or play now; 5 for a whole Greatest Albums album), free play, house mix, search with on-screen keyboard and voice, Up Next queue.
- **Browse:** Featured, Albums, Playlists, Family (family members' own Spotify playlists), Artists (albums row + Greatest Hits), New Releases, Greatest Albums (Rolling Stone top 50). Tap the Now Playing album art to open its album.
- **Spotify:** Premium playback in the browser or on any Spotify Connect speaker (WiiM Pro), speaker picker, volume sync.
- **Radio:** 18 stations on an FM dial (My Library, My Artists, decades, Today, and hand-picked artist lists for Country, Classic Rock, Yacht Rock, Rock, Pop, Hip-Hop, R&B, Alternative, Dance and Christian Hits).
- **Countdowns:** Hot 100 Rewind (last week, 1–40 years ago), Country Gold, Christmas Countdown; Grad Year (top 40 songs of any senior year since 1959).
- **Fun-fact ticker** with artist facts and year facts, flashback cards every fourth song.
- **Lyrics** (time-synced), full-screen **turntable**, **screensavers** (fine art, now playing, turntable) with mini-player controls.
- **Christmas Mode:** Christmas music, Hue Christmas colors, snow, string lights, Santa's sleigh, Christmas trivia, gift-box coins, fireplace screensaver.
- **Phones:** QR code link for searching, queueing, coins, volume, countdowns, Grad Year, radio and Christmas Mode.
- **Philips Hue:** album-color lighting, party / chill / hands-off modes, coin flash, screensaver dimming, automatic speaker power through Hue smart plugs.
- **Reliability:** Spotify request budget and status badge, persistent song library, browse caching, weekly fresh start, automatic updates, weekly Hot 100 chart update via GitHub Actions.
