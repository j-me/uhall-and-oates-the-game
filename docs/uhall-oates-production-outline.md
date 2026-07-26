# Uhall & Oates: Production Story Outline

## Current implementation

This document reflects the playable browser campaign currently in the project: six sequential chapters plus a two-scene epilogue, original illustrated backgrounds and character sprites, inventory puzzles, perspective scene-intro crawls, chat-bubble dialogue, CRT presentation, configurable repository-safe audio, and short outcome animations.

**Format:** PG-13 satirical point-and-click adventure.  
**Writing rule:** named people are fictional comic characters in a fan-fiction setting. Use title allusions and original jokes; do not quote song lyrics.  
**Player character:** John Oates.  
**Core antagonist:** Reardon Records and its Recall Clause contract machine.

## Logline

After Jesse and Joe Reardon abduct Daryl Hall in a real record crate, leaving an empty decoy behind on Old Orchard Beach Pier, John Oates follows a chain of shipping evidence through New York, a wiffle-ball stadium, London, Tokyo, and The Forks, Maine. He must break the Reardons’ contract-broadcast scheme before it turns Daryl’s voice into permanent label property.

## What the Recall Clause does

The Reardons have revived a buried clause in their old artist contracts. Their machine is a fraudulent contract scanner connected to a broadcast system: it treats Daryl’s coerced recorded voice as a new signature, falsely claiming he agreed to reactivate the old contract and return to Reardon control. The Tokyo recording truck creates the false “agreement” signal; the broadcast tower sends it; and the Maine archive scanner applies it to the contracts.

Daryl’s hidden counter-melody changes the broadcast from an agreement to a cancellation. John’s Private Eyes manifest then proves the Reardons classified the same contract as both ordinary shipping and artist property. At the finale, the scanner receives a revoked signature and contradictory records at the same time, so the Recall Clause collapses rather than binding anyone.

## Play and presentation rules

- Every chapter is a self-contained, linear inventory chain with no timing failures, pixel hunts, or irreversible item loss.
- Critical discoveries are communicated in object descriptions, dialogue, and result messages. Optional jokes never block completion.
- **LOOK** plus an inventory item displays a contextual inventory description in the message bar, then clears the verb selection.
- Choosing **USE** and then an inventory item clears the verb-button highlight while keeping the item selected for use on a hotspot.
- Hotspots use percentage bounds and are statically checked to ensure active zones do not overlap.
- Scene transitions use a three-dimensional perspective crawl over a chapter-specific illustration. A dark translucent scrim keeps the moving text readable, then fades early enough to reveal the brighter full-color art as the crawl finishes. The opening retains **“You Can Go For That!”** while later chapters use scene-specific taglines. The entire game sits inside a CRT-style bezel with scanlines and vignette.
- Each crawl provides a short spoiler-free recap of the pursuit, the new location, the featured characters, and the immediate stakes. It must not name the required item, interaction order, puzzle settings, or solution.
- Successes trigger a small, non-blocking visual animation. The scene state updates immediately, so animations never prevent interaction.
- John reacts to successful actions with contextual expression sprites. His frustrated reaction appears only after every third failed action rather than interrupting every unsuccessful click. Named NPCs also have expression variants used for dialogue and puzzle outcomes.
- On pointer-based devices, selecting inventory attaches its illustrated icon to the cursor; selecting an item clears the verb-button highlight. Touch devices retain large controls, safe-area spacing, and inventory labels without depending on hover.
- **Settings** replaces the old sound-only control. It provides Sound, Original/External music selection, and Debug Mode. Its Advanced view copies or applies the full configuration as JSON; the same configuration can be supplied at startup through the `settings` query parameter as JSON or base64.
- Debug Mode reveals non-overlapping hotspot outlines and direct chapter selection, including the epilogue with its required empty tape roll.

## Character bible

