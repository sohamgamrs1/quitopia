# Quitopia Blocker — Chrome / Edge / Brave extension

Real website blocking, done locally. Requests are dropped by the browser's own
`declarativeNetRequest` engine **before the page loads**, so a blocked site never renders,
in any tab, in normal or incognito windows (if you allow it).

No network calls, no analytics, no account, no remote list. Everything lives in
`chrome.storage.sync`.

## Install (2 minutes)

1. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this `extension/` folder.
4. Pin the extension, open the popup, and paste your blocklist — or import the JSON from
   the Quitopia app (**Blocker → Export for the extension**).
5. In the extension's details page, enable **Allow in incognito** if you want it to apply
   there too.

To publish it later, zip this folder and upload it at
[chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
(one-time $5 developer fee).

## What it actually does

| Rule | Effect |
|---|---|
| Blocklist mode | Matched domains redirect to `block.html` — the 60-second breathing screen |
| Allowlist mode | Every top-level navigation is blocked except your allowlist |
| Focus hours | Blocking only inside a time window, re-checked every minute by an alarm |
| Safe search | Google → `forcesafesearch.google.com`, Bing → `strict.bing.com`, DDG → `safe.duckduckgo.com` |
| YouTube | `youtube.com` → `restrict.youtube.com`, path and query preserved |
| Keyword guard | A content script scans page text and overlays the block screen on a match |

## Syncing with the Quitopia app

The web app cannot write to `chrome.storage`, and this extension cannot read the app's
`localStorage`. The handoff is a file:

1. In the app: **Blocker → Export for the extension** — downloads `quitopia-blocker.json`.
2. In the popup: **Import from Quitopia (.json)**.

Both directions are supported: the popup can also **Export settings** in the same format.

## Limits, stated plainly

- It blocks in **this browser only**. Other browsers, other apps and your phone's other
  apps are untouched — for that you need DNS-level blocking, which the app's
  **Real blocking** page walks you through.
- It cannot stop a user who disables or removes the extension. Nothing installed on a
  machine the user controls can.
- Keyword scanning only sees text already rendered on the page.
- Safe-search redirects cover the search results page, not results embedded in other sites.

## Files

```
manifest.json   MV3 manifest (declarativeNetRequest, alarms, storage)
background.js   builds and refreshes the dynamic rules
popup.html/js   the settings UI and the app-JSON importer
content.js      keyword guard overlay
block.html/js   the block screen with a 60-second delay
```
