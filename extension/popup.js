const $ = (id) => document.getElementById(id);

async function load() {
  const state = await chrome.storage.sync.get({
    enabled: true,
    safeSearch: true,
    youtubeRestricted: true,
    domains: [],
    keywords: []
  });

  $('enabled').checked = state.enabled;
  $('safeSearch').checked = state.safeSearch;
  $('youtubeRestricted').checked = state.youtubeRestricted;
  $('domains').value = state.domains.join('\n');
  $('keywords').value = state.keywords.join('\n');
  $('domainCount').textContent = `${state.domains.length} domains · ${state.keywords.length} keywords`;
}

function parseLines(value) {
  return Array.from(
    new Set(
      value
        .split('\n')
        .map((line) => line.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

['enabled', 'safeSearch', 'youtubeRestricted'].forEach((id) => {
  $(id).addEventListener('change', async (event) => {
    await chrome.storage.sync.set({ [id]: event.target.checked });
    chrome.runtime.sendMessage({ type: 'resync' });
  });
});

$('save').addEventListener('click', async () => {
  const domains = parseLines($('domains').value);
  await chrome.storage.sync.set({ domains });
  $('domainCount').textContent = `${domains.length} domains saved`;
  chrome.runtime.sendMessage({ type: 'resync' });
});

$('saveKeywords').addEventListener('click', async () => {
  const keywords = parseLines($('keywords').value);
  await chrome.storage.sync.set({ keywords });
  alert(`${keywords.length} keywords saved. Reload open tabs to apply.`);
});

$('export').addEventListener('click', async () => {
  const state = await chrome.storage.sync.get(null);
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quitopia-blocklist.json';
  a.click();
  URL.revokeObjectURL(url);
});

load();
