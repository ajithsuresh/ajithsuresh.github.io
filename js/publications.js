/* Publications page: search, filters, year groups and .bib download. Needs js/pubs.js. */
(function () {
  'use strict';
  var data = [], st = { q: '', f: 'all' }, first = true;
  var list = document.getElementById('pub-list');
  var sum = document.getElementById('pub-summary');
  var q = document.getElementById('pub-search');
  var chips = document.querySelectorAll('.chips button');

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function summary(shown) {
    if (shown !== data.length) return 'Showing ' + shown + ' of ' + data.length + ' publications.';
    var papers = data.filter(function (p) { return p.type !== 'preprint' && p.type !== 'book'; }).length;
    var books = data.filter(function (p) { return p.type === 'book'; }).length;
    var pre = data.filter(function (p) { return p.type === 'preprint'; }).length;
    var parts = [plural(papers, 'peer-reviewed paper', 'peer-reviewed papers')];
    if (books) parts.push(plural(books, 'book chapter', 'book chapters'));
    if (pre) parts.push(plural(pre, 'preprint', 'preprints'));
    return data.length + ' publications: ' + parts.slice(0, -1).join(', ') + (parts.length > 1 ? ' and ' : '') + parts[parts.length - 1] + '.';
  }

  function ok(p) {
    var l = p.links || {};
    if (st.f === 'astar' && p.core !== 'A*') return false;
    if (st.f === 'code' && !l.code) return false;
    if (st.f === 'award' && !p.award) return false;
    if (st.q) {
      var hay = (p.title + ' ' + p.authors.join(' ') + ' ' + p.venue + ' ' + p.short + ' ' + (p.year || '')).toLowerCase();
      if (hay.indexOf(st.q) === -1) return false;
    }
    return true;
  }

  function render() {
    var rows = data.filter(ok), groups = {}, order = [];
    rows.forEach(function (p) {
      var g = p.type === 'preprint' ? 'Preprints' : String(p.year);
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(p);
    });
    list.innerHTML = rows.length ? order.map(function (g) {
      var n = groups[g].length;
      return '<section class="sec" id="y' + g + '"><div class="label"><h2 class="num">' + g + '</h2><p>' + plural(n, 'entry', 'entries') + '</p></div>' +
        '<div class="body"><ol class="pubs">' + groups[g].map(function (p) { return Pubs.row(p, true); }).join('') + '</ol></div></section>';
    }).join('') : '<section class="sec"><span></span><p class="empty">No publication matches these filters. Try an author surname or a venue such as NDSS, or choose All.</p></section>';
    sum.textContent = summary(rows.length);

    if (first) {
      first = false;
      if (location.hash.length > 1) {
        var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView();
      }
    }
  }

  q.addEventListener('input', function () { st.q = q.value.trim().toLowerCase(); render(); });
  Array.prototype.forEach.call(chips, function (b) {
    b.addEventListener('click', function () {
      st.f = b.getAttribute('data-f');
      Array.prototype.forEach.call(chips, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });
  });

  document.getElementById('pub-bib-all').addEventListener('click', function () {
    var blob = new Blob([data.map(Pubs.bibtex).join('\n')], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ajith-suresh-publications.bib';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  Pubs.bindCopy(list, function () { return data; });

  Pubs.load().then(function (d) { data = d; render(); }).catch(function () {
    sum.textContent = 'The publication list could not load.';
    list.innerHTML = '<section class="sec"><span></span><p class="empty">Check your connection and reload, or use the <a href="files/cv_publications.pdf">publications PDF</a>.</p></section>';
  });
})();
