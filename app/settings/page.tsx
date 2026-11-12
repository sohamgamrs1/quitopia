"use client";
import { MilestoneSeven } from "./milestone-seven";
import { MilestoneEight } from "./milestone-eight";
import { PhotoInsights } from "./photo-insights";
import { MilestoneNine, readChallengeSummary, clearChallengeData, CHALLENGE_EVENT, type ChallengeSummary } from "./milestone-nine";
import "./milestone-eight.css";
import "./milestone-seven.css";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, BookOpen, Camera, Check, ChevronRight, Flower2, Home, Menu, Moon,
  Sparkles, Target, Utensils, X, Plus, Pencil, Trash2, Flame,
  CalendarDays, Trophy, HeartPulse, Bell, Clock, Timer, Star, TrendingUp, BarChart3, Save, Library, Database, Wifi,
  ShieldCheck
} from "lucide-react";

type Tab = "Overview" | "Daily routine" | "Skin & grooming" | "Movement" | "Nutrition" | "Journal" | "Profile" | "Progress calendar" | "Achievements" | "Mood & energy" | "Reminders" | "Growth timeline" | "Analytics" | "Smart Daily Planner" | "Focus Studio" | "Weekly Review" | "Goals" | "Routine Library" | "Reflection" | "Data & Backup" | "Offline & PWA" | "Photo Insights" | "Challenges";
type Entry = { date: string; text: string; timestamp?: number };
type History = Record<string, string[]>;
type Habit = { id: string; name: string; desc: string; time: string; period: "Morning" | "Afternoon" | "Evening" };
type MoodRecord = { mood: string; energy: number; note?: string };
type MoodHistory = Record<string, MoodRecord>;
type ReminderSettings = { morning: boolean; afternoon: boolean; evening: boolean; morningTime: string; afternoonTime: string; eveningTime: string };

const localDayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const defaultHabits: Habit[] = [
  { id: "morning", name: "A calm morning reset", desc: "Make your bed, open a window and ease into the day.", time: "5 min", period: "Morning" },
  { id: "care", name: "Gentle face care", desc: "Cleanse gently and moisturise if needed.", time: "3 min", period: "Morning" },
  { id: "water", name: "Hydration check-in", desc: "Have water when you feel thirsty.", time: "2 min", period: "Afternoon" },
  { id: "move", name: "Move with intention", desc: "A walk, stretch or activity you enjoy.", time: "15 min", period: "Afternoon" },
  { id: "rest", name: "Wind-down ritual", desc: "Put screens aside and prepare for restful sleep.", time: "10 min", period: "Evening" }
];
const nav: { label: Tab; icon: typeof Home; group: string }[] = [
  { label: "Overview", icon: Home, group: "YOUR SPACE" },
  { label: "Daily routine", icon: Target, group: "YOUR SPACE" },
  { label: "Smart Daily Planner", icon: CalendarDays, group: "YOUR SPACE" },
  { label: "Focus Studio", icon: Timer, group: "YOUR SPACE" },
  { label: "Weekly Review", icon: CalendarDays, group: "YOUR SPACE" },
  { label: "Goals", icon: Target, group: "YOUR SPACE" },
  { label: "Challenges", icon: ShieldCheck, group: "YOUR SPACE" },
  { label: "Routine Library", icon: Library, group: "YOUR SPACE" },
  { label: "Reflection", icon: BookOpen, group: "REFLECTION" },
  { label: "Data & Backup", icon: Database, group: "SETTINGS" },
  { label: "Offline & PWA", icon: Wifi, group: "SETTINGS" },
  { label: "Progress calendar", icon: CalendarDays, group: "YOUR SPACE" },
  { label: "Achievements", icon: Trophy, group: "YOUR SPACE" },
  { label: "Analytics", icon: BarChart3, group: "YOUR SPACE" },
  { label: "Skin & grooming", icon: Flower2, group: "CARE & WELLNESS" },
  { label: "Photo Insights", icon: Camera, group: "CARE & WELLNESS" },
  { label: "Movement", icon: Activity, group: "CARE & WELLNESS" },
  { label: "Nutrition", icon: Utensils, group: "CARE & WELLNESS" },
  { label: "Mood & energy", icon: HeartPulse, group: "CARE & WELLNESS" },
  { label: "Journal", icon: BookOpen, group: "REFLECTION" },
  { label: "Growth timeline", icon: TrendingUp, group: "REFLECTION" },
  { label: "Reminders", icon: Bell, group: "SETTINGS" },
  { label: "Profile", icon: Sparkles, group: "SETTINGS" }
];

