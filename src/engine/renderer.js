import {
  getCharacterIdForHotspot,
  getCharacterSprite,
  getReactionAssets,
  getReactionSprite,
} from '../game-data/characters.js';

export function createRenderer(root, { onHotspot }) {
  const art = root.querySelector('#scene-art');
  const layer = root.querySelector('#hotspots');
  const caption = root.querySelector('#scene-caption');
  let buttons = [];
  let reactionTimer;
  const npcReactionTimers = new Map();

  getReactionAssets().forEach((src) => {
    const image = new Image();
    image.src = src;
  });

  function render(scene, state, verb) {
    art.className = `scene-art ${scene.artClass || ''}`;
    art.replaceChildren();
    const stateBackground = scene.backgroundStates?.find((entry) => entry.when.every((flag) => state.flags[flag]));
    if (scene.background) {
      const background = document.createElement('img');
      background.className = 'scene-background'; background.src = stateBackground?.src || scene.background; background.alt = '';
      art.append(background);
    }
    scene.decorations?.filter((decoration) =>
      (!decoration.visibleWhen || decoration.visibleWhen.every((flag) => state.flags[flag]))
      && (!decoration.hiddenWhen || !decoration.hiddenWhen.some((flag) => state.flags[flag]))
    ).forEach((decoration) => {
      const element = document.createElement(decoration.src ? 'img' : 'span');
      element.className = `scene-decoration ${decoration.className || ''}`;
      if (decoration.src) { element.src = decoration.src; element.alt = decoration.alt || ''; }
      else { element.textContent = decoration.text; element.setAttribute('aria-hidden', 'true'); }
      Object.assign(element.style, Object.fromEntries(Object.entries(decoration.bounds).map(([key, value]) => [key, `${value}%`])));
      art.append(element);
    });
    scene.characters?.forEach((character) => {
      const image = document.createElement('img');
      image.className = `scene-character ${character.className || ''}`;
      image.src = character.src; image.alt = character.alt;
      if (character.id) {
        image.dataset.character = character.id;
        image.dataset.defaultSrc = character.src;
      }
      Object.assign(image.style, Object.fromEntries(Object.entries(character.bounds).map(([key, value]) => [key, `${value}%`])));
      art.append(image);
    });
    caption.textContent = scene.caption || scene.name;
    layer.replaceChildren();
    buttons = scene.hotspots.filter((hotspot) =>
      (!hotspot.visibleWhen || hotspot.visibleWhen.every((flag) => state.flags[flag]))
      && (!hotspot.hiddenWhen || !hotspot.hiddenWhen.some((flag) => state.flags[flag]))
    ).map((hotspot) => {
      if (hotspot.hint) {
        const hint = document.createElement('span');
        hint.className = 'hotspot-hint'; hint.textContent = hotspot.hint;
        hint.setAttribute('aria-hidden', 'true');
        hint.style.left = `${hotspot.bounds.left + hotspot.bounds.width / 2}%`;
        hint.style.top = `${Math.max(3, hotspot.bounds.top - 2)}%`;
        layer.append(hint);
      }
      const button = document.createElement('button');
      button.className = 'hotspot';
      button.type = 'button';
      button.dataset.id = hotspot.id;
      button.dataset.label = hotspot.label;
      button.setAttribute('aria-label', `${verb || 'look'} ${hotspot.label}`);
      Object.assign(button.style, Object.fromEntries(Object.entries(hotspot.bounds).map(([key, value]) => [key, `${value}%`])));
      button.style.zIndex = hotspot.priority || 1;
      button.addEventListener('click', () => onHotspot(hotspot));
      layer.append(button);
      return button;
    });
  }

  function setVerb(verb = 'look') {
    buttons.forEach((button) => button.setAttribute('aria-label', `${verb} ${button.dataset.id.replaceAll('-', ' ')}`));
  }

  function removeHotspot(id) {
    const button = buttons.find((entry) => entry.dataset.id === id);
    button?.remove();
  }

  function animateInteraction(hotspot, effect = 'success') {
    const marker = document.createElement('div');
    marker.className = `interaction-effect interaction-effect--${effect}`;
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = ({
      repair: '⚙', fries: '🍟', gull: '🕊', manifest: '▧', pickup: '✦', success: '✦', tape: '∅',
      unit: '16-B', certified: 'CERTIFIED', auction: 'SOLD!', cards: '▤', scoreboard: '1·6·B', wiffle: '●', customs: 'RELEASED',
      route: '✈', lift: '↕', capsules: '↻', voice: '♫', broadcast: ')))', contract: '▧',
    })[effect] || '✦';
    marker.style.left = `${hotspot.bounds.left + hotspot.bounds.width / 2}%`;
    marker.style.top = `${hotspot.bounds.top + hotspot.bounds.height / 2}%`;
    layer.append(marker);
    window.setTimeout(() => marker.remove(), 850);
  }

  function reactJohn(expression = 'startled', duration = 1050) {
    const john = art.querySelector('[data-character="john-oates"]');
    const reactionSrc = getCharacterSprite('john-oates', expression);
    if (!john || !reactionSrc) return;
    window.clearTimeout(reactionTimer);
    john.src = reactionSrc;
    john.classList.remove('john-reaction--determined', 'john-reaction--frustrated', 'john-reaction--relieved', 'john-reaction--startled');
    // Restart the animation even when the same reaction fires twice.
    void john.offsetWidth;
    john.classList.add(`john-reaction--${expression}`);
    reactionTimer = window.setTimeout(() => {
      if (!john.isConnected) return;
      john.src = john.dataset.defaultSrc;
      john.classList.remove(`john-reaction--${expression}`);
    }, duration);
  }

  function reactCharacter(hotspotId, duration = 1250) {
    const characterId = getCharacterIdForHotspot(hotspotId);
    const reactionSrc = getReactionSprite(characterId);
    const character = characterId && art.querySelector(`[data-character="${characterId}"]`);
    if (!character || !reactionSrc) return;
    window.clearTimeout(npcReactionTimers.get(characterId));
    character.src = reactionSrc;
    character.classList.remove('npc-reaction');
    void character.offsetWidth;
    character.classList.add('npc-reaction');
    npcReactionTimers.set(characterId, window.setTimeout(() => {
      if (!character.isConnected) return;
      character.src = character.dataset.defaultSrc;
      character.classList.remove('npc-reaction');
      npcReactionTimers.delete(characterId);
    }, duration));
  }

  return { render, setVerb, removeHotspot, animateInteraction, reactJohn, reactCharacter };
}
