export function showVideoOverlay(root, src, onClose) {
  root.querySelector('.video-overlay')?.remove();
  const sceneRoot = root.querySelector('#scene');
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
  overlay.addEventListener('keydown', (event) => { if (event.key === 'Escape') finish(); });
  overlay.append(title, video, close);
  sceneRoot.append(overlay);
  close.focus({ preventScroll: true });
  video.play().catch(() => { /* Controls remain available when autoplay is blocked. */ });
}