| Character | Story and gameplay function | Voice / implemented beat |
| --- | --- | --- |
| **John Oates** | Player character; practical mover and puzzle solver. | Exhausted, dry, observant. His sprite has a subtle idle animation. |
| **Daryl Hall** | Abducted partner who leaves shipping and musical clues. | Charming and musically distracted. In Chapter 1 his voice comes from the departing truck radio, confirming he is not in the decoy crate. |
| **Joe Timmins** | Uhall & Oates owner and recurring managerial obstruction. | Petty invoice language; the Chapter 1 opening call makes John handle the rescue and a customer delivery at once. |
| **Jesse Reardon / Joe Reardon** | Polished, predatory record executives behind the Recall Clause. | Their fraudulent contract system is exposed in the finale. |
| **Baltos** | New York self-appointed consulting detective. | Rips open a sealed 1987 Topps pack, celebrates finding a Bo Jackson rookie card, then uses the wax wrapper and fossilized gum to reconstruct a shredded invoice. |
| **Luke Jacuzzi** | Wiffle-ball park owner. | Treats a scoreboard repair as a championship event. |
| **Huey Lewis** | Rival mover who becomes an uneasy ally. | Competitive and alarmed when he learns his fleet is expendable evidence. |
| **Michael McDonald** | Chapter 4 London shipping-depot witness and puzzle partner. | Uses a portable-keyboard chord to expose the hidden carbon layer in a rejected form, then signs and seals the artist-export authorization. |
| **Jamo** | Muscular, glasses-wearing rafting guide at The Forks. | Deadpan outdoor expert who anchors the final Maine setting. |

## Campaign map

| Chapter | Implemented scene | Required chain | Exit lead |
| --- | --- | --- | --- |
| 1. **Out of Touch in O.O.B.** | Old Orchard Beach Pier | taffy → crane → fries → gull → manifest | New York: “Private Eyes Only” |
| 2. **Private Eyes in the Big Apple** | Manhattan loading zone | stamp → storage directory → card pack → Baltos | Luke Jacuzzi’s stadium |
| 3. **Kiss on My List** | Luke’s wiffle-ball stadium | invoice → scoreboard → wiffle ball → home-plate launcher | London shipping label |
| 4. **I Can’t Go for That: London** | London shipping depot | rejected form → Michael’s keyboard → authorization → routing stamp → release route copy → London shipping label → route map | Tokyo access pass |
| 5. **Maneater on the Midnight Shipping** | Tokyo cargo district | backstage delivery docket → shipping service lift → access pass → recording truck | Daryl’s counter-melody; return to The Forks |
| 6. **You Make My Dreams Come True in The Forks** | The Forks finale | counter-melody → broadcast tower → manifest → archive chamber | Daryl rescued; sequel crate |

## Chapter 1 — Out of Touch in O.O.B.

**Setting:** Old Orchard Beach Pier and its arcade-boardwalk visual language. The implemented playable scene is the immediate pier aftermath.

**Opening state:** Reardon representatives stage a fake “New Hit Record” demonstration. They bring two matching crates and ask Daryl to sing a demo inside one; its false floor drops, the real crate seals around him, and the Reardon truck takes it away. The visible `abandoned decoy crate` is its empty twin, left to make John search the wrong box. The opening call, truck hotspot, crate hotspot, and Daryl’s faint radio voice repeat this fact.

### Implemented scene data

| Hotspot | Interaction / state | Result |
| --- | --- | --- |
| `reardon-truck` | LOOK or TALK | Confirms the real crate and Daryl left in the departing truck. |
| starting empty tape roll | USE on crane (optional) | A tailored red-herring response points John toward a grippy replacement without consuming the roll. |
| `taffy-bin` | TAKE | Gives **warm taffy coil**. |
| `broken-crane` | USE taffy coil, then operate the repaired claw | Opens a forgiving crane-cabinet puzzle: align over the visible fries, lower the claw, carry them left, and release above the prize chute. Misses reset without consuming anything. Success sets `craneFixed`, gives **French fries**, and pops a fries-dispense animation. |
| `gull` | USE French fries | Sets `gullDistracted`; gull visibly flies away and the background switches to a gull-free variant. |
| `pier-manifest` | TAKE after the gull leaves | Gives **Private Eyes manifest** and completes the chapter. |
| `daryl-crate` | LOOK or TALK before crane repair | Explains that it is a decoy; talking produces Daryl’s truck-radio line. |

