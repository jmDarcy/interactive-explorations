# Interactive Explorations

Hands-on, interactive demonstrations in mathematics and quantitative disciplines — from
logic and topology to probability, statistics, machine learning, and actuarial
mathematics. Built to complement the theoretical notes on
[jakubmikolajczak.pl](https://jakubmikolajczak.pl) — the notes are the lecture layer,
this project is the experimental one: change a parameter, watch the chart update, and
check your intuition for yourself.

**Live gallery:** <https://jmdarcy.github.io/interactive-explorations/>

## What this is

Each applet is a small, self-contained demonstration built with plain HTML, CSS, and
JavaScript modules (Plotly.js for charts, KaTeX for formulas, both from a CDN). There is
no build step, no framework, and no npm — everything runs directly in your browser.

The site has three levels:

| Page | URL | Content |
|---|---|---|
| Home | `/` | hero, global search, 9 domain tiles, recently added applets |
| Domain gallery | `/domains/<domain-id>/` | domain tabs, filters, applet cards, pagination |
| Applet | `/applets/<applet-id>/` | controls, chart, readouts, explanation |

Filters on a domain gallery live in the URL (`?q=&status=&sort=&view=&page=`), so a
filtered view can be shared as a link. The home search uses `?q=`. Both searches ignore
case and Polish diacritics (`lodz` finds `łódź`).

## Applets

- **[Central Limit Theorem](https://jmdarcy.github.io/interactive-explorations/applets/central-limit-theorem/)**
  — watch the distribution of a sample mean approach a normal distribution as the
  sample size grows, for several different underlying distributions.

More applets — Markov chains, Poisson processes, bootstrap, decision boundaries, loss
distributions, and related topics — are in progress. The gallery always reflects the
current state.

## Running it locally

```bash
git clone https://github.com/jmDarcy/interactive-explorations.git
python -m http.server 8000
```

Run the server from the directory **containing** the clone and open
`http://localhost:8000/interactive-explorations/`. This mimics the GitHub Pages path
prefix, which is why all internal links are relative. Opening `index.html` by
double-clicking it won't work, since pages load the registry and scripts as ES modules.

## Project structure

```text
index.html                      home page
domains/<id>/index.html         domain gallery shells (generated — do not edit)
applets/
  registry.json                 single source of truth: domains and applets
  registry.js                   loads registry.json and re-exports it for pages
  _template/                    starting point for a new applet
  <applet-id>/                  index.html, app.js, app.css, thumb.svg
assets/domains/<id>/            sigil.svg (domain mark), cover.svg (tile illustration)
shared/
  theme.css                     design tokens and base components
  layout.css                    page layouts, cards, applet page
  components.js                 shared markup: cards, rows, counters, URLs
  home.js                       home page rendering and global search
  domain-page.js                domain gallery rendering
  applet-page.js                applet-page helpers driven by the registry
  utilities.js                  plural(), search normalisation, plotlyTheme(), RNG
  math-formatting.js            thin KaTeX wrapper ([data-math] elements)
scripts/
  generate-domain-pages.py      writes domains/<id>/index.html from registry.json
  test-plural.html              browser test for plural() and search normalisation
design/                         reference mockups (documentation only, not served)
```

## Adding an applet

1. Copy `applets/_template/` to `applets/<applet-id>/` and fill in the `TODO`s
   (domain colour on `<body>`, breadcrumbs, sigil path, applet id in `app.js`).
2. Add a `thumb.svg` (viewBox `0 0 220 110`, strokes in the domain colour, gold
   `#e2c98f` / `#cfae6a` for the "theory" accent) to the applet directory.
3. Add an entry to `applets/registry.json`:
   `id`, `domain`, `title`, `description`, `status` (`"live"` or `"soon"`),
   `addedAt` (ISO date, `null` for `soon`), optional `tags` (search keywords),
   `notesUrl` (or `null`). `thumbnail` defaults to `applets/<id>/thumb.svg`.

No page needs to be edited by hand — the home page and domain galleries render from the
registry. The optional "Z marginesu" card in the template shows a "Powiązane notatki"
link only when `notesUrl` is set.

## Adding a domain

1. Add an entry to `domains` in `applets/registry.json`
   (`order`, `label`, `shortLabel`, `color`, `description`).
2. Add `assets/domains/<id>/sigil.svg` (viewBox `0 0 36 36`) and
   `assets/domains/<id>/cover.svg` (viewBox `0 0 220 110`).
3. Run `python scripts/generate-domain-pages.py` (standard library only) and commit the
   generated `domains/<id>/index.html`.

## Design tokens (`shared/theme.css`)

Components use custom properties only. The site is dark-only (`color-scheme: dark`).

- **Surfaces:** `--bg`, `--surface` (cards, panels), `--surface-raised` (featured card),
  `--surface-sunken` (thumbnails, charts), `--surface-placeholder`, `--surface-hover`.
- **Borders:** `--border`, `--border-subtle`, `--border-card`, `--border-inset`,
  `--border-strong`.
- **Text:** `--text`, `--text-strong`, `--text-muted`, `--text-subtle`, `--text-dim`
  ("soon" card titles), `--text-faint`, `--text-placeholder` (disabled controls only),
  `--text-on-accent`.
- **Accents:** `--gold` (primary accent), `--link`, `--link-hover`, and `--domain`, set
  inline per section or card (`style="--domain: #98a6e8"`) with derived
  `--domain-soft` / `--domain-medium` (via `color-mix()`).
- **Typography:** `--font-display` (Cormorant Garamond), `--font-body` (Alegreya Sans),
  `--font-mono` (JetBrains Mono), plus a fluid size scale (`--fs-*`).
- **Shape:** `--radius-thumb` 6, `--radius-button` 8, `--radius-field` 10,
  `--radius-card` 14, `--radius-tile` 16, `--radius-pill` 999.

Charts pick up the same palette through `plotlyTheme(domainColor)` in
`shared/utilities.js`, which reads the tokens with `getComputedStyle`.

## Notes & license

These applets are my own work and may contain mistakes. Feel free to use them for
learning and to redistribute with attribution — commercial use is not permitted.

## Related

- Theory notes: <https://jakubmikolajczak.pl/Notatki/>
- Main site: <https://jakubmikolajczak.pl>
