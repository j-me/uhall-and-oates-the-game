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
  'final-01': [{ id: 'label2008', label: 'shipping label dated 2008', icon: 'final-label-2008' }],
  'final-02': [{ id: 'rehearsalReel', label: 'restored rehearsal reel', icon: 'final-restored-reel' }],
  'final-03': [{ id: 'setListFragment', label: 'shared set-list fragment', icon: 'final-set-list' }],
  'final-04': [{ id: 'fullRehearsalMix', label: 'full rehearsal mix', icon: 'final-full-mix' }],
  'final-05': [
    { id: 'cleanLiveMix', label: 'unsponsored live rehearsal mix', icon: 'final-clean-live-mix' },
    { id: 'broadcastRouteCard', label: 'Old Orchard broadcast route card', icon: 'final-route-card' },
  ],
  'final-06': [{ id: 'sharedArrangement', label: 'John and Daryl’s shared arrangement', icon: 'final-shared-arrangement' }],
  'final-outro': [],
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
