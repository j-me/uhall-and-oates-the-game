import { chapterOneDialogue } from '../dialogue/original-dialogue-chapter-01.js';
import { placeCharacter } from '../../../characters.js';

const root = 'assets';

export const oldOrchardPier = {
  id: 'old-orchard-pier',
  name: 'Old Orchard Beach Pier — Ships, Seagulls, and a Singing Crate',
  caption: 'Two crates entered. One singer left. The gull has retained counsel.',
  intro: 'Old Orchard Beach was supposed to be Uhall & Oates’ biggest promotion yet. Instead, the Reardons turned a fake “New Hit Record” delivery into a very real kidnapping, leaving John with an empty decoy crate and a boardwalk full of bad witnesses. Somewhere beyond the pier, Daryl is being shipped toward an encore he never agreed to perform.',
  opening: chapterOneDialogue.opening,
  reveal: {
    src: `${root}/art/campaigns/original/reveals/chapter-01-old-orchard-v1.png`,
    alt: 'Oates distracts a pier gull with fries while Daryl sings from a departing shipping crate',
    tagline: 'Out of Touch. Still in Transit.',
  },
  background: `${root}/art/campaigns/original/chapters/chapter-01/old-orchard-pier-v1.png`,
  backgroundStates: [
    { when: ['gullDistracted'], src: `${root}/art/campaigns/original/chapters/chapter-01/old-orchard-pier-gull-gone-v1.png` },
  ],
  characters: [
    placeCharacter('john-oates', {
      pose: 'worried', alt: 'John Oates, alarmed but ready to work',
      bounds: { left: 9, top: 41, width: 21, height: 54 },
    }),
  ],
  hotspots: [
    {
      id: 'reardon-truck', label: 'departing Reardon truck', bounds: { left: 59, top: 28, width: 18, height: 19 },
      responses: { look: 'Fresh tire marks lead away from the truck. Looks like Daryl got shipped.', talk: 'OATES: You turned a fake promotion into a kidnapping!\nTRUCK RADIO: A cheerful corporate jingle plays and refuses to be useful.' },
    },
    {
      id: 'broken-crane', label: 'broken prize crane', bounds: { left: 0, top: 23, width: 18, height: 39 },
      responses: { look: 'The prize crane is jammed. A carton of French fries is trapped in its prize chute.', talk: chapterOneDialogue.crane },
      useWith: {
        emptyTapeRoll: { sound: 'error', effect: 'tape', message: chapterOneDialogue.tapeRoll },
        taffyCoil: { puzzle: 'crane', setFlags: ['craneFixed'], removeItems: ['taffyCoil'], give: [{ id: 'frenchFries', label: 'French fries', icon: 'fries' }], clearSelection: true, success: true, sound: 'crane', effect: 'fries', message: 'The taffy belt holds. Oates drops the fries into the prize chute and collects the crane’s only useful prize.' },
      },
    },
    {
      id: 'taffy-bin', label: 'saltwater taffy bin', bounds: { left: 29, top: 37, width: 15, height: 18 },
      item: { id: 'taffyCoil', label: 'warm taffy coil', icon: 'taffy' },
      hiddenWhen: ['taffy-binTaken'],
      visibleWhen: [],
      responses: { look: 'A warm coil of taffy. It has the texture of a bad idea and the tensile strength of a better one.', take: 'You pocket a warm coil of taffy. It immediately tries to become part of your wardrobe.' },
    },
    {
      id: 'gull', label: 'territorial gull', bounds: { left: 89, top: 43, width: 6, height: 11 },
      visibleWhen: [],
      hiddenWhen: ['gullDistracted'],
      responses: { look: 'A gull guards the manifest like it has a maritime law degree.', talk: 'The gull replies, “MINE.” It is concise but unhelpful.' },
      useWith: {
        frenchFries: { setFlags: ['gullDistracted'], removeItems: ['frenchFries'], clearSelection: true, success: true, sound: 'gull', effect: 'gull', message: 'The gull accepts the French fries, leaves the manifest, and relocates to a more prestigious lunch meeting.' },
      },
    },
    {
      id: 'pier-manifest', label: 'pier manifest', priority: 3, bounds: { left: 69, top: 62, width: 7, height: 16 },
      visibleWhen: ['gullDistracted'],
      hiddenWhen: ['manifestRetrieved'],
      responses: { look: 'The gull dropped the manifest onto the crate. Now it is finally within reach.' },
      actions: {
        take: { setFlags: ['manifestRetrieved'], give: [{ id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' }], pickup: true, success: true, effect: 'manifest', complete: 'The manifest names a New York consignment: “PRIVATE EYES ONLY.”', next: { chapterId: 'chapter-02', sceneId: 'manhattan-loading-zone' }, message: 'You take the dropped manifest. Daryl’s pallet rhythm points toward a New York consignment: PRIVATE EYES ONLY.' },
      },
    },
    {
      id: 'daryl-crate', label: 'crate for “The Best Things to Move”', priority: 1, bounds: { left: 45, top: 50, width: 33, height: 33 }, hiddenWhen: ['craneFixed'],
      responses: { look: 'An empty crate for the best things to move. It doesn’t look like Daryl is inside, but you see a paper attached.  A seagull will not let you near it.', talk: chapterOneDialogue.darylCrate },
    },
  ],
};
