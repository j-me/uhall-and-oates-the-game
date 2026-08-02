import { closePuzzle, createPuzzleOverlay } from '../shared/shared-puzzle-overlay.js';

const truckArt = 'assets/art/campaigns/adult-relocation/minigames/temporal-truck-v1.png';
const gateThemes = [
  { className: 'sofa', year: '1987', label: 'SOFA WALL', finePrint: 'DARYL MARKED IT LIGHT' },
  { className: 'forms', year: '1976', label: 'FORM 16-B', finePrint: 'SIGN ALL FOUR DECADES' },
  { className: 'pager', year: '1993', label: 'PAGER STACK', finePrint: '80085 IS NOT A ROUTE' },
  { className: 'dotcom', year: '2001', label: 'DOT-COM DESKS', finePrint: 'SYNERGY IS HEAVY' },
  { className: 'boxes', year: '1986', label: 'MYSTERY BOXES', finePrint: 'JOE PACKED NOTHING' },
  { className: 'overtime', year: '2008', label: 'OVERTIME', finePrint: 'NOT PRE-APPROVED' },
];

export function showTemporalTruckPuzzle(root, {
  title = 'YOU MAKE MY WINGS COME TRUE',
  subtitle = 'TEMPORAL TRUCK RUN · DEFINITELY NOT INSURED',
  clue = 'Tap, click, or press Space / ↑ to flap the moving-blanket wings. Clear six decades of badly packed history.',
  successMessage = 'The flying truck catches the 2008 shipping label. Joe records the flight as John’s unpaid lunch break.',
  onMove,
  onHit,
  onMiss,
  onWin,
}) {
  const overlay = createPuzzleOverlay(root, {
    className: 'temporal-truck-puzzle',
    label: `${title} flying truck puzzle`,
    html: `
      <header class="temporal-truck-puzzle__header"><strong>${title}</strong><span>${subtitle}</span></header>
      <p class="temporal-truck-puzzle__clue">${clue}</p>
      <div class="temporal-truck-game" tabindex="0" role="button" aria-label="Flying truck course. Tap or press Space to flap.">
        <div class="temporal-truck-game__year" aria-live="polite">1993</div>
        <div class="temporal-truck-game__rift" aria-hidden="true"></div>
        <div class="temporal-truck-game__gates" aria-hidden="true"></div>
        <img class="temporal-truck-game__truck" src="${truckArt}" alt="Uhall and Oates moving truck flying on moving-blanket wings" draggable="false" />
        <div class="temporal-truck-game__prompt"><b>KEEP THE TRUCK OUT OF HISTORY</b><span>Tap anywhere in the rift to flap</span></div>
      </div>
      <div class="temporal-truck-puzzle__score"><b>READY TO MISFILE</b><span>0 / ${gateThemes.length} eras</span></div>
      <p class="temporal-truck-puzzle__status" aria-live="polite">No cargo is lost on failure. Joe did not inventory it in the first place.</p>
      <div class="temporal-truck-puzzle__actions"><button type="button" class="temporal-truck-start">START THE TRUCK</button><button type="button" class="temporal-truck-exit">BACK TO DEPOT</button></div>`,
  });

  const stage = overlay.querySelector('.temporal-truck-game');
  const truck = overlay.querySelector('.temporal-truck-game__truck');
  const gateRoot = overlay.querySelector('.temporal-truck-game__gates');
  const prompt = overlay.querySelector('.temporal-truck-game__prompt');
  const year = overlay.querySelector('.temporal-truck-game__year');
  const verdict = overlay.querySelector('.temporal-truck-puzzle__score b');
  const score = overlay.querySelector('.temporal-truck-puzzle__score span');
  const status = overlay.querySelector('.temporal-truck-puzzle__status');
  const startButton = overlay.querySelector('.temporal-truck-start');
  let gates = [];
  let running = false;
  let frame = 0;
  let lastFrame = 0;
  let truckY = 0;
  let velocity = 0;
  let cleared = 0;

  function cleanup() {
    running = false;
    window.cancelAnimationFrame(frame);
    document.removeEventListener('keydown', onKeyDown);
  }

  function close() {
    cleanup();
    closePuzzle(overlay);
  }

  function buildGates(width, height) {
    gateRoot.replaceChildren();
    const gapHeight = Math.max(132, Math.min(190, height * 0.5));
    const positions = [0.18, 0.42, 0.25, 0.48, 0.32, 0.2];
    const spacing = Math.max(330, width * 0.56);
    const obstacleWidth = Math.max(62, Math.min(86, width * 0.1));
    gates = gateThemes.map((theme, index) => {
      const gapTop = 18 + positions[index] * Math.max(20, height - gapHeight - 36);
      const element = document.createElement('div');
      element.className = `temporal-gate temporal-gate--${theme.className}`;
      element.style.setProperty('--gate-width', `${obstacleWidth}px`);
      element.style.setProperty('--gap-top', `${gapTop}px`);
      element.style.setProperty('--gap-bottom', `${gapTop + gapHeight}px`);
      element.style.setProperty('--gap-center', `${gapTop + gapHeight / 2}px`);
      element.innerHTML = `<div class="temporal-gate__tower temporal-gate__tower--top"><span>${theme.label}</span><small>${theme.finePrint}</small></div><i>${theme.year}</i><div class="temporal-gate__tower temporal-gate__tower--bottom"><span>${theme.label}</span><small>${theme.finePrint}</small></div>`;
      gateRoot.append(element);
      return { ...theme, element, x: width + 120 + index * spacing, width: obstacleWidth, gapTop, gapBottom: gapTop + gapHeight, passed: false };
    });
  }

  function positionTruck(rotation = 0) {
    truck.style.transform = `translate3d(0, ${truckY}px, 0) rotate(${rotation}deg)`;
  }

  function finish(won) {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frame);
    if (won) {
      verdict.textContent = 'DELIVERED TO 2008';
      status.textContent = successMessage;
      overlay.classList.add('is-solved');
      startButton.disabled = true;
      positionTruck(-5);
      window.setTimeout(() => { cleanup(); closePuzzle(overlay); onWin?.(); }, 1250);
      return;
    }
    verdict.textContent = 'TEMPORARILY PARKED';
    status.textContent = 'The truck bumps into history. Nothing is consumed; Joe has authorized another unpaid attempt.';
    overlay.classList.add('is-wrong');
    startButton.disabled = false;
    startButton.textContent = 'RETRY THE ROUTE';
    onMiss?.();
  }

  function flap() {
    if (!running) return;
    velocity = -Math.max(138, stage.clientHeight * 0.47);
    truck.classList.remove('is-flapping');
    void truck.offsetWidth;
    truck.classList.add('is-flapping');
    onMove?.();
  }

  function collides(gate, truckBox) {
    const gateLeft = gate.x;
    const gateRight = gate.x + gate.width;
    if (truckBox.right < gateLeft || truckBox.left > gateRight) return false;
    return truckBox.top < gate.gapTop || truckBox.bottom > gate.gapBottom;
  }

  function animate(now) {
    if (!running) return;
    const delta = Math.min(0.035, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const truckWidth = truck.clientWidth;
    const truckHeight = truck.clientHeight;
    const truckLeft = stageWidth * 0.12 + truckWidth * 0.08;
    const truckBox = {
      left: truckLeft + truckWidth * 0.08,
      right: truckLeft + truckWidth * 0.74,
      top: truckY + truckHeight * 0.25,
      bottom: truckY + truckHeight * 0.75,
    };

    velocity += Math.max(285, stageHeight * 0.96) * delta;
    truckY += velocity * delta;
    positionTruck(Math.max(-12, Math.min(16, velocity * 0.055)));

    const speed = Math.max(155, stageWidth * 0.26);
    for (const gate of gates) {
      gate.x -= speed * delta;
      gate.element.style.transform = `translate3d(${gate.x}px, 0, 0)`;
      if (!gate.passed && gate.x + gate.width < truckBox.left) {
        gate.passed = true;
        cleared += 1;
        year.textContent = gate.year;
        verdict.textContent = cleared === gateThemes.length ? 'LABEL IN SIGHT' : 'ROUTE ACCEPTED';
        score.textContent = `${cleared} / ${gateThemes.length} eras`;
        onHit?.();
      }
      if (collides(gate, truckBox)) {
        finish(false);
        return;
      }
    }

    if (truckBox.top <= 0 || truckBox.bottom >= stageHeight) {
      finish(false);
      return;
    }
    if (cleared === gateThemes.length) {
      finish(true);
      return;
    }
    frame = window.requestAnimationFrame(animate);
  }

  function start() {
    const stageHeight = stage.clientHeight;
    const truckHeight = truck.clientHeight || stageHeight * 0.22;
    overlay.classList.remove('is-wrong', 'is-solved');
    cleared = 0;
    velocity = 0;
    truckY = Math.max(8, (stageHeight - truckHeight) * 0.48);
    score.textContent = `0 / ${gateThemes.length} eras`;
    verdict.textContent = 'TIME METER RUNNING';
    status.textContent = 'Moving blankets are not FAA-approved wings. Fortunately, this is 1993.';
    year.textContent = '1993';
    startButton.disabled = true;
    startButton.textContent = 'TRUCK IN FLIGHT…';
    prompt.classList.add('is-hidden');
    buildGates(stage.clientWidth, stageHeight);
    positionTruck();
    running = true;
    lastFrame = performance.now();
    stage.focus({ preventScroll: true });
    frame = window.requestAnimationFrame(animate);
  }

  function onKeyDown(event) {
    if (![' ', 'ArrowUp', 'w', 'W'].includes(event.key)) return;
    event.preventDefault();
    flap();
  }

  stage.addEventListener('pointerdown', (event) => { event.preventDefault(); flap(); });
  startButton.addEventListener('click', start);
  overlay.querySelector('.temporal-truck-exit').addEventListener('click', close);
  overlay.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  document.addEventListener('keydown', onKeyDown);
  startButton.focus();
}
