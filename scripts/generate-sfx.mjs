import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SFX_PATHS } from '../src/game-data/audio/audio-manifest.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'assets/audio/sfx');
const sampleRate = 22050;
let randomState = 0x55484f;

mkdirSync(output, { recursive: true });

function random() {
  randomState = (randomState * 1664525 + 1013904223) >>> 0;
  return randomState / 0x100000000;
}

function make(duration) {
  return new Float32Array(Math.ceil(duration * sampleRate));
}

function envelope(position, length, attack = 0.02, release = 0.2) {
  const progress = position / length;
  return Math.min(1, progress / attack, (1 - progress) / release);
}

function tone(buffer, start, duration, from, to = from, volume = 0.35, wave = 'square') {
  const first = Math.floor(start * sampleRate);
  const count = Math.floor(duration * sampleRate);
  let phase = 0;
  for (let index = 0; index < count && first + index < buffer.length; index += 1) {
    const progress = index / count;
    const frequency = from + (to - from) * progress;
    phase += frequency / sampleRate;
    const cycle = phase % 1;
    const value = wave === 'sine'
      ? Math.sin(cycle * Math.PI * 2)
      : wave === 'triangle'
        ? 1 - 4 * Math.abs(cycle - 0.5)
        : cycle < 0.5 ? 1 : -1;
    buffer[first + index] += value * volume * envelope(index, count);
  }
}

function noise(buffer, start, duration, volume = 0.2, roughness = 1) {
  const first = Math.floor(start * sampleRate);
  const count = Math.floor(duration * sampleRate);
  let held = 0;
  const hold = Math.max(1, Math.floor(roughness));
  for (let index = 0; index < count && first + index < buffer.length; index += 1) {
    if (index % hold === 0) held = random() * 2 - 1;
    buffer[first + index] += held * volume * envelope(index, count, 0.015, 0.45);
  }
}

function wav(samples) {
  const dataLength = samples.length * 2;
  const file = Buffer.alloc(44 + dataLength);
  file.write('RIFF', 0);
  file.writeUInt32LE(36 + dataLength, 4);
  file.write('WAVEfmt ', 8);
  file.writeUInt32LE(16, 16);
  file.writeUInt16LE(1, 20);
  file.writeUInt16LE(1, 22);
  file.writeUInt32LE(sampleRate, 24);
  file.writeUInt32LE(sampleRate * 2, 28);
  file.writeUInt16LE(2, 32);
  file.writeUInt16LE(16, 34);
  file.write('data', 36);
  file.writeUInt32LE(dataLength, 40);
  samples.forEach((sample, index) => {
    const clipped = Math.max(-1, Math.min(1, sample));
    file.writeInt16LE(Math.round(clipped * 32767), 44 + index * 2);
  });
  return file;
}

