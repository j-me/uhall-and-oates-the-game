import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { campaigns } from '../src/game-data/registry.js';
import { debugLoadouts } from '../src/game-data/debug/debug-loadouts.js';

const campaign = campaigns.finale;
const state = {
  inventory: new Map(campaign.initialInventory.map((entry) => [entry.id, entry])),
  flags: {},
};

function scene(chapterId) {
  const chapter = campaign.chapters[chapterId];
  return chapter.scenes[chapter.startScene];
}
function hotspot(current, id) {
  const result = current.hotspots.find((entry) => entry.id === id);
  assert(result, `Missing hotspot ${current.id}/${id}`);
  return result;
}
function isActive(entry) {
  return (entry.visibleWhen || []).every((flag) => state.flags[flag])
    && !(entry.hiddenWhen || []).some((flag) => state.flags[flag]);
}
function assertNoActiveOverlaps(current) {
  const active = current.hotspots.filter(isActive);
  for (let index = 0; index < active.length; index += 1) {
    for (let compare = index + 1; compare < active.length; compare += 1) {
      const a = active[index].bounds;
      const b = active[compare].bounds;
      const overlaps = a.left < b.left + b.width && a.left + a.width > b.left
        && a.top < b.top + b.height && a.top + a.height > b.top;
      assert(!overlaps, `Active hit zones overlap: ${current.id}/${active[index].id} and ${active[compare].id}`);
    }
  }
}
function apply(action) {
  assert(!(action.requires || []).some((flag) => !state.flags[flag]), `Missing prerequisite: ${action.requires}`);
  action.removeItems?.forEach((id) => state.inventory.delete(id));
  action.give?.forEach((entry) => state.inventory.set(entry.id, entry));
  action.setFlags?.forEach((flag) => { state.flags[flag] = true; });
  return action;
}
function take(current, id) {
  assertNoActiveOverlaps(current);
  const target = hotspot(current, id);
  assert(target.item, `${id} does not provide an item`);
  state.inventory.set(target.item.id, target.item);
  state.flags[`${id}Taken`] = true;
  assertNoActiveOverlaps(current);
}
function takeAction(current, id) {
  const action = hotspot(current, id).actions?.take;
  assert(action, `${id} has no TAKE action`);
  return apply(action);
}
function use(current, id, itemId) {
  assertNoActiveOverlaps(current);
  assert(state.inventory.has(itemId), `Missing inventory item ${itemId}`);
  const action = hotspot(current, id).useWith?.[itemId];
  assert(action, `${itemId} cannot be used on ${id}`);
  return apply(action);
}

let current = scene('final-01');
take(current, 'packing-blanket');
take(current, 'bent-spool');
use(current, 'anniversary-files', 'label2008');
use(current, 'reel-deck', 'soundBlanket');
use(current, 'reel-deck', 'damagedRehearsalReel');
let action = use(current, 'reel-deck', 'bentSpool');
assert.equal(action.next.chapterId, 'final-02');

current = scene('final-02');
action = use(current, 'stereo-patch-panel', 'rehearsalReel');
assert.equal(action.next.chapterId, 'final-03');

current = scene('final-03');
take(current, 'studio-patch-cable');
use(current, 'studio-patch-bay', 'setListFragment');
action = use(current, 'studio-patch-bay', 'studioPatchCable');
assert.equal(action.next.chapterId, 'final-04');

current = scene('final-04');
take(current, 'blank-cue-card');
use(current, 'brand-harmony-console', 'blankCueCard');
action = use(current, 'brand-harmony-console', 'fullRehearsalMix');
assert.equal(action.next.chapterId, 'final-05');

current = scene('final-05');
use(current, 'rehearsal-route-board', 'broadcastRouteCard');
action = use(current, 'rhythm-rehearsal-floor', 'cleanLiveMix');
assert.equal(action.puzzle, 'rhythmRehearsal');
assert.equal(action.next.chapterId, 'final-06');

current = scene('final-06');
take(current, 'joe-filing-receipt');
use(current, 'concert-control-stations', 'purposeReceipt');
action = use(current, 'concert-control-stations', 'sharedArrangement');
assert.equal(action.next.chapterId, 'final-outro');

