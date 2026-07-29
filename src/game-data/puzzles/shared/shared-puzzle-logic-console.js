import { bindPuzzleExit, closePuzzle, createPuzzleOverlay, restartAnimation } from './shared-puzzle-overlay.js';

const visualLabels = {
  'temporal-trunk-console': ['TIME ROUTER', 'ROUTE LOCKED'],
  'safety-copier-console': ['MASTER COPIER', 'COPY APPROVED'],
  'mall-closing-console': ['MALL P.A. DECK', 'MESSAGE QUEUED'],
  'storage-auction-console': ['LOT 88 TERMINAL', 'CLAIM ACCEPTED'],
  'vocal-network-console': ['VOCAL NETWORK', 'ACCESS GRANTED'],
  'switchboard-console': ['LINE PATCH', 'CALL ROUTED'],
  'handbook-console': ['EVIDENCE CORE', 'PARADOX FILED'],
};

const modeCopy = {
  dials: ['Turn each routing dial, then engage the machine.', 'ENGAGE ROUTER'],
  switches: ['Set one physical switch in each copier bank.', 'RUN TEST COPY'],
  cassette: ['Program one option onto each cassette track.', 'RECORD MESSAGE'],
  cards: ['Commit one evidence card from each auction category.', 'PLACE BID'],
  faders: ['Tune each discrete vocal channel with its fader.', 'OPEN NETWORK'],
  patchboard: ['Patch one destination jack on each switchboard line.', 'PLACE CALL'],
  stamps: ['Stamp one finding onto every evidence sheet.', 'FILE CONTRADICTIONS'],
};

function renderControl(control, index, interactionMode) {
  if (interactionMode === 'dials') {
    return `
      <button type="button" data-control="${index}" style="--option-index:0">
        <span class="logic-control__dial"><i></i></span>
        <small>${control.label}</small><b>${control.options[0]}</b><span class="logic-control__hint">TURN DIAL ↻</span>
      </button>`;
  }

  if (interactionMode === 'stamps') {
    return `
      <button type="button" class="logic-stamp" data-control="${index}" style="--option-index:0">
        <i class="logic-stamp__handle" aria-hidden="true"></i>
        <small>${control.label}</small><b>${control.options[0]}</b><span class="logic-control__hint">STAMP AGAIN</span>
      </button>`;
  }

  if (interactionMode === 'faders') {
    return `
      <label class="logic-fader" data-control-group="${index}">
        <small>${control.label}</small>
        <input type="range" min="0" max="${control.options.length - 1}" value="0" step="1" data-range="${index}">
        <span class="logic-fader__scale">${control.options.map(() => '<i></i>').join('')}</span>
        <b>${control.options[0]}</b>
      </label>`;
  }

  return `
    <fieldset class="logic-choice-group" data-control-group="${index}">
      <legend>${control.label}</legend>
      <div>
        ${control.options.map((option, optionIndex) => `
          <button type="button" class="logic-choice${optionIndex === 0 ? ' is-selected' : ''}"
            data-choice="${index}" data-option="${optionIndex}">
            <i aria-hidden="true"></i><span>${option}</span>
          </button>`).join('')}
      </div>
    </fieldset>`;
}

