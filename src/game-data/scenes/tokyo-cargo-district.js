import { chapterFiveDialogue as dialogue } from '../dialogue/chapter-05.js';
const art = 'assets/art';

export const tokyoCargoDistrict = {
  id: 'tokyo-cargo-district',
  name: 'Maneater on the Midnight Shipping',
  caption: 'A karaoke stage-prop warehouse, a secured shipping lift, and one recording truck that takes itself too seriously.',
  intro: 'Tokyo shipping glows through the night. The Reardons’ recording truck is beyond a secured service lift; a legitimate delivery may be Oates’ way in.',
  opening: dialogue.opening,
  background: `${art}/chapters/chapter-05/tokyo-cargo-district-v1.png`,
  characters: [
    { src: `${art}/characters/john-oates-worried-v1.png`, alt: 'John Oates, concerned', className: 'john-idle', bounds: { left: 39, top: 44, width: 16, height: 47 } },
    { src: `${art}/characters/huey-lewis-sprite-v1.png`, alt: 'Huey Lewis, uneasy ally', className: 'npc-idle', bounds: { left: 67, top: 22, width: 22, height: 67 } },
  ],
  hotspots: [
    { id: 'stage-prop-warehouse', label: 'karaoke stage-prop warehouse', bounds: { left: 0, top: 25, width: 24, height: 41 }, item: { id: 'deliveryDocket', label: 'backstage delivery docket', icon: 'sheet' }, hiddenWhen: ['stage-prop-warehouseTaken'], responses: dialogue.warehouse },
    { id: 'shipping-service-lift', label: 'secured shipping service lift', bounds: { left: 53, top: 20, width: 17, height: 41 }, responses: dialogue.lift, useWith: { deliveryDocket: { removeItems: ['deliveryDocket'], clearSelection: true, setFlags: ['serviceLiftUnlocked'], success: true, effect: 'lift', message: dialogue.lift.success } } },
    { id: 'recording-truck', label: 'Reardon recording truck', bounds: { left: 85, top: 27, width: 12, height: 37 }, responses: { look: dialogue.truck.look, talk: dialogue.truck.talk }, useWith: { tokyoAccessPass: { puzzle: 'voiceMixer', requires: ['serviceLiftUnlocked'], missing: dialogue.truck.missing, removeItems: ['tokyoAccessPass'], clearSelection: true, give: [{ id: 'counterMelody', label: 'Daryl’s counter-melody', icon: 'melody' }, { id: 'returnManifest', label: 'The Forks return manifest', icon: 'sheet' }], success: true, effect: 'voice', complete: dialogue.truck.complete, next: { chapterId: 'chapter-06', sceneId: 'the-forks-finale' }, message: dialogue.truck.success } } },
    { id: 'huey', label: 'Huey Lewis', bounds: { left: 70, top: 43, width: 14, height: 44 }, responses: { talk: dialogue.huey.talk, look: dialogue.huey.look }, useWith: { privateEyesManifest: { clearSelection: true, setFlags: ['hueyReadTheNews'], message: dialogue.huey.news } } },
  ],
};
