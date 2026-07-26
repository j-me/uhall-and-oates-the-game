export function createPuzzleOverlay(root, { className, label, html }) {
  root.querySelector(`.${className}`)?.remove();
  root.classList.add('puzzle-open');
  const overlay = document.createElement('div');
  overlay.className = className;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', label);
  overlay.innerHTML = html;
  root.querySelector('#scene').append(overlay);
  return overlay;
}

export function closePuzzle(overlay) {
  overlay.closest('#game')?.classList.remove('puzzle-open');
  overlay.remove();
}

export function bindPuzzleExit(overlay, selector) {
  const close = () => closePuzzle(overlay);
  overlay.querySelector(selector).addEventListener('click', close);
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  return close;
}

export function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}