**Clue language:** The manifest reads “PRIVATE EYES ONLY,” pointing to the Manhattan consignment. The crane’s prize chute visibly holds the fries, while the gull’s food fixation is stated in its look/talk text.

**Implemented animation/audio:** crane motion and mechanical sound, fries drop, gull flight, gull-free background state, pickup feedback, and a dedicated Chapter 1 soundtrack slot. Public builds always contain the repository-safe original cue; optional External-mode sources are user- or developer-supplied and are not part of the production package.

## Chapter 2 — Private Eyes in the Big Apple

**Setting:** A Manhattan loading zone with Baltos, a self-storage directory, and a deli display.

**Opening state:** The Private Eyes manifest carries into the chapter. Baltos saw the Reardons enter the storage maze but failed to record the unit number. He has recovered the onward invoice in twelve pieces, but claims he needs a flat wax backing and “period-correct adhesive” before he can reconstruct it.

### Implemented scene data

| Hotspot | Interaction / state | Result |
| --- | --- | --- |
| `shipping-label` | TAKE | Gives **shipping label**. |
| `storage-directory` | USE shipping label | Opens a four-unit deduction puzzle. Match the recovered stamp, keep the 760-pound crate under the elevator’s 800-pound limit, and reject Reardon decoys marked `FRAGILE`. Choosing Unit `16-B` sets `reardonUnitFound`; a stamped animation confirms the result. Wrong units are safely eliminated with a reason. |
| `card-display` | TAKE after unit is found | Gives a sealed **1987 Topps baseball-card pack**. |
| `baltos` | USE 1987 Topps pack | Baltos tears open the pack, finds a **Bo Jackson rookie card**, and uses the wax wrapper and fossilized gum to rebuild the invoice. Gives **reconstructed invoice**, triggers the card-pack handoff animation, and completes the chapter. |

**Clue language:** The shipping label exposes the three-circle/right-arrow stamp, 760-pound weight, and `NOT FRAGILE, EMOTIONALLY` handling code. The directory repeats the 800-pound elevator limit, while Baltos identifies `FRAGILE` as the Reardons’ decoy marking. The card pack is only revealed after the correct unit is found; Baltos’s dialogue and the display description establish the trade without spelling out the action order.

**Implemented animation/audio:** storage-unit elimination feedback, `16-B` confirmation stamp, card-wrapper rip and handoff, and a dedicated Chapter 2 soundtrack slot. The audio controller stops the preceding chapter’s score so only one background track plays.

## Chapter 3 — Kiss on My List

**Setting:** Luke Jacuzzi’s indoor wiffle-ball stadium.

**Opening state:** The Reardons rented Luke’s scoreboard for a fake “shipping demonstration,” bolted a shipping lockbox to it as a dead drop, and left without removing it. Luke calls a scoreboard-approved batting order a “kiss-on-my-list inning.” Baltos’s invoice supplies the numbers needed to make that list.

### Implemented scene data

| Hotspot | Interaction / state | Result |
| --- | --- | --- |
| `scoreboard` | USE reconstructed invoice | Sets `scoreboardAligned`; a `1 · 6 · B` scoreboard display confirms the three-part play. |
| `equipment-shed` | TAKE after scoreboard alignment | Gives a **regulation wiffle ball**. |
| `home-plate` | USE regulation wiffle ball | Opens the Jacuzzi Park launcher puzzle. Match the inning, field-position, and outfield-gate dials to `1 · 6 · B`; a correct animated bank shot trips the Reardon shipping lockbox, gives the **London shipping label**, and completes the chapter. Fouls return the ball without consuming it. |
| `luke` | LOOK or TALK | Delivers sports-announcer logistics jokes and distinguishes Luke from John. |

