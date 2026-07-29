import { chapter01 } from './chapters/original-chapter-01.js';
import { chapter02 } from './chapters/original-chapter-02.js';
import { chapter03 } from './chapters/original-chapter-03.js';
import { chapter04 } from './chapters/original-chapter-04.js';
import { chapter05 } from './chapters/original-chapter-05.js';
import { chapter06 } from './chapters/original-chapter-06.js';
import { outro } from './chapters/original-chapter-outro.js';

const chapterList = [chapter01, chapter02, chapter03, chapter04, chapter05, chapter06, outro];

export const originalCampaign = {
  id: 'original',
  title: 'Uhall & Oates — The Game',
  shortTitle: 'The Original Game',
  startChapter: 'chapter-01',
  startScene: 'old-orchard-pier',
  chapterOrder: chapterList.map((chapter) => chapter.id),
  chapters: Object.fromEntries(chapterList.map((chapter) => [chapter.id, chapter])),
  initialCharacterId: 'john-oates',
  initialInventory: [{ id: 'emptyTapeRoll', label: 'empty tape roll', icon: 'tape' }],
};
