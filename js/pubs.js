/* Shared publication helpers for the home and publications pages.
   Every paper on the site is rendered from data/publications.json by row(). */
window.Pubs = (function () {
  'use strict';

  // Lucide icon paths (ISC licence), inlined so the site needs no icon font.
  var ICON = {
    pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    slides: '<path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5"/>',
    talk: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
    copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'
  };
  var LABEL = { pdf: 'PDF', code: 'Code', slides: 'Slides', talk: 'Talk' };
  var SHORT = { 'USENIX Security': 'USENIX Sec', 'DLSP @ IEEE S&P': 'DLSP', 'IEEE SaTML': 'SaTML' };

  function icon(k) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>'; }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function venue(p) {
    if (p.type === 'book') return String(p.year);
    if (p.type === 'preprint') return 'Preprint';
    return (SHORT[p.short] || p.short) + ' ' + p.year;
  }

  function shortName(p) {
    var t = p.title.split(':')[0];
    return t.length > 30 ? t.split(' ').slice(0, 3).join(' ') + '…' : t;
  }

  function authors(list) {
    return list.map(function (a) { return a === 'Ajith Suresh' ? '<b>' + esc(a) + '</b>' : esc(a); }).join(', ');
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

  function row(p, full, h) {
    h = h || 'h3';
    var l = p.links || {};
    var files = ['pdf', 'code', 'slides', 'talk'].filter(function (k) { return l[k]; }).map(function (k) {
      return '<a class="file" href="' + esc(l[k]) + '" target="_blank" rel="noopener" aria-label="' + LABEL[k] + ': ' + esc(p.title) + '">' + icon(k) + LABEL[k] + '</a>';
    });
    if (!l.pdf) files.unshift('<span class="file missing">' + icon('pdf') + 'PDF soon<span class="sr"> for ' + esc(p.title) + '</span></span>');
    files.push('<button type="button" class="file" data-bib="' + esc(p.id) + '" aria-label="Copy BibTeX: ' + esc(p.title) + '">' + icon('copy') + '<span>BibTeX</span></button>');

    var tags = '';
    if (p.core) tags += '<span class="tag rank">CORE ' + esc(p.core) + '</span>';
    if (p.type === 'journal') tags += '<span class="tag">Journal</span>';
    if (p.type === 'workshop') tags += '<span class="tag">Workshop</span>';
    if (p.type === 'book') tags += '<span class="tag">Book chapter</span>';
    if (p.award) tags += '<span class="tag award">Award</span>';

    return '<li class="pub" id="' + esc(p.id) + '">' +
      '<div class="pub-meta"><span class="venue">' + esc(venue(p)) + '</span>' + tags + '</div>' +
      '<' + h + ' class="pt"><a href="publications.html#' + esc(p.id) + '">' + esc(p.title) + '</a></' + h + '>' +
      '<p class="authors">' + authors(p.authors) + '</p>' +
      (full && p.type !== 'preprint' ? '<p class="where">' + esc(p.venue) + (p.year ? ', ' + p.year : '') + '</p>' : '') +
      (p.award ? '<p class="pnote" style="color:var(--sand-ink)">' + esc(p.award) + '</p>' : '') +
      (p.note ? '<p class="pnote">' + esc(p.note) + '</p>' : '') +
      (full && p.check ? '<p class="pcheck">To confirm: ' + esc(p.check) + '</p>' : '') +
      '<div class="files">' + files.join('') + '</div></li>';
  }

  // Newest first; book chapters after papers of the same year; preprints last.
  function sort(d) {
    var rank = function (p) { return p.type === 'preprint' ? 2 : (p.type === 'book' ? 1 : 0); };
    return d.slice().sort(function (a, b) {
      return (rank(a) === 2) - (rank(b) === 2) || (b.year || 0) - (a.year || 0) || rank(a) - rank(b);
    });
  }

  function load() {
    return fetch('data/publications.json').then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(sort);
  }

  // One delegated handler copies BibTeX for any button rendered by row().
  function bindCopy(root, getData) {
    root.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-bib]') : null;
      if (!btn) return;
      var p = getData().filter(function (x) { return x.id === btn.getAttribute('data-bib'); })[0];
      if (!p) return;
      var span = btn.querySelector('span');
      var flash = function (msg) { span.textContent = msg; setTimeout(function () { span.textContent = 'BibTeX'; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bibtex(p)).then(function () { flash('Copied'); }, function () { flash('Copy failed'); });
      } else {
        flash('Copy failed');
      }
    });
  }

  return { load: load, row: row, bibtex: bibtex, bindCopy: bindCopy, esc: esc, shortName: shortName, venue: venue };
})();
