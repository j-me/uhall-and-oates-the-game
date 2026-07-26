import { bindPuzzleExit, closePuzzle, createPuzzleOverlay, restartAnimation } from './shared.js';

export function showRecallClausePuzzle(root, { onAdjust, onTest, onMiss, onWin }) {
  const overlay = createPuzzleOverlay(root, {
    className: 'recall-puzzle',
    label: 'Final Recall Clause contradiction puzzle',
    html: `
      <div class="recall-puzzle__header">
        <strong>REARDON RECALL CLAUSE · MASTER SCANNER</strong>
        <span>CONTRACT STATUS: ENFORCED</span>
      </div>
      <div class="recall-evidence">
        <article><small>TOWER SIGNAL</small><b>CANCELLATION ACTIVE</b><p>Daryl’s counter-melody replaced the coerced agreement.</p></article>
        <article><small>PRIVATE EYES MANIFEST</small><b>PERFORMER · WITNESS</b><p>The same person cannot also be anonymous label property.</p></article>
        <article><small>RETURN MANIFEST</small><b>THE FORKS ARCHIVE</b><p>A permanent transfer should not have a return route.</p></article>
      </div>
      <div class="recall-console">
        <button type="button" data-claim="signature"><small>SIGNATURE CLAIM</small><b>Recorded Voice</b><span>REPLACE EVIDENCE ›</span></button>
        <button type="button" data-claim="identity"><small>IDENTITY CLAIM</small><b>Reardon Property</b><span>REPLACE EVIDENCE ›</span></button>
        <button type="button" data-claim="route"><small>TRANSFER CLAIM</small><b>Tokyo Forever</b><span>REPLACE EVIDENCE ›</span></button>
      </div>
      <div class="recall-core" aria-hidden="true"><i></i><b>RECALL</b><span></span></div>
      <p class="recall-status" aria-live="polite">Replace each Reardon claim with the evidence that contradicts it.</p>
      <div class="recall-actions">
        <button type="button" class="recall-file">FILE CONTRADICTION</button>
        <button type="button" class="recall-exit">BACK TO ARCHIVE</button>
      </div>`,
  });
  const options = {
    signature: ['Recorded Voice', 'Unsigned Memo', 'Counter-Melody Cancellation'],
    identity: ['Reardon Property', 'Performer & Witness', 'Office Furniture'],
    route: ['Tokyo Forever', 'The Forks Return Route', 'Destination Unknown'],
  };
  const selected = { signature: 0, identity: 0, route: 0 };
  const status = overlay.querySelector('.recall-status');
  const core = overlay.querySelector('.recall-core');
  const headerStatus = overlay.querySelector('.recall-puzzle__header span');
  let busy = false;

  overlay.querySelectorAll('[data-claim]').forEach((button) => {
    button.addEventListener('click', () => {
      if (busy) return;
      const id = button.dataset.claim;
      selected[id] = (selected[id] + 1) % options[id].length;
      button.querySelector('b').textContent = options[id][selected[id]];
      restartAnimation(button, 'claim-swap');
      onAdjust?.();
    });
  });
  overlay.querySelector('.recall-file').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const contradictions = Number(selected.signature === 2) + Number(selected.identity === 1) + Number(selected.route === 1);
    const solved = contradictions === 3;
    core.className = `recall-core ${solved ? 'is-collapsing' : 'is-rejecting'}`;
    onTest?.();
    if (solved) {
      headerStatus.textContent = 'CONTRACT STATUS: SELF-CONTRADICTORY';
      status.textContent = 'All three Reardon claims contradict their own evidence. Recall Clause collapsing!';
      window.setTimeout(() => { closePuzzle(overlay); onWin?.(); }, 1450);
      return;
    }
    status.textContent = `${contradictions} of 3 claims contradicted. The remaining Reardon paperwork keeps the machine alive.`;
    window.setTimeout(() => {
      core.className = 'recall-core';
      busy = false;
      onMiss?.();
    }, 900);
  });
  bindPuzzleExit(overlay, '.recall-exit');
  overlay.querySelector('[data-claim="signature"]').focus();
}
