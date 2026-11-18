---
name: Ajith Suresh — Academic Site
description: A light academic page that slides over a deep sea-blue banner, with a left label column and one sand accent.
colors:
  sea: "#113a55"
  sea-2: "#0b2b40"
  sand: "#d9892b"
  sand-ink: "#915309"
  sand-soft: "#fcf2e3"
  ink: "#1b252d"
  ink-2: "#43505a"
  ink-3: "#5a6771"
  link: "#0a5b8e"
  mist: "#edf2f5"
  white: "#ffffff"
typography:
  display:
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 3.6vw, 2.9rem)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.25
  title:
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, .96rem + .18vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  tag: "4px"
  control: "10px"
  callout: "14px"
  sheet: "2.25rem"
  sheet-phone: "1.5rem"
spacing:
  label-column: "11rem"
  gutter: "3rem"
  content: "47rem"
  section: "4.5rem"
components:
  button:
    backgroundColor: "{colors.sea}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "2.75rem"
  button-line:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  tag-rank:
    backgroundColor: "#e2edf4"
    textColor: "{colors.sea}"
    rounded: "{rounded.tag}"
  tag-award:
    backgroundColor: "{colors.sand-soft}"
    textColor: "{colors.sand-ink}"
    rounded: "{rounded.tag}"
---

# Design System: Ajith Suresh — Academic Site

## Overview

A single, light academic page in the spirit of christian.weinert.net, redesigned for this site. A deep sea-blue banner sits at the top; a white sheet with large rounded top corners slides over it, with the portrait on the seam. Every section has its title in a sticky left label column, marked by a short sand bar, and its content in one reading column. The publications page uses the label column for years.

## Colors

- **Sea** `#113a55`: banner, solid nav bar, primary buttons, footer. White on it is 11.9:1.
- **Sand** `#d9892b`: accent bars and theme rules only. Never text.
- **Sand ink** `#915309`: venue codes and award text. 6.1:1 on white.
- **Ink** `#1b252d`, **Ink 2** `#43505a`, **Ink 3** `#5a6771`: text. Ink 3 (5.8:1) is the lightest allowed.
- **Link** `#0a5b8e` with a 32% underline that turns solid on hover.
- **Mist** `#edf2f5`: tags and callouts.

Light only. No gradients, no glows.

## Typography

Figtree throughout, 400 for body and 650 for headings and titles. Venue codes are 700, uppercase, in sand ink. Nothing below 12px.

## Layout

- Label column 11rem, gutter 3rem, content up to 47rem. Below 860px the label stacks above its section.
- Sections are 4.5rem apart (3.25rem on phones). Labels stay sticky while their section scrolls.
- The nav is transparent over the home banner and turns solid sea with the avatar and name once the banner scrolls away. Inner pages show it solid from the start. Below 860px it collapses to a Menu button.

## Components

- **Label rows** (`.kv`): Email, Record, Profiles. The Record row holds the Scholar link with the `pf-stat-num` span the citation workflow rewrites.
- **Theme block**: 2px sand top rule, icon, title, one line, key papers.
- **Publication row** (`js/pubs.js`): venue code, CORE and type tags, title, authors with the owner in bold, files as underlined text links with small icons, BibTeX copy button.
- **Rows** (`.rows`): date column plus title and subtitle, used for talks, service, career, CV.
- **Buttons**: 2.75rem tall, 10px corners. Sea fill for primary, white with a hairline for secondary.

## Do's and Don'ts

- **Do** keep sand for bars and rules; use sand ink when it has to be text.
- **Do** render papers and counts from `data/publications.json`.
- **Don't** add shadows except the sheet's and the avatar's.
- **Don't** use pill shapes, emoji or an icon font.
- **Don't** touch the Scholar anchor and `pf-stat-num` span in `index.html`.
