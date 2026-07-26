import { bindPuzzleExit, closePuzzle, createPuzzleOverlay } from './shared.js';

export function showStorageDirectoryPuzzle(root, { onInspect, onMiss, onWin }) {
  const overlay = createPuzzleOverlay(root, {
    className: 'storage-puzzle',
    label: 'Manhattan storage-directory deduction puzzle',
    html: `
      <div class="storage-puzzle__header">
        <strong>WEST 83RD STREET SELF-STORAGE</strong>
        <span>ELEVATOR LIMIT: 800 LB</span>
      </div>
      <div class="storage-evidence">
        <span><small>RECOVERED STAMP</small><b>● ● ● ➜</b></span>
        <span><small>CRATE WEIGHT</small><b>760 LB</b></span>
        <span><small>REAL HANDLING CODE</small><b>NOT FRAGILE</b></span>
      </div>
      <div class="storage-units">
        <button type="button" data-unit="12-A" data-reason="The 920-pound listing exceeds the elevator’s 800-pound limit."><b>12-A</b><span>● ● ● ➜</span><em>920 LB</em><small>NOT FRAGILE</small></button>
        <button type="button" data-unit="16-B"><b>16-B</b><span>● ● ● ➜</span><em>760 LB</em><small>NOT FRAGILE</small></button>
        <button type="button" data-unit="18-C" data-reason="The weight fits, but those circles and triangle do not match the recovered stamp."><b>18-C</b><span>○ △ ○ ➜</span><em>540 LB</em><small>NOT FRAGILE</small></button>
        <button type="button" data-unit="22-D" data-reason="The stamp and weight fit, but Baltos said the Reardon decoys were marked FRAGILE."><b>22-D</b><span>● ● ● ➜</span><em>740 LB</em><small>FRAGILE</small></button>
      </div>
      <p class="storage-status" aria-live="polite">Which unit matches every piece of evidence?</p>
      <button type="button" class="storage-exit">BACK TO LOADING ZONE</button>`,
  });
  const status = overlay.querySelector('.storage-status');
  let solved = false;
  overlay.querySelectorAll('[data-unit]').forEach((button) => {
    button.addEventListener('click', () => {
      if (solved || button.classList.contains('is-eliminated')) return;
      onInspect?.();
      if (button.dataset.unit === '16-B') {
        solved = true;
        button.classList.add('is-correct');
        status.textContent = 'Every mark agrees: Unit 16-B. The directory latch releases.';
        window.setTimeout(() => { closePuzzle(overlay); onWin?.(); }, 750);
        return;
      }
      button.classList.add('is-eliminated');
      button.disabled = true;
      status.textContent = button.dataset.reason;
      onMiss?.();
    });
  });
  bindPuzzleExit(overlay, '.storage-exit');
  overlay.querySelector('[data-unit="12-A"]').focus();
}
