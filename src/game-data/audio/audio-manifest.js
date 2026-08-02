export const MUSIC_SLOTS = Object.freeze([
  'title',
  'chapter-01',
  'chapter-02',
  'chapter-03',
  'chapter-04',
  'chapter-05',
  'chapter-06',
  'outro',
  'adult-01',
  'adult-02',
  'adult-03',
  'adult-04',
  'adult-05',
  'adult-06',
  'adult-07',
  'adult-outro',
  'final-01',
  'final-02',
  'final-03',
  'final-04',
  'final-05',
  'final-06',
  'final-outro',
]);

export const SFX_PATHS = Object.freeze({
  pickup: 'assets/audio/sfx/pickup.wav',
  success: 'assets/audio/sfx/success-chime.wav',
  crane: 'assets/audio/sfx/crane-motor.wav',
  repair: 'assets/audio/sfx/repair-ratchet.wav',
  fries: 'assets/audio/sfx/prize-drop.wav',
  gull: 'assets/audio/sfx/gull-squawk.wav',
  manifest: 'assets/audio/sfx/paper-rustle.wav',
  stamp: 'assets/audio/sfx/stamp-thunk.wav',
  cards: 'assets/audio/sfx/cards-rip.wav',
  scoreboard: 'assets/audio/sfx/scoreboard-beeps.wav',
  wiffle: 'assets/audio/sfx/wiffle-launch.wav',
  customs: 'assets/audio/sfx/customs-clack.wav',
  route: 'assets/audio/sfx/route-whoosh.wav',
  lift: 'assets/audio/sfx/lift-unlock.wav',
  capsules: 'assets/audio/sfx/capsule-rotate.wav',
  voice: 'assets/audio/sfx/voice-glitch.wav',
  broadcast: 'assets/audio/sfx/broadcast-surge.wav',
  contract: 'assets/audio/sfx/contract-shred.wav',
  tape: 'assets/audio/sfx/tape-rip.wav',
});

// Source-tree development may use ignored local recordings. Production builds
// replace this flag with false because music-local is deliberately not shipped.
const LOCAL_MUSIC_DIRECTORY = typeof __UHALL_LOCAL_MUSIC_DIRECTORY__ === 'undefined'
  ? 'assets/audio/music-local'
  : __UHALL_LOCAL_MUSIC_DIRECTORY__;

export function musicSources(slot) {
  if (!MUSIC_SLOTS.includes(slot)) throw new Error(`Unknown music slot: ${slot}`);
  return {
    local: LOCAL_MUSIC_DIRECTORY ? `${LOCAL_MUSIC_DIRECTORY}/${slot}.mp3` : null,
    original: `assets/audio/music/${slot}-original.mp3`,
  };
}
