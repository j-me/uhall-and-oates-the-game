import { showCranePuzzle } from '../game-data/puzzles/crane.js';
import { showRecallClausePuzzle } from '../game-data/puzzles/recall-clause.js';
import { showStorageDirectoryPuzzle } from '../game-data/puzzles/storage-directory.js';
import { showVoiceMixerPuzzle } from '../game-data/puzzles/voice-mixer.js';
import { showWifflePuzzle } from '../game-data/puzzles/wiffle.js';

const verbs = [
  ['look', 'LOOK'], ['use', 'USE'], ['talk', 'TALK'], ['take', 'TAKE'],
];

export function createUI(root, callbacks) {
  const verbRoot = root.querySelector('#verbs');
  const inventoryRoot = root.querySelector('#inventory');
  const messageRoot = root.querySelector('#message');
  const speechRoot = root.querySelector('#speech');
  const sceneRoot = root.querySelector('#scene');
  const sceneIntroRoot = root.querySelector('#scene-intro');
  const sceneIntroKicker = root.querySelector('#scene-intro-kicker');
  const sceneIntroTitle = root.querySelector('#scene-intro-title');
  const sceneIntroCopy = root.querySelector('#scene-intro-copy');
  const sceneIntroNext = root.querySelector('#scene-intro-next');
  const sceneIntroRevealImage = sceneIntroRoot.querySelector('.crawl-reveal img');
  const sceneIntroRevealTagline = sceneIntroRoot.querySelector('.crawl-reveal strong');
  const inventoryCursor = document.createElement('div');
  inventoryCursor.className = 'inventory-cursor-ghost';
  inventoryCursor.setAttribute('aria-hidden', 'true');
  document.body.append(inventoryCursor);
  let selectedCursorItem = null;
  let pointerInsideGame = false;
  let pointerX = 0;
  let pointerY = 0;
  const supportsCursorGhost = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const positionInventoryCursor = () => {
    inventoryCursor.style.left = `${pointerX}px`;
    inventoryCursor.style.top = `${pointerY}px`;
  };
  root.addEventListener('pointermove', (event) => {
    pointerInsideGame = supportsCursorGhost && event.pointerType !== 'touch';
    pointerX = event.clientX;
    pointerY = event.clientY;
    positionInventoryCursor();
    inventoryCursor.classList.toggle('is-visible', Boolean(selectedCursorItem) && pointerInsideGame);
  });
  root.addEventListener('pointerleave', () => {
    pointerInsideGame = false;
    inventoryCursor.classList.remove('is-visible');
  });
  root.addEventListener('pointerenter', () => {
    pointerInsideGame = supportsCursorGhost;
    inventoryCursor.classList.toggle('is-visible', Boolean(selectedCursorItem));
  });

  verbs.forEach(([id, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.verb = id;
    button.addEventListener('click', () => callbacks.onVerb(id));
    verbRoot.append(button);
  });

  function render(state) {
    verbRoot.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('selected', button.dataset.verb === state.selectedVerb && !state.selectedItem);
    });
    inventoryRoot.replaceChildren();
    if (!state.inventory.length) inventoryRoot.innerHTML = '<span class="empty-slot">—</span>';
    state.inventory.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'item';
      button.title = item.label;
      button.dataset.label = item.label;
      button.setAttribute('aria-label', item.label);
      button.classList.toggle('selected', item.id === state.selectedItem);
      const illustration = document.createElement('span');
      illustration.className = `inventory-icon inventory-icon--${item.icon}`;
      illustration.setAttribute('aria-hidden', 'true');
      button.append(illustration);
      button.addEventListener('click', () => callbacks.onItem(item.id));
      inventoryRoot.append(button);
    });

    selectedCursorItem = state.inventory.find((item) => item.id === state.selectedItem) || null;
    inventoryCursor.replaceChildren();
    if (selectedCursorItem) {
      const icon = document.createElement('span');
      icon.className = `inventory-icon inventory-icon--${selectedCursorItem.icon}`;
      inventoryCursor.append(icon);
      inventoryCursor.title = selectedCursorItem.label;
      positionInventoryCursor();
    } else {
      inventoryCursor.removeAttribute('title');
    }
    inventoryCursor.classList.toggle('is-visible', Boolean(selectedCursorItem) && pointerInsideGame);
  }

  return {
    setChapter: (title) => { root.querySelector('#chapter-label').textContent = title; },
    clearCompletion: () => { root.querySelector('.chapter-complete')?.remove(); },
    showSceneIntro: (chapterTitle, scene, onEnter) => {
      sceneIntroKicker.textContent = chapterTitle.toUpperCase();
      sceneIntroTitle.textContent = scene.name;
      sceneIntroCopy.textContent = scene.intro || scene.caption;
      sceneIntroRevealImage.src = scene.reveal?.src || 'assets/art/ui/hall-oates-crawl-reveal-v1.png';
      sceneIntroRevealImage.alt = scene.reveal?.alt || 'Daryl Hall points toward the viewer beside John Oates';
      sceneIntroRevealTagline.textContent = scene.reveal?.tagline || 'You Can Go For That!';
      sceneIntroRoot.classList.remove('is-hidden');
      sceneIntroNext.onclick = () => {
        sceneIntroRoot.classList.add('is-hidden');
        onEnter?.();
      };
    },
    hideSceneIntro: () => {
      sceneIntroRoot.classList.add('is-hidden');
      sceneIntroNext.onclick = null;
    },
    message: (text) => { messageRoot.textContent = text; },
    speak: (text, hotspot) => {
      const x = hotspot.bounds.left + hotspot.bounds.width / 2;
      const y = hotspot.bounds.top;
      const below = y < 26;
      speechRoot.textContent = text;
      speechRoot.style.left = `${Math.min(82, Math.max(16, x))}%`;
      speechRoot.style.top = `${below ? Math.min(72, y + hotspot.bounds.height + 3) : Math.min(68, Math.max(5, y - 4))}%`;
      speechRoot.classList.toggle('is-below', below);
      speechRoot.classList.remove('is-visible');
      void speechRoot.offsetWidth;
      speechRoot.classList.add('is-visible');
    },
    clearSpeech: () => { speechRoot.classList.remove('is-visible'); },
    showCompletion: (text, onContinue, titleText) => {
      root.querySelector('.chapter-complete')?.remove();
      const panel = document.createElement('div');
      panel.className = 'chapter-complete';
      const title = document.createElement('strong');
      title.textContent = titleText || (onContinue ? 'CHAPTER LEAD FOUND' : 'CASE CLOSED (FOR NOW)');
      const summary = document.createElement('span');
      summary.textContent = text;
      panel.append(title, summary);
      if (onContinue) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'CONTINUE ›';
        button.addEventListener('click', onContinue);
        panel.append(button);
      }
      sceneRoot.append(panel);
    },
    showVideo: (src, onClose) => {
      root.querySelector('.video-overlay')?.remove();
      const overlay = document.createElement('div');
      overlay.className = 'video-overlay';
      const title = document.createElement('strong');
      title.textContent = 'UHALL & OATES PRESENTS';
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('aria-label', 'Uhall and Oates ending video');
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'RETURN TO THE GAME';
      let closed = false;
      const finish = () => {
        if (closed) return;
        closed = true;
        video.pause();
        overlay.remove();
        onClose?.();
      };
      close.addEventListener('click', finish);
      overlay.append(title, video, close);
      sceneRoot.append(overlay);
      video.play().catch(() => { /* Controls remain available when autoplay is blocked. */ });
    },
    showCranePuzzle: (options) => showCranePuzzle(root, options),
    showWifflePuzzle: (options) => showWifflePuzzle(root, options),
    showVoiceMixerPuzzle: (options) => showVoiceMixerPuzzle(root, options),
    showRecallClausePuzzle: (options) => showRecallClausePuzzle(root, options),
    showStorageDirectoryPuzzle: (options) => showStorageDirectoryPuzzle(root, options),
    render,
  };
}
