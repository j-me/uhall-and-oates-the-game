import { mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const sampleRate = 22050;
const duration = 24;
const frames = sampleRate * duration;
const output = 'assets/audio/music';

const cues = {
  'title-original': { bpm: 116, bass: [45, 45, 52, 49, 42, 42, 49, 52], lead: [69, 0, 72, 76, 74, 0, 71, 69] },
  'chapter-01-original': { bpm: 122, bass: [42, 42, 49, 45, 38, 45, 47, 49], lead: [66, 69, 71, 0, 74, 71, 69, 66] },
  'chapter-02-original': { bpm: 108, bass: [40, 47, 43, 45, 40, 47, 50, 45], lead: [67, 0, 70, 72, 74, 72, 70, 0] },
  'chapter-03-original': { bpm: 126, bass: [43, 50, 47, 52, 43, 50, 54, 52], lead: [71, 74, 78, 0, 76, 74, 71, 69] },
  'chapter-04-original': { bpm: 112, bass: [38, 45, 41, 43, 38, 45, 48, 43], lead: [65, 68, 72, 70, 68, 0, 63, 65] },
  'chapter-05-original': { bpm: 124, bass: [37, 44, 40, 42, 37, 44, 47, 42], lead: [64, 67, 71, 0, 69, 67, 64, 62] },
  'chapter-06-original': { bpm: 120, bass: [47, 54, 50, 52, 47, 54, 57, 52], lead: [74, 78, 81, 78, 76, 74, 71, 0] },
  'outro-original': { bpm: 94, bass: [40, 47, 45, 43, 40, 47, 50, 43], lead: [67, 71, 74, 0, 72, 71, 67, 64] },
};

function midi(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function envelope(position, length, release = 0.28) {
  const attack = Math.min(1, position / 0.018);
  const tail = Math.min(1, (length - position) / release);
  return Math.max(0, attack * tail);
}

function writeWave(name, cue) {
  const beat = 60 / cue.bpm;
  const data = Buffer.alloc(frames * 4);
  let noise = 0x12345678 ^ name.length;
  for (let frame = 0; frame < frames; frame += 1) {
    const time = frame / sampleRate;
    const step = Math.floor(time / (beat / 2));
    const stepTime = time % (beat / 2);
    const bassNote = cue.bass[step % cue.bass.length];
    const leadNote = cue.lead[step % cue.lead.length];
    const bassFrequency = midi(bassNote);
    const bass = Math.sin(Math.PI * 2 * bassFrequency * time)
      * envelope(stepTime, beat / 2, 0.12) * 0.24;
    const leadFrequency = leadNote ? midi(leadNote) : 0;
    const lead = leadNote
      ? (Math.sin(Math.PI * 2 * leadFrequency * time)
        + 0.28 * Math.sin(Math.PI * 4 * leadFrequency * time))
        * envelope(stepTime, beat / 2, 0.16) * 0.12
      : 0;
    const kickPosition = time % beat;
    const kick = Math.sin(Math.PI * 2 * (54 + 42 * Math.exp(-kickPosition * 28)) * time)
      * Math.exp(-kickPosition * 18) * 0.24;
    noise ^= noise << 13; noise ^= noise >>> 17; noise ^= noise << 5;
    const snarePosition = (time + beat / 2) % beat;
    const snare = ((noise >>> 0) / 0xffffffff * 2 - 1)
      * Math.exp(-snarePosition * 32) * 0.075;
    const shimmer = Math.sin(Math.PI * 2 * midi(bassNote + 19) * time) * 0.025;
    const sample = Math.max(-1, Math.min(1, bass + lead + kick + snare + shimmer));
    const left = Math.round(sample * 28500);
    const right = Math.round((sample - lead * 0.08 + shimmer * 0.12) * 28500);
    data.writeInt16LE(left, frame * 4);
    data.writeInt16LE(right, frame * 4 + 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(2, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 4, 28);
  header.writeUInt16LE(4, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  const wavePath = `${output}/${name}.wav`;
  writeFileSync(wavePath, Buffer.concat([header, data]));
  return wavePath;
}

mkdirSync(output, { recursive: true });
Object.entries(cues).forEach(([name, cue]) => {
  const wavePath = writeWave(name, cue);
  const mp3Path = `${output}/${name}.mp3`;
  const result = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', wavePath, '-codec:a', 'libmp3lame', '-b:a', '96k', mp3Path], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`ffmpeg could not encode ${name}.`);
  unlinkSync(wavePath);
});
console.log(`Generated ${Object.keys(cues).length} original MP3 cues in ${output}.`);
