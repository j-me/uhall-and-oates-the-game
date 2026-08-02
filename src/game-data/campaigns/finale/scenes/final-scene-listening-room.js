import { placeCharacter } from '../../../characters.js';
import { finalArt as art, item, next, puzzle } from './final-scene-helpers.js';

export const finalListeningRoom = {
  id: 'final-listening-room', playerId: 'john-oates',
  name: 'Private Ears at the One on One Listening Room',
  caption: 'Two headphones, one recording, and Baltos billing by the hunch.',
  intro: 'The restored reel leads to an after-hours Manhattan record shop. Baltos now calls himself an audio forensicist, a title he invented while eating near the listening booth.',
  opening: 'BALTOS: I separated the channels for security. Also by accident. Mostly the second one.',
  reveal: { src: `${art}/chapters/final-02/listening-room-v1.png`, alt: 'A neon Manhattan listening room with an enormous analog patch panel', tagline: 'Private Ears Are Listening.' },
  background: `${art}/chapters/final-02/listening-room-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'determined', bounds: { left: 4, top: 42, width: 18, height: 51 } }),
    placeCharacter('daryl-hall', { bounds: { left: 24, top: 40, width: 17, height: 52 } }),
    placeCharacter('baltos', { bounds: { left: 68, top: 39, width: 15, height: 51 } }),
  ],
  hotspots: [
    { id: 'stereo-patch-panel', label: 'one-on-one stereo patch panel', bounds: { left: 43, top: 9, width: 25, height: 51 }, responses: { look: 'The wall-sized panel labels John’s arrangement channel LEFT, Daryl’s melody channel RIGHT, and the two-seat listening booth SHARED.' }, useWith: { rehearsalReel: { puzzle: 'stereoPatch', puzzleData: puzzle('ONE ON ONE LISTENING BOOTH', 'RESTORE THE SHARED RECORDING', 'Follow the three labels on the wall panel: arrangement left, melody right, both channels to the shared room.', [
      { label: 'LEFT', options: ['Daryl melody', 'John arrangement', 'Snack counter'], answer: 'John arrangement' },
      { label: 'RIGHT', options: ['John arrangement', 'Daryl melody', 'Baltos commentary'], answer: 'Daryl melody' },
      { label: 'MONITOR', options: ['Solo booth', 'Shared room', 'Sidewalk'], answer: 'Shared room' },
    ], 'Both channels meet. A hidden cue identifies Michael McDonald’s Chicago studio.', 'final-stereo-console'), removeItems: ['rehearsalReel'], give: [item('setListFragment', 'shared set-list fragment', 'final-set-list')], setFlags: ['setListRecovered'], clearSelection: true, success: true, effect: 'voice', complete: 'The combined channels reveal a Chicago studio transfer code. Baltos declares stereo “two monologues that finally hired a mediator.”', next: next('final-03', 'final-chicago-studio'), message: 'John’s arrangement and Daryl’s melody finally occupy the same recording.' } } },
    { id: 'baltos-final', label: 'Baltos, audio forensicist', bounds: { left: 70, top: 52, width: 12, height: 38 }, responses: { look: 'Baltos has labeled every cable “probably important.”', talk: 'BALTOS: Mono is decisive. Stereo is suspicious.\nJOHN: Which one did you break?\nBALTOS: I prefer “liberated into components.”' } },
    { id: 'record-snacks', label: 'record-shop snack counter', bounds: { left: 84, top: 63, width: 16, height: 32 }, responses: { look: 'Wax candy, stale pretzels, and a baseball-card gum fragment Baltos calls archival adhesive.', take: 'Baltos slaps an evidence sticker on the snacks. It is upside down.' } },
  ],
};
