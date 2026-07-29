import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item, puzzle } from './adult-scene-helpers.js';

export const adultDarylSwitchboard = {
  id: 'adult-daryl-switchboard', playerId: 'daryl-hall',
  name: 'Out of Touch-Tone — 1987',
  caption: '1987 • Daryl encodes the handbook; the shared trunk carries his code forward.',
  opening: 'DARYL: I encode the handbook here. The shared Maxima trunk will carry the code to John.',
  intro: 'The repaired system connects three eras. Daryl hears digits as melody, John receives them as pager shorthand, and Michael sees them as network commands. Joe keeps joining the call to dispute the rate.',
  reveal: { src: `${art}/reveals/adult-06-touch-tone-v1.png`, alt: 'Daryl, John and Michael connect switchboard, pager and conference phone across three decades', tagline: 'Please Hold for Another Decade.' },
  background: `${art}/chapters/adult-06/time-call-v1.png`,
  characters: [placeCharacter('daryl-hall', { bounds: { left: 12, top: 40, width: 18, height: 52 } })],
  hotspots: [
    { id: 'daryl-era-phone', label: '1987 Reardon switchboard', bounds: { left: 10, top: 30, width: 24, height: 44 }, responses: { look: 'The switchboard translates printed classifications into touch-tone melody, then sends the result toward the 1993 trunk.' }, useWith: { alteredHandbook: { puzzle: 'switchboard', puzzleData: puzzle('1987 SWITCHBOARD', 'JOE TIMMINS HAS JOINED THE CALL', 'The altered master marks the message as instructor review, priority danger and one protected copy; it must reach the 1993 trunk.', [
      { label: 'LINE', options: ['Public', 'Instructor review', 'Joe’s office'], answer: 'Instructor review' },
      { label: 'PRIORITY', options: ['Routine', 'Priority danger', 'Hold forever'], answer: 'Priority danger' },
      { label: 'COPIES', options: ['1', '500', '0'], answer: '1' },
      { label: 'DESTINATION', options: ['1993 trunk', 'Public line', 'Joe’s office'], answer: '1993 trunk' },
    ], 'Daryl sings the classification as touch-tone digits. The trunk prints them in 1993.', 'switchboard-console'), removeItems: ['alteredHandbook'], giveTo: { trunk: [item('touchToneCode', 'Daryl’s touch-tone code', 'code'), item('alteredHandbookCopy', 'altered handbook evidence', 'handbook')] }, setFlags: ['darylCodeSent'], clearSelection: true, success: true, effect: 'voice', message: 'Daryl feeds the master into the switchboard and sends its protected copy and touch-tone code through the temporal trunk.' } } },
  ],
};
