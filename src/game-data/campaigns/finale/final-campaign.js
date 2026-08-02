import { finalChapter01 } from './chapters/final-chapter-01.js';
import { finalChapter02 } from './chapters/final-chapter-02.js';
import { finalChapter03 } from './chapters/final-chapter-03.js';
import { finalChapter04 } from './chapters/final-chapter-04.js';
import { finalChapter05 } from './chapters/final-chapter-05.js';
import { finalChapter06 } from './chapters/final-chapter-06.js';
import { finalChapterOutro } from './chapters/final-chapter-outro.js';

const chapterList = [finalChapter01, finalChapter02, finalChapter03, finalChapter04, finalChapter05, finalChapter06, finalChapterOutro];

export const finaleCampaign = {
  id: 'finale',
  title: 'Uhall & Oates III: The Sound of Moving On',
  shortTitle: 'The Sound of Moving On',
  requiresCampaign: 'adult-relocation',
  completionFlag: 'finalCampaignComplete',
  startChapter: 'final-01',
  startScene: 'final-depot-anniversary',
  chapterOrder: chapterList.map((chapter) => chapter.id),
  chapters: Object.fromEntries(chapterList.map((chapter) => [chapter.id, chapter])),
  initialCharacterId: 'john-oates',
  initialInventory: [{ id: 'label2008', label: 'shipping label dated 2008', icon: 'final-label-2008' }],
};