current = scene('final-outro');
action = takeAction(current, 'closed-for-rehearsal-sign');
assert(action.complete);
assert.equal(action.performance.audio, 'assets/audio/music-local/Youre_Doing_It.mp3');
assert.equal(action.performance.fallbackAudio, 'assets/audio/music/final-outro-original.mp3');
assert(action.performance.lyrics.length >= 10, 'Final performance must include the complete lyric crawl');
assert.equal(action.performance.duration, 239.592, 'Final performance cue sheet must match the local recording');
assert(action.performance.lyrics.every((entry, index, entries) => Number.isFinite(entry.start) && (!index || entry.start > entries[index - 1].start)), 'Final performance lyrics need ordered recording timestamps');
assert(state.flags.finalCampaignComplete);

for (const chapter of Object.values(campaign.chapters)) {
  for (const currentScene of Object.values(chapter.scenes)) {
    assert(existsSync(currentScene.background), `Missing scene background: ${currentScene.background}`);
    currentScene.decorations?.forEach((entry) => assert(existsSync(entry.src), `Missing scene decoration: ${entry.src}`));
    for (const entry of currentScene.hotspots) {
      const { left, top, width, height } = entry.bounds;
      assert(left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= 100 && top + height <= 100, `Invalid hit zone: ${currentScene.id}/${entry.id}`);
      Object.values(entry.useWith || {}).forEach((entryAction) => {
        if (!entryAction.puzzleData?.controls) return;
        assert(entryAction.puzzleData.effectClass?.startsWith('final-'), `Finale puzzle lacks finale visual treatment: ${entryAction.puzzle}`);
        entryAction.puzzleData.controls.forEach((control) => {
          assert(control.options.includes(control.answer), `Puzzle answer missing from options: ${entryAction.puzzle}/${control.label}`);
          assert(new Set(control.options).size === control.options.length, `Duplicate puzzle options: ${entryAction.puzzle}/${control.label}`);
        });
      });
    }
  }
}

const requiredDebugItems = {
  'final-01': 'label2008',
  'final-02': 'rehearsalReel',
  'final-03': 'setListFragment',
  'final-04': 'fullRehearsalMix',
  'final-05': 'cleanLiveMix',
  'final-06': 'sharedArrangement',
};
for (const [chapterId, itemId] of Object.entries(requiredDebugItems)) {
  assert(debugLoadouts[chapterId]?.some((entry) => entry.id === itemId), `${chapterId} debug start needs ${itemId}`);
}
const finaleItemArt = [
  'bent-spool-v1.png', 'blank-cue-card-v1.png', 'broadcast-route-card-v1.png',
  'clean-live-mix-v1.png', 'damaged-rehearsal-reel-v1.png', 'full-rehearsal-mix-v1.png',
  'label-2008-v1.png', 'purpose-receipt-v1.png', 'rehearsal-route-board-v1.png',
  'restored-rehearsal-reel-v1.png', 'set-list-fragment-v1.png', 'shared-arrangement-v1.png',
  'sound-blanket-v1.png', 'studio-patch-cable-v1.png',
];
for (const filename of finaleItemArt) {
  assert(existsSync(`assets/art/campaigns/finale/items/${filename}`), `Missing finale item art: ${filename}`);
}

const expectedIcons = {
  label2008: 'final-label-2008',
  damagedRehearsalReel: 'final-damaged-reel',
  soundBlanket: 'final-sound-blanket',
  bentSpool: 'final-bent-spool',
  rehearsalReel: 'final-restored-reel',
  setListFragment: 'final-set-list',
  studioPatchCable: 'final-patch-cable',
  fullRehearsalMix: 'final-full-mix',
  blankCueCard: 'final-cue-card',
  cleanLiveMix: 'final-clean-live-mix',
  broadcastRouteCard: 'final-route-card',
  sharedArrangement: 'final-shared-arrangement',
  purposeReceipt: 'final-purpose-receipt',
};
const renderedItems = new Map(campaign.initialInventory.map((entry) => [entry.id, entry]));
for (const chapter of Object.values(campaign.chapters)) {
  for (const currentScene of Object.values(chapter.scenes)) {
    for (const entry of currentScene.hotspots) {
      if (entry.item) renderedItems.set(entry.item.id, entry.item);
      const actions = [...Object.values(entry.useWith || {}), ...Object.values(entry.actions || {})];
      actions.flatMap((entryAction) => entryAction.give || []).forEach((given) => renderedItems.set(given.id, given));
    }
  }
}
for (const [itemId, icon] of Object.entries(expectedIcons)) {
  assert.equal(renderedItems.get(itemId)?.icon, icon, `Finale item ${itemId} must use its campaign-specific art icon`);
}

