const timerEl = document.getElementById('timer');
const leaveBtn = document.getElementById('leave');
const hostEl = document.getElementById('host');

let seconds = 60;

const params = new URLSearchParams(location.search);
const attempted = params.get('url');
if (attempted) hostEl.textContent = `Blocked: ${attempted}`;

const tick = setInterval(() => {
  seconds -= 1;
  timerEl.textContent = String(Math.max(0, seconds));
  if (seconds <= 0) {
    clearInterval(tick);
    timerEl.textContent = '✓';
    leaveBtn.disabled = false;
    leaveBtn.textContent = 'Continue anyway';
  }
}, 1000);

leaveBtn.addEventListener('click', () => {
  chrome.storage.sync.get({ domains: [] }, ({ domains }) => {
    // One-off override for this tab only. The rule stays in place.
    location.href = 'https://www.google.com';
  });
});
