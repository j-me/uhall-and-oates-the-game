const SAVE_PREFIX = 'uhall-oates-save:';
const PROGRESS_KEY = 'uhall-oates-progress:v1';
const SAVE_VERSION = 2;
const PROGRESS_VERSION = 1;

const emptyProgress = () => ({ version: PROGRESS_VERSION, completedCampaigns: [] });

function storageAvailable() {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
}

function readJson(key) {
  if (!storageAvailable()) return null;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  if (!storageAvailable()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeKey(key) {
  if (!storageAvailable()) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function cloneInventories(inventories = {}) {
  return Object.fromEntries(
    Object.entries(inventories)
      .filter(([, items]) => Array.isArray(items))
      .map(([owner, items]) => [owner, items.map((item) => ({ ...item }))]),
  );
}

export function createSaveStore() {
  function loadProgress() {
    const progress = readJson(PROGRESS_KEY);
    if (progress?.version !== PROGRESS_VERSION || !Array.isArray(progress.completedCampaigns)) return emptyProgress();
    return {
      version: PROGRESS_VERSION,
      completedCampaigns: [...new Set(progress.completedCampaigns.filter((id) => typeof id === 'string' && id))],
    };
  }

  function markComplete(campaignId) {
    if (!campaignId) return false;
    const progress = loadProgress();
    if (progress.completedCampaigns.includes(campaignId)) return true;
    progress.completedCampaigns.push(campaignId);
    return writeJson(PROGRESS_KEY, progress);
  }

  function save(campaignId, state) {
    if (!campaignId || !state) return false;
    const snapshot = {
      ...state,
      version: SAVE_VERSION,
      campaignId,
      selectedVerb: 'look',
      selectedItem: null,
      inventory: undefined,
      debugSession: undefined,
      inventories: cloneInventories(state.inventories),
      savedAt: new Date().toISOString(),
    };
    return writeJson(`${SAVE_PREFIX}${campaignId}`, snapshot);
  }

  function load(campaignId) {
    if (!campaignId) return null;
    const snapshot = readJson(`${SAVE_PREFIX}${campaignId}`);
    if (!snapshot || snapshot.version !== SAVE_VERSION || snapshot.campaignId !== campaignId) return null;
    if (!snapshot.chapterId || !snapshot.sceneId || !snapshot.activeCharacterId) return null;
    snapshot.inventories = cloneInventories(snapshot.inventories);
    snapshot.inventories[snapshot.activeCharacterId] ||= [];
    snapshot.inventory = snapshot.inventories[snapshot.activeCharacterId];
    snapshot.flags = snapshot.flags && typeof snapshot.flags === 'object' ? snapshot.flags : {};
    snapshot.actorLocations = snapshot.actorLocations && typeof snapshot.actorLocations === 'object' ? snapshot.actorLocations : {};
    snapshot.visitedScenes = Array.isArray(snapshot.visitedScenes) ? snapshot.visitedScenes : [];
    snapshot.selectedVerb = 'look';
    snapshot.selectedItem = null;
    delete snapshot.debugSession;
    return snapshot;
  }

  function reconcile(campaigns) {
    const entries = Object.values(campaigns || {});
    const snapshots = new Map(entries.map((campaign) => [campaign.id, load(campaign.id)]));
    const completeRequirementChain = (campaign) => {
      const visited = new Set();
      let requirement = campaign?.requiresCampaign;
      while (requirement && !visited.has(requirement)) {
        visited.add(requirement);
        markComplete(requirement);
        requirement = campaigns[requirement]?.requiresCampaign;
      }
    };
    entries.forEach((campaign) => {
      const snapshot = snapshots.get(campaign.id);
      if (!snapshot) return;
      if (campaign.completionFlag && snapshot.flags?.[campaign.completionFlag]) {
        markComplete(campaign.id);
        removeKey(`${SAVE_PREFIX}${campaign.id}`);
      }
      completeRequirementChain(campaign);
    });
    return loadProgress();
  }

  return {
    save,
    load,
    clear: (campaignId) => removeKey(`${SAVE_PREFIX}${campaignId}`),
    has: (campaignId) => Boolean(load(campaignId)),
    markComplete,
    isComplete: (campaignId) => loadProgress().completedCampaigns.includes(campaignId),
    reconcile,
  };
}
