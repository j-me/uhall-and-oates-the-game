import { adultDarylSwitchboard } from '../scenes/adult-scene-daryl-switchboard.js';
import { adultJohnPayphone } from '../scenes/adult-scene-john-payphone.js';
import { adultMichaelConference } from '../scenes/adult-scene-michael-conference.js';

export const adultChapter06 = {
  id: 'adult-06',
  title: 'Chapter 6: Out of Touch-Tone',
  startScene: adultDarylSwitchboard.id,
  playableCharacters: [
    { id: 'daryl-hall', label: 'DARYL', year: '1987' },
    { id: 'john-oates', label: 'JOHN', year: '1993' },
    { id: 'michael-mcdonald', label: 'MICHAEL', year: '2001' },
  ],
  characterScenes: {
    'daryl-hall': adultDarylSwitchboard.id,
    'john-oates': adultJohnPayphone.id,
    'michael-mcdonald': adultMichaelConference.id,
  },
  scenes: {
    [adultDarylSwitchboard.id]: adultDarylSwitchboard,
    [adultJohnPayphone.id]: adultJohnPayphone,
    [adultMichaelConference.id]: adultMichaelConference,
  },
};
