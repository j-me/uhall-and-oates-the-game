import { chapterThreeDialogue as dialogue } from '../dialogue/chapter-03.js';
const art = 'assets/art';

export const lukeWiffleStadium = {
  id: 'luke-wiffle-stadium',
  name: 'Kiss on My List — Jacuzzi Park',
  caption: 'Luke Jacuzzi keeps every winning delivery lineup on a very sentimental list.',
  intro: 'At Jacuzzi Park, every ordinary shipment becomes a championship event. John only needs one lead—and a very strange inning.',
  opening: dialogue.opening,
  background: `${art}/chapters/chapter-03/luke-wiffle-stadium-v1.png`,
  characters: [
    { src: `${art}/characters/john-oates-relieved-v1.png`, alt: 'John Oates, dryly amused', className: 'john-idle', bounds: { left: 42, top: 45, width: 16, height: 47 } },
    { src: `${art}/characters/luke-jacuzzi-sprite-v1.png`, alt: 'Luke Jacuzzi', className: 'npc-idle', bounds: { left: 72, top: 39, width: 17, height: 48 } },
  ],
  hotspots: [
    { id: 'equipment-shed', label: 'equipment shed', bounds: { left: 0, top: 27, width: 17, height: 30 }, item: { id: 'wiffleBall', label: 'regulation wiffle ball', icon: 'ball' }, visibleWhen: ['scoreboardAligned'], hiddenWhen: ['equipment-shedTaken'], responses: dialogue.shed },
    { id: 'scoreboard', label: 'malfunctioning scoreboard', bounds: { left: 20, top: 10, width: 26, height: 36 }, responses: { look: dialogue.scoreboard.look, talk: dialogue.scoreboard.talk }, useWith: { shreddedInvoice: { removeItems: ['shreddedInvoice'], clearSelection: true, setFlags: ['scoreboardAligned'], success: true, effect: 'scoreboard', message: dialogue.scoreboard.success } } },
    { id: 'home-plate', label: 'spring-loaded home-plate launcher', bounds: { left: 43, top: 78, width: 13, height: 12 }, responses: { look: dialogue.plate.look, talk: dialogue.plate.talk }, useWith: { wiffleBall: { puzzle: 'wiffle', requires: ['scoreboardAligned'], missing: dialogue.plate.missing, removeItems: ['wiffleBall'], clearSelection: true, give: [{ id: 'londonShippingLabel', label: 'London shipping label', icon: 'tag' }], success: true, effect: 'wiffle', complete: dialogue.plate.complete, next: { chapterId: 'chapter-04', sceneId: 'london-shipping-depot' }, message: dialogue.plate.success } } },
    { id: 'luke', label: 'Luke Jacuzzi', bounds: { left: 72, top: 40, width: 16, height: 47 }, responses: dialogue.luke },
  ],
};
