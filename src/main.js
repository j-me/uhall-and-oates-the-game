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
const continueOriginal = document.getElementById('continue-original');
const continueSequel = document.getElementById('continue-sequel');
const startFinale = document.getElementById('start-finale');
const continueFinale = document.getElementById('continue-finale');
const titleMusic = document.getElementById('title-music');
let titleMusicCandidates = [];
let titleMusicCandidate = 0;
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

function configureTitleMusic(candidates) {
  titleMusicCandidates = [...new Set(candidates.filter(Boolean))];
  titleMusicCandidate = 0;
  const source = titleMusicCandidates[titleMusicCandidate];
  if (source && titleMusic.getAttribute('src') !== source) {
    titleMusic.src = source;
    titleMusic.load();
  }
}

function campaignIsUnlocked(campaignId) {
  if (settings?.values.debugEnabled) return true;
  const requirement = campaigns[campaignId]?.requiresCampaign;
  return !requirement || game.isCampaignComplete(requirement);
}

function updateCampaignLocks() {
  const sequelUnlocked = campaignIsUnlocked('adult-relocation');
  const finaleUnlocked = campaignIsUnlocked('finale');
  const sequelComplete = game.isCampaignComplete('adult-relocation');
  const finaleComplete = game.isCampaignComplete('finale');
  continueOriginal.classList.toggle('is-hidden', game.isCampaignComplete('original') || !game.hasSave('original'));
  [startSequel, continueSequel].forEach((button) => {
    button.disabled = !sequelUnlocked;
    button.title = sequelUnlocked ? '' : 'Complete The Original Game to unlock Adult Relocation';
  });
  [startFinale, continueFinale].forEach((button) => {
    button.disabled = !finaleUnlocked;
    button.title = finaleUnlocked ? '' : 'Complete Adult Relocation to unlock The Sound of Moving On';
  });
  startSequel.textContent = sequelUnlocked ? 'PLAY ADULT RELOCATION' : '🔒 LOCKED';
  startFinale.textContent = finaleUnlocked ? 'PLAY THE SOUND OF MOVING ON' : '🔒 LOCKED';
  continueSequel.classList.toggle('is-hidden', sequelComplete || !game.hasSave('adult-relocation'));
  continueFinale.classList.toggle('is-hidden', finaleComplete || !game.hasSave('finale'));
}

function continueSavedCampaign(campaignId) {
  stopTitleMusic();
  titleScreen.classList.add('is-hidden');
  introScreen.classList.add('is-hidden');
  if (!game.continueCampaign(campaignId)) showHomeScreen();
}

function showHomeScreen() {
  introScreen.classList.add('is-hidden');
  titleScreen.classList.remove('is-hidden');
  gameRoot.classList.toggle('debug-mode', settings.values.debugEnabled);
  updateCampaignLocks();
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
  if (!campaignIsUnlocked(campaignId)) return;
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
  } else if (campaignId === 'finale') {
    openingCrawlCopy.innerHTML = `
      <p class="intro-kicker">THE UHALL DEPOT · 2008</p>
      <h1>THE SOUND OF<br />MOVING ON</h1>
      <p>The timeline is repaired. The moving company is not.</p>
      <p>A label hidden in Joe Timmins’s revised handbook leads John and Daryl to an unopened rehearsal reel from before Uhall &amp; Oates moved its first sofa.</p>
      <p>Joe has already sold their comeback as a cardboard-sponsored anniversary commercial. Jesse and Joe Reardon have one final clause designed to make the company more important than the music.</p>
      <p>John and Daryl have rescued each other from contracts, crates, and time. Now they must decide what they actually want to do.</p>`;
    introNext.textContent = 'BEGIN THE FINAL CAMPAIGN ›';
  } else {
    openingCrawlCopy.innerHTML = originalCrawl;
    introNext.textContent = 'BEGIN CHAPTER 1 ›';
  }
  introScreen.classList.remove('is-hidden');
  game.playIntroSound();
}

document.getElementById('start-game').addEventListener('click', () => showCampaignIntro('original'));
continueOriginal.addEventListener('click', () => continueSavedCampaign('original'));
startSequel.addEventListener('click', () => showCampaignIntro('adult-relocation'));
continueSequel.addEventListener('click', () => {
  if (!campaignIsUnlocked('adult-relocation')) return;
  continueSavedCampaign('adult-relocation');
});
startFinale.addEventListener('click', () => showCampaignIntro('finale'));
continueFinale.addEventListener('click', () => {
  if (!campaignIsUnlocked('finale')) return;
  continueSavedCampaign('finale');
});
startTitleMusic();
window.addEventListener('load', startTitleMusic, { once: true });
titleMusic.addEventListener('canplaythrough', startTitleMusic, { once: true });
titleMusic.addEventListener('error', () => {
  titleMusicCandidate += 1;
  const fallback = titleMusicCandidates[titleMusicCandidate];
  if (!fallback) return;
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
    updateCampaignLocks();
    const titleSources = musicSources('title');
    configureTitleMusic(values.musicMode === 'original'
      ? [titleSources.original]
      : [values.externalUrls.title, titleSources.local, titleSources.original]);
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
updateCampaignLocks();
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
