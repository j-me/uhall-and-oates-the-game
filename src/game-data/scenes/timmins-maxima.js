import { outroDialogue as dialogue } from '../dialogue/outro.js';

const art = 'assets/art';

export const timminsMaxima = {
  id: 'timmins-maxima',
  name: 'Game Complete — Trunk Service',
  caption: 'A gold Maxima, an open trunk, and one manager who misunderstands every noun.',
  intro: 'The rescue is over. Unfortunately, Joe Timmins has remembered that Oates works for him.',
  opening: dialogue.maximaOpening,
  background: `${art}/chapters/chapter-06/return-to-sender-maxima-v2.png`,
  characters: [
    { src: `${art}/characters/daryl-hall-sprite-v1.png`, alt: 'Daryl Hall, enjoying the aftermath', className: 'npc-idle', bounds: { left: 1, top: 0, width: 66, height: 100 } },
    { src: `${art}/characters/john-oates-relieved-v1.png`, alt: 'John Oates, refusing trunk duty', className: 'john-idle', bounds: { left: 13, top: 31, width: 15, height: 55 } },
    { src: `${art}/characters/joe-timmins-sprite-v1.png`, alt: 'Joe Timmins pointing toward the trunk', className: 'npc-idle', bounds: { left: 73, top: 22, width: 16, height: 65 } },
  ],
  hotspots: [
    { id: 'daryl-maxima', label: 'Daryl Hall', bounds: { left: 20, top: 5, width: 25, height: 28 }, responses: dialogue.darylMaxima },
    { id: 'joe-timmins-maxima', label: 'Joe Timmins', bounds: { left: 73, top: 53, width: 16, height: 35 }, responses: dialogue.timmins },
    { id: 'gold-maxima', label: 'gold Nissan Maxima', bounds: { left: 31, top: 34, width: 40, height: 47 }, responses: dialogue.maxima, useWith: { emptyTapeRoll: { removeItems: ['emptyTapeRoll'], clearSelection: true, success: true, effect: 'tape', video: 'assets/video/uhallandoates.mp4', complete: dialogue.finalCompletion, completionTitle: 'GAME COMPLETE', message: dialogue.maxima.tapeRoll } } },
    { id: 'john-maxima', label: 'John Oates', bounds: { left: 13, top: 53, width: 15, height: 35 }, responses: dialogue.john },
  ],
};