**Clue language:** Baltos’s reconstructed invoice numbers fit the scoreboard’s batting-order slots. Luke’s stated rule keeps the scoreboard gating clear.

**Launcher puzzle art:** `jacuzzi-wiffle-launcher-field-v1.png` supplies the crooked indoor diamond, mechanical ricochet paddles, spring launcher, and Reardon shipping lockbox. `wiffle-ball-v1.png` is the transparent animated ball used for successful bank shots and harmless fouls.

## Chapter 4 — I Can’t Go for That: London

**Setting:** A rain-soaked shipping depot combining a retro record shop, a Reardon-run fake customs checkpoint, and a cargo route map.

### Implemented scene data

| Hotspot | Interaction / state | Result |
| --- | --- | --- |
| `record-shop` | TAKE | Gives a **reversible routing stamp** whose rotating barrel changes `ROUTE COPY WITHHELD` to `ROUTE COPY RELEASED`. |
| `no-can-do-form` | TAKE | Gives the **rejected shipping form**; its faint carbon layer hides an artist-export authorization. |
| `michael-mcdonald` | USE rejected shipping form | Michael vibrates the carbon layer with a keyboard chord, reveals the authorization, then signs and seals it. Gives **signed-and-sealed authorization**. |
| `customs-desk` | USE signed-and-sealed authorization | Files Michael’s authorization and sets `customsAuthorized`, permitting the route copy to be released. |
| `customs-desk` | USE reversible routing stamp after authorization | John replaces the desk’s fixed `WITHHELD` stamp, rotates the replacement to `RELEASED`, and releases the route copy to the shipping map, setting `customsSwapped`. |
| `tube-map` | USE London shipping label after customs swap | Gives **Tokyo access pass**, animates a route flight, and completes the chapter. |

**Clue language:** The rejected form visibly mentions a hidden carbon layer. Michael explains that his keyboard can make carbon paperwork reveal itself. The checkpoint says authorization is required to release a route copy, the stamp visibly offers `WITHHELD/RELEASED`, and the map reports `ROUTE COPY WITHHELD` until both steps are complete.

**Optional comedy:** The player can TALK to the **No Can Do** form before taking it, and Michael treats one sustained keyboard chord as an official document-recovery technique.

## Chapter 5 — Maneater on the Midnight Shipping

**Setting:** Tokyo’s neon cargo district with a karaoke stage-prop warehouse, a secured shipping service lift beside the hotel annex, Huey, and the Reardon recording truck.

### Implemented scene data

| Hotspot | Interaction / state | Result |
| --- | --- | --- |
| `stage-prop-warehouse` | TAKE | Gives a **backstage delivery docket** addressed to the recording truck. |
| `shipping-service-lift` | USE backstage delivery docket | Sets `serviceLiftUnlocked`; a lift-open animation confirms the corridor is available. |
| `recording-truck` | USE Tokyo access pass after the service lift opens | Opens the recording-truck mixing puzzle. Combine a bad vocal, excessive backing track, and impossible advertising promise to force a quality-control service dump. Success gives **Daryl’s counter-melody** and **The Forks return manifest**, triggers a voice-filter overload, and completes the chapter. |
| `huey` | LOOK or TALK | Confirms his reluctant-alliance story turn. |
| `huey` | USE Private Eyes manifest | Optional “bad news / The News” exchange confirms that the Reardons named Huey’s trucks as Daryl’s kidnappers. The manifest is retained as final evidence. |

**Continuity:** Huey initially transported Reardon equipment, then discovers a document that makes his fleet the scapegoat. The truck quarantines faulty recordings so they cannot contaminate the Reardons’ forged agreement signal. Daryl hides his counter-melody inside that quarantine track; forcing all three quality-control faults at once causes a service dump that exposes both the disruptive signal and a return manifest to The Forks archive.

