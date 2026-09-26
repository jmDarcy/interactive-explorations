#!/usr/bin/env python3
"""Generuje powłoki domains/<id>/index.html z applets/registry.json.

Użycie (z katalogu głównego repozytorium):

    python scripts/generate-domain-pages.py

Każda powłoka to minimalny HTML (head, header, <main id="domain-root">, footer),
który importuje shared/domain-page.js i wywołuje renderDomainPage(root, "<id>").
Tytuł i meta description są wpisane statycznie, żeby działały bez JavaScriptu
(np. w podglądach linków). Skrypt używa wyłącznie biblioteki standardowej.
Katalogi dziedzin, których nie ma już w rejestrze, są zgłaszane, ale nie usuwane.
"""

from __future__ import annotations

import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGISTRY = ROOT / "applets" / "registry.json"
DOMAINS_DIR = ROOT / "domains"

TEMPLATE = """<!doctype html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&amp;family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" />
  <link rel="stylesheet" href="../../shared/theme.css" />
  <link rel="stylesheet" href="../../shared/layout.css" />
</head>
<body>
  <!-- Plik wygenerowany przez scripts/generate-domain-pages.py — nie edytuj ręcznie. -->
  <header class="site-header">
    <div class="page-shell">
      <a class="brand" href="../../">Interactive Explorations</a>
      <nav aria-label="Główna">
        <a href="https://jakubmikolajczak.pl/Notatki/">Notatki</a>
        <a href="https://github.com/jmDarcy/interactive-explorations">Kod źródłowy</a>
      </nav>
    </div>
  </header>

  <main id="domain-root" style="--domain: {color}"></main>

  <footer class="site-footer">
    <div class="page-shell">
      <a href="../../">← Wszystkie dziedziny</a>
      <span class="copyright">© 2026 Jakub Mikołajczak</span>
    </div>
  </footer>

  <script type="module">
    import {{ renderDomainPage }} from "../../shared/domain-page.js";
    renderDomainPage(document.querySelector("#domain-root"), {domain_id});
  </script>
</body>
</html>
"""


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(errors="replace")  # konsola Windows bez UTF-8 nie wysypie się na „ł”

    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    domains: dict[str, dict] = registry["domains"]

    for domain_id, domain in sorted(domains.items(), key=lambda item: item[1]["order"]):
        for asset in ("sigil.svg", "cover.svg"):
            if not (ROOT / "assets" / "domains" / domain_id / asset).exists():
                print(f"UWAGA: brak assets/domains/{domain_id}/{asset}", file=sys.stderr)

        page = TEMPLATE.format(
            title=html.escape(f"{domain['label']} — Interactive Explorations"),
            description=html.escape(domain["description"]),
            color=html.escape(domain["color"]),
            domain_id=json.dumps(domain_id),
        )
        target = DOMAINS_DIR / domain_id / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding="utf-8", newline="\n")
        print(f"zapisano {target.relative_to(ROOT).as_posix()}")

    if DOMAINS_DIR.exists():
        for stale in sorted(p.name for p in DOMAINS_DIR.iterdir() if p.is_dir() and p.name not in domains):
            print(f"UWAGA: domains/{stale}/ nie ma w rejestrze (nie usunięto)", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
