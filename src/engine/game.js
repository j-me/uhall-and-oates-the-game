import { createRenderer } from './renderer.js';
import { createState } from './state.js';
import { createUI } from '../ui/ui.js';
import { createAudio } from './audio.js';
import { createSaveStore } from './save.js';
import { itemDescriptions } from '../game-data/items/item-descriptions.js';
import { debugChapterStates, debugLoadouts } from '../game-data/debug/debug-loadouts.js';

const takeQuips = [
  (actor, target) => `${actor} tries to take the ${target}. It has apparently signed an exclusive deal with the scenery.`,
  (actor, target) => `The ${target} refuses to move. Joe Timmins will still find a way to deduct this from ${actor}’s paycheck.`,
  (actor, target) => `${actor} lifts with proper form. The ${target} counters with tenure.`,
  (actor, target) => `There is no room in the truck for the ${target}; accounting has reserved the space for scarves.`,
  (actor, target) => `The ${target} is not technically nailed down, but it has a very convincing attitude toward ${actor}.`,
  (actor, target) => `Taking the ${target} would require paperwork, a dolly, and fewer witnesses than ${actor} currently has.`,
  (actor, target) => `${actor} cannot take the ${target}. It is out of touch, out of reach, and possibly unionized.`,
  (actor, target) => `The ${target} stays put. Somewhere, Joe Timmins calls this ${actor}’s productivity issue.`,
];

const useItemQuips = [
  (actor, item, target) => `${actor} introduces the ${item} to the ${target}. They agree to remain professional acquaintances.`,
  (actor, item, target) => `The ${item} and the ${target} have no chemistry. ${actor} considers adding a saxophone and decides the situation is already dangerous enough.`,
  (actor, item, target) => `${actor} uses the ${item} on the ${target} and receives a surprisingly firm “no can do.”`,
  (actor, item, target) => `The ${target} is immune to ${actor} and the persuasive power of the ${item}.`,
  (actor, item, target) => `${actor} tries the ${item}. The ${target} responds by doing exactly what it was already doing.`,
  (actor, item, target) => `That combination belongs on nobody’s list—not even Kiss’s. ${actor} quietly withdraws it.`,
  (actor, item, target) => `The ${item} cannot solve the ${target}. Joe Timmins immediately invoices ${actor} for consulting.`,
  (actor, item, target) => `For one hopeful second, the ${item} almost makes sense here. Then ${actor}’s second ends.`,
];

const useHotspotQuips = [
  (actor, target) => `${actor} attempts to use the ${target}, but cannot locate its business end.`,
  (actor, target) => `The ${target} appears to require an item, an idea, or a less exhausting profession than ${actor}’s.`,
  (actor, target) => `${actor} gives the ${target} an encouraging tap. It remains professionally indifferent.`,
  (actor, target) => `${actor} using the ${target} bare-handed would void three warranties and one friendship.`,
  (actor, target) => `The ${target} is waiting for something specific. It refuses to tell ${actor} what.`,
];

function randomQuip(quips, ...values) {
  return quips[Math.floor(Math.random() * quips.length)](...values);
}

function actorName(characterId) {
  return ({
    'john-oates': 'John',
    'daryl-hall': 'Daryl',
    'michael-mcdonald': 'Michael',
  })[characterId] || 'The mover';
}

