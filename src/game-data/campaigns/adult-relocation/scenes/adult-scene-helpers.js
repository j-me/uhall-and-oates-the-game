export const adultArt = 'assets/art/campaigns/adult-relocation';

export const item = (id, label, icon) => ({ id, label, icon });

export const next = (chapterId, sceneId) => ({ chapterId, sceneId });

export const puzzle = (title, subtitle, clue, controls, successMessage, effectClass) => ({
  title,
  subtitle,
  clue,
  controls,
  successMessage,
  effectClass,
});
