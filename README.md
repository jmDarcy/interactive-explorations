# Interactive Explorations

Zbiór samodzielnych, interaktywnych demonstracji z zakresu probabilistyki, statystyki,
uczenia maszynowego i matematyki aktuarialnej. Uzupełnia notatki teoretyczne publikowane
na [jakubmikolajczak.pl](https://jakubmikolajczak.pl) — tam jest warstwa wykładowa, tutaj
warstwa eksperymentalna: zmieniasz parametry, obserwujesz wykresy, sprawdzasz intuicje.

Żywa strona: <https://jmDarcy.github.io/interactive-explorations/>

## Struktura repozytorium

```text
interactive-explorations/
├── index.html              # galeria — renderuje się z applets/registry.js, nie edytuj ręcznie
├── shared/                  # wspólny motyw, layout, funkcje JS i renderer galerii
│   ├── theme.css
│   ├── layout.css
│   ├── utilities.js
│   ├── math-formatting.js
│   └── gallery.js
└── applets/
    ├── registry.js          # JEDNO źródło prawdy: lista wszystkich apletów i ich metadane
    ├── _template/           # szkielet do skopiowania przy nowym aplecie
    ├── central-limit-theorem/
    └── <kolejne-aplety>/
```

Każdy aplet ma własny katalog w `applets/` z `index.html`, `app.js` i `app.css` i korzysta
ze wspólnego motywu z `shared/`. Galeria na stronie głównej **nie jest edytowana ręcznie** —
generuje się w przeglądarce z listy w `applets/registry.js`, więc przy wielu dziesiątkach
apletów nie ma ryzyka rozjechania się kafelków z rzeczywistą zawartością.

## Praca lokalna

Nie otwieraj `index.html` przez podwójne kliknięcie — moduły JS wymagają serwera.

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000`.

## Dodawanie nowego apletu

1. Skopiuj `applets/_template/` do `applets/<nazwa-apletu>/` (kebab-case, np. `markov-chain-convergence`).
2. Wypełnij `index.html`, `app.js`, `app.css` — szablon ma już podłączony wspólny motyw
   i trzyma się układu: tytuł i cel → wyjaśnienie matematyczne → panel sterowania →
   wizualizacja → wyniki liczbowe → interpretacja → link do notatek → link do kodu →
   powrót do galerii.
3. Dodaj jeden wpis w `applets/registry.js` (id, domena, tytuł, opis, `status: "live"`).
   To wystarczy, żeby aplet pojawił się w galerii — **nie trzeba edytować `index.html`**.
4. Jeśli aplet wprowadza nową domenę tematyczną, dodaj ją do `DOMAINS` w `registry.js`
   z własnym kolorem HEX — galeria automatycznie utworzy dla niej nową sekcję.
5. Sprawdź lokalnie (`python -m http.server 8000`) i dopiero wtedy commituj.

## Licencja treści

Kod jest dostępny do przeglądania i nauki. Treść merytoryczna (opisy, interpretacje)
podlega tym samym zasadom co notatki na jakubmikolajczak.pl: można korzystać do nauki
i cytować z podaniem autorstwa, nie wolno wykorzystywać komercyjnie.
