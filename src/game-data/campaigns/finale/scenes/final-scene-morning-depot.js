import { placeCharacter } from '../../../characters.js';
import { finalArt as art } from './final-scene-helpers.js';
import { youreDoingItSong } from '../songs/youre-doing-it.js';

export const finalMorningDepot = {
  id: 'final-morning-depot', playerId: 'john-oates',
  name: 'The Things That Move Us',
  caption: 'The van carries instruments. The box carries consequences. Joe carries the box.',
  intro: 'The next morning, the depot is quiet. The company keys belong to its employees, the touring van holds instruments instead of furniture, and nobody has left a mysterious sequel label anywhere.',
  opening: 'DARYL: I’ll take the light case.\nJOHN: You’ll take the heavy one.\nDARYL: Fine. But I’m still calling the encore.',
  reveal: { src: `${art}/chapters/final-outro/morning-depot-v1.png`, alt: 'A peaceful depot morning with an instrument van, the gold Maxima and one remaining box', tagline: 'Closed for Rehearsal.' },
  background: `${art}/chapters/final-outro/morning-depot-v1.png`,
  characters: [
    placeCharacter('joe-timmins', { bounds: { left: 21, top: 40, width: 15, height: 52 } }),
    placeCharacter('john-oates', { pose: 'relieved', bounds: { left: 38, top: 41, width: 17, height: 52 } }),
    placeCharacter('daryl-hall', { pose: 'relieved', bounds: { left: 58, top: 39, width: 16, height: 54 } }),
  ],
  hotspots: [
    { id: 'closed-for-rehearsal-sign', label: 'Closed for Rehearsal sign', bounds: { left: 2, top: 50, width: 13, height: 23 }, actions: { take: { setFlags: ['finalCampaignComplete'], pickup: true, success: true, effect: 'pickup', performance: { ...youreDoingItSong, src: `${art}/chapters/final-outro/hall-oates-performance-v1.png`, title: 'YOU’RE DOING IT,\nNO YOU’RE DOING IT!', kicker: 'THE FIRST NEW UHALL & OATES ORIGINAL', alt: 'John Oates plays guitar while Daryl Hall sings and plays keyboard, pointing playfully at each other inside the sunrise depot' }, completionTitle: 'THE END — FOR REAL', complete: 'THE SOUND OF MOVING ON COMPLETE — John and Daryl leave the moving business behind and debut “You’re Doing It, No You’re Doing It!” together.', message: 'John hangs the sign over the old company logo. Daryl plugs in the keyboard. Their first argument as full-time musicians already has a chorus.' } }, responses: { look: 'Hand-painted, slightly crooked, and the first company announcement John actually wants to make.' } },
    { id: 'touring-van', label: 'instrument touring van', bounds: { left: 48, top: 43, width: 24, height: 38 }, responses: { look: 'Cases, cables, keyboards, and no furniture. The suspension seems emotionally relieved.', use: 'John checks the load once. Daryl checks his hair twice.' } },
    { id: 'joes-final-box', label: 'Joe’s first actual box', bounds: { left: 6, top: 75, width: 17, height: 20 }, responses: { look: 'The huge foreground box is ordinary cardboard. Joe standing beside it is extraordinary accountability.', talk: 'JOE: Who authorized this weight?\nJOHN: Management.' } },
  ],
};
