(function () {
  var listEl = document.getElementById('pub-list');
  var summaryEl = document.getElementById('pub-summary');
  var searchEl = document.getElementById('pub-search');
  var segEls = document.querySelectorAll('.pub-seg button');
  var data = [];
  var state = { q: '', f: 'all' };
  var firstRender = true;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function authorsHtml(list) {
    return list.map(function (a) {
      return a === 'Ajith Suresh' ? '<strong>' + esc(a) + '</strong>' : esc(a);
    }).join(', ');
  }

  function bibtex(p) {
    var last = p.authors[0].split(' ').pop().toLowerCase().replace(/[^a-z]/g, '');
    var word = p.title.split(/\W+/)[0].toLowerCase();
    var key = last + (p.year || 'nd') + word;
    var kind = p.type === 'journal' ? 'article' : (p.type === 'book' ? 'incollection' : (p.type === 'preprint' ? 'misc' : 'inproceedings'));
    var venueField = p.type === 'journal' ? 'journal' : 'booktitle';
    var out = '@' + kind + '{' + key + ',\n  title = {' + p.title + '},\n  author = {' + p.authors.join(' and ') + '},\n';
    if (p.type !== 'preprint') out += '  ' + venueField + ' = {' + p.venue + '},\n';
    if (p.year) out += '  year = {' + p.year + '},\n';
    return out + '}\n';
  }

  function matches(p) {
    if (state.f === 'peer' && (p.type === 'preprint' || p.type === 'book')) return false;
    if (state.f === 'award' && !p.award) return false;
    if (state.f === 'code' && !(p.links && p.links.code)) return false;
    if (state.q) {
      var hay = (p.title + ' ' + p.authors.join(' ') + ' ' + p.venue + ' ' + p.short + ' ' + p.year).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function linkHtml(label, href, p) {
    if (!href) return '';
    return '<a class="pub-link" href="' + esc(href) + '" target="_blank" rel="noopener" aria-label="' +
      label + ': ' + esc(p.title) + '">' + label + '</a>';
  }

  function entryHtml(p, n) {
    var l = p.links || {};
    var links = '';
    links += l.pdf ? linkHtml('PDF', l.pdf, p)
      : '<span class="pub-link pending" title="File not added yet">PDF<span class="sr"> not available yet</span></span>';
    links += linkHtml('Code', l.code, p) + linkHtml('Slides', l.slides, p) + linkHtml('Talk', l.talk, p);
    links += '<button type="button" class="pub-link" data-bib="' + esc(p.id) + '" aria-label="Copy BibTeX: ' + esc(p.title) + '">BibTeX</button>';
    var venue = '<em>' + esc(p.venue) + (p.year ? ' ' + p.year : '') + '</em>';
    if (p.core) venue += '<span class="pub-tier">CORE ' + esc(p.core) + '</span>';
    if (p.type === 'workshop') venue += '<span class="pub-type">Workshop</span>';
    if (p.type === 'book') venue += '<span class="pub-type">Book chapter</span>';
    if (p.award) venue += '<span class="pub-award">' + esc(p.award) + '</span>';
    return '<article class="pub" id="' + esc(p.id) + '"><span class="pub-n" aria-hidden="true">[' + n + ']</span><div>' +
      '<p class="pub-title">' + esc(p.title) + '.</p>' +
      '<p class="pub-authors">' + authorsHtml(p.authors) + '</p>' +
      '<p class="pub-venue">' + venue + '</p>' +
      (p.note ? '<p class="pub-note">' + esc(p.note) + '</p>' : '') +
      '<div class="pub-links">' + links + '</div>' +
      (p.check ? '<p class="pub-check">To confirm: ' + esc(p.check) + '</p>' : '') +
      '</div></article>';
  }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function summary(shownN) {
    if (shownN !== data.length) return 'Showing ' + shownN + ' of ' + data.length + ' publications.';
    var papers = data.filter(function (p) { return p.type !== 'preprint' && p.type !== 'book'; }).length;
    var books = data.filter(function (p) { return p.type === 'book'; }).length;
    var pre = data.filter(function (p) { return p.type === 'preprint'; }).length;
    var parts = [plural(papers, 'paper', 'papers')];
    if (books) parts.push(plural(books, 'book chapter', 'book chapters'));
    if (pre) parts.push(plural(pre, 'preprint', 'preprints'));
    return data.length + ' publications: ' + parts.slice(0, -1).join(', ') + (parts.length > 1 ? ' and ' : '') + parts[parts.length - 1] + '.';
  }

  function render() {
    var shown = data.filter(matches);
    var numbered = data.filter(function (p) { return p.type !== 'preprint'; }).length;
    var html = '';
    var lastGroup = null;
    shown.forEach(function (p) {
      var group = p.type === 'preprint' ? 'Preprints' : (p.type === 'book' ? 'Book chapters' : String(p.year));
      if (group !== lastGroup) { html += '<h2 class="pub-year">' + group + '</h2>'; lastGroup = group; }
      var idx = data.indexOf(p);
      html += entryHtml(p, p.type === 'preprint' ? 'P' + (idx - numbered + 1) : (numbered - idx));
    });
    listEl.innerHTML = html || '<p class="pub-empty">No publications match these filters. Clear the search or choose All.</p>';
    summaryEl.textContent = summary(shown.length);

    if (firstRender) {
      firstRender = false;
      if (location.hash.length > 1) {
        var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
          target.scrollIntoView();
          target.classList.add('pub-target');
        }
      }
    }
  }

  function copy(text, btn) {
    var label = btn.textContent;
    var flash = function (msg) {
      btn.textContent = msg;
      setTimeout(function () { btn.textContent = label; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash('Copied'); }, function () { flash('Copy failed'); });
    } else {
      flash('Copy failed');
    }
  }

  listEl.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-bib]') : null;
    if (!btn) return;
    var p = data.filter(function (x) { return x.id === btn.getAttribute('data-bib'); })[0];
    if (p) copy(bibtex(p), btn);
  });

  document.getElementById('pub-bib-all').addEventListener('click', function () {
    var blob = new Blob([data.map(bibtex).join('\n')], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ajith-suresh-publications.bib';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  searchEl.addEventListener('input', function () { state.q = searchEl.value.trim().toLowerCase(); render(); });
  Array.prototype.forEach.call(segEls, function (b) {
    b.addEventListener('click', function () {
      state.f = b.getAttribute('data-f');
      Array.prototype.forEach.call(segEls, function (x) {
        var on = x === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  fetch('data/publications.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (d) {
      var rank = function (p) { return p.type === 'preprint' ? 2 : (p.type === 'book' ? 1 : 0); };
      data = d.slice().sort(function (a, b) {
        return rank(a) - rank(b) || (b.year || 0) - (a.year || 0);
      });
      render();
    })
    .catch(function () {
      summaryEl.textContent = 'The publication list could not load.';
      listEl.innerHTML = '<p class="pub-empty">Check your connection and reload, or use the <a href="files/cv_publications.pdf">publications PDF</a>.</p>';
    });
})();
