# Interactive Explorations

Zbiór samodzielnych, interaktywnych demonstracji z zakresu probabilistyki, statystyki,
uczenia maszynowego i matematyki aktuarialnej. Uzupełnia notatki teoretyczne publikowane
na [jakubmikolajczak.pl](https://jakubmikolajczak.pl) — tam jest warstwa wykładowa, tutaj
warstwa eksperymentalna: zmieniasz parametry, obserwujesz wykresy, sprawdzasz intuicje.

Żywa strona: <https://jmDarcy.github.io/interactive-explorations/>

## Struktura repozytorium

```text
interactive-explorations/
├── index.html          # galeria
├── shared/              # wspólny motyw, layout i pomocnicze funkcje JS
└── applets/
    └── central-limit-theorem/
```

Każdy aplet ma własny katalog w `applets/` z `index.html`, `app.js` i `app.css` i korzysta
ze wspólnego motywu z `shared/`.

## Praca lokalna

Nie otwieraj `index.html` przez podwójne kliknięcie — moduły JS wymagają serwera.

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000`.

## Dodawanie nowego apletu

1. Utwórz katalog `applets/<nazwa-apletu>/` z `index.html`, `app.js`, `app.css`.
2. Podłącz `../../shared/theme.css` i `../../shared/layout.css`.
3. Trzymaj się układu: tytuł i cel → wyjaśnienie matematyczne → panel sterowania →
   wizualizacja → wyniki liczbowe → interpretacja → link do notatek → link do kodu →
   powrót do galerii.
4. Dodaj kafelek w `index.html` galerii, w odpowiedniej sekcji tematycznej.

## Licencja treści

Kod jest dostępny do przeglądania i nauki. Treść merytoryczna (opisy, interpretacje)
podlega tym samym zasadom co notatki na jakubmikolajczak.pl: można korzystać do nauki
i cytować z podaniem autorstwa, nie wolno wykorzystywać komercyjnie.
