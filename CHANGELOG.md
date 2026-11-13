# GriffTunes changelog

Newest first. Version numbers also show in GriffTunes under **Settings → About GriffTunes**.

## 1.16.9 — November 12, 2026

- **Country Gold in the overnight song finder:** the library's list of songs to find now includes every Country Gold #1 (newest years first), after the Hot 100 songs. About 1,100 of them were never on the Hot 100, so they had no Spotify match or cover until a countdown played them. Same pace as before: 1–6 AM, only when nothing is playing, one lookup every 20 seconds, stops for the night after any Spotify slow-down. Found songs come with their album cover.
- **Settings → Song library** has a second line for Country Gold: songs found out of the total, not on Spotify, left to find (with a rough number of nights), and how many have covers.

## 1.16.8 — November 12, 2026

- **Country Gold, every year:** `country-top20.json` now covers 1958–2026 (69 years; it had 1986, 1991 … 2021 only). Built the same way from Wikipedia's yearly lists of Billboard country #1s (Hot C&W Sides / Hot Country Singles / Hot Country Singles & Tracks / Hot Country Songs, topped up with Country Airplay #1s from late 2012 on). Double A-sides keep the A-side title. The eight existing years are unchanged. Years before 1967 had fewer than 20 different #1s, so they count down from fewer. 2026 runs through the Nov 14 chart; it is not refreshed automatically.

## 1.16.7 — November 12, 2026

- **Countdown opens on last week's chart** instead of 20 years ago (jukebox and phones). Country, which may have no chart for the current year, falls back to the newest year that has one.

## 1.16.6 — November 11, 2026

- **Album covers in Countdown and Grad Year:** each row shows the song's cover next to its number. Covers come from the song library; the ~6,500 library songs without one get it from Spotify's public embed info (oEmbed, no sign-in, not counted against the Spotify request budget) when the row scrolls near the screen, three at a time, and the cover is then kept in the library on the jukebox. Songs not on Spotify show an empty tile.

## 1.16.5 — November 11, 2026

