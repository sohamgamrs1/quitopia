'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { dayKey, daysBetween, uid } from './utils';
import { addictionById } from './addictions';

export type Goal = 'quit' | 'reduce';

export interface Profile {
  name: string;
  addictions: string[];
  customAddiction: string;
  frequency: string;
  triggers: string[];
  goal: Goal;
  startDate: string;
  reason: string;
  onboarded: boolean;
}

export interface CheckIn {
  date: string;
  mood: number;
  urge: number;
  clean: boolean;
  note?: string;
  /** When the check-in was actually saved, used for the early-riser badge. */
  at?: string;
}

export interface Slip {
  id: string;
  at: string;
  note?: string;
}

export interface JournalEntry {
  id: string;
  at: string;
  prompt: string;
  text: string;
}

export interface TriggerLog {
  id: string;
  at: string;
  place: string;
  emotion: string;
  device: string;
  before: string;
}

export interface Rule {
  id: string;
  type: 'url' | 'keyword' | 'app';
  value: string;
  createdAt: string;
}

export type BlockMode = 'blocklist' | 'allowlist' | 'schedule';
export type LockMode = 'none' | 'time' | 'pin';

export interface HardLock {
  mode: LockMode;
  until: number | null;
  pin: string | null;
  startedAt: number | null;
}

export interface BlockerState {
  mode: BlockMode;
  rules: Rule[];
  allowlist: string[];
  schedule: { enabled: boolean; start: string; end: string };
  hardLock: HardLock;
  safeSearch: boolean;
  youtubeRestricted: boolean;
}

export interface Post {
  id: string;
  category: string;
  author: string;
  text: string;
  at: string;
  likes: number;
  reported: boolean;
  hidden: boolean;
}

export interface GameState {
  xp: number;
  urgesDefeated: number;
  badges: string[];
  freezesUsed: number;
  lastFreezeMonth: string;
}

export interface Settings {
  dailySpend: Record<string, number>;
  theme: 'light' | 'dark';
  pin: string | null;
  partnerName: string;
  partnerContact: string;
  notifications: boolean;
}

interface QuitopiaState {
  hydrated: boolean;
  profile: Profile | null;
  checkins: CheckIn[];
  slips: Slip[];
  journal: JournalEntry[];
  triggers: TriggerLog[];
  posts: Post[];
  blocker: BlockerState;
  game: GameState;
  settings: Settings;

  setHydrated: () => void;
  saveProfile: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  recordSlip: (note?: string) => void;
  addJournal: (prompt: string, text: string) => void;
  removeJournal: (id: string) => void;
  addTrigger: (log: Omit<TriggerLog, 'id' | 'at'>) => void;
  removeTrigger: (id: string) => void;
  addRule: (type: Rule['type'], value: string) => void;
  removeRule: (id: string) => void;
  setBlocker: (patch: Partial<BlockerState>) => void;
  startHardLock: (mode: LockMode, until: number | null, pin: string | null) => void;
  endHardLock: () => void;
  addAllowlist: (host: string) => void;
  removeAllowlist: (host: string) => void;
  addPost: (category: string, text: string) => void;
  likePost: (id: string) => void;
  reportPost: (id: string) => void;
  hidePost: (id: string) => void;
  addXp: (amount: number) => void;
  defeatUrge: () => void;
  setBadges: (badges: string[]) => void;
  useFreeze: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setPin: (pin: string | null) => void;
  setSpend: (addictionId: string, amount: number) => void;
  setPartner: (name: string, contact: string) => void;
  setNotifications: (on: boolean) => void;
  importData: (raw: string) => boolean;
  resetAll: () => void;
}

const defaultBlocker: BlockerState = {
  mode: 'blocklist',
  rules: [],
  allowlist: ['wikipedia.org', 'google.com', 'youtube.com'],
  schedule: { enabled: false, start: '22:00', end: '07:00' },
  hardLock: { mode: 'none', until: null, pin: null, startedAt: null },
  safeSearch: true,
  youtubeRestricted: true
};

const defaultGame: GameState = {
  xp: 0,
  urgesDefeated: 0,
  badges: [],
  freezesUsed: 0,
  lastFreezeMonth: ''
};

const defaultSettings: Settings = {
  dailySpend: {},
  theme: 'light',
  pin: null,
  partnerName: '',
  partnerContact: '',
  notifications: true
};

