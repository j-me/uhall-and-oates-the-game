import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item, next, puzzle } from './adult-scene-helpers.js';

export const adultMallConcourse = {
  id: 'adult-mall-concourse', playerId: 'john-oates',
  name: 'So Close, Yet So 1993',
  caption: 'The information kiosk knows the future and the food court closes at nine.',
  intro: 'John reaches 1993, where the Maxima’s routing chip has become part of a mall information kiosk. Joe is already recruiting John’s replacement beside a pager store.',
  opening: 'JOE TIMMINS: Assemble my recruiting table, Oates. Applicants respond well to seeing the current employee struggle.',
  reveal: { src: `${art}/reveals/adult-03-mall-v1.png`, alt: 'John races toward a glowing temporal kiosk while Joe recruits his replacement in a closing 1993 mall', tagline: 'Your Future Is Located Near the Food Court.' },
  background: `${art}/chapters/adult-03/mall-concourse-v1.png`,
  characters: [placeCharacter('john-oates', { pose: 'determined', bounds: { left: 9, top: 42, width: 19, height: 51 } }), placeCharacter('joe-timmins', { bounds: { left: 81, top: 36, width: 17, height: 56 } })],
  hotspots: [
    { id: 'blank-announcement', label: 'blank announcement cassette', bounds: { left: 29, top: 75, width: 10, height: 14 }, item: item('blankAnnouncement', 'blank announcement cassette', 'cassette'), hiddenWhen: ['blank-announcementTaken'], responses: { look: 'Thirty minutes per side and no useful content yet.', take: 'John takes the cassette before the mall can charge a convenience fee.' } },
    { id: 'expired-security-badge', label: 'expired mall security badge', bounds: { left: 54, top: 74, width: 8, height: 12 }, item: item('expiredBadge', 'expired mall security badge', 'badge'), hiddenWhen: ['expired-security-badgeTaken'], responses: { look: 'Expired, but the magnetic stripe still contains misplaced authority.', take: 'John takes the badge. The portrait has somehow aged worse than the plastic.' } },
    { id: 'announcement-booth', label: 'mall announcement booth', bounds: { left: 59, top: 10, width: 21, height: 42 }, responses: { look: 'The booth needs a closing reason, an authorization source, a calm delivery and a chime that will not start a stampede.' }, useWith: { blankAnnouncement: { requires: ['expired-security-badgeTaken'], missing: 'The booth demands employee authorization before recording.', puzzle: 'mallClosing', puzzleData: puzzle('MALL CLOSING ANNOUNCEMENT', 'AUTHORIZED BY EXPIRED SECURITY BADGE', 'The kiosk may close for inventory reconciliation, using the employee channel, a calm announcement and the standard closing chime.', [
      { label: 'REASON', options: ['Temporal spill', 'Inventory reconciliation', 'Celebrity panic'], answer: 'Inventory reconciliation' },
      { label: 'CHANNEL', options: ['Public address', 'Employee channel', 'Food court radio'], answer: 'Employee channel' },
      { label: 'DELIVERY', options: ['Calm', 'Operatic', 'Whispered'], answer: 'Calm' },
      { label: 'END CHIME', options: ['Closing chime', 'Airhorn', 'Power ballad'], answer: 'Closing chime' },
    ], 'The mall accepts the least interesting emergency imaginable and begins an orderly closing.', 'mall-closing-console'), removeItems: ['blankAnnouncement', 'expiredBadge'], give: [item('closingCassette', 'authorized closing cassette', 'cassette')], setFlags: ['closingRecorded'], clearSelection: true, success: true, effect: 'voice', message: 'John records a closing announcement so bureaucratic that every store obeys immediately.' } } },
    { id: 'mall-kiosk', label: 'temporal mall kiosk', bounds: { left: 10, top: 21, width: 25, height: 53 }, responses: { look: 'The glowing map contains the Maxima’s missing routing chip.' }, useWith: { closingCassette: { removeItems: ['closingCassette'], give: [item('routingChip', 'Maxima routing chip', 'chip'), item('contractorForm', 'John’s independent-contractor form', 'form')], setFlags: ['routingChipRecovered', 'adultEvidenceContractor'], clearSelection: true, success: true, effect: 'route', complete: 'The kiosk shuts down and releases the chip. Its maintenance drawer also contains Joe’s contradictory employment form.', next: next('adult-04', 'adult-storage-auction'), message: 'The mall closes. John retrieves the routing chip and paperwork proving Joe denies employing him whenever benefits appear.' } } },
    { id: 'joe-recruiting', label: 'Joe Timmins recruiting table', bounds: { left: 81, top: 38, width: 17, height: 51 }, responses: { look: 'Joe is advertising John’s job as “entry-level ownership opportunity.”', talk: 'JOE: I need someone exactly like you, only grateful.\nJOHN: You have described nobody.' } },
  ],
};
