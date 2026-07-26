import { chapter01 } from './chapters/chapter-01.js';
import { chapter02 } from './chapters/chapter-02.js';
import { chapter03 } from './chapters/chapter-03.js';
import { chapter04 } from './chapters/chapter-04.js';
import { chapter05 } from './chapters/chapter-05.js';
import { chapter06 } from './chapters/chapter-06.js';
import { outro } from './chapters/outro.js';

export const chapters = {
  [chapter01.id]: chapter01,
  [chapter02.id]: chapter02,
  [chapter03.id]: chapter03,
  [chapter04.id]: chapter04,
  [chapter05.id]: chapter05,
  [chapter06.id]: chapter06,
  [outro.id]: outro,
};
