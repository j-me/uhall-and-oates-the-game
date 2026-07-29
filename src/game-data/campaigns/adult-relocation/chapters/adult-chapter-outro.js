import { adultRestoredDepot } from '../scenes/adult-scene-restored-depot.js';

export const adultChapterOutro = {
  id: 'adult-outro',
  title: 'Epilogue: Adult Relocation Complete',
  year: '1993',
  playerId: 'john-oates',
  playerLabel: 'JOHN',
  startScene: adultRestoredDepot.id,
  scenes: { [adultRestoredDepot.id]: adultRestoredDepot },
};
