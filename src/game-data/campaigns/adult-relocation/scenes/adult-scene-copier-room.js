import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item, next, puzzle } from './adult-scene-helpers.js';

export const adultCopierRoom = {
  id: 'adult-copier-room', playerId: 'daryl-hall',
  name: 'The Master Copy',
  caption: 'One toner cartridge away from rewriting management history.',
  background: `${art}/chapters/adult-02/copier-room-v1.png`,
  characters: [
    placeCharacter('daryl-hall', { bounds: { left: 9, top: 40, width: 18, height: 52 } }),
    placeCharacter('joe-reardon', { bounds: { left: 28, top: 42, width: 10, height: 48 } }),
    placeCharacter('jesse-reardon', { bounds: { left: 72, top: 38, width: 16, height: 51 } }),
  ],
  hotspots: [
    { id: 'retreat-copier', label: 'handbook master copier', bounds: { left: 39, top: 30, width: 27, height: 52 }, responses: { look: 'The copier has three ordinary settings and one red archive-mark roller. Together they can make a terrible handbook officially untouchable.' }, useWith: { dangerCassette: { puzzle: 'safetyCopier', puzzleData: puzzle('REARDON MASTER COPIER', 'PRIORITY DANGER CASSETTE INSERTED', 'Kenny’s safety tape calls for one copy, instructor review, a hazard mark and immediate quarantine.', [
      { label: 'QUANTITY', options: ['1 copy', '500 copies', 'Endless copies'], answer: '1 copy' },
      { label: 'DESTINATION', options: ['Mail room', 'Instructor review', 'Record vault'], answer: 'Instructor review' },
      { label: 'ARCHIVE MARK', options: ['Hazard stripe', 'Executive seal', 'Inspirational quote'], answer: 'Hazard stripe' },
      { label: 'HANDLING', options: ['Distribute', 'Quarantine', 'Laminate'], answer: 'Quarantine' },
    ], 'The copier quarantines Joe’s handbook and prints Daryl’s harmless vocal diagram as the new master.', 'safety-copier-console'), removeItems: ['dangerCassette'], give: [item('alteredHandbook', 'altered handbook master', 'handbook')], setFlags: ['handbookAltered', 'adultEvidenceHandbook'], clearSelection: true, success: true, effect: 'contract', complete: 'The Reardons’ 1987 print run is ruined, but one page emerges bearing a SmoothMove.com audit mark from 2001.', next: next('adult-03', 'adult-mall-concourse'), message: 'Daryl replaces ownership policy with a vocal warm-up chart. Executives call it visionary.' } } },
    { id: 'joe-training', label: 'Joe Reardon', bounds: { left: 28, top: 43, width: 10, height: 46 }, responses: { look: 'Joe is editing the copier instructions with a red pen and the confidence of someone who has never cleared a paper jam.', talk: 'JOE REARDON: This safety cassette keeps routing hazardous material away from distribution. The red stripe makes it official.\nDARYL: A safety feature?\nJOE REARDON: An obstacle to scale.' } },
    { id: 'jesse-training', label: 'Jesse Reardon', bounds: { left: 73, top: 40, width: 14, height: 47 }, responses: { look: 'Jesse is waiting for five hundred copies of something legally indefensible.', talk: 'JESSE: We prefer “educational ownership.”\nDARYL: I prefer a bridge with a better chord.' } },
  ],
};
