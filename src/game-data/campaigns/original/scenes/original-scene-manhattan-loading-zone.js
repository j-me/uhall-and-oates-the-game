import { chapterTwoDialogue as dialogue } from '../dialogue/original-dialogue-chapter-02.js';
import { placeCharacter } from '../../../characters.js';
const art = 'assets/art/campaigns/original';

export const manhattanLoadingZone = {
  id: 'manhattan-loading-zone',
  name: 'Private Eyes in the Big Apple',
  caption: 'Manhattan: where even the clues pay storage fees.',
  intro: 'Daryl’s trail reaches Manhattan, where every curb is occupied, every elevator is undersized, and every box claims to be fragile. Baltos—part investigator, part George Costanza impersonator, and entirely certain of himself—may have seen the Reardons’ shipment. Meanwhile, Joe Timmins keeps calling John to ask whether the rescue can be billed as overtime.',
  opening: dialogue.opening,
  reveal: {
    src: `${art}/reveals/chapter-02-manhattan-v1.png`,
    alt: 'Oates steadies a tower of boxes while Baltos investigates baseball cards in Manhattan',
    tagline: 'Private Eyes. Public Loading Zone.',
  },
  background: `${art}/chapters/chapter-02/manhattan-loading-zone-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'determined', alt: 'John Oates, determined', bounds: { left: 8, top: 43, width: 20, height: 52 } }),
    placeCharacter('baltos', { alt: 'Baltos, self-appointed investigator', bounds: { left: 61, top: 40, width: 14, height: 46 } }),
  ],
  decorations: [
    {
      src: `${art}/chapters/chapter-02/1987-baseball-card-pack-v1.png`,
      alt: 'A sealed 1987 baseball-card pack in the deli display',
      className: 'scene-decoration--card-pack',
      bounds: { left: 76, top: 37, width: 13, height: 25 },
      visibleWhen: ['reardonUnitFound'],
      hiddenWhen: ['card-displayTaken'],
    },
  ],
  hotspots: [
    { id: 'shipping-label', label: 'odd shipping label', bounds: { left: 7, top: 43, width: 9, height: 14 }, item: { id: 'shippingLabel', label: 'shipping label', icon: 'stamp' }, hiddenWhen: ['shipping-labelTaken'], responses: dialogue.shippingLabel },
    { id: 'card-display', label: 'sealed baseball-card display', priority: 2, bounds: { left: 77, top: 39, width: 12, height: 23 }, item: { id: 'toppsPack', label: '1987 Topps baseball-card pack', icon: 'cards' }, visibleWhen: ['reardonUnitFound'], hiddenWhen: ['card-displayTaken'], responses: dialogue.cardDisplay },
    { id: 'storage-directory', label: 'self-storage directory', bounds: { left: 40, top: 31, width: 13, height: 31 }, responses: { look: dialogue.directory.look, talk: dialogue.directory.talk }, useWith: { shippingLabel: { puzzle: 'storageDirectory', setFlags: ['reardonUnitFound'], removeItems: ['shippingLabel'], clearSelection: true, success: true, effect: 'unit', message: dialogue.directory.stamped } } },
    { id: 'baltos', label: 'Baltos, consulting detective', bounds: { left: 61, top: 42, width: 13, height: 46 }, responses: { talk: dialogue.baltos.talk, look: dialogue.baltos.look }, useWith: { toppsPack: { requires: ['reardonUnitFound'], missing: dialogue.baltos.missing, removeItems: ['toppsPack'], clearSelection: true, give: [{ id: 'shreddedInvoice', label: 'reconstructed invoice', icon: 'invoice' }], success: true, effect: 'cards', complete: dialogue.baltos.complete, next: { chapterId: 'chapter-03', sceneId: 'luke-wiffle-stadium' }, message: dialogue.baltos.success } } },
  ],
};
