import assert from 'node:assert/strict';
import { campaigns } from '../src/game-data/registry.js';
import { debugChapterStates } from '../src/game-data/debug/debug-loadouts.js';

const campaign = campaigns['adult-relocation'];
const state = {
  actor: 'john-oates',
  inventories: { 'john-oates': new Map(), trunk: new Map() },
  flags: {},
};

function inventory(owner = state.actor) {
  state.inventories[owner] ||= new Map();
  return state.inventories[owner];
}
function scene(chapterId, sceneId) {
  const chapter = campaign.chapters[chapterId];
  return chapter.scenes[sceneId || chapter.startScene];
}
function hotspot(currentScene, id) {
  const result = currentScene.hotspots.find((entry) => entry.id === id);
  assert(result, `Missing hotspot ${currentScene.id}/${id}`);
  return result;
}
function assertNoActiveOverlaps(currentScene) {
  const active = currentScene.hotspots.filter((entry) =>
    (entry.visibleWhen || []).every((flag) => state.flags[flag])
    && !(entry.hiddenWhen || []).some((flag) => state.flags[flag]),
  );
  for (let index = 0; index < active.length; index += 1) {
    for (let compare = index + 1; compare < active.length; compare += 1) {
      const a = active[index].bounds;
      const b = active[compare].bounds;
      const overlaps = a.left < b.left + b.width
        && a.left + a.width > b.left
        && a.top < b.top + b.height
        && a.top + a.height > b.top;
      assert(!overlaps, `Active hit zones overlap: ${currentScene.id}/${active[index].id} and ${active[compare].id}`);
    }
  }
}
function take(currentScene, id) {
  assertNoActiveOverlaps(currentScene);
  const target = hotspot(currentScene, id);
  assert(target.item, `${id} does not provide an item`);
  inventory().set(target.item.id, target.item);
  state.flags[`${id}Taken`] = true;
}
function apply(action) {
  assert(!(action.requires || []).some((flag) => !state.flags[flag]), `Missing action prerequisite: ${action.requires}`);
  action.removeItems?.forEach((id) => inventory().delete(id));
  action.give?.forEach((entry) => inventory().set(entry.id, entry));
  Object.entries(action.giveTo || {}).forEach(([owner, entries]) => entries.forEach((entry) => inventory(owner).set(entry.id, entry)));
  action.setFlags?.forEach((flag) => { state.flags[flag] = true; });
  return action;
}
function use(currentScene, hotspotId, itemId) {
  assertNoActiveOverlaps(currentScene);
  assert(inventory().has(itemId), `${state.actor} is missing ${itemId}`);
  const action = hotspot(currentScene, hotspotId).useWith?.[itemId];
  assert(action, `${itemId} cannot be used on ${hotspotId}`);
  return apply(action);
}
function retrieve(itemId) {
  assert(inventory('trunk').has(itemId), `Trunk is missing ${itemId}`);
  const entry = inventory('trunk').get(itemId);
  inventory('trunk').delete(itemId);
  inventory().set(itemId, entry);
}

let current = scene('adult-01');
take(current, 'emergency-necktie');
take(current, 'cassette-adapter');
use(current, 'cassette-deck', 'emergencyNecktie');
let action = use(current, 'cassette-deck', 'repairedAdapter');
assert.equal(action.next.chapterId, 'adult-02');

state.actor = 'daryl-hall';
current = scene('adult-02');
take(current, 'tuxedo-sash');
use(current, 'safety-station', 'seminarSash');
use(current, 'kenny-loggins', 'compliantVest');
current = scene('adult-02', 'adult-copier-room');
action = use(current, 'retreat-copier', 'dangerCassette');
assert.equal(action.next.chapterId, 'adult-03');

state.actor = 'john-oates';
current = scene('adult-03');
take(current, 'blank-announcement');
take(current, 'expired-security-badge');
use(current, 'announcement-booth', 'blankAnnouncement');
action = use(current, 'mall-kiosk', 'closingCassette');
assert.equal(action.next.chapterId, 'adult-04');

current = scene('adult-04');
take(current, 'future-collectible');
use(current, 'baltos-auction', 'futureCollectible');
action = use(current, 'river-anomaly', 'auctionClaim');
assert.equal(action.next.chapterId, 'adult-05');

state.actor = 'michael-mcdonald';
current = scene('adult-05');
take(current, 'michael-m-badge');
use(current, 'michael-bolton', 'michaelBadge');
action = use(current, 'server-room', 'adminBadge');
assert.equal(action.next.chapterId, 'adult-06');

state.actor = 'daryl-hall';
current = scene('adult-06', 'adult-daryl-switchboard');
use(current, 'daryl-era-phone', 'alteredHandbook');
state.actor = 'john-oates';
retrieve('touchToneCode');
current = scene('adult-06', 'adult-john-payphone');
use(current, 'john-era-phone', 'touchToneCode');
state.actor = 'michael-mcdonald';
retrieve('pagerTranslation');
retrieve('auditLog');
current = scene('adult-06', 'adult-michael-conference');
action = use(current, 'future-conference-phone', 'pagerTranslation');
assert.equal(action.next.chapterId, 'adult-07');

