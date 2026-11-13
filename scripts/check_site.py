#!/usr/bin/env python3
"""Static checks for the site. Run from anywhere: python3 scripts/check_site.py [root]

1. Every relative href/src in every .html file points at a file that exists.
2. data/publications.json (when present) is valid, has unique URL-safe ids,
   and every local file it links to exists.
3. portfolio.html still matches the regexes that
   .github/workflows/update-citations.yml uses to patch it. If this fails,
   the weekly citation update would silently stop working.

Exit code 1 if any check fails. Standard library only.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent)
SKIP_DIRS = {".git", ".github", ".impeccable", ".claude", "_site", "node_modules"}
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
    page = ROOT / "portfolio.html"
    if not page.exists():
        print("skip  portfolio.html not present")
        return
    html = page.read_text(encoding="utf-8")
    # Keep these two patterns identical to update-citations.yml.
    stat = re.compile(
        r'(href="https://scholar\.google\.com[^"]*"[^>]*>[\s\S]*?<span class="pf-stat-num">)[\d,]+(</span>)'
    )
    date = re.compile(r"(Scholar, )[A-Za-z]+ \d{4}")
    if not stat.search(html):
        fail("portfolio.html: Scholar anchor + pf-stat-num span no longer match the citation workflow regex")
    if not date.search(html):
        fail("portfolio.html: 'Scholar, Mon YYYY' text no longer matches the citation workflow regex")
    if stat.search(html) and date.search(html):
        print("ok    portfolio.html still matches the citation update patterns")


check_links()
check_publications()
check_citation_markup()
sys.exit(1 if errors else 0)
