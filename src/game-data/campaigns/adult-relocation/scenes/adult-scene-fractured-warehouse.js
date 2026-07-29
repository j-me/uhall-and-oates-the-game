import { placeCharacter } from '../../../characters.js';
import { adultArt as art, next, puzzle } from './adult-scene-helpers.js';

export const adultFracturedWarehouse = {
  id: 'adult-fractured-warehouse', playerId: 'john-oates',
  name: 'Back Together Again, Pending Approval',
  caption: 'Four decades, five contradictions and one manager refusing liability.',
  intro: 'The original Uhall warehouse now occupies 1976, 1987, 1993 and 2001 at once. Young Joe is about to copy a handbook sent by his future self, while the Reardons activate the corporation built from its contradictions.',
  opening: 'YOUNG JOE: This handbook says I become management.\nJOHN: Put it down. You still have options.',
  reveal: { src: `${art}/reveals/adult-07-timeline-v1.png`, alt: 'John confronts young and future Joe at a management console fractured across four decades', tagline: 'History Is Subject to Manager Approval.' },
  background: `${art}/chapters/adult-07/fractured-warehouse-v1.png`,
  characters: [placeCharacter('john-oates', { pose: 'determined', bounds: { left: 8, top: 41, width: 18, height: 52 } }), placeCharacter('young-joe-timmins', { bounds: { left: 66, top: 40, width: 15, height: 51 } }), placeCharacter('joe-timmins', { bounds: { left: 82, top: 38, width: 15, height: 53 } })],
  hotspots: [
    { id: 'handbook-console', label: 'Consolidated Adult Education console', bounds: { left: 35, top: 20, width: 28, height: 44 }, responses: { look: 'The evidence tray summarizes five problems: the filing has no originating author; John is both property and contractor; Daryl is both a productive asset and credited with zero labor; the audit calls Michael “office ambience”; and Virtual Joe denies responsibility.' }, useWith: { filingNumber: { requires: ['adultEvidenceLedger', 'adultEvidenceHandbook', 'adultEvidenceContractor', 'adultEvidenceFleet', 'adultEvidenceAudit'], missing: (flags) => {
      const labels = {
        adultEvidenceLedger: 'Joe’s mileage ledger',
        adultEvidenceHandbook: 'Daryl’s altered handbook',
        adultEvidenceContractor: 'the contractor form',
        adultEvidenceFleet: 'Huey’s fleet lien',
        adultEvidenceAudit: 'the SmoothMove audit log',
      };
      const records = flags.map((flag) => labels[flag] || flag);
      return `The filing number is valid, but the evidence tray is missing ${records.join(', ')}.`;
    }, puzzle: 'handbookContradictions', puzzleData: puzzle('CONSOLIDATED ADULT EDUCATION', 'FINAL CLASSIFICATION REVIEW', 'File the contradiction supported by each era’s records.', [
      { label: 'AUTHORSHIP', options: ['Joe wrote it', 'No true author', 'Reardon wrote it'], answer: 'No true author' },
      { label: 'JOHN', options: ['Company property', 'Independent contractor', 'Both—contradiction'], answer: 'Both—contradiction' },
      { label: 'DARYL', options: ['Productive asset', 'No measurable labor', 'Both—contradiction'], answer: 'Both—contradiction' },
      { label: 'MICHAEL', options: ['Employee', 'Office ambience', 'Server rack'], answer: 'Office ambience' },
      { label: 'JOE', options: ['Accepts liability', 'Denies responsibility', 'Competent manager'], answer: 'Denies responsibility' },
    ], 'The handbook rejects its own authority. Four decades snap back into place.', 'handbook-console'), removeItems: ['filingNumber'], setFlags: ['adultTimelineRestored'], clearSelection: true, success: true, effect: 'contract', completionTitle: 'TIMELINE REPAIRED', complete: 'The Reardon corporation collapses. Kenny classifies the machine as dangerous cargo; Bolton disconnects 2001; Jamo pulls the Maxima free; Joe takes credit.', next: next('adult-outro', 'adult-restored-depot'), message: 'Joe’s contradictions defeat the system designed from Joe’s contradictions. He immediately calls this leadership.' } } },
    { id: 'timmins-paradox', label: 'Joe Timmins, before and after management', bounds: { left: 68, top: 38, width: 29, height: 53 }, responses: { look: 'Young Joe sees a possible future. Future Joe sees an unpaid intern with excellent posture.', talk: 'YOUNG JOE: Do I become respected?\nJOE: Better. You become management.\nJOHN: He asked about respect.' } },
  ],
};
