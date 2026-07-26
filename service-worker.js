const CACHE_NAME = 'uhall-oates-v14';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/styles/main.css',
  './src/main.js',
  './src/engine/audio.js',
  './src/engine/game.js',
  './src/engine/renderer.js',
  './src/engine/state.js',
  './src/ui/ui.js',
  './src/ui/settings.js',
  './src/game-data/registry.js',
  './src/game-data/puzzles/shared.js',
  './src/game-data/puzzles/crane.js',
  './src/game-data/puzzles/wiffle.js',
  './src/game-data/puzzles/voice-mixer.js',
  './src/game-data/puzzles/recall-clause.js',
  './src/game-data/puzzles/storage-directory.js',
  './src/game-data/chapters/chapter-01.js',
  './src/game-data/chapters/chapter-02.js',
  './src/game-data/chapters/chapter-03.js',
  './src/game-data/chapters/chapter-04.js',
  './src/game-data/chapters/chapter-05.js',
  './src/game-data/chapters/chapter-06.js',
  './src/game-data/chapters/outro.js',
  './src/game-data/dialogue/chapter-01.js',
  './src/game-data/dialogue/chapter-02.js',
  './src/game-data/dialogue/chapter-03.js',
  './src/game-data/dialogue/chapter-04.js',
  './src/game-data/dialogue/chapter-05.js',
  './src/game-data/dialogue/chapter-06.js',
  './src/game-data/dialogue/outro.js',
  './src/game-data/scenes/game-complete.js',
  './src/game-data/scenes/london-shipping-depot.js',
  './src/game-data/scenes/luke-wiffle-stadium.js',
  './src/game-data/scenes/manhattan-loading-zone.js',
  './src/game-data/scenes/old-orchard-pier.js',
  './src/game-data/scenes/the-forks-finale.js',
  './src/game-data/scenes/timmins-maxima.js',
  './src/game-data/scenes/tokyo-cargo-district.js',
  './assets/app-icons/app-icon-192.png',
  './assets/app-icons/app-icon-512.png',
  './assets/app-icons/app-icon-maskable-1024.png',
  './assets/art/ui/uhall-oates-truck-logo-v2.png',
  './assets/art/ui/character-headshot-tile-v1.png',
  './assets/art/ui/inventory-sprites-v1.png',
  './assets/art/chapters/chapter-01/old-orchard-pier-v1.png',
  './assets/art/chapters/chapter-01/old-orchard-pier-gull-gone-v1.png',
  './assets/art/characters/john-oates-worried-v1.png',
  './assets/audio/music/title-original.mp3',
  './assets/audio/music/chapter-01-original.mp3',
  './assets/audio/music/chapter-02-original.mp3',
  './assets/audio/music/chapter-03-original.mp3',
  './assets/audio/music/chapter-04-original.mp3',
  './assets/audio/music/chapter-05-original.mp3',
  './assets/audio/music/chapter-06-original.mp3',
  './assets/audio/music/outro-original.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Offline asset unavailable', { status: 503, statusText: 'Offline' });
      });
    }),
  );
});