state.actor = 'john-oates';
retrieve('filingNumber');
current = scene('adult-07');
action = use(current, 'handbook-console', 'filingNumber');
assert.equal(action.next.chapterId, 'adult-outro');

current = scene('adult-outro');
action = apply(hotspot(current, 'revised-handbook').actions.take);
assert.equal(action.puzzle, 'temporalTruck');
assert.equal(action.give[0].icon, 'final-label-2008');
assert(action.complete);
assert(state.flags.adultGameComplete);

for (const chapter of Object.values(campaign.chapters)) {
  for (const currentScene of Object.values(chapter.scenes)) {
    for (const entry of currentScene.hotspots) {
      const { left, top, width, height } = entry.bounds;
      assert(left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= 100 && top + height <= 100, `Invalid hit zone: ${currentScene.id}/${entry.id}`);
    }
  }
}

// Debug chapter selection is part of the QA workflow: late chapters must boot
// with the cross-era prerequisites that an ordinary playthrough would carry.
const debugInventory = (chapterId, owner = 'john-oates') => [
  ...(debugChapterStates[chapterId]?.inventory || []),
  ...(debugChapterStates[chapterId]?.inventories?.[owner] || []),
];
const expectedEvidenceAtEntry = {
  'adult-02': 1,
  'adult-03': 2,
  'adult-04': 3,
  'adult-05': 4,
  'adult-06': 5,
  'adult-07': 5,
};
for (const [chapterId, expectedCount] of Object.entries(expectedEvidenceAtEntry)) {
  assert.equal(
    debugChapterStates[chapterId].flags.filter((flag) => flag.startsWith('adultEvidence')).length,
    expectedCount,
    `${chapterId} debug start needs all ${expectedCount} evidence records earned before that chapter`,
  );
}
for (const chapterId of ['adult-03', 'adult-04', 'adult-05', 'adult-06']) {
  assert(
    debugInventory(chapterId, 'daryl-hall').some((entry) => entry.id === 'alteredHandbook'),
    `${chapterId} debug start must preserve Daryl’s altered handbook for the Chapter 6 handoff`,
  );
}
assert(debugInventory('adult-04').some((entry) => entry.id === 'routingChip'), 'Adult Chapter 4 debug start needs the routing chip');
assert(debugChapterStates['adult-04'].flags.includes('routingChipRecovered'), 'Adult Chapter 4 debug start needs the recovered-chip flag');
assert(debugInventory('adult-06', 'daryl-hall').some((entry) => entry.id === 'alteredHandbook'), 'Adult Chapter 6 debug start needs Daryl’s altered handbook');
assert(debugInventory('adult-06', 'trunk').some((entry) => entry.id === 'auditLog'), 'Adult Chapter 6 debug start needs the trunk audit log');
assert(debugChapterStates['adult-06'].flags.includes('trunkPortalOpen'), 'Adult Chapter 6 debug start needs trunk access');
assert.equal(debugChapterStates['adult-06'].flags.filter((flag) => flag.startsWith('adultEvidence')).length, 5, 'Adult Chapter 6 debug start needs every earlier evidence flag before advancing to Chapter 7');
assert(debugInventory('adult-07').some((entry) => entry.id === 'filingNumber'), 'Adult Chapter 7 debug start needs the filing number');
assert.equal(debugChapterStates['adult-07'].flags.filter((flag) => flag.startsWith('adultEvidence')).length, 5, 'Adult Chapter 7 debug start needs every evidence flag');

