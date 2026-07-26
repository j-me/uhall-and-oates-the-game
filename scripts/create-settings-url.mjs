import { readFileSync } from 'node:fs';

const [settingsPath = 'settings.local.json', pageUrl = 'index.html', format = 'json'] = process.argv.slice(2);
let settings;

try {
  settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
} catch (error) {
  console.error(`Could not read valid JSON from ${settingsPath}: ${error.message}`);
  process.exit(1);
}

const separator = pageUrl.includes('?') ? '&' : '?';
const json = JSON.stringify(settings);
const base64Url = Buffer.from(json, 'utf8').toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');
const encodedSettings = format === 'base64' ? base64Url : encodeURIComponent(json);

if (!['json', 'base64'].includes(format)) {
  console.error('Format must be “json” or “base64”.');
  process.exit(1);
}

console.log(`${pageUrl}${separator}settings=${encodedSettings}`);
