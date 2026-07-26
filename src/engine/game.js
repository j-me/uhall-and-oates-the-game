import { createRenderer } from './renderer.js';
import { createState } from './state.js';
import { createUI } from '../ui/ui.js';
import { createAudio } from './audio.js';

const inventoryDetails = {
  emptyTapeRoll: 'An empty roll of packing tape. It has done all it can for this company, which is more than Joe Timmins can say about most employees.',
  taffyCoil: 'A warm coil of saltwater taffy. Stretchy, sticky, and mechanically promising in the deeply questionable way of seaside engineering.',
  frenchFries: 'French fries in a striped carton. Their smell is strong enough to negotiate with a gull, a customs officer, or a small nation.',
  privateEyesManifest: 'A shipping manifest marked “PRIVATE EYES ONLY.” It records the Reardons’ New York consignment and Daryl’s coded pallet rhythm.',
  shippingLabel: 'A purple shipping label with three circles, one arrow, and the reassuring disclaimer “NOT FRAGILE, EMOTIONALLY.”',
  toppsPack: 'A sealed 1987 Topps baseball-card pack. Its wax wrapper and notoriously durable stick of gum may be more useful than the cards—unless Baltos finds the one he wants.',
  shreddedInvoice: 'A Reardon invoice reconstructed by Baltos on a wax card wrapper with fossilized gum. Its delivery numbers double as a batting-order sequence.',
  wiffleBall: 'A regulation wiffle ball from Luke’s equipment shed. It is designed to load into the spring launcher built under home plate.',
  londonShippingLabel: 'A Reardon shipping label stamped for London. The routing marks suggest it is hiding a far larger operation.',
  reversibleInk: 'An old record-shop dispatch stamp with a rotating barrel. One side says “ROUTE COPY WITHHELD”; the other says “ROUTE COPY RELEASED.”',
  rejectedShippingForm: 'A rejected “NO CAN DO” shipping form. Faint carbon marks beneath the rejection copy suggest another document is hiding inside it.',
  artistAuthorization: 'An artist-export authorization revealed by Michael McDonald’s keyboard chord, then signed and sealed with impeccable confidence.',
  tokyoAccessPass: 'A temporary Tokyo cargo pass. It will open the recording-truck bay once the shipping service lift is unlocked.',
  deliveryDocket: 'A backstage delivery docket for Reardon’s recording truck. It lists Service Lift C and a shipment of “one dramatic keyboard, no questions.”',
  counterMelody: 'Daryl’s unfinished counter-melody: part rescue clue, part contractual loophole, and probably too dramatic for a box label.',
  returnManifest: 'A Reardon return manifest routing the recording truck’s hidden contract archive back to The Forks, Maine. It contradicts their claim that the Tokyo transfer was permanent.',
};

