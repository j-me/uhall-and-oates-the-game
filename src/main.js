import { createGame } from './engine/game.js';
import { createAssetPreloader } from './engine/preloader.js';
import { chapters } from './game-data/registry.js';
import { createSettings } from './ui/settings.js';

const gameRoot = document.getElementById('game');
const titleScreen = document.getElementById('title-screen');
const introScreen = document.getElementById('intro-screen');
const introNext = document.getElementById('intro-next');
const titleMusic = document.getElementById('title-music');
let titleFallbackAttempted = false;
let settings;
const preloader = createAssetPreloader(chapters);
const chapterOneReady = preloader.preloadChapter('chapter-01');
const game = createGame({
  root: gameRoot,
  chapters,
  onReturnHome: showHomeScreen,
  onChapterStart(chapterId) {
    preloader.preloadChapter(chapterId);
    preloader.preloadNext(chapterId);
  },
});
titleMusic.volume = 0.34;

function startTitleMusic() {
  if (titleScreen.classList.contains('is-hidden') || !settings?.values.soundEnabled) return;
  titleMusic.play().catch(() => { /* A title-screen click retries playback when browser autoplay is blocked. */ });
}

function stopTitleMusic() {
  titleMusic.pause();
  titleMusic.currentTime = 0;
}

function showHomeScreen() {
  introScreen.classList.add('is-hidden');
  titleScreen.classList.remove('is-hidden');
  gameRoot.classList.toggle('debug-mode', settings.values.debugEnabled);
  startTitleMusic();
}

async function beginChapter() {
  const originalLabel = introNext.textContent;
  introNext.disabled = true;
  introNext.textContent = 'LOADING THE TRUCK…';
  await chapterOneReady;
  gameRoot.classList.toggle('debug-mode', settings.values.debugEnabled);
  introScreen.classList.add('is-hidden');
  introNext.disabled = false;
  introNext.textContent = originalLabel;
  game.start('chapter-01', 'old-orchard-pier', { showIntro: false });
}

document.getElementById('start-game').addEventListener('click', () => {
  gameRoot.classList.toggle('debug-mode', settings.values.debugEnabled);
  stopTitleMusic();
  titleScreen.classList.add('is-hidden');
  introScreen.classList.remove('is-hidden');
  game.playIntroSound();
});
startTitleMusic();
window.addEventListener('load', startTitleMusic, { once: true });
titleMusic.addEventListener('canplaythrough', startTitleMusic, { once: true });
titleMusic.addEventListener('error', () => {
  const fallback = titleMusic.dataset.fallbackSrc;
  if (titleFallbackAttempted || titleMusic.getAttribute('src') === fallback) return;
  titleFallbackAttempted = true;
  titleMusic.src = fallback;
  titleMusic.load();
  startTitleMusic();
});
titleScreen.addEventListener('pointerdown', startTitleMusic, { once: true });

settings = createSettings({
  root: gameRoot,
  onChange(values) {
    game.setSoundEnabled(values.soundEnabled);
    game.configureMusic({ mode: values.musicMode, urls: values.externalUrls });
    gameRoot.classList.toggle('debug-mode', values.debugEnabled);
    const titleSource = values.musicMode === 'original'
      ? titleMusic.dataset.fallbackSrc
      : values.externalUrls.title || 'assets/audio/music-local/title.mp3';
    if (titleMusic.getAttribute('src') !== titleSource) {
      titleFallbackAttempted = false;
      titleMusic.src = titleSource;
      titleMusic.load();
    }
    if (values.soundEnabled) startTitleMusic();
    else stopTitleMusic();
  },
  onDebugChapter(chapterId) {
    gameRoot.classList.add('debug-mode');
    stopTitleMusic();
    titleScreen.classList.add('is-hidden');
    introScreen.classList.add('is-hidden');
    game.debugStart(chapterId);
  },
});
startTitleMusic();
introNext.addEventListener('click', beginChapter);

// Useful during content development: inspect from DevTools without coupling game data to UI.
window.adventure = game;

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // The game remains fully playable when installation/offline support is unavailable.
    });
  });
}
