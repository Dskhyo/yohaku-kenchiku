/* A bounded brand introduction, never a network progress indicator. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash) return;
  let played = false;
  try { played = sessionStorage.getItem('axis_intro_played') === '1'; } catch (_) {}
  if (played && new URLSearchParams(location.search).get('intro') !== '1') return;
  document.documentElement.classList.add('intro-pending');
  window.axisIntroDeadline = setTimeout(() => {
    document.documentElement.classList.remove('intro-pending');
    document.querySelector('.axis-loader')?.remove();
  }, 5500);
})();
