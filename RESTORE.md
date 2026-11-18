# Restoring GriffTunes from a backup

This is how to rebuild GriffTunes from scratch: new jukebox, new GitHub repo, or both.
Each monthly backup lands in Google Drive → **GriffTunes Backups** as `GriffTunes-backup-YYYY-MM-DD.zip`.

## What's in a backup zip

| File | What it is |
|---|---|
| `grifftunes.bundle` | The whole git repo with **every version and commit** (code, videos, art, wake-word models, chart data, CHANGELOG). |
| `grifftunes-code/` | The current code as plain files, so nothing has to be unpacked with git. |
| `third-party/` | Copies of what GriffTunes loads from the internet at runtime: PeerJS 1.5.4 (Couch Remote / phones), qrcode-generator 1.4.4 (QR codes), and the fonts (Bungee, Caveat, IM Fell English, Monoton, Outfit, Special Elite) as Fontsource npm packages. |
| `notes/` | The Claude project notes (handoff, assistant plan), when the backup was made by the monthly task. CHANGELOG.md has the full history of every version either way. |
| `RESTORE.md` | This file. |
| `SHA256SUMS` | Checksums. `sha256sum -c SHA256SUMS` confirms the zip isn't damaged. |

**Not in the zip (on purpose):** API keys and sign-ins. **Also not in the zip:** this jukebox's own data (settings, genre picks, lists, credits and the song library it has found). That comes from Settings → System → **Offsite backup → Save backup**, which saves `grifftunes-backup-YYYY-MM-DD.json` with no keys in it. Put that file in the same Drive folder every month.

## 1. Get the code back on GitHub

```bash
git clone grifftunes.bundle grifftunes
cd grifftunes
git remote set-url origin https://github.com/jgriffin187/grifftunes.git   # or a new repo
git push -u origin main
```

Then, on GitHub: **Settings → Pages →** Deploy from a branch, `main`, `/ (root)`. The site will be at `https://jgriffin187.github.io/grifftunes/`.
If the repo name or account changes, the address changes too, and the Spotify Redirect URI (step 3) has to change with it.
**Actions:** turn on the "Update Hot 100 charts" workflow, which runs every Wednesday.

**If the CDNs ever disappear:** copy `peerjs.min.js` and `qrcode.js` from `third-party/` into `vendor/`, and point `PEER_URLS` and the qrcode URL in `index.html` at them. The fonts in `third-party/` are a fallback for the Google Fonts link.

## 2. Set up the jukebox

- **Hardware:** an ASUS Chromebox 5a (Celeron 7305, 8 GB) with a 24" Dell touchscreen and a USB microphone. There are no speakers on the box itself; audio goes through the WiiM Pro to the two Electro-Voice Evolve 70s.
- Open the site in Chrome, add it to the shelf, and launch it **as a Chrome tab in full screen** (tap the app icon, then full screen). This avoids the "Not secure" bar.
- **Restore your data:** Settings → System → Offsite backup → **Restore backup** (tap twice), then pick the newest `grifftunes-backup-….json`. It reloads by itself.

## 3. Re-enter the keys and sign-ins (none of these are in any backup)

| What | Where it's entered in GriffTunes | Where to get a new one |
|---|---|---|
| **Spotify Client ID** | Settings → Music → Music source → Spotify Client ID | developer.spotify.com → Dashboard → your app (or a new app). Redirect URI = the site address with a trailing `/`. Tick Web API + Web Playback SDK. Add your account (and family members) under User Management. |
| **Spotify sign-in** | Settings → Music → Music source → Connect | One tap after the Client ID is in. |
| **Family members** | Settings → Music → Family members' playlists | Each person signs in with Spotify once. |
| **Voice key** (Google Cloud Text-to-Speech) | Settings → DJ Griff → Setup · keys, WiiM and Firebase | console.cloud.google.com → APIs & Services → Credentials → API key with Text-to-Speech enabled. |
| **Writing key** (Gemini) | the same Setup panel | aistudio.google.com → Get API key. You can leave it empty to use the voice key. |
| **Hue bridge** | Settings → Lights → Philips Hue lights | Press the bridge's link button when asked. |
| **Couch Remote / owner link** | Settings → Jukebox → Guests' phones | A new jukebox makes a new owner link and QR code. Re-scan it on your phone and keep it private. |
| **Firebase Storage bucket** | DJ Griff → Setup | The bucket name, e.g. `grifftunes-dj.firebasestorage.app`, comes from console.firebase.google.com → Storage. Needed so the WiiM can play DJ Griff's clips. |

**Spotify warning:** blocks apply to the **whole Spotify account**, and a new Client ID doesn't get around them. After a restore, never bulk-look-up songs. The library in the backup file means GriffTunes doesn't need to search again; let the overnight finder go slowly.

## 4. Home network and devices

- **WiiM Pro:** `192.168.5.14` (https only). Enter it under Settings → DJ Griff → Setup → WiiM address, then tap **Trust the WiiM** (Advanced → Proceed).
- **Hue bridge:** `192.168.4.75`.
- **Hue smart plugs:** "Evolve Left" and "Evolve Right" (in a Hue room called "Speakers") power the speakers; "Mirrorball" powers the mirrorball.
- **Google Home:** a speaker group with the WiiM and the kitchen Nest Hub Max.
- **Mac mini:** the built-in-browser tab "GriffTunes Builder" (`?builder=1`), signed in to Spotify.

## 5. Things to keep doing after a restore (house rules)

- API keys stay on the jukebox only, never in the repo.
- No personal yearbook photos in the public repo.
- The Couch Remote QR code and owner link stay private.
- GriffTunes never turns the Hue lights off automatically. The one exception: the mirrorball turns off when a party mode ends.

## Monthly backups (Mac mini)

The Mac mini makes the zip by itself on the 1st of every month at 3:17 AM and saves it to Google Drive → GriffTunes Backups. It keeps the newest 6. A notification then reminds you to save the jukebox's own backup file into the same folder. It was set up once with:

```bash
curl -fsSL https://raw.githubusercontent.com/jgriffin187/grifftunes/main/scripts/install_mac_backup.sh | bash
```

Run one now: `launchctl kickstart gui/$(id -u)/com.grifftunes.backup`. The log is at `~/Library/Logs/grifftunes-backup.log`.

## Making a backup by hand

```bash
git clone https://github.com/jgriffin187/grifftunes.git && cd grifftunes
bash scripts/make_backup.sh            # writes ../GriffTunes-backup-YYYY-MM-DD.zip
```
