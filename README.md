# MASCO101 — Tools for Success

Course site for **MASCO101 Tools for Success** (5 ECTS, Term 1, FHEQ Level 7, AY 2026/27),
built on the same landing-page-plus-accordion pattern as
[MARTI301](https://drhaas-eubs.github.io/marti301/).

© 2026 Dr. Hildegard Haas · EU Business School

---

## Structure

```
index.html                  Landing page — 8 unit accordions
unit1.html … unit8.html     Framework Galleries (tier 1 + tier 2)
slibrary.html               Framework Authors, anchored #unit1 … #unit8
activities/  cases/  prereading/  reflections/
assets/css/framework-viewer.css
assets/js/framework-viewer.js
assets/pdf/framework-library.pdf   ← not included, see below
```

## The landing page

Each unit is an expandable accordion carrying:

- a colour-coded **number badge** and a **format tag** (Guided Discovery, Pitch Arena, …)
- the blue **Core Message** box — one distilled sentence per Bostelaar's
  *Clarify Your Core Message* method — combined with the **Learning focus · ILO** line
  (hover the ILO badge for the full learning outcome text)
- six **pedagogical resource rows**: Framework Gallery (FG), the unit's dynamic
  activity, Case Study (CS), Pre-Reading (PR), Reflection Prompt (RF),
  Framework Authors (AU)

Search covers unit titles, core messages, resource titles and all 80 framework names.

## Three-tier framework drill-down

1. **Thumbnail card** in the Framework Gallery grid — generated SVG figure, name,
   short definition, Slibrary badge.
2. **Quick-look modal** — red one-sentence definition, the figure at full size,
   four key bullets, a Harvard-style Reference, and a
   *View Full A4 Reference Sheet* button.
3. **Full A4 sheet** in the protected PDF viewer, opened at the correct page.

## PDF page mapping

`assets/js/framework-viewer.js` anchors every framework to a page:

```
page = 10 + 5 × (slibrary − 1) + sheet
```

| Section | Pages |
| --- | --- |
| Cover | 1 |
| Master Index (one page per unit) | 2–9 |
| How to Use This Library | 10 |
| Sheets (16 Slibraries × 5) | 11–90 |

Unit entry points: U1 p.11, U2 p.21, U3 p.31, U4 p.41, U5 p.51, U6 p.61, U7 p.71, U8 p.81.

## Still to add

- **`assets/pdf/framework-library.pdf`** — the 90-page A4 sheet library. Until it is
  present, tier 3 opens and reports the missing file; tiers 1 and 2 work fully.
- **`activities/`, `cases/`, `prereading/`** — scaffolded pages with the correct
  header, core message and ILO block, plus an outline of what each page carries.
  Reflection prompts in `reflections/` are complete.
- **`slibrary.html`** uses monogram tiles rather than the hand-drawn author SVGs
  used on MARTI301. Drop `svg/<author>_thumbnail.svg` files in and swap the tile
  markup if you want parity.

## Deploying

Static site — push to a GitHub repo and enable Pages on the root of the default branch.
PDF.js loads from `cdnjs.cloudflare.com`; everything else is local.
