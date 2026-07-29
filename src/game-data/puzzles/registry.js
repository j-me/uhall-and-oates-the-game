import { showCranePuzzle } from './original/original-puzzle-crane.js';
import { showRecallClausePuzzle } from './original/original-puzzle-recall-clause.js';
import { showStorageDirectoryPuzzle } from './original/original-puzzle-storage-directory.js';
import { showVoiceMixerPuzzle } from './original/original-puzzle-voice-mixer.js';
import { showWifflePuzzle } from './original/original-puzzle-wiffle.js';
import { showLogicConsolePuzzle } from './shared/shared-puzzle-logic-console.js';

const adultLogicPuzzle = (interactionMode) => (root, options) =>
  showLogicConsolePuzzle(root, { ...options, interactionMode });

export const puzzleControllers = {
  crane: showCranePuzzle,
  recallClause: showRecallClausePuzzle,
  storageDirectory: showStorageDirectoryPuzzle,
  voiceMixer: showVoiceMixerPuzzle,
  wiffle: showWifflePuzzle,
  temporalTrunk: adultLogicPuzzle('dials'),
  safetyCopier: adultLogicPuzzle('switches'),
  mallClosing: adultLogicPuzzle('cassette'),
  storageAuction: adultLogicPuzzle('cards'),
  vocalNetwork: adultLogicPuzzle('faders'),
  switchboard: adultLogicPuzzle('patchboard'),
  handbookContradictions: adultLogicPuzzle('stamps'),
};

export function showPuzzle(id, root, options) {
  const controller = puzzleControllers[id];
  if (!controller) throw new Error(`Unknown puzzle controller: ${id}`);
  return controller(root, options);
}
