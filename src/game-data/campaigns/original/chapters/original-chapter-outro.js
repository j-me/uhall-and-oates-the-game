import { gameComplete } from '../scenes/original-scene-game-complete.js';
import { timminsMaxima } from '../scenes/original-scene-timmins-maxima.js';

export const outro = {
  id: 'outro',
  title: 'Epilogue: Return to Sender',
  startScene: 'game-complete',
  scenes: { 'game-complete': gameComplete, 'timmins-maxima': timminsMaxima },
};
