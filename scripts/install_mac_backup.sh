#!/usr/bin/env bash
# One-time setup on the Mac mini: monthly GriffTunes backups into Google Drive.
# On the 1st of each month at 3:17 AM (or the next time the Mac is awake), it updates a full clone of the repo,
# runs scripts/make_backup.sh into "My Drive/GriffTunes Backups", keeps the newest 6 zips, and shows a
# notification reminding you to save the jukebox's own backup (Settings → System → Offsite backup → Save backup).
#
# Install:    curl -fsSL https://raw.githubusercontent.com/jgriffin187/grifftunes/main/scripts/install_mac_backup.sh | bash
# Run now:    launchctl kickstart gui/$(id -u)/com.grifftunes.backup
# Log:        ~/Library/Logs/grifftunes-backup.log
# Uninstall:  launchctl bootout gui/$(id -u)/com.grifftunes.backup; rm ~/Library/LaunchAgents/com.grifftunes.backup.plist
set -euo pipefail
LABEL=com.grifftunes.backup
SRC="$HOME/GriffTunes/backup-src"
KEEP=6

# Google Drive for desktop folder
DRIVE="$(ls -d "$HOME"/Library/CloudStorage/GoogleDrive-*/"My Drive" 2>/dev/null | head -1 || true)"
if [ -z "$DRIVE" ]; then
  echo "Google Drive for desktop isn't set up on this Mac (no ~/Library/CloudStorage/GoogleDrive-…/My Drive)." >&2
  echo "Install it from google.com/drive/download, sign in, then run this again." >&2; exit 1
fi
DEST="$DRIVE/GriffTunes Backups"; mkdir -p "$DEST"

# Full (non-shallow) clone; the repo is public, so no sign-in is needed
mkdir -p "$(dirname "$SRC")"
[ -d "$SRC/.git" ] || git clone https://github.com/jgriffin187/grifftunes.git "$SRC"

RUN="$HOME/GriffTunes/run_backup.sh"
cat > "$RUN" <<EOF
#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
set -e
echo "=== \$(date) ==="
cd "$SRC"
git fetch --quiet origin && git checkout --quiet main && git reset --quiet --hard origin/main
bash scripts/make_backup.sh "$DEST"
# keep the newest $KEEP zips
ls -1t "$DEST"/GriffTunes-backup-*.zip 2>/dev/null | tail -n +$((KEEP+1)) | while IFS= read -r f; do echo "removing old \$f"; rm -f "\$f"; done
osascript -e 'display notification "Monthly backup saved to Google Drive. Now tap Save backup on the jukebox (Settings → System → Offsite backup) and put that file in GriffTunes Backups too." with title "GriffTunes backup"' || true
EOF
chmod +x "$RUN"

PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
mkdir -p "$(dirname "$PLIST")"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
 <key>Label</key><string>$LABEL</string>
 <key>ProgramArguments</key><array><string>/bin/bash</string><string>$RUN</string></array>
 <key>StartCalendarInterval</key><dict><key>Day</key><integer>1</integer><key>Hour</key><integer>3</integer><key>Minute</key><integer>17</integer></dict>
 <key>StandardOutPath</key><string>$HOME/Library/Logs/grifftunes-backup.log</string>
 <key>StandardErrorPath</key><string>$HOME/Library/Logs/grifftunes-backup.log</string>
</dict></plist>
EOF
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"

echo "Installed. Backups go to: $DEST"
echo "Running the first one now…"
bash "$RUN"
