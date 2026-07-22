# Interactive Explorations

Hands-on, interactive demonstrations in probability, statistics, machine learning, and
actuarial mathematics. Built to complement the theoretical notes on
[jakubmikolajczak.pl](https://jakubmikolajczak.pl) — the notes are the lecture layer,
this project is the experimental one: change a parameter, watch the chart update, and
check your intuition for yourself.

**Live gallery:** <https://jmdarcy.github.io/interactive-explorations/>

## What this is

Each applet is a small, self-contained demonstration built with plain HTML, CSS, and
JavaScript (Plotly.js for charts, KaTeX for formulas). Nothing to install and nothing
to log into — everything runs directly in your browser.

## Applets

- **[Central Limit Theorem](https://jmdarcy.github.io/interactive-explorations/applets/central-limit-theorem/)**
  — watch the distribution of a sample mean approach a normal distribution as the
  sample size grows, for several different underlying distributions.

More applets — covering Markov chains, MCMC, decision boundaries, loss distributions,
and related topics — are in progress. The gallery always reflects the current state.

## Running it locally

```bash
git clone https://github.com/jmDarcy/interactive-explorations.git
cd interactive-explorations
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly by double-clicking it
won't work, since the gallery and applets load as JavaScript modules.

## Notes & license

These applets are my own work and may contain mistakes. Feel free to use them for
learning and to redistribute with attribution — commercial use is not permitted.

## Related

- Theory notes: <https://jakubmikolajczak.pl/Notatki/>
- Main site: <https://jakubmikolajczak.pl>
