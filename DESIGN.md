---
name: Ajith Suresh — Academic Site
description: A quiet, serif-led reading surface for one researcher's papers, built on the site's existing Inter and indigo system.
colors:
  indigo: "#6366f1"
  indigo-dark: "#4f46e5"
  indigo-deep: "#3730a3"
  indigo-tint: "#eef2ff"
  indigo-wash: "#e0e7ff"
  indigo-line: "#c7d2fe"
  indigo-on-dark: "#a5b4fc"
  ink: "#0f172a"
  ink-soft: "#334155"
  ink-muted: "#475569"
  ink-quiet: "#64748b"
  paper: "#f1f5f9"
  surface: "#ffffff"
  hairline: "#e2e8f0"
  rule: "#cbd5e1"
  night: "#0a0e1a"
  award-bg: "#fef3c7"
  award-ink: "#92400e"
typography:
  display:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "2.1rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.4
  ui:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "5px"
  md: "6px"
  lg: "8px"
  pill: "99px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "56px"
components:
  segment-active:
    backgroundColor: "{colors.indigo-dark}"
    textColor: "{colors.surface}"
    typography: "{typography.ui}"
    padding: "8px 12px"
  segment-idle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-quiet}"
    typography: "{typography.ui}"
    padding: "8px 12px"
  file-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.indigo-deep}"
    rounded: "{rounded.md}"
    typography: "{typography.ui}"
    padding: "2px 9px"
  file-chip-pending:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-quiet}"
    rounded: "{rounded.md}"
    padding: "2px 9px"
  rank-badge:
    backgroundColor: "{colors.indigo-tint}"
    textColor: "{colors.indigo-deep}"
    rounded: "{rounded.sm}"
    typography: "{typography.label}"
    padding: "1px 7px"
  award-badge:
    backgroundColor: "{colors.award-bg}"
    textColor: "{colors.award-ink}"
    rounded: "{rounded.sm}"
    typography: "{typography.label}"
    padding: "1px 7px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  site-bar:
    backgroundColor: "{colors.night}"
    textColor: "{colors.indigo-on-dark}"
    height: "56px"
---

# Design System: Ajith Suresh — Academic Site

## Overview

**Creative North Star: "The Reading Room"**

The site is a quiet place to read about one researcher's work. The papers carry the page. Entries are set in a book serif on a pale cool ground, the interface is set in Inter and kept small, and a single indigo accent marks what you can act on. Nothing competes with a title, its authors and its venue.

Depth is flat. Rules, tonal fills and hairlines separate things, and shadows appear only in response to interaction. Controls are small and softly rounded, so they feel friendly without becoming the subject. The CV and portfolio pages already share this palette and the Inter voice; the publications page adds the serif for the reading itself.

**Key Characteristics:**
- Serif for reading (titles, authors, venues). Sans for tools (nav, filters, chips, badges).
- One accent, indigo, on actions and the active state.
- Flat surfaces separated by hairlines and rules.
- Dense but breathable: tight within an entry, generous between years.
- Dark site bar on every standalone page as the constant frame.

## Colors

A cool slate-and-paper neutral set with one indigo accent and a single warm note reserved for awards.

