import { createGame } from './engine/game.js';
import { createAssetPreloader } from './engine/preloader.js';
import { campaigns, chapters } from './game-data/registry.js';
import { createSettings } from './ui/settings.js';
import { musicSources } from './game-data/audio/audio-manifest.js';

const gameRoot = document.getElementById('game');
const titleScreen = document.getElementById('title-screen');
const introScreen = document.getElementById('intro-screen');
const introNext = document.getElementById('intro-next');
const openingCrawlCopy = document.getElementById('opening-crawl-copy');
const startSequel = document.getElementById('start-sequel');
const continueSequel = document.getElementById('continue-sequel');
const titleMusic = document.getElementById('title-music');
let titleFallbackAttempted = false;
let settings;
const preloader = createAssetPreloader(campaigns);
const originalCrawl = openingCrawlCopy.innerHTML;
let selectedCampaignId = 'original';
let selectedCampaignReady = preloader.preloadChapter('chapter-01');
const game = createGame({
  root: gameRoot,
  campaigns,
  defaultCampaignId: 'original',
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
  continueSequel.classList.toggle('is-hidden', !game.hasSave('adult-relocation'));
  startTitleMusic();
}

async function beginChapter() {
  const originalLabel = introNext.textContent;
  introNext.disabled = true;
  introNext.textContent = 'LOADING THE TRUCK…';
  await selectedCampaignReady;
  gameRoot.classList.toggle('debug-mode', settings.values.debugEnabled);
  introScreen.classList.add('is-hidden');
  introNext.disabled = false;
  introNext.textContent = originalLabel;
  const campaign = campaigns[selectedCampaignId];
  game.start(campaign.startChapter, campaign.startScene, { showIntro: false });
}

function showCampaignIntro(campaignId) {
  selectedCampaignId = campaignId;
  const campaign = game.selectCampaign(campaignId);
  selectedCampaignReady = preloader.preloadChapter(campaign.startChapter);
  gameRoot.classList.toggle('debug-mode', settings.values.debugEnabled);
  stopTitleMusic();
  titleScreen.classList.add('is-hidden');
  if (campaignId === 'adult-relocation') {
    openingCrawlCopy.innerHTML = `
      <p class="intro-kicker">THE FORKS, MAINE · 1986… APPARENTLY</p>
      <h1>ADULT RELOCATION</h1>
      <p>The rescue is complete. The paperwork is not.</p>
      <p>Joe Timmins orders John into the trunk of a gold 1993 Maxima—a vehicle that should not exist for another seven years.</p>
      <p>A surviving Reardon crate hums beneath the spare tire. Its Catalog Relocation Unit classifies musicians, movers and management materials as company property.</p>
      <p>One broken cassette adapter later, John reaches 1993, Daryl lands in 1987, Michael McDonald wakes in 2001, and Joe demands that everyone finish the delivery before overtime begins.</p>`;
    introNext.textContent = 'BEGIN ADULT RELOCATION ›';
  } else {
    openingCrawlCopy.innerHTML = originalCrawl;
    introNext.textContent = 'BEGIN CHAPTER 1 ›';
  }
  introScreen.classList.remove('is-hidden');
  game.playIntroSound();
}

document.getElementById('start-game').addEventListener('click', () => showCampaignIntro('original'));
startSequel.addEventListener('click', () => showCampaignIntro('adult-relocation'));
continueSequel.addEventListener('click', () => {
  stopTitleMusic();
  titleScreen.classList.add('is-hidden');
  introScreen.classList.add('is-hidden');
  game.continueCampaign('adult-relocation');
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
    const titleSources = musicSources('title');
    const titleSource = values.musicMode === 'original'
      ? titleSources.original
      : values.externalUrls.title || titleSources.local;
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
