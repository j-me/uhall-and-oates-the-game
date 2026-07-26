import { closePuzzle, createPuzzleOverlay } from './shared.js';

export function showCranePuzzle(root, { onMove, onMiss, onWin }) {
  const overlay = createPuzzleOverlay(root, {
    className: 'crane-puzzle',
    label: 'Pier prize crane puzzle',
    html: `
      <div class="crane-puzzle__header">
        <strong>THE GRABBA-DABBA-DOO</strong>
        <span>Taffy belt installed. Retrieve the fries.</span>
      </div>
      <div class="crane-cabinet">
        <img class="crane-cabinet-art" src="assets/art/chapters/chapter-01/crane-cabinet-interior-v2.png" alt="">
        <div class="crane-rail"><span class="crane-carriage"><i></i></span></div>
        <img class="crane-fries" src="assets/art/chapters/chapter-01/crane-fries-v1.png" alt="carton of French fries">
      </div>
      <p class="crane-status" aria-live="polite">Move above a prize, then lower the claw.</p>
      <div class="crane-controls">
        <button type="button" data-crane="left" aria-label="Move claw left">◀ LEFT</button>
        <button type="button" data-crane="drop">LOWER CLAW</button>
        <button type="button" data-crane="right" aria-label="Move claw right">RIGHT ▶</button>
      </div>
      <button type="button" class="crane-exit">BACK TO PIER</button>`,
  });
  const carriage = overlay.querySelector('.crane-carriage');
  const cabinet = overlay.querySelector('.crane-cabinet');
  const claw = carriage.querySelector('i');
  const status = overlay.querySelector('.crane-status');
  const drop = overlay.querySelector('[data-crane="drop"]');
  let position = 0;
  let carryingFries = false;
  let busy = false;

  const redraw = () => {
    carriage.style.left = `${12.5 + position * 25}%`;
    claw.classList.toggle('has-fries', carryingFries);
    cabinet.classList.toggle('is-carrying', carryingFries);
    drop.textContent = carryingFries ? 'RELEASE CLAW' : 'LOWER CLAW';
  };
  const move = (direction) => {
    if (busy) return;
    const next = Math.max(0, Math.min(3, position + direction));
    if (next === position) return;
    position = next;
    redraw();
    onMove?.();
  };
  const lower = () => {
    if (busy) return;
    busy = true;
    claw.classList.add('is-lowered');
    window.setTimeout(() => {
      if (!carryingFries && position === 3) {
        carryingFries = true;
        status.textContent = 'Fries acquired. Carry them to the prize chute.';
        claw.classList.add('has-fries');
      } else if (carryingFries && position === 0) {
        status.textContent = 'Winner! Against every known health-code regulation.';
        claw.classList.remove('is-lowered');
        window.setTimeout(() => { closePuzzle(overlay); onWin?.(); }, 500);
        return;
      } else if (carryingFries) {
        carryingFries = false;
        position = 3;
        status.textContent = 'The fries fell back. The crane resets above them.';
        onMiss?.();
      } else {
        status.textContent = position === 0
          ? 'That is the empty chute. The prize must reach it from above.'
          : 'The claw grabs only disappointment. Try another position.';
        onMiss?.();
      }
      claw.classList.remove('is-lowered');
      busy = false;
      redraw();
    }, 430);
  };

  overlay.querySelector('[data-crane="left"]').addEventListener('click', () => move(-1));
  overlay.querySelector('[data-crane="right"]').addEventListener('click', () => move(1));
  drop.addEventListener('click', lower);
  overlay.querySelector('.crane-exit').addEventListener('click', () => closePuzzle(overlay));
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') lower();
    if (event.key === 'Escape') closePuzzle(overlay);
  });
  redraw();
  overlay.querySelector('[data-crane="right"]').focus();
}
