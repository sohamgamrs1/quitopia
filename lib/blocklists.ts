export interface BlockList {
  id: string;
  label: string;
  description: string;
  domains: string[];
  keywords: string[];
}

export const BLOCKLISTS: BlockList[] = [
  {
    id: 'porn',
    label: 'Adult content',
    description: 'Explicit sites and the aggregators that lead to them.',
    domains: [
      'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com', 'youporn.com',
      'spankbang.com', 'onlyfans.com', 'chaturbate.com', 'livejasmin.com', 'bongacams.com',
      'stripchat.com', 'nhentai.net', 'e-hentai.org', 'literotica.com', 'motherless.com',
      'beeg.com', 'txxx.com', 'hclips.com', 'sex.com', 'porn.com', 'fapello.com', 'thothub.tv'
    ],
    keywords: ['porn', 'nsfw', 'xxx', 'camgirl', 'hentai']
  },
  {
    id: 'gambling',
    label: 'Gambling & betting',
    description: 'Sportsbooks, casinos and cash rummy.',
    domains: [
      'bet365.com', 'betway.com', '1xbet.com', '22bet.com', 'dafabet.com', '10cric.com',
      'parimatch.com', 'melbet.com', 'mostbet.com', 'stake.com', 'pokerstars.com',
      'dream11.com', 'mpl.live', 'rummycircle.com', 'adda52.com', 'pokerbaazi.com'
    ],
    keywords: ['betting', 'casino', 'free spins', 'jackpot']
  },
  {
    id: 'social',
    label: 'Social media',
    description: 'The endless scroll: feeds, reels and shorts.',
    domains: [
      'instagram.com', 'facebook.com', 'x.com', 'twitter.com', 'snapchat.com', 'reddit.com',
      'tiktok.com', 'threads.net', 'tumblr.com', 'pinterest.com', 'discord.com'
    ],
    keywords: ['reels', 'shorts', 'for you page']
  },
  {
    id: 'gaming',
    label: 'Gaming',
    description: 'Game stores, launchers and streaming.',
    domains: [
      'steampowered.com', 'epicgames.com', 'battle.net', 'roblox.com', 'minecraft.net',
      'freefiremobile.com', 'bgmi.com', 'callofduty.com', 'leagueoflegends.com', 'twitch.tv'
    ],
    keywords: ['esports', 'battle pass']
  }
];

export const KEYWORD_PRESETS = [
  'porn', 'xxx', 'nsfw', 'casino', 'betting', 'free spins', 'reels', 'shorts'
];

/** Normalises whatever the user typed into a bare hostname. */
export function normaliseHost(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0];
}

export function hostMatches(host: string, rule: string): boolean {
  const h = normaliseHost(host);
  const r = normaliseHost(rule);
  if (!h || !r) return false;
  return h === r || h.endsWith(`.${r}`);
}

export interface CheckResult {
  blocked: boolean;
  reason?: 'blocklist' | 'keyword' | 'allowlist' | 'schedule' | 'hardlock';
  matched?: string;
}

/**
 * The demo blocker. It runs entirely in the browser against the rules the user has
 * saved, which is the whole point of this build: no network, no server, no extension
 * required to see the behaviour.
 */
export function evaluate(
  input: string,
  options: {
    mode: 'blocklist' | 'allowlist' | 'schedule';
    customRules: { type: 'url' | 'keyword' | 'app'; value: string }[];
    allowlist: string[];
    schedule: { enabled: boolean; start: string; end: string };
    now?: Date;
  }
): CheckResult {
  const raw = input.trim().toLowerCase();
  if (!raw) return { blocked: false };
  const host = normaliseHost(raw);

  const allowed = options.allowlist.some((a) => hostMatches(host, a));
  if (allowed) return { blocked: false, reason: 'allowlist', matched: host };

  if (options.mode === 'schedule' && options.schedule.enabled) {
    const now = options.now ?? new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = options.schedule.start.split(':').map(Number);
    const [eh, em] = options.schedule.end.split(':').map(Number);
    const start = sh * 60 + (sm || 0);
    const end = eh * 60 + (em || 0);
    const inWindow = start <= end ? minutes >= start && minutes < end : minutes >= start || minutes < end;
    if (inWindow) return { blocked: true, reason: 'schedule' };
  }

  const customUrl = options.customRules.find((r) => r.type === 'url' && hostMatches(host, r.value));
  if (customUrl) return { blocked: true, reason: 'blocklist', matched: customUrl.value };

  const keyword = options.customRules.find(
    (r) => r.type === 'keyword' && raw.includes(r.value.toLowerCase())
  );
  if (keyword) return { blocked: true, reason: 'keyword', matched: keyword.value };

  const presetKeyword = BLOCKLISTS.flatMap((l) => l.keywords).find((k) => raw.includes(k));
  if (presetKeyword) return { blocked: true, reason: 'keyword', matched: presetKeyword };

  if (options.mode === 'allowlist') {
    return { blocked: true, reason: 'allowlist' };
  }

  const preset = BLOCKLISTS.flatMap((l) => l.domains).find((d) => hostMatches(host, d));
  if (preset) return { blocked: true, reason: 'blocklist', matched: preset };

  return { blocked: false };
}
