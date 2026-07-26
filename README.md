# Uhall & Oates: The Game

A complete six-chapter browser point-and-click adventure with a two-scene epilogue. It uses a classic verb-and-inventory interface, exaggerated 2D adventure-game art, chat-bubble dialogue, CRT presentation, puzzle-state animations, and chapter-specific MP3 music.

John Oates follows the Reardons’ shipping trail from Old Orchard Beach to New York, London, Tokyo, and The Forks, Maine to rescue Daryl Hall and break Reardon Records’ Recall Clause. The game’s implementation and story continuity are documented in [`docs/uhall-oates-production-outline.md`](docs/uhall-oates-production-outline.md).

## Run

Open `index.html` in a modern browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Click **Start the Rescue**, then use **LOOK**, **USE**, **TALK**, and **TAKE** with scene objects and inventory. Important clues are repeated in dialogue, object descriptions, and visible scene changes. Use **Settings** from the title screen or top bar to control sound, select the soundtrack source, and reveal the debug chapter selector.

## Production build

Create a clean deployable site in `build/`:

```sh
npm run build
```

The build bundles and tree-shakes the complete JavaScript module graph into one minified file, minifies CSS and HTML, rewrites production references, minifies the service worker and manifest, and converts art PNGs to high-quality WebP when that produces a smaller file. Alpha quality is retained, installation icons remain PNG, and all HTML/CSS/JavaScript/service-worker image references are rewritten automatically. It also copies runtime media, adds `.nojekyll` for GitHub Pages, verifies every service-worker app-shell path, and prints code and image size results plus the production target URL.

Image optimization uses `cwebp` when available and falls back to ImageMagick. The build deliberately excludes source modules, `settings.local.json`, and `assets/audio/music-local/`.

## Install on iPhone or iPad

Deploy the folder to an HTTPS website, open that address in Safari, tap **Share**, then choose **Add to Home Screen**. The installed game opens without Safari controls and uses the supplied truck icon and launch artwork. After the first complete load, the service worker keeps the app shell available offline and caches visited chapter art, music, and video as they are used. Installation and offline caching do not work when `index.html` is opened directly through a `file://` URL.

## Local and distributable music

The repository ships with eight original synth cues in `assets/audio/music/`. Their note patterns are defined by this project and can be regenerated with:

```sh
node scripts/generate-repo-music.mjs
```

The generator requires `ffmpeg`. Optional commercial recordings belong in `assets/audio/music-local/`, which is excluded by `.gitignore`. Do not force-add files from `music-local/` to GitHub unless you independently have distribution rights.

The in-game **Settings** menu controls the soundtrack:

- **External** tries a saved per-song URL first, then the matching `music-local/` file, and finally the repository-safe original cue.
- **Original** always uses the original synth cues in `assets/audio/music/`.
- **Debug Mode** reveals chapter selection and hotspot outlines. It does not change the selected soundtrack.

Settings are saved in the browser for future sessions. URL fields are optional and can point to any browser-playable audio resource whose host permits cross-origin playback.
The Settings panel can also copy the complete configuration as JSON or apply a pasted JSON block, making it easy to move every music URL and toggle to another browser at once.

### Settings query URL

Pass a complete configuration at startup with either a `settings` query parameter or the SMS-friendly `#settings:` fragment. The query accepts URL-encoded JSON or Base64; the fragment accepts Base64 or URL-safe Base64 without an equals-sign delimiter. The configuration takes precedence over browser-saved settings and is saved after it is validated. The game then removes the consumed configuration from the address bar so later Settings changes and refreshes use the saved configuration.

For a URL-encoded JSON link using the ignored `settings.local.json`, run:

```sh
npm run settings:url
```

For a shorter, share-friendly Base64URL link targeting the production GitHub Pages site, run:

```sh
npm run settings:url:base64
```

That prints:

```text
https://j-me.github.io/uhall-and-oates-the-game/#settings:[base64settings]
```

The JSON command prints an `index.html?settings=...` URL for local use. You can also provide any hosted page address as the second argument:

```sh
node scripts/create-settings-url.mjs settings.local.json https://example.com/uhall-and-oates/
```

Add `base64` as the final argument to generate a hosted Base64URL link:

```sh
node scripts/create-settings-url.mjs settings.local.json https://example.com/uhall-and-oates/ base64
```

Malformed query JSON is ignored and the game falls back to the saved settings.

## Campaign puzzle flow

Each chapter has a small, ordered inventory chain. Items are consumed once their role is complete, except the **Private Eyes manifest**, which returns as the final evidence item.

1. Taffy → crane → French fries → gull → manifest
2. Shipping label → storage directory → 1987 card pack → Baltos
3. Shredded invoice → scoreboard → wiffle ball → home-plate launcher
4. Rejected form → Michael McDonald → authorization → reversible routing stamp → London shipping label → route map
5. Backstage delivery docket → shipping service lift → Tokyo pass → recording truck
6. Counter-melody → broadcast tower → manifest → archive chamber

## Where things go

- `src/game-data/chapters/` — one declarative JSON-like module per chapter.
- `src/game-data/scenes/` — reusable scene definitions and hotspot lists.
- `src/game-data/dialogue/` — dialogue trees, localization, and cutscene text.
- `src/game-data/puzzles/` — self-contained interactive puzzle controllers and shared overlay helpers.
- `src/engine/` — renderer, game state, interactions, scene loading, and save support.
- `src/ui/` — shared inventory, verb bar, dialogue, completion, and video presentation.
- `assets/art/` — backgrounds, characters, props, and UI art, organized by chapter.
- `assets/audio/` — music, ambience, and sound effects.
- `assets/fonts/` — licensed fonts.

## Add a chapter

1. Create `src/game-data/chapters/chapter-02.js` from `chapter-01.js`.
2. Add its initial scene to `src/game-data/scenes/`.
3. Import/register the chapter in `src/game-data/registry.js`.
4. Put supplied art and audio in matching `assets/` folders, then reference paths in the scene definition.

Scene hotspots use percentage coordinates, so they scale with the scene image. The demo's CSS illustrations can later be replaced by background images without altering puzzle code.
