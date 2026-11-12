# Quitopia

A device-level adult-content and compulsive-use blocker for Android.
Local only. No account, no server, no browsing history stored.

This repository is the **v0.1 starter** described in `Quitopia_Android_Blocker_Tech_Spec.docx`.
It compiles into a working app that blocks domains through a local DNS-filtering VPN,
intercepts user-chosen apps, enforces a 24-hour cooldown, and records urges.

---

## What actually works in this build

| Area | State |
|---|---|
| DNS filtering through a local VPN | Working — narrow-route tunnel, NXDOMAIN for blocked hosts |
| Blocklist matching | Working — reversed-label trie, subdomains, allowlist wins |
| Safe search enforcement | Working — CNAME to forced-safe variants (Google, YouTube, Bing, DDG, Yahoo) |
| Panic switch | Working — full-route tunnel, every packet dropped, time-boxed |
| Categories (adult, gambling, social, gaming, dating) | Working — adult always on, rest opt-in |
| Custom block / allow rules | Working — in-app editor, allow always wins |
| Recovery plan | Working — questionnaire to schedule window and daily action |
| Content library | Working — six offline pieces |
| SNI parser | Written and tested, not wired in — needs the full-route tunnel |
| Block counting | Working — hourly aggregates, no domains stored |
| App blocking | Working — UsageStats polling + full-screen intercept |
| Commitment cooldown | Working — dual-clock, clock-change resistant |
| Urge log / streak | Working — local Room storage |
| Onboarding permission ladder | Working — VPN, usage access, battery, device admin |
| Integrity screen | Working — five live checks with fix actions |
| SNI filtering, QUIC suppression, IPv6 | **Not implemented** — needs the full-route tunnel (spec §5, roadmap §6.1) |
| Block page over HTTP | **Not implemented** — blocked hosts return NXDOMAIN for now |
| Blocklist delta updates | **Not implemented** — list is a bundled asset |
| Play Billing / paywall | **Not implemented** |

## Build

1. Open the folder in Android Studio (Ladybug or newer).
2. Let Gradle sync. The wrapper JAR is not committed — Android Studio will offer to
   generate it, or run `gradle wrapper --gradle-version 8.11.1` once.
3. Set `applicationId` in `app/build.gradle.kts` if you do not own `in.quitopia.app`.
4. Run on a **physical device**. An emulator works for the UI, but the VPN path and
   always-on behaviour only make sense on real hardware.

Toolchain: AGP 8.9.1, Kotlin 2.1.0, Gradle 8.11.1, compileSdk/targetSdk 36, minSdk 26.
If a version has moved on, bump it in `build.gradle.kts` — nothing here depends on a
specific patch release.

## First run

1. Pick a commitment tier on the onboarding screen.
2. Grant the VPN consent dialog. The tunnel starts with a persistent notification.
3. Grant usage access from Settings (Android requires the manual detour).
4. Exempt the app from battery optimisation — without this, Xiaomi, Realme and OPPO
   skins will kill the service overnight, which is exactly when you need it.
5. In system Settings → Network → VPN → Quitopia, enable **Always-on VPN** and
   **Block connections without VPN**. This is the single most effective anti-bypass
   setting on Android, and no app can turn it on for the user.

## Design decisions worth knowing before you change anything

**The tunnel is deliberately narrow.** It routes only `10.111.222.2/32`, the fake DNS
address. Everything else bypasses the VPN, so there is no user-space TCP stack and no
packet forwarding to get wrong. This is why the codebase is small enough for one person.
The trade-off: no SNI inspection and no QUIC suppression. Those require routing
`0.0.0.0/0` and forwarding TCP, which is a v1.1 project.

**Panic mode routes everything and drops it.** That is the point: `0.0.0.0/0` into the
tunnel, every packet discarded, for a fixed window measured on `elapsedRealtime`.

**IPv6 is not filtered.** The tunnel is IPv4-only. On an IPv6-heavy network a
determined user can reach a site over v6. Closing this means adding an IPv6 address and
route plus forwarding, and is tracked as the next piece of work.

**No domain is ever written to disk.** `block_event` stores a count, an hour bucket, a
category and a layer. Never the hostname. Do not add one for debugging — it turns the
database into a record of the user's worst moments and destroys the privacy claim the
whole product rests on.

**The cooldown uses the minimum of two clocks.** Wall-clock progress and
elapsed-realtime progress. Moving the system clock forward does nothing; moving it back
does nothing. `CommitmentEngineTest` covers both cheats.

## Phase A changelog

See `PHASE_A.md` for what was added in the v2 increment, what is deliberately still
missing, and what was actually verified.

## Before you publish

- Replace `assets/blocklist.txt` with your compiled list (spec §11.3). The bundled file
  is a 40-domain sample, not a product.
- Complete the **VpnService declaration** in Play Console. Parental control and device
  security are the permitted categories; make the listing copy match your answer.
- Keep `targetSdk = 36`. Play has required API 36 for new apps and updates since
  31 August 2026.
- Write the privacy policy at a stable URL before submission (spec §13.3 has a draft).
- Ship the three disclosure screens exactly as they are — they are written against the
  Play prominent-disclosure requirements, not for tone.

## Layout

```
app/src/main/java/in/quitopia/app/
├── vpn/           QuitopiaVpnService, DnsProxy  ← the blocking engine
├── blocklist/     DomainMatcher (trie), BlocklistLoader
├── blocker/       AppBlockerService, InterceptActivity
├── data/          Room entities/DAOs, CommitmentStore (DataStore)
├── domain/        CommitmentEngine, ScheduleEngine, StreakCalculator  ← pure, tested
├── admin/         DeviceAdminReceiver (uninstall friction only)
├── boot/          BootReceiver
├── ui/            Compose: onboarding, dashboard, recovery
└── util/          Permission checks and deep links
```
