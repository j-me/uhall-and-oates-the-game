import { placeCharacter } from '../../../characters.js';
import { finalArt as art, item, next, puzzle } from './final-scene-helpers.js';

export const finalCommercialStudio = {
  id: 'final-commercial-studio', playerId: 'john-oates',
  name: 'I Can’t Go for That (Jingle)',
  caption: 'Los Angeles: where even silence has a sponsor and a usage fee.',
  intro: 'Joe has sold the anniversary performance as a national moving commercial. The Reardons’ brand console will replace every unsponsored sound with slogans unless John can satisfy its cue sheet harmlessly.',
  opening: 'HUEY: My trucks are listed as “plausible blame.” Again.\nJOHN: Welcome back to the news.',
  reveal: { src: `${art}/chapters/final-04/commercial-studio-v1.png`, alt: 'A glossy Los Angeles commercial studio with oversized audio cartridge controls', tagline: 'No Can Do, Jingle Man.' },
  background: `${art}/chapters/final-04/commercial-studio-v1.png`,
  characters: [
    placeCharacter('john-oates', { pose: 'worried', bounds: { left: 54, top: 45, width: 14, height: 47 } }),
    placeCharacter('jesse-reardon', { bounds: { left: 69, top: 35, width: 10, height: 35 } }),
    placeCharacter('joe-reardon', { bounds: { left: 79, top: 36, width: 9, height: 34 } }),
    placeCharacter('huey-lewis', { bounds: { left: 88, top: 38, width: 11, height: 40 } }),
  ],
  decorations: [
    { src: `${art}/items/blank-cue-card-v1.png`, alt: '', className: 'scene-decoration--prop', bounds: { left: 68, top: 73, width: 15, height: 18 }, hiddenWhen: ['blank-cue-cardTaken'] },
  ],
  hotspots: [
    { id: 'blank-cue-card', label: 'blank production cue card', bounds: { left: 68, top: 73, width: 15, height: 18 }, item: item('blankCueCard', 'blank production cue card', 'final-cue-card'), hiddenWhen: ['blank-cue-cardTaken'], responses: { look: 'A loose four-box cue card beside the printer, with no room for a slogan.', take: 'John takes the card. Joe will invoice the whitespace.' } },
    { id: 'brand-harmony-console', label: 'Reardon brand-harmony console', bounds: { left: 0, top: 38, width: 53, height: 31 }, responses: { look: 'The enormous purple console has an empty cue-card slot. Its printed compliance legend accepts applause, studio tone, reverse warnings, and an invoice stamp.' }, useWith: {
      blankCueCard: { removeItems: ['blankCueCard'], setFlags: ['cueCardLoaded'], clearSelection: true, success: true, effect: 'customs', message: 'John feeds the blank card into the console. Four harmless production cues can now satisfy its compliance checklist.' },
      fullRehearsalMix: { requires: ['cueCardLoaded'], missing: 'The rehearsal mix needs a blank four-box cue card loaded into the console first.', puzzle: 'brandBypass', puzzleData: puzzle('BRAND HARMONY CONSOLE', 'SATISFY THE CUES · SAVE THE SONG', 'Fill the loaded card with ordinary production sounds. The console’s own legend supplies the four harmless choices.', [
      { label: 'OPEN', options: ['Applause', 'Cardboard slogan', 'Joe speaking'], answer: 'Applause' },
      { label: 'BED', options: ['Studio tone', 'Sales pitch', 'Forklift solo'], answer: 'Studio tone' },
      { label: 'SAFETY', options: ['Reverse warning', 'Brand chant', 'Silence'], answer: 'Reverse warning' },
      { label: 'CLOSE', options: ['Invoice stamp', 'Reardon motto', 'Joe speaking louder'], answer: 'Invoice stamp' },
    ], 'The console marks the commercial cues complete and leaves one unsponsored live channel open.', 'final-brand-console'), removeItems: ['fullRehearsalMix'], give: [item('cleanLiveMix', 'unsponsored live rehearsal mix', 'final-clean-live-mix'), item('broadcastRouteCard', 'Old Orchard broadcast route card', 'final-route-card')], setFlags: ['brandBypassed'], clearSelection: true, success: true, effect: 'customs', complete: 'Huey pockets the route card, then returns it after negotiating top billing in the transportation acknowledgments.', next: next('final-05', 'final-rehearsal-tent'), message: 'The machine believes the advertisement is finished. John quietly reserves the unsponsored channel for music.' },
    } },
    { id: 'huey-final-studio', label: 'Huey Lewis', bounds: { left: 88, top: 38, width: 11, height: 40 }, responses: { look: 'Huey is holding several pages of bad news about his fleet.', talk: 'HUEY: I can block the sponsor trucks. This is not a partnership.\nJOHN: It is cooperation.\nHUEY: Worse. Put it in tiny print.' } },
    { id: 'reardon-brand-team', label: 'Jesse and Joe Reardon', bounds: { left: 69, top: 35, width: 19, height: 35 }, responses: { look: 'The Reardons have become undersized consultants to the machine they once owned.', talk: 'JESSE: Authenticity tests poorly.\nJOE REARDON: It also refuses to fit in a cartridge.' } },
  ],
};
