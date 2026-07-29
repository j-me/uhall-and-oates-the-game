import { MUSIC_SLOTS } from '../game-data/audio/audio-manifest.js';

const STORAGE_KEY = 'uhall-oates-settings-v1';
const emptyExternalUrls = () => Object.fromEntries(MUSIC_SLOTS.map((slot) => [slot, '']));

const defaults = {
  soundEnabled: true,
  musicMode: 'external',
  debugEnabled: false,
  externalUrls: emptyExternalUrls(),
};

function normalizeSettings(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Settings JSON must be an object.');
  if ('soundEnabled' in input && typeof input.soundEnabled !== 'boolean') throw new Error('soundEnabled must be true or false.');
  if ('debugEnabled' in input && typeof input.debugEnabled !== 'boolean') throw new Error('debugEnabled must be true or false.');
  if ('musicMode' in input && !['external', 'original'].includes(input.musicMode)) {
    throw new Error('musicMode must be “external” or “original”.');
  }
  if ('externalUrls' in input && (!input.externalUrls || typeof input.externalUrls !== 'object' || Array.isArray(input.externalUrls))) {
    throw new Error('externalUrls must be an object.');
  }
  const externalUrls = { ...defaults.externalUrls };
  Object.keys(externalUrls).forEach((id) => {
    const url = input.externalUrls?.[id];
    if (url !== undefined && typeof url !== 'string') throw new Error(`externalUrls.${id} must be text.`);
    if (typeof url === 'string') externalUrls[id] = url.trim();
  });
  return {
    soundEnabled: input.soundEnabled ?? defaults.soundEnabled,
    musicMode: input.musicMode ?? defaults.musicMode,
    debugEnabled: input.debugEnabled ?? defaults.debugEnabled,
    externalUrls,
  };
}

function loadSavedSettings() {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
  } catch {
    return normalizeSettings();
  }
}

function parseSettingsParameter(value) {
  try {
    return JSON.parse(value);
  } catch {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
}

function loadSettings() {
  const suppliedSettings = new URLSearchParams(window.location.search).get('settings');
  if (suppliedSettings === null) return loadSavedSettings();
  try {
    const settings = normalizeSettings(parseSettingsParameter(suppliedSettings));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('settings');
    window.history.replaceState(null, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
    return settings;
  } catch {
    return loadSavedSettings();
  }
}

export function createSettings({ root, onChange, onDebugChapter }) {
  const panel = root.querySelector('#settings-panel');
  const form = panel.querySelector('#settings-form');
  const externalFields = panel.querySelector('#external-music-fields');
  const debugSelect = panel.querySelector('#debug-chapter-select');
  const jsonValue = panel.querySelector('#settings-json-value');
  const jsonStatus = panel.querySelector('#settings-json-status');
  const standardView = panel.querySelector('#settings-standard-view');
  const advancedView = panel.querySelector('#settings-advanced-view');
  const viewButtons = panel.querySelectorAll('[data-settings-view]');
  let values = loadSettings();
  let activeView = 'standard';

  function saveAndApply() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    onChange({ ...values, externalUrls: { ...values.externalUrls } });
  }

  function render() {
    form.elements.soundEnabled.checked = values.soundEnabled;
    form.elements.musicMode.value = values.musicMode;
    form.elements.debugEnabled.checked = values.debugEnabled;
    Object.entries(values.externalUrls).forEach(([id, url]) => {
      const input = form.querySelector(`[data-track-url="${id}"]`);
      if (input) input.value = url;
    });
    const usingExternal = values.musicMode === 'external';
    externalFields.hidden = !usingExternal;
    debugSelect.classList.toggle('is-hidden', !values.debugEnabled);
    standardView.classList.toggle('is-hidden', activeView !== 'standard');
    advancedView.classList.toggle('is-hidden', activeView !== 'advanced');
    viewButtons.forEach((button) => {
      const selected = button.dataset.settingsView === activeView;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function open() {
    render();
    panel.classList.remove('is-hidden');
    panel.querySelector('.settings-close').focus();
  }

  function close() {
    panel.classList.add('is-hidden');
  }

  root.querySelectorAll('[data-open-settings]').forEach((button) => button.addEventListener('click', open));
  panel.querySelectorAll('[data-close-settings]').forEach((button) => button.addEventListener('click', close));
  panel.addEventListener('click', (event) => {
    if (event.target === panel) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.classList.contains('is-hidden')) close();
  });
  form.addEventListener('change', (event) => {
    if (event.target.name === 'soundEnabled') values.soundEnabled = event.target.checked;
    if (event.target.name === 'musicMode') values.musicMode = event.target.value;
    if (event.target.name === 'debugEnabled') values.debugEnabled = event.target.checked;
    if (event.target.matches('[data-track-url]')) {
      values.externalUrls[event.target.dataset.trackUrl] = event.target.value.trim();
    }
    render();
    saveAndApply();
  });
  panel.querySelector('#reset-music-urls').addEventListener('click', () => {
    values.externalUrls = { ...defaults.externalUrls };
    render();
    saveAndApply();
  });
  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeView = button.dataset.settingsView;
      if (activeView === 'advanced') {
        jsonValue.value = JSON.stringify(values, null, 2);
        jsonStatus.textContent = '';
      }
      render();
    });
  });
  panel.querySelector('#copy-settings-json').addEventListener('click', async () => {
    const json = JSON.stringify(values, null, 2);
    jsonValue.value = json;
    try {
      await navigator.clipboard.writeText(json);
      jsonStatus.textContent = 'Copied all settings to the clipboard.';
    } catch {
      jsonValue.focus();
      jsonValue.select();
      jsonStatus.textContent = 'JSON is selected. Use Copy from your browser or keyboard.';
    }
  });
  panel.querySelector('#apply-settings-json').addEventListener('click', () => {
    try {
      values = normalizeSettings(JSON.parse(jsonValue.value));
      render();
      saveAndApply();
      jsonValue.value = JSON.stringify(values, null, 2);
      jsonStatus.textContent = 'Settings applied and saved.';
    } catch (error) {
      jsonStatus.textContent = `Could not apply: ${error.message}`;
    }
  });
  panel.querySelectorAll('[data-debug-chapter]').forEach((button) => {
    button.addEventListener('click', () => {
      close();
      onDebugChapter(button.dataset.debugChapter);
    });
  });

  render();
  onChange({ ...values, externalUrls: { ...values.externalUrls } });
  return { open, close, get values() { return values; } };
}
