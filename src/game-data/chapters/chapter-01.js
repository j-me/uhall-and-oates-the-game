import { oldOrchardPier } from '../scenes/old-orchard-pier.js';

/**
 * Replace the placeholder title and scene with the supplied narrative.
 * Chapters may also declare an `onStart` action for cutscenes or state setup.
 */
export const chapter01 = {
  id: 'chapter-01',
  title: 'Chapter 1: Out of Touch in O.O.B.',
  startScene: 'old-orchard-pier',
  scenes: { 'old-orchard-pier': oldOrchardPier },
};