export default function Page() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [habitName, setHabitName] = useState("");
  const [habitDesc, setHabitDesc] = useState("");
  const [habitTime, setHabitTime] = useState("5 min");
  const [habitPeriod, setHabitPeriod] = useState<Habit["period"]>("Morning");
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [history, setHistory] = useState<History>({});
  const [water, setWater] = useState(0);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("there");
  const [goal, setGoal] = useState("Build a consistent, balanced routine");
  const [dailyGoal, setDailyGoal] = useState(3);
  const [toast, setToast] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodHistory>({});
  const [selectedMood, setSelectedMood] = useState("Calm");
  const [energy, setEnergy] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [reminders, setReminders] = useState<ReminderSettings>({
    morning: false, afternoon: false, evening: false,
    morningTime: "08:00", afternoonTime: "14:00", eveningTime: "20:30"
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [loaded, setLoaded] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeSummary | null>(null);

  // Keep the Overview challenge card in sync with the Challenges tab.
  useEffect(() => {
    const sync = () => setChallenge(readChallengeSummary());
    sync();
    window.addEventListener(CHALLENGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHALLENGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (tab === "Overview") setChallenge(readChallengeSummary());
  }, [tab]);

  const todayKey = localDayKey(new Date());
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aurevon-state-v1");
      if (raw) {
        const v = JSON.parse(raw);
        const savedHistory: History = v.history || {};
        setHistory(savedHistory);
        setDone(savedHistory[todayKey] || v.done || []);
        setHabits(Array.isArray(v.habits) && v.habits.length ? v.habits : defaultHabits);
        setWater(v.water || 0);
        setEntries(v.entries || []);
        setName(v.name || "there");
        setGoal(v.goal || "Build a consistent, balanced routine");
        setDailyGoal(Math.min(20, Math.max(1, Number(v.dailyGoal) || 3)));
        setMoodHistory(v.moodHistory || {});
        setReminders({ morning: false, afternoon: false, evening: false, morningTime: "08:00", afternoonTime: "14:00", eveningTime: "20:30", ...(v.reminders || {}) });
      }
    } catch { /* Keep defaults if stored data is malformed. */ }
    setLoaded(true);
  }, [todayKey]);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("aurevon-state-v1", JSON.stringify({
          done, history, water, entries, name, goal, dailyGoal, habits, moodHistory, reminders
        }));
      } catch { setToast("Device storage is unavailable. Your latest changes may not persist."); }
    }
  }, [done, history, water, entries, name, goal, dailyGoal, habits, moodHistory, reminders, loaded]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  
// Register the notification service worker.
useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .catch(error => console.error("Service worker error:", error));
  }
}, []);