**Clue language:** The warehouse docket visibly names “REARDON RECORDING TRUCK — SERVICE LIFT C.” The lift’s delivery reader and the early access-pass response repeat the same connection. The truck’s LOOK description names the three rejected fault categories, while Huey describes the filter’s preferred opposites: clean solo, tasteful backing, and believable advertising. Wrong mixes report how many catastrophic faults were detected without identifying the exact selections.

**Optional comedy:** Showing Huey the Private Eyes manifest prompts Oates to deliver “bad news.” Huey assumes he means **The News**, then realizes the document proves the Reardons framed his fleet.

## Chapter 6 — You Make My Dreams Come True in The Forks

**Setting:** The Forks, Maine: a Moxie Falls-adjacent outdoor finale, represented by the Reardon archive, river-valley broadcast tower, and Jamo’s rafting presence.

### Implemented scene data

| Hotspot | Interaction / state | Result |
| --- | --- | --- |
| `broadcast-tower` | USE Daryl’s counter-melody | Sets `towerRetimed`; river-valley broadcast waves confirm the Recall Clause timing has been disrupted. |
| `archive-door` | USE Private Eyes manifest after tower timing | Opens the final Recall Clause contradiction console. Replace its three claims with the retimed cancellation signal, performer/witness classification, and The Forks return route. Filing all three contradictions triggers the contract-collapse animation, frees Daryl, and reveals the sequel crate. |
| `jamo` | LOOK or TALK | Establishes Jamo’s rafting-guide voice and Moxie Falls context. |

**Continuity:** Huey delivers John to Maine; Jamo brings him past the Reardon roadblocks by river. The broadcast tower normally amplifies Daryl’s coerced voice into the Recall Clause. His counter-melody reverses that signal. The archive scanner accepts the Private Eyes manifest, which identifies Daryl as a performer and witness rather than anonymous property. The Tokyo return manifest disproves the Reardons’ claim that the transfer was permanent. Faced with all three contradictions at once, the Recall Clause collapses.

**Resolution:** John turns the Reardons’ own documentation against them. Daryl is free, agrees to carry one box, Huey is pushed into an embarrassing provisional partnership, and a fresh Reardon label creates the sequel hook.

## Epilogue — Return to Sender

The rescue flows directly into a playable wrap-up at The Forks, with no intervening scene crawl. John, Daryl, Jesse Reardon, and Joe Reardon are all visible. Jesse and Joe use their established character designs as inspectable/talkable characters. The sequel hook remains in the Chapter 6 rescue resolution rather than appearing as an inaccessible epilogue interaction. A final direct cut then lands on Joe Timmins, in his light-blue suit and aviator sunglasses, pointing at the open trunk of a gold Nissan Maxima and ordering John to get in for “trunk service.” John puts the long-carried empty tape roll in the trunk instead; this opens the in-game ending video. Closing the player reveals the final game-complete panel and a **RETURN TO HOME** button. That action resets chapter state, flags, inventory, verbs, dialogue UI, and chapter audio before restoring the animated title screen and title music; saved Settings remain intact.

## Implemented inventory reference

Every item has a hover name and a LOOK description. Required inventory is intentionally consumed as soon as its puzzle role is finished, except the **Private Eyes manifest**, which returns for the final archive confrontation.

| Item | Source | Purpose |
| --- | --- | --- |
| warm taffy coil | Old Orchard Beach taffy bin | Repair crane |
| empty tape roll | Starting inventory | Optional crane red herring; placing it in the Maxima trunk unlocks the ending video |
| French fries | Repaired crane | Distract gull |
| Private Eyes manifest | Old Orchard Beach pier | Chapter 2 lead; final archive evidence |
| shipping label | Manhattan | Identify Unit 16-B |
| 1987 Topps baseball-card pack | Manhattan card display | Trade with Baltos |
| reconstructed invoice | Baltos | Align scoreboard |
| regulation wiffle ball | Stadium equipment shed | Load and configure the spring-powered home-plate launcher |
| London shipping label | Stadium | Route London cargo |
| reversible routing stamp | London record shop | Change route copy from `WITHHELD` to `RELEASED` |
| rejected shipping form | London checkpoint | Reveal hidden artist authorization |
| signed-and-sealed authorization | Michael McDonald | Authorize customs classification change |
| Tokyo access pass | London route map | Enter recording-truck bay |
| backstage delivery docket | Tokyo stage-prop warehouse | Open recording-truck service lift |
| Daryl’s counter-melody | Tokyo recording truck | Time final broadcast tower |
| The Forks return manifest | Tokyo recording truck | Disprove the Recall Clause’s permanent-transfer claim |

