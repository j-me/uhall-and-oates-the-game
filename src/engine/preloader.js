import { musicSources } from '../game-data/audio/audio-manifest.js';

const imagePattern = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const audioPattern = /\.(?:m4a|mp3|ogg|wav)(?:[?#].*)?$/i;

const supplementalAssets = {
  'chapter-01': [
    'assets/art/campaigns/original/chapters/chapter-01/crane-cabinet-interior-v2.png',
    'assets/art/campaigns/original/chapters/chapter-01/crane-claw-v1.png',
    'assets/art/campaigns/original/chapters/chapter-01/crane-fries-v1.png',
  ],
  'chapter-03': [
    'assets/art/campaigns/original/chapters/chapter-03/jacuzzi-wiffle-launcher-field-v1.png',
    'assets/art/campaigns/original/chapters/chapter-03/wiffle-ball-v1.png',
  ],
};

function collectAssetPaths(value, assets = new Set(), visited = new WeakSet()) {
  if (typeof value === 'string') {
    if (imagePattern.test(value) || audioPattern.test(value)) assets.add(value);
    return assets;
  }
  if (!value || typeof value !== 'object' || visited.has(value)) return assets;
  visited.add(value);
  Object.values(value).forEach((entry) => collectAssetPaths(entry, assets, visited));
  return assets;
}

function preloadImage(src) {
  if (typeof Image === 'undefined') return Promise.resolve();
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
    if (image.complete) resolve();
  });
}

function preloadAudio(src, retainedAudio) {
  if (typeof Audio === 'undefined') return Promise.resolve();
  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      audio.removeEventListener('canplaythrough', finish);
      audio.removeEventListener('error', finish);
      resolve();
    };
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', finish, { once: true });
    audio.addEventListener('error', finish, { once: true });
    audio.src = src;
    retainedAudio.add(audio);
    audio.load();
    window.setTimeout(finish, 8000);
  });
}

export function createAssetPreloader(campaigns) {
  const pending = new Map();
  const retainedAudio = new Set();
  const campaignList = Object.values(campaigns);
  const chapterRegistry = Object.fromEntries(campaignList.flatMap((campaign) => Object.entries(campaign.chapters)));
  const chapterOrder = campaignList.flatMap((campaign) => campaign.chapterOrder);

  function preloadChapter(chapterId) {
    if (pending.has(chapterId)) return pending.get(chapterId);
    const chapter = chapterRegistry[chapterId];
    if (!chapter) return Promise.resolve();
    const assets = collectAssetPaths(chapter);
    (supplementalAssets[chapterId] || []).forEach((src) => assets.add(src));
    assets.add(musicSources(chapterId).original);

    const request = Promise.allSettled([...assets].map((src) =>
      imagePattern.test(src) ? preloadImage(src) : preloadAudio(src, retainedAudio)
    ));
    pending.set(chapterId, request);
    return request;
  }

  function preloadNext(chapterId) {
    const nextId = chapterOrder[chapterOrder.indexOf(chapterId) + 1];
    if (!nextId) return Promise.resolve();
    const run = () => preloadChapter(nextId);
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
      return Promise.resolve();
    }
    window.setTimeout(run, 300);
    return Promise.resolve();
  }

  return { preloadChapter, preloadNext };
}
