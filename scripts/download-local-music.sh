#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
settings_file="${1:-${project_dir}/settings.local.json}"
music_dir="${project_dir}/assets/audio/music-local"

if [[ ! -f "${settings_file}" ]]; then
  echo "Settings file not found: ${settings_file}" >&2
  exit 1
fi

mkdir -p "${music_dir}"

node -e '
  const fs = require("fs");
  const settingsPath = process.argv[1];
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));

  const entries = Object.entries(settings.externalUrls ?? {})
    .filter(([, url]) => typeof url === "string" && url.trim());

  if (!entries.length) {
    throw new Error("settings.local.json contains no external music URLs.");
  }

  for (const [slot, url] of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slot)) {
      throw new Error(`Unsafe music slot name: ${slot}`);
    }
    process.stdout.write(`${slot}\t${url.trim()}\n`);
  }
' "${settings_file}" |
  while IFS=$'\t' read -r slot url; do
    target="${music_dir}/${slot}.mp3"
    temporary="${target}.download"

    trap 'rm -f "${temporary}"' EXIT

    echo "Downloading ${slot}..."
    curl \
      --fail \
      --location \
      --show-error \
      --silent \
      --connect-timeout 15 \
      --max-time 120 \
      "${url}" \
      --output "${temporary}"

    if [[ ! -s "${temporary}" ]]; then
      echo "Downloaded file is empty: ${slot}" >&2
      exit 1
    fi

    mv "${temporary}" "${target}"
    trap - EXIT
    echo "Saved ${target}"
  done

echo "Local music download complete."
