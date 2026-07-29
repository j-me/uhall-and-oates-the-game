import { originalCampaign } from './campaigns/original/original-campaign.js';
import { adultRelocationCampaign } from './campaigns/adult-relocation/adult-campaign.js';

export const campaigns = {
  [originalCampaign.id]: originalCampaign,
  [adultRelocationCampaign.id]: adultRelocationCampaign,
};

// Compatibility export for the original campaign while the sequel engine is
// introduced. Existing authoring scripts can continue importing `chapters`.
export const chapters = originalCampaign.chapters;
