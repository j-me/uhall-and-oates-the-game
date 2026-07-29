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

console.log(`Adult Relocation solvability check passed: ${campaign.chapterOrder.length - 1} chapters plus epilogue.`);
