// Wspólne funkcje pomocnicze dla apletów Interactive Explorations.

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value, digits = 3) {
  return Number(value).toFixed(digits);
}

export function bindRangeInput(inputEl, valueEl, onChange) {
  const update = () => {
    const value = Number(inputEl.value);
    if (valueEl) valueEl.textContent = String(value);
    onChange(value);
  };
  inputEl.addEventListener("input", update);
  update();
  return update;
}

export function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Teksty

/**
 * Polska odmiana rzeczownika po liczebniku.
 * plural(1, "aplet", "aplety", "apletów") → "aplet"; 2–4 (poza 12–14) → few; reszta → many.
 */
export function plural(n, one, few, many) {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  const lastDigit = abs % 10;
  const lastTwo = abs % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
}

/** Tekst do porównań w wyszukiwarce: małe litery, bez znaków diakrytycznych (także ł → l). */
export function normalizeText(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

/** Czy zapytanie pasuje do któregokolwiek z pól. Wszystkie słowa zapytania muszą wystąpić. */
export function matchesQuery(query, fields) {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeText(fields.flat().join(" "));
  return words.every((word) => haystack.includes(word));
}

export function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

// ---------------------------------------------------------------------------
// Motyw

export function cssVar(name, el = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/** Kolor z przezroczystością (0–1) — dla Plotly, który nie rozumie color-mix(). */
export function withAlpha(hex, alpha) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Wspólny wygląd wykresów Plotly. Kolory są czytane z tokenów w theme.css.
 * Zwraca { layout, config, histogram, curve } — dwa ostatnie to fragmenty
 * trace'ów do rozsmarowania: { type: "histogram", ...theme.histogram, x }.
 */
export function plotlyTheme(domainColor) {
  const domain = domainColor || cssVar("--domain") || cssVar("--gold");
  const gold = cssVar("--gold");
  const subtle = cssVar("--text-subtle");
  const gridColor = cssVar("--border-subtle");
  const axisColor = cssVar("--border-strong");
  const bodyFont = cssVar("--font-body");
  const monoFont = cssVar("--font-mono");

  const axis = {
    gridcolor: gridColor,
    linecolor: axisColor,
    zerolinecolor: axisColor,
    tickcolor: axisColor,
    tickfont: { family: monoFont, size: 12, color: subtle },
    title: { font: { family: bodyFont, size: 14, color: subtle } },
    automargin: true,
  };

  return {
    layout: {
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: bodyFont, color: subtle, size: 14 },
      margin: { t: 12, r: 12, b: 48, l: 56 },
      xaxis: { ...axis },
      yaxis: { ...axis },
      showlegend: false,
      bargap: 0.04,
      hoverlabel: { font: { family: monoFont } },
    },
    config: { displayModeBar: false, responsive: true },
    histogram: {
      marker: { color: withAlpha(domain, 0.25), line: { color: domain, width: 1 } },
    },
    curve: {
      line: { color: gold, width: 2.2 },
    },
  };
}
