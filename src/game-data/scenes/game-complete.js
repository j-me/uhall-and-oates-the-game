import { outroDialogue as dialogue } from '../dialogue/outro.js';

const art = 'assets/art';

export const gameComplete = {
  id: 'game-complete',
  name: 'Game Complete — Return to Sender',
  caption: 'Daryl is free. The Reardons are not having a good exit interview.',
  intro: 'The river quiets. The contracts fail. And somewhere in Maine, a moving company finally gets to close one account.',
  opening: dialogue.opening,
  completion: dialogue.completion,
  completionTitle: 'RESCUE COMPLETE',
  next: { chapterId: 'outro', sceneId: 'timmins-maxima', skipIntro: true },
  background: `${art}/chapters/chapter-06/the-forks-finale-v1.png`,
  characters: [
    { src: `${art}/characters/john-oates-relieved-v1.png`, alt: 'John Oates, relieved', className: 'john-idle', bounds: { left: 7, top: 43, width: 18, height: 48 } },
    { src: `${art}/characters/daryl-hall-sprite-v1.png`, alt: 'Daryl Hall, newly rescued', className: 'npc-idle', bounds: { left: 26, top: 41, width: 17, height: 49 } },
    { src: `${art}/characters/jesse-reardon-sprite-v1.png`, alt: 'Jesse Reardon, defeated record executive', className: 'npc-idle', bounds: { left: 63, top: 39, width: 16, height: 48 } },
    { src: `${art}/characters/joe-reardon-sprite-v1.png`, alt: 'Joe Reardon, defeated record executive', className: 'npc-idle', bounds: { left: 69, top: 35, width: 34, height: 50 } },
  ],
  hotspots: [
    { id: 'daryl-outro', label: 'Daryl Hall', bounds: { left: 27, top: 42, width: 15, height: 46 }, responses: dialogue.daryl },
    { id: 'jesse-outro', label: 'Jesse Reardon', bounds: { left: 64, top: 40, width: 14, height: 45 }, responses: dialogue.jesse },
    { id: 'joe-outro', label: 'Joe Reardon', bounds: { left: 79, top: 35, width: 14, height: 50 }, responses: dialogue.joe },
  ],
};
