const savePrefix = 'uhall-oates-save:';

function storageAvailable() {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function createSaveStore() {
  function save(campaignId, state) {
    if (!storageAvailable() || !campaignId) return;
    const snapshot = {
      ...state,
      inventory: undefined,
      inventories: Object.fromEntries(
        Object.entries(state.inventories || {}).map(([owner, items]) => [owner, items.map((item) => ({ ...item }))]),
      ),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${savePrefix}${campaignId}`, JSON.stringify(snapshot));
  }

  function load(campaignId) {
    if (!storageAvailable()) return null;
    try {
      const snapshot = JSON.parse(localStorage.getItem(`${savePrefix}${campaignId}`));
      if (!snapshot || snapshot.version !== 2 || snapshot.campaignId !== campaignId) return null;
      snapshot.inventories ||= {};
      snapshot.inventories[snapshot.activeCharacterId] ||= [];
      snapshot.inventory = snapshot.inventories[snapshot.activeCharacterId];
      return snapshot;
    } catch {
      return null;
    }
  }

  function clear(campaignId) {
    if (storageAvailable()) localStorage.removeItem(`${savePrefix}${campaignId}`);
  }

  return { save, load, clear, has: (campaignId) => Boolean(load(campaignId)) };
}
