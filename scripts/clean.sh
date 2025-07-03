#!/usr/bin/env bash
set -e

# find-and-delete all matching directories
find . \
  \( -name node_modules -o -name dist -o -name .next -o -name .turbo \) \
  -type d \
  -prune -exec rm -rf '{}' +

echo "✔️  All node_modules, dist, .next, and .turbo directories have been removed."
