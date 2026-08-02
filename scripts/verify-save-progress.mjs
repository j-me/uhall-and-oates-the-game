import assert from 'node:assert/strict';
import { createSaveStore } from '../src/engine/save.js';

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

globalThis.localStorage = new MemoryStorage();

const checkpoint = {
  version: 2,
  campaignId: 'original',
  chapterId: 'chapter-01',
  sceneId: 'old-orchard-pier',
  activeCharacterId: 'john-oates',
  selectedVerb: null,
  selectedItem: 'fries',
  inventory: [{ id: 'fries', label: 'French fries', icon: 'fries' }],
  inventories: { 'john-oates': [{ id: 'fries', label: 'French fries', icon: 'fries' }], trunk: [] },
  actorLocations: { 'john-oates': 'old-orchard-pier' },
  flags: { craneWon: true },
  visitedScenes: ['old-orchard-pier'],
};

let saves = createSaveStore();
assert.equal(saves.save('original', checkpoint), true);
let restored = saves.load('original');
assert.equal(restored.selectedVerb, 'look');
assert.equal(restored.selectedItem, null);
assert.strictEqual(restored.inventory, restored.inventories['john-oates']);
assert.deepEqual(restored.inventory.map((item) => item.id), ['fries']);
restored.inventory[0].label = 'changed after loading';
assert.equal(checkpoint.inventories['john-oates'][0].label, 'French fries');

localStorage.setItem('uhall-oates-save:broken', '{not json');
assert.equal(saves.load('broken'), null);

const campaigns = {
  original: { id: 'original', completionFlag: 'originalGameComplete' },
  'adult-relocation': { id: 'adult-relocation', requiresCampaign: 'original', completionFlag: 'adultGameComplete' },
  finale: { id: 'finale', requiresCampaign: 'adult-relocation', completionFlag: 'finalCampaignComplete' },
};

checkpoint.flags.originalGameComplete = true;
assert.equal(saves.save('original', checkpoint), true);
saves.reconcile(campaigns);
assert.equal(saves.isComplete('original'), true);
assert.equal(saves.has('original'), false, 'A completed campaign should not retain a stale Continue checkpoint');

const finaleCheckpoint = {
  ...checkpoint,
  campaignId: 'finale',
  chapterId: 'final-03',
  sceneId: 'final-chicago-studio',
  flags: {},
  inventories: { 'john-oates': [], trunk: [] },
};
assert.equal(saves.save('finale', finaleCheckpoint), true);
saves.reconcile(campaigns);
assert.equal(saves.isComplete('original'), true);
assert.equal(saves.isComplete('adult-relocation'), true, 'A legitimate finale checkpoint should migrate prerequisite completion');

const workingStorage = globalThis.localStorage;
globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error('quota'); }, removeItem: () => { throw new Error('blocked'); } };
saves = createSaveStore();
assert.equal(saves.save('original', checkpoint), false, 'Storage write failures should not crash gameplay');
assert.equal(saves.clear('original'), false, 'Storage removal failures should not crash gameplay');
globalThis.localStorage = workingStorage;

console.log('Save/progress verification passed: checkpoints, completion migration, corruption and storage failures.');
