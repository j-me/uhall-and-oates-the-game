import { chapterTwoDialogue as dialogue } from '../dialogue/chapter-02.js';
const art = 'assets/art';

export const manhattanLoadingZone = {
  id: 'manhattan-loading-zone',
  name: 'Private Eyes in the Big Apple',
  caption: 'A storage maze, a fake investigator, and an invoice with trust issues.',
  intro: 'Manhattan runs on traffic, shipping, and confidence. Baltos has all three, though only one of them is real.',
  opening: dialogue.opening,
  background: `${art}/chapters/chapter-02/manhattan-loading-zone-v1.png`,
  characters: [
    { src: `${art}/characters/john-oates-determined-v1.png`, alt: 'John Oates, determined', className: 'john-idle', bounds: { left: 8, top: 43, width: 20, height: 52 } },
    { src: `${art}/characters/baltos-sprite-v1.png`, alt: 'Baltos, self-appointed investigator', className: 'npc-idle', bounds: { left: 61, top: 40, width: 14, height: 46 } },
  ],
  hotspots: [
    { id: 'shipping-label', label: 'odd shipping label', bounds: { left: 7, top: 43, width: 9, height: 14 }, item: { id: 'shippingLabel', label: 'shipping label', icon: 'stamp' }, hiddenWhen: ['shipping-labelTaken'], responses: dialogue.shippingLabel },
    { id: 'card-display', label: 'sealed baseball-card display', priority: 2, bounds: { left: 77, top: 39, width: 12, height: 23 }, item: { id: 'toppsPack', label: '1987 Topps baseball-card pack', icon: 'cards' }, visibleWhen: ['reardonUnitFound'], hiddenWhen: ['card-displayTaken'], responses: dialogue.cardDisplay },
    { id: 'storage-directory', label: 'self-storage directory', bounds: { left: 40, top: 31, width: 13, height: 31 }, responses: { look: dialogue.directory.look, talk: dialogue.directory.talk }, useWith: { shippingLabel: { puzzle: 'storageDirectory', setFlags: ['reardonUnitFound'], removeItems: ['shippingLabel'], clearSelection: true, success: true, effect: 'stamp', message: dialogue.directory.stamped } } },
    { id: 'baltos', label: 'Baltos, consulting detective', bounds: { left: 61, top: 42, width: 13, height: 46 }, responses: { talk: dialogue.baltos.talk, look: dialogue.baltos.look }, useWith: { toppsPack: { requires: ['reardonUnitFound'], missing: dialogue.baltos.missing, removeItems: ['toppsPack'], clearSelection: true, give: [{ id: 'shreddedInvoice', label: 'reconstructed invoice', icon: 'invoice' }], success: true, effect: 'cards', complete: dialogue.baltos.complete, next: { chapterId: 'chapter-03', sceneId: 'luke-wiffle-stadium' }, message: dialogue.baltos.success } } },
  ],
};
