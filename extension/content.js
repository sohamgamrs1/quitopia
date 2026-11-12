/**
 * Keyword guard. If the page text contains a blocked keyword, cover the page with the
 * Quitopia block screen. Deterministic and rule-based: no heuristics, no remote model.
 */

let alreadyBlocked = false;

async function check() {
  if (alreadyBlocked) return;
  const { keywords = [], enabled = true } = await chrome.storage.sync.get({
    keywords: [],
    enabled: true
  });
  if (!enabled || keywords.length === 0) return;

  const haystack = (
    document.title +
    ' ' +
    (document.body?.innerText ?? '').slice(0, 20000)
  ).toLowerCase();

  const hit = keywords.find((word) => word && haystack.includes(word.toLowerCase()));
  if (!hit) return;

  alreadyBlocked = true;
  const wrapper = document.createElement('div');
  wrapper.id = 'quitopia-block';
  wrapper.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;background:#0F3D2E;color:#FFF8E7;' +
    'display:flex;align-items:center;justify-content:center;padding:24px;' +
    'font-family:Inter,system-ui,sans-serif;text-align:center;';
  wrapper.innerHTML = `
    <div style="max-width:420px">
      <div style="font-size:44px;margin-bottom:12px">🌿</div>
      <h1 style="font-family:Sora,Inter,sans-serif;font-size:22px;margin:0 0 8px">
        This page is blocked
      </h1>
      <p style="opacity:.75;font-size:14px;line-height:1.6;margin:0 0 20px">
        It contains &ldquo;${hit}&rdquo;, which is on your keyword list.
        The urge peaks and passes — this is the passing part.
      </p>
      <button id="quitopia-close" style="background:#A8E6CF;color:#0F3D2E;border:0;border-radius:999px;padding:12px 24px;font-weight:600;font-size:14px;cursor:pointer">
        Take me back
      </button>
    </div>`;

  document.documentElement.appendChild(wrapper);
  document.getElementById('quitopia-close')?.addEventListener('click', () => history.back());
}

check();
