// Strona główna: licznik zbiorczy, kafle dziedzin, „Ostatnio dodane” i wyszukiwarka globalna.

import { APPLETS, DOMAIN_LIST, appletsInDomain, isLive } from "../applets/registry.js";
import { escapeHtml } from "./utilities.js";
import {
  appletMatches,
  appletWord,
  byNewest,
  coverImg,
  domainCounterMarkup,
  domainUrl,
  domainWord,
  liveWord,
  rowMarkup,
  sigilImg,
} from "./components.js";

function tileMarkup(domain) {
  const applets = appletsInDomain(domain.id);
  const featured = applets.some(isLive);
  return `
    <a class="domain-tile${featured ? " is-featured" : ""}" href="${domainUrl(domain.id)}" style="--domain: ${domain.color}">
      <div class="domain-tile__inner">
        <div class="domain-tile__top">
          ${sigilImg(domain.id, 40)}
          <span class="counter">${domainCounterMarkup(applets)}</span>
        </div>
        <h2>${escapeHtml(domain.label)}</h2>
        <p>${escapeHtml(domain.description)}</p>
        <div class="domain-tile__bottom">
          <div class="cover-frame">${coverImg(domain.id, 168, 84)}</div>
          <span class="browse-link">Przeglądaj →</span>
        </div>
      </div>
    </a>
  `;
}

export function renderHome({ counter, grid, recent, recentList, results, input }) {
  const total = APPLETS.length;
  const live = APPLETS.filter(isLive).length;
  const domains = DOMAIN_LIST.length;
  counter.textContent =
    `${total} ${appletWord(total)} · ${domains} ${domainWord(domains)} · ${live} ${liveWord(live)}`;

  grid.innerHTML = DOMAIN_LIST.map(tileMarkup).join("");

  const newest = APPLETS.filter((a) => isLive(a) && a.addedAt).sort(byNewest).slice(0, 3);
  if (newest.length > 0) {
    recentList.innerHTML = newest.map((a) => rowMarkup(a)).join("");
    recent.hidden = false;
  }

  const update = () => {
    const query = input.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);

    if (!query) {
      results.hidden = true;
      grid.hidden = false;
      return;
    }

    const found = APPLETS.filter((a) => appletMatches(a, query)).sort(byNewest);
    results.hidden = false;
    grid.hidden = true;
    results.innerHTML = `
      <div class="section-head">
        <h2>Wyniki wyszukiwania</h2>
        <span class="counter" role="status">${found.length} ${appletWord(found.length)}</span>
      </div>
      ${found.length
        ? `<ul class="row-list">${found.map((a) => rowMarkup(a, { showDesc: true })).join("")}</ul>`
        : `<p class="empty-note">Nic nie pasuje do „${escapeHtml(query)}”. Spróbuj innego słowa albo przejrzyj dziedziny.</p>`}
    `;
  };

  input.value = new URLSearchParams(location.search).get("q") ?? "";
  input.addEventListener("input", update);
  update();
}
