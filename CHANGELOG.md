# GriffTunes changelog

Newest first. Version numbers also show in GriffTunes under **Settings → About GriffTunes**.

## 1.7.1 — November 6, 2026

- **Christmas lights without white:** during Christmas Mode and on the 🎄 Christmas tab, color bulbs use only red and green (bright red, deep red, green, pine green), split about evenly, at 70% of the normal brightness setting. White-only and dimmable bulbs go to a very warm candle glow at 20%. The old palette mixed in warm white, pure white and gold.
- **Slow drift:** every 30 seconds one color bulb fades over 10 seconds to another red or green (keeping reds and greens balanced). A new song or opening the tab fades the whole room to a new arrangement over 5 seconds. The drift stops when the Christmas look ends or the lights mode isn't Album colors.

## 1.7 — November 6, 2026

- **223 Christmas albums** on the 🎄 Christmas tab, up from 50 (`christmas-albums.json` v2), all matched to Spotify ahead of time: Classics 32, Pop 51, Country 42, R&B & Soul 21, Christian 33, Instrumental 24, Kids & Movies 20.
  - Includes Vince Gill (3), Neil Diamond (3), Josh Groban (Noël Deluxe, his only Christmas album on Spotify), Mannheim Steamroller (3) and Trans-Siberian Orchestra (3).
  - Up to 3 albums per artist; when Spotify has a Deluxe or Expanded edition, that one is used.
  - Not on Spotify, so left out: Garth Brooks's Christmas albums, Tim McGraw & Faith Hill's *Christmas Together*, Carpenters' *An Old-Fashioned Christmas*, Clint Black, and a few others.
- **New chips:** **R&B & Soul** (Motown, Temptations, Stevie Wonder, Boyz II Men, Luther, Whitney…) and **Instrumental** (Mannheim, TSO, Charlie Brown, Kenny G, George Winston, Piano Guys…). Mannheim, TSO, Charlie Brown and the Jackson 5 moved into them.
- **Shuffled each visit:** the albums come up in a new random order every time the tab opens; the Christmas Top 40 card and your own Christmas playlists stay first.

## 1.6.3 — November 6, 2026

- **Christmas look on the Christmas tab:** opening the 🎄 Christmas tab turns on everything Christmas Mode shows, without changing the music: falling snow, the string lights around the border, Santa's sleigh flying across (first pass about 6 seconds in when a song is playing, then once per song), Christmas red, green and gold on the Hue lights (even with nothing playing), sleigh-bell coins and the fireplace screensaver. Leaving the tab puts the regular look and album colors back, unless Christmas Mode itself is on. Phones show the snow and lights while the jukebox is on the tab.

## 1.6.2 — November 6, 2026

- **Radio dial hides during picks:** switching from the radio to an album left the FM dial and ON AIR sign showing over the album song. The dial now shows only while a radio song is playing (or nothing is). During a picked song the radio button stays lit, which means the station comes back once the picks are done. Tapping the radio button then brings the dial back so you can switch stations right away; a second tap turns the radio off.
- **Speaker chip:** a speaker Spotify reports with a code instead of a name (the WiiM did this) now shows as "Speaker" instead of the 32-character code.

## 1.6.1 — November 6, 2026

- **Radio variety:** the Alternative station played Coldplay 5 songs out of 6. Artist stations (Alternative, Rock, Country and the other hand-picked ones) took every remembered song from up to 5 artists, and right after a fresh start only 1 or 2 artists might be remembered, so one artist with 10 songs could fill the line. Now:
  - Each refill takes at most 3 random songs per artist, from up to 14 artists.
  - While fewer than 5 artists are remembered for a station, a refill looks up 4 new artists instead of 2.
  - The line is dealt out artist by artist, and the next song skips any artist from the last 4 radio songs when another choice is waiting.

## 1.6 — November 6, 2026

- **🎄 Christmas tab:** shown to the right of Grad Year while **Show the Christmas tree button** is on (Settings → Extras); it appears and disappears on the touchscreen and phones as soon as the switch changes.
  - 50 Christmas albums in `christmas-albums.json`, matched to Spotify ahead of time (ID, title, artist, year, cover) so the tab costs no searches: 14 Classics, 14 Pop, 9 Country, 7 Christian, 6 Kids & Movies.
  - Genre chips: All, Classics, Pop, Country, Christian, Kids & Movies, and **Your Christmas** (your playlists and family playlists whose names include Christmas, Xmas, holiday, Noel or Navidad).
  - The first card, **Christmas Top 40**, opens the Christmas countdown.
  - Albums open like Greatest Albums: songs one at a time or **Queue the whole album**.
  - **Snowy Shuffle:** the Shuffle button on this tab ticks with sleigh bells, chases red and green on the Hue lights and lands with bells and snowflakes. It stays inside the chip you're on, and works from the Couch Remote.

