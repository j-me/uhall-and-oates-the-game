import { chapterSixDialogue as dialogue } from '../dialogue/chapter-06.js';
const art = 'assets/art';

export const theForksFinale = {
  id: 'the-forks-finale',
  name: 'You Make My Dreams Come True in The Forks',
  caption: 'The Reardons’ archive sits between Moxie Falls and a very loud rescue plan.',
  intro: 'At The Forks, the river is louder than the excuses. Oates has reached the Reardons’ last hideout—and Daryl is close.',
  opening: dialogue.opening,
  background: `${art}/chapters/chapter-06/the-forks-finale-v1.png`,
  characters: [
    { src: `${art}/characters/john-oates-determined-v1.png`, alt: 'John Oates, determined', className: 'john-idle', bounds: { left: 34, top: 44, width: 16, height: 47 } },
    { src: `${art}/characters/jamo-sprite-v1.png`, alt: 'Jamo, rafting guide', className: 'npc-idle', bounds: { left: 9, top: 36, width: 18, height: 50 } },
  ],
  hotspots: [
    { id: 'jamo', label: 'Jamo the rafting guide', bounds: { left: 9, top: 37, width: 18, height: 49 }, responses: dialogue.jamo },
    { id: 'broadcast-tower', label: 'river-valley broadcast tower', bounds: { left: 68, top: 7, width: 11, height: 48 }, responses: { look: dialogue.tower.look, talk: dialogue.tower.talk }, useWith: { counterMelody: { removeItems: ['counterMelody'], clearSelection: true, setFlags: ['towerRetimed'], success: true, effect: 'broadcast', message: dialogue.tower.success } } },
    { id: 'archive-door', label: 'Reardon archive chamber', bounds: { left: 48, top: 37, width: 17, height: 26 }, responses: { look: dialogue.archive.look, talk: dialogue.archive.talk }, useWith: { privateEyesManifest: { puzzle: 'recallClause', requires: ['towerRetimed'], missing: dialogue.archive.missing, removeItems: ['privateEyesManifest', 'returnManifest'], clearSelection: true, success: true, effect: 'contract', outro: true, complete: dialogue.archive.complete, next: { chapterId: 'outro', sceneId: 'game-complete', skipIntro: true }, message: dialogue.archive.success } } },
  ],
};
