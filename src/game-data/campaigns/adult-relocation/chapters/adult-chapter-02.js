import { adultReardonResort } from '../scenes/adult-scene-reardon-resort.js';
import { adultCopierRoom } from '../scenes/adult-scene-copier-room.js';

export const adultChapter02 = {
  id: 'adult-02',
  title: 'Chapter 2: Adult Education in the Danger Zone',
  year: '1987',
  playerId: 'daryl-hall',
  playerLabel: 'DARYL',
  startScene: adultReardonResort.id,
  scenes: {
    [adultReardonResort.id]: adultReardonResort,
    [adultCopierRoom.id]: adultCopierRoom,
  },
};
