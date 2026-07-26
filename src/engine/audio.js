export function createAudio() {
  let enabled = true;
  let context;
  let scoreTimer;
  let scoreStep = 0;
  let ambienceTimer;
  let chapterTrack;
  let trackRequest = 0;
  let activeChapter;
  let musicMode = 'external';
  let externalTracks = {};
  const musicSources = new Set();
  const activeSfx = new Set();
  const sfxPaths = {
    pickup: 'assets/audio/sfx/pickup.wav',
    success: 'assets/audio/sfx/success-chime.wav',
    crane: 'assets/audio/sfx/crane-motor.wav',
    repair: 'assets/audio/sfx/repair-ratchet.wav',
    fries: 'assets/audio/sfx/prize-drop.wav',
    gull: 'assets/audio/sfx/gull-squawk.wav',
    manifest: 'assets/audio/sfx/paper-rustle.wav',
    stamp: 'assets/audio/sfx/stamp-thunk.wav',
    cards: 'assets/audio/sfx/cards-rip.wav',
    scoreboard: 'assets/audio/sfx/scoreboard-beeps.wav',
    wiffle: 'assets/audio/sfx/wiffle-launch.wav',
    customs: 'assets/audio/sfx/customs-clack.wav',
    route: 'assets/audio/sfx/route-whoosh.wav',
    lift: 'assets/audio/sfx/lift-unlock.wav',
    capsules: 'assets/audio/sfx/capsule-rotate.wav',
    voice: 'assets/audio/sfx/voice-glitch.wav',
    broadcast: 'assets/audio/sfx/broadcast-surge.wav',
    contract: 'assets/audio/sfx/contract-shred.wav',
    tape: 'assets/audio/sfx/tape-rip.wav',
  };

  function getContext() {
    if (!context) context = new AudioContext();
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function tone(frequency, duration = 0.08, type = 'square', volume = 0.03, delay = 0, detune = 0, bus) {
    if (!enabled) return;
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = frequency; osc.detune.value = detune;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain).connect(ctx.destination);
    if (bus === 'music') {
      musicSources.add(osc);
      osc.addEventListener('ended', () => musicSources.delete(osc), { once: true });
    }
    osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + duration + 0.03);
  }

  function hiss(duration = 0.12, volume = 0.012, delay = 0, bus) {
    if (!enabled) return;
    const ctx = getContext();
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
    const noise = ctx.createBufferSource(); const gain = ctx.createGain();
    gain.gain.value = volume; noise.buffer = buffer; noise.connect(gain).connect(ctx.destination);
    if (bus === 'music') {
      musicSources.add(noise);
      noise.addEventListener('ended', () => musicSources.delete(noise), { once: true });
    }
    noise.start(ctx.currentTime + delay);
  }

  // Original neon-pop rescue cue: syncopated bass, clipped chord stabs,
  // bright drum-machine punctuation, and an original restless synth hook.
  const chordRoots = [146.83, 174.61, 220, 196];
  const bassline = [146.83, 0, 220, 146.83, 293.66, 220, 0, 146.83, 174.61, 0, 261.63, 174.61, 220, 196, 293.66, 196];
  const hook = [659.25, 0, 739.99, 880, 783.99, 0, 987.77, 880, 739.99, 0, 659.25, 783.99, 880, 1108.73, 987.77, 739.99];

  function chord(root, delay = 0) {
    [1, 1.25, 1.498, 1.875].forEach((interval, index) => tone(root * interval, 0.42, 'sine', 0.008, delay + index * 0.006, index % 2 ? 5 : -5, 'music'));
  }

  function playScoreStep() {
    if (!enabled) return;
    const index = scoreStep % 16;
    const root = chordRoots[Math.floor(index / 4)];
    if (bassline[index]) tone(bassline[index], 0.15, 'triangle', 0.03, 0, 0, 'music');
    if (index % 4 === 0 || index % 4 === 3) chord(root, 0.005);
    if (hook[index]) tone(hook[index], 0.105, 'triangle', 0.021, 0.038, 0, 'music');
    if (index % 4 === 0 || index % 4 === 2) tone(58, 0.045, 'sine', 0.052, 0, 0, 'music');
    if (index % 2 === 1) hiss(0.022, 0.009, 0, 'music');
    if (index % 4 === 3) tone(310, 0.028, 'square', 0.012, 0, 0, 'music');
    scoreStep += 1;
  }

  function startScore() {
    if (!enabled || scoreTimer) return;
    playScoreStep();
    scoreTimer = window.setInterval(playScoreStep, 205);
  }

  function stopScore() {
    window.clearInterval(scoreTimer); scoreTimer = undefined;
  }

  function stopMusicSources() {
    musicSources.forEach((source) => { try { source.stop(); } catch { /* Already stopped. */ } });
    musicSources.clear();
  }

  function stopSfx() {
    activeSfx.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    activeSfx.clear();
  }

  function playSfx(name, fallback, volume = 0.52) {
    if (!enabled) return;
    const path = sfxPaths[name];
    if (!path || typeof Audio === 'undefined') {
      fallback();
      return;
    }
    const sound = new Audio(path);
    let settled = false;
    const release = () => {
      settled = true;
      activeSfx.delete(sound);
    };
    const useFallback = () => {
      if (settled || !enabled) return;
      release();
      fallback();
    };
    sound.preload = 'auto';
    sound.volume = volume;
    sound.addEventListener('ended', release, { once: true });
    sound.addEventListener('error', useFallback, { once: true });
    activeSfx.add(sound);
    sound.play().catch(useFallback);
  }

  function stopChapterTrack() {
    trackRequest += 1;
    if (!chapterTrack) return;
    chapterTrack.pause();
    chapterTrack.currentTime = 0;
    chapterTrack = undefined;
  }

  function startChapterTrack(paths) {
    const request = ++trackRequest;
    if (!enabled) return;
    const candidates = Array.isArray(paths) ? paths : [paths];
    const tryCandidate = (index) => {
      if (!enabled || request !== trackRequest) return;
      if (index >= candidates.length) {
        console.warn('Falling back to the built-in procedural score.');
        startScore();
        return;
      }
      const track = new Audio(candidates[index]);
      let advanced = false;
      const advance = () => {
        if (advanced || !enabled || request !== trackRequest) return;
        advanced = true;
        track.pause();
        if (chapterTrack === track) chapterTrack = undefined;
        tryCandidate(index + 1);
      };
      track.loop = true;
      track.volume = 0.38;
      track.addEventListener('error', advance, { once: true });
      chapterTrack = track;
      track.play().catch((error) => {
        if (!enabled || request !== trackRequest || advanced) return;
        if (track.error) advance();
        else {
          console.warn('Audio playback was blocked; using the procedural score.', error);
          startScore();
        }
      });
    };
    tryCandidate(0);
  }

  function startChapterMusic(chapterId) {
    if (!enabled || activeChapter === chapterId) return;
    activeChapter = chapterId;
    stopScore(); stopChapterTrack(); stopAmbience(); stopMusicSources();
    const sources = {
      'chapter-01': { local: 'assets/audio/music-local/Out-Of-Touch.mp3', original: 'assets/audio/music/chapter-01-original.mp3' },
      'chapter-02': { local: 'assets/audio/music-local/private-eyes.mp3', original: 'assets/audio/music/chapter-02-original.mp3' },
      'chapter-03': { local: 'assets/audio/music-local/Kiss-On-My-List.mp3', original: 'assets/audio/music/chapter-03-original.mp3' },
      'chapter-04': { local: 'assets/audio/music-local/I-Can\'t-Go-For-That.mp3', original: 'assets/audio/music/chapter-04-original.mp3' },
      'chapter-05': { local: 'assets/audio/music-local/Man-Eater.mp3', original: 'assets/audio/music/chapter-05-original.mp3' },
      'chapter-06': { local: 'assets/audio/music-local/You-Make-My-Dreams-Come-True.mp3', original: 'assets/audio/music/chapter-06-original.mp3' },
      outro: { local: 'assets/audio/music-local/say-it-isnt-so.mp3', original: 'assets/audio/music/outro-original.mp3' },
    }[chapterId];
    if (sources) {
      const candidates = musicMode === 'original'
        ? [sources.original]
        : [externalTracks[chapterId], sources.local, sources.original].filter(Boolean);
      startChapterTrack(candidates);
    }
    else startScore();
    if (chapterId === 'chapter-01') startPierAmbience();
  }

  function startPierAmbience() {
    if (!enabled || ambienceTimer) return;
    ambienceTimer = window.setInterval(() => {
      hiss(0.18, 0.004);
      if (Math.random() > 0.56) tone(1160 + Math.random() * 180, 0.08, 'sine', 0.004);
    }, 3400);
  }

  function stopAmbience() {
    window.clearInterval(ambienceTimer); ambienceTimer = undefined;
  }

  function playSynthHotspotEffect(effect) {
    const sounds = {
      repair: () => { tone(165, 0.08, 'square', 0.03); tone(220, 0.07, 'square', 0.026, 0.09); tone(330, 0.1, 'triangle', 0.024, 0.18); },
      fries: () => { tone(420, 0.045, 'square', 0.025); tone(620, 0.06, 'triangle', 0.024, 0.08); hiss(0.08, 0.008, 0.12); },
      gull: () => { tone(1040, 0.09, 'sine', 0.015); tone(1320, 0.12, 'sine', 0.012, 0.1); hiss(0.09, 0.01); },
      manifest: () => { hiss(0.11, 0.015); tone(720, 0.08, 'triangle', 0.025, 0.07); tone(960, 0.12, 'triangle', 0.025, 0.17); },
      stamp: () => { tone(94, 0.07, 'square', 0.05); hiss(0.05, 0.02, 0.025); tone(512, 0.08, 'triangle', 0.025, 0.12); },
      cards: () => { hiss(0.13, 0.025); tone(590, 0.055, 'triangle', 0.024, 0.06); tone(780, 0.085, 'triangle', 0.026, 0.13); },
      scoreboard: () => { tone(430, 0.06, 'square', 0.03); tone(620, 0.06, 'square', 0.03, 0.08); tone(930, 0.12, 'square', 0.025, 0.17); },
      wiffle: () => { tone(140, 0.11, 'triangle', 0.04); tone(540, 0.065, 'sine', 0.03, 0.1); tone(920, 0.075, 'sine', 0.026, 0.18); },
      customs: () => { tone(78, 0.08, 'square', 0.05); hiss(0.06, 0.018, 0.02); tone(350, 0.1, 'triangle', 0.024, 0.13); },
      route: () => { hiss(0.18, 0.012); tone(380, 0.09, 'sine', 0.022, 0.03); tone(680, 0.1, 'sine', 0.025, 0.12); tone(1040, 0.12, 'sine', 0.022, 0.22); },
      lift: () => { tone(160, 0.12, 'square', 0.032); tone(280, 0.1, 'triangle', 0.028, 0.12); tone(480, 0.12, 'triangle', 0.028, 0.24); },
      capsules: () => { tone(170, 0.075, 'square', 0.026); tone(250, 0.075, 'square', 0.026, 0.08); tone(370, 0.075, 'square', 0.026, 0.16); tone(540, 0.1, 'triangle', 0.024, 0.25); },
      voice: () => { tone(235, 0.06, 'sawtooth', 0.025); tone(710, 0.055, 'square', 0.024, 0.07, 40); tone(480, 0.08, 'triangle', 0.028, 0.15, -30); tone(880, 0.12, 'sine', 0.026, 0.24); },
      broadcast: () => { hiss(0.16, 0.012); tone(280, 0.07, 'square', 0.025, 0.04); tone(560, 0.08, 'square', 0.026, 0.14); tone(840, 0.12, 'triangle', 0.028, 0.25); },
      contract: () => { hiss(0.18, 0.022); tone(330, 0.06, 'triangle', 0.025, 0.08); tone(494, 0.06, 'triangle', 0.025, 0.16); tone(740, 0.13, 'triangle', 0.03, 0.24); },
      tape: () => { tone(240, 0.08, 'square', 0.035); hiss(0.1, 0.012, 0.08); tone(520, 0.1, 'triangle', 0.026, 0.17); },
    };
    (sounds[effect] || (() => { tone(523, 0.1, 'triangle', 0.04); tone(659, 0.1, 'triangle', 0.04, 0.11); tone(784, 0.18, 'triangle', 0.045, 0.22); }))();
  }

  return {
    click: () => {},
    pickup: () => playSfx('pickup', () => { tone(660, 0.08, 'triangle', 0.04); tone(880, 0.1, 'triangle', 0.035, 0.07); }),
    success: () => playSfx('success', () => { tone(523, 0.1, 'triangle', 0.04); tone(659, 0.1, 'triangle', 0.04, 0.11); tone(784, 0.18, 'triangle', 0.045, 0.22); }),
    error: () => {},
    crane: () => playSfx('crane', () => { tone(180, 0.16, 'square', 0.035); tone(240, 0.12, 'square', 0.028, 0.12); tone(320, 0.08, 'triangle', 0.022, 0.23); }),
    gull: () => playSfx('gull', () => { tone(1040, 0.09, 'sine', 0.015); tone(1320, 0.12, 'sine', 0.012, 0.1); hiss(0.09, 0.01); }),
    effect: (effect) => playSfx(effect, () => playSynthHotspotEffect(effect)),
    intro: () => {},
    startChapter(chapterId) { startChapterMusic(chapterId); },
    configureMusic({ mode = 'external', urls = {} } = {}) {
      musicMode = mode === 'original' ? 'original' : 'external';
      externalTracks = { ...urls };
      if (activeChapter && enabled) {
        const chapterId = activeChapter;
        activeChapter = undefined;
        startChapterMusic(chapterId);
      }
    },
    stopBackground() { activeChapter = undefined; stopScore(); stopChapterTrack(); stopAmbience(); stopMusicSources(); },
    setEnabled(value) {
      enabled = value;
      if (!enabled) { activeChapter = undefined; stopScore(); stopChapterTrack(); stopAmbience(); stopMusicSources(); stopSfx(); }
      return enabled;
    },
    get enabled() { return enabled; },
  };
}
