export const debugLoadouts = {
  'chapter-01': [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
  'chapter-02': [
    { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' },
    { id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' },
  ],
  'chapter-03': [
    { id: 'shreddedInvoice', label: 'reconstructed invoice', icon: 'invoice' },
    { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' },
    { id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' },
  ],
  'chapter-04': [
    { id: 'londonShippingLabel', label: 'London shipping label', icon: 'tag' },
    { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' },
    { id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' },
  ],
  'chapter-05': [
    { id: 'tokyoAccessPass', label: 'Tokyo access pass', icon: 'pass' },
    { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' },
    { id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' },
  ],
  'chapter-06': [
    { id: 'counterMelody', label: 'Daryl’s counter-melody', icon: 'melody' },
    { id: 'returnManifest', label: 'The Forks return manifest', icon: 'sheet' },
    { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' },
    { id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' },
  ],
  outro: [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
};

// A debug start is a self-contained, solvable snapshot—not merely a late-game
// inventory dump.  Keep cross-era items in their actual owner inventory so the
// character-switching chapters can be tested exactly as played.
export const debugChapterStates = {
  'adult-02': {
    flags: ['adultEvidenceLedger'],
  },
  'adult-03': {
    inventories: {
      'daryl-hall': [{ id: 'alteredHandbook', label: 'altered handbook master', icon: 'handbook' }],
    },
    flags: ['adultEvidenceLedger', 'adultEvidenceHandbook'],
  },
  'adult-04': {
    inventory: [{ id: 'routingChip', label: 'Maxima routing chip', icon: 'chip' }],
    inventories: {
      'daryl-hall': [{ id: 'alteredHandbook', label: 'altered handbook master', icon: 'handbook' }],
    },
    flags: [
      'adultEvidenceLedger',
      'adultEvidenceHandbook',
      'adultEvidenceContractor',
      'routingChipRecovered',
    ],
  },
  'adult-05': {
    inventories: {
      'daryl-hall': [{ id: 'alteredHandbook', label: 'altered handbook master', icon: 'handbook' }],
    },
    flags: [
      'adultEvidenceLedger',
      'adultEvidenceHandbook',
      'adultEvidenceContractor',
      'adultEvidenceFleet',
    ],
  },
  'adult-06': {
    inventories: {
      'daryl-hall': [{ id: 'alteredHandbook', label: 'altered handbook master', icon: 'handbook' }],
      trunk: [{ id: 'auditLog', label: '2001 Reardon audit log', icon: 'ledger' }],
    },
    // Chapter 6 normally follows Chapters 1–5, so preserve the four earlier
    // contradiction records when testing forward into Chapter 7.
    flags: [
      'adultEvidenceLedger',
      'adultEvidenceHandbook',
      'adultEvidenceContractor',
      'adultEvidenceFleet',
      'adultEvidenceAudit',
      'trunkPortalOpen',
    ],
  },
  'adult-07': {
    inventories: {
      'john-oates': [{ id: 'filingNumber', label: '1976 filing number', icon: 'code' }],
    },
    flags: [
      'adultEvidenceLedger',
      'adultEvidenceHandbook',
      'adultEvidenceContractor',
      'adultEvidenceFleet',
      'adultEvidenceAudit',
    ],
  },
};
