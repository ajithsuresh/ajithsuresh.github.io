#!/usr/bin/env bash
# Copy only the files that belong on the live site into a clean directory.
# Usage: scripts/build_site.sh [output-dir]   (default: _site)
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="${1:-_site}"

rm -rf "$OUT"
mkdir -p "$OUT"

rsync -a \
  --exclude='.git' --exclude='.github' --exclude='.impeccable' --exclude='.claude' \
  --exclude='.DS_Store' --exclude='_site' --exclude='scripts' --exclude='node_modules' \
  --exclude='PRODUCT.md' --exclude='DESIGN.md' --exclude='README.md' --exclude='.gitignore' \
  ./ "$OUT"/

# Serve files as they are; skip Jekyll processing.
touch "$OUT/.nojekyll"

echo "Built $(find "$OUT" -type f | wc -l | tr -d ' ') files into $OUT"