export const useStore = create<QuitopiaState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: null,
      checkins: [],
      slips: [],
      journal: [],
      triggers: [],
      posts: [],
      blocker: defaultBlocker,
      game: defaultGame,
      settings: defaultSettings,

      setHydrated: () => set({ hydrated: true }),

      saveProfile: (profile) => set({ profile }),

      updateProfile: (patch) =>
        set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : s.profile })),

      addCheckIn: (checkIn) =>
        set((s) => ({
          checkins: [...s.checkins.filter((c) => c.date !== checkIn.date), checkIn]
        })),

      recordSlip: (note) =>
        set((s) => ({
          slips: [{ id: uid(), at: new Date().toISOString(), note }, ...s.slips],
          game: { ...s.game, xp: Math.max(0, s.game.xp - 20) }
        })),

      addJournal: (prompt, text) =>
        set((s) => ({
          journal: [{ id: uid(), at: new Date().toISOString(), prompt, text }, ...s.journal]
        })),

      removeJournal: (id) => set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),

      addTrigger: (log) =>
        set((s) => ({
          triggers: [{ ...log, id: uid(), at: new Date().toISOString() }, ...s.triggers]
        })),

      removeTrigger: (id) => set((s) => ({ triggers: s.triggers.filter((t) => t.id !== id) })),

      addRule: (type, value) =>
        set((s) => ({
          blocker: {
            ...s.blocker,
            rules: [
              { id: uid(), type, value: value.trim().toLowerCase(), createdAt: new Date().toISOString() },
              ...s.blocker.rules
            ]
          }
        })),

      removeRule: (id) =>
        set((s) => ({
          blocker: { ...s.blocker, rules: s.blocker.rules.filter((r) => r.id !== id) }
        })),

      setBlocker: (patch) => set((s) => ({ blocker: { ...s.blocker, ...patch } })),

      startHardLock: (mode, until, pin) =>
        set((s) => ({
          blocker: { ...s.blocker, hardLock: { mode, until, pin, startedAt: Date.now() } }
        })),

      endHardLock: () =>
        set((s) => ({
          blocker: { ...s.blocker, hardLock: { mode: 'none', until: null, pin: null, startedAt: null } }
        })),

      addAllowlist: (host) =>
        set((s) => ({
          blocker: {
            ...s.blocker,
            allowlist: Array.from(new Set([...s.blocker.allowlist, host.trim().toLowerCase()]))
          }
        })),

      removeAllowlist: (host) =>
        set((s) => ({
          blocker: { ...s.blocker, allowlist: s.blocker.allowlist.filter((h) => h !== host) }
        })),

      addPost: (category, text) =>
        set((s) => ({
          posts: [
            {
              id: uid(),
              category,
              author: s.profile?.name?.trim() || 'Anonymous',
              text,
              at: new Date().toISOString(),
              likes: 0,
              reported: false,
              hidden: false
            },
            ...s.posts
          ]
        })),

      likePost: (id) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
        })),

      reportPost: (id) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, reported: true } : p))
        })),

      hidePost: (id) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, hidden: true } : p))
        })),

      addXp: (amount) => set((s) => ({ game: { ...s.game, xp: s.game.xp + amount } })),

      defeatUrge: () =>
        set((s) => ({
          game: { ...s.game, xp: s.game.xp + 50, urgesDefeated: s.game.urgesDefeated + 1 }
        })),

      setBadges: (badges) => set((s) => ({ game: { ...s.game, badges } })),

      useFreeze: () =>
        set((s) => ({
          game: { ...s.game, freezesUsed: s.game.freezesUsed + 1, lastFreezeMonth: dayKey().slice(0, 7) }
        })),

      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),

      setPin: (pin) => set((s) => ({ settings: { ...s.settings, pin } })),

      setSpend: (addictionId, amount) =>
        set((s) => ({
          settings: { ...s.settings, dailySpend: { ...s.settings.dailySpend, [addictionId]: amount } }
        })),

      setPartner: (name, contact) =>
        set((s) => ({ settings: { ...s.settings, partnerName: name, partnerContact: contact } })),

      setNotifications: (on) => set((s) => ({ settings: { ...s.settings, notifications: on } })),

      importData: (raw) => {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== 'object') return false;
          set({
            profile: parsed.profile ?? null,
            checkins: parsed.checkins ?? [],
            slips: parsed.slips ?? [],
            journal: parsed.journal ?? [],
            triggers: parsed.triggers ?? [],
            posts: parsed.posts ?? [],
            blocker: { ...defaultBlocker, ...(parsed.blocker ?? {}) },
            game: { ...defaultGame, ...(parsed.game ?? {}) },
            settings: { ...defaultSettings, ...(parsed.settings ?? {}) }
          });
          return true;
        } catch {
          return false;
        }
      },

      resetAll: () =>
        set({
          profile: null,
          checkins: [],
          slips: [],
          journal: [],
          triggers: [],
          posts: [],
          blocker: defaultBlocker,
          game: defaultGame,
          settings: defaultSettings
        })
    }),
    {
      name: 'quitopia_profile',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        checkins: state.checkins,
        slips: state.slips,
        journal: state.journal,
        triggers: state.triggers,
        posts: state.posts,
        blocker: state.blocker,
        game: state.game,
        settings: state.settings
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      }
    }
  )
);

/* ------------------------------ derived helpers ------------------------------ */

export function currentStreakDays(state: { slips: Slip[]; profile: Profile | null }): number {
  if (!state.profile) return 0;
  const start = state.profile.startDate || new Date().toISOString();
  const anchor = state.slips.length > 0 ? state.slips[0].at : start;
  return daysBetween(anchor);
}

export function totalCleanDays(state: { checkins: CheckIn[]; slips: Slip[]; profile: Profile | null }): number {
  if (!state.profile) return 0;
  const sinceStart = daysBetween(state.profile.startDate) + 1;
  const slipDays = new Set(state.slips.map((s) => dayKey(s.at))).size;
  return Math.max(0, sinceStart - slipDays);
}

export function dailySpendTotal(state: { profile: Profile | null; settings: Settings }): number {
  if (!state.profile) return 0;
  return state.profile.addictions.reduce((sum, id) => {
    const stored = state.settings.dailySpend[id];
    const fallback = addictionById(id)?.defaultDailySpend ?? 0;
    return sum + (stored ?? fallback);
  }, 0);
}

export function dailyMinutesTotal(state: { profile: Profile | null }): number {
  if (!state.profile) return 0;
  return state.profile.addictions.reduce(
    (sum, id) => sum + (addictionById(id)?.defaultMinutesPerDay ?? 30),
    0
  );
}

export function isHardLocked(lock: HardLock): boolean {
  if (lock.mode === 'none') return false;
  if (lock.mode === 'pin') return true;
  return lock.until !== null && lock.until > Date.now();
}

export function freezeAvailable(game: GameState): boolean {
  return game.lastFreezeMonth !== dayKey().slice(0, 7) && game.freezesUsed < 12;
}
