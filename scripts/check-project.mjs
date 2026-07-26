import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
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

const { chapters } = await import('../src/game-data/registry.js');
const { characters } = await import('../src/game-data/characters.js');
if (Object.keys(chapters).length !== 7 || !chapters.outro) {
  throw new Error('Chapter registry must contain six chapters and the epilogue.');
}

for (const [id, character] of Object.entries(characters)) {
  for (const [pose, source] of Object.entries(character.sprites)) {
    if (!existsSync(source)) throw new Error(`Missing ${id} "${pose}" sprite: ${source}`);
  }
}

for (const chapter of Object.values(chapters)) {
  for (const scene of Object.values(chapter.scenes)) {
    for (const placement of scene.characters || []) {
      if (!characters[placement.id]) {
        throw new Error(`Scene "${scene.id}" uses unregistered character: ${placement.id}`);
      }
    }
  }
}

await import('../src/ui/ui.js');
console.log(`Project check passed: ${files.length} JavaScript modules, ${Object.keys(characters).length} characters, and ${Object.keys(chapters).length} campaign entries.`);
