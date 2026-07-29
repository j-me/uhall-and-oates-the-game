import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item } from './adult-scene-helpers.js';

export const adultJohnPayphone = {
  id: 'adult-john-payphone', playerId: 'john-oates',
  name: 'Out of Touch-Tone — 1993',
  caption: '1993 • John retrieves Daryl’s code, then passes the translation to Michael.',
  opening: 'JOHN: I retrieve Daryl’s code from the shared trunk, then send the translation to Michael.',
  background: `${art}/chapters/adult-06/time-call-v1.png`,
  characters: [placeCharacter('john-oates', { pose: 'determined', bounds: { left: 10, top: 41, width: 19, height: 52 } }), placeCharacter('joe-timmins', { bounds: { left: 72, top: 38, width: 17, height: 53 } })],
  hotspots: [
    { id: 'john-era-phone', label: '1993 mall payphone', bounds: { left: 42, top: 24, width: 22, height: 43 }, responses: { look: 'The payphone converts touch tones into pager abbreviations.' }, useWith: { touchToneCode: { removeItems: ['touchToneCode'], giveTo: { trunk: [item('pagerTranslation', '1993 pager translation', 'code')] }, setFlags: ['johnCodeSent'], clearSelection: true, success: true, effect: 'route', message: 'John converts Daryl’s melody into a pager message and sends it onward to 2001.' } } },
    { id: 'joe-conference-call', label: 'Joe Timmins on call waiting', bounds: { left: 72, top: 40, width: 16, height: 50 }, responses: { look: 'Joe is charging the rescue call back to John.', talk: 'JOE: This call lacks an agenda.\nJOHN: You are the agenda problem.' } },
  ],
};
