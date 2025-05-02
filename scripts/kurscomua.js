const interval = setInterval(() => {
  document.querySelectorAll('.fc-ab-root').forEach((el) => el.remove());
  document.querySelectorAll('#catfishWrap').forEach((el) => el.remove());
}, 30);

setTimeout(() => {
  clearInterval(interval);
}, 5000);

const interval2 = setInterval(() => {
  document.body.style.overflow = 'visible';
}, 100);

setTimeout(() => {
  clearInterval(interval2);
}, 10000);
