(function () {
  var nav = document.querySelector('.nav'), banner = document.querySelector('.banner');
  function onScroll() {
    var limit = banner ? banner.offsetHeight - nav.offsetHeight - 40 : 0;
    nav.classList.toggle('solid', window.scrollY > limit);
  }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  var btn = document.querySelector('.menu-btn'), links = document.getElementById('links');
  if (btn) btn.addEventListener('click', function () {
    var open = links.classList.toggle('open'); btn.setAttribute('aria-expanded', String(open));
  });
  if (links) links.addEventListener('click', function (e) { if (e.target.tagName === 'A') { links.classList.remove('open'); btn && btn.setAttribute('aria-expanded', 'false'); } });
})();
