export const finalArt = 'assets/art/campaigns/finale';

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
