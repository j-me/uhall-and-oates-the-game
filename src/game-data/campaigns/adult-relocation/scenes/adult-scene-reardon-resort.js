import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item } from './adult-scene-helpers.js';

export const adultReardonResort = {
  id: 'adult-reardon-resort', playerId: 'daryl-hall',
  name: 'Adult Education in the Danger Zone',
  caption: 'Corporate learning, now with mandatory smoke machines.',
  intro: 'Daryl lands at a 1987 Reardon executive retreat. Jesse and Joe are preparing to distribute Joe Timmins’s management handbook, while safety director Kenny Loggins has turned the loading dock into a motivational obstacle course.',
  opening: 'KENNY LOGGINS: Nobody reaches the copier without entering the properly documented danger zone.',
  reveal: { src: `${art}/reveals/adult-02-danger-zone-v1.png`, alt: 'Daryl crosses Kenny Loggins’s theatrical corporate safety obstacle course', tagline: 'Training Is Mandatory. Rhythm Is Optional.' },
  background: `${art}/chapters/adult-02/reardon-resort-v1.png`,
  characters: [placeCharacter('daryl-hall', { bounds: { left: 12, top: 39, width: 19, height: 53 } }), placeCharacter('kenny-loggins', { bounds: { left: 69, top: 36, width: 18, height: 54 } })],
  hotspots: [
    { id: 'tuxedo-sash', label: 'executive seminar sash', bounds: { left: 51, top: 31, width: 13, height: 22 }, item: item('seminarSash', 'executive seminar sash', 'sash'), hiddenWhen: ['tuxedo-sashTaken'], responses: { look: 'Decorative, reflective and one regulation away from useful.', take: 'Daryl takes the sash. It clashes with everything, heroically.' } },
    { id: 'safety-station', label: 'safety-equipment station', bounds: { left: 64, top: 40, width: 6, height: 19 }, responses: { look: 'The station will certify anything reflective enough.' }, useWith: { seminarSash: { removeItems: ['seminarSash'], give: [item('compliantVest', 'technically compliant safety vest', 'vest')], setFlags: ['vestCertified'], clearSelection: true, success: true, effect: 'certified', message: 'The machine staples a warning label to the sash. It is now legally protective.' } } },
    { id: 'kenny-loggins', label: 'Kenny Loggins, safety director', bounds: { left: 70, top: 38, width: 17, height: 51 }, responses: { look: 'Kenny regards pallet safety as an action sequence.', talk: 'KENNY: The copier room is beyond the danger zone. I recommend confidence and closed-toe shoes.' }, useWith: { compliantVest: { removeItems: ['compliantVest'], give: [item('dangerCassette', 'Priority Danger safety cassette', 'cassette')], setFlags: ['safetyCoursePassed'], clearSelection: true, success: true, effect: 'success', message: 'Kenny approves Daryl’s technically legal outfit and awards the Priority Danger cassette.' } } },
    { id: 'to-copier', label: 'copier-room door', bounds: { left: 88, top: 18, width: 11, height: 60 }, exit: { sceneId: 'adult-copier-room', requires: ['safetyCoursePassed'], missing: 'Kenny blocks the route until Daryl passes safety inspection.' }, responses: { look: 'A copier hums with the sound of pending administrative damage.' } },
  ],
};
