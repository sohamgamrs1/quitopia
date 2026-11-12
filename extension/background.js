/**
 * Quitopia Blocker — background service worker.
 *
 * Everything is local: the blocklist lives in chrome.storage.sync, and blocking is done
 * with declarativeNetRequest dynamic rules. No network requests, no remote lists.
 */

const DEFAULT_STATE = {
  enabled: true,
  safeSearch: true,
  youtubeRestricted: true,
  domains: [
    'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'youporn.com',
    'spankbang.com', 'onlyfans.com', 'chaturbate.com', 'stripchat.com',
    'bet365.com', '1xbet.com', 'stake.com', 'dream11.com', 'rummycircle.com'
  ],
  keywords: ['porn', 'nsfw', 'xxx']
};

const RULE_ID_DOMAIN = 1;
const RULE_ID_SAFE = 2;

async function getState() {
  const stored = await chrome.storage.sync.get(DEFAULT_STATE);
  return { ...DEFAULT_STATE, ...stored };
}

function buildRules(state) {
  const rules = [];

  if (state.enabled && state.domains.length > 0) {
    rules.push({
      id: RULE_ID_DOMAIN,
      priority: 1,
      action: { type: 'redirect', redirect: { extensionPath: '/block.html' } },
      condition: {
        requestDomains: state.domains,
        resourceTypes: ['main_frame']
      }
    });
  }

  if (state.enabled && state.safeSearch) {
    rules.push({
      id: RULE_ID_SAFE,
      priority: 2,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: 'https://forcesafesearch.google.com/search?q=\\1'
        }
      },
      condition: {
        urlFilter: '||google.com/search',
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
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules: buildRules(state)
  });
  await chrome.action.setBadgeText({ text: state.enabled ? '' : 'off' });
}

chrome.runtime.onInstalled.addListener(() => {
  syncRules();
});

chrome.runtime.onStartup.addListener(() => {
  syncRules();
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
    getState().then((state) => sendResponse(state));
    return true;
  }
  return false;
});
