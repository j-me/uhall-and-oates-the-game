import { adultChapter01 } from './chapters/adult-chapter-01.js';
import { adultChapter02 } from './chapters/adult-chapter-02.js';
import { adultChapter03 } from './chapters/adult-chapter-03.js';
import { adultChapter04 } from './chapters/adult-chapter-04.js';
import { adultChapter05 } from './chapters/adult-chapter-05.js';
import { adultChapter06 } from './chapters/adult-chapter-06.js';
import { adultChapter07 } from './chapters/adult-chapter-07.js';
import { adultChapterOutro } from './chapters/adult-chapter-outro.js';

const chapterList = [
  adultChapter01,
  adultChapter02,
  adultChapter03,
  adultChapter04,
  adultChapter05,
  adultChapter06,
  adultChapter07,
  adultChapterOutro,
];

export const adultRelocationCampaign = {
  id: 'adult-relocation',
  title: 'Uhall & Oates II: Adult Relocation',
  shortTitle: 'Adult Relocation',
  startChapter: 'adult-01',
  startScene: 'adult-maxima-trunk',
  chapterOrder: chapterList.map((chapter) => chapter.id),
  chapters: Object.fromEntries(chapterList.map((chapter) => [chapter.id, chapter])),
  initialCharacterId: 'john-oates',
  initialInventory: [],
};
