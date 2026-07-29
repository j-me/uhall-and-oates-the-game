import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item, next, puzzle } from './adult-scene-helpers.js';

export const adultSmoothMoveOffice = {
  id: 'adult-smoothmove-office', playerId: 'michael-mcdonald',
  name: 'Your Hard Drive Is on My List',
  caption: 'The dot-com has two Michaels and no profitable business model.',
  intro: 'A Reardon keyboard pulls Michael McDonald into 2001 and deposits him at SmoothMove.com, a startup that emails shipping labels to underpaid movers. CTO Michael Bolton has accidentally built the digital half of the Reardon system.',
  opening: 'MICHAEL BOLTON: I was hired as Chief Tenor Officer. Somewhere around Series B, they gave me the server passwords.',
  reveal: { src: `${art}/reveals/adult-05-smoothmove-v1.png`, alt: 'Michael McDonald and Michael Bolton conduct a singing server network while Virtual Joe denies responsibility', tagline: 'Two Michaels. One Administrator Password.' },
  background: `${art}/chapters/adult-05/smoothmove-office-v1.png`,
  characters: [placeCharacter('michael-mcdonald', { bounds: { left: 9, top: 41, width: 18, height: 52 } }), placeCharacter('michael-bolton', { bounds: { left: 67, top: 38, width: 19, height: 54 } })],
  hotspots: [
    { id: 'michael-m-badge', label: 'ambiguous Michael M. badge', bounds: { left: 92, top: 30, width: 7, height: 32 }, item: item('michaelBadge', 'Michael M. access badge', 'badge'), hiddenWhen: ['michael-m-badgeTaken'], responses: { look: 'It grants access to one Michael. The database declines to specify which.', take: 'Michael takes Michael’s badge. This resolves nothing.' } },
    { id: 'michael-bolton', label: 'Michael Bolton, CTO', bounds: { left: 68, top: 40, width: 17, height: 51 }, responses: { look: 'Bolton has genuine network expertise and a title based on a misunderstanding.', talk: 'BOLTON: The server routes packets by pitch. Elegant, scalable and emotionally available.' }, useWith: { michaelBadge: { removeItems: ['michaelBadge'], give: [item('adminBadge', 'dual-Michael administrator badge', 'badge')], setFlags: ['michaelsReconciled'], clearSelection: true, success: true, effect: 'voice', message: 'Bolton merges both Michael M. accounts. The badge now has two headshots and dangerous privileges.' } } },
    { id: 'server-room', label: 'vocal-routing server', bounds: { left: 59, top: 7, width: 9, height: 48 }, responses: { look: 'The server expects identity, a modem harmony, a denial of ownership and a route back to the Maxima trunk.' }, useWith: { adminBadge: { puzzle: 'vocalNetwork', puzzleData: puzzle('SMOOTHMOVE VOCAL NETWORK', 'DUAL-MICHAEL ADMINISTRATION', 'McDonald identifies the modem chord; Bolton supplies administrator range; Virtual Joe must deny responsibility; the audit must route to the Maxima trunk.', [
      { label: 'MODEM CHORD', options: ['Major seventh', 'Doorbell', 'Dial tone'], answer: 'Major seventh' },
      { label: 'ADMIN VOICE', options: ['Michael McDonald', 'Michael Bolton', 'Virtual Joe'], answer: 'Michael Bolton' },
      { label: 'OWNERSHIP RESPONSE', options: ['Accept', 'Deny responsibility', 'Bill John'], answer: 'Deny responsibility' },
      { label: 'AUDIT ROUTE', options: ['Maxima trunk', 'Public internet', 'Joe’s voicemail'], answer: 'Maxima trunk' },
    ], 'Virtual Joe denies owning the Reardon program. The server releases its audit log.', 'vocal-network-console'), removeItems: ['adminBadge'], giveTo: { trunk: [item('auditLog', '2001 Reardon audit log', 'ledger')] }, setFlags: ['auditReleased', 'adultEvidenceAudit', 'trunkPortalOpen'], clearSelection: true, success: true, effect: 'voice', complete: 'The audit log enters the Maxima trunk and exposes a 1976 filing number—but its digits are encoded across three eras.', next: next('adult-06', 'adult-daryl-switchboard'), message: 'The two Michaels harmonize the network into compliance. Virtual Joe denies everything, exactly as required.' } } },
  ],
};