## Audio, art, build, and interaction production notes

- Character and scene art use original exaggerated 2D cartoon sprites and painted backgrounds with a 1980s adventure-game look.
- The game includes a Uhall & Oates logo placed on a moving truck, character sprites for all named main characters, scene-specific art for all six chapters, a Reardon-focused epilogue, and a dedicated gold-Maxima final scene.
- John has worried, determined, relieved, startled, and frustrated expression variants. Huey, Michael, Baltos, Daryl, Jamo, Luke, Jesse, Joe Reardon, and Joe Timmins have their own reaction poses. NPCs have idle motion and backgrounds use a gentle breathing treatment.
- Puzzle outcomes use distinct visual markers: fries, gull exit, `16-B` stamp, card pack, scoreboard flash, animated wiffle ball, customs stamp, route flight, service-lift opening, musical-note overload, broadcast waves, and contract scatter.
- Story-critical inventory uses the transparent hand-painted `assets/art/ui/inventory-sprites-v1.png` sheet so every item has a consistent, readable cartoon silhouette instead of mixed emoji and CSS placeholders.
- Successful pickups and puzzle actions use event-specific sound effects where available, with synthesized fallbacks. Removed interface sounds are not required for navigation, failed clicks remain quiet, and scenery audio never starts an additional background score.
- Chapter music is exclusive: starting a title, chapter, or epilogue cue stops the previous background source. The Sound setting controls music, ambience, and effects together.
- **Original mode** uses the repository-safe title, six chapter, and epilogue cues shipped with the project.
- **External mode** checks the player’s configured URL for the matching logical slot, may use an ignored local override during private development, and falls back to the repository-safe original cue. Optional recordings and their filenames are intentionally omitted from this production outline because they are not distributable project assets.
- If every file-based candidate fails, the audio engine can fall back to the original procedural synth score. Public builds exclude the entire local-override directory.

| Logical music slot | Story use |
| --- | --- |
| `title` | Home screen |
| `chapter-01` | Old Orchard Beach |
| `chapter-02` | Manhattan |
| `chapter-03` | Jacuzzi Park |
| `chapter-04` | London |
| `chapter-05` | Tokyo |
| `chapter-06` | The Forks |
| `outro` | Rescue wrap-up and Maxima scene |

- The production build bundles and minifies JavaScript and CSS, converts eligible art to smaller WebP files, copies app icons and the manifest, and excludes private settings and ignored local music.
- The installable web app includes iPhone/iPad launch art, maskable icons, safe-area-aware touch layouts, and a service worker for the repository-safe application shell.
- Open Graph and large Twitter-card metadata use the versioned 1200×630 truck-only social card. The truck’s existing painted logo is preserved rather than re-typeset, preventing blurry duplicate promotional text.

## Future expansion constraints

The original broader multi-scene chapter plan remains valid as a content-expansion direction, but new scenes must preserve the current campaign’s clear item chains and completion leads. When adding a scene:

1. Keep every critical solution exposed by at least two visible clues.
2. Add each required inventory item in a reachable, ordered state.
3. Define percentage hotspot bounds and run the overlap/solvability verifier.
4. Give consequential interactions a visible state update or short animation.
5. Preserve the campaign geography: Old Orchard Beach opens the story, the international shipping trail broadens it, and The Forks, Moxie Falls, and Jamo anchor the Maine conclusion.
