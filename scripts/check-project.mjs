import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function findJavaScript(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findJavaScript(path);
    return entry.isFile() && path.endsWith('.js') ? [path] : [];
  });
}

const files = [...findJavaScript('src'), 'service-worker.js'];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

const sourceWorkerPaths = [...readFileSync('service-worker.js', 'utf8').matchAll(/'\.\/(src\/[^']+)'/g)]
  .map((match) => match[1]);
const missingSourceWorkerPaths = sourceWorkerPaths.filter((path) => !existsSync(path));
if (missingSourceWorkerPaths.length) {
  throw new Error(`Service worker references missing source modules:\n${missingSourceWorkerPaths.join('\n')}`);
}

const namingRules = [
  ['src/game-data/campaigns/original/chapters', /^original-chapter-.+\.js$/],
  ['src/game-data/campaigns/original/scenes', /^original-scene-.+\.js$/],
  ['src/game-data/campaigns/original/dialogue', /^original-dialogue-.+\.js$/],
  ['src/game-data/campaigns/adult-relocation/chapters', /^adult-chapter-.+\.js$/],
  ['src/game-data/campaigns/adult-relocation/scenes', /^adult-scene-.+\.js$/],
];

const legacyCampaignDirectories = [
  'src/game-data/original',
  'src/game-data/adult-relocation',
].filter(existsSync);
if (legacyCampaignDirectories.length) {
  throw new Error(`Campaigns must live under src/game-data/campaigns:\n${legacyCampaignDirectories.join('\n')}`);
}

for (const [directory, pattern] of namingRules) {
  const invalid = readdirSync(directory).filter((name) => name.endsWith('.js') && !pattern.test(name));
  if (invalid.length) throw new Error(`Invalid campaign filename in ${directory}: ${invalid.join(', ')}`);
}

const adultSceneDirectory = 'src/game-data/campaigns/adult-relocation/scenes';
const adultSceneFiles = readdirSync(adultSceneDirectory)
  .filter((name) => name.endsWith('.js') && name !== 'adult-scene-helpers.js');
for (const name of adultSceneFiles) {
  const source = readFileSync(join(adultSceneDirectory, name), 'utf8');
  if (!/\bexport const adult[A-Z]\w+\s*=\s*\{/.test(source)) {
    throw new Error(`Adult scene module must own its scene definition instead of re-exporting it: ${name}`);
  }
}

const { campaigns, chapters } = await import('../src/game-data/registry.js');
const { characters } = await import('../src/game-data/characters.js');
const { MUSIC_SLOTS, SFX_PATHS, musicSources } = await import('../src/game-data/audio/audio-manifest.js');
if (Object.keys(chapters).length !== 7 || !chapters.outro || !campaigns['adult-relocation']) {
  throw new Error('Chapter registry must contain six chapters and the epilogue.');
}

const expectedMusicSlots = ['title', ...Object.values(campaigns).flatMap((campaign) => campaign.chapterOrder)];
const missingMusicSlots = expectedMusicSlots.filter((slot) => !MUSIC_SLOTS.includes(slot));
const unusedMusicSlots = MUSIC_SLOTS.filter((slot) => !expectedMusicSlots.includes(slot));
if (missingMusicSlots.length || unusedMusicSlots.length) {
  throw new Error([
    missingMusicSlots.length ? `Campaigns lack declared music slots: ${missingMusicSlots.join(', ')}` : '',
    unusedMusicSlots.length ? `Audio manifest contains unused music slots: ${unusedMusicSlots.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
}

const workerSource = readFileSync('service-worker.js', 'utf8');
const requiredAudioPaths = [
  ...MUSIC_SLOTS.map((slot) => musicSources(slot).original),
  ...Object.values(SFX_PATHS),
];
const missingAudioFiles = requiredAudioPaths.filter((path) => !existsSync(path));
const uncachedAudioFiles = requiredAudioPaths.filter((path) => !workerSource.includes(`'./${path}'`));
if (missingAudioFiles.length || uncachedAudioFiles.length) {
  throw new Error([
    missingAudioFiles.length ? `Runtime audio files are missing:\n${missingAudioFiles.join('\n')}` : '',
    uncachedAudioFiles.length ? `Runtime audio files are absent from the service worker:\n${uncachedAudioFiles.join('\n')}` : '',
  ].filter(Boolean).join('\n'));
}

const titleFallback = musicSources('title').original;
const indexSource = readFileSync('index.html', 'utf8');
if (!indexSource.includes(`data-fallback-src="${titleFallback}"`)) {
  throw new Error(`Title audio fallback must reference ${titleFallback}.`);
}
const settingsMusicSlots = [...indexSource.matchAll(/data-track-url="([^"]+)"/g)].map((match) => match[1]);
const missingSettingsSlots = MUSIC_SLOTS.filter((slot) => !settingsMusicSlots.includes(slot));
const unknownSettingsSlots = settingsMusicSlots.filter((slot) => !MUSIC_SLOTS.includes(slot));
if (missingSettingsSlots.length || unknownSettingsSlots.length) {
  throw new Error([
    missingSettingsSlots.length ? `Settings UI lacks music slots: ${missingSettingsSlots.join(', ')}` : '',
    unknownSettingsSlots.length ? `Settings UI contains unknown music slots: ${unknownSettingsSlots.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
}

for (const [id, character] of Object.entries(characters)) {
  for (const [pose, source] of Object.entries(character.sprites)) {
    if (!existsSync(source)) throw new Error(`Missing ${id} "${pose}" sprite: ${source}`);
  }
}

for (const campaign of Object.values(campaigns)) {
  for (const chapter of Object.values(campaign.chapters)) {
    for (const scene of Object.values(chapter.scenes)) {
      if (scene.background && !existsSync(scene.background)) {
        throw new Error(`Scene "${scene.id}" is missing its background: ${scene.background}`);
      }
      if (scene.reveal?.src && !existsSync(scene.reveal.src)) {
        throw new Error(`Scene "${scene.id}" is missing its reveal art: ${scene.reveal.src}`);
      }
      for (const placement of scene.characters || []) {
        if (!characters[placement.id]) {
          throw new Error(`Scene "${scene.id}" uses unregistered character: ${placement.id}`);
        }
        const bounds = placement.bounds;
        if (!bounds || bounds.left < 0 || bounds.top < 0 || bounds.width <= 0 || bounds.height <= 0
          || bounds.left + bounds.width > 100 || bounds.top + bounds.height > 100) {
          throw new Error(`Scene "${scene.id}" has an invalid character placement for ${placement.id}.`);
        }
      }
    }
  }
}

await import('../src/ui/ui.js');
console.log(`Project check passed: ${files.length} JavaScript modules, ${Object.keys(characters).length} characters, and ${Object.keys(campaigns).length} campaigns.`);
