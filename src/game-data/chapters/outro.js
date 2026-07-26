import { gameComplete } from '../scenes/game-complete.js';
import { timminsMaxima } from '../scenes/timmins-maxima.js';

export const outro = {
  id: 'outro',
  title: 'Epilogue: Return to Sender',
  startScene: 'game-complete',
  scenes: { 'game-complete': gameComplete, 'timmins-maxima': timminsMaxima },
};
