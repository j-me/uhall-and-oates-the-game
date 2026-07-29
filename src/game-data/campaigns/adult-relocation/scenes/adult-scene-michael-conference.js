import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item, next } from './adult-scene-helpers.js';

export const adultMichaelConference = {
  id: 'adult-michael-conference', playerId: 'michael-mcdonald',
  name: 'Out of Touch-Tone — 2001',
  caption: '2001 • Michael combines the pager translation with the Reardon audit log.',
  opening: 'MICHAEL: I combine the pager translation with the audit log. Finally, a meeting with an agenda.',
  background: `${art}/chapters/adult-06/time-call-v1.png`,
  characters: [placeCharacter('michael-mcdonald', { bounds: { left: 10, top: 40, width: 18, height: 52 } }), placeCharacter('michael-bolton', { bounds: { left: 70, top: 38, width: 18, height: 53 } })],
  hotspots: [
    { id: 'future-conference-phone', label: '2001 conference phone', bounds: { left: 70, top: 46, width: 12, height: 16 }, responses: { look: 'It can combine the pager translation with the audit log’s hidden routing metadata.' }, useWith: { pagerTranslation: { requires: ['adultEvidenceAudit'], missing: 'The translation needs the Reardon audit log waiting in the trunk.', removeItems: ['pagerTranslation', 'auditLog'], giveTo: { trunk: [item('filingNumber', '1976 filing number', 'code')] }, setFlags: ['filingNumberDecoded'], clearSelection: true, success: true, effect: 'broadcast', complete: 'The three eras agree on one impossible fact: Joe’s handbook was filed in 1976 before he wrote it.', next: next('adult-07', 'adult-fractured-warehouse'), message: 'The Michaels decode the audit metadata. The Maxima prints a route to the original 1976 warehouse.' } } },
  ],
};
