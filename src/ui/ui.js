import { showPuzzle } from '../game-data/puzzles/registry.js';
import { getCharacterSprite } from '../game-data/characters.js';

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
  const controlsRoot = root.querySelector('.controls-row');
  const sequelTools = document.createElement('div');
  sequelTools.className = 'sequel-tools is-hidden';
  sequelTools.innerHTML = `
    <div class="character-rail">
      <div class="character-rail__header"><span class="inventory-label">ERA CREW</span><span class="character-guide" aria-live="polite"></span></div>
      <nav class="character-switcher" aria-label="Playable characters"></nav>
    </div>
    <div class="trunk-inventory-wrap">
      <div class="trunk-heading">
        <span class="maxima-icon" aria-hidden="true"><span></span></span>
        <span class="inventory-label">SHARED MAXIMA TRUNK</span>
        <small class="trunk-help"></small>
      </div>
      <div class="trunk-inventory" aria-label="Shared temporal trunk inventory"></div>
    </div>`;
  controlsRoot.before(sequelTools);
  const characterRoot = sequelTools.querySelector('.character-switcher');
  const characterGuide = sequelTools.querySelector('.character-guide');
  const trunkHelp = sequelTools.querySelector('.trunk-help');
  const trunkRoot = sequelTools.querySelector('.trunk-inventory');

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
    const availableCharacters = state.availableCharacters || [];
    sequelTools.classList.toggle('is-hidden', state.campaignId !== 'adult-relocation');
    sequelTools.classList.toggle('is-time-bridge', state.chapterId === 'adult-06');
    characterRoot.replaceChildren();
    const chapter06Guide = {
      'daryl-hall': '1987 · encode the handbook on the switchboard',
      'john-oates': '1993 · send the code through the payphone',
      'michael-mcdonald': '2001 · combine the pager and audit log',
    };
    const readyForEra = (characterId) => {
      if (state.chapterId !== 'adult-06') return true;
      if (characterId === 'daryl-hall') return true;
      if (characterId === 'john-oates') return Boolean(state.flags.darylCodeSent);
      if (characterId === 'michael-mcdonald') return Boolean(state.flags.johnCodeSent);
      return false;
    };
    characterGuide.textContent = state.chapterId === 'adult-06'
      ? (chapter06Guide[state.activeCharacterId] || 'Select an era to continue the handoff.')
      : 'Select a crew member when the story places them in another era.';
    availableCharacters.forEach((character) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.character = character.id;
      button.classList.toggle('selected', character.id === state.activeCharacterId);
      const portrait = document.createElement('span');
      portrait.className = 'character-switcher__portrait';
      const portraitImage = document.createElement('img');
      portraitImage.src = getCharacterSprite(character.id);
      portraitImage.alt = '';
      portraitImage.setAttribute('aria-hidden', 'true');
      portrait.append(portraitImage);
      const year = document.createElement('span');
      year.className = 'character-switcher__year';
      year.textContent = character.year || 'NOW';
      button.append(portrait, year);
      const ready = readyForEra(character.id);
      button.disabled = character.id === state.activeCharacterId || !ready;
      button.title = character.id === state.activeCharacterId
        ? `${character.label} is active in ${character.year}`
        : ready
          ? `Switch to ${character.label} in ${character.year}`
          : `Finish the previous era before switching to ${character.label}`;
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => callbacks.onCharacter?.(character.id));
      characterRoot.append(button);
    });
    trunkRoot.replaceChildren();
    const trunkItems = state.inventories?.trunk || [];
    const selectedItem = state.inventory.find((item) => item.id === state.selectedItem);
    trunkHelp.textContent = selectedItem
      ? `Return ${selectedItem.label}, or choose a trunk item.`
      : trunkItems.length
        ? 'Click an item to hand it to the active era.'
        : 'Select a carried item to place it here.';
    if (selectedItem && state.flags.trunkPortalOpen) {
      const returnButton = document.createElement('button');
      returnButton.type = 'button';
      returnButton.className = 'trunk-return';
      returnButton.textContent = `↩ PUT BACK: ${selectedItem.label}`;
      returnButton.title = `Return ${selectedItem.label} to the Maxima trunk`;
      returnButton.setAttribute('aria-label', returnButton.title);
      returnButton.addEventListener('click', () => callbacks.onTrunkDeposit?.(selectedItem.id));
      trunkRoot.append(returnButton);
    }
    if (!trunkItems.length && !selectedItem) trunkRoot.innerHTML = '<span class="empty-slot">—</span>';
    trunkItems.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'item';
      button.dataset.label = item.label;
      button.title = `Retrieve ${item.label}`;
      button.setAttribute('aria-label', `Retrieve ${item.label} from the Maxima trunk`);
      const illustration = document.createElement('span');
      illustration.className = `inventory-icon inventory-icon--${item.icon}`;
      illustration.setAttribute('aria-hidden', 'true');
      button.append(illustration);
      button.addEventListener('click', () => callbacks.onTrunkItem?.(item.id));
      trunkRoot.append(button);
    });
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
      button.dataset.itemId = item.id;
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
      sceneIntroRevealImage.src = scene.reveal?.src || 'assets/art/campaigns/original/reveals/hall-oates-crawl-reveal-v1.png';
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
    showCompletion: (text, onContinue, titleText, onReturnHome) => {
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
      if (onReturnHome) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'RETURN TO HOME';
        button.addEventListener('click', onReturnHome);
        panel.append(button);
      }
      sceneRoot.append(panel);
    },
    showPerformance: ({ src, title, kicker, alt, audio, fallbackAudio, duration = 0, lyrics = [], readyAfter = 4600, soundEnabled = true }, onClose) => {
      root.querySelector('.final-performance')?.remove();
      const overlay = document.createElement('div');
      overlay.className = 'final-performance';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', `${title} finale performance`);

      const image = document.createElement('img');
      image.className = 'final-performance__art';
      image.src = src;
      image.alt = alt || 'John Oates and Daryl Hall performing music together';

      const copy = document.createElement('div');
      copy.className = 'final-performance__copy';
      const small = document.createElement('span');
      small.textContent = kicker || 'A NEW UHALL & OATES ORIGINAL';
      const heading = document.createElement('strong');
      heading.textContent = title;
      copy.append(small, heading);

      const notes = document.createElement('div');
      notes.className = 'final-performance__notes';
      ['♪', '♫', '♪', '♬', '♫'].forEach((note) => {
        const symbol = document.createElement('i');
        symbol.textContent = note;
        notes.append(symbol);
      });

      const equalizer = document.createElement('div');
      equalizer.className = 'final-performance__equalizer';
      Array.from({ length: 18 }, () => document.createElement('i')).forEach((bar) => equalizer.append(bar));

      const lyricViewport = document.createElement('div');
      lyricViewport.className = 'final-performance__lyrics';
      lyricViewport.setAttribute('aria-label', 'Song lyrics');
      const lyricTrack = document.createElement('div');
      lyricTrack.className = 'final-performance__lyrics-track';
      const lyricSections = lyrics.map(({ section, lines }) => {
        const block = document.createElement('section');
        const label = document.createElement('strong');
        label.textContent = section;
        block.append(label);
        lines.forEach((line) => {
          const row = document.createElement('p');
          row.textContent = line;
          block.append(row);
        });
        lyricTrack.append(block);
        return block;
      });
      lyricViewport.append(lyricTrack);

      const song = audio && soundEnabled ? document.createElement('audio') : null;
      if (song) {
        song.src = audio;
        song.preload = 'auto';
        song.playsInline = true;
      }

      const audioToggle = document.createElement('button');
      audioToggle.type = 'button';
      audioToggle.className = 'final-performance__audio-toggle';
      audioToggle.textContent = '▶ PLAY SONG';
      audioToggle.hidden = !song;

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'final-performance__close';
      close.textContent = 'SKIP TO THE ENCORE ›';
      let closed = false;
      let frameId = 0;
      let readyTimer = 0;
      let triedFallback = false;
      let activeLyricIndex = -1;
      const lyricLineCounts = lyrics.map(({ lines }) => Math.max(1, lines.length));
      const totalLyricLines = lyricLineCounts.reduce((sum, count) => sum + count, 0);
      const setPlaying = (playing) => {
        overlay.classList.toggle('is-playing', playing);
        audioToggle.textContent = playing ? '❚❚ PAUSE SONG' : '▶ PLAY SONG';
      };
      const markReady = () => {
        if (!overlay.isConnected) return;
        overlay.classList.add('is-ready');
        close.textContent = 'TAKE A BOW ›';
      };
      const updateLyrics = () => {
        if (!song || !lyrics.length || closed) return;
        const total = Number.isFinite(song.duration) ? song.duration : duration;
        const progress = total > 0 ? Math.min(1, Math.max(0, song.currentTime / total)) : 0;
        const hasCueSheet = lyrics.every((entry) => Number.isFinite(entry.start));
        let nextIndex = 0;
        if (hasCueSheet) {
          for (let index = 0; index < lyrics.length; index += 1) {
            if (song.currentTime >= lyrics[index].start) nextIndex = index;
            else break;
          }
        } else {
          const lyricPosition = progress * totalLyricLines;
          let accumulatedLines = 0;
          nextIndex = lyricSections.length - 1;
          for (let index = 0; index < lyricLineCounts.length; index += 1) {
            accumulatedLines += lyricLineCounts[index];
            if (lyricPosition < accumulatedLines) { nextIndex = index; break; }
          }
        }
        if (nextIndex !== activeLyricIndex) {
          activeLyricIndex = nextIndex;
          lyricSections.forEach((entry, index) => entry.classList.toggle('is-current', index === activeLyricIndex));
        }
        const sectionOffset = (index) => {
          const section = lyricSections[index];
          const desired = section.offsetTop + section.offsetHeight / 2 - lyricViewport.clientHeight / 2;
          const maximum = Math.max(0, lyricTrack.scrollHeight - lyricViewport.clientHeight);
          return Math.min(maximum, Math.max(0, desired));
        };
        let offset = sectionOffset(activeLyricIndex);
        if (hasCueSheet && activeLyricIndex < lyrics.length - 1) {
          const cueStart = lyrics[activeLyricIndex].start;
          const cueEnd = lyrics[activeLyricIndex + 1].start;
          const cueProgress = Math.min(1, Math.max(0, (song.currentTime - cueStart) / (cueEnd - cueStart)));
          const travelProgress = Math.min(1, Math.max(0, (cueProgress - .18) / .64));
          const easedProgress = travelProgress * travelProgress * (3 - 2 * travelProgress);
          offset += (sectionOffset(activeLyricIndex + 1) - offset) * easedProgress;
        }
        lyricTrack.style.transform = `translateY(${-offset}px)`;
        frameId = window.requestAnimationFrame(updateLyrics);
      };
      const playSong = () => {
        if (!song) return;
        song.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      };
      const finish = () => {
        if (closed) return;
        closed = true;
        window.clearTimeout(readyTimer);
        window.cancelAnimationFrame(frameId);
        song?.pause();
        overlay.classList.add('is-closing');
        window.setTimeout(() => {
          overlay.remove();
          onClose?.();
        }, 320);
      };
      close.addEventListener('click', finish);
      audioToggle.addEventListener('click', () => {
        if (!song) return;
        if (song.paused) playSong();
        else song.pause();
      });
      song?.addEventListener('play', () => setPlaying(true));
      song?.addEventListener('pause', () => setPlaying(false));
      song?.addEventListener('ended', () => {
        setPlaying(false);
        markReady();
      });
      song?.addEventListener('error', () => {
        if (fallbackAudio && !triedFallback) {
          triedFallback = true;
          song.src = fallbackAudio;
          song.load();
          playSong();
        } else {
          audioToggle.textContent = 'SONG UNAVAILABLE';
          audioToggle.disabled = true;
          readyTimer = window.setTimeout(markReady, readyAfter);
        }
      });
      overlay.append(image, notes, copy, lyricViewport, equalizer, audioToggle, close);
      sceneRoot.append(overlay);
      close.focus({ preventScroll: true });
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (song) {
        frameId = window.requestAnimationFrame(updateLyrics);
        playSong();
      } else {
        readyTimer = window.setTimeout(markReady, reducedMotion ? 0 : readyAfter);
      }
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
    showPuzzle: (id, options) => showPuzzle(id, root, options),
    render,
  };
}