// Scheduled system notifications.
useEffect(() => {
  if (!loaded) return;

  const checkReminders = () => {
    const now = new Date();

    const clock =
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const day = localDayKey(now);

    const slots = [
      {
        enabled: reminders.morning,
        time: reminders.morningTime,
        label: "Morning routine"
      },
      {
        enabled: reminders.afternoon,
        time: reminders.afternoonTime,
        label: "Afternoon routine"
      },
      {
        enabled: reminders.evening,
        time: reminders.eveningTime,
        label: "Evening routine"
      }
    ];

    slots.forEach(slot => {
      const key = `aurevon-reminder-${day}-${slot.label}`;

      if (
        slot.enabled &&
        slot.time === clock &&
        !localStorage.getItem(key)
      ) {
        localStorage.setItem(key, "shown");

        void sendSystemNotification(
          "AUREVON Reminder",
          `${slot.label}: take a gentle moment for yourself.`
        );
      }
    });
  };

  checkReminders();

  const timer = window.setInterval(checkReminders, 15000);

  return () => window.clearInterval(timer);
}, [loaded, reminders]);

  const pct = Math.round(done.length / Math.max(1, habits.length) * 100);
  const goalPct = Math.min(100, Math.round(done.length / Math.max(1, dailyGoal) * 100));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
    const key = localDayKey(d);
    const count = (key === todayKey ? done : (history[key] || [])).length;
    return { key, label: d.toLocaleDateString("en-IN", { weekday: "short" }), date: d.getDate(), count, pct: Math.round(count / Math.max(1, habits.length) * 100) };
  });
  const weekAverage = Math.round(weekDays.reduce((sum, d) => sum + d.pct, 0) / 7);
  const currentStreak = (() => {
    let n = 0;
    const startAt = done.length ? 0 : 1;
    for (let i = startAt; i < 366; i++) {
      const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - i);
      const key = localDayKey(d); const count = (key === todayKey ? done : (history[key] || [])).length;
      if (count > 0) n++; else break;
    }
    return n;
  })();
  const completedDays = Object.entries(history).filter(([, ids]) => ids.length > 0).length + (history[todayKey] ? 0 : (done.length ? 1 : 0));
  const bestDay = [...weekDays].sort((a, b) => b.pct - a.pct)[0];
  const monthDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (29 - i));
    const key = localDayKey(d); const count = (key === todayKey ? done : (history[key] || [])).length;
    return { key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), count, pct: Math.round(count / Math.max(1, habits.length) * 100) };
  });
  const monthAverage = Math.round(monthDays.reduce((sum, d) => sum + d.pct, 0) / monthDays.length);
  const totalHabitChecks = Object.values(history).reduce((sum, ids) => sum + ids.length, 0) + (history[todayKey] ? 0 : done.length);
  const achievements = [
    { id: "first", title: "First step", detail: "Complete your first daily intention", unlocked: completedDays >= 1, icon: Star },
    { id: "three", title: "Showing up", detail: "Build a 3-day consistency streak", unlocked: currentStreak >= 3, icon: Flame },
    { id: "seven", title: "One week strong", detail: "Reach a 7-day streak", unlocked: currentStreak >= 7, icon: Trophy },
    { id: "fourteen", title: "Finding your rhythm", detail: "Reach a 14-day streak", unlocked: currentStreak >= 14, icon: Sparkles },
    { id: "thirty", title: "A month of care", detail: "Reach a 30-day streak", unlocked: currentStreak >= 30, icon: CalendarDays },
    { id: "journal", title: "Reflective mind", detail: "Save 5 journal entries", unlocked: entries.length >= 5, icon: BookOpen },
    { id: "season", title: "Season started", detail: "Begin your first discipline challenge", unlocked: Boolean(challenge), icon: ShieldCheck },
    { id: "seasonSeven", title: "Seven days of iron", detail: "Keep a challenge streak of 7 days", unlocked: (challenge?.best ?? 0) >= 7, icon: Trophy }
  ];
  const greeting = useMemo(() => {
    const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  }, []);

  function toggleHabit(id: string) {
    const next = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
    setDone(next);
    setHistory(old => ({ ...old, [todayKey]: next }));
    setToast(next.includes(id) ? "Intention completed — nicely done." : "Progress updated.");
  }
  function resetHabitForm() {
    setHabitName(""); setHabitDesc(""); setHabitTime("5 min"); setHabitPeriod("Morning");
    setEditingHabit(null); setBuilderOpen(false);
  }
  function saveHabit() {
    const clean = habitName.trim(); if (!clean) return;
    if (editingHabit) setHabits(v => v.map(h => h.id === editingHabit ? { ...h, name: clean, desc: habitDesc.trim(), time: habitTime, period: habitPeriod } : h));
    else setHabits(v => [...v, { id: `custom-${Date.now()}`, name: clean, desc: habitDesc.trim() || "A small action, at your own pace.", time: habitTime, period: habitPeriod }]);
    resetHabitForm();
  }
  function editHabit(h: Habit) {
    setEditingHabit(h.id); setHabitName(h.name); setHabitDesc(h.desc); setHabitTime(h.time); setHabitPeriod(h.period); setBuilderOpen(true);
  }
  function deleteHabit(id: string) {
    if (!confirm("Remove this habit from your routine?")) return;
    setHabits(v => v.filter(h => h.id !== id)); setDone(v => v.filter(x => x !== id));
    setHistory(v => Object.fromEntries(Object.entries(v).map(([day, ids]) => [day, ids.filter(x => x !== id)])));
  }
  function saveEntry() {
    const text = note.trim(); if (!text) return;
    setEntries(v => [{ date: new Date().toLocaleString(), text, timestamp: Date.now() }, ...v]); setNote("");
  }
  function saveMood() {
    setMoodHistory(v => ({ ...v, [todayKey]: { mood: selectedMood, energy, note: moodNote.trim() } }));
    setMoodNote("");
  }
  
async function sendSystemNotification(title: string, body: string) {
  if (!("Notification" in window)) {
    setToast("Your browser does not support notifications.");
    return false;
  }

  let permission = Notification.permission;

  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    setToast("Please allow notifications for AUREVON.");
    return false;
  }

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(title, {
        body,
        tag: `aurevon-${Date.now()}`,
      });
    } else {
      new Notification(title, { body });
    }

    return true;
  } catch {
    try {
      new Notification(title, { body });
      return true;
    } catch {
      setToast("Could not display system notification.");
      return false;
    }
  }
}

async function updateReminder(
  key: keyof ReminderSettings,
  value: boolean | string
) {
  if (typeof value === "boolean" && value) {
    if (!("Notification" in window)) {
      setToast("Notifications are not supported by this browser.");
      return;
    }

    let permission = Notification.permission;

    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      setToast("Allow notifications to enable reminders.");
      return;
    }
  }

  setReminders(v => ({ ...v, [key]: value }));
}

