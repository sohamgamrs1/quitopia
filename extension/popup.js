const $ = (id) => document.getElementById(id);

const SWITCHES = ['enabled', 'safeSearch', 'youtubeRestricted', 'scheduleEnabled'];

function paintSwitch(el, on) {
  el.setAttribute('aria-checked', on ? 'true' : 'false');
}

function parseLines(value) {
  return Array.from(
    new Set(
      value
        .split('\n')
        .map((line) => line.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0])
        .filter(Boolean)
    )
  );
}

async function load() {
  const { state, meta } = await chrome.runtime.sendMessage({ type: 'getState' });

  paintSwitch($('enabled'), state.enabled);
  paintSwitch($('safeSearch'), state.safeSearch);
  paintSwitch($('youtubeRestricted'), state.youtubeRestricted);
  paintSwitch($('scheduleEnabled'), state.schedule?.enabled ?? false);

  $('mode').value = state.mode;
  $('domains').value = state.domains.join('\n');
  $('keywords').value = state.keywords.join('\n');
  $('allowlist').value = state.allowlist.join('\n');
  $('start').value = state.schedule?.start ?? '22:00';
  $('end').value = state.schedule?.end ?? '07:00';
  $('domainCount').textContent = `${state.domains.length} domains · ${state.keywords.length} keywords`;

  const dot = $('statusDot');
  const text = $('statusText');
  if (meta?.blockingNow) {
    dot.classList.remove('off');
    text.textContent = `Active · ${meta.ruleCount ?? 0} rules applied`;
  } else {
    dot.classList.add('off');
    text.textContent = state.enabled ? 'Idle (outside the focus window)' : 'Blocking is off';
  }
}

SWITCHES.forEach((id) => {
  $(id).addEventListener('click', async () => {
    const el = $(id);
    const next = el.getAttribute('aria-checked') !== 'true';
    paintSwitch(el, next);

    if (id === 'scheduleEnabled') {
      const current = await chrome.storage.sync.get({ schedule: { enabled: false, start: '22:00', end: '07:00' } });
      await chrome.storage.sync.set({
        schedule: { ...current.schedule, enabled: next, start: $('start').value, end: $('end').value }
      });
    } else {
      await chrome.storage.sync.set({ [id]: next });
    }
    chrome.runtime.sendMessage({ type: 'resync' }).then(load);
  });
});

['start', 'end'].forEach((id) => {
  $(id).addEventListener('change', async () => {
    const current = await chrome.storage.sync.get({ schedule: { enabled: false, start: '22:00', end: '07:00' } });
    await chrome.storage.sync.set({
      schedule: { ...current.schedule, start: $('start').value, end: $('end').value }
    });
    chrome.runtime.sendMessage({ type: 'resync' }).then(load);
  });
});

$('mode').addEventListener('change', async () => {
  await chrome.storage.sync.set({ mode: $('mode').value });
  chrome.runtime.sendMessage({ type: 'resync' }).then(load);
});

$('save').addEventListener('click', async () => {
  const domains = parseLines($('domains').value);
  const keywords = parseLines($('keywords').value);
  const allowlist = parseLines($('allowlist').value);

  await chrome.storage.sync.set({ domains, keywords, allowlist });
  await chrome.runtime.sendMessage({ type: 'resync' });
  await load();
  $('statusText').textContent = `Saved · ${domains.length} domains blocked`;
});

$('export').addEventListener('click', async () => {
  const { state } = await chrome.runtime.sendMessage({ type: 'getState' });
  const payload = {
    type: 'quitopia-blocker',
    version: 1,
    domains: state.domains,
    keywords: state.keywords,
    allowlist: state.allowlist,
    safeSearch: state.safeSearch,
    youtubeRestricted: state.youtubeRestricted,
    mode: state.mode,
    schedule: state.schedule
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quitopia-blocker.json';
  a.click();
  URL.revokeObjectURL(url);
});

$('importBtn').addEventListener('click', () => $('importFile').click());

$('importFile').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const payload = parsed.type === 'quitopia-blocker' ? parsed : parsed.blocker ?? parsed;
      await chrome.runtime.sendMessage({ type: 'importState', payload });
      await load();
      $('statusText').textContent = 'Imported from Quitopia';
    } catch {
      $('statusText').textContent = 'That file could not be read';
    }
    event.target.value = '';
  };
  reader.readAsText(file);
});

load();
