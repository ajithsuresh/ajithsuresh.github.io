(function () {
  'use strict';

  function isDesktop() {
    return window.innerWidth >= 992;
  }

  function scrollToSection(id) {
    var section = document.getElementById(id);
    if (!section) return;
    var pane = document.querySelector('.container-fluid');
    if (!pane) return;
    pane.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
  }

  function applyDesktopBehaviour() {
    var pane = document.querySelector('.container-fluid');
    if (!pane) return;

    // Re-target Bootstrap scrollspy from body → .container-fluid
    try {
      $(document.body).scrollspy('destroy');
      $(pane).scrollspy({ target: '#sideNav', offset: pane.clientHeight / 2 });
    } catch (e) {}

    // Override jQuery's smooth-scroll (scripts.js uses $("html,body").animate)
    // Re-bind the click handler to scroll our pane instead
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').off('click.scrollfix').on('click.scrollfix', function (e) {
      if (!isDesktop()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      var id = this.getAttribute('href').replace(/^.*#/, '');
      scrollToSection(id);
      // keep URL hash in sync
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });

    // Scroll to the section indicated by the hash (or default to about)
    var hash = window.location.hash ? window.location.hash.slice(1) : 'about';
    scrollToSection(document.getElementById(hash) ? hash : 'about');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (isDesktop()) applyDesktopBehaviour();
    });
  } else {
    if (isDesktop()) applyDesktopBehaviour();
  }

  // Re-apply when crossing the desktop breakpoint
  var wasDesktop = isDesktop();
  window.addEventListener('resize', function () {
    var nowDesktop = isDesktop();
    if (nowDesktop && !wasDesktop) applyDesktopBehaviour();
    wasDesktop = nowDesktop;
  });
})();