const debugLoadouts = {
  'chapter-01': [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
  'chapter-02': [{ id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' }],
  'chapter-03': [{ id: 'shreddedInvoice', label: 'reconstructed invoice', icon: 'invoice' }, { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' }],
  'chapter-04': [{ id: 'londonShippingLabel', label: 'London shipping label', icon: 'tag' }, { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' }],
  'chapter-05': [{ id: 'tokyoAccessPass', label: 'Tokyo access pass', icon: 'pass' }, { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' }],
  'chapter-06': [
    { id: 'counterMelody', label: 'Daryl’s counter-melody', icon: 'melody' },
    { id: 'returnManifest', label: 'The Forks return manifest', icon: 'sheet' },
    { id: 'privateEyesManifest', label: 'Private Eyes manifest', icon: 'invoice' },
  ],
  outro: [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
};

const takeQuips = [
  (target) => `Oates tries to take the ${target}. It has apparently signed an exclusive deal with the scenery.`,
  (target) => `The ${target} refuses to move. Joe Timmins will still deduct this from Oates’s paycheck.`,
  (target) => `Oates lifts with his knees. The ${target} counters with tenure.`,
  (target) => `There is no room in the truck for the ${target}, mostly because Daryl reserved it for scarves.`,
  (target) => `The ${target} is not technically nailed down, but it has a very convincing attitude.`,
  (target) => `Taking the ${target} would require paperwork, a dolly, and fewer witnesses.`,
  (target) => `Oates cannot take the ${target}. It is out of touch, out of reach, and possibly unionized.`,
  (target) => `The ${target} stays put. Somewhere, Joe Timmins calls this a productivity issue.`,
];

const useItemQuips = [
  (item, target) => `Oates introduces the ${item} to the ${target}. They agree to remain professional acquaintances.`,
  (item, target) => `The ${item} and the ${target} have no chemistry. Daryl would try adding a saxophone.`,
  (item, target) => `Using the ${item} on the ${target} produces no result, but a surprisingly firm “no can do.”`,
  (item, target) => `The ${target} is immune to the persuasive power of the ${item}.`,
  (item, target) => `Oates tries the ${item}. The ${target} responds by doing exactly what it was already doing.`,
  (item, target) => `That combination belongs on nobody’s list—not even Kiss’s.`,
  (item, target) => `The ${item} cannot solve the ${target}. Joe Timmins immediately invoices Oates for consulting.`,
  (item, target) => `For one hopeful second, the ${item} almost makes sense here. Then the second ends.`,
];

const useHotspotQuips = [
  (target) => `Oates attempts to use the ${target}, but cannot locate its business end.`,
  (target) => `The ${target} appears to require an item, an idea, or a less exhausting profession.`,
  (target) => `Oates gives the ${target} an encouraging tap. It remains professionally indifferent.`,
  (target) => `Using the ${target} bare-handed would void at least three warranties and one friendship.`,
  (target) => `The ${target} is waiting for something specific. Unfortunately, it refuses to say what.`,
];

function randomQuip(quips, ...values) {
  return quips[Math.floor(Math.random() * quips.length)](...values);
}

export function createGame({ root, chapters }) {
  const state = createState();
  const audio = createAudio();
  const ui = createUI(root, { onVerb: selectVerb, onItem: selectItem });
  const renderer = createRenderer(root, { onHotspot: interact });
  let chapter;

  function start(chapterId, sceneId, { showIntro = true } = {}) {
    chapter = chapters[chapterId];
    if (!chapter) throw new Error(`Unknown chapter: ${chapterId}`);
    state.chapterId = chapterId;
    ui.setChapter(chapter.title);
    audio.startChapter(chapterId);
    loadScene(sceneId || chapter.startScene, { showIntro });
  }

  function debugStart(chapterId) {
    if (!chapters[chapterId]) throw new Error(`Unknown debug chapter: ${chapterId}`);
    state.inventory = [...(debugLoadouts[chapterId] || [])];
    state.flags = {};
    state.selectedVerb = 'look';
    state.selectedItem = null;
    start(chapterId, undefined, { showIntro: false });
  }

  function loadScene(sceneId, { showIntro = false } = {}) {
    const scene = chapter.scenes[sceneId];
    if (!scene) throw new Error(`Unknown scene: ${sceneId}`);
    state.sceneId = sceneId;
    state.selectedItem = null;
    ui.clearCompletion();
    renderer.render(scene, state, state.selectedVerb);
    ui.render(state);
    ui.clearSpeech();
    const enterScene = () => {
      ui.message(scene.opening || scene.caption);
      if (scene.completion) {
        const next = scene.next ? () => start(scene.next.chapterId, scene.next.sceneId, { showIntro: !scene.next.skipIntro }) : undefined;
        ui.showCompletion(scene.completion, next, scene.completionTitle);
      }
    };
    if (showIntro) ui.showSceneIntro(chapter.title, scene, enterScene);
    else enterScene();
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
      renderer.setVerb('use');
      ui.render(state);
      ui.message(inventoryDetails[itemId] || `It is ${item.label}. You should probably keep it.`);
      ui.clearSpeech();
      audio.click();
      return;
    }
    state.selectedItem = state.selectedItem === itemId ? null : itemId;
    state.selectedVerb = null;
    renderer.setVerb(state.selectedItem ? 'use' : 'look');
    ui.render(state);
    ui.clearSpeech();
    audio.click();
  }

  function interact(hotspot) {
    const verb = state.selectedVerb || (state.selectedItem ? 'use' : 'look');
    const selectedItem = state.inventory.find((entry) => entry.id === state.selectedItem);
    const action = selectedItem ? hotspot.useWith?.[selectedItem.id] : hotspot.actions?.[verb];

    if (action) {
      if (action.requires?.some((flag) => !state.flags[flag])) {
        respond(action.missing || 'That is not ready yet.', hotspot); audio.error(); return;
      }
      if (action.puzzle === 'crane') {
        ui.clearSpeech();
        audio.crane();
        ui.showCranePuzzle({
          onMove: () => audio.click(),
          onMiss: () => audio.error(),
          onWin: () => execute(action, hotspot),
        });
        return;
      }
      if (action.puzzle === 'wiffle') {
        ui.clearSpeech();
        ui.showWifflePuzzle({
          onAdjust: () => audio.click(),
          onLaunch: () => audio.effect('wiffle'),
          onMiss: () => audio.error(),
          onWin: () => execute(action, hotspot),
        });
        return;
      }
      if (action.puzzle === 'voiceMixer') {
        ui.clearSpeech();
        ui.showVoiceMixerPuzzle({
          onAdjust: () => audio.click(),
          onTest: () => audio.effect('voice'),
          onMiss: () => audio.error(),
          onWin: () => execute(action, hotspot),
        });
        return;
      }
      if (action.puzzle === 'recallClause') {
        ui.clearSpeech();
        ui.showRecallClausePuzzle({
          onAdjust: () => audio.click(),
          onTest: () => audio.effect('contract'),
          onMiss: () => audio.error(),
          onWin: () => execute(action, hotspot),
        });
        return;
      }
      if (action.puzzle === 'storageDirectory') {
        ui.clearSpeech();
        ui.showStorageDirectoryPuzzle({
          onInspect: () => audio.click(),
          onMiss: () => audio.error(),
          onWin: () => execute(action, hotspot),
        });
        return;
      }
      execute(action, hotspot);
      return;
    }
    if (verb === 'take' && hotspot.item) {
      if (state.inventory.some((entry) => entry.id === hotspot.item.id)) { respond(`You already have the ${hotspot.item.label}.`, hotspot); return; }
      state.inventory.push(hotspot.item);
      state.flags[`${hotspot.id}Taken`] = true;
      const response = hotspot.responses.take || `You take the ${hotspot.label}.`;
      ui.render(state);
      renderer.render(chapter.scenes[state.sceneId], state, state.selectedVerb);
      respond(response, hotspot);
      renderer.animateInteraction(hotspot, 'pickup');
      audio.pickup();
      return;
    }
    if (verb === 'use' && selectedItem) {
      const response = randomQuip(useItemQuips, selectedItem.label, hotspot.label);
      respond(response, hotspot);
      audio.error();
      return;
    }
    const fallback = verb === 'take'
      ? randomQuip(takeQuips, hotspot.label)
      : verb === 'use'
        ? randomQuip(useHotspotQuips, hotspot.label)
        : `You can't ${verb} the ${hotspot.label}.`;
    respond(hotspot.responses?.[verb] || fallback, hotspot);
    audio.error();
  }

  function execute(action, hotspot) {
    action.setFlags?.forEach((flag) => { state.flags[flag] = true; });
    action.removeItems?.forEach((id) => { state.inventory = state.inventory.filter((item) => item.id !== id); });
    action.give?.forEach((item) => { if (!state.inventory.some((entry) => entry.id === item.id)) state.inventory.push(item); });
    if (action.clearSelection) { state.selectedItem = null; state.selectedVerb = 'look'; }
    ui.render(state);
    renderer.render(chapter.scenes[state.sceneId], state, state.selectedVerb);
    respond(action.message, hotspot);
    renderer.animateInteraction(hotspot, action.effect || (action.pickup ? 'pickup' : 'success'));
    if (action.sound && audio[action.sound]) audio[action.sound]();
    if (action.success && action.effect !== action.sound) audio.effect(action.effect);
    else if (action.pickup) audio.pickup();
    else if (!action.sound) audio.click();
    const completeAction = () => {
      if (!action.complete) return;
      const next = action.next ? () => start(action.next.chapterId, action.next.sceneId, { showIntro: !action.next.skipIntro }) : undefined;
      ui.showCompletion(action.complete, next, action.completionTitle || (action.outro ? 'RESCUE COMPLETE' : undefined));
    };
    if (action.video) {
      audio.stopBackground();
      ui.showVideo(action.video, () => {
        if (state.chapterId) audio.startChapter(state.chapterId);
        completeAction();
      });
    } else {
      completeAction();
    }
  }

  return {
    start,
    debugStart,
    loadScene,
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
