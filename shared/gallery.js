import { DOMAINS, APPLETS } from "../applets/registry.js";

function tileMarkup(applet) {
  if (applet.status !== "live") {
    return `
      <article class="applet-tile" aria-disabled="true">
        <span class="domain-tag">wkrótce</span>
        <h3>${applet.title}</h3>
        <p>${applet.description}</p>
      </article>
    `;
  }
  return `
    <a class="applet-tile" href="applets/${applet.id}/">
      <span class="domain-tag">live</span>
      <h3>${applet.title}</h3>
      <p>${applet.description}</p>
      <div class="tile-links"><span>Otwórz aplet →</span></div>
    </a>
  `;
}

export function renderGallery(root) {
  const byDomain = new Map(Object.keys(DOMAINS).map((id) => [id, []]));
  for (const applet of APPLETS) {
    if (!byDomain.has(applet.domain)) byDomain.set(applet.domain, []);
    byDomain.get(applet.domain).push(applet);
  }

  root.innerHTML = [...byDomain.entries()]
    .filter(([, applets]) => applets.length > 0)
    .map(([domainId, applets]) => {
      const domain = DOMAINS[domainId];
      const tiles = applets.map(tileMarkup).join("");
      return `
        <section class="domain-section" style="--domain-color:${domain.color}">
          <h2>${domain.label}</h2>
          <div class="tile-grid">${tiles}</div>
        </section>
      `;
    })
    .join("");
}
