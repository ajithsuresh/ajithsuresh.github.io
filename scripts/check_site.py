#!/usr/bin/env python3
"""Static checks for the site. Run from anywhere: python3 scripts/check_site.py [root]

1. Every relative href/src in every .html file points at a file that exists.
2. data/publications.json (when present) is valid, has unique URL-safe ids,
   and every local file it links to exists.
3. index.html still matches the regexes that
   .github/workflows/update-citations.yml uses to patch it. If this fails,
   the weekly citation update would silently stop working.

4. Every indexable page has a title, description, canonical URL and Open Graph
   tags; JSON-LD parses; robots.txt names the sitemap; sitemap.xml lists
   exactly the indexable pages.

Exit code 1 if any check fails. Standard library only.
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent)
SKIP_DIRS = {".git", ".github", ".impeccable", ".claude", "_site", "node_modules"}
SITE = "https://ajithsuresh.github.io/"
errors = []


def fail(msg):
    errors.append(msg)
    print(f"FAIL  {msg}")


def html_files():
    for p in sorted(ROOT.rglob("*.html")):
        if not SKIP_DIRS.intersection(p.relative_to(ROOT).parts):
            yield p


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for key in ("href", "src"):
            if a.get(key):
                self.refs.append((tag, a[key]))
        if tag == "img" and a.get("srcset"):
            for part in a["srcset"].split(","):
                self.refs.append((tag, part.strip().split(" ")[0]))


def is_local(ref):
    u = urlparse(ref)
    if u.scheme or u.netloc or ref.startswith(("#", "//", "data:", "mailto:", "tel:", "javascript:")):
        return False
    return bool(u.path)


def local_exists(base, ref):
    path = unquote(urlparse(ref).path)
    target = (ROOT / path.lstrip("/")) if path.startswith("/") else (base.parent / path)
    return target.exists() or (target.is_dir() and (target / "index.html").exists())


def check_links():
    before, count = len(errors), 0
    for page in html_files():
        parser = Refs()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        for tag, ref in parser.refs:
            if is_local(ref):
                count += 1
                if not local_exists(page, ref):
                    fail(f"{page.relative_to(ROOT)}: <{tag}> points at missing file '{ref}'")
    if len(errors) == before:
        print(f"ok    checked {count} local references")


def check_publications():
    path = ROOT / "data" / "publications.json"
    if not path.exists():
        print("skip  data/publications.json not present")
        return
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as e:
        fail(f"data/publications.json is not valid JSON: {e}")
        return
    if not isinstance(data, list) or not data:
        fail("data/publications.json must be a non-empty list")
        return
    before, seen = len(errors), set()
    for i, e in enumerate(data):
        label = e.get("id", f"#{i}") if isinstance(e, dict) else f"#{i}"
        if not isinstance(e, dict):
            fail(f"publications[{label}] is not an object")
            continue
        for key in ("id", "title", "authors", "venue", "type"):
            if not e.get(key):
                fail(f"publications[{label}] is missing '{key}'")
        if not isinstance(e.get("authors", []), list):
            fail(f"publications[{label}].authors must be a list")
        pid = e.get("id", "")
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", pid):
            fail(f"publications[{label}].id must be lowercase letters, digits and dashes")
        if pid in seen:
            fail(f"duplicate publication id '{pid}'")
        seen.add(pid)
        year = e.get("year")
        if year is not None and not (isinstance(year, int) and 1990 <= year <= 2100):
            fail(f"publications[{label}].year '{year}' is not a plausible year")
        for kind, url in (e.get("links") or {}).items():
            if url and is_local(url) and not (ROOT / unquote(urlparse(url).path)).exists():
                fail(f"publications[{label}].links.{kind} points at missing file '{url}'")
    if len(errors) == before:
        print(f"ok    {len(data)} publication entries")


def check_citation_markup():
    page = ROOT / "index.html"
    if not page.exists():
        print("skip  index.html not present")
        return
    html = page.read_text(encoding="utf-8")
    # Keep these two patterns identical to update-citations.yml.
    stat = re.compile(
        r'(href="https://scholar\.google\.com[^"]*"[^>]*>[\s\S]*?<span class="pf-stat-num">)[\d,]+(</span>)'
    )
    date = re.compile(r"(Scholar, )[A-Za-z]+ \d{4}")
    if not stat.search(html):
        fail("index.html: Scholar anchor + pf-stat-num span no longer match the citation workflow regex")
    if not date.search(html):
        fail("index.html: 'Scholar, Mon YYYY' text no longer matches the citation workflow regex")
    if stat.search(html) and date.search(html):
        print("ok    index.html still matches the citation update patterns")


class Head(HTMLParser):
    """Collects the head tags the SEO check needs."""

    def __init__(self):
        super().__init__()
        self.title, self.meta, self.canonical, self.ld = "", {}, None, []
        self._in_title = self._in_ld = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key] = a.get("content", "")
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True
            self.ld.append("")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script":
            self._in_ld = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif self._in_ld:
            self.ld[-1] += data


def check_seo():
    before, pages = len(errors), []
    for page in html_files():
        head = Head()
        head.feed(page.read_text(encoding="utf-8", errors="replace"))
        name = page.relative_to(ROOT).as_posix()
        if "noindex" in head.meta.get("robots", ""):
            continue  # redirect stubs stay out of search results
        pages.append(name)
        want = SITE + ("" if name == "index.html" else name)
        if not head.title.strip():
            fail(f"{name}: missing <title>")
        desc = head.meta.get("description", "").strip()
        if not 50 <= len(desc) <= 175:
            fail(f"{name}: meta description must be 50-175 characters (is {len(desc)})")
        if head.canonical != want:
            fail(f"{name}: canonical is '{head.canonical}', expected '{want}'")
        for key in ("og:title", "og:description", "og:url", "og:image", "twitter:card"):
            if not head.meta.get(key, "").strip():
                fail(f"{name}: missing <meta {key}>")
        if head.meta.get("og:url") != want:
            fail(f"{name}: og:url does not match the canonical URL")
        for block in head.ld:
            try:
                json.loads(block)
            except ValueError as e:
                fail(f"{name}: JSON-LD is not valid JSON: {e}")
    robots = ROOT / "robots.txt"
    if not robots.exists() or f"Sitemap: {SITE}sitemap.xml" not in robots.read_text():
        fail("robots.txt must exist and name the sitemap")
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        fail("sitemap.xml is missing")
    else:
        try:
            ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            listed = {u.text for u in ET.parse(sitemap).getroot().findall("s:url/s:loc", ns)}
            wanted = {SITE + ("" if n == "index.html" else n) for n in pages}
            for extra in sorted(listed - wanted):
                fail(f"sitemap.xml lists '{extra}', which is not an indexable page")
            for missing in sorted(wanted - listed):
                fail(f"sitemap.xml is missing '{missing}'")
        except ET.ParseError as e:
            fail(f"sitemap.xml is not valid XML: {e}")
    if len(errors) == before:
        print(f"ok    SEO tags, robots.txt and sitemap.xml for {len(pages)} pages")


check_links()
check_publications()
check_citation_markup()
check_seo()
sys.exit(1 if errors else 0)