function verifyDebugStart(chapterId, expectedNext, operations) {
  const snapshot = {
    inventory: new Map((debugLoadouts[chapterId] || []).map((entry) => [entry.id, entry])),
    flags: {},
  };
  const currentScene = scene(chapterId);
  let lastAction;
  const applySnapshot = (entryAction) => {
    assert(!(entryAction.requires || []).some((flag) => !snapshot.flags[flag]), `${chapterId} debug start misses prerequisite ${entryAction.requires}`);
    entryAction.removeItems?.forEach((id) => snapshot.inventory.delete(id));
    entryAction.give?.forEach((entry) => snapshot.inventory.set(entry.id, entry));
    entryAction.setFlags?.forEach((flag) => { snapshot.flags[flag] = true; });
    lastAction = entryAction;
  };
  for (const operation of operations) {
    const target = hotspot(currentScene, operation.hotspot);
    if (operation.type === 'take') {
      assert(target.item, `${chapterId} debug TAKE target has no item: ${operation.hotspot}`);
      snapshot.inventory.set(target.item.id, target.item);
      snapshot.flags[`${operation.hotspot}Taken`] = true;
      continue;
    }
    assert(snapshot.inventory.has(operation.item), `${chapterId} debug start cannot obtain ${operation.item}`);
    const entryAction = target.useWith?.[operation.item];
    assert(entryAction, `${chapterId} debug start cannot use ${operation.item} on ${operation.hotspot}`);
    applySnapshot(entryAction);
  }
  assert.equal(lastAction?.next?.chapterId, expectedNext, `${chapterId} debug start cannot progress to ${expectedNext}`);
}

verifyDebugStart('final-01', 'final-02', [
  { type: 'take', hotspot: 'packing-blanket' },
  { type: 'take', hotspot: 'bent-spool' },
  { type: 'use', hotspot: 'anniversary-files', item: 'label2008' },
  { type: 'use', hotspot: 'reel-deck', item: 'soundBlanket' },
  { type: 'use', hotspot: 'reel-deck', item: 'damagedRehearsalReel' },
  { type: 'use', hotspot: 'reel-deck', item: 'bentSpool' },
]);
verifyDebugStart('final-02', 'final-03', [
  { type: 'use', hotspot: 'stereo-patch-panel', item: 'rehearsalReel' },
]);
verifyDebugStart('final-03', 'final-04', [
  { type: 'take', hotspot: 'studio-patch-cable' },
  { type: 'use', hotspot: 'studio-patch-bay', item: 'setListFragment' },
  { type: 'use', hotspot: 'studio-patch-bay', item: 'studioPatchCable' },
]);
verifyDebugStart('final-04', 'final-05', [
  { type: 'take', hotspot: 'blank-cue-card' },
  { type: 'use', hotspot: 'brand-harmony-console', item: 'blankCueCard' },
  { type: 'use', hotspot: 'brand-harmony-console', item: 'fullRehearsalMix' },
]);
verifyDebugStart('final-05', 'final-06', [
  { type: 'use', hotspot: 'rehearsal-route-board', item: 'broadcastRouteCard' },
  { type: 'use', hotspot: 'rhythm-rehearsal-floor', item: 'cleanLiveMix' },
]);
verifyDebugStart('final-06', 'final-outro', [
  { type: 'take', hotspot: 'joe-filing-receipt' },
  { type: 'use', hotspot: 'concert-control-stations', item: 'purposeReceipt' },
  { type: 'use', hotspot: 'concert-control-stations', item: 'sharedArrangement' },
]);
const finalOutroAction = hotspot(scene('final-outro'), 'closed-for-rehearsal-sign').actions?.take;
assert(finalOutroAction?.complete, 'final-outro debug start must be independently completable');
assert.equal(finalOutroAction.performance?.title, 'YOU’RE DOING IT,\nNO YOU’RE DOING IT!', 'The final sign must launch the original-song performance');
assert(existsSync(finalOutroAction.performance.src), `Missing finale performance graphic: ${finalOutroAction.performance.src}`);

console.log('Finale solvability check passed: 6 chapters plus conclusive epilogue.');
