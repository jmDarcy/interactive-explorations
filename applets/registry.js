// Pojedyncze źródło prawdy dla galerii: dane żyją w registry.json (czyta je też
// scripts/generate-domain-pages.py), a ten moduł tylko je ładuje i wzbogaca.
//
// Dodanie apletu = katalog na bazie applets/_template/ + jeden wpis w registry.json.
// Dodanie dziedziny = wpis w "domains", sigil i okładka w assets/domains/<id>/,
// potem `python scripts/generate-domain-pages.py`.
//
// JSON ładujemy przez fetch + top-level await (a nie `import ... with { type: "json" }`),
// bo działa we wszystkich przeglądarkach obsługujących moduły ES, bez względu na
// wsparcie atrybutów importu.

const registryUrl = new URL("./registry.json", import.meta.url);
const response = await fetch(registryUrl);
if (!response.ok) throw new Error(`Nie udało się wczytać rejestru (${response.status})`);
const data = await response.json();

// Adres katalogu głównego strony, liczony względem tego modułu, żeby linki
// działały także pod prefiksem /interactive-explorations/ na GitHub Pages.
export const SITE_ROOT = new URL("../", import.meta.url);

export const DOMAINS = data.domains;

export const APPLETS = data.applets.map((applet) => ({
  tags: [],
  addedAt: null,
  notesUrl: null,
  thumbnail: `applets/${applet.id}/thumb.svg`,
  ...applet,
}));

/** Dziedziny posortowane według pola `order`, jako tablica z polem `id`. */
export const DOMAIN_LIST = Object.entries(DOMAINS)
  .map(([id, domain]) => ({ id, ...domain }))
  .sort((a, b) => a.order - b.order);

export function domainAssets(id) {
  return {
    sigil: `assets/domains/${id}/sigil.svg`,
    cover: `assets/domains/${id}/cover.svg`,
  };
}

export function appletsInDomain(id) {
  return APPLETS.filter((applet) => applet.domain === id);
}

export function isLive(applet) {
  return applet.status === "live";
}
