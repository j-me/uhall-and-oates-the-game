import { closePuzzle, createPuzzleOverlay } from '../shared/shared-puzzle-overlay.js';

const lanes = [
  { symbol: '←', key: 'ArrowLeft', alt: 'a', label: 'JOHN' },
  { symbol: '↓', key: 'ArrowDown', alt: 's', label: 'DARYL' },
  { symbol: '↑', key: 'ArrowUp', alt: 'k', label: 'BOTH' },
  { symbol: '→', key: 'ArrowRight', alt: 'l', label: 'FINISH' },
];
const pattern = [0, 1, 0, 2, 1, 3, 0, 1, 2, 3, 2, 3];

export function showRhythmRehearsalPuzzle(root, {
  title = 'ONE ON ONE REHEARSAL',
  subtitle = 'SHARE THE BEAT',
  clue,
  successMessage,
  onHit,
  onMiss,
  onWin,
}) {
  const overlay = createPuzzleOverlay(root, {
    className: 'rhythm-puzzle',
    label: `${title} rhythm puzzle`,
    html: `
      <header class="rhythm-puzzle__header"><strong>${title}</strong><span>${subtitle}</span></header>
      <p class="rhythm-puzzle__clue">${clue}</p>
      <div class="rhythm-puzzle__stage">
        <div class="rhythm-puzzle__tracks">
          ${lanes.map((lane, index) => `<button type="button" class="rhythm-lane rhythm-lane--${index}" data-lane="${index}" aria-label="${lane.label} ${lane.symbol}"><b>${lane.label}</b><span>${lane.symbol}</span></button>`).join('')}
          <div class="rhythm-hit-line"><span>HIT</span></div>
          <div class="rhythm-notes" aria-hidden="true"></div>
        </div>
      </div>
      <div class="rhythm-puzzle__score" aria-live="polite"><b>READY</b><span>0 / ${pattern.length}</span></div>
      <p class="rhythm-puzzle__status" aria-live="polite">Tap START, then use the lanes, ← ↓ ↑ →, or A S K L.</p>
      <div class="rhythm-puzzle__actions"><button type="button" class="rhythm-start">START REHEARSAL</button><button type="button" class="rhythm-exit">BACK TO SCENE</button></div>`,
  });

  const track = overlay.querySelector('.rhythm-puzzle__tracks');
  const noteRoot = overlay.querySelector('.rhythm-notes');
  const scoreLabel = overlay.querySelector('.rhythm-puzzle__score span');
  const verdict = overlay.querySelector('.rhythm-puzzle__score b');
  const status = overlay.querySelector('.rhythm-puzzle__status');
  const startButton = overlay.querySelector('.rhythm-start');
  let notes = [];
  let running = false;
  let frame = 0;
  let hitCount = 0;
  let resolvedCount = 0;

  function cleanup() {
    window.cancelAnimationFrame(frame);
    document.removeEventListener('keydown', onKeyDown);
  }

  function finish() {
    running = false;
    window.cancelAnimationFrame(frame);
    if (hitCount >= 9) {
      verdict.textContent = 'TOGETHER';
      status.textContent = successMessage;
      overlay.classList.add('is-solved');
      startButton.disabled = true;
      window.setTimeout(() => { cleanup(); closePuzzle(overlay); onWin?.(); }, 1100);
      return;
    }
    verdict.textContent = 'RETAKE';
    status.textContent = `${hitCount} clean notes. Reach 9; nothing was consumed, so take it from the top.`;
    startButton.textContent = 'TRY AGAIN';
    startButton.disabled = false;
    overlay.classList.add('is-wrong');
    onMiss?.();
  }

  function resolveNote(note, hit) {
    if (note.resolved) return;
    note.resolved = true;
    resolvedCount += 1;
    note.element.classList.add(hit ? 'is-hit' : 'is-missed');
    if (hit) {
      hitCount += 1;
      verdict.textContent = hitCount >= 9 ? 'LOCKED IN' : 'GOOD';
      onHit?.();
    }
    scoreLabel.textContent = `${hitCount} / ${pattern.length}`;
    if (resolvedCount === pattern.length) window.setTimeout(finish, 380);
  }

  function pressLane(laneIndex) {
    if (!running) return;
    const now = performance.now();
    const candidate = notes
      .filter((note) => !note.resolved && note.lane === laneIndex)
      .sort((a, b) => Math.abs(a.hitAt - now) - Math.abs(b.hitAt - now))[0];
    if (candidate && Math.abs(candidate.hitAt - now) <= 330) {
      resolveNote(candidate, true);
      overlay.querySelector(`[data-lane="${laneIndex}"]`).classList.add('is-pressed');
      window.setTimeout(() => overlay.querySelector(`[data-lane="${laneIndex}"]`)?.classList.remove('is-pressed'), 120);
      return;
    }
    verdict.textContent = 'WAIT FOR IT';
  }

  function animate(now) {
    if (!running) return;
    // A note begins with its center at -21px (top:-38 plus half its height).
    // Moving it by trackHeight-37 places that center exactly on the hit line,
    // which sits 58px above the bottom of the track.
    const targetY = Math.max(120, track.clientHeight - 37);
    notes.forEach((note) => {
      if (note.resolved) return;
      const progress = (now - note.spawnAt) / (note.hitAt - note.spawnAt);
      note.element.style.transform = `translate3d(0, ${Math.max(-44, Math.min(targetY + 50, progress * targetY))}px, 0)`;
      if (now - note.hitAt > 360) resolveNote(note, false);
    });
    frame = window.requestAnimationFrame(animate);
  }

  function start() {
    noteRoot.replaceChildren();
    overlay.classList.remove('is-wrong', 'is-solved');
    hitCount = 0;
    resolvedCount = 0;
    scoreLabel.textContent = `0 / ${pattern.length}`;
    verdict.textContent = 'COUNT IN';
    status.textContent = 'Follow the falling notes. The gold line is deliberately forgiving.';
    startButton.disabled = true;
    startButton.textContent = 'PLAYING…';
    const now = performance.now();
    notes = pattern.map((lane, index) => {
      const element = document.createElement('i');
      element.className = `rhythm-note rhythm-note--${lane}`;
      element.textContent = lanes[lane].symbol;
      element.style.left = `${lane * 25 + 12.5}%`;
      noteRoot.append(element);
      const hitAt = now + 1500 + index * 610;
      return { lane, element, hitAt, spawnAt: hitAt - 1750, resolved: false };
    });
    running = true;
    frame = window.requestAnimationFrame(animate);
  }

  function onKeyDown(event) {
    const index = lanes.findIndex((lane) => lane.key === event.key || lane.alt === event.key.toLowerCase());
    if (index < 0) return;
    event.preventDefault();
    pressLane(index);
  }

  overlay.querySelectorAll('[data-lane]').forEach((button) => button.addEventListener('pointerdown', () => pressLane(Number(button.dataset.lane))));
  startButton.addEventListener('click', start);
  overlay.querySelector('.rhythm-exit').addEventListener('click', () => { cleanup(); closePuzzle(overlay); });
  overlay.addEventListener('keydown', (event) => { if (event.key === 'Escape') { cleanup(); closePuzzle(overlay); } });
  document.addEventListener('keydown', onKeyDown);
  startButton.focus();
}
