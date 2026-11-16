const timerEl = document.getElementById('timer');
const leaveBtn = document.getElementById('leave');
const hostEl = document.getElementById('host');
const backEl = document.getElementById('back');

const params = new URLSearchParams(location.search);
const host = params.get('host');
if (host) hostEl.textContent = host;

backEl.addEventListener('click', (event) => {
  event.preventDefault();
  if (history.length > 1) history.back();
  else window.close();
});

let seconds = 60;

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
  // One deliberate override for this visit only; the rule stays in place.
  leaveBtn.textContent = 'Blocked again — close this tab';
  leaveBtn.disabled = true;
  setTimeout(() => {
    if (history.length > 1) history.back();
    else window.close();
  }, 800);
});