function verifyAdultDebugStart(chapterId, expectedNext, operations) {
  const setup = debugChapterStates[chapterId] || {};
  const snapshot = {
    actor: scene(chapterId).playerId || 'john-oates',
    inventories: {
      'john-oates': new Map((setup.inventory || []).map((entry) => [entry.id, entry])),
      trunk: new Map(),
    },
    flags: Object.fromEntries((setup.flags || []).map((flag) => [flag, true])),
  };
  Object.entries(setup.inventories || {}).forEach(([owner, items]) => {
    snapshot.inventories[owner] = new Map(items.map((entry) => [entry.id, entry]));
  });
  const owned = (owner = snapshot.actor) => {
    snapshot.inventories[owner] ||= new Map();
    return snapshot.inventories[owner];
  };
  let currentScene = scene(chapterId);
  let lastAction;

  const applySnapshot = (entryAction) => {
    assert(!(entryAction.requires || []).some((flag) => !snapshot.flags[flag]), `${chapterId} debug start misses prerequisite ${entryAction.requires}`);
    entryAction.removeItems?.forEach((id) => owned().delete(id));
    entryAction.give?.forEach((entry) => owned().set(entry.id, entry));
    Object.entries(entryAction.giveTo || {}).forEach(([owner, items]) => {
      items.forEach((entry) => owned(owner).set(entry.id, entry));
    });
    entryAction.setFlags?.forEach((flag) => { snapshot.flags[flag] = true; });
    lastAction = entryAction;
  };

  for (const operation of operations) {
    if (operation.type === 'scene') {
      currentScene = scene(chapterId, operation.scene);
      snapshot.actor = currentScene.playerId || snapshot.actor;
      continue;
    }
    if (operation.type === 'actor') {
      snapshot.actor = operation.actor;
      continue;
    }
    if (operation.type === 'retrieve') {
      assert(owned('trunk').has(operation.item), `${chapterId} debug trunk cannot supply ${operation.item}`);
      const entry = owned('trunk').get(operation.item);
      owned('trunk').delete(operation.item);
      owned().set(operation.item, entry);
      continue;
    }
    const target = hotspot(currentScene, operation.hotspot);
    if (operation.type === 'take') {
      assert(target.item, `${chapterId} debug TAKE target has no item: ${operation.hotspot}`);
      owned().set(target.item.id, target.item);
      snapshot.flags[`${operation.hotspot}Taken`] = true;
      continue;
    }
    if (operation.type === 'takeAction') {
      assert(target.actions?.take, `${chapterId} debug TAKE action is missing: ${operation.hotspot}`);
      applySnapshot(target.actions.take);
      continue;
    }
    assert(owned().has(operation.item), `${chapterId}/${snapshot.actor} debug start cannot obtain ${operation.item}`);
    const entryAction = target.useWith?.[operation.item];
    assert(entryAction, `${chapterId} debug start cannot use ${operation.item} on ${operation.hotspot}`);
    applySnapshot(entryAction);
  }

  if (expectedNext) assert.equal(lastAction?.next?.chapterId, expectedNext, `${chapterId} debug start cannot progress to ${expectedNext}`);
  else assert(lastAction?.complete, `${chapterId} debug start cannot complete its ending`);
}

verifyAdultDebugStart('adult-01', 'adult-02', [
  { type: 'take', hotspot: 'emergency-necktie' },
  { type: 'take', hotspot: 'cassette-adapter' },
  { type: 'use', hotspot: 'cassette-deck', item: 'emergencyNecktie' },
  { type: 'use', hotspot: 'cassette-deck', item: 'repairedAdapter' },
]);
verifyAdultDebugStart('adult-02', 'adult-03', [
  { type: 'take', hotspot: 'tuxedo-sash' },
  { type: 'use', hotspot: 'safety-station', item: 'seminarSash' },
  { type: 'use', hotspot: 'kenny-loggins', item: 'compliantVest' },
  { type: 'scene', scene: 'adult-copier-room' },
  { type: 'use', hotspot: 'retreat-copier', item: 'dangerCassette' },
]);
verifyAdultDebugStart('adult-03', 'adult-04', [
  { type: 'take', hotspot: 'blank-announcement' },
  { type: 'take', hotspot: 'expired-security-badge' },
  { type: 'use', hotspot: 'announcement-booth', item: 'blankAnnouncement' },
  { type: 'use', hotspot: 'mall-kiosk', item: 'closingCassette' },
]);
verifyAdultDebugStart('adult-04', 'adult-05', [
  { type: 'take', hotspot: 'future-collectible' },
  { type: 'use', hotspot: 'baltos-auction', item: 'futureCollectible' },
  { type: 'use', hotspot: 'river-anomaly', item: 'auctionClaim' },
]);
verifyAdultDebugStart('adult-05', 'adult-06', [
  { type: 'take', hotspot: 'michael-m-badge' },
  { type: 'use', hotspot: 'michael-bolton', item: 'michaelBadge' },
  { type: 'use', hotspot: 'server-room', item: 'adminBadge' },
]);
verifyAdultDebugStart('adult-06', 'adult-07', [
  { type: 'use', hotspot: 'daryl-era-phone', item: 'alteredHandbook' },
  { type: 'scene', scene: 'adult-john-payphone' },
  { type: 'retrieve', item: 'touchToneCode' },
  { type: 'use', hotspot: 'john-era-phone', item: 'touchToneCode' },
  { type: 'scene', scene: 'adult-michael-conference' },
  { type: 'retrieve', item: 'pagerTranslation' },
  { type: 'retrieve', item: 'auditLog' },
  { type: 'use', hotspot: 'future-conference-phone', item: 'pagerTranslation' },
]);
verifyAdultDebugStart('adult-07', 'adult-outro', [
  { type: 'use', hotspot: 'handbook-console', item: 'filingNumber' },
]);
verifyAdultDebugStart('adult-outro', undefined, [
  { type: 'takeAction', hotspot: 'revised-handbook' },
]);

console.log(`Adult Relocation solvability check passed: ${campaign.chapterOrder.length - 1} chapters plus epilogue.`);
