# Phase A — increment 1

Everything here is local. No server, no account, no new permission. This is the first
slice of the Phase A scope in `Quitopia_v2_Scope_Roadmap.docx`.

## What shipped

### 1. Safe search (DNS-level, works in every browser and app)

`vpn/SafeSearch.kt` + `DnsProxy.buildCname`.

Covered hosts get a CNAME answer pointing at the engine's forced-safe variant, and the
client resolves that name normally on the next lookup:

| Query | Answer |
|---|---|
| www.google.com, google.co.in, google.co.uk | forcesafesearch.google.com |
| www.youtube.com, m.youtube.com, youtube-nocookie.com | restrict.youtube.com |
| www.bing.com | strict.bing.com |
| duckduckgo.com | safe.duckduckgo.com |
| search.yahoo.com | safesearch.search.yahoo.com |

Why a CNAME instead of rewriting the query: rewriting changes the question name length,
which breaks DNS compression pointers in the answer. A CNAME leaves the answer intact.

**Known limit:** an app with its own resolver, or a typed IP address, bypasses this.
That is stated in the integrity screen rather than hidden.

### 2. Panic switch

`domain/PanicEngine.kt`, `CommitmentStore` panic state, `QuitopiaVpnService` PANIC mode.

One tap switches the tunnel to a full route (`0.0.0.0/0`) and drops every packet for a
fixed window — 5, 15 or 60 minutes. No DNS, no TCP, no QUIC. The phone is offline to
everything except emergency calling.

Design choices worth keeping:
- **Time-boxed, never permanent.** A user who cannot get back online uninstalls, and
  then the whole install is lost over one bad night.
- **Elapsed realtime, not wall clock.** Changing the system time does not extend or skip
  it. A reboot clears it, which is acceptable for a window measured in minutes.
- **One tap, no confirmation dialog.** A dialog at that moment is a way to fail.

### 3. Categories

`blocklist/Category.kt` + `assets/blocklists/*.txt`.

Adult content is always on. Gambling, short video/social, gaming and dating are opt-in
and marked premium in the model (the paywall itself is not built yet). Onboarding asks
"what are you quitting?" and suggests picking one, because enabling four categories in
week one is the fastest way to fail.

`assets/allowlist.txt` ships Indian banking, UPI, government, education and health
domains. A false positive on a UPI app destroys trust faster than any missing block.

### 4. Custom lists

Room table `custom_rule`, editor in the app. An allowed rule always beats a block rule,
including the shipped blocklists.

### 5. Matcher repository

`blocklist/BlocklistRepository.kt` owns the one matcher the VPN thread reads. The packet
path does a single volatile read; the merge of categories + custom rules + allowlist
happens off the hot path and the finished trie is swapped in atomically. No restart
needed when the user changes a category.

### 6. Recovery plan

Six-question flow producing a locked schedule window, one daily action, and one thing to
do in the ninety seconds when it gets hard. Rules engine, not a personality test.

### 7. Content library

Six pieces in `assets/content.json`, read offline. Written once, costs nothing to serve.

### 8. SNI parser (building block, not wired in)

`vpn/Sni.kt` extracts the hostname from a TLS ClientHello. It is unit-tested and ready
for the full-route mode, but it is deliberately **not** on the shipping path: the current
tunnel is DNS-only and never sees a TCP stream. Wiring it in is the userspace-stack work
described in section 6.1 of the roadmap.

## What is NOT in this increment

- Full-route tunnel with userspace TCP forwarding (the 1.5-week item)
- QUIC suppression and IPv6 filtering
- Accessibility-based keyword filtering
- Billing / paywall for the premium categories

## Verification done

- All XML parses; `content.json` parses; every Kotlin file brace-balanced
- SNI parser checked against synthetic ClientHellos (short and long hostnames, plain
  HTTP, truncated payload)
- CNAME response bytes re-parsed by an independent parser: QR/RA flags, ANCOUNT, question
  preserved, RR name pointer to offset 12, type CNAME, TTL 60, RDLENGTH and target name
  all correct
- **Not compiled.** There is no Android SDK in the build environment, so the first
  Gradle sync may surface import or version fixes. Nothing here depends on a specific
  patch release.

## Next in Phase A

1. Full-route tunnel + forwarding library spike (timeboxed to two days)
2. QUIC drop and IPv6 handling on top of it
3. Wire `Sni.kt` into the TCP path once forwarding works
4. Paywall for the premium categories
