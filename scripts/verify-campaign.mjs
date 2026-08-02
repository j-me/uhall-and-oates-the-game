import assert from 'node:assert/strict';
import { chapters } from '../src/game-data/registry.js';
import { debugLoadouts } from '../src/game-data/debug/debug-loadouts.js';

const state = { inventory: new Map([['emptyTapeRoll', { id: 'emptyTapeRoll' }]]), flags: {} };

function scene(chapterId) { return chapters[chapterId].scenes[chapters[chapterId].startScene]; }
function hotspot(currentScene, id) {
  const found = currentScene.hotspots.find((entry) => entry.id === id);
  assert(found, `Missing hotspot: ${id}`);
  return found;
}
function assertNoActiveOverlaps(currentScene) {
  const active = currentScene.hotspots.filter((entry) =>
    (entry.visibleWhen || []).every((flag) => state.flags[flag])
    && !(entry.hiddenWhen || []).some((flag) => state.flags[flag]),
  );
  for (let index = 0; index < active.length; index += 1) {
    for (let compare = index + 1; compare < active.length; compare += 1) {
      const a = active[index].bounds; const b = active[compare].bounds;
      const overlaps = a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
      assert(!overlaps, `Active hit zones overlap: ${active[index].id} and ${active[compare].id}`);
    }
  }
}
function take(currentScene, id) {
  assertNoActiveOverlaps(currentScene);
  const target = hotspot(currentScene, id);
  assert(target.item, `${id} should supply an inventory item`);
  assert((target.visibleWhen || []).every((flag) => state.flags[flag]), `${id} is not visible yet`);
  assert(!(target.hiddenWhen || []).some((flag) => state.flags[flag]), `${id} is already gone`);
  state.inventory.set(target.item.id, target.item);
  state.flags[`${target.id}Taken`] = true;
  assertNoActiveOverlaps(currentScene);
}
function takeAction(currentScene, id) {
  assertNoActiveOverlaps(currentScene);
  const target = hotspot(currentScene, id);
  const action = target.actions?.take;
  assert(action, `${id} should have a take action`);
  assert((target.visibleWhen || []).every((flag) => state.flags[flag]), `${id} is not visible yet`);
  assert(!(target.hiddenWhen || []).some((flag) => state.flags[flag]), `${id} is already gone`);
  action.setFlags?.forEach((flag) => { state.flags[flag] = true; });
  action.removeItems?.forEach((item) => state.inventory.delete(item));
  action.give?.forEach((item) => state.inventory.set(item.id, item));
  assertNoActiveOverlaps(currentScene);
  return action;
}
function use(currentScene, targetId, itemId) {
  assertNoActiveOverlaps(currentScene);
  const target = hotspot(currentScene, targetId);
  assert(state.inventory.has(itemId), `Missing required item: ${itemId}`);
  const action = target.useWith?.[itemId] || target.actions?.take;
  assert(action, `${itemId} has no usable action on ${targetId}`);
  assert(!(action.requires || []).some((flag) => !state.flags[flag]), `${targetId} is missing a prerequisite`);
  action.setFlags?.forEach((flag) => { state.flags[flag] = true; });
  action.removeItems?.forEach((item) => state.inventory.delete(item));
  action.give?.forEach((item) => state.inventory.set(item.id, item));
  assertNoActiveOverlaps(currentScene);
  return action;
}
// Chapter 1: taffy -> crane fries, fries -> gull, gull -> manifest.
let current = scene('chapter-01');
take(current, 'taffy-bin'); use(current, 'broken-crane', 'taffyCoil');
use(current, 'gull', 'frenchFries');
let action = takeAction(current, 'pier-manifest');
assert.equal(action.next.chapterId, 'chapter-02');

// Chapter 2: stamp -> directory, 1987 card pack -> Baltos.
current = scene('chapter-02');
take(current, 'shipping-label'); use(current, 'storage-directory', 'shippingLabel');
take(current, 'card-display');
action = use(current, 'baltos', 'toppsPack');
assert.equal(action.next.chapterId, 'chapter-03');

// Chapter 3: invoice -> scoreboard, wiffle ball -> home-plate launcher.
current = scene('chapter-03');
use(current, 'scoreboard', 'shreddedInvoice');
take(current, 'equipment-shed');
action = use(current, 'home-plate', 'wiffleBall');
assert.equal(action.next.chapterId, 'chapter-04');

// Chapter 4: rejected form -> Michael -> customs authorization -> stamp -> route map.
current = scene('chapter-04');
take(current, 'record-shop');
take(current, 'no-can-do-form');
use(current, 'michael-mcdonald', 'rejectedShippingForm');
use(current, 'customs-desk', 'artistAuthorization');
use(current, 'customs-desk', 'reversibleInk');
action = use(current, 'tube-map', 'londonShippingLabel');
assert.equal(action.next.chapterId, 'chapter-05');

// Chapter 5: delivery docket -> service lift, access pass -> recording truck.
current = scene('chapter-05');
take(current, 'stage-prop-warehouse');
use(current, 'shipping-service-lift', 'deliveryDocket');
action = use(current, 'recording-truck', 'tokyoAccessPass');
assert.equal(action.next.chapterId, 'chapter-06');

