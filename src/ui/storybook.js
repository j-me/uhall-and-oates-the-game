import { showVideoOverlay } from './media.js';

export function createStorybook({ root, stories, onMediaStart, onMediaStop }) {
  const panel = root.querySelector('#story-panel');
  const book = panel.querySelector('.storybook');
  const pageElement = panel.querySelector('#storybook-page');
  const image = panel.querySelector('#storybook-image');
  const kicker = panel.querySelector('#storybook-kicker');
  const title = panel.querySelector('#storybook-page-title');
  const copy = panel.querySelector('#storybook-copy');
  const campaignNav = panel.querySelector('#storybook-campaigns');
  const previous = panel.querySelector('#storybook-previous');
  const next = panel.querySelector('#storybook-next');
  const progress = panel.querySelector('#storybook-progress');
  const campaignIds = Object.keys(stories);
  let campaignId = campaignIds[0];
  let pageIndex = 0;
  let turning = false;
  let turnTimer;
  let pointerStart;
  let storyAudio;
  let storyAudioMedia;
  let mediaButton;

  function currentStory() {
    return stories[campaignId];
  }

  function setMediaButton(button, media, playing = false) {
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = media.type === 'video' ? '▶' : (playing ? 'Ⅱ' : '♫');
    const label = document.createElement('b');
    label.textContent = playing ? `PAUSE “YOU’RE DOING IT”` : media.label;
    button.replaceChildren(icon, label);
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));
  }

  function stopStoryAudio({ resumeTitle = true } = {}) {
    if (!storyAudio) return;
    storyAudio.pause();
    storyAudio.currentTime = 0;
    storyAudio = undefined;
    if (mediaButton?.isConnected) setMediaButton(mediaButton, storyAudioMedia);
    storyAudioMedia = undefined;
    if (resumeTitle) onMediaStop?.();
  }

  function addMediaAction(page) {
    mediaButton = undefined;
    if (!page.media) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `storybook-media-action storybook-media-action--${page.media.type}`;
    setMediaButton(button, page.media);
    button.addEventListener('click', () => {
      if (page.media.type === 'video') {
        onMediaStart?.();
        panel.classList.add('is-hidden');
        showVideoOverlay(root, page.media.src, () => {
          panel.classList.remove('is-hidden');
          onMediaStop?.();
          button.focus();
        });
        return;
      }
      if (storyAudio && !storyAudio.paused) {
        storyAudio.pause();
        setMediaButton(button, page.media);
        onMediaStop?.();
        return;
      }
      if (!storyAudio) {
        storyAudio = new Audio(page.media.src);
        storyAudioMedia = page.media;
        storyAudio.preload = 'auto';
        storyAudio.addEventListener('ended', () => {
          storyAudio = undefined;
          storyAudioMedia = undefined;
          setMediaButton(button, page.media);
          onMediaStop?.();
        }, { once: true });
        storyAudio.addEventListener('error', () => {
          storyAudio = undefined;
          storyAudioMedia = undefined;
          button.disabled = true;
          button.querySelector('b').textContent = 'SONG UNAVAILABLE';
          onMediaStop?.();
        }, { once: true });
      }
      onMediaStart?.();
      storyAudio.play().then(() => setMediaButton(button, page.media, true)).catch(() => {
        button.querySelector('b').textContent = 'TAP TO PLAY AGAIN';
        onMediaStop?.();
      });
    });
    copy.append(button);
    mediaButton = button;
  }

  function paintPage() {
    stopStoryAudio();
    const story = currentStory();
    const page = story.pages[pageIndex];
    image.src = page.image;
    image.alt = page.alt;
    kicker.textContent = page.kicker;
    title.textContent = page.title;
    copy.replaceChildren(...page.paragraphs.map((paragraph) => {
      const element = document.createElement('p');
      element.textContent = paragraph;
      return element;
    }));
    addMediaAction(page);
    progress.textContent = `${story.title} · PAGE ${pageIndex + 1} OF ${story.pages.length}`;
    previous.disabled = pageIndex === 0;
    next.disabled = pageIndex === story.pages.length - 1;
    campaignNav.querySelectorAll('[data-story-campaign]').forEach((button) => {
      const selected = button.dataset.storyCampaign === campaignId;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function turnTo(nextIndex, direction) {
    if (turning || nextIndex < 0 || nextIndex >= currentStory().pages.length || nextIndex === pageIndex) return;
    turning = true;
    pageElement.classList.add(direction === 'previous' ? 'is-turning-back' : 'is-turning-forward');
    window.clearTimeout(turnTimer);
    turnTimer = window.setTimeout(() => {
      pageIndex = nextIndex;
      paintPage();
      pageElement.classList.remove('is-turning-back', 'is-turning-forward');
      pageElement.classList.add(direction === 'previous' ? 'has-turned-back' : 'has-turned-forward');
      window.setTimeout(() => {
        pageElement.classList.remove('has-turned-back', 'has-turned-forward');
        turning = false;
      }, 230);
    }, 210);
  }

  function chooseCampaign(nextCampaignId) {
    if (!stories[nextCampaignId] || turning) return;
    campaignId = nextCampaignId;
    pageIndex = 0;
    pageElement.classList.add('is-changing-volume');
    paintPage();
    window.setTimeout(() => pageElement.classList.remove('is-changing-volume'), 360);
  }

  function open() {
    campaignId = campaignIds[0];
    pageIndex = 0;
    turning = false;
    paintPage();
    panel.classList.remove('is-hidden');
    panel.querySelector('.storybook-close').focus();
  }

  function close() {
    stopStoryAudio();
    window.clearTimeout(turnTimer);
    turning = false;
    pageElement.classList.remove('is-turning-back', 'is-turning-forward', 'has-turned-back', 'has-turned-forward');
    panel.classList.add('is-hidden');
    root.querySelector('[data-open-story]')?.focus();
  }

  campaignNav.replaceChildren(...campaignIds.map((id) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.storyCampaign = id;
    button.textContent = stories[id].title;
    button.title = stories[id].subtitle;
    button.addEventListener('click', () => chooseCampaign(id));
    return button;
  }));

  root.querySelectorAll('[data-open-story]').forEach((button) => button.addEventListener('click', open));
  panel.querySelectorAll('[data-close-story]').forEach((button) => button.addEventListener('click', close));
  panel.addEventListener('click', (event) => { if (event.target === panel) close(); });
  previous.addEventListener('click', () => turnTo(pageIndex - 1, 'previous'));
  next.addEventListener('click', () => turnTo(pageIndex + 1, 'next'));
  pageElement.addEventListener('pointerdown', (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
  pageElement.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const horizontal = event.clientX - pointerStart.x;
    const vertical = Math.abs(event.clientY - pointerStart.y);
    pointerStart = undefined;
    if (vertical > Math.abs(horizontal) || Math.abs(horizontal) < 55) return;
    turnTo(pageIndex + (horizontal < 0 ? 1 : -1), horizontal < 0 ? 'next' : 'previous');
  });
  document.addEventListener('keydown', (event) => {
    if (panel.classList.contains('is-hidden')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') turnTo(pageIndex - 1, 'previous');
    if (event.key === 'ArrowRight') turnTo(pageIndex + 1, 'next');
  });

  paintPage();
  return { open, close };
}
