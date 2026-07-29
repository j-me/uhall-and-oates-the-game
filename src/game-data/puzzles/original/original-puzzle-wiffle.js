import { bindPuzzleExit, closePuzzle, createPuzzleOverlay, restartAnimation } from '../shared/shared-puzzle-overlay.js';

export function showWifflePuzzle(root, { onAdjust, onLaunch, onMiss, onWin }) {
  const overlay = createPuzzleOverlay(root, {
    className: 'wiffle-puzzle',
    label: 'Jacuzzi Park wiffle-ball launcher puzzle',
    html: `
      <div class="wiffle-puzzle__header">
        <strong>JACUZZI PARK DELIVERY INNING</strong>
        <span class="wiffle-memory">SCOREBOARD: <b>1 · 6 · B</b></span>
      </div>
      <div class="wiffle-field" aria-hidden="true">
        <img class="wiffle-field-art" src="assets/art/campaigns/original/chapters/chapter-03/jacuzzi-wiffle-launcher-field-v1.png" alt="">
        <span class="wiffle-scorebox">REARDON<br>SHIPPING LOCKBOX</span>
        <span class="wiffle-ball"></span>
      </div>
      <div class="wiffle-dials">
        <button type="button" data-dial="inning"><small>INNING</small><b>7</b><span>TURN ↻</span></button>
        <button type="button" data-dial="position"><small>FIELD POSITION</small><b>4</b><span>TURN ↻</span></button>
        <button type="button" data-dial="gate"><small>OUTFIELD GATE</small><b>A</b><span>TURN ↻</span></button>
      </div>
      <p class="wiffle-status" aria-live="polite">Set Luke’s three launcher dials, then send the delivery.</p>
      <div class="wiffle-actions">
        <button type="button" class="wiffle-launch">LAUNCH WIFFLE BALL</button>
        <button type="button" class="wiffle-exit">BACK TO STADIUM</button>
      </div>`,
  });
  const options = { inning: ['7', '1', '9'], position: ['4', '6', '2'], gate: ['A', 'C', 'B'] };
  const selected = { inning: 0, position: 0, gate: 0 };
  const status = overlay.querySelector('.wiffle-status');
  const ball = overlay.querySelector('.wiffle-ball');
  let busy = false;

  overlay.querySelectorAll('[data-dial]').forEach((button) => {
    button.addEventListener('click', () => {
      if (busy) return;
      const id = button.dataset.dial;
      selected[id] = (selected[id] + 1) % options[id].length;
      button.querySelector('b').textContent = options[id][selected[id]];
      restartAnimation(button, 'dial-turn');
      onAdjust?.();
    });
  });
  overlay.querySelector('.wiffle-launch').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const values = Object.fromEntries(Object.keys(selected).map((id) => [id, options[id][selected[id]]]));
    const solved = values.inning === '1' && values.position === '6' && values.gate === 'B';
    ball.className = `wiffle-ball ${solved ? 'is-home-run' : 'is-foul'}`;
    status.textContent = solved
      ? 'The ball banks off the outfield sign and trips the Reardon shipping lockbox!'
      : `Foul delivery: inning ${values.inning}, position ${values.position}, gate ${values.gate}. The ball rolls back to John.`;
    onLaunch?.();
    window.setTimeout(() => {
      if (solved) {
        window.setTimeout(() => { closePuzzle(overlay); onWin?.(); }, 350);
        return;
      }
      ball.className = 'wiffle-ball';
      busy = false;
      onMiss?.();
    }, 850);
  });
  bindPuzzleExit(overlay, '.wiffle-exit');
  overlay.querySelector('[data-dial="inning"]').focus();
}