// Chapter 6: counter-melody -> broadcast tower, original manifest -> archive chamber.
current = scene('chapter-06');
use(current, 'broadcast-tower', 'counterMelody');
action = use(current, 'archive-door', 'privateEyesManifest');
assert(action.complete, 'The finale must resolve the campaign.');

// Epilogue: the long-carried tape roll unlocks the ending video in the Maxima trunk.
current = chapters.outro.scenes['timmins-maxima'];
action = use(current, 'gold-maxima', 'emptyTapeRoll');
assert.equal(action.video, 'assets/video/uhallandoates.mp4');
assert(action.complete, 'The ending video should lead to the game-complete panel.');
assert(action.setFlags?.includes('originalGameComplete'), 'The original epilogue must unlock Adult Relocation.');

for (const chapter of Object.values(chapters)) {
  for (const chapterScene of Object.values(chapter.scenes)) {
    for (const entry of chapterScene.hotspots) {
      const { left, top, width, height } = entry.bounds;
      assert(left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= 100 && top + height <= 100, `Invalid hit zone: ${entry.id}`);
    }
  }
}

// Every original-campaign debug start must remain completable if the tester
// continues all the way through the epilogue.
for (const chapterId of ['chapter-01', 'chapter-02', 'chapter-03', 'chapter-04', 'chapter-05', 'chapter-06', 'outro']) {
  assert(
    debugLoadouts[chapterId]?.some((entry) => entry.id === 'emptyTapeRoll'),
    `${chapterId} debug start must preserve the tape roll required by the epilogue`,
  );
}

function verifyOriginalDebugStart(chapterId, expectedNext, operations) {
  const snapshot = {
    inventory: new Map((debugLoadouts[chapterId] || []).map((entry) => [entry.id, entry])),
    flags: {},
  };
  const currentScene = chapterId === 'outro'
    ? chapters.outro.scenes['timmins-maxima']
    : scene(chapterId);
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
    if (operation.type === 'takeAction') {
      assert(target.actions?.take, `${chapterId} debug TAKE action is missing: ${operation.hotspot}`);
      applySnapshot(target.actions.take);
      continue;
    }
    assert(snapshot.inventory.has(operation.item), `${chapterId} debug start cannot obtain ${operation.item}`);
    const entryAction = target.useWith?.[operation.item];
    assert(entryAction, `${chapterId} debug start cannot use ${operation.item} on ${operation.hotspot}`);
    applySnapshot(entryAction);
  }

  if (expectedNext) assert.equal(lastAction?.next?.chapterId, expectedNext, `${chapterId} debug start cannot progress to ${expectedNext}`);
  else assert(lastAction?.complete, `${chapterId} debug start cannot complete its ending`);
}

verifyOriginalDebugStart('chapter-01', 'chapter-02', [
  { type: 'take', hotspot: 'taffy-bin' },
  { type: 'use', hotspot: 'broken-crane', item: 'taffyCoil' },
  { type: 'use', hotspot: 'gull', item: 'frenchFries' },
  { type: 'takeAction', hotspot: 'pier-manifest' },
]);
verifyOriginalDebugStart('chapter-02', 'chapter-03', [
  { type: 'take', hotspot: 'shipping-label' },
  { type: 'use', hotspot: 'storage-directory', item: 'shippingLabel' },
  { type: 'take', hotspot: 'card-display' },
  { type: 'use', hotspot: 'baltos', item: 'toppsPack' },
]);
verifyOriginalDebugStart('chapter-03', 'chapter-04', [
  { type: 'use', hotspot: 'scoreboard', item: 'shreddedInvoice' },
  { type: 'take', hotspot: 'equipment-shed' },
  { type: 'use', hotspot: 'home-plate', item: 'wiffleBall' },
]);
verifyOriginalDebugStart('chapter-04', 'chapter-05', [
  { type: 'take', hotspot: 'record-shop' },
  { type: 'take', hotspot: 'no-can-do-form' },
  { type: 'use', hotspot: 'michael-mcdonald', item: 'rejectedShippingForm' },
  { type: 'use', hotspot: 'customs-desk', item: 'artistAuthorization' },
  { type: 'use', hotspot: 'customs-desk', item: 'reversibleInk' },
  { type: 'use', hotspot: 'tube-map', item: 'londonShippingLabel' },
]);
verifyOriginalDebugStart('chapter-05', 'chapter-06', [
  { type: 'take', hotspot: 'stage-prop-warehouse' },
  { type: 'use', hotspot: 'shipping-service-lift', item: 'deliveryDocket' },
  { type: 'use', hotspot: 'recording-truck', item: 'tokyoAccessPass' },
]);
verifyOriginalDebugStart('chapter-06', undefined, [
  { type: 'use', hotspot: 'broadcast-tower', item: 'counterMelody' },
  { type: 'use', hotspot: 'archive-door', item: 'privateEyesManifest' },
]);
verifyOriginalDebugStart('outro', undefined, [
  { type: 'use', hotspot: 'gold-maxima', item: 'emptyTapeRoll' },
]);

console.log(`Campaign solvability check passed: 6 chapters plus epilogue, ${state.inventory.size} final inventory entries.`);
