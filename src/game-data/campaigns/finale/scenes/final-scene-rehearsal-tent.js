import { placeCharacter } from '../../../characters.js';
import { finalArt as art, item, next } from './final-scene-helpers.js';

export const finalRehearsalTent = {
  id: 'final-rehearsal-tent', playerId: 'john-oates',
  name: 'Out of Touch, In Rehearsal',
  caption: 'The pier remembers the kidnapping. The arrow pads remember every missed beat.',
  intro: 'Back at Old Orchard Beach, John and Daryl have everything except a finished arrangement. For once, neither can solve it alone: John must stop hiding inside the work, and Daryl must show up before the applause.',
  opening: 'DARYL: If I miss a step, call it syncopation.\nJOHN: If I miss one, Joe calls it overtime.',
  reveal: { src: `${art}/chapters/final-05/rehearsal-tent-v1.png`, alt: 'A seaside rehearsal tent with four glowing rhythm lanes overlooking Old Orchard Beach Pier', tagline: 'Your Kiss Is on the Hit Line.' },
  background: `${art}/chapters/final-05/rehearsal-tent-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'determined', bounds: { left: 1, top: 41, width: 17, height: 52 } }),
    placeCharacter('daryl-hall', { bounds: { left: 84, top: 40, width: 15, height: 51 } }),
  ],
  decorations: [
    { src: `${art}/items/rehearsal-route-board-v1.png`, alt: '', className: 'scene-decoration--prop scene-decoration--fixture', bounds: { left: 18, top: 23, width: 12, height: 17 } },
  ],
  hotspots: [
    { id: 'rehearsal-route-board', label: 'portable broadcast route board', bounds: { left: 18, top: 23, width: 12, height: 17 }, responses: { look: 'The portable board has four jacks and one green unsponsored channel. The route card’s pier plug fits the empty input.' }, useWith: { broadcastRouteCard: { removeItems: ['broadcastRouteCard'], setFlags: ['rehearsalRouted'], clearSelection: true, success: true, effect: 'route', message: 'John plugs in the pier route card. The green unsponsored channel reaches the four rehearsal lanes, which wake up in sequence.' } } },
    { id: 'rhythm-rehearsal-floor', label: 'four-lane shared rehearsal floor', bounds: { left: 18, top: 52, width: 65, height: 43 }, responses: { look: 'The four glowing floor lanes mirror the puzzle controls. Tap or use arrow keys when each falling note reaches the gold line.' }, useWith: { cleanLiveMix: { requires: ['rehearsalRouted'], missing: 'The live mix is ready, but the pier route card must connect its unsponsored channel to the portable board first.', puzzle: 'rhythmRehearsal', puzzleData: { title: 'ONE ON ONE REHEARSAL', subtitle: 'JOHN + DARYL · SHARE THE BEAT', clue: 'Tap a lane—or use the arrow keys—when its note reaches the gold line. Hit 9 of 12; misses are harmless and you may retry.', successMessage: 'John and Daryl finish the arrangement together. Neither can pretend the other part is optional.' }, removeItems: ['cleanLiveMix'], give: [item('sharedArrangement', 'John and Daryl’s shared arrangement', 'final-shared-arrangement')], setFlags: ['sharedArrangementFinished'], clearSelection: true, success: true, effect: 'voice', complete: 'Their new arrangement contains no archived recording, corporate slogan, or solo escape route. Joe responds by locking the live broadcast.', next: next('final-06', 'final-pier-concert'), message: 'The rehearsal finally sounds like two people choosing the same song.' } } },
    { id: 'daryl-final-rehearsal', label: 'Daryl Hall', bounds: { left: 84, top: 40, width: 15, height: 51 }, responses: { look: 'Daryl is nervous enough to carry an amplifier without being asked.', talk: 'DARYL: I thought the performance was the work.\nJOHN: It is the part with witnesses.\nDARYL: Then let’s do the rest too.' } },
    { id: 'spare-cable-pile', label: 'unreasonably dramatic spare cables', bounds: { left: 0, top: 80, width: 14, height: 20 }, responses: { look: 'A blue cable coil has arranged itself into a very small power ballad.', take: 'John leaves it. The song already has enough unresolved tension.' } },
  ],
};
