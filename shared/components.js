// Wspólne fragmenty markupu dla strony głównej i galerii dziedzin.

import { DOMAINS, SITE_ROOT, domainAssets, isLive } from "../applets/registry.js";
import { escapeHtml, matchesQuery, plural } from "./utilities.js";

/** Adres względem katalogu głównego strony (działa pod dowolnym prefiksem ścieżki). */
export function siteUrl(path) {
  return new URL(path, SITE_ROOT).href;
}

export const appletUrl = (applet) => siteUrl(`applets/${applet.id}/`);
export const domainUrl = (id) => siteUrl(`domains/${id}/`);

export const ICONS = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20 L16 16"></path></svg>`,
  grid: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`,
  list: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 6 H20 M4 12 H20 M4 18 H20"></path></svg>`,
};

export const appletWord = (n) => plural(n, "aplet", "aplety", "apletów");
export const liveWord = (n) => plural(n, "dostępny", "dostępne", "dostępnych");
export const domainWord = (n) => plural(n, "dziedzina", "dziedziny", "dziedzin");

/** Pola brane pod uwagę przez wyszukiwarki. */
export function appletMatches(applet, query) {
  const domain = DOMAINS[applet.domain];
  return matchesQuery(query, [
    applet.title,
    applet.description,
    applet.tags ?? [],
    domain?.label ?? "",
    domain?.shortLabel ?? "",
  ]);
}

/** Najpierw najnowsze wg addedAt; aplety bez daty na końcu, alfabetycznie. */
export function byNewest(a, b) {
  if (a.addedAt && b.addedAt) return b.addedAt.localeCompare(a.addedAt) || byTitle(a, b);
  if (a.addedAt) return -1;
  if (b.addedAt) return 1;
  return byTitle(a, b);
}

export function byTitle(a, b) {
  return a.title.localeCompare(b.title, "pl");
}

function thumbImg(applet, width, height) {
  return `<img src="${siteUrl(applet.thumbnail)}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async">`;
}

/**
 * Wiersz apletu (Ostatnio dodane, wyniki wyszukiwania, widok listy).
 * showDomain — etykieta dziedziny nad tytułem; showDesc — jednoliniowy opis.
 */
export function rowMarkup(applet, { showDomain = true, showDesc = false } = {}) {
  const domain = DOMAINS[applet.domain];
  const live = isLive(applet);
  const inner = `
    <div class="row-thumb">${thumbImg(applet, 124, 62)}</div>
    <div class="row-body">
      ${showDomain ? `<span class="row-domain">${escapeHtml(domain.label)}</span>` : ""}
      <span class="row-title">${escapeHtml(applet.title)}</span>
      ${showDesc ? `<span class="row-desc">${escapeHtml(applet.description)}</span>` : ""}
    </div>
    ${live
      ? `<span class="row-action">Otwórz aplet →</span>`
      : `<span class="status-pill soon">wkrótce</span>`}
  `;
  const style = `style="--domain: ${domain.color}"`;
  return live
    ? `<li><a class="applet-row" href="${appletUrl(applet)}" ${style}>${inner}</a></li>`
    : `<li><article class="applet-row is-soon" ${style} aria-label="${escapeHtml(applet.title)} — wkrótce">${inner}</article></li>`;
}

/** Karta apletu w siatce galerii dziedziny. */
export function cardMarkup(applet) {
  const domain = DOMAINS[applet.domain];
  const live = isLive(applet);
  const inner = `
    <div class="applet-card__inner">
      <div class="card-thumb">${thumbImg(applet, 220, 110)}</div>
      <div class="card-body">
        <span class="status-pill ${live ? "live" : "soon"}">${live ? "dostępny" : "wkrótce"}</span>
        <h3>${escapeHtml(applet.title)}</h3>
        <p>${escapeHtml(applet.description)}</p>
        ${live ? `<span class="card-action">Otwórz aplet →</span>` : ""}
      </div>
    </div>
  `;
  const style = `style="--domain: ${domain.color}"`;
  return live
    ? `<li><a class="applet-card" href="${appletUrl(applet)}" ${style}>${inner}</a></li>`
    : `<li><article class="applet-card is-soon" ${style}>${inner}</article></li>`;
}

/** Licznik na kaflu dziedziny: „w przygotowaniu” / „N aplety · wkrótce” / „N aplety · K dostępny”. */
export function domainCounterMarkup(applets) {
  const total = applets.length;
  const live = applets.filter(isLive).length;
  if (total === 0) return "w przygotowaniu";
  if (live === 0) return `${total} ${appletWord(total)} · wkrótce`;
  return `${total} ${appletWord(total)} · <span class="accent">${live} ${liveWord(live)}</span>`;
}

export function sigilImg(id, size) {
  return `<img src="${siteUrl(domainAssets(id).sigil)}" alt="" width="${size}" height="${size}">`;
}

export function coverImg(id, width, height) {
  return `<img src="${siteUrl(domainAssets(id).cover)}" alt="" width="${width}" height="${height}">`;
}
