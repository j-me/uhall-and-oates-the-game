# Game-data conventions

Runtime IDs are stable public data. Filenames are authoring structure and use a campaign prefix.

## Campaign modules

- Original campaign: `campaigns/original/original-campaign.js`
- Adult Relocation: `campaigns/adult-relocation/adult-campaign.js`

The global `registry.js` should only import campaign entry modules. A campaign owns its chapter ordering, initial player, initial inventory, and chapter registry.

## Chapter and scene filenames

- `campaigns/original/chapters/original-chapter-01.js`
- `campaigns/original/scenes/original-scene-old-orchard-pier.js`
- `campaigns/original/dialogue/original-dialogue-chapter-01.js`
- `campaigns/adult-relocation/chapters/adult-chapter-01.js`
- `campaigns/adult-relocation/scenes/adult-scene-maxima-trunk.js`

Use lowercase kebab-case and keep the campaign prefix even inside a campaign folder. The redundancy makes search results, stack traces, and production bundles unambiguous.

Each scene file owns and exports its complete scene object. Do not create one-line
scene re-export façades or collect unrelated scene definitions in a central data
file. Small construction helpers shared by multiple scenes belong in a clearly
named helper module such as `adult-scene-helpers.js`.

Do not rename runtime IDs merely to match files. IDs such as `chapter-01`, `adult-01`, and `old-orchard-pier` are referenced by saves, settings, music slots, debug controls, and transitions.

## Shared content

- `characters.js` is the canonical character/sprite registry.
- `items/item-descriptions.js` owns inventory inspection copy.
- `debug/debug-loadouts.js` owns chapter-test starting inventories.
- `puzzles/original/` contains original-campaign puzzle controllers.
- `puzzles/shared/` contains reusable puzzle presentation.
- `puzzles/registry.js` maps stable puzzle IDs to controllers.

Engine and UI modules must not contain chapter dialogue, inventory descriptions, or campaign-specific starting items.
