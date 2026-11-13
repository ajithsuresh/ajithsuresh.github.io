# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Researchers and reviewers who look up, read and cite Ajith Suresh's papers and check his record. Industry and partner contacts, for example at companies and agencies, who judge his expertise in secure multiparty computation (MPC) and privacy-preserving machine learning before a collaboration. They arrive from a search result, a citation, a CV link or an email, usually wanting one paper or one file.

## Product Purpose

A personal academic site for Ajith Suresh, Lead MPC Researcher at TII Abu Dhabi. It presents his CV, a portfolio overview, and a publications page that lists every paper together with its files (PDF, code, slides). Success means a visitor finds a paper, gets the right file, cites it correctly, and can contact him.

## Positioning

A single, accurate, first-party record of one researcher's work, with the real files hosted alongside each paper. A venue's listing or a search index shows one paper at a time. This site shows the whole body of work, with author-controlled versions and BibTeX.

## Operating Context

- Static site on GitHub Pages. No build step, no server, no framework.
- `portfolio.html` carries a weekly GitHub Actions job (`.github/workflows/update-citations.yml`) that rewrites the Google Scholar citation count and "Scholar, Mon YYYY" date by regex. The Scholar anchor and the `pf-stat-num` span must stay intact.
- The CV page (`index.html`) is a Bootstrap 4 sidebar layout with a hand-written publication list. The portfolio and publications pages are standalone pages.
- Publication data lives in `data/publications.json` and is rendered in the browser by `js/publications.js`.
- Existing downloads: `files/cv.pdf`, `files/cv_publications.pdf`, `files/cv_short.pdf`, and one presentation under `files/presentations/`.

## Capabilities and Constraints

- Publications page lists 26 entries: 24 papers, 1 book chapter and 1 preprint. Count is computed from the data, never typed by hand.
- Each entry can carry: PDF, code, slides, BibTeX, CORE rank, award, and a note linking journal and conference versions of one work.
- Files are hosted in this repository under `files/`, not only linked externally. Rights are mixed and handled case by case: the owner marks which papers may be hosted as published, and everything else uses author-accepted or preprint versions.
- Entries that exist as both a conference or workshop version and a later journal version are listed separately and cross-referenced. Doubtful entries are confirmed with the owner before they ship.
- Confirmed facts: SynCirc (IEEE TC 2026) is the journal version of the IEEE HOST 2021 paper. WW-FL is IACR CHES 2026. Fast Actively Secure OT Extension for Short Secrets is NDSS 2017. The 6G Massive IoT book chapter is 2025.
- Open: `index.html` and `files/cv_publications.pdf` may still show NDSS 2020 for the OT-extension paper. Needs the owner's go-ahead to correct.
- Open: the exact PDFs, slides and code archives to host have not been provided yet.

## Brand Commitments

The name is "Ajith Suresh". The site carries the owner's existing look: Inter type and an indigo accent (`#6366f1`) on the CV and portfolio pages. The owner has not yet approved extending it as the site's identity.

## Evidence on Hand

- `files/cv_publications.pdf`: the only source of full per-paper links.
- Eprint links and two code repositories (ABY2.0, FLUTE) for several papers, in `portfolio.html`.
- Google Scholar profile (author id `uXP9hiMAAAAJ`) used for the citation count.
- No testimonials, awards beyond those in the CV, or metrics beyond the Scholar count are on hand. Do not invent any.

## Product Principles

1. Accuracy over polish. Venue, year, authors and file versions must be right and traceable to the owner's confirmation.
2. The paper and its files come first. Every entry gets its file in one click.
3. One source of truth for publication data, so the CV, portfolio and publications pages cannot drift apart.
4. Keep it static and cheap to maintain. Adding a paper means editing one data entry.
5. Never break the weekly citation update.

## Accessibility & Inclusion

Target WCAG AA contrast and full keyboard use. Links carry the paper's title in their accessible name, and the page works at phone width.
