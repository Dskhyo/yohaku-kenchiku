/* Start before first paint. Four seconds includes the final dissolve. */
window.yohakuIntro = { startedAt: performance.now(), duration: 4000 };
document.documentElement.classList.add('intro-loading');
window.yohakuIntro.finish = function () {
  document.documentElement.classList.remove('intro-loading');
  document.documentElement.classList.add('intro-complete');
  document.querySelectorAll('[data-intro-inert]').forEach(element => {
    element.inert = false;
    element.removeAttribute('data-intro-inert');
  });
};
/* A failed main script must never leave the page locked. */
window.yohakuIntro.timer = setTimeout(window.yohakuIntro.finish, window.yohakuIntro.duration);
