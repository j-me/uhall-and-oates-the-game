import { bindPuzzleExit, closePuzzle, createPuzzleOverlay, restartAnimation } from './shared.js';

export function showVoiceMixerPuzzle(root, { onAdjust, onTest, onMiss, onWin }) {
  const overlay = createPuzzleOverlay(root, {
    className: 'voice-mixer-puzzle',
    label: 'Reardon recording truck voice-filter puzzle',
    html: `
      <div class="voice-mixer__header">
        <strong>REARDON AD QUALITY CONTROL</strong>
        <span>QUARANTINE TRACK: LOCKED</span>
      </div>
      <div class="voice-console">
        <div class="voice-wave" aria-hidden="true">${'<i></i>'.repeat(18)}</div>
        <div class="voice-meter"><b>FILTER LOAD</b><span><i></i></span><em>0 / 3</em></div>
        <div class="voice-channels">
          <button type="button" data-channel="vocal"><small>VOCAL TAKE</small><b>Clean Solo</b><span>NEXT TAKE ›</span></button>
          <button type="button" data-channel="backing"><small>BACKING TRACK</small><b>Soft Piano</b><span>NEXT TRACK ›</span></button>
          <button type="button" data-channel="slogan"><small>AD SLOGAN</small><b>Careful &amp; On Time</b><span>NEXT SLOGAN ›</span></button>
        </div>
      </div>
      <p class="voice-mixer__status" aria-live="polite">Build a jingle bad enough to make the filter dump its quarantined track.</p>
      <div class="voice-mixer__actions">
        <button type="button" class="voice-test">TEST JINGLE</button>
        <button type="button" class="voice-exit">LEAVE TRUCK</button>
      </div>`,
  });
  const options = {
    vocal: ['Clean Solo', 'Spoken Memo', 'Off-Key Duet'],
    backing: ['Soft Piano', 'One Cowbell', 'Saxophone Avalanche'],
    slogan: ['Careful & On Time', 'Probably Insured', 'Delivered Yesterday'],
  };
  const selected = { vocal: 0, backing: 0, slogan: 0 };
  const meter = overlay.querySelector('.voice-meter');
  const meterFill = meter.querySelector('i');
  const meterReadout = meter.querySelector('em');
  const status = overlay.querySelector('.voice-mixer__status');
  const wave = overlay.querySelector('.voice-wave');
  let busy = false;

  overlay.querySelectorAll('[data-channel]').forEach((button) => {
    button.addEventListener('click', () => {
      if (busy) return;
      const id = button.dataset.channel;
      selected[id] = (selected[id] + 1) % options[id].length;
      button.querySelector('b').textContent = options[id][selected[id]];
      restartAnimation(button, 'channel-swap');
      onAdjust?.();
    });
  });
  overlay.querySelector('.voice-test').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const faults = Number(selected.vocal === 2) + Number(selected.backing === 2) + Number(selected.slogan === 2);
    meter.style.setProperty('--filter-load', `${faults / 3 * 100}%`);
    meterFill.classList.toggle('is-overloaded', faults === 3);
    meterReadout.textContent = `${faults} / 3`;
    wave.className = `voice-wave ${faults === 3 ? 'is-overloaded' : 'is-testing'}`;
    onTest?.();
    if (faults === 3) {
      status.textContent = 'FILTER OVERLOAD! Quarantine track ejecting: DARYL_COUNTER_MELODY.';
      window.setTimeout(() => { closePuzzle(overlay); onWin?.(); }, 1250);
      return;
    }
    status.textContent = `The filter detects ${faults} catastrophic ${faults === 1 ? 'fault' : 'faults'}. It needs all three before it will panic.`;
    window.setTimeout(() => {
      wave.className = 'voice-wave';
      busy = false;
      onMiss?.();
    }, 900);
  });
  bindPuzzleExit(overlay, '.voice-exit');
  overlay.querySelector('[data-channel="vocal"]').focus();
}
