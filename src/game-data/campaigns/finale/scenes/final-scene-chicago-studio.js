import { placeCharacter } from '../../../characters.js';
import { finalArt as art, item, next, puzzle } from './final-scene-helpers.js';

export const finalChicagoStudio = {
  id: 'final-chicago-studio', playerId: 'john-oates',
  name: 'Method of Modern Music',
  caption: 'The patch bay has more cables than Joe has reimbursement categories.',
  intro: 'Michael McDonald’s Chicago studio can recover the missing performance, but the Reardons’ metadata still lists John as support equipment and Daryl as unsupervised vocals.',
  opening: 'MICHAEL: The machine needs to know what each person contributed.\nJOHN: Finally, a system with standards.',
  reveal: { src: `${art}/chapters/final-03/chicago-studio-v1.png`, alt: 'A colorful Chicago rehearsal warehouse with a wall-sized studio patch bay', tagline: 'Modern Music, Ancient Cables.' },
  background: `${art}/chapters/final-03/chicago-studio-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'determined', bounds: { left: 4, top: 42, width: 18, height: 51 } }),
    placeCharacter('daryl-hall', { bounds: { left: 23, top: 40, width: 17, height: 52 } }),
    placeCharacter('michael-mcdonald', { bounds: { left: 82, top: 39, width: 17, height: 53 } }),
  ],
  decorations: [
    { src: `${art}/items/studio-patch-cable-v1.png`, alt: '', className: 'scene-decoration--prop', bounds: { left: 22, top: 66, width: 10, height: 15 }, hiddenWhen: ['studio-patch-cableTaken'] },
  ],
  hotspots: [
    { id: 'studio-patch-cable', label: 'three-headed studio patch cable', bounds: { left: 22, top: 66, width: 10, height: 15 }, item: item('studioPatchCable', 'three-headed studio patch cable', 'final-patch-cable'), hiddenWhen: ['studio-patch-cableTaken'], responses: { look: 'A loose coil on the floor with three color-coded plugs: one for each contributor channel.', take: 'John takes the cable. It immediately becomes the best-managed part of the project.' } },
    { id: 'studio-patch-bay', label: 'analog-digital studio patch bay', bounds: { left: 31, top: 14, width: 35, height: 46 }, responses: { look: 'The giant patch bay has three empty contributor inputs. The recovered set list is the only reliable channel legend.' }, useWith: {
      setListFragment: { removeItems: ['setListFragment'], setFlags: ['setListLoaded'], clearSelection: true, success: true, effect: 'manifest', message: 'John clips the recovered set list beside the three contributor inputs. The insulting old metadata is now visibly contradicted.' },
      studioPatchCable: { requires: ['setListLoaded'], missing: 'The cable has three ends, but the recovered set list must be clipped beside the patch bay before John can identify the channels.', puzzle: 'studioPatch', puzzleData: puzzle('METHOD OF MODERN MUSIC', 'CONTRIBUTOR SIGNAL CHAIN', 'Use the clipped set list: John built the arrangement, Daryl supplied the guide melody, and Michael carried the transfer harmony.', [
      { label: 'JOHN', options: ['Support equipment', 'Arrangement grid', 'Loading dock'], answer: 'Arrangement grid' },
      { label: 'DARYL', options: ['Guide melody', 'Fog machine', 'Invoice voice'], answer: 'Guide melody' },
      { label: 'MICHAEL', options: ['Transfer harmony', 'Server rack', 'Office ambience'], answer: 'Transfer harmony' },
    ], 'The transfer recognizes three musicians instead of two assets and a keyboard-shaped witness.', 'final-studio-console'), removeItems: ['studioPatchCable'], give: [item('fullRehearsalMix', 'full rehearsal mix', 'final-full-mix')], setFlags: ['fullMixRecovered'], clearSelection: true, success: true, effect: 'broadcast', complete: 'The restored mix ends with Joe ordering a Los Angeles contractor to convert the comeback into a commercial.', next: next('final-04', 'final-commercial-studio'), message: 'The full rehearsal plays. John’s arrangement is no longer metadata; it is part of the music.' },
    } },
    { id: 'michael-final-studio', label: 'Michael McDonald', bounds: { left: 86, top: 49, width: 12, height: 43 }, responses: { look: 'Michael can hear a mislabeled channel at forty paces.', talk: 'MICHAEL: Someone classified me as ambience again.\nJOHN: You are unusually billable ambience.' } },
    { id: 'dolly-percussion', label: 'accidental dolly percussion section', bounds: { left: 67, top: 46, width: 11, height: 31 }, responses: { look: 'Three blanket-loaded dollies tuned to C, E, and workers’ compensation.', use: 'John rolls them together. The resulting chord is better than Joe’s jingle.' } },
  ],
};
