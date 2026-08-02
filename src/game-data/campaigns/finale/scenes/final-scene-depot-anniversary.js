import { placeCharacter } from '../../../characters.js';
import { finalArt as art, item, next, puzzle } from './final-scene-helpers.js';

export const finalDepotAnniversary = {
  id: 'final-depot-anniversary', playerId: 'john-oates',
  name: 'Back Together Again, on Paper',
  caption: 'The banner promises an anniversary. The dust suggests several were missed.',
  intro: 'It is 2008. A label hidden in Joe’s handbook leads back to the depot, where an old rehearsal reel waits beneath twenty-something years of moving paperwork. Joe has already booked the comeback as a cardboard-sponsored corporate event.',
  opening: 'JOE: Good news. I have monetized your nostalgia.\nJOHN: You have put balloons on a filing cabinet.',
  reveal: { src: `${art}/chapters/final-01/depot-anniversary-v1.png`, alt: 'The Uhall depot decorated for a vague anniversary beside the gold Maxima', tagline: 'Some Things Are Better Left Unfiled.' },
  background: `${art}/chapters/final-01/depot-anniversary-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'worried', bounds: { left: 8, top: 41, width: 18, height: 52 } }),
    placeCharacter('daryl-hall', { bounds: { left: 27, top: 40, width: 17, height: 52 } }),
    placeCharacter('joe-timmins', { bounds: { left: 47, top: 37, width: 17, height: 55 } }),
  ],
  decorations: [
    { src: `${art}/items/bent-spool-v1.png`, alt: '', className: 'scene-decoration--prop', bounds: { left: 65, top: 70, width: 6, height: 11 }, hiddenWhen: ['bent-spoolTaken'] },
  ],
  hotspots: [
    { id: 'anniversary-files', label: 'Joe’s anniversary filing cabinet', bounds: { left: 73, top: 45, width: 16, height: 19 }, responses: { look: 'The steel drawers are organized by expense category, not chronology. The 2008 label matches the bright empty label slot.' }, useWith: { label2008: { removeItems: ['label2008'], give: [item('damagedRehearsalReel', 'damaged rehearsal reel', 'final-damaged-reel')], setFlags: ['reelLocated'], clearSelection: true, success: true, effect: 'manifest', message: 'The label opens a misfiled drawer. Inside is the rehearsal reel John and Daryl recorded before the moving company existed.' } } },
    { id: 'packing-blanket', label: 'heavy packing blanket', bounds: { left: 0, top: 75, width: 20, height: 25 }, item: item('soundBlanket', 'sound-dampening packing blanket', 'final-sound-blanket'), hiddenWhen: ['packing-blanketTaken'], responses: { look: 'Thick enough to protect a piano or silence Joe’s office wall.', take: 'John takes the blanket. It is the first moving supply to support the music.' } },
    { id: 'bent-spool', label: 'bent take-up spool', bounds: { left: 65, top: 70, width: 6, height: 11 }, item: item('bentSpool', 'bent take-up spool', 'final-bent-spool'), hiddenWhen: ['bent-spoolTaken'], responses: { look: 'A loose, visibly warped spare beside the reel deck. Bent, but round enough for analog equipment and management standards.', take: 'John pockets the spool before Joe can classify it as a wheel surcharge.' } },
    { id: 'reel-deck', label: 'old rehearsal reel deck', bounds: { left: 71, top: 64, width: 14, height: 21 }, responses: { look: 'The workbench deck needs its echoing corner baffled, the damaged reel mounted, and a replacement take-up spool installed—in that order.' }, useWith: {
      soundBlanket: { removeItems: ['soundBlanket'], setFlags: ['deckBaffled'], clearSelection: true, success: true, effect: 'repair', message: 'The packing blanket turns the concrete corner into a surprisingly respectable listening space.' },
      damagedRehearsalReel: { requires: ['deckBaffled'], missing: 'The bare concrete corner will echo through the damaged recording. Baffle it before mounting the reel.', removeItems: ['damagedRehearsalReel'], setFlags: ['reelMounted'], clearSelection: true, success: true, effect: 'tape', message: 'John mounts the damaged reel. Its loose tape now has somewhere respectable to misbehave.' },
      bentSpool: { requires: ['deckBaffled', 'reelMounted'], missing: 'The replacement spool needs the corner baffled and the damaged rehearsal reel mounted first.', puzzle: 'reelRestore', puzzleData: puzzle('REHEARSAL REEL DECK', 'ONE RECORDING · TWO EQUAL CREDITS', 'The reel case calls for studio speed, both recorded channels, and the clean monitor output.', [
        { label: 'SPEED', options: ['Shipping fast', 'Studio speed', 'Joe speed'], answer: 'Studio speed' },
        { label: 'CHANNELS', options: ['John only', 'Daryl only', 'Both channels'], answer: 'Both channels' },
        { label: 'OUTPUT', options: ['Warehouse P.A.', 'Clean monitor', 'Invoice printer'], answer: 'Clean monitor' },
      ], 'The reel plays an unfinished arrangement credited equally to John and Daryl.', 'final-reel-console'), removeItems: ['bentSpool'], give: [item('rehearsalReel', 'restored rehearsal reel', 'final-restored-reel')], setFlags: ['reelRestored'], clearSelection: true, success: true, effect: 'tape', complete: 'The reel names the One on One Listening Room in Manhattan. Daryl agrees to attend the next rehearsal as a participant, not an attraction.', next: next('final-02', 'final-listening-room'), message: 'The old recording survives. It sounds unfinished because both partners were supposed to finish it together.' },
    } },
    { id: 'joe-final-depot', label: 'Joe Timmins', bounds: { left: 49, top: 56, width: 13, height: 36 }, responses: { look: 'Joe has trademarked the phrase “emotionally relocatable.”', talk: 'JOE: The comeback is a moving-company asset.\nJOHN: Then the company can carry the tune.' } },
  ],
};
