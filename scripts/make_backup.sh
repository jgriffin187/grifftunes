#!/usr/bin/env bash
# Builds GriffTunes-backup-YYYY-MM-DD.zip: full git history (bundle), a plain copy of the code,
# the third-party files GriffTunes loads from CDNs, RESTORE.md and checksums. See RESTORE.md.
# Usage (from a full, non-shallow clone):  bash scripts/make_backup.sh [OUT_DIR] [NOTES_DIR]
#   OUT_DIR    where the zip goes (default: the folder above the repo)
#   NOTES_DIR  optional folder of extra notes to include under notes/
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(cd "${1:-$REPO/..}" && pwd)"
NOTES="${2:-}"
DATE="$(TZ=America/Denver date +%F)"
NAME="GriffTunes-backup-$DATE"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
PKG="$WORK/$NAME"; mkdir -p "$PKG/third-party"

cd "$REPO"
if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  echo "This clone is shallow (missing history). Run: git fetch --unshallow" >&2; exit 1
fi

# 1. Every branch, tag and commit
git bundle create "$PKG/grifftunes.bundle" --all
git bundle verify "$PKG/grifftunes.bundle" >/dev/null
# prove it restores
git clone -q "$PKG/grifftunes.bundle" "$WORK/check"
[ "$(git -C "$WORK/check" rev-parse HEAD)" = "$(git rev-parse HEAD)" ] || { echo "bundle check failed" >&2; exit 1; }
rm -rf "$WORK/check"

# 2. Current code as plain files
mkdir -p "$PKG/grifftunes-code"
git archive HEAD | tar -x -C "$PKG/grifftunes-code"

# 3. CDN libraries and fonts (best effort: npm registry)
( cd "$PKG/third-party" && npm pack --silent peerjs@1.5.4 qrcode-generator@1.4.4 \
    @fontsource/bungee @fontsource/caveat @fontsource/im-fell-english @fontsource/monoton \
    @fontsource/outfit @fontsource/special-elite >/dev/null 2>&1 ) || echo "warning: some third-party files could not be fetched" >&2

# 4. Docs
cp RESTORE.md "$PKG/RESTORE.md"
if [ -n "$NOTES" ] && [ -d "$NOTES" ]; then mkdir -p "$PKG/notes"; cp -r "$NOTES"/. "$PKG/notes/"; fi
{
  echo "GriffTunes backup $DATE"
  echo "Version: $(grep -oE "GT_VERSION='[^']+'" index.html | cut -d"'" -f2)"
  echo "Commit:  $(git rev-parse HEAD)  ($(git log -1 --format=%cd --date=short))"
  echo "Commits: $(git rev-list --all --count)"
} > "$PKG/BACKUP-INFO.txt"

# 5. Checksums (inside the package) and the zip
( cd "$PKG" && find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS )
rm -f "$OUT/$NAME.zip"
( cd "$WORK" && zip -qr -X "$OUT/$NAME.zip" "$NAME" )
cat "$PKG/BACKUP-INFO.txt"
echo "Wrote $OUT/$NAME.zip ($(du -h "$OUT/$NAME.zip" | cut -f1))"
