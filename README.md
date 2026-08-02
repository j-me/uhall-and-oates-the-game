# Uhall & Oates: The Game

A three-campaign browser point-and-click adventure: the complete six-chapter original, the seven-chapter time-travel sequel **Uhall & Oates II: Adult Relocation**, and the six-chapter conclusion **Uhall & Oates III: The Sound of Moving On**. It uses a classic verb-and-inventory interface, exaggerated 2D adventure-game art, chat-bubble dialogue, CRT presentation, puzzle-state animations, and chapter-specific MP3 music.

John Oates follows the Reardons’ shipping trail to rescue Daryl Hall, a 1993 Maxima then scatters the crew across four decades, and the final campaign brings John and Daryl back to music through a shared live performance. The campaigns are documented in [`docs/uhall-oates-production-outline.md`](docs/uhall-oates-production-outline.md), [`docs/adult-relocation-production-outline.md`](docs/adult-relocation-production-outline.md), and [`docs/final-campaign-storyline.md`](docs/final-campaign-storyline.md).

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

The phone layout uses dynamic viewport units and display safe areas for current iPhone and Android devices. Portrait mode expands interactive puzzles to the usable screen height and temporarily hides the command deck; landscape mode places the scene and controls side by side. Touch controls use 44–52 px targets, inventory scrolls horizontally, settings becomes a full-screen sheet, and browser keyboard resizing is enabled for URL and JSON fields.

## Local and distributable music

The repository ships with twenty-three original synth cues in `assets/audio/music/`. Their note patterns are defined by this project and can be regenerated with:

```sh
node scripts/generate-repo-music.mjs
```

The generator requires `ffmpeg`. Optional commercial recordings belong in `assets/audio/music-local/`, which is excluded by `.gitignore`. Do not force-add files from `music-local/` to GitHub unless you independently have distribution rights.

Download every configured local track with `npm run download:music`, or only the final campaign with `npm run download:music:final`. The downloader also accepts a custom slot prefix as its second argument.

The in-game **Settings** menu controls the soundtrack:

- **External** tries a saved per-song URL first, then the matching `music-local/` file, and finally the repository-safe original cue.
- **Original** always uses the original synth cues in `assets/audio/music/`.
- **Debug Mode** reveals chapter selection and hotspot outlines. It does not change the selected soundtrack.

Optional files in `assets/audio/music-local/` use neutral slot-based names:

- `title.mp3`
- `chapter-01.mp3` through `chapter-06.mp3`
- `outro.mp3`
- `adult-01.mp3` through `adult-07.mp3`
- `adult-outro.mp3`
- `final-01.mp3` through `final-06.mp3`
- `final-outro.mp3`

The finale performance always uses the project-owned recording at `assets/audio/music/youre-doing-it.mp3`. It ships with the game and is not replaced by the **External** or **Original** soundtrack setting.

Settings are saved in the browser for future sessions. URL fields are optional and can point to any browser-playable audio resource whose host permits cross-origin playback.
The Settings panel can also copy the complete configuration as JSON or apply a pasted JSON block, making it easy to move every music URL and toggle to another browser at once.

### Settings query URL

Pass a complete configuration at startup with the `settings` query parameter. It accepts URL-encoded JSON, standard Base64, or URL-safe Base64. The configuration takes precedence over browser-saved settings and is saved after it is validated. The game then removes the consumed query parameter from the address bar so later Settings changes and refreshes use the saved configuration.

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
https://j-me.github.io/uhall-and-oates-the-game/?settings=[base64settings]
```

The JSON command prints an `index.html?settings=...` URL for local use. You can also provide any hosted page address as the second argument:

```sh
node scripts/create-settings-url.mjs settings.local.json https://example.com/uhall-and-oates/
```

Add `base64` as the final argument to generate a hosted Base64URL link:

```sh
node scripts/create-settings-url.mjs settings.local.json https://example.com/uhall-and-oates/ base64
```

Malformed query settings are ignored and the game falls back to the saved settings.

## Campaign puzzle flow

Each chapter has a small, ordered inventory chain. Items are consumed once their role is complete, except the **Private Eyes manifest**, which returns as the final evidence item.

1. Taffy → crane → French fries → gull → manifest
2. Shipping label → storage directory → 1987 card pack → Baltos
3. Shredded invoice → scoreboard → wiffle ball → home-plate launcher
4. Rejected form → Michael McDonald → authorization → reversible routing stamp → London shipping label → route map
5. Backstage delivery docket → shipping service lift → Tokyo pass → recording truck
6. Counter-melody → broadcast tower → manifest → archive chamber

## Where things go

- `src/game-data/campaigns/original/` — original campaign, `original-chapter-*`, `original-scene-*`, and `original-dialogue-*` modules.
- `src/game-data/campaigns/adult-relocation/` — sequel campaign plus `adult-chapter-*` and `adult-scene-*` modules.
- `src/game-data/campaigns/finale/` — final campaign plus `final-chapter-*` and `final-scene-*` modules.
- `src/game-data/puzzles/original/` — original-campaign interactive puzzle controllers.
- `src/game-data/puzzles/shared/` — reusable puzzle presentation and the data-driven logic console.
- `src/game-data/puzzles/finale/` — the touch- and keyboard-friendly four-lane rhythm rehearsal.
- `src/game-data/items/` — inventory inspection copy shared by the engine.
- `src/game-data/debug/` — campaign test loadouts.
- `src/engine/` — renderer, game state, interactions, scene loading, and save support.
- `src/ui/` — shared inventory, verb bar, dialogue, completion, and video presentation.
- `assets/art/campaigns/original/` — original-campaign chapter backgrounds, reveal cards, and props.
- `assets/art/campaigns/adult-relocation/` — sequel chapter backgrounds and reveal cards.
- `assets/art/campaigns/finale/` — final-campaign depot, studio, rehearsal, concert, epilogue, visible prop, and campaign-specific inventory art.
- `assets/art/characters/` and `assets/art/ui/` — character and interface art shared by both campaigns.
- `assets/audio/` — music, ambience, and sound effects.
- `assets/fonts/` — licensed fonts.

## Add a chapter

1. Create a prefixed chapter module inside the campaign’s `chapters/` folder.
2. Create prefixed scene modules inside the campaign’s `scenes/` folder.
3. Register the chapter in its campaign entry module; the global registry only exposes campaigns.
4. Put supplied art and audio in matching `assets/` folders, then reference paths in the scene definition.

See [`src/game-data/README.md`](src/game-data/README.md) for naming and runtime-ID compatibility rules.

Scene hotspots use percentage coordinates, so they scale with the scene image. The demo's CSS illustrations can later be replaced by background images without altering puzzle code.
