import { chapterFourDialogue as dialogue } from '../dialogue/chapter-04.js';
import { placeCharacter } from '../characters.js';
const art = 'assets/art';

export const londonShippingDepot = {
  id: 'london-shipping-depot',
  name: 'I Can’t Go for That: London',
  caption: 'Customs has nothing to declare except hostility toward useful paperwork.',
  intro: 'London rain has turned the Reardons’ trail into a maze of wet paperwork and suspiciously cheerful bureaucracy. Their overseas operation is hiding behind official-looking desks, contradictory rules, and enough stamped forms to bury a tour bus. Fortunately, Michael McDonald is nearby, bringing a magnificent voice, a portable keyboard, and a deeply personal interest in anything signed, sealed, or delivered.',
  opening: dialogue.opening,
  reveal: {
    src: `${art}/reveals/chapter-04-london-v1.png`,
    alt: 'Oates faces a wall of London customs forms while Michael McDonald plays a glowing keyboard chord',
    tagline: 'A Signed Form? I Can Go for That.',
  },
  background: `${art}/chapters/chapter-04/london-shipping-depot-v1.png`,
  decorations: [
    { src: `${art}/props/no-can-do-cargo-form-v1.png`, alt: 'No Can Do rejected shipping form', className: 'scene-decoration--form', bounds: { left: 61, top: 64, width: 10, height: 16 }, hiddenWhen: ['no-can-do-formTaken'] },
  ],
  characters: [
    placeCharacter('john-oates', { pose: 'determined', alt: 'John Oates, determined', bounds: { left: 48, top: 45, width: 17, height: 47 } }),
    placeCharacter('michael-mcdonald', { alt: 'Michael McDonald with a portable keyboard', bounds: { left: 21, top: 40, width: 15, height: 51 } }),
  ],
  hotspots: [
    { id: 'record-shop', label: 'retro record shop', bounds: { left: 32, top: 35, width: 17, height: 27 }, item: { id: 'reversibleInk', label: 'reversible routing stamp', icon: 'ink' }, hiddenWhen: ['record-shopTaken'], responses: dialogue.shop },
    { id: 'michael-mcdonald', label: 'Michael McDonald', bounds: { left: 22, top: 48, width: 9, height: 44 }, responses: { look: dialogue.michael.look, talk: dialogue.michael.talk }, useWith: { rejectedShippingForm: { removeItems: ['rejectedShippingForm'], clearSelection: true, give: [{ id: 'artistAuthorization', label: 'signed-and-sealed authorization', icon: 'invoice' }], setFlags: ['michaelSignedForm'], success: true, effect: 'voice', message: dialogue.michael.success } } },
    { id: 'customs-desk', label: 'Reardon customs checkpoint', bounds: { left: 78, top: 35, width: 18, height: 37 }, responses: { look: dialogue.customs.look, talk: dialogue.customs.talk }, useWith: {
      artistAuthorization: { removeItems: ['artistAuthorization'], clearSelection: true, setFlags: ['customsAuthorized'], success: true, effect: 'contract', message: dialogue.customs.authorized },
      reversibleInk: { requires: ['customsAuthorized'], missing: dialogue.customs.needsAuthorization, removeItems: ['reversibleInk'], clearSelection: true, setFlags: ['customsSwapped'], success: true, effect: 'customs', message: dialogue.customs.success },
    } },
    { id: 'no-can-do-form', label: 'No Can Do shipping form', bounds: { left: 61, top: 64, width: 10, height: 16 }, item: { id: 'rejectedShippingForm', label: 'rejected shipping form', icon: 'invoice' }, hiddenWhen: ['no-can-do-formTaken'], responses: dialogue.noCanDo },
    { id: 'tube-map', label: 'shipping route map', bounds: { left: 2, top: 22, width: 19, height: 31 }, responses: { look: dialogue.map.look, talk: dialogue.map.talk }, useWith: { londonShippingLabel: { requires: ['customsSwapped'], missing: dialogue.map.missing, removeItems: ['londonShippingLabel'], clearSelection: true, give: [{ id: 'tokyoAccessPass', label: 'Tokyo access pass', icon: 'pass' }], success: true, effect: 'route', complete: dialogue.map.complete, next: { chapterId: 'chapter-05', sceneId: 'tokyo-cargo-district' }, message: dialogue.map.success } } },
  ],
};