function notifyReminder() {
  void sendSystemNotification(
    "AUREVON",
    "Your test notification is working. Stay consistent, at your own pace."
  );
}
  const section = (title: string, desc: string) => <><div className="eyebrow">AUREVON / PERSONAL GROWTH</div><h1 className="heading">{title}</h1><p className="sub">{desc}</p></>;

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const calendarCells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const monthLabel = calendarMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  if (!loaded) return <div className="loading-screen"><div className="loading-mark">A</div><div className="eyebrow">AUREVON</div><p className="small">Preparing your personal space…</p></div>;

  return <div className="app">
    {toast && <div className="toast" role="status"><span className="toast-dot" />{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={14} /></button></div>}
    {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
    <aside className={"sidebar " + (sidebarOpen ? "sidebar-open" : "")} aria-hidden={!sidebarOpen}>
      <div className="sidebar-head"><div className="brand">AUREVON<small>YOUR PERSONAL GROWTH SPACE</small></div><button className="sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
      {["YOUR SPACE", "CARE & WELLNESS", "REFLECTION", "SETTINGS"].map(group => <div key={group}><div className="navgroup">{group}</div>{nav.filter(n => n.group === group).map(n => { const Icon = n.icon; return <button key={n.label} className={"navbtn " + (tab === n.label ? "active" : "")} onClick={() => { setTab(n.label); setSidebarOpen(false); }}><Icon size={17} /><span>{n.label}</span></button>; })}</div>)}
      <div className="sidebar-note">A softer approach to becoming your best self.</div><div className="sidebar-foot"><span className="status-dot" /> YOUR PRIVATE SPACE</div>
    </aside>

    <main className="main">
      <div className="top"><div className="top-left"><button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(v => !v)}><Menu size={19} /></button><div className="small top-date">{today}</div></div><div className="pill edition-pill"><Sparkles size={11} /> ELITE EDITION</div></div>
      <div className="fade" key={tab}>
        {(tab === "Weekly Review" || tab === "Goals" || tab === "Routine Library" || tab === "Reflection" || tab === "Data & Backup" || tab === "Offline & PWA") && (
          <MilestoneEight tab={tab} />
        )}
        
        {(tab === "Smart Daily Planner" || tab === "Focus Studio") && (
  <MilestoneSeven tab={tab} />
)}
        {tab === "Overview" && <>
          {section(greeting + ", " + name, "Small, consistent actions. A healthier rhythm. Your pace.")}
          <div className="grid" style={{ marginTop: 25 }}>
            <div className="panel span8"><div className="row"><div><div className="eyebrow">TODAY'S MOMENTUM</div><div className="metric">{pct}% <span className="muted" style={{ fontSize: 14 }}>completed</span></div><p className="sub">You have completed {done.length} of {habits.length} gentle daily intentions. Daily target: {dailyGoal}.</p></div><div className="pill">{done.length}/{habits.length}</div></div><div className="progress"><i style={{ width: pct + "%" }} /></div><div className="small">Daily goal progress · {goalPct}%</div><div className="row dashboard-actions"><button className="ghost" onClick={() => setTab("Daily routine")}>View daily routine <ChevronRight size={14} style={{ verticalAlign: "middle" }} /></button><button className="text-action" onClick={() => setTab("Analytics")}>View analytics</button></div></div>
            <div className="panel span4"><div className="eyebrow">HYDRATION CHECK-IN</div><div className="metric">{water} <span className="muted" style={{ fontSize: 14 }}>glasses</span></div><p className="sub">A simple reminder to stay comfortably hydrated.</p><div className="row"><button className="ghost" onClick={() => setWater(v => Math.max(0, v - 1))}>−</button><button className="action" onClick={() => setWater(v => Math.min(20, v + 1))}>+ Add glass</button></div></div>
            <div className="panel span12 challenge-overview"><div className="row challenge-row"><div style={{ minWidth: 0 }}><div className="eyebrow">ACTIVE CHALLENGE</div>{challenge ? <><h3 className="cardtitle" style={{ marginTop: 9, fontSize: 20 }}>{challenge.name}</h3><p className="sub" style={{ marginTop: 4 }}>Day {challenge.dayIndex} of {challenge.total} · {challenge.daysLeft > 0 ? challenge.daysLeft + " days left" : "final day"}</p><div className="progress" style={{ maxWidth: 560 }}><i style={{ width: challenge.pct + "%" }} /></div><div className="challenge-mini"><span><Flame size={11} className="gold" /> {challenge.streak} day streak</span><span>{challenge.keptToday}/{challenge.rulesToday} rules today</span><span>{challenge.pct}% of the season</span></div></> : <><h3 className="cardtitle" style={{ marginTop: 9, fontSize: 20 }}>No season running</h3><p className="sub">A 90-day arc gives your days a spine. Pick one challenge and keep its rules daily.</p></>}</div><button className={challenge ? "ghost" : "action"} style={{ flex: "0 0 auto" }} onClick={() => setTab("Challenges")}>{challenge ? "Open challenges" : "Choose a challenge"} <ChevronRight size={14} style={{ verticalAlign: "middle" }} /></button></div></div>
            <div className="panel span6"><div className="row"><h3 className="cardtitle">Your daily intentions</h3><button className="ghost" onClick={() => setTab("Daily routine")}>See all</button></div>{habits.slice(0, 3).map(h => <div className="habit" key={h.id}><button className={"check " + (done.includes(h.id) ? "done" : "")} onClick={() => toggleHabit(h.id)}>{done.includes(h.id) && <Check size={13} />}</button><div style={{ flex: 1 }}><div className="habitname">{h.name}</div><div className="habitdesc">{h.desc}</div></div></div>)}</div>
            <div className="panel span6 week-panel"><div className="row"><div><div className="eyebrow">YOUR LAST 7 DAYS</div><h3 className="cardtitle" style={{ marginTop: 9 }}>Consistency, not perfection</h3></div><div className="week-average">{weekAverage}%<small>weekly avg.</small></div></div><div className="week-chart">{weekDays.map(day => <div className="week-column" key={day.key}><div className="week-track"><i style={{ height: Math.max(day.pct ? 8 : 3, day.pct) + "%" }} /></div><span className="week-label">{day.label}</span><span className="week-date">{day.date}</span></div>)}</div><p className="small week-caption">Daily progress is saved on this device. Every day is a fresh start.</p></div>
            <div className="panel span6"><div className="eyebrow">YOUR CONSISTENCY</div><div className="metric"><Flame size={23} className="gold" style={{ verticalAlign: "middle" }} /> {currentStreak} <span className="muted" style={{ fontSize: 14 }}>day streak</span></div><p className="sub">A gentle measure of showing up. Start again whenever you need.</p></div>
            <div className="panel span6"><div className="eyebrow">YOUR CURRENT INTENTION</div><h3 style={{ fontFamily: "Georgia,serif", fontWeight: 400, fontSize: 23, lineHeight: 1.4 }}>{goal}</h3><p className="sub">Progress is personal. Focus on what feels sustainable, not perfection.</p><button className="ghost" onClick={() => setTab("Profile")}>Edit intention</button></div>
            <div className="panel span6"><div className="eyebrow">TODAY'S MOOD</div><div className="metric">{moodHistory[todayKey]?.mood || "Not checked in"}</div><p className="sub">A quick mood check-in can help you notice patterns over time.</p><button className="ghost" onClick={() => setTab("Mood & energy")}>Check in <ChevronRight size={14} /></button></div>
            <div className="panel span6"><div className="eyebrow">RECENT MILESTONE</div><div className="metric">{achievements.filter(a => a.unlocked).length} <span className="muted" style={{ fontSize: 14 }}>unlocked</span></div><p className="sub">Celebrate the small steps that add up.</p><button className="ghost" onClick={() => setTab("Achievements")}>View achievements</button></div>
          </div>
        </>}

        {tab === "Daily routine" && <>
          {section("Daily routine", "Build a routine around your day. Keep it flexible and kind.")}
          <div className="row routine-toolbar" style={{ marginTop: 22 }}><div className="small">{habits.length} intentions · {done.length} completed today</div><button className="action" onClick={() => { resetHabitForm(); setBuilderOpen(true); }}><Plus size={14} style={{ verticalAlign: "middle" }} /> Add habit</button></div>
          {builderOpen && <div className="panel habit-builder" style={{ marginTop: 14 }}><div className="row"><h3 className="cardtitle">{editingHabit ? "Edit intention" : "Create an intention"}</h3><button className="sidebar-close" onClick={resetHabitForm} aria-label="Close form"><X size={17} /></button></div><label className="small">HABIT NAME</label><input className="field" value={habitName} maxLength={55} onChange={e => setHabitName(e.target.value)} placeholder="e.g. Read for 10 minutes" style={{ margin: "7px 0 13px" }} /><label className="small">SHORT DESCRIPTION</label><input className="field" value={habitDesc} maxLength={100} onChange={e => setHabitDesc(e.target.value)} placeholder="What does this look like?" style={{ margin: "7px 0 13px" }} /><div className="builder-fields"><div><label className="small">TIME</label><input className="field" value={habitTime} maxLength={15} onChange={e => setHabitTime(e.target.value)} style={{ marginTop: 7 }} /></div><div><label className="small">PART OF DAY</label><select className="field" value={habitPeriod} onChange={e => setHabitPeriod(e.target.value as Habit["period"])} style={{ marginTop: 7 }}><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div></div><div className="row" style={{ marginTop: 15, justifyContent: "flex-end" }}><button className="ghost" onClick={resetHabitForm}>Cancel</button><button className="action" disabled={!habitName.trim()} onClick={saveHabit}>{editingHabit ? "Save changes" : "Create habit"}</button></div></div>}
          <div className="panel" style={{ marginTop: 14 }}>{(["Morning", "Afternoon", "Evening"] as const).map(period => { const items = habits.filter(h => h.period === period); if (!items.length) return null; return <section className="routine-period" key={period}><div className="eyebrow">{period.toUpperCase()}</div>{items.map(h => <div className="habit" key={h.id}><button className={"check " + (done.includes(h.id) ? "done" : "")} onClick={() => toggleHabit(h.id)}>{done.includes(h.id) && <Check size={13} />}</button><div style={{ flex: 1, minWidth: 0 }}><div className="row"><div className="habitname">{h.name}</div><span className="pill">{h.time}</span></div><div className="habitdesc">{h.desc}</div><div className="habit-tools"><button className="text-action" onClick={() => editHabit(h)}><Pencil size={12} /> Edit</button><button className="text-action danger-action" onClick={() => deleteHabit(h.id)}><Trash2 size={12} /> Remove</button></div></div></div>)}</section>; })}{habits.length === 0 && <p className="sub">Your routine is empty. Add your first intention to begin.</p>}<div className="progress"><i style={{ width: pct + "%" }} /></div><div className="small">{done.length} of {habits.length} completed · Your pace, your routine.</div></div>
        </>}

        {tab === "Analytics" && <>
          {section("Progress analytics", "A clear picture of your consistency, without pressure to be perfect.")}
          <div className="grid analytics-grid" style={{ marginTop: 22 }}>
            <div className="panel span4"><div className="eyebrow">7-DAY AVERAGE</div><div className="metric">{weekAverage}%</div><p className="sub">Average daily habit completion this week.</p></div>
            <div className="panel span4"><div className="eyebrow">30-DAY AVERAGE</div><div className="metric">{monthAverage}%</div><p className="sub">Average daily habit completion over 30 days.</p></div>
            <div className="panel span4"><div className="eyebrow">TOTAL CHECK-INS</div><div className="metric">{totalHabitChecks}</div><p className="sub">Intentions completed across saved days.</p></div>
            <div className="panel span12"><div className="row"><div><div className="eyebrow">WEEKLY OVERVIEW</div><h3 className="cardtitle" style={{ marginTop: 8 }}>Your last seven days</h3></div><span className="pill">{weekAverage}% average</span></div><div className="analytics-bars">{weekDays.map(day => <div className="analytics-bar-item" key={day.key}><div className="analytics-bar-value">{day.pct}%</div><div className="analytics-bar-track"><i style={{ height: `${Math.max(day.pct, 2)}%` }} /></div><span>{day.label}</span><small>{day.date}</small></div>)}</div></div>
            <div className="panel span12"><div className="row"><div><div className="eyebrow">MONTHLY OVERVIEW</div><h3 className="cardtitle" style={{ marginTop: 8 }}>Last 30 days</h3></div><span className="pill">{monthDays.filter(d => d.count > 0).length} active days</span></div><div className="month-strip">{monthDays.map(day => <div className="month-strip-day" key={day.key} title={`${day.label}: ${day.count} completed`}><i style={{ opacity: day.count ? .3 + day.pct / 100 * .7 : .12 }} /></div>)}</div><div className="row month-labels"><span className="small">30 days ago</span><span className="small">Today</span></div></div>
            <div className="panel span6"><div className="eyebrow">CONSISTENCY STREAK</div><div className="metric"><Flame size={22} className="gold" style={{ verticalAlign: "middle" }} /> {currentStreak} days</div><p className="sub">Consecutive days with at least one completed intention.</p></div>
            <div className="panel span6"><div className="eyebrow">BEST DAY THIS WEEK</div><div className="metric">{bestDay?.pct || 0}%</div><p className="sub">{bestDay?.label || "—"} · {bestDay?.count || 0} intentions completed.</p></div>
          </div>
        </>}

        {tab === "Progress calendar" && <>
          {section("Progress calendar", "A gentle overview of the days you showed up.")}
          <div className="panel calendar-panel" style={{ marginTop: 22 }}>
            <div className="row calendar-heading"><button className="ghost" aria-label="Previous month" onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}>‹</button><h2 className="calendar-month">{monthLabel}</h2><button className="ghost" aria-label="Next month" onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}>›</button></div>
            <div className="calendar-grid">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div className="calendar-weekday" key={d}>{d}</div>)}{calendarCells.map((day, i) => { if (!day) return <div key={"blank-" + i} />; const date = new Date(year, month, day); const key = localDayKey(date); const count = key === todayKey ? done.length : (history[key] || []).length; const ratio = count / Math.max(1, habits.length); return <div key={key} className={"calendar-day " + (count ? "has-progress" : "") + (key === todayKey ? " is-today" : "")} title={`${count} habits completed`}><span>{day}</span>{count > 0 && <i style={{ opacity: .35 + Math.min(ratio, 1) * .65 }} />}</div>; })}</div>
            <div className="calendar-legend"><span><i className="legend-dot low" /> No check-in</span><span><i className="legend-dot high" /> Completed intentions</span></div>
          </div>
          <div className="panel" style={{ marginTop: 15 }}><div className="eyebrow">THIS MONTH</div><div className="metric">{Object.entries(history).filter(([key, ids]) => key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`) && ids.length).length + (todayKey.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`) && done.length && !history[todayKey] ? 1 : 0)} <span className="muted" style={{ fontSize: 14 }}>active days saved</span></div><p className="sub">Calendar entries are based on habit check-ins stored on this device.</p></div>
        </>}

        {tab === "Achievements" && <>
          {section("Achievements", "Small milestones worth celebrating. No pressure, just progress.")}
          <div className="grid" style={{ marginTop: 22 }}>{achievements.map(a => { const Icon = a.icon; return <div className={"panel span6 achievement-card " + (a.unlocked ? "unlocked" : "locked")} key={a.id}><div className="achievement-icon"><Icon size={22} /></div><div className="eyebrow">{a.unlocked ? "UNLOCKED" : "IN PROGRESS"}</div><h3 className="cardtitle" style={{ marginTop: 10 }}>{a.title}</h3><p className="sub">{a.detail}</p><span className="pill">{a.unlocked ? "Milestone reached" : "Keep your own pace"}</span></div>; })}</div>
        </>}

        {tab === "Mood & energy" && <>
          {section("Mood & energy", "Notice how you feel, without judging or scoring yourself.")}
          <div className="panel" style={{ marginTop: 22 }}>
            <div className="eyebrow">HOW ARE YOU FEELING TODAY?</div>
            <div className="mood-options">{["Calm", "Happy", "Focused", "Tired", "Stressed", "Low"].map(m => <button key={m} className={"mood-option " + (selectedMood === m ? "selected" : "")} onClick={() => setSelectedMood(m)}>{m}</button>)}</div>
            <div className="row energy-heading"><label className="small">ENERGY LEVEL</label><strong className="energy-value">{energy}/5</strong></div>
            <input aria-label="Energy level" className="energy-slider" type="range" min="1" max="5" value={energy} onChange={e => setEnergy(Number(e.target.value))} />
            <label className="small">OPTIONAL NOTE</label><textarea className="field" rows={3} value={moodNote} onChange={e => setMoodNote(e.target.value)} placeholder="Anything you'd like to remember about today?" style={{ marginTop: 8 }} />
            <div className="row" style={{ marginTop: 14 }}><span className="small">Saved privately on this device.</span><button className="action" onClick={saveMood}>Save check-in</button></div>
          </div>
          <div className="panel" style={{ marginTop: 15 }}><div className="eyebrow">RECENT CHECK-INS</div>{Object.entries(moodHistory).sort(([a], [b]) => b.localeCompare(a)).slice(0, 7).map(([key, record]) => <div className="mood-history-row" key={key}><div><strong>{record.mood}</strong><div className="small">{key}</div></div><span className="pill">Energy {record.energy}/5</span></div>)}{Object.keys(moodHistory).length === 0 && <p className="sub">Your check-ins will appear here.</p>}</div>
        </>}

        {tab === "Reminders" && <>
          {section("Reminders", "Choose gentle reminders for moments that suit your day.")}
          <div className="panel" style={{ marginTop: 22 }}>
            {(["morning", "afternoon", "evening"] as const).map((period) => { const title = period[0].toUpperCase() + period.slice(1); const enabledKey = period as keyof ReminderSettings; const timeKey = (period + "Time") as keyof ReminderSettings; return <div className="reminder-row" key={period}><div className="reminder-info"><Bell size={17} className="gold" /><div><strong>{title} routine</strong><div className="small">A gentle nudge to check in</div></div></div><div className="reminder-controls"><input type="time" className="field time-field" value={String(reminders[timeKey])} onChange={e => updateReminder(timeKey, e.target.value)} /><label className="switch-label"><input type="checkbox" checked={Boolean(reminders[enabledKey])} onChange={e => updateReminder(enabledKey, e.target.checked)} /><span>{reminders[enabledKey] ? "On" : "Off"}</span></label></div></div>; })}
            <p className="small reminder-note">Reminders are checked while AUREVON is open. Keep this page active for in-app alerts. Browser background notifications are not scheduled in this version.</p>
            <button className="action" onClick={() => setToast("Your routine: take a gentle moment for yourself.")}>Test in-app reminder</button>
          </div>
        </>}
{tab === "Challenges" && <MilestoneNine tab="Challenges" />}
        {tab === "Photo Insights" && <PhotoInsights />}
        {tab === "Growth timeline" && <>
          {section("Growth timeline", "A quiet record of the moments and milestones along the way.")}
          <div className="panel timeline-panel" style={{ marginTop: 22 }}>
            {[...entries.map((e, i) => ({ id: "entry-" + i, date: e.timestamp || Date.parse(e.date) || 0, title: "Journal reflection", detail: e.text, kind: "journal" })), ...achievements.filter(a => a.unlocked).map(a => ({ id: a.id, date: 0, title: a.title, detail: a.detail, kind: "achievement" }))].sort((a, b) => b.date - a.date).map(item => <div className="timeline-item" key={item.id}><span className={"timeline-marker " + item.kind} /> <div><div className="eyebrow">{item.kind === "journal" ? "REFLECTION" : "ACHIEVEMENT"}</div><strong>{item.title}</strong><p className="sub">{item.detail}</p>{item.date > 0 && <span className="small">{new Date(item.date).toLocaleString()}</span>}</div></div>)}
            {entries.length === 0 && achievements.every(a => !a.unlocked) && <p className="sub">Your timeline will grow as you record reflections and reach milestones.</p>}
          </div>
        </>}

        {tab === "Skin & grooming" && <>{section("Skin & grooming", "Simple, gentle care. Keep it comfortable and age-appropriate.")}<div className="grid" style={{ marginTop: 24 }}>{[{ t: "Keep it simple", d: "A gentle cleanser, a moisturiser that suits your skin, and sunscreen during daytime are enough for many people." }, { t: "Hair care", d: "Choose a wash routine that suits your scalp. Avoid harsh treatments and excessive heat." }, { t: "Personal grooming", d: "Clean nails, fresh clothes and basic hygiene can help you feel comfortable and confident." }, { t: "Be patient", d: "Skin changes are normal, especially during teenage years. Avoid picking, harsh scrubs and unverified treatments." }].map(x => <div className="panel span6" key={x.t}><Flower2 className="gold" size={20} /><h3 className="cardtitle" style={{ marginTop: 14 }}>{x.t}</h3><p className="sub">{x.d}</p></div>)}</div></>}
        {tab === "Movement" && <>{section("Movement", "Build strength, mobility and energy through activities you enjoy.")}<div className="grid" style={{ marginTop: 24 }}>{[{ t: "Walk", d: "Try a relaxed walk outdoors or around your home." }, { t: "Mobility", d: "Gentle shoulder rolls, stretches and easy movement breaks." }, { t: "Strength basics", d: "Age-appropriate bodyweight movements with good form and rest." }, { t: "Recovery", d: "Rest days, sleep and listening to your body are part of progress." }].map(x => <div className="panel span6" key={x.t}><Activity className="gold" size={20} /><h3 className="cardtitle" style={{ marginTop: 14 }}>{x.t}</h3><p className="sub">{x.d}</p></div>)}</div></>}
        {tab === "Nutrition" && <>{section("Nourish well", "Support your energy with regular, balanced meals. No calorie counting.")}<div className="grid" style={{ marginTop: 24 }}>{[{ t: "Balanced meals", d: "Include a mix of grains, protein foods, fruits or vegetables and nourishing fats." }, { t: "Regular eating", d: "Try not to skip meals. Growing bodies need enough food and variety." }, { t: "Hydration", d: "Drink water regularly and respond to thirst, especially in warm weather." }, { t: "Food freedom", d: "No restrictive diets or guilt. If you have nutrition concerns, talk with a trusted adult or qualified professional." }].map(x => <div className="panel span6" key={x.t}><Utensils className="gold" size={20} /><h3 className="cardtitle" style={{ marginTop: 14 }}>{x.t}</h3><p className="sub">{x.d}</p></div>)}</div></>}
        {tab === "Journal" && <>{section("Reflection journal", "Capture a thought, a win or something you want to remember.")}<div className="panel" style={{ marginTop: 24 }}><textarea className="field" rows={5} placeholder="What felt good today? What would you like to carry into tomorrow?" value={note} onChange={e => setNote(e.target.value)} /><div className="row" style={{ marginTop: 12 }}><span className="small">Entries stay on this device.</span><button className="action" onClick={saveEntry}>Save reflection</button></div></div><div className="panel" style={{ marginTop: 16 }}><h3 className="cardtitle">Your reflections</h3>{entries.length === 0 ? <p className="sub">Your journal is waiting for your first entry.</p> : entries.map((e, i) => <div className="entry" key={i}><div className="small">{e.date}</div><p style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{e.text}</p></div>)}</div></>}
        {tab === "Profile" && <>{section("Your space", "Make this experience feel like yours.")}<div className="panel" style={{ marginTop: 24, maxWidth: 650 }}><label className="small">YOUR NAME</label><input className="field" style={{ margin: "8px 0 20px" }} value={name === "there" ? "" : name} placeholder="How should we greet you?" onChange={e => setName(e.target.value || "there")} /><label className="small">YOUR PERSONAL INTENTION</label><textarea className="field" rows={3} style={{ margin: "8px 0 20px" }} value={goal} onChange={e => setGoal(e.target.value)} /><label className="small">DAILY HABIT TARGET</label><div className="goal-stepper"><button className="ghost" onClick={() => setDailyGoal(v => Math.max(1, v - 1))}>−</button><strong>{dailyGoal} intentions per day</strong><button className="ghost" onClick={() => setDailyGoal(v => Math.min(Math.max(1, habits.length), v + 1))}>+</button></div><div className="small">Your routine, journal and profile are stored locally in this browser on this device. No account or cloud sync is configured.</div><button className="ghost" style={{ marginTop: 18 }} onClick={() => { if (confirm("Clear your local AUREVON data on this device?")) { clearChallengeData(); setChallenge(null); setDone([]); setHistory({}); setHabits(defaultHabits); setWater(0); setEntries([]); setName("there"); setGoal("Build a consistent, balanced routine"); setDailyGoal(3); setMoodHistory({}); setReminders({ morning: false, afternoon: false, evening: false, morningTime: "08:00", afternoonTime: "14:00", eveningTime: "20:30" }); } }}>Reset local data</button></div></>}
      </div>
      <footer className="small" style={{ marginTop: 36, textAlign: "center" }}>AUREVON · GROW AT YOUR OWN PACE</footer>
    </main>
  </div>;
}
