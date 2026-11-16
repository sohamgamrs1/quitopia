/**
 * Keyword guard. If the page text contains a blocked keyword, cover the page with the
 * Quitopia block screen. Deterministic and rule-based: no heuristics, no remote model,
 * no reading of anything that is not already on the page.
 */

let alreadyBlocked = false;

async function check() {
  if (alreadyBlocked) return;

  const { keywords = [], enabled = true } = await chrome.storage.sync.get({
    keywords: [],
    enabled: true
  });
  if (!enabled || keywords.length === 0) return;

  const haystack = (document.title + ' ' + (document.body?.innerText ?? '').slice(0, 20000)).toLowerCase();
  const hit = keywords.find((word) => word && haystack.includes(word.toLowerCase()));
  if (!hit) return;

  alreadyBlocked = true;

  const wrapper = document.createElement('div');
  wrapper.id = 'quitopia-block';
  wrapper.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;background:#0B3B2E;color:#FDFBF6;' +
    'display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;' +
    "font-family:'Plus Jakarta Sans',-apple-system,'Segoe UI',system-ui,sans-serif;letter-spacing:-.01em;";

  wrapper.innerHTML = `
    <div style="max-width:420px">
      <div style="width:96px;height:96px;margin:0 auto 20px;border-radius:50%;
        display:grid;place-items:center;font-size:22px;font-weight:800;
        background:rgba(168,230,207,.18);border:1.5px solid rgba(168,230,207,.45)">Q</div>
      <h1 style="font-size:22px;margin:0 0 10px;letter-spacing:-.03em;font-weight:800">
        This page is blocked
      </h1>
      <p style="opacity:.72;font-size:13.5px;line-height:1.6;margin:0 0 6px">
        It contains &ldquo;${hit}&rdquo;, which is on your keyword list.
      </p>
      <p style="opacity:.72;font-size:13.5px;line-height:1.6;margin:0 0 22px">
        The urge peaks and passes — this is the passing part.
      </p>
      <button id="quitopia-close" style="background:#A8E6CF;color:#0B3B2E;border:0;
        border-radius:999px;padding:12px 26px;font-weight:700;font-size:13.5px;cursor:pointer;
        font-family:inherit">Take me back</button>
    </div>`;

  document.documentElement.appendChild(wrapper);
  document.getElementById('quitopia-close')?.addEventListener('click', () => {
    if (history.length > 1) history.back();
    else window.close();
  });
}

check();