## 1.5.4 — November 6, 2026

- **Clear Up Next:** a **Clear** button next to the Up Next count (shown when 2 or more songs are waiting). First tap turns it red and asks "Clear all N?"; a second tap within 4 seconds empties the line. On the touchscreen and the Couch Remote (new `qclear` command), not guests' phones. Settings → Jukebox → Clear queue still works too.

## 1.5.3 — November 6, 2026

- **iPhone carousel covers:** some covers in the phone's cover flow drew only a strip at the top and stayed black (seen in New Releases). iPhone Safari paints 3D-turned images as GPU tiles and runs short of graphics memory with 640px art. On iPhone/iPad the carousel now loads Spotify's 300px version of each cover (album and artist art) and the center cover's large glow shadow is replaced with a smaller one. The touchscreen is unchanged.

## 1.5.2 — November 6, 2026

- **New Releases is weekly:** Spotify releases new music on Fridays, so the saved list now lasts until the next Friday 5 AM (local time) instead of 12 hours. The jukebox checks every 15 minutes; once the week turns over it rebuilds the list the first time nothing is playing (or by noon either way). The old list keeps showing instantly until the new one is ready.

## 1.5.1 — November 6, 2026

- **New Releases on phones:** building the tab took about 25 Spotify searches, more than the 20-per-30-seconds budget, so the first load could take over 30 seconds and phones gave up after 20 ("Couldn't load this section"). Now:
  - Each build checks 8 of your top artists (a different 8 each day) instead of 20, about 13 searches in all; earlier "For you" finds that are still new are kept.
  - The result is saved on the jukebox for 12 hours and survives reloads; after that the saved copy shows instantly while a fresh one builds in the background.
  - Phone browse requests go through the jukebox's tab cache, and phones wait up to 60 seconds for a section instead of 20.

## 1.5 — November 6, 2026

- **🎲 Shuffle** button next to the section title on Featured, Albums, Playlists and Artists. The cover flow spins for about 4 seconds (ping-ponging through short lists), ticking and slowing like a prize wheel while the Hue lights chase colors; the winner flips forward with confetti and a fanfare.
- **What plays:** an artist's Greatest Hits (top 10), an album in order, or 10 shuffled songs from a playlist. The first song plays now; the rest go after any songs already in Up Next. On Artists it picks within the selected genre chip. It avoids recent picks.
- If Spotify search is paused, an artist spin falls back to that artist's songs in the chart-song library.
- Tap the covers mid-spin to skip to the result. Free; touchscreen and Couch Remote only (the remote's button spins the big screen on the tab and chip the phone is showing).

## 1.4 — November 6, 2026

- **Move to a new jukebox** (Settings → Extras): **Save setup file** downloads `grifftunes-setup-DATE.json` with the Spotify Client ID, Hue pairing and speaker plugs, family members, genre picks, credits, Up Next, the room and the Couch Remote code. **Load setup file** (tap twice to confirm) on the new computer restores them and reloads. No camera needed. Your own Spotify sign-in is left out on purpose; sign in once on the new box.
- About GriffTunes has a "Moving to a new jukebox" section.

## 1.3.1 — November 6, 2026

- **Song library settings trimmed:** just the count and the overnight switch (now "Find new chart songs overnight"). "Find songs now," "Download library file" and the explanation fold under **More**.

## Song library update — November 6, 2026

- `song-library.json` now has every Hot 100 Top 20 and country chart song: 8,590 entries, 8,427 matched to Spotify (165 aren't on Spotify). This is the complete library from the jukebox's overnight builder, merged with the earlier dataset file, so new jukeboxes start with nothing left to look up.

## 1.3 — November 5, 2026

- **Settings in tabs:** Spotify, Jukebox, Phones, Lights, Screen and Extras down the left side (across the top on narrow screens), so nothing needs a long scroll on the touchscreen. Related settings sit side by side in two columns, and the Spotify setup and family how-to notes fold away.
- **Save is always visible** in a bar at the bottom and saves every tab at once; "Unsaved changes" shows when something's been changed. Settings reopens on the tab you used last.
- The Lights panel's settings link now opens the Lights tab.

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
