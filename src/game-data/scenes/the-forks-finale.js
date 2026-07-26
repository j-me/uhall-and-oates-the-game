import { chapterSixDialogue as dialogue } from '../dialogue/chapter-06.js';
import { placeCharacter } from '../characters.js';
const art = 'assets/art';

export const theForksFinale = {
  id: 'the-forks-finale',
  name: 'You Make My Dreams Come True in The Forks',
  caption: 'Nothing says rescue mission like whitewater and predatory contract law.',
  intro: 'The chase returns to Maine, deep into The Forks, where the Kennebec roars past Moxie Falls and the Reardons have prepared their final broadcast. Daryl is close, the Recall Clause machine is nearly ready, and every mile of John’s impossible moving route has led here. With Jamo commanding the river and Joe Timmins claiming managerial credit from a safe distance, the rescue enters its final run.',
  opening: dialogue.opening,
  reveal: {
    src: `${art}/reveals/chapter-06-the-forks-v1.png`,
    alt: 'Jamo and Oates raft through Maine rapids toward Daryl and the Reardons’ archive',
    tagline: 'You Make My Rapids Come True!',
  },
  background: `${art}/chapters/chapter-06/the-forks-finale-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'determined', alt: 'John Oates, determined', bounds: { left: 34, top: 44, width: 16, height: 47 } }),
    placeCharacter('jamo', { alt: 'Jamo, rafting guide', bounds: { left: 9, top: 36, width: 18, height: 50 } }),
  ],
  hotspots: [
    { id: 'jamo', label: 'Jamo the rafting guide', bounds: { left: 9, top: 37, width: 18, height: 49 }, responses: dialogue.jamo },
    { id: 'broadcast-tower', label: 'river-valley broadcast tower', bounds: { left: 68, top: 7, width: 11, height: 48 }, responses: { look: dialogue.tower.look, talk: dialogue.tower.talk }, useWith: { counterMelody: { removeItems: ['counterMelody'], clearSelection: true, setFlags: ['towerRetimed'], success: true, effect: 'broadcast', message: dialogue.tower.success } } },
    { id: 'archive-door', label: 'Reardon archive chamber', bounds: { left: 48, top: 37, width: 17, height: 26 }, responses: { look: dialogue.archive.look, talk: dialogue.archive.talk }, useWith: { privateEyesManifest: { puzzle: 'recallClause', requires: ['towerRetimed'], missing: dialogue.archive.missing, removeItems: ['privateEyesManifest', 'returnManifest'], clearSelection: true, success: true, effect: 'contract', outro: true, complete: dialogue.archive.complete, next: { chapterId: 'outro', sceneId: 'game-complete', skipIntro: true }, message: dialogue.archive.success } } },
  ],
};
