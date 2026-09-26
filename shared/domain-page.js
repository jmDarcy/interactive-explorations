// Galeria jednej dziedziny: pasek dziedzin, nagłówek, filtry, siatka/lista, stronicowanie.
// Cały stan filtrów żyje w URL: ?q=&status=&sort=&view=&page=

import { DOMAINS, DOMAIN_LIST, appletsInDomain, isLive } from "../applets/registry.js";
import { escapeHtml } from "./utilities.js";
import {
  ICONS,
  appletMatches,
  appletWord,
  byNewest,
  byTitle,
  cardMarkup,
  coverImg,
  domainUrl,
  liveWord,
  rowMarkup,
  sigilImg,
  siteUrl,
} from "./components.js";

const PAGE_SIZE = 24;
const STATUSES = { all: "Wszystkie", live: "Dostępne", soon: "Wkrótce" };
const SORTS = { newest: "Najnowsze", alpha: "Alfabetycznie" };
const VIEWS = ["grid", "list"];
const DEFAULTS = { q: "", status: "all", sort: "newest", view: "grid", page: 1 };

function readState() {
  const params = new URLSearchParams(location.search);
  const pick = (key, allowed) => (allowed.includes(params.get(key)) ? params.get(key) : DEFAULTS[key]);
  const page = Number.parseInt(params.get("page"), 10);
  return {
    q: params.get("q") ?? "",
    status: pick("status", Object.keys(STATUSES)),
    sort: pick("sort", Object.keys(SORTS)),
    view: pick("view", VIEWS),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function writeState(state) {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(state)) {
    if (String(value) === String(DEFAULTS[key]) || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  history.replaceState(null, "", url);
}

function tabsMarkup(activeId) {
  const tabs = DOMAIN_LIST.map((d) => `
    <a href="${domainUrl(d.id)}" style="--domain: ${d.color}"${d.id === activeId ? ' aria-current="page"' : ""}>
      <span class="diamond" aria-hidden="true"></span>${escapeHtml(d.shortLabel)}
    </a>`).join("");
  return `
    <nav class="domain-tabs" aria-label="Dziedziny">
      <div class="page-shell">
        ${tabs}
        <a class="all-link" href="${siteUrl("./")}">Wszystkie →</a>
      </div>
    </nav>
  `;
}

function headerMarkup(id, domain, applets) {
  const live = applets.filter(isLive).length;
  return `
    <nav class="breadcrumbs" aria-label="Okruszki">
      <ol>
        <li><a href="${siteUrl("./")}">Interactive Explorations</a></li>
        <li><span aria-current="page">${escapeHtml(domain.label)}</span></li>
      </ol>
    </nav>
    <section class="domain-header">
      <div class="sigil-ring">${sigilImg(id, 60)}</div>
      <div class="domain-header__text">
        <h1>${escapeHtml(domain.label)}</h1>
        <p>${escapeHtml(domain.description)}</p>
      </div>
      <div class="domain-header__count">
        <span class="big">${applets.length}</span>
        <span class="counter">${appletWord(applets.length)} · ${live} ${liveWord(live)}</span>
      </div>
    </section>
  `;
}

function toolbarMarkup(domain) {
  const segments = Object.entries(STATUSES)
    .map(([key, label]) => `<button type="button" data-status="${key}" aria-pressed="false">${label}</button>`)
    .join("");
  const sorts = Object.entries(SORTS)
    .map(([key, label]) => `<option value="${key}">${label}</option>`)
    .join("");
  return `
    <section class="toolbar" aria-label="Filtry">
      <div class="search-field" role="search">
        ${ICONS.search}
        <input id="domain-q" type="search" autocomplete="off"
          aria-label="Szukaj w tej dziedzinie"
          placeholder="Szukaj w ${escapeHtml(domain.label)}…" />
      </div>
      <div class="segmented" role="group" aria-label="Status">${segments}</div>
      <select class="select" id="domain-sort" aria-label="Sortowanie">${sorts}</select>
      <div class="view-toggle" role="group" aria-label="Widok">
        <button type="button" class="icon-button" data-view="grid" aria-label="Widok siatki" aria-pressed="true">${ICONS.grid}</button>
        <button type="button" class="icon-button" data-view="list" aria-label="Widok listy" aria-pressed="false">${ICONS.list}</button>
      </div>
    </section>
  `;
}

function emptyDomainMarkup(id) {
  return `
    <section class="empty-state">
      <div class="cover-frame">${coverImg(id, 220, 110)}</div>
      <p>Pierwsze aplety w tej dziedzinie są w przygotowaniu.</p>
      <a href="${siteUrl("./")}">← Wróć do wszystkich dziedzin</a>
    </section>
  `;
}

function paginationMarkup(page, pageCount, from, to, total) {
  const summary = total
    ? `Pokazano ${from}–${to} z ${total}`
    : "Pokazano 0 z 0";
  let buttons = "";
  if (pageCount > 1) {
    const numbers = Array.from({ length: pageCount }, (_, i) => i + 1)
      .map((n) => `<button type="button" class="page-button" data-page="${n}"${n === page ? ' aria-current="page"' : ""} aria-label="Strona ${n}">${n}</button>`)
      .join("");
    buttons = `
      <div class="pagination__buttons">
        <button type="button" class="button" data-page="${page - 1}"${page <= 1 ? " disabled" : ""}>← Poprzednia</button>
        ${numbers}
        <button type="button" class="button" data-page="${page + 1}"${page >= pageCount ? " disabled" : ""}>Następna →</button>
      </div>
    `;
  }
  return `<span class="counter" role="status">${summary}</span>${buttons}`;
}

export function renderDomainPage(root, id) {
  const domain = DOMAINS[id];
  if (!domain) {
    root.innerHTML = `<div class="page-shell domain-main"><p class="empty-note">Nieznana dziedzina.</p></div>`;
    return;
  }

  document.title = `${domain.label} — Interactive Explorations`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", domain.description);

  const applets = appletsInDomain(id);
  root.style.setProperty("--domain", domain.color);

  root.innerHTML = `
    ${tabsMarkup(id)}
    <div class="page-shell domain-main">
      ${headerMarkup(id, domain, applets)}
      ${applets.length ? toolbarMarkup(domain) : emptyDomainMarkup(id)}
      <div id="domain-results" hidden></div>
      <nav class="pagination" id="domain-pagination" aria-label="Stronicowanie" hidden></nav>
    </div>
  `;

  const tabStrip = root.querySelector(".domain-tabs .page-shell");
  const activeTab = tabStrip.querySelector('[aria-current="page"]');
  if (activeTab && tabStrip.scrollWidth > tabStrip.clientWidth) {
    tabStrip.scrollLeft = activeTab.offsetLeft - (tabStrip.clientWidth - activeTab.offsetWidth) / 2;
  }

  if (!applets.length) return;

  const state = readState();
  const input = root.querySelector("#domain-q");
  const sortSelect = root.querySelector("#domain-sort");
  const results = root.querySelector("#domain-results");
  const pagination = root.querySelector("#domain-pagination");
  const statusButtons = [...root.querySelectorAll("[data-status]")];
  const viewButtons = [...root.querySelectorAll("[data-view]")];

  input.value = state.q;

  const render = () => {
    statusButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.status === state.status)));
    viewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
    sortSelect.value = state.sort;

    const filtered = applets
      .filter((a) => state.status === "all" || (state.status === "live" ? isLive(a) : !isLive(a)))
      .filter((a) => appletMatches(a, state.q))
      .sort(state.sort === "alpha" ? byTitle : byNewest);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, pageCount);
    const start = (state.page - 1) * PAGE_SIZE;
    const visible = filtered.slice(start, start + PAGE_SIZE);
    writeState(state);

    results.hidden = false;
    if (!filtered.length) {
      results.innerHTML = `
        <section class="empty-state">
          <p>Żaden aplet nie pasuje do wybranych filtrów.</p>
          <button type="button" class="button" data-clear>Wyczyść filtry</button>
        </section>
      `;
    } else if (state.view === "list") {
      results.innerHTML = `<ul class="row-list">${visible.map((a) => rowMarkup(a, { showDomain: false, showDesc: true })).join("")}</ul>`;
    } else {
      results.innerHTML = `<ul class="card-grid">${visible.map(cardMarkup).join("")}</ul>`;
    }

    pagination.hidden = false;
    pagination.innerHTML = paginationMarkup(
      state.page, pageCount, start + 1, start + visible.length, filtered.length,
    );
  };

  input.addEventListener("input", () => {
    state.q = input.value;
    state.page = 1;
    render();
  });
  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    state.page = 1;
    render();
  });
  statusButtons.forEach((b) => b.addEventListener("click", () => {
    state.status = b.dataset.status;
    state.page = 1;
    render();
  }));
  viewButtons.forEach((b) => b.addEventListener("click", () => {
    state.view = b.dataset.view;
    render();
  }));
  results.addEventListener("click", (event) => {
    if (!event.target.closest("[data-clear]")) return;
    Object.assign(state, DEFAULTS);
    input.value = "";
    render();
    input.focus();
  });
  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button || button.disabled) return;
    state.page = Number(button.dataset.page);
    render();
    root.querySelector(".toolbar").scrollIntoView({ block: "start" });
  });

  render();
}