export function createGame({ root, campaigns, chapters, defaultCampaignId = 'original', onReturnHome, onChapterStart, onCampaignChange }) {
  const availableCampaigns = campaigns || {
    [defaultCampaignId]: {
      id: defaultCampaignId,
      chapters,
      initialCharacterId: 'john-oates',
      initialInventory: [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
    },
  };
  let campaign = availableCampaigns[defaultCampaignId] || Object.values(availableCampaigns)[0];
  let campaignChapters = campaign.chapters;
  const state = createState(campaign);
  const saves = createSaveStore();
  saves.reconcile(availableCampaigns);
  const audio = createAudio();
  const ui = createUI(root, {
    onVerb: selectVerb,
    onItem: selectItem,
    onCharacter: switchCharacter,
    onTrunkItem: retrieveFromTrunk,
    onTrunkDeposit: depositIntoTrunk,
  });
  const renderer = createRenderer(root, { onHotspot: interact });
  let chapter;
  let failedActions = 0;

  // Preserve the state object reference used by the UI, while removing stale
  // flags, cross-era inventories and debug markers from a previous run.
  function resetState(nextCampaign) {
    Object.keys(state).forEach((key) => { delete state[key]; });
    Object.assign(state, createState(nextCampaign));
  }

  function resetFailures() {
    failedActions = 0;
  }

  function persistCheckpoint() {
    if (state.debugSession || !state.chapterId || !state.sceneId) return false;
    if (campaign.completionFlag && state.flags[campaign.completionFlag]) saves.markComplete(campaign.id);
    return saves.save(campaign.id, state);
  }

  function returnHome() {
    if (campaign.completionFlag && state.flags[campaign.completionFlag]) saves.clear(campaign.id);
    resetState(campaign);
    chapter = undefined;
    resetFailures();
    audio.stopBackground();
    ui.hideSceneIntro();
    ui.clearCompletion();
    ui.clearSpeech();
    ui.setChapter('');
    ui.message('Welcome, future nuisance.');
    ui.render(state);
    onReturnHome?.();
  }

  function registerFailure() {
    failedActions += 1;
    if (failedActions < 3) return;
    failedActions = 0;
    renderer.reactJohn('frustrated');
  }

  function start(chapterId, sceneId, { showIntro = true } = {}) {
    chapter = campaignChapters[chapterId];
    if (!chapter) throw new Error(`Unknown chapter: ${chapterId}`);
    onChapterStart?.(chapterId, campaign);
    state.chapterId = chapterId;
    state.availableCharacters = chapter.playableCharacters || [{
      id: chapter.playerId || campaign.initialCharacterId || 'john-oates',
      label: chapter.playerLabel || 'JOHN',
      year: chapter.year || '',
    }];
    resetFailures();
    ui.setChapter(chapter.title);
    audio.startChapter(chapterId);
    loadScene(sceneId || chapter.startScene, { showIntro });
  }

  function debugStart(chapterId) {
    const targetCampaign = Object.values(availableCampaigns).find((entry) => entry.chapters[chapterId]);
    if (!targetCampaign) throw new Error(`Unknown debug chapter: ${chapterId}`);
    if (targetCampaign.id !== campaign.id) selectCampaign(targetCampaign.id);
    else resetState(targetCampaign);
    state.debugSession = true;
    const setup = debugChapterStates[chapterId] || {};
    replaceInventory([...(setup.inventory || debugLoadouts[chapterId] || [])]);
    Object.entries(setup.inventories || {}).forEach(([owner, items]) => {
      state.inventories[owner] = items.map((item) => ({ ...item }));
    });
    setup.flags?.forEach((flag) => { state.flags[flag] = true; });
    state.selectedVerb = 'look';
    state.selectedItem = null;
    start(chapterId, undefined, { showIntro: false });
  }

  function loadScene(sceneId, { showIntro = false } = {}) {
    const scene = chapter.scenes[sceneId];
    if (!scene) throw new Error(`Unknown scene: ${sceneId}`);
    state.sceneId = sceneId;
    if (scene.playerId) activateCharacter(scene.playerId);
    state.actorLocations[state.activeCharacterId] = sceneId;
    if (!state.visitedScenes.includes(sceneId)) state.visitedScenes.push(sceneId);
    state.selectedItem = null;
    ui.clearCompletion();
    renderer.render(scene, state, state.selectedVerb);
    ui.render(state);
    ui.clearSpeech();
    const enterScene = () => {
      ui.message(scene.opening || scene.caption);
      if (scene.completion) {
        const next = scene.next ? () => start(scene.next.chapterId, scene.next.sceneId, { showIntro: !scene.next.skipIntro }) : undefined;
        ui.showCompletion(scene.completion, next, scene.completionTitle, next ? undefined : returnHome);
      }
    };
    if (showIntro) ui.showSceneIntro(chapter.title, scene, enterScene);
    else enterScene();
    persistCheckpoint();
  }

  function respond(text, hotspot) {
    ui.message(text);
    if (hotspot) ui.speak(text, hotspot);
  }

  function selectVerb(verb) {
    state.selectedVerb = verb;
    state.selectedItem = null;
    renderer.setVerb(verb);
    ui.render(state);
    ui.clearSpeech();
    audio.click();
  }

  function selectItem(itemId) {
    const item = state.inventory.find((entry) => entry.id === itemId);
    if (!item) return;
    if (state.selectedVerb === 'look' && !state.selectedItem) {
      state.selectedVerb = null;
      state.selectedItem = itemId;
      renderer.setVerb('use', 'inventory');
      ui.render(state);
      ui.message(itemDescriptions[itemId] || `It is ${item.label}. You should probably keep it.`);
      ui.clearSpeech();
      audio.click();
      return;
    }
    state.selectedItem = state.selectedItem === itemId ? null : itemId;
    state.selectedVerb = null;
    renderer.setVerb(state.selectedItem ? 'use' : 'look', state.selectedItem ? 'inventory' : 'look');
    ui.render(state);
    ui.clearSpeech();
    audio.click();
  }

  function switchCharacter(characterId) {
    const allowed = state.availableCharacters?.some((character) => character.id === characterId);
    if (!allowed || characterId === state.activeCharacterId) return;
    const destination = state.actorLocations[characterId] || chapter.characterScenes?.[characterId];
    if (!destination) return;
    activateCharacter(characterId);
    loadScene(destination);
  }

  function retrieveFromTrunk(itemId) {
    if (!state.flags.trunkPortalOpen) {
      ui.message('The Maxima trunk route is not synchronized in this scene.');
      registerFailure();
      return;
    }
    const trunk = state.inventories.trunk || [];
    const item = trunk.find((entry) => entry.id === itemId);
    if (!item) return;
    state.inventories.trunk = trunk.filter((entry) => entry.id !== itemId);
    if (!state.inventory.some((entry) => entry.id === itemId)) state.inventory.push(item);
    state.selectedItem = null;
    ui.render(state);
    ui.message(`${state.activeCharacterId === 'john-oates' ? 'John' : state.activeCharacterId === 'daryl-hall' ? 'Daryl' : 'Michael'} retrieves the ${item.label} from the Maxima’s temporal trunk.`);
    audio.pickup();
    persistCheckpoint();
  }

  function depositIntoTrunk(itemId) {
    if (!state.flags.trunkPortalOpen) {
      ui.message('The Maxima trunk route is not synchronized in this scene.');
      registerFailure();
      return;
    }
    const item = state.inventory.find((entry) => entry.id === itemId);
    if (!item) return;
    state.inventory = state.inventory.filter((entry) => entry.id !== itemId);
    state.inventories[state.activeCharacterId] = state.inventory;
    state.inventories.trunk ||= [];
    if (!state.inventories.trunk.some((entry) => entry.id === itemId)) {
      state.inventories.trunk.push(item);
    }
    state.selectedItem = null;
    state.selectedVerb = 'look';
    renderer.setVerb('look');
    ui.render(state);
    ui.clearSpeech();
    ui.message(`${actorName(state.activeCharacterId)} returns the ${item.label} to the Maxima’s temporal trunk.`);
    audio.pickup();
    persistCheckpoint();
  }

  function interact(hotspot) {
    const verb = state.selectedVerb || (state.selectedItem ? 'use' : 'look');
    const selectedItem = state.inventory.find((entry) => entry.id === state.selectedItem);
    const action = selectedItem ? hotspot.useWith?.[selectedItem.id] : hotspot.actions?.[verb];

    if (!selectedItem && hotspot.exit && ['look', 'use'].includes(verb)) {
      if (hotspot.exit.requires?.some((flag) => !state.flags[flag])) {
        respond(hotspot.exit.missing || 'That route is not available yet.', hotspot);
        registerFailure();
        return;
      }
      loadScene(hotspot.exit.sceneId);
      return;
    }

    if (action) {
      if (action.requires?.some((flag) => !state.flags[flag])) {
        const missingFlags = action.requires.filter((flag) => !state.flags[flag]);
        const missingMessage = typeof action.missing === 'function'
          ? action.missing(missingFlags, state)
          : action.missing;
        respond(missingMessage || 'That is not ready yet.', hotspot); registerFailure(); audio.error(); return;
      }
      if (action.puzzle) {
        ui.clearSpeech();
        resetFailures();
        renderer.reactJohn('determined');
        if (action.puzzle === 'crane') audio.crane();
        ui.showPuzzle(action.puzzle, {
          ...(action.puzzleData || {}),
          onMove: () => audio.click(),
          onAdjust: () => audio.click(),
          onInspect: () => audio.click(),
          onHit: () => audio.click(),
          onLaunch: () => audio.effect('wiffle'),
          onTest: () => audio.effect(action.effect || 'success'),
          onMiss: () => { registerFailure(); audio.error(); },
          onWin: () => execute(action, hotspot),
        });
        return;
      }
      execute(action, hotspot);
      return;
    }
    if (verb === 'take' && hotspot.item) {
      if (state.inventory.some((entry) => entry.id === hotspot.item.id)) {
        respond(`You already have the ${hotspot.item.label}.`, hotspot);
        registerFailure();
        return;
      }
      state.inventory.push(hotspot.item);
      state.flags[`${hotspot.id}Taken`] = true;
      const response = hotspot.responses.take || `You take the ${hotspot.label}.`;
      ui.render(state);
      renderer.render(chapter.scenes[state.sceneId], state, state.selectedVerb);
      respond(response, hotspot);
      renderer.animatePickup(hotspot, hotspot.item);
      resetFailures();
      renderer.reactJohn('relieved');
      audio.pickup();
      persistCheckpoint();
      return;
    }
    if (verb === 'use' && selectedItem) {
      const response = randomQuip(useItemQuips, actorName(state.activeCharacterId), selectedItem.label, hotspot.label);
      respond(response, hotspot);
      registerFailure();
      audio.error();
      return;
    }
    if (hotspot.responses?.[verb]) {
      respond(hotspot.responses[verb], hotspot);
      resetFailures();
      if (verb === 'talk') renderer.reactCharacter(hotspot.id);
      return;
    }
    const fallback = verb === 'take'
      ? randomQuip(takeQuips, actorName(state.activeCharacterId), hotspot.label)
      : verb === 'use'
        ? randomQuip(useHotspotQuips, actorName(state.activeCharacterId), hotspot.label)
        : `You can't ${verb} the ${hotspot.label}.`;
    respond(fallback, hotspot);
    registerFailure();
    audio.error();
  }

  function execute(action, hotspot) {
    const failedAction = action.sound === 'error';
    if (failedAction) registerFailure();
    else resetFailures();
    action.setFlags?.forEach((flag) => { state.flags[flag] = true; });
    action.removeItems?.forEach((id) => replaceInventory(state.inventory.filter((item) => item.id !== id)));
    action.give?.forEach((item) => { if (!state.inventory.some((entry) => entry.id === item.id)) state.inventory.push(item); });
    Object.entries(action.giveTo || {}).forEach(([owner, items]) => {
      state.inventories[owner] ||= [];
      items.forEach((item) => {
        if (!state.inventories[owner].some((entry) => entry.id === item.id)) state.inventories[owner].push(item);
      });
    });
    if (action.clearSelection) { state.selectedItem = null; state.selectedVerb = 'look'; }
    ui.render(state);
    renderer.render(chapter.scenes[state.sceneId], state, state.selectedVerb);
    respond(action.message, hotspot);
    renderer.animateInteraction(hotspot, action.effect || (action.pickup ? 'pickup' : 'success'));
    action.give?.forEach((item, index) => renderer.animatePickup(hotspot, item, index * 120));
    if (!failedAction) renderer.reactJohn(action.success ? 'relieved' : 'startled');
    renderer.reactCharacter(hotspot.id);
    if (action.sound && audio[action.sound]) audio[action.sound]();
    if (action.success && action.effect !== action.sound) audio.effect(action.effect);
    else if (action.pickup) audio.pickup();
    else if (!action.sound) audio.click();
    const completeAction = () => {
      if (!action.complete) return;
      const next = action.next ? () => start(action.next.chapterId, action.next.sceneId, { showIntro: !action.next.skipIntro }) : undefined;
      ui.showCompletion(
        action.complete,
        next,
        action.completionTitle || (action.outro ? 'RESCUE COMPLETE' : undefined),
        next ? undefined : returnHome,
      );
    };
    if (action.video) {
      audio.stopBackground();
      ui.showVideo(action.video, () => {
        if (state.chapterId) audio.startChapter(state.chapterId);
        completeAction();
      });
    } else if (action.performance) {
      audio.stopBackground();
      ui.showPerformance({ ...action.performance, soundEnabled: audio.enabled }, completeAction);
    } else {
      completeAction();
    }
    if (action.goToScene) loadScene(action.goToScene);
    else persistCheckpoint();
  }

  function replaceInventory(items) {
    state.inventory = items;
    state.inventories[state.activeCharacterId] = items;
  }

  function activateCharacter(characterId) {
    state.activeCharacterId = characterId;
    state.inventories[characterId] ||= [];
    state.inventory = state.inventories[characterId];
    state.selectedItem = null;
    state.selectedVerb = 'look';
  }

  function selectCampaign(campaignId) {
    const selected = availableCampaigns[campaignId];
    if (!selected) throw new Error(`Unknown campaign: ${campaignId}`);
    campaign = selected;
    campaignChapters = selected.chapters;
    chapter = undefined;
    resetState(selected);
    onCampaignChange?.(selected);
    ui.setChapter('');
    ui.clearCompletion();
    ui.clearSpeech();
    ui.render(state);
    return selected;
  }

  function continueCampaign(campaignId) {
    const selected = availableCampaigns[campaignId];
    if (!selected) return false;
    const snapshot = saves.load(campaignId);
    const savedChapter = snapshot && selected.chapters[snapshot.chapterId];
    if (!savedChapter?.scenes[snapshot.sceneId]) return false;
    selectCampaign(campaignId);
    Object.assign(state, snapshot);
    campaignChapters = selected.chapters;
    chapter = savedChapter;
    state.inventory = state.inventories[state.activeCharacterId] || [];
    ui.setChapter(chapter.title);
    audio.startChapter(state.chapterId);
    loadScene(state.sceneId, { showIntro: false });
    return true;
  }

  function isCampaignComplete(campaignId) {
    return saves.isComplete(campaignId);
  }

  return {
    start,
    selectCampaign,
    continueCampaign,
    clearSave: (campaignId = campaign.id) => saves.clear(campaignId),
    hasSave: (campaignId = campaign.id) => saves.has(campaignId),
    isCampaignComplete,
    activateCharacter,
    debugStart,
    loadScene,
    returnHome,
    playIntroSound() { audio.intro(); },
    configureMusic(settings) { audio.configureMusic(settings); },
    setSoundEnabled(value) {
      const enabled = audio.setEnabled(Boolean(value));
      if (enabled && state.chapterId) audio.startChapter(state.chapterId);
      return enabled;
    },
    toggleSound() {
      const enabled = audio.setEnabled(!audio.enabled);
      if (enabled && state.chapterId) audio.startChapter(state.chapterId);
      return enabled;
    },
    get state() { return state; },
  };
}
