import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
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
if (Object.keys(chapters).length !== 7 || !chapters.outro) {
  throw new Error('Chapter registry must contain six chapters and the epilogue.');
}

await import('../src/ui/ui.js');
console.log(`Project check passed: ${files.length} JavaScript modules and ${Object.keys(chapters).length} campaign entries.`);
