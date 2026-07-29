export function createState(campaign = {}) {
  const activeCharacterId = campaign.initialCharacterId || 'john-oates';
  const initialInventory = (campaign.initialInventory || [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }])
    .map((item) => ({ ...item }));
  const inventories = { [activeCharacterId]: initialInventory, trunk: [] };
  return {
    version: 2,
    campaignId: campaign.id || 'original',
    chapterId: null,
    sceneId: null,
    activeCharacterId,
    actorLocations: {},
    selectedVerb: 'look',
    selectedItem: null,
    inventory: inventories[activeCharacterId],
    inventories,
    flags: {}, // Narrative/puzzle variables belong here, e.g. { metCaretaker: true }.
    visitedScenes: [],
  };
}
