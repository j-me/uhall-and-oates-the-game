# Uhall & Oates II: Adult Relocation

## Production summary

The gold 1993 Maxima from the original epilogue contains a surviving Reardon Catalog Relocation Unit. When John repairs its impossible cassette deck in 1986, the device files people as company property and sends them to the years attached to Joe Timmins’s contradictory paperwork. John lands in 1993, Daryl in 1987, and Michael McDonald in 2001.

The Reardons’ new scheme is not a second Recall Clause. They are building **Consolidated Adult Education**, a corporation that can own artists and movers because Joe’s handbook defines them differently whenever convenient. The handbook has no original author: its future copy was sent back to young Joe in 1976, creating the circular authority on which the corporation depends.

The sequel is a seven-chapter campaign plus an interactive epilogue. It uses the original game’s verbs and inventory model, adds independent character inventories, a shared temporal trunk, persistent campaign saves, and a three-character chapter.

## Playable and supporting cast

- **John Oates (1986/1993):** practical lead, burdened with every physical and administrative job.
- **Daryl Hall (1987):** turns performance instincts into safety and switchboard solutions while avoiding ordinary lifting.
- **Michael McDonald (2001):** playable technical lead whose musical ear makes sense of a voice-routed network.
- **Joe Timmins:** begins the accident, appears throughout 1993, interrupts the cross-time call, and supplies every contradiction used in the finale.
- **Young Joe Timmins (1976):** is tempted by a handbook promising management status before learning it has no author.
- **Jesse and Joe Reardon:** exploit Joe’s paperwork to create the corporation.
- **Kenny Loggins:** 1987 safety director who treats warehouse compliance as a cinematic danger zone.
- **Michael Bolton:** competent 2001 CTO—officially “Chief Tenor Officer”—who accidentally digitized the Reardon system.
- **Baltos, Huey Lewis, and Jamo:** recover the time-displaced regulator and fleet evidence during the storage auction.

## Chapter flow

### 1. Did It in a Minute, Billed It as an Hour

Inside the trunk of a gold 1993 Maxima parked at the 1986 depot, John takes Joe’s metal-reinforced necktie and a broken cassette adapter. He repairs the adapter and configures the Catalog Relocation Unit using contradictions heard on Joe’s tape.

Critical chain: `emergencyNecktie + cassetteAdapter → repairedAdapter → temporalTrunk puzzle → joeLedger`.

### 2. Adult Education in the Danger Zone

At a 1987 Reardon executive retreat, Daryl converts a seminar sash into technically valid safety equipment. Kenny awards a Priority Danger cassette. In the copier room, Joe Reardon complains that the cassette routes hazardous material away from distribution while Jesse waits for a five-hundred-copy print run. Their comments expose different parts of the copier’s logic without stating its complete solution. Daryl uses the safety rules to produce one review copy, quarantine Joe Timmins’s handbook, and substitute a harmless vocal exercise for its ownership rules.

Critical chain: `seminarSash → compliantVest → dangerCassette → safetyCopier puzzle → alteredHandbook`.

### 3. So Close, Yet So 1993

John combines a blank cassette and expired security badge at a mall announcement booth. A deliberately dull authorized closing message shuts down the temporal kiosk, releasing the Maxima’s routing chip and Joe’s contradictory contractor form.

Critical chain: `blankAnnouncement + expiredBadge → mallClosing puzzle → closingCassette → routingChip + contractorForm`.

### 4. Possession Obsession Storage Auction

John gives Baltos an unreleased commemorative cassette. By proving its future release date and scarcity, he diverts every bidder to the wrong lot. Jamo pulls the abandoned regulator locker from the river; Huey recovers the Reardon lien against his fleet.

Critical chain: `futureCollectible → storageAuction puzzle → auctionClaim → temporalRegulator + fleetLien`.

### 5. Your Hard Drive Is on My List

At SmoothMove.com in 2001, Michael McDonald finds an ambiguous “Michael M.” badge. Michael Bolton merges both Michael accounts into a dual administrator identity. Their chord, vocal range, and Virtual Joe’s instinctive denial unlock the server and send its audit log through the Maxima trunk.

Critical chain: `michaelBadge → adminBadge → vocalNetwork puzzle → auditLog`.

### 6. Out of Touch-Tone

The player switches freely between Daryl, John, and Michael, each with a separate inventory. Daryl sends a touch-tone code from 1987; John converts it into pager shorthand in 1993; Michael combines that translation with the 2001 audit log. Items move between eras only through the synchronized temporal trunk.

Critical chain: `alteredHandbook → touchToneCode → pagerTranslation + auditLog → filingNumber`.

### 7. Back Together Again, Pending Approval

The original warehouse occupies 1976, 1987, 1993, and 2001 simultaneously. John files the decoded number and challenges five claims with accumulated evidence. The handbook rejects itself: it has no author and its classifications contradict each other.

Critical chain: `filingNumber + five evidence flags → handbookContradictions puzzle → adultTimelineRestored`.

### Epilogue

The restored 1993 depot contains Joe’s revised anniversary handbook. Taking it completes the campaign and reveals a shipping label dated 2008.

## Engine-facing content model

Campaign metadata lives in `src/game-data/campaigns/adult-relocation/adult-campaign.js`. Chapters use `adult-chapter-*` modules and scene entry points use `adult-scene-*` modules. Each scene declares its background, characters, percentage-based hotspots, verb responses, item recipes, prerequisites, state changes, and transition.

Campaign state stores the campaign/chapter/scene, active actor and actor locations, independent actor inventories, shared trunk contents, evidence flags, visited scenes, and current interaction. Saves are versioned and namespaced per campaign. Debug starts seed the evidence needed to test the cross-time and finale chapters independently.

## Fairness and continuity

- Every required item is visibly obtainable before its use.
- Required items cannot be irreversibly discarded.
- Puzzle overlays state their internal rule without selecting the answer.
- Failed actions never change state.
- The trunk cannot be used until Chapter 5 synchronizes it.
- Chapter 6 makes the current actor and each owned item explicit.
- Every chapter ends with a concrete item, record, or route into the next year.
- The 2008 label resolves the story while preserving a sequel hook.

## Art and audio

The campaign uses eight 1536×1024 hand-painted cartoon backgrounds, three new transparent character sprites, and the returning cast’s existing sprites. Repository-safe MP3 cues use `adult-01-original.mp3` through `adult-07-original.mp3` plus `adult-outro-original.mp3`. Optional local or external commercial music remains user-configured and is never included in production builds.
