import { chapterThreeDialogue as dialogue } from '../dialogue/chapter-03.js';
import { placeCharacter } from '../characters.js';
const art = 'assets/art';

export const lukeWiffleStadium = {
  id: 'luke-wiffle-stadium',
  name: 'Kiss on My List — Jacuzzi Park',
  caption: 'Every box score needs a box. Luke has opinions about both.',
  intro: 'The search moves to Jacuzzi Park, where Luke Jacuzzi announces routine deliveries with the urgency of a championship game. Somewhere inside the stadium is evidence of where the Reardons went next, but Luke believes every dispute should be settled through sportsmanship, spectacle, and unnecessary scoreboard statistics. John has moved pianos up staircases; surely he can survive one inning.',
  opening: dialogue.opening,
  reveal: {
    src: `${art}/reveals/chapter-03-jacuzzi-park-v1.png`,
    alt: 'Luke celebrates while Oates adjusts a spring-loaded wiffle-ball launcher',
    tagline: 'Put That Wiffle Ball on My List!',
  },
  background: `${art}/chapters/chapter-03/luke-wiffle-stadium-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'relieved', alt: 'John Oates, dryly amused', bounds: { left: 42, top: 45, width: 16, height: 47 } }),
    placeCharacter('luke-jacuzzi', { bounds: { left: 72, top: 39, width: 17, height: 48 } }),
  ],
  hotspots: [
    { id: 'equipment-shed', label: 'equipment shed', bounds: { left: 0, top: 27, width: 17, height: 30 }, item: { id: 'wiffleBall', label: 'regulation wiffle ball', icon: 'ball' }, visibleWhen: ['scoreboardAligned'], hiddenWhen: ['equipment-shedTaken'], responses: dialogue.shed },
    { id: 'scoreboard', label: 'malfunctioning scoreboard', bounds: { left: 20, top: 10, width: 26, height: 36 }, responses: { look: dialogue.scoreboard.look, talk: dialogue.scoreboard.talk }, useWith: { shreddedInvoice: { removeItems: ['shreddedInvoice'], clearSelection: true, setFlags: ['scoreboardAligned'], success: true, effect: 'scoreboard', message: dialogue.scoreboard.success } } },
    { id: 'home-plate', label: 'spring-loaded home-plate launcher', bounds: { left: 43, top: 78, width: 13, height: 12 }, responses: { look: dialogue.plate.look, talk: dialogue.plate.talk }, useWith: { wiffleBall: { puzzle: 'wiffle', requires: ['scoreboardAligned'], missing: dialogue.plate.missing, removeItems: ['wiffleBall'], clearSelection: true, give: [{ id: 'londonShippingLabel', label: 'London shipping label', icon: 'tag' }], success: true, effect: 'wiffle', complete: dialogue.plate.complete, next: { chapterId: 'chapter-04', sceneId: 'london-shipping-depot' }, message: dialogue.plate.success } } },
    { id: 'luke', label: 'Luke Jacuzzi', bounds: { left: 72, top: 40, width: 16, height: 47 }, responses: dialogue.luke },
  ],
};
