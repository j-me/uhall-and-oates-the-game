export function createState() {
  return {
    chapterId: null,
    sceneId: null,
    selectedVerb: 'look',
    selectedItem: null,
    inventory: [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
    flags: {}, // Narrative/puzzle variables belong here, e.g. { metCaretaker: true }.
  };
}
