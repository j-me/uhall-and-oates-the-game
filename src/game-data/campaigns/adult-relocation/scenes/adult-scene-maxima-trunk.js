import { adultArt as art, item, next, puzzle } from './adult-scene-helpers.js';

export const adultMaximaTrunk = {
  id: 'adult-maxima-trunk',
  playerId: 'john-oates',
  name: 'Did It in a Minute, Billed It as an Hour',
  caption: 'John’s view from the trunk lip: 1993 technology, Stone Age labor policy.',
  intro: 'Joe orders John to inspect the gold Maxima’s trunk before climbing inside. The car should not exist in 1986, and neither should the Reardon Catalog Relocation Unit humming beneath its spare tire. The device routes cargo by the dates printed on company paperwork. Joe Timmins is less interested in causality than whether John clocks out before he shuts the lid.',
  opening: 'JOE TIMMINS (through the cassette deck): Trunk time is commuting time, Oates. If the tape calls you company property, that is between you and payroll.',
  reveal: { src: `${art}/reveals/adult-01-maxima-trunk-v1.png`, alt: 'John inspects a glowing time machine while Joe bills the work from above the gold Maxima trunk', tagline: 'Objects in Trunk May Be from the Future.' },
  background: `${art}/chapters/adult-01/maxima-trunk-v1.png`,
  characters: [],
  hotspots: [
    { id: 'emergency-necktie', label: 'Joe’s emergency necktie', bounds: { left: 6, top: 68, width: 23, height: 27 }, item: item('emergencyNecktie', 'emergency necktie', 'tie'), hiddenWhen: ['emergency-necktieTaken'], responses: { look: 'A clip-on tie reinforced with a suspiciously useful metal strip.', take: 'John takes the tie. Joe deducts one formalwear unit.' } },
    { id: 'cassette-adapter', label: 'broken cassette adapter', bounds: { left: 33, top: 77, width: 17, height: 15 }, item: item('cassetteAdapter', 'broken cassette adapter', 'cassette'), hiddenWhen: ['cassette-adapterTaken'], responses: { look: 'Its contact spring is missing.', take: 'John retrieves technology that was obsolete before it arrived.' } },
    { id: 'cassette-deck', label: 'trunk cassette deck', bounds: { left: 41, top: 59, width: 19, height: 18 }, responses: { look: 'A dashboard cassette deck is wired into the spare tire. Joe’s jammed dictation tape bills one minute as an hour, calls John company property, and cites a management filing from 1976.' }, useWith: {
      emergencyNecktie: { requires: ['cassette-adapterTaken'], missing: 'The metal strip needs something cassette-shaped to repair.', removeItems: ['emergencyNecktie', 'cassetteAdapter'], give: [item('repairedAdapter', 'repaired cassette adapter', 'cassette')], setFlags: ['adapterRepaired'], clearSelection: true, success: true, effect: 'repair', message: 'The necktie strip restores the adapter. Joe has finally contributed structural support.' },
      repairedAdapter: { puzzle: 'temporalTrunk', puzzleData: puzzle('CATALOG RELOCATION UNIT', 'VIN: 1N4… MODEL YEAR 1993', 'Joe’s tape says: bill the hour, classify John as property, and route management materials to their filing year.', [
        { label: 'BILLING', options: ['One minute', 'One hour', 'No overtime'], answer: 'One hour' },
        { label: 'CLASSIFICATION', options: ['Passenger', 'Company property', 'Musician'], answer: 'Company property' },
        { label: 'ROUTE YEAR', options: ['1976', '1987', '1993'], answer: '1976' },
      ], 'The trunk releases—and the Maxima tears a hole through the company timeline.', 'temporal-trunk-console'), removeItems: ['repairedAdapter'], give: [item('joeLedger', 'Joe’s contradictory mileage ledger', 'ledger')], setFlags: ['catalogUnitActivated', 'adultEvidenceLedger'], clearSelection: true, success: true, effect: 'route', complete: 'The unit follows every date in its connected paperwork: John and the Maxima jump to 1993, Daryl follows a Reardon retreat file to 1987, and a network-audit cable pulls Michael McDonald toward 2001.', next: next('adult-02', 'adult-reardon-resort'), message: 'The model-year contradiction activates the Catalog Relocation Unit. Everyone becomes a shipping error with a different delivery date.' },
    } },
  ],
};