const effects = {
  pickup: [0.22, (b) => { tone(b, 0, 0.1, 560, 760, 0.3, 'triangle'); tone(b, 0.08, 0.12, 760, 1020, 0.28, 'triangle'); }],
  'success-chime': [0.48, (b) => { tone(b, 0, 0.18, 523, 523, 0.26, 'triangle'); tone(b, 0.12, 0.18, 659, 659, 0.26, 'triangle'); tone(b, 0.25, 0.21, 784, 784, 0.3, 'triangle'); }],
  'crane-motor': [0.55, (b) => { tone(b, 0, 0.45, 110, 155, 0.18, 'square'); tone(b, 0.08, 0.35, 220, 285, 0.1, 'triangle'); noise(b, 0, 0.48, 0.07, 6); }],
  'repair-ratchet': [0.43, (b) => { [0, .09, .18].forEach((s, i) => tone(b, s, .07, 150 + i * 45, 210 + i * 55, .25, 'square')); noise(b, .29, .1, .12, 2); }],
  'prize-drop': [0.38, (b) => { tone(b, 0, .12, 510, 800, .25, 'triangle'); noise(b, .15, .13, .18, 3); tone(b, .23, .12, 170, 90, .24, 'sine'); }],
  'gull-squawk': [0.55, (b) => { tone(b, 0, .2, 1100, 1620, .18, 'sine'); tone(b, .17, .23, 1500, 880, .16, 'sine'); noise(b, .04, .32, .05, 5); }],
  'paper-rustle': [0.46, (b) => { noise(b, 0, .42, .2, 2); tone(b, .25, .12, 480, 720, .08, 'triangle'); }],
  'stamp-thunk': [0.35, (b) => { tone(b, 0, .1, 95, 55, .4, 'sine'); noise(b, 0, .1, .24, 1); tone(b, .15, .15, 390, 620, .18, 'triangle'); }],
  'cards-rip': [0.58, (b) => { noise(b, 0, .28, .22, 1); noise(b, .25, .16, .16, 3); tone(b, .35, .18, 580, 880, .2, 'triangle'); }],
  'scoreboard-beeps': [0.52, (b) => { [430, 620, 930].forEach((f, i) => tone(b, i * .14, .1, f, f, .25, 'square')); }],
  'wiffle-launch': [0.55, (b) => { tone(b, 0, .16, 120, 260, .3, 'triangle'); noise(b, .1, .15, .12, 2); tone(b, .18, .3, 430, 1250, .2, 'sine'); }],
  'customs-clack': [0.42, (b) => { tone(b, 0, .1, 80, 48, .42, 'sine'); noise(b, 0, .09, .22, 1); tone(b, .18, .16, 270, 430, .18, 'triangle'); }],
  'route-whoosh': [0.62, (b) => { noise(b, 0, .55, .1, 2); tone(b, .05, .47, 260, 1050, .2, 'sine'); }],
  'lift-unlock': [0.6, (b) => { tone(b, 0, .32, 95, 190, .25, 'square'); noise(b, .05, .28, .08, 5); tone(b, .35, .16, 360, 720, .22, 'triangle'); }],
  'capsule-rotate': [0.62, (b) => { [170, 250, 370, 540].forEach((f, i) => tone(b, i * .12, .09, f, f * 1.08, .2, 'square')); }],
  'voice-glitch': [0.65, (b) => { tone(b, 0, .55, 210, 750, .18, 'square'); [0.09, .22, .38].forEach((s) => noise(b, s, .055, .16, 1)); tone(b, .43, .18, 620, 920, .2, 'sine'); }],
  'broadcast-surge': [0.75, (b) => { noise(b, 0, .62, .1, 2); tone(b, .05, .58, 140, 900, .21, 'square'); tone(b, .42, .25, 560, 1120, .16, 'sine'); }],
  'contract-shred': [0.7, (b) => { noise(b, 0, .58, .24, 1); tone(b, .32, .29, 280, 820, .18, 'triangle'); }],
  'tape-rip': [0.62, (b) => { noise(b, 0, .48, .2, 1); tone(b, .04, .42, 230, 510, .11, 'square'); tone(b, .45, .12, 140, 75, .25, 'sine'); }],
};

const expectedEffects = Object.values(SFX_PATHS)
  .map((path) => path.split('/').pop().replace(/\.wav$/, ''));
const missingEffects = expectedEffects.filter((name) => !effects[name]);
const unexpectedEffects = Object.keys(effects).filter((name) => !expectedEffects.includes(name));
if (missingEffects.length || unexpectedEffects.length) {
  throw new Error([
    missingEffects.length ? `Missing SFX generators: ${missingEffects.join(', ')}` : '',
    unexpectedEffects.length ? `Unexpected SFX generators: ${unexpectedEffects.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
}

for (const [name, [duration, draw]] of Object.entries(effects)) {
  const samples = make(duration);
  draw(samples);
  writeFileSync(resolve(output, `${name}.wav`), wav(samples));
}

console.log(`Generated ${Object.keys(effects).length} original SFX files in ${output}`);
