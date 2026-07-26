import { readFileSync } from 'node:fs';

const [settingsPath = 'settings.local.json', pageUrl = 'index.html'] = process.argv.slice(2);
let settings;

try {
  settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
} catch (error) {
  console.error(`Could not read valid JSON from ${settingsPath}: ${error.message}`);
  process.exit(1);
}

const separator = pageUrl.includes('?') ? '&' : '?';
console.log(`${pageUrl}${separator}settings=${encodeURIComponent(JSON.stringify(settings))}`);
