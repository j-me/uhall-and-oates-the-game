import { placeCharacter } from '../../../characters.js';
import { finalArt as art, next, puzzle } from './final-scene-helpers.js';

export const finalPierConcert = {
  id: 'final-pier-concert', playerId: 'john-oates',
  name: 'Do What You Want, Be What You Are',
  caption: 'One pier, one live channel, and absolutely no room left for a sofa.',
  intro: 'The anniversary broadcast begins beneath Joe’s collapsing sponsor banner. The Reardons expect the Purpose Clause to replace every original choice with approved advertising. John and Daryl have one live channel and one chance to decide what their work is for.',
  opening: 'JOE: Remember: enthusiasm, brand visibility, no unauthorized feelings.\nJOHN: Daryl?\nDARYL: Let’s be unauthorized.',
  reveal: { src: `${art}/chapters/final-06/pier-concert-v1.png`, alt: 'Old Orchard Beach Pier transformed into a brightly lit nighttime concert stage', tagline: 'Do What You Want. Play What You Are.' },
  background: `${art}/chapters/final-06/pier-concert-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'determined', bounds: { left: 33, top: 41, width: 16, height: 51 } }),
    placeCharacter('daryl-hall', { bounds: { left: 50, top: 39, width: 16, height: 53 } }),
    placeCharacter('joe-timmins', { bounds: { left: 82, top: 38, width: 15, height: 54 } }),
  ],
  decorations: [
    { src: `${art}/items/purpose-receipt-v1.png`, alt: '', className: 'scene-decoration--prop', bounds: { left: 70, top: 76, width: 7, height: 10 }, hiddenWhen: ['joe-filing-receiptTaken'] },
  ],
  hotspots: [
    { id: 'joe-filing-receipt', label: 'Joe’s dropped pre-company receipt', bounds: { left: 70, top: 76, width: 7, height: 10 }, item: { id: 'purposeReceipt', label: 'pre-company performance receipt', icon: 'final-purpose-receipt' }, hiddenWhen: ['joe-filing-receiptTaken'], responses: { look: 'The tiny paper on the stage bears a performance stamp from before Uhall & Oates was incorporated.', take: 'John takes Joe’s receipt. For the first time, one of Joe’s expenses is priceless.' } },
    { id: 'concert-control-stations', label: 'three-station live concert console', bounds: { left: 1, top: 51, width: 30, height: 40 }, responses: { look: 'The left-side live desk controls three stations: John’s instrument bus, Daryl’s microphone source, and a paper slot labeled ORIGINAL PURPOSE.' }, useWith: {
      purposeReceipt: { removeItems: ['purposeReceipt'], setFlags: ['purposeChallengeFiled'], clearSelection: true, success: true, effect: 'manifest', message: 'John files the pre-company receipt in the ORIGINAL PURPOSE slot. The console accepts that the music existed before the moving company.' },
      sharedArrangement: { requires: ['purposeChallengeFiled'], missing: 'The shared arrangement is ready, but the pre-company performance receipt must be filed in the console’s ORIGINAL PURPOSE slot first.', puzzle: 'concertStations', puzzleData: puzzle('THE FINAL LIVE MIX', 'THREE STATIONS · ONE ORIGINAL PERFORMANCE', 'The filed receipt unlocked the board. Route John to live instruments, Daryl to the unsponsored microphone, and recognize that the music came first.', [
      { label: 'JOHN’S BOARD', options: ['Corporate jingle bus', 'Live instruments', 'Loading dock P.A.'], answer: 'Live instruments' },
      { label: 'DARYL’S MIC', options: ['Archived vocal', 'Unsponsored live mic', 'Joe’s voicemail'], answer: 'Unsponsored live mic' },
      { label: 'PURPOSE FILE', options: ['Company came first', 'Music came first', 'Reardon owns time'], answer: 'Music came first' },
    ], 'The system cannot classify a new shared performance as cargo. The Purpose Clause rejects itself.', 'final-concert-console'), removeItems: ['sharedArrangement'], setFlags: ['finalPerformanceComplete'], clearSelection: true, success: true, effect: 'broadcast', completionTitle: 'THE MUSIC MOVES', complete: 'John and Daryl perform a brief original instrumental sting. The Reardon screen changes from ASSET CLASSIFIED to ARTIST UNAVAILABLE.', next: next('final-outro', 'final-morning-depot'), message: 'The live channel opens. The audience hears two partners—not a company, archive, or advertisement.' },
    } },
    { id: 'joe-final-concert', label: 'Joe Timmins, executive producer of nothing', bounds: { left: 82, top: 38, width: 15, height: 54 }, responses: { look: 'Joe is trying to expense the applause.', talk: 'JOE: The audience response belongs to the company.\nJOHN: Then the company can take a bow. We are busy.' } },
    { id: 'sponsor-banner', label: 'collapsing sponsor banner', bounds: { left: 17, top: 10, width: 55, height: 27 }, responses: { look: 'The giant torn fish banner has finally achieved the same structural integrity as Joe’s argument.', use: 'A sea breeze removes the last recognizable sponsor panel. Nobody stops it.' } },
  ],
};
