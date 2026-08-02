import { placeCharacter } from '../../../characters.js';
import { adultArt as art, item } from './adult-scene-helpers.js';

export const adultRestoredDepot = {
  id: 'adult-restored-depot', playerId: 'john-oates',
  name: 'Adult Relocation Complete',
  caption: 'History is restored. Payroll remains a work of fiction.',
  background: `${art}/chapters/adult-outro/restored-depot-v1.png`,
  characters: [placeCharacter('john-oates', { pose: 'relieved', bounds: { left: 8, top: 42, width: 18, height: 51 } }), placeCharacter('daryl-hall', { bounds: { left: 27, top: 40, width: 17, height: 52 } }), placeCharacter('joe-timmins', { bounds: { left: 72, top: 37, width: 18, height: 55 } })],
  hotspots: [
    { id: 'daryl-adult-outro', label: 'Daryl Hall', bounds: { left: 27, top: 40, width: 17, height: 52 }, responses: { look: 'Daryl survived three decades with his hair, voice, and aversion to lifting intact.', talk: 'DARYL: I carried the altered handbook through 1987.\nJOHN: You fed it into a machine.\nDARYL: Every movement has a dramatic interpretation.' } },
    { id: 'revised-handbook', label: 'Joe’s revised anniversary handbook', bounds: { left: 48, top: 52, width: 13, height: 19 }, actions: { take: { puzzle: 'temporalTruck', puzzleData: { title: 'YOU MAKE MY WINGS COME TRUE', subtitle: 'TEMPORAL TRUCK RUN · DEFINITELY NOT INSURED', clue: 'The loose 2008 label blows into the last time rift. Tap, click, or press Space / ↑ to flap the truck’s moving-blanket wings through six badly packed eras.', successMessage: 'The flying truck catches the 2008 shipping label. Joe records the flight as John’s unpaid lunch break.' }, setFlags: ['adultGameComplete'], give: [item('label2008', 'shipping label dated 2008', 'final-label-2008')], pickup: true, success: true, effect: 'route', complete: 'ADULT RELOCATION COMPLETE — The timeline is safe, the Reardons are defeated again, and Joe deducts the flying-truck mileage from John’s paycheck.', completionTitle: 'TIME CLOCKED OUT', message: 'John lands the truck with the 2008 shipping label stuck to the windshield. Daryl calls it a key change; Joe calls it chargeable windshield damage.' } }, responses: { look: 'Employees: Could They Be Doing More? Revised Anniversary Edition. A loose label dated 2008 protrudes from the back cover and flaps in a suspicious time draft.' } },
    { id: 'joe-adult-outro', label: 'Joe Timmins', bounds: { left: 72, top: 37, width: 18, height: 55 }, responses: { look: 'Joe is unchanged by time travel, except that he now considers it reimbursable management experience.', talk: 'JOE: I saved four decades of company history.\nJOHN: You endangered four decades.\nJOE: That is why the invoice has four lines.' } },
  ],
};
