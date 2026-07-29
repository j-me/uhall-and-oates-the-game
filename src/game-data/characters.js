const characterArt = 'assets/art/characters';
const sprite = (name) => `${characterArt}/${name}-v1.png`;

/**
 * Canonical character registry.
 *
 * Scenes choose a character and pose; the renderer reads reaction and hotspot
 * metadata from the same record. Adding a pose or changing an asset path should
 * only require an edit here.
 */
export const characters = {
  'john-oates': {
    name: 'John Oates',
    className: 'john-idle',
    sprites: {
      default: sprite('john-oates-sprite'),
      worried: sprite('john-oates-worried'),
      determined: sprite('john-oates-determined'),
      relieved: sprite('john-oates-relieved'),
      startled: sprite('john-oates-startled'),
      frustrated: sprite('john-oates-frustrated'),
    },
    reactionPoses: ['determined', 'relieved', 'startled', 'frustrated'],
    hotspots: ['john-maxima'],
  },
  'daryl-hall': {
    name: 'Daryl Hall',
    className: 'npc-idle',
    sprites: { default: sprite('daryl-hall-sprite'), relieved: sprite('daryl-hall-relieved') },
    reactionPose: 'relieved',
    hotspots: ['daryl-outro', 'daryl-maxima', 'daryl-era-phone', 'daryl-adult-outro'],
  },
  baltos: {
    name: 'Baltos',
    className: 'npc-idle',
    sprites: { default: sprite('baltos-sprite'), breakthrough: sprite('baltos-breakthrough') },
    reactionPose: 'breakthrough',
    hotspots: ['baltos', 'baltos-auction'],
  },
  'huey-lewis': {
    name: 'Huey Lewis',
    className: 'npc-idle',
    sprites: { default: sprite('huey-lewis-sprite'), alarmed: sprite('huey-lewis-alarmed') },
    reactionPose: 'alarmed',
    hotspots: ['huey', 'huey-auction'],
  },
  'michael-mcdonald': {
    name: 'Michael McDonald',
    className: 'npc-idle',
    sprites: { default: sprite('michael-mcdonald-sprite'), delighted: sprite('michael-mcdonald-delighted') },
    reactionPose: 'delighted',
    hotspots: ['michael-mcdonald', 'future-conference-phone'],
  },
  jamo: {
    name: 'Jamo',
    className: 'npc-idle',
    sprites: { default: sprite('jamo-sprite'), impressed: sprite('jamo-impressed') },
    reactionPose: 'impressed',
    hotspots: ['jamo', 'jamo-auction'],
  },
  'luke-jacuzzi': {
    name: 'Luke Jacuzzi',
    className: 'npc-idle',
    sprites: { default: sprite('luke-jacuzzi-sprite'), excited: sprite('luke-jacuzzi-excited') },
    reactionPose: 'excited',
    hotspots: ['luke'],
  },
  'jesse-reardon': {
    name: 'Jesse Reardon',
    className: 'npc-idle',
    sprites: { default: sprite('jesse-reardon-sprite'), furious: sprite('jesse-reardon-furious') },
    reactionPose: 'furious',
    hotspots: ['jesse-outro', 'jesse-training'],
  },
  'joe-reardon': {
    name: 'Joe Reardon',
    className: 'npc-idle',
    sprites: { default: sprite('joe-reardon-sprite'), rattled: sprite('joe-reardon-rattled') },
    reactionPose: 'rattled',
    hotspots: ['joe-outro', 'joe-training'],
  },
  'joe-timmins': {
    name: 'Joe Timmins',
    className: 'npc-idle',
    sprites: { default: sprite('joe-timmins-sprite'), smug: sprite('joe-timmins-smug') },
    reactionPose: 'smug',
    hotspots: ['joe-timmins-maxima', 'joe-recruiting', 'joe-conference-call', 'timmins-paradox', 'joe-adult-outro'],
  },
  'michael-bolton': {
    name: 'Michael Bolton',
    className: 'npc-idle',
    sprites: { default: sprite('michael-bolton-sprite') },
    hotspots: ['michael-bolton'],
  },
  'kenny-loggins': {
    name: 'Kenny Loggins',
    className: 'npc-idle',
    sprites: { default: sprite('kenny-loggins-sprite') },
    hotspots: ['kenny-loggins'],
  },
  'young-joe-timmins': {
    name: 'Young Joe Timmins',
    className: 'npc-idle',
    sprites: { default: sprite('young-joe-timmins-sprite') },
    hotspots: ['young-joe-timmins'],
  },
};

const hotspotCharacters = Object.fromEntries(
  Object.entries(characters).flatMap(([id, character]) =>
    (character.hotspots || []).map((hotspotId) => [hotspotId, id])),
);

export function getCharacter(id) {
  const character = characters[id];
  if (!character) throw new Error(`Unknown character: ${id}`);
  return character;
}

export function getCharacterSprite(id, pose = 'default') {
  const character = getCharacter(id);
  const source = character.sprites[pose];
  if (!source) throw new Error(`Unknown pose "${pose}" for character: ${id}`);
  return source;
}

export function getReactionSprite(id) {
  const character = characters[id];
  return character?.reactionPose ? character.sprites[character.reactionPose] : undefined;
}

export function getCharacterIdForHotspot(hotspotId) {
  return hotspotCharacters[hotspotId];
}

export function getReactionAssets() {
  return Object.entries(characters).flatMap(([id, character]) => {
    if (character.reactionPoses) return character.reactionPoses.map((pose) => getCharacterSprite(id, pose));
    return character.reactionPose ? [getCharacterSprite(id, character.reactionPose)] : [];
  });
}

export function placeCharacter(id, { pose = 'default', alt, className, bounds } = {}) {
  const character = getCharacter(id);
  return {
    id,
    src: getCharacterSprite(id, pose),
    alt: alt || character.name,
    className: className || character.className,
    bounds,
  };
}
