# GriffTunes changelog

Newest first. Version numbers also show in GriffTunes under **Settings → About GriffTunes**.

## 1.2.2 — November 4, 2026

- **↻ Sync** chip at the end of the Artists tab's chips (on the jukebox) re-reads your Spotify follow list right away instead of waiting for the daily check, then shows how many new artists it found.

## 1.2.1 — November 4, 2026

- **Rock** genre chip on the Artists tab (between Hip Hop and Other), and Rock in each artist's Genre picker. About 1,400 rock artists from the genre file (Guns N' Roses, Creed, Mötley Crüe, Kid Rock, O.A.R. and so on) move out of Other automatically.

## 1.2 — November 4, 2026

- **Artists tab shows the artists you follow:** your 30 most-played artists, plus every artist you follow on Spotify. Chips across the top switch between Most Played, Pop, Country, Hip Hop, Other and All. Followed artists are A to Z within each genre, and an artist in Most Played isn't repeated below. The tab is now called "Artists".
- **New follows show up on their own:** the follow list is checked when GriffTunes starts and about once a day after that (one Spotify request per 50 artists).
- **Genres:** Spotify no longer sends genres to personal apps, so `artist-genres.json` maps artists to the chips (Spotify genre tags from the TidyTuesday Billboard dataset, plus hand-picked artist IDs). Anything unknown goes under Other; open the artist and change **Genre** at the top of their page to move them. Your choices are remembered.
- **One-time sign-in:** reading follows needs a new Spotify permission. Until you sign in again, the Artists tab shows a "+ Add the artists you follow" chip that starts the sign-in.
- **Phones** get the same chips. The **My Artists** radio station now plays from followed artists too.

## 1.1 — November 1, 2026

- **Couch remote:** Settings → *Couch remote for your phone* shows a private QR code. The phone that scans it (and saves it to the home screen as "Couch Remote") gets owner controls: free songs, play/pause, skip, volume (even when guest volume is off), the speaker picker and removing songs from Up Next. *New code* revokes it. Ordinary guest phones are unchanged.
- **Couch remote screen switches:** turn the full-screen turntable on/off on the touchscreen, and turn lyrics on/off for the turntable and screensaver. The buttons light up to match what the touchscreen is showing.
- **Couch remote power switches:** Speakers (the Hue smart plugs) and Lights (the Hue lights; the speaker plugs are never touched) on/off, showing their current state.
- **Couch remote: queue a whole album** from any album (not just Greatest Albums), free.
- **Sharing the Spotify account:** if someone starts Spotify somewhere else (a phone, the car) or picks a different song in the Spotify app, GriffTunes now steps aside (clears Now Playing, keeps Up Next) instead of treating it as "song over" and playing its next song on the basement speakers.
- **iPhone fix:** album covers in the cover carousel no longer show up black or missing in Safari (the covers skip the mirror reflection and dimming filter there, and far-off covers are left out).
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