### Primary
- **Signal Indigo** (#6366f1): the brand accent on the CV and portfolio pages. Filled buttons on the dark bar and hover rings.
- **Pressed Indigo** (#4f46e5): the active filter fill and hover state. Passes AA with white text where Signal Indigo does not (white on #6366f1 is 4.47:1).
- **Deep Indigo** (#3730a3): link and chip text on light grounds. The accent as readable ink.
- **Indigo Tint** (#eef2ff) and **Indigo Wash** (#e0e7ff): hover and rank-badge fills, and the highlight on a deep-linked entry.
- **Indigo Line** (#c7d2fe): the 1px outline on file chips.
- **Indigo on Night** (#a5b4fc): active nav link and footer links on the dark bar.

### Neutral
- **Ink** (#0f172a): headings and strong text.
- **Soft Ink** (#334155): author lines and year headings.
- **Muted Ink** (#475569): summary line, venue line, notes. Lightest allowed for body-size text on Paper.
- **Quiet Ink** (#64748b): entry numbers and idle filter text. Never below this on Paper.
- **Paper** (#f1f5f9): the page ground.
- **Surface** (#ffffff): inputs, idle controls, chip fills.
- **Hairline** (#e2e8f0): borders on inputs and control groups.
- **Rule** (#cbd5e1): the line under each year heading.
- **Night** (#0a0e1a): the site bar and footer.

### Award
- **Award Amber** (#fef3c7 fill, #92400e ink): used only for award badges.

### Named Rules
**The One Voice Rule.** Indigo marks actions and the active state only. It is never decoration, and it does not fill large areas on reading pages.

**The Quiet Ink Floor Rule.** Body-size text on Paper is #475569 or darker. #64748b is for small, non-essential numerals only.

## Typography

**Display Font:** Source Serif 4 (with Georgia, serif)
**Body Font:** Source Serif 4 for entries; Inter (with system sans) for interface
**Label/Mono Font:** none. Inter at small sizes carries labels.

**Character:** A book serif for the reading and a neutral sans for the machinery. The pairing makes it obvious which text is content and which is control.

### Hierarchy
- **Display** (600, 2.1rem, 1.2): the page title only ("Publications").
- **Headline** (600, 1.15rem, 1.3): year groups, over a 1px Rule line.
- **Title** (600, 1rem, 1.5): paper titles. Wrap with `text-wrap: pretty`.
- **Body** (400, 0.95rem, 1.5): authors, venue, notes. Entry text is capped at 74ch.
- **Label** (600, 0.72rem): rank, award and type badges. Nothing functional goes below 11px.
- **UI** (500, 0.8rem): filters, file chips, buttons.

### Named Rules
**The Serif-Reads, Sans-Acts Rule.** If it is something the visitor reads as content, it is serif. If it is something they operate or scan as metadata, it is Inter.

**The 11px Floor Rule.** No functional or content text is smaller than 11px.

## Layout

Single column, centered, 860px max width with 24px side gutters (16px on phones). Entries sit on a two-column grid: a narrow number gutter (40px, 30px on phones) and the text column. The top bar is sticky at 56px, so anything that scrolls to an anchor needs 88px of scroll margin.

Rhythm: 4px between lines inside an entry, 18px between entries, 34px above and 12px below a year heading. More space above a heading than below it. The CV page keeps its own Bootstrap sidebar layout, unchanged.

Responsive: below 640px the filter group stretches to full width, gutters tighten, and on touch devices every chip is at least 37px tall. The portfolio bar hides its text links on phones, so the footer carries the cross-links.

## Elevation & Depth

Flat by default. Hierarchy comes from tonal fills (Paper ground, white controls), 1px hairlines and rules. The legacy portfolio cards lift with a soft shadow on hover only, and that is the one permitted use.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 6px 24px rgba(0,0,0,0.08)`): portfolio cards on hover only.

### Named Rules
**The Flat-At-Rest Rule.** No surface casts a shadow at rest. Shadows are a response to hover, never decoration, and never coloured.

## Shapes

Softly rounded and consistent: 5px for badges, 6px for file chips and the top-bar button, 8px for inputs and the filter group. Pills (99px) are not used on reading pages. Borders are 1px solid hairline. Pending files use a dashed 1px border, which is the only dashed line in the system.

## Components

### Buttons and segmented filters
- **Shape:** 8px group radius, 1px hairline border, buttons separated by 1px rules.
- **Active:** Pressed Indigo fill with white text (#4f46e5).
- **Idle:** white fill, Quiet Ink text. Hover shifts to Indigo Tint with Deep Indigo text.
- **Focus:** 2px Pressed Indigo outline with 2px offset. On the dark bar the outline is Indigo on Night.

### File chips
- **Style:** white fill, 1px Indigo Line border, Deep Indigo text, 6px radius, 0.72rem.
- **Pending file:** dashed Rule border, Quiet Ink text, no hover response. Reads "not available yet" to assistive tech.
- **Touch:** 8px by 14px padding on coarse pointers.

### Badges
- **Rank** (CORE A*, CORE A): Indigo Tint fill, Deep Indigo text.
- **Award:** Award Amber fill and ink.
- **Type** (Workshop, Book chapter): Paper fill, Muted Ink text.

### Inputs / Fields
- **Style:** white fill, 1px hairline, 8px radius, 0.88rem Inter.
- **Focus:** 2px indigo outline with 1px offset.

### Navigation
- **Style:** dark Night bar, 56px, Inter 0.82rem 600 uppercase with 0.07em tracking. Links in Quiet Slate (#94a3b8), the current page in Indigo on Night. One filled indigo button ("← Academic CV").
- **Mobile:** text links hide below 640px.

### Publication entry (signature)
A numbered row: number gutter, serif title, author line with the owner's name in 600 weight, an italic venue line with badges, then file chips. Entries are grouped by year under a ruled heading. Notes that link journal and conference versions sit under the venue line in italic Muted Ink.

## Do's and Don'ts

### Do:
- **Do** set content in Source Serif 4 and controls in Inter.
- **Do** keep indigo for actions and the active state.
- **Do** use #4f46e5, not #6366f1, behind white text.
- **Do** keep text on Paper at #475569 or darker for body size.
- **Do** give every link its paper's title as its accessible name.
- **Do** offset anchor targets by 88px for the sticky bar.

### Don't:
- **Don't** use shadows at rest, coloured glows, or gradient text on reading pages.
- **Don't** put a coloured border on one side of a rounded card.
- **Don't** set functional text below 11px.
- **Don't** type publication counts or years into the HTML. They come from `data/publications.json`.
- **Don't** touch the Scholar anchor and `pf-stat-num` span in `portfolio.html`. The weekly citation job rewrites them by regex.