- **Unplayable songs dimmed:** album, playlist and Liked Songs lists now ask Spotify for playability (`market=from_token`). Songs Spotify marks `is_playable:false`, and songs Spotify refused when the jukebox tried to start them (remembered on the jukebox, last 500), show dimmed with "Not available on Spotify" and no Queue / Play next / Play now buttons.
- Those songs are left out of "Queue the whole album/playlist" (the button's count is playable songs only), the house mix, and keep-going playback through an album or playlist. Tapping one from anywhere else gets "Spotify can't play …" instead of a charge.
- A refused song that later plays fine is taken off the list. Cached lists repaint when a song's playability changes.

## 1.16.4 — November 10, 2026

Fix: music jumping from the WiiM to the (silent) jukebox when a song was picked.

- When Spotify refused a song with "Restriction violated" (a track it can't play: pulled from the catalog or not licensed here), GriffTunes treated every failed start as "the speaker has gone missing": it retried, gave up on the WiiM, switched to the jukebox's own player, failed there too ("Playback error: Player command failed: Restriction violated"), and then stayed on the jukebox for every song after that.
- Now, if the speaker is still listed by Spotify and the refusal is a restriction, GriffTunes tries once more, then treats it as an unplayable song: it stays on the speaker, shows "Spotify can't play … right now. Skipping it", clears Now Playing and moves on to the next song. After three refusals in a row it stops instead of skipping forever.
- Credits spent on a refused song are not refunded yet.

## 1.16.3 — November 10, 2026

- Settings → Extras → DJ Griff has a **Check the connection** button: it tries the WiiM over plain http and https (and two alternate ports) and shows which answer, how fast, and the Chrome version and window mode. For tracking down the "Not secure" label on the new Chromebox.

## 1.16.2 — November 10, 2026

- **Full screen in the installed app:** "Go full screen on first tap" was skipped whenever GriffTunes ran as an installed app, on the assumption that the app window was already full screen. ChromeOS can open the app as an ordinary window with a title bar, so the check now looks at whether the display is actually full screen.

## 1.16.1 — November 10, 2026

- **Queue the whole album everywhere on the jukebox:** the button now shows on every album opened on the touchscreen (search results, artist pages, tabs), at the usual album price. Before, it only showed on Greatest Albums, Christmas albums, playlists and the couch remote. Guests' phones are unchanged.

## 1.16 — November 10, 2026

- **Finer volume on the jukebox:** − and + buttons at the ends of the Now Playing volume slider. A tap moves the volume 2 points; holding steps repeatedly. The slider still drags for big moves.
- **Volume number:** the current volume (0–100) shows over the knob while it is being changed on the touchscreen, then fades.
- Phones and the couch remote are unchanged.

## 1.15.7 — November 9, 2026

Fix: the memorial's lights (reported: no storm blue, no flashes with the bell).

- **Lights off when the memorial opens:** the blue was only ever sent to lights that were already on, so with the room dark nothing happened, and the bell flashes had nothing to flash. The memorial now switches the room on in storm blue, and switches it back off when it closes (unless the music turned the lights on in the meantime).
- **Blue sent too early:** when the song start turned the lights on ("first song after a quiet stretch"), that happened after the blue command, so the lights came up in their old colors. The blue is sent again once the song is going.
- **Blue could be replaced:** anything that re-applied the normal light mode while the memorial was open (leaving the screensaver, a coin flash, the Lights window) put album colors back. `hueApply()` now keeps the blue while the memorial is open.
- **Hue requests time out after 8 seconds** (they could wait forever, blocking every command queued behind them), and a room-wide command that the bridge rejects because GriffTunes' light group is gone re-creates the group and resends once.

## 1.15.6 — November 9, 2026

More from the code review (items 4, 6 and 9).

- **Facts ticker:** the countdown ticker no longer measures the page on every frame. Widths are read about once a second and when a fact joins or leaves; the screensaver and turntable copies are rebuilt only when the facts change. Also fixes a small hop on the big-screen ticker each time a fact scrolled off (the gap between facts was assumed to be 36 px; it is now measured).
- **Charts and song library kept on the jukebox:** the service worker saves `hot100-top20.json`, `country-top20.json`, `grad-facts.json` and `song-library.json`. A copy under 6 hours old is used straight away; older than that, the network is asked first and the saved copy is the fallback, so a new weekly chart still shows up the same day. The chart archive and song library also load on their own 45 seconds after start-up, so the first tap on Countdown or Grad Year doesn't wait.
- **DJ Griff clean-up:** 20 seconds after the WiiM finishes a clip, GriffTunes deletes it from the Firebase bucket (this needs the bucket's rules to allow deletes; if they don't, nothing changes). Clips made ahead of time but never used are released from memory.

## 1.15.5 — November 9, 2026

Tune-up from a full code review (items 3, 5, 7 and 8 of the review list).

- **Less drawing behind things:** the Now Playing visualizer stops redrawing, and the background animation pauses, while an album/search/settings window, the Alpine faceplate or the Edmund Fitzgerald memorial covers them (before, the bars kept animating under the windows' blur).
- **Redraw only on change:** the progress bar and times are written only when their text or width changes (was 5 writes a second, even paused); the Alpine LCD segments are rebuilt only when their characters change, and the mini LCD rests while covered; the cover flow no longer auto-advances while it's hidden (Countdown and Grad Year tabs, windows, full-screen views).
- **Lighter update check:** every 10 minutes GriffTunes now asks GitHub Pages only for the page's ETag (a HEAD request) instead of downloading and hashing all ~600 KB; it falls back to the old way if no ETag or Last-Modified comes back.
- **Reloads wait:** auto-update and the weekly fresh start no longer reload while the memorial (including the bell), the lyrics screen or the Alpine faceplate is open.

## 1.15.4 — November 8, 2026

- The Fitz (Edmund Fitzgerald) button's label now uses the top bar's Bungee lettering, like the Christmas countdown next to it, instead of the memorial's old-style serif.

## 1.15.3 — November 8, 2026

- **DJ Griff voices:** the Voice menu now lists all 30 Google Chirp 3 HD voices (16 male, 14 female) in American, British and Australian English (90 choices), grouped, with the five original picks under Favorites. The voice's locale is sent as the request's languageCode; Neural2-J stays the fallback.
- **Pause before he talks:** each clip now starts with real silence (Settings → Extras → DJ Griff → "Pause before he talks": none to 3 s, default 1.5 s) so the WiiM/Evolves don't swallow his first word. The silence is added directly to the MP3 (silent Layer III frames copied from the clip's own frame header, any Xing/Info header frame dropped), and the clip's length is counted from its frames, so the WiiM wait and the next song's start stay exact. Checked with 24 kHz and 44.1 kHz test files: 1.54–1.58 s of silence decoded, durations correct in Chrome.

## 1.15.2 — November 8, 2026

- **Lights switch instead of automatic lights-off.** Removed 1.15.1's automatic lights-off and its settings. The Lights window (the jukebox's lights button) now has a **Lights** row above **Speakers**, in the same style: it shows whether the room's lights are on and a **Turn off / Turn on** button. Off fades the room group off; on turns it on and reapplies the current light mode. The light mode itself isn't changed, so "lights on with the music" still works after a quiet stretch.

## 1.15.1 — November 8, 2026

- **Lights off when it's quiet.** New Settings → Philips Hue switch "Turn the lights off after the music has been quiet a while" (on by default) with its own minutes (default 30, 5–600). Once nothing has played for that long, GriffTunes checks the bridge and, if any of the room's lights are on, fades the room group off over 5 s (the speaker plugs are separate) and shows a toast. It happens once per quiet stretch, never before the first song since startup, not while the lights are on Hands off or while the Edmund Fitzgerald memorial is open. The next song's existing "lights on with the music" turns them back on.

## 1.15 — November 8, 2026

- **The Alpine car radio is the jukebox's radio.** Removed the Settings → Extras → Radio style choice; on the jukebox the 📻 button always opens the Alpine faceplate and Now Playing always shows the small green LCD instead of the tuning dial. The old `S.radioUi` setting is ignored. Phones (guest and couch remote) keep the tuning dial, since the faceplate doesn't fit a phone screen.

## 1.14.6 — November 8, 2026

- **Memorial: a truer Fitzgerald.** The side-view ship is redrawn in feet from her 1971 and Corps of Engineers photos: red hull with a raised stern and raised forecastle and a raked bow; the white forecastle band with portholes and "EDMUND FITZGERALD" in black; a low, rounded forward house under the pilothouse with its wide window band, roof overhang and radar mast; 21 hatch coamings; a low two-level white after house with portholes; the black-yellow-black Columbia stack and after mast. Less vertical exaggeration (ship now 86% of the strip's width, 150 px tall strip) so the superstructures read as low blocks instead of towers. Drawn at the screen's pixel density so it stays sharp.

## 1.14.5 — November 8, 2026

- **Memorial: the wreck itself.** The "Found" card now shows an underwater video still of "EDMUND FITZGERALD" on the pilothouse (supplied by Josh; photographer unknown, so credited that way), stored in the repo at `photos/efz-wreck-name.jpg` (1280 px) and kept on the jukebox by the service worker (`/photos/` added to its keep list). It replaces the CURV III photo. Photo credits now name where each photo comes from (Wikimedia Commons or stored with GriffTunes).

## 1.14.4 — November 8, 2026

- **Memorial: the seas beside the ship.** The wind/wave boxes and looping wave became one strip: a header with wind (and a compass arrow showing which way it blows, NE then NW) and waves, over a canvas side view of the Fitzgerald (red hull, white sheer stripe, 21 hatch coamings, after cabins and stack, forward house and pilothouse) in a moving sea.
  - Heights to scale with each other (about 2.75 px per foot): her loaded freeboard of 11 ft 6 in (NTSB report, winter load line from 1973) is marked with a dashed line on a 0/10/20/30 ft scale; length is squeezed to fit. Storm waves are drawn steep, with crests standing higher above the calm line than troughs fall below it, so 18–25 ft seas roll over her deck.
  - Wave height and wind ease from card to card using the record's numbers (2 → 10 ft by 1 AM, 14 ft at 2:45 PM, 18–25 ft by 5:20 PM, 25+ at 7 PM) with eased values in between; wind streaks blow against her early (NE) and from behind later (NW). At 7 PM every seventh crest comes in 45% bigger for the "two giant waves". She pitches and heaves a little, rides up to 3 ft lower after the 3:30 PM damage report (illustrative), and at 7:15 slides under and fades out. A note under the strip changes with the story ("Her deck: 11½ ft…", "Waves now taller than her deck", "Listing and riding lower · both pumps running", "Gone. No distress call was ever sent.").
  - ~30 fps, only while the story is on screen (stops while exploring or while the bell rings).

## 1.14.3 — November 8, 2026

- **Memorial photos, all from the wreck itself.** Replaced the two modern storm scenes (Two Harbors 2017, Pictured Rocks 2017): "Gale warnings" now shows NOAA's surface weather map of November 10, 1975, and "Two giant waves" shows the NTSB chart of both ships' probable tracks. "Found" now shows CURV III, the Navy robot that found and photographed the wreck in May 1976 (no free-licensed underwater photos of the wreck exist; the 1976 and later footage is copyrighted). "Twenty-nine times" shows the Fitzgerald's own bell (Duchene9, CC BY-SA 3.0), which also sits dimly behind the swinging bell while it rings. Explore tabs: the ship tab shows taconite from the wreck, the storm tab the 1975 weather map, "Why did she sink?" the NTSB wreck sketch, and the bell tab adds Mariners' Church.
- **Ships follow the course.** The ship icons were redrawn with a pointed bow, pilothouse forward and stack aft, and each one turns (smoothly) so her bow points along her track as the course bends south past Caribou Island.

## 1.14.2 — November 8, 2026

- **Memorial photos.** Each of the 16 story cards now has a photo filling the space under the wind/wave panel (slow zoom, caption, photographer and license), and the explore tabs have one at the top. 20 images from Wikimedia Commons, all public domain, CC0 or CC BY / BY-SA: the Fitzgerald in 1971 (Greenmars), under way and from above the bow (USACE, U.S. Coast Guard), in the MacArthur Lock (USACE); the Arthur M. Anderson arriving in Duluth in November 1975 (Gary Todd collection); NWS Marquette's modeled winds and waves at 7 PM Nov 10; Whitefish Point Light (USCG); a recovered lifeboat (1977); the NTSB wreck sketch; the wreck-site map; Mariners' Church; the bell at the Shipwreck Museum; the Whitefish Point memorial; taconite from the wreck; Gordon Lightfoot (1974 Reprise ad); and present-day storm scenes from Two Harbors and Pictured Rocks (captioned with their years). Credits are also listed on the Sources tab.
- Photos load from Wikimedia's servers, are preloaded with the rest of the memorial, and the service worker keeps copies on the jukebox. A photo that can't load just hides.

## 1.14.1 — November 8, 2026

- **Couch remote: Reload jukebox.** A full-width button under Speakers and Lights on the couch remote (owner link only). First tap arms it ("TAP AGAIN", amber); a second tap within 4 seconds sends `reload` (an owner-only command) and the jukebox shows a toast and reloads 1.5 s later. Music on a Spotify Connect speaker keeps playing and is picked back up after the reload; Up Next is saved; the remote's normal retry reconnects it.

## 1.14 — November 8, 2026

- **📻 Alpine car radio (test radio style):** Settings → Extras → **Radio style** → "Alpine car radio (test)". The tuning dial stays the default; phones keep the dial either way.
  - The radio button opens a full-width faceplate modeled on Josh's 1990s Alpine 7280 (traced Alpine wordmark, SCC HEAD cassette door, treble/bass sliders, green-backlit buttons) instead of turning the radio on and off. The Now Playing card shows a small green LCD in place of the dial; tapping it opens the faceplate.
  - **Presets 1–6** tune directly (turning the radio on if needed); **BAND** cycles FM1/FM2/FM3 so all 18 stations have a button; **DN/UP** and **SEEK/TUNE** step through the stations by frequency with a seek animation on the LCD; **▶▶** skips; **⏏**, Close or tapping outside closes it; it auto-closes after 30 s without a touch.
  - **Knob:** drag (around or up/down) for volume, with the green ring showing the level and VOL on the LCD; a tap turns the radio off.
  - **LCD:** DSEG7 Classic (frequency) and DSEG14 Classic (band and 12-character name line) with unlit "ghost" segments; RDS-style scrolling of the song and artist every few seconds; SEEK/ST/DX/MONO/LOUD indicators. Fonts bundled in `vendor/dseg/` (SIL OFL) and kept on the jukebox by the service worker.

## 1.13.1 — November 8, 2026

- **Memorial: saved on the jukebox.** Leaflet 1.9.4 now ships with GriffTunes (`vendor/leaflet/`, BSD-2 license included) instead of loading from cdnjs. The service worker keeps `vendor/*` and `efz-bell.mp3` in a cache-first asset cache, and serves Google Fonts and the song's cover from the jukebox while refreshing them in the background. A minute after startup GriffTunes preloads the map code, the bell (held in memory, so the bell starts instantly when it plays on the jukebox) and the cover. Map tiles still come from Esri over the internet (not pre-downloaded, to stay within Esri's terms).
- **Memorial: lighter on the Chromebox.** The map is dimmed with a tinted layer instead of a CSS filter on the tiles; Leaflet's zoom, fade and marker animations are off and the map slides to each part of the lake in 1.6 s instead of a 3.2 s fly. Sleet is drawn at half resolution and about 30 fps, and stops completely when there's no storm or the bell is ringing. The play button only redraws when it changes.

## 1.13 — November 8, 2026

- **🔔 Edmund Fitzgerald memorial** (jukebox only): a ship's-bell button ("Fitz") next to the Christmas tree. Tapping it plays Gordon Lightfoot's "The Wreck of the Edmund Fitzgerald" right away (a paid song that was playing goes back to the front of Up Next) and opens a full-screen memorial with just a mini player for controls.
  - **Voyage:** a Leaflet map (Esri Ocean Basemap with lake-depth shading, dimmed for the dark screen; half-degree grid, compass rose) where the Fitzgerald and the Arthur M. Anderson sail an approximate course from Superior to the wreck site, synced to the song's position. 16 story cards from departure (Nov 9, 2:30 PM) through the sinking (about 7:15 PM Nov 10), the search, the discovery and the Mariners' Church bell; a running 1975 clock; wind and wave panels from the record; sleet and lightning on screen as the storm builds; the map flies to each part of the lake. Places include Superior, Two Harbors, Isle Royale, Marquette (storm center about 7 AM), Michipicoten and Caribou islands, Six Fathom Shoal, Whitefish Point and the wreck. Without internet the map falls back to a simple chart.
  - **Explore:** tapping the story or the map pauses the story; tabs for the ship, all 29 crew, the storm, the theories (hatch covers, shoaling, rogue waves, structural failure), the bell, the song and sources. "Resume voyage" goes back.
  - **Bell:** `efz-bell.mp3` (synthesized bronze bell, 29 tolls 6 s apart and a 30th for all Great Lakes mariners). Each toll shows a crew member and lights a candle, and flashes the Hue lights white before they settle back to storm blue (warm glow after the 30th). Plays on the WiiM (pausing Spotify, then handing the WiiM back to Spotify) when the music is on the WiiM and a WiiM address is set, otherwise in the browser.
  - When the song ends the queue waits and the memorial offers the bell; Close resumes Up Next. Auto-closes 3 minutes after the song or bell finishes. Lights go dim storm blue while open; album-color changes, Christmas light drift, frost and the screensaver pause.
  - Settings → Extras switch "Show the ship's bell button", on by default.

## 1.12.1 — November 8, 2026

- **Volume sliders are knob-only:** on the touchscreen volume slider, the turntable's sliders, the screensaver mini player and the phone's slider, a touch has to start on (or right next to) the knob to change the volume. A tap or a swipe that starts elsewhere on the bar, like wiping frost off the screen, is ignored instead of jumping the volume. Swipes that start off the slider never affected it.

## 1.12 — November 8, 2026

- **❄ Frosty screen** (Christmas Mode or the 🎄 Christmas tab, jukebox only): after a minute without touches, frost creeps in from the edges (procedural ice texture with feathery crystals, ragged front), reaching full frost after about 8 minutes: heavy at the edges, a see-through haze in the middle. Any touch pauses the growth.
  - **Finger wipes:** dragging clears a streak (radius about 7% of the screen height) that frosts back over in about a minute. Taps and swipes still work normally underneath.
  - **🔥 Heater:** a glowing button in the bottom-right corner once frost builds up. Tapping it sends an orange glow up from the bottom that melts the ice in about 8 seconds, with drips running down the screen. It also comes on automatically 2 minutes after the screen is fully frosted.
  - Frosts over the screensaver too (the fireplace looks like it's behind a frosty window). Fades away when the Christmas look ends.
  - Drawn into a 480×270 canvas scaled to full screen, redrawn only while it changes. Settings → Extras → **Frosty screen** switch, on by default.

## 1.11.1 — November 8, 2026

- **Lights on with the music:** when the first song starts after the jukebox loads or after 10+ quiet minutes, and every Hue light in the room is off, GriffTunes turns the room's lights on (the speaker plugs aren't touched by this; they have their own setting). If any light is on, nothing changes. Skipped in Hands off. New switch in Settings → Philips Hue: "Turn the lights on when music starts (if they're all off)", on by default.

## 1.11 — November 7, 2026

- **Bigger fun-fact ticker:** on the jukebox, the ticker moves out of Now Playing to a bar along the bottom of the main screen, under the album row (and under the countdown list), running from the left edge to the Up Next panel. It's 64 px tall with 28 px text (was 42 px / 16 px), bigger labels and badge, and scrolls at 74 px/s (was 62), slower relative to the larger text.
- The turntable and screensaver mini player tickers are about 1.5× bigger.
- Phones and the Couch Remote keep the ticker in Now Playing, unchanged.

## 1.10.1 — November 7, 2026

- **About brought up to date:** DJ Griff (how he sounds on the WiiM vs. this jukebox, setup, voices, failures, troubleshooting, data sources, developer notes), whole-playlist queuing for 5 credits, tab names (My Albums / My Playlists; Featured is demo-only), Shuffle handing off to the radio or house mix, the FROM · tag, "Speaker" for the unnamed WiiM, Couch Remote's Clear and Shuffle, Settings → Extras, the setup file carrying DJ Griff's keys, cache ages, file size, the full list of phone messages, and the missing 1.9.x entries in the version history.
- **Fix:** the Christmas tab's countdown card said "Christmas Top 40", but it starts the 25-song Christmas Countdown. It now says Christmas Countdown, and its art shows 25.

## 1.10 — November 7, 2026

- **DJ Griff follows the music.** No more "plays through" setting; at each break GriffTunes checks where Spotify is playing:
  - **The WiiM** (the speaker used in the WiiM test, any speaker named WiiM or reported with a code instead of a name, or the speaker set for the smart plugs): the WiiM plays the clip over Wi-Fi in a short pause, as before.
  - **This jukebox** (the Chromebox itself, for example with a Bluetooth speaker connected): the next song starts at about a fifth of the volume, DJ Griff talks over its intro from the Chromebox, then the volume glides back up over about 1.3 seconds.
  - **Any other Spotify speaker:** no break.
- The Bluetooth-to-the-WiiM mode is gone, so the jukebox's own coin and button sounds are never muted for DJ Griff anymore.

## 1.9.7 — November 7, 2026

- DJ Griff on the WiiM: the next song waited only 1.6 seconds past the clip's length, but the WiiM takes a moment to fetch the clip before it starts, so the last words got cut off. The wait is now the clip's length plus 3.5 seconds.

## 1.9.6 — November 7, 2026

- DJ Griff talks to the WiiM over plain http when the WiiM allows it, and only uses https (with its self-signed certificate) as a fallback. Loading anything with a certificate error makes Chrome label the whole page "Not secure".

## 1.9.5 — November 7, 2026

- Fix: after a DJ Griff break on the WiiM, the next song could land on the jukebox itself ("GriffTunes") instead of the WiiM. Playing a clip by link takes the WiiM off Spotify for a few seconds, and GriffTunes gave up after one retry. Now, after each clip, GriffTunes waits up to 15 seconds for Spotify to list the WiiM again and wakes it before starting the next song, and for a minute after a clip it retries the WiiM for up to ~15 seconds before ever falling back to the jukebox.

## 1.9.4 — November 7, 2026

- DJ Griff over Wi-Fi confirmed working on the real WiiM (Firebase bucket `grifftunes-dj.firebasestorage.app`, clips deleted after 1 day by a lifecycle rule). About updated: Wi-Fi is the recommended setup; Bluetooth stays as an option.

## 1.9.3 — November 7, 2026

- **DJ Griff over Wi-Fi (test):** a new "DJ Griff plays through" choice. "The WiiM over Wi-Fi" uploads each clip to a Firebase Storage bucket (as `dj-….mp3`, so the link needs no escaping) and tells the WiiM to play that link through its local HTTP API (`setPlayerCmd:play:<url>`), then GriffTunes restarts Spotify on the WiiM. No Bluetooth, so nothing drops out. Settings → Extras → DJ Griff has the WiiM address, the bucket, a **Trust the WiiM** button (Chrome has to accept the WiiM's self-signed certificate once) and a **Test on the WiiM** button that runs the whole path and times it. In Wi-Fi mode the jukebox's own sounds stay on.

## 1.9.2 — November 7, 2026

- DJ Griff takes two keys: a Google Cloud key for Text-to-Speech (the voice) and a Google AI Studio key for Gemini (the writing). Google Cloud keys now need a service account to use Gemini, while AI Studio keys work directly. If the writing key is empty, the voice key is used for both.

## 1.9.1 — November 7, 2026

- DJ Griff Preview: when the Google key's API restrictions block Gemini or Text-to-Speech, the message now says which service to tick on the key instead of "Gemini gave no line".

## 1.9 — November 7, 2026

- **🎙 DJ Griff:** a radio-style host. Every 3–5 songs, when a song ends on its own, the music stays paused while DJ Griff introduces the next song (title, artist, why it's playing: requested, radio station, countdown position, Christmas Mode, continuing an album) and sometimes one fun fact, then the next song starts.
  - Lines are written by Gemini (`gemini-2.5-flash`, falling back to `gemini-flash-latest`) from facts GriffTunes already has: a Wikipedia line about the artist and the song's Hot 100 Top 20 run. The prompt forbids inventing facts.
  - Spoken by Google Cloud Text-to-Speech (Chirp 3 HD voices, five to choose from; falls back to Neural2).
  - The audio plays from the Chromebox, which reaches the WiiM over Bluetooth. The WiiM switches to Bluetooth for the clip and back to Spotify when the next song starts (about 2 seconds in testing). It can't talk over music.
  - The next intro is prepared about 8 seconds into the song before it (for paid picks, continuing albums/playlists and radio); countdowns, Christmas Mode and the house mix make theirs at the break.
  - Settings → Extras → DJ Griff: on/off, Google Cloud API key (kept only on the jukebox and in the setup file), voice, and a Preview button.
  - While DJ Griff is on, all of GriffTunes' own sounds (coins, ticks, scratches, radio static, bells) are silent, since any Chromebox sound would pull the WiiM onto Bluetooth.
  - Any failure skips the break; after two failures in a row a warning toast says why. Skip during a break ends it; a song started by someone during a break wins.
- Removed the DJ voice test from 1.8.1.

## 1.8.1 — November 7, 2026

- **DJ voice test** (Settings → Extras): checks whether a virtual DJ could speak through the WiiM over Bluetooth from the Chromebox. Part 1 speaks over the music without pausing; Part 2 pauses Spotify, speaks, then starts Spotify on the WiiM again and times how long it takes. Uses the built-in ChromeOS voice; this only tests the audio path. If it doesn't work cleanly, the DJ idea is dropped.

## 1.8 — November 6, 2026

- **Keep going from the album or playlist:** when a picked song ends and Up Next is empty, GriffTunes plays the next song from where that song was picked, in order, instead of the house mix.
  - Works for albums, playlists (including Liked Songs and family playlists), Greatest Albums, the Christmas tab and an artist's Greatest Hits list. A song picked from search continues with the rest of its album.
  - It follows the most recently picked song, including picks from phones and the Couch Remote.
  - Order when Up Next empties: a running countdown, Christmas Mode, then the album or playlist, then the radio, then the house mix. When the album or playlist runs out, the radio or house mix takes over.
  - These songs are free and show a **FROM · album name** tag in Now Playing.
  - Whole albums or playlists queued with the "Queue the whole…" button, and Shuffle picks, don't continue past what was queued.
  - Starting the house mix, a radio song or a countdown ends it.

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
