/**
 * Quitopia Blocker — background service worker (MV3).
 *
 * Real blocking, done with declarativeNetRequest so the browser drops the request
 * before a single byte of the page loads. Nothing here talks to a network: the lists
 * live in chrome.storage and the rules are rebuilt locally.
 *
 * Rule map
 *   1  blocklist mode      -> redirect to block.html
 *   2  allowlist mode      -> block everything except the allowlist
 *   10 safe search         -> google -> forcesafesearch.google.com
 *   11 bing                -> strict.bing.com
 *   12 duckduckgo          -> safe.duckduckgo.com
 *   13 youtube             -> restrict.youtube.com
 */

const DEFAULT_STATE = {
  enabled: true,
  mode: 'blocklist', // 'blocklist' | 'allowlist' | 'schedule'
  safeSearch: true,
  youtubeRestricted: true,
  domains: [
    'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'youporn.com',
    'spankbang.com', 'onlyfans.com', 'chaturbate.com', 'stripchat.com', 'bongacams.com',
    'bet365.com', '1xbet.com', 'stake.com', 'dream11.com', 'rummycircle.com', 'pokerbaazi.com',
    'instagram.com', 'x.com', 'tiktok.com', 'reddit.com'
  ],
  keywords: ['porn', 'nsfw', 'xxx'],
  allowlist: ['wikipedia.org', 'google.com', 'github.com', 'stackoverflow.com'],
  schedule: { enabled: false, start: '22:00', end: '07:00' }
};

const RULE_BLOCKLIST = 1;
const RULE_ALLOWLIST = 2;
const RULE_GOOGLE = 10;
const RULE_BING = 11;
const RULE_DDG = 12;
const RULE_YOUTUBE = 13;

async function getState() {
  const stored = await chrome.storage.sync.get(DEFAULT_STATE);
  return { ...DEFAULT_STATE, ...stored };
}

function scheduleActive(schedule, now = new Date()) {
  if (!schedule?.enabled) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = schedule.start.split(':').map(Number);
  const [eh, em] = schedule.end.split(':').map(Number);
  const start = sh * 60 + (sm || 0);
  const end = eh * 60 + (em || 0);
  if (start === end) return false;
  return start < end ? minutes >= start && minutes < end : minutes >= start || minutes < end;
}

function buildRules(state) {
  const base = chrome.runtime.getURL('block.html');
  const redirectToBlock = { regexSubstitution: `${base}?host=\\1` };
  const hostFilter = '^https?://([^/?#]+)';
  const rules = [];

  const blockActive =
    state.enabled && (state.mode !== 'schedule' || scheduleActive(state.schedule));

  if (blockActive && state.mode === 'blocklist' && state.domains.length > 0) {
    rules.push({
      id: RULE_BLOCKLIST,
      priority: 3,
      action: { type: 'redirect', redirect: redirectToBlock },
      condition: {
        regexFilter: hostFilter,
        requestDomains: state.domains,
        excludedRequestDomains: state.allowlist,
        resourceTypes: ['main_frame']
      }
    });
  }

  if (blockActive && state.mode === 'allowlist') {
    rules.push({
      id: RULE_ALLOWLIST,
      priority: 2,
      action: { type: 'redirect', redirect: redirectToBlock },
      condition: {
        regexFilter: hostFilter,
        excludedRequestDomains: [
          ...state.allowlist,
          'localhost',
          '127.0.0.1',
          'chrome.google.com'
        ],
        resourceTypes: ['main_frame']
      }
    });
  }

  if (state.enabled && state.safeSearch) {
    rules.push(
      {
        id: RULE_GOOGLE,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: { regexSubstitution: 'https://forcesafesearch.google.com/search?\\1' }
        },
        condition: {
          regexFilter: '^https?://(?:www\\.)?google\\.[a-z.]{2,6}/search\\?(.*)$',
          resourceTypes: ['main_frame']
        }
      },
      {
        id: RULE_BING,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: { regexSubstitution: 'https://strict.bing.com/search?\\1' }
        },
        condition: {
          regexFilter: '^https?://(?:www\\.)?bing\\.com/search\\?(.*)$',
          resourceTypes: ['main_frame']
        }
      },
      {
        id: RULE_DDG,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: { regexSubstitution: 'https://safe.duckduckgo.com/?\\1' }
        },
        condition: {
          regexFilter: '^https?://(?:www\\.|html\\.)?duckduckgo\\.com/\\?(.*)$',
          resourceTypes: ['main_frame']
        }
      }
    );
  }

  if (state.enabled && state.youtubeRestricted) {
    rules.push({
      id: RULE_YOUTUBE,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { regexSubstitution: 'https://restrict.youtube.com/\\1' }
      },
      condition: {
        regexFilter: '^https?://(?:www\\.|m\\.)?youtube\\.com/(.*)$',
        resourceTypes: ['main_frame']
      }
    });
  }

  return rules;
}

async function syncRules() {
  const state = await getState();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);
  const addRules = buildRules(state);

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  } catch (error) {
    // A bad regex or an oversized list should never take the extension down.
    console.error('Quitopia: could not apply rules', error);
  }

  const blocking = addRules.some((r) => r.id === RULE_BLOCKLIST || r.id === RULE_ALLOWLIST);
  await chrome.action.setBadgeText({ text: blocking ? '' : 'off' });
  await chrome.action.setBadgeBackgroundColor({ color: '#0B3B2E' });
  await chrome.storage.local.set({
    lastSync: Date.now(),
    ruleCount: addRules.length,
    blockingNow: blocking
  });
}

function ensureAlarm() {
  chrome.alarms.create('quitopia-tick', { periodInMinutes: 1 });
}

chrome.runtime.onInstalled.addListener(() => {
  ensureAlarm();
  syncRules();
});

chrome.runtime.onStartup.addListener(() => {
  ensureAlarm();
  syncRules();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'quitopia-tick') syncRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') syncRules();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'resync') {
    syncRules().then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message?.type === 'getState') {
    Promise.all([getState(), chrome.storage.local.get(['lastSync', 'blockingNow'])]).then(
      ([state, meta]) => sendResponse({ state, meta })
    );
    return true;
  }
  if (message?.type === 'importState' && message.payload) {
    const incoming = message.payload;
    const next = {
      domains: Array.isArray(incoming.domains) ? incoming.domains : DEFAULT_STATE.domains,
      keywords: Array.isArray(incoming.keywords) ? incoming.keywords : DEFAULT_STATE.keywords,
      allowlist: Array.isArray(incoming.allowlist) ? incoming.allowlist : DEFAULT_STATE.allowlist,
      safeSearch: incoming.safeSearch ?? true,
      youtubeRestricted: incoming.youtubeRestricted ?? true,
      mode: incoming.mode ?? 'blocklist',
      schedule: incoming.schedule ?? DEFAULT_STATE.schedule
    };
    chrome.storage.sync.set(next).then(() => {
      syncRules().then(() => sendResponse({ ok: true }));
    });
    return true;
  }
  return false;
});
