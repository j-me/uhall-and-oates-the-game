import { outroDialogue as dialogue } from '../dialogue/original-dialogue-outro.js';
import { placeCharacter } from '../../../characters.js';

const art = 'assets/art/campaigns/original';

export const gameComplete = {
  id: 'game-complete',
  name: 'Game Complete — Return to Sender',
  caption: 'Daryl is free. The Reardons are exploring involuntary career mobility.',
  intro: 'The river quiets. The contracts fail. And somewhere in Maine, a moving company finally gets to close one account.',
  opening: dialogue.opening,
  completion: dialogue.completion,
  completionTitle: 'RESCUE COMPLETE',
  next: { chapterId: 'outro', sceneId: 'timmins-maxima', skipIntro: true },
  background: `${art}/chapters/chapter-06/the-forks-finale-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'relieved', alt: 'John Oates, relieved', bounds: { left: 7, top: 43, width: 18, height: 48 } }),
    placeCharacter('daryl-hall', { alt: 'Daryl Hall, newly rescued', bounds: { left: 26, top: 41, width: 17, height: 49 } }),
    placeCharacter('jesse-reardon', { alt: 'Jesse Reardon, defeated record executive', bounds: { left: 63, top: 39, width: 16, height: 48 } }),
    placeCharacter('joe-reardon', { alt: 'Joe Reardon, defeated record executive', bounds: { left: 78, top: 35, width: 15, height: 50 } }),
  ],
  hotspots: [
    { id: 'daryl-outro', label: 'Daryl Hall', bounds: { left: 27, top: 42, width: 15, height: 46 }, responses: dialogue.daryl },
    { id: 'jesse-outro', label: 'Jesse Reardon', bounds: { left: 64, top: 40, width: 14, height: 45 }, responses: dialogue.jesse },
    { id: 'joe-outro', label: 'Joe Reardon', bounds: { left: 79, top: 35, width: 14, height: 50 }, responses: dialogue.joe },
  ],
};
