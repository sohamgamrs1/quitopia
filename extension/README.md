# Quitopia Blocker — Chrome extension

A local-only companion to the Quitopia web app. It blocks domains and keyword-laden pages
using `declarativeNetRequest`. No network calls, no analytics, no account.

## Load it

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Pin the extension, open the popup, and paste your blocklist — one domain per line.

## What it does

| Feature | How |
|---|---|
| Domain blocking | `declarativeNetRequest` dynamic rules redirect matched top-level navigations to `block.html` |
| Safe search | Rewrites Google searches to `forcesafesearch.google.com` |
| Keyword guard | `content.js` scans page text and overlays the block screen on a match |
| Settings sync | `chrome.storage.sync`, so your list follows your Chrome profile |

## Getting your list across from the web app

The web app keeps its data in `localStorage`, which an extension cannot read. Two options:

1. **Copy the list**: open the app's Blocker page, select your custom rules, and paste them into
   the popup.
2. **Export / import**: the popup has *Export settings as JSON*, and the app exports its own JSON
   from Settings. Both files are plain text — reconcile them by hand once.

A direct handoff would need a native messaging host or a server, and both are out of scope for a
local-only build.

## Files

```
manifest.json   MV3 manifest
background.js   builds and refreshes the dynamic rules
popup.html/js   the settings UI
content.js      keyword guard overlay
block.html/js   the block screen with a 60-second delay
```