export function showLogicConsolePuzzle(root, {
  title,
  subtitle,
  clue,
  controls,
  successMessage,
  failureMessage = 'The evidence disagrees. Nothing is consumed; try another arrangement.',
  submitLabel,
  exitLabel = 'BACK TO SCENE',
  effectClass = 'logic-console',
  interactionMode = 'dials',
  onAdjust,
  onTest,
  onMiss,
  onWin,
}) {
  const [standbyLabel, solvedLabel] = visualLabels[effectClass] || ['LOGIC CONSOLE', 'ARRANGEMENT ACCEPTED'];
  const [instruction, modeSubmitLabel] = modeCopy[interactionMode] || modeCopy.dials;
  const overlay = createPuzzleOverlay(root, {
    className: `logic-puzzle ${effectClass} logic-mode--${interactionMode}`,
    label: `${title} puzzle`,
    html: `
      <div class="logic-puzzle__header"><strong>${title}</strong><span>${subtitle || ''}</span></div>
      <div class="logic-puzzle__visual" aria-hidden="true">
        <div class="logic-machine">
          <div class="logic-machine__reel logic-machine__reel--left"></div>
          <div class="logic-machine__reel logic-machine__reel--right"></div>
          <div class="logic-machine__paper"></div>
          <div class="logic-machine__screen"><span>${standbyLabel}</span></div>
          <div class="logic-machine__meters">${Array.from({ length: 8 }, () => '<i></i>').join('')}</div>
          <div class="logic-machine__cable"></div>
        </div>
      </div>
      <p class="logic-puzzle__clue">${clue}</p>
      <div class="logic-puzzle__controls">
        ${controls.map((control, index) => renderControl(control, index, interactionMode)).join('')}
      </div>
      <p class="logic-puzzle__status" aria-live="polite">${instruction}</p>
      <div class="logic-puzzle__actions">
        <button type="button" class="logic-submit">${submitLabel || modeSubmitLabel}</button>
        <button type="button" class="logic-exit">${exitLabel}</button>
      </div>`,
  });
  const selected = controls.map(() => 0);
  const status = overlay.querySelector('.logic-puzzle__status');
  const readout = overlay.querySelector('.logic-machine__screen span');
  const meters = [...overlay.querySelectorAll('.logic-machine__meters i')];
  let busy = false;

  function showSelection(controlIndex, optionIndex) {
    const option = controls[controlIndex].options[optionIndex];
    readout.textContent = `${controls[controlIndex].label}: ${option}`;
    meters.forEach((meter, meterIndex) =>
      meter.classList.toggle('is-active', meterIndex <= controlIndex * 2 + optionIndex));
    onAdjust?.();
  }

  overlay.querySelectorAll('[data-control]').forEach((button) => {
    button.addEventListener('click', () => {
      if (busy) return;
      const index = Number(button.dataset.control);
      selected[index] = (selected[index] + 1) % controls[index].options.length;
      const option = controls[index].options[selected[index]];
      button.querySelector('b').textContent = option;
      button.style.setProperty('--option-index', selected[index]);
      showSelection(index, selected[index]);
      restartAnimation(button, 'dial-turn');
    });
  });

  overlay.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      if (busy) return;
      const controlIndex = Number(button.dataset.choice);
      const optionIndex = Number(button.dataset.option);
      selected[controlIndex] = optionIndex;
      overlay.querySelectorAll(`[data-choice="${controlIndex}"]`).forEach((choice) =>
        choice.classList.toggle('is-selected', choice === button));
      showSelection(controlIndex, optionIndex);
      restartAnimation(button, 'choice-lock');
    });
  });

  overlay.querySelectorAll('[data-range]').forEach((range) => {
    range.addEventListener('input', () => {
      if (busy) return;
      const controlIndex = Number(range.dataset.range);
      const optionIndex = Number(range.value);
      selected[controlIndex] = optionIndex;
      range.closest('.logic-fader').querySelector('b').textContent = controls[controlIndex].options[optionIndex];
      showSelection(controlIndex, optionIndex);
    });
  });

  overlay.querySelector('.logic-submit').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    onTest?.();
    const solved = controls.every((control, index) => control.options[selected[index]] === control.answer);
    if (solved) {
      overlay.classList.add('is-solved');
      readout.textContent = solvedLabel;
      meters.forEach((meter) => meter.classList.add('is-active'));
      status.textContent = successMessage;
      window.setTimeout(() => { closePuzzle(overlay); onWin?.(); }, 950);
      return;
    }
    readout.textContent = 'CONFIGURATION REJECTED';
    status.textContent = failureMessage;
    overlay.classList.add('is-wrong');
    window.setTimeout(() => {
      overlay.classList.remove('is-wrong');
      readout.textContent = standbyLabel;
      busy = false;
      onMiss?.();
    }, 700);
  });

  bindPuzzleExit(overlay, '.logic-exit');
  overlay.querySelector('[data-control="0"],[data-choice="0"],[data-range="0"]')?.focus();
}
