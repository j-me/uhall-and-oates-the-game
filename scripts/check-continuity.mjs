import assert from 'node:assert/strict';
import { campaigns } from '../src/game-data/registry.js';

function collectActions(hotspot) {
  return [
    ...Object.values(hotspot.actions || {}),
    ...Object.values(hotspot.useWith || {}),
  ];
}

for (const campaign of Object.values(campaigns)) {
  const producedItems = new Set((campaign.initialInventory || []).map((item) => item.id));
  const usedItems = new Set();
  const removedItems = new Set();

  assert(campaign.chapters[campaign.startChapter], `${campaign.id} has an invalid start chapter`);

  for (const chapter of Object.values(campaign.chapters)) {
    assert(chapter.scenes[chapter.startScene], `${chapter.id} has an invalid start scene`);

    for (const scene of Object.values(chapter.scenes)) {
      assert(scene.id && scene.name && scene.caption, `${chapter.id} contains an unnamed or uncaptioned scene`);
      assert.notEqual(scene.caption.trim(), chapter.title.trim(), `${scene.id} repeats its chapter title as the caption`);
      assert(Array.isArray(scene.hotspots) && scene.hotspots.length, `${scene.id} has no interactive hotspots`);

      for (const hotspot of scene.hotspots) {
        assert(hotspot.id && hotspot.label && hotspot.bounds, `${scene.id} contains an incomplete hotspot`);
        if (hotspot.item) producedItems.add(hotspot.item.id);
        Object.keys(hotspot.useWith || {}).forEach((id) => usedItems.add(id));

        if (hotspot.exit) {
          assert(chapter.scenes[hotspot.exit.sceneId], `${scene.id}/${hotspot.id} exits to an unknown scene`);
        }

        for (const action of collectActions(hotspot)) {
          action.give?.forEach((item) => producedItems.add(item.id));
          Object.values(action.giveTo || {}).flat().forEach((item) => producedItems.add(item.id));
          action.removeItems?.forEach((id) => removedItems.add(id));

          if (action.next) {
            const destinationChapter = campaign.chapters[action.next.chapterId];
            assert(destinationChapter, `${scene.id}/${hotspot.id} targets an unknown chapter`);
            assert(destinationChapter.scenes[action.next.sceneId], `${scene.id}/${hotspot.id} targets an unknown scene`);
          }

          for (const control of action.puzzleData?.controls || []) {
            assert(control.label && Array.isArray(control.options) && control.options.length >= 2, `${scene.id}/${hotspot.id} has an invalid puzzle control`);
            assert(control.options.includes(control.answer), `${scene.id}/${hotspot.id} has a puzzle answer absent from its options`);
          }
        }
      }
    }
  }

  for (const id of usedItems) {
    assert(producedItems.has(id), `${campaign.id} uses inventory item "${id}" but never produces it`);
  }
  for (const id of removedItems) {
    assert(producedItems.has(id), `${campaign.id} removes inventory item "${id}" but never produces it`);
  }
}

console.log(`Continuity check passed for ${Object.keys(campaigns).length} campaigns.`);
