# Interactive Explorations

Zbiór samodzielnych, interaktywnych demonstracji z zakresu probabilistyki, statystyki, matematyki, uczenia maszynowego, aktuariatu i metod obliczeniowych.

Projekt ma uzupełniać notatki teoretyczne publikowane na stronie [jakubmikolajczak.pl](https://jakubmikolajczak.pl). Notatki pozostają warstwą formalną i wykładową, natomiast **Interactive Explorations** ma być warstwą eksperymentalną: użytkownik zmienia parametry, obserwuje wykresy, uruchamia symulacje i sprawdza intuicje matematyczne.

Inspiracją organizacyjną jest galeria interaktywnych apletów Bartosza Naskręckiego:

- <https://bnaskrecki.faculty.wmi.amu.edu.pl/nnets/applets/index.html>
- przykład pojedynczego apletu: <https://bnaskrecki.faculty.wmi.amu.edu.pl/nnets/applets/decision-boundary.html>

Projekt nie powinien kopiować kodu ani identycznego wyglądu tej strony. Wzorzec dotyczy przede wszystkim architektury informacji: **galeria tematyczna → kafelek → samodzielna demonstracja**.

---

## 1. Decyzja projektowa

### Nazwa zakładki

**Interactive Explorations**

Nazwa jest wystarczająco szeroka, aby obejmować nie tylko symulacje losowe, lecz także:

- wizualizacje twierdzeń i algorytmów,
- kalkulatory,
- eksperymenty numeryczne,
- interaktywne dowody i konstrukcje,
- demonstracje modeli statystycznych i aktuarialnych,
- proste laboratoria uczenia maszynowego.

---

## 2. Docelowa architektura

Najprostszy i najbardziej spójny wariant:

```text
jakubmikolajczak.pl
└── pozycja menu „Interactive Explorations”
    └── link do galerii na GitHub Pages

https://<github-username>.github.io/interactive-explorations/
├── galeria wszystkich apletów
└── applets/
    ├── markov-chain-convergence/
    ├── mcmc-metropolis-hastings/
    ├── central-limit-theorem/
    ├── loss-distributions/
    └── decision-boundary/
```

Przykładowe adresy:

```text
https://<github-username>.github.io/interactive-explorations/
https://<github-username>.github.io/interactive-explorations/applets/markov-chain-convergence/
https://<github-username>.github.io/interactive-explorations/applets/central-limit-theorem/
```

### Ważne rozróżnienie

Nie trzeba tworzyć osobnego repozytorium dla każdego apletu. Lepszy będzie **jeden projekt GitHub Pages**, w którym:

- `index.html` jest galerią,
- każdy aplet znajduje się w osobnym katalogu,
- wszystkie aplety korzystają ze wspólnego motywu i komponentów,
- jeden link z WordPressa prowadzi do całej galerii,
- bezpośrednie linki do apletów mogą być dodatkowo umieszczane przy odpowiednich notatkach.

---

## 3. Czy GitHub Pages jest właściwym wyborem?

### Tak — dla tego projektu jest wyborem adekwatnym

GitHub Pages publikuje statyczne pliki HTML, CSS i JavaScript bez potrzeby utrzymywania własnego serwera. Jest to dokładnie model potrzebny do apletów, które wykonują obliczenia w przeglądarce użytkownika.

GitHub Pages jest odpowiedni, gdy aplikacja:

- działa całkowicie po stronie przeglądarki,
- nie wymaga bazy danych,
- nie wymaga serwerowego Pythona, R, Flask, Django ani Node.js,
- nie przechowuje prywatnych danych użytkownika,
- nie potrzebuje tajnych kluczy API,
- może zostać opublikowana jako pliki statyczne.

Dla symulacji łańcuchów Markowa, metod Monte Carlo, rozkładów prawdopodobieństwa, regresji, prostych modeli ML, optymalizacji czy matematyki finansowej te warunki zwykle są spełnione.

### Główne zalety

1. **Brak osobnego hostingu aplikacji** — kod i publikacja znajdują się w jednym repozytorium.
2. **Darmowe publiczne wdrożenie** dla typowego projektu statycznego.
3. **Wersjonowanie w Git** — każda zmiana jest rejestrowana i może zostać cofnięta.
4. **Stałe adresy URL** dla całej galerii i pojedynczych demonstracji.
5. **Automatyczna aktualizacja** po wysłaniu zmian do repozytorium.
6. **Łatwe udostępnianie kodu źródłowego** jako części portfolio.
7. **Brak konfliktów z WordPressem**, jego motywem, wtyczkami i edytorem.
8. **Możliwość późniejszego podłączenia własnej domeny** bez przepisywania aplikacji.

### Ograniczenia

GitHub Pages nie jest backendem. Nie uruchamia serwerowego kodu Pythona, R ani Node.js. Nie nadaje się bezpośrednio do aplikacji, która wymaga:

- logowania użytkowników,
- prywatnej bazy danych,
- zapisu wyników na serwerze,
- ukrytych kluczy API,
- długich lub bardzo kosztownych obliczeń,
- modeli zbyt dużych, aby pobierać je do przeglądarki,
- przetwarzania poufnych danych.

W takim przypadku potrzebny byłby osobny backend albo usługa obliczeniowa. Nie jest to jednak potrzebne dla pierwszej generacji planowanych demonstracji.

### Wniosek

**GitHub Pages powinien być rozwiązaniem domyślnym.** Migrację do innej infrastruktury należy rozważyć dopiero wtedy, gdy konkretny aplet rzeczywiście wymaga backendu. Budowanie subdomeny i serwera wcześniej byłoby przedwczesną komplikacją.

---

## 4. Rekomendowany stos technologiczny

### Wersja początkowa

- **HTML** — struktura strony i kontrole użytkownika,
- **CSS** — ciemny motyw i układ responsywny,
- **JavaScript** — logika symulacji i obsługa interakcji,
- **Plotly.js** — interaktywne wykresy statystyczne i matematyczne,
- **KaTeX** — szybkie renderowanie wzorów matematycznych,
- **SVG lub Canvas** — niestandardowe diagramy, grafy i animacje.

Dla pierwszych kilku apletów nie jest potrzebny framework frontendowy.

### Wersja rozwinięta

Gdy projekt urośnie, można przejść na:

- **TypeScript** zamiast czystego JavaScriptu,
- **Vite** jako narzędzie budowania,
- moduły współdzielone pomiędzy apletami,
- testy jednostkowe funkcji matematycznych,
- GitHub Actions do automatycznego budowania i publikacji.

React nie jest konieczny. Przy samodzielnych demonstracjach może zwiększyć złożoność bez proporcjonalnej korzyści. Svelte lub React warto rozważyć dopiero przy rozbudowanym systemie wspólnych komponentów i stanu.

### Biblioteki specjalistyczne

W zależności od projektu:

- **D3.js** — niestandardowe wizualizacje i grafy,
- **TensorFlow.js** — trenowanie lub uruchamianie niewielkich modeli ML w przeglądarce,
- **ONNX Runtime Web** — uruchamianie wcześniej wytrenowanych modeli ONNX,
- **math.js** — operacje na macierzach i funkcje numeryczne,
- **Cytoscape.js** — grafy i sieci,
- **Web Workers** — przeniesienie cięższych obliczeń poza główny wątek interfejsu.

Biblioteki należy dodawać tylko wtedy, gdy rozwiązują konkretny problem. Nadmiar zależności wydłuża ładowanie i utrudnia utrzymanie projektu.

---

## 5. Proponowana struktura repozytorium

```text
interactive-explorations/
├── index.html
├── README.md
├── .nojekyll
│
├── assets/
│   ├── images/
│   └── icons/
│
├── shared/
│   ├── theme.css
│   ├── layout.css
│   ├── utilities.js
│   └── math-formatting.js
│
└── applets/
    ├── markov-chain-convergence/
    │   ├── index.html
    │   ├── app.js
    │   └── app.css
    │
    ├── central-limit-theorem/
    │   ├── index.html
    │   ├── app.js
    │   └── app.css
    │
    └── decision-boundary/
        ├── index.html
        ├── app.js
        └── app.css
```

Plik `.nojekyll` jest pusty. Informuje GitHub Pages, że witryna ma być publikowana jako zwykły projekt statyczny bez przetwarzania przez Jekyll.

---

## 6. Budowa galerii

Strona główna projektu powinna być katalogiem, nie jedną dużą aplikacją.

### Proponowany układ

```text
Interactive Explorations
Hands-on mathematical and quantitative applets

Probability & Stochastic Processes
[Markov Chain Convergence] [MCMC Explorer] [Poisson Process]

Statistics & Econometrics
[Central Limit Theorem] [Regression Diagnostics] [Bootstrap]

Machine Learning
[Decision Boundary] [Gradient Descent] [Bias–Variance]

Actuarial Science & Finance
[Loss Distributions] [Life Table Explorer] [Monte Carlo Pricing]
```

Każdy kafelek powinien zawierać:

- krótki tytuł,
- jedno- lub dwuzdaniowy opis,
- symbol albo prostą miniaturę,
- oznaczenie dziedziny,
- link do konkretnego apletu,
- opcjonalny link do powiązanych notatek.

Galeria powinna być generowana ręcznie na początku. Automatyczne generowanie katalogu ma sens dopiero przy większej liczbie apletów.

---

## 7. Anatomia pojedynczego apletu

Każda demonstracja powinna mieć podobny układ:

1. **Tytuł i jednozdaniowy cel**.
2. **Krótkie wyjaśnienie matematyczne**.
3. **Panel sterowania** — suwaki, pola, przyciski, wybór wariantu.
4. **Główna wizualizacja** — wykres, animacja, graf albo tabela.
5. **Wyniki liczbowe** — wartości parametrów, estymaty, błędy, miary zbieżności.
6. **Interpretacja** — co oznacza obserwowany wynik.
7. **Link do notatek**.
8. **Link do kodu źródłowego**.
9. **Powrót do galerii**.

### Zasada projektowa

Jeden aplet powinien odpowiadać na **jedno jasno określone pytanie**.

Dobre przykłady:

- Jak rozkład łańcucha Markowa zbiega do rozkładu stacjonarnego?
- Jak krok i rozkład propozycji wpływają na akceptację w Metropolisie–Hastingsie?
- Jak liczba składników wpływa na przybliżenie w centralnym twierdzeniu granicznym?
- Jak zmiana wag perceptronu obraca granicę decyzyjną?

Zły zakres:

- „Cały kurs rachunku prawdopodobieństwa w jednej aplikacji”.

---

## 8. Minimalny mechanizm interakcji

HTML definiuje kontrolkę:

```html
<label for="steps">Liczba kroków: <span id="steps-value">50</span></label>
<input id="steps" type="range" min="1" max="500" value="50">
<div id="chart"></div>
```

JavaScript odczytuje wartość, wykonuje obliczenia i aktualizuje wykres:

```javascript
const stepsInput = document.querySelector("#steps");
const stepsValue = document.querySelector("#steps-value");

function updateSimulation() {
  const steps = Number(stepsInput.value);
  stepsValue.textContent = String(steps);

  const result = runSimulation(steps);
  renderChart(result);
}

stepsInput.addEventListener("input", updateSimulation);
updateSimulation();
```

Mechanizm jest prosty:

```text
zmiana suwaka
→ zdarzenie input
→ ponowne obliczenie
→ aktualizacja wykresu lub animacji
```

GitHub Pages nie wykonuje tutaj obliczeń. Dostarcza pliki. Obliczenia wykonuje JavaScript uruchomiony w przeglądarce użytkownika.

---

## 9. Praca lokalna

### Najprostszy wariant bez Vite

Nie należy otwierać projektu wyłącznie przez dwukrotne kliknięcie `index.html`, ponieważ niektóre moduły i zasoby mogą być blokowane przez przeglądarkę. Lepiej uruchomić lokalny serwer.

W katalogu projektu:

```bash
python -m http.server 8000
```

Następnie otworzyć:

```text
http://localhost:8000
```

Alternatywnie można użyć rozszerzenia Live Server w VS Code.

### Podstawowy cykl pracy

```text
1. Zmień HTML, CSS lub JavaScript.
2. Sprawdź aplikację lokalnie.
3. Sprawdź konsolę przeglądarki.
4. Zatwierdź zmianę w Git.
5. Wyślij ją do GitHub.
6. GitHub Pages opublikuje nową wersję.
```

---

## 10. Utworzenie repozytorium

### Przez interfejs GitHub

1. Utwórz nowe repozytorium, np. `interactive-explorations`.
2. Ustaw je jako publiczne.
3. Dodaj pliki projektu.
4. Upewnij się, że w katalogu głównym istnieje `index.html`.

### Z poziomu terminala

```bash
git init
git add .
git commit -m "Initialize Interactive Explorations"
git branch -M main
git remote add origin https://github.com/<github-username>/interactive-explorations.git
git push -u origin main
```

---

## 11. Publikacja przez GitHub Pages — czysty HTML/CSS/JS

Dla projektu bez etapu budowania jest to wariant rekomendowany na start.

1. Otwórz repozytorium na GitHubie.
2. Przejdź do `Settings`.
3. Wybierz `Pages`.
4. W sekcji `Build and deployment` wybierz:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

5. Zapisz ustawienia.
6. Poczekaj na zakończenie pierwszego wdrożenia.

GitHub wyświetli opublikowany adres, zwykle:

```text
https://<github-username>.github.io/interactive-explorations/
```

Każdy katalog zawierający `index.html` uzyska własny adres:

```text
applets/markov-chain-convergence/index.html
```

będzie dostępny jako:

```text
https://<github-username>.github.io/interactive-explorations/applets/markov-chain-convergence/
```

Po każdym `git push` GitHub Pages opublikuje zaktualizowaną wersję.

---

## 12. Publikacja projektu Vite — wariant późniejszy

Jeżeli projekt zacznie korzystać z TypeScriptu, importów npm i Vite, potrzebny będzie etap budowania.

### Utworzenie projektu

```bash
npm create vite@latest interactive-explorations -- --template vanilla-ts
cd interactive-explorations
npm install
npm run dev
```

### Konfiguracja ścieżki bazowej

Dla adresu projektowego GitHub Pages:

```typescript
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  base: "/interactive-explorations/",
});
```

Bez poprawnego `base` pliki JavaScript i CSS mogą być ładowane z błędnych adresów.

### Publikacja

W `Settings → Pages` należy wybrać:

```text
Source: GitHub Actions
```

Następnie dodać workflow wdrożeniowy zgodny z dokumentacją Vite i GitHub Pages. Proces będzie wykonywał:

```text
npm ci
→ npm run build
→ publikacja katalogu dist
```

Vite warto wdrożyć wtedy, gdy zapewnia realną korzyść. Na początku czysty HTML, CSS i JavaScript są prostsze i wystarczające.

---

## 13. Podłączenie do WordPressa

### Główna zakładka

W WordPressie należy dodać do menu własny odnośnik:

```text
Etykieta: Interactive Explorations
URL: https://<github-username>.github.io/interactive-explorations/
```

Zakładka nie musi prowadzić do podstrony WordPressa. Może bezpośrednio otwierać galerię GitHub Pages.

### Linki przy notatkach

Przy tematach można dodawać dodatkowe wiersze lub oznaczenia:

```text
Łańcuchy Markowa                         → notatki PDF
↳ Zbieżność do rozkładu stacjonarnego   → interactive
↳ Czas pierwszego przejścia             → interactive
↳ Metropolis–Hastings                    → interactive
```

Linki powinny prowadzić bezpośrednio do odpowiedniego apletu, nie zawsze do strony głównej galerii.

### Otwieranie w tej samej czy nowej karcie?

Rekomendacja:

- główna zakładka `Interactive Explorations` — ta sama karta,
- dodatkowe linki umieszczone wewnątrz notatek lub tabel — opcjonalnie nowa karta.

Nie należy wymuszać nowej karty bez wyraźnego powodu. Użytkownik może sam otworzyć link w nowej karcie.

---

## 14. Motyw wizualny

Galeria i aplety powinny być wizualnie zgodne z główną stroną, ale nie muszą identycznie odtwarzać WordPressa.

### Przykładowe zmienne CSS

```css
:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface-2: #21262d;
  --border: #30363d;
  --text: #e6edf3;
  --muted: #8b949e;
  --accent: #38ff9c;
  --secondary: #a3b0fb;
  --danger: #ff7b72;
  --radius: 14px;
}
```

### Stałe elementy

Każda strona powinna mieć:

- ten sam nagłówek,
- ten sam przycisk powrotu do galerii,
- jednakowy panel sterowania,
- spójny wygląd suwaków i przycisków,
- ten sam styl wzorów,
- jednakową typografię,
- stopkę z linkiem do kodu i strony głównej.

### Responsywność

Aplety muszą działać co najmniej na:

- komputerze stacjonarnym,
- laptopie,
- tablecie,
- telefonie w ograniczonym, ale używalnym zakresie.

Wykres nie powinien mieć sztywnej szerokości większej niż ekran. Panele sterowania powinny przechodzić z układu kolumnowego do pionowego.

---

## 15. Standard jakości apletu

Przed publikacją należy sprawdzić:

### Matematyka

- Czy wzory i implementacja są zgodne?
- Czy wartości brzegowe nie prowadzą do dzielenia przez zero?
- Czy losowość jest kontrolowana i poprawnie interpretowana?
- Czy opis nie sugeruje twierdzeń silniejszych niż rzeczywiście pokazuje demonstracja?

### Interfejs

- Czy każda kontrolka ma etykietę?
- Czy aktualna wartość suwaka jest widoczna?
- Czy użytkownik rozumie, co zmienia parametr?
- Czy istnieje sensowny stan początkowy?
- Czy można przywrócić ustawienia domyślne?

### Wydajność

- Czy przesuwanie suwaka nie blokuje interfejsu?
- Czy obliczenia nie są wykonywane częściej niż potrzeba?
- Czy ciężkie symulacje mają limit liczby iteracji?
- Czy duże biblioteki są rzeczywiście potrzebne?

### Dostępność

- Czy aplikacja działa z klawiaturą?
- Czy kontrast jest wystarczający?
- Czy kolory nie są jedynym nośnikiem informacji?
- Czy elementy SVG i Canvas mają opis tekstowy lub podsumowanie wyników?

### Treść

- Czy istnieje krótkie wyjaśnienie celu?
- Czy wykres ma podpisane osie?
- Czy wynik jest interpretowany, a nie tylko wyświetlany?
- Czy podano związek z odpowiednimi notatkami?

---

## 16. Proponowane pierwsze aplety

Najlepiej zacząć od jednego prostego, ale kompletnego projektu. Nie należy równolegle rozpoczynać kilkunastu demonstracji.

### Dobry pierwszy projekt

**Markov Chain Convergence Explorer**

Zakres:

- 2- lub 3-stanowy łańcuch Markowa,
- edycja macierzy przejścia,
- wybór rozkładu początkowego,
- suwak liczby kroków,
- wykres rozkładu po kolejnych iteracjach,
- rozkład stacjonarny,
- odległość całkowitej wariacji od rozkładu stacjonarnego,
- komunikat, gdy macierz jest niepoprawna albo łańcuch nie spełnia założeń typowej zbieżności.

Ten aplet jest dobrym początkiem, ponieważ łączy:

- algebrę liniową,
- probabilistykę,
- wykresy,
- suwaki,
- walidację danych,
- animację,
- bezpośrednie powiązanie z notatkami.

### Kolejne propozycje

#### Probability & Stochastic Processes

- Poisson Process Timeline,
- Law of Large Numbers,
- Central Limit Theorem,
- Gambler’s Ruin,
- Metropolis–Hastings Explorer,
- Brownian Motion Paths.

#### Statistics & Econometrics

- Sampling Distribution Explorer,
- OLS Geometry,
- Bias–Variance Trade-off,
- Bootstrap Confidence Intervals,
- AR(1) Stationarity,
- GARCH Volatility Paths.

#### Machine Learning

- Decision Boundary Lab,
- Gradient Descent Surface,
- k-NN Neighborhood Explorer,
- Regularization Paths,
- Confusion Matrix Threshold Explorer,
- Neural Network Activation Functions.

#### Actuarial Science & Finance

- Loss Distribution Explorer,
- Compound Poisson Aggregate Loss,
- Life Table and Survival Curve,
- Present Value of a Life Annuity,
- Ruin Probability Simulation,
- Monte Carlo Option Pricing,
- VaR and Expected Shortfall Explorer.

---

## 17. Roadmap

### Etap 1 — szkielet

- utworzenie repozytorium `interactive-explorations`,
- przygotowanie ciemnego motywu,
- stworzenie galerii z jednym aktywnym kafelkiem,
- wdrożenie na GitHub Pages,
- dodanie zakładki do WordPressa.

### Etap 2 — pierwszy pełny aplet

- Markov Chain Convergence Explorer,
- testy matematyczne,
- responsywność,
- link do notatek,
- link do kodu.

### Etap 3 — wspólne komponenty

- wspólny nagłówek i stopka,
- komponent panelu sterowania,
- wspólne style wykresów,
- system kart i oznaczeń dziedzin,
- szablon dla nowych apletów.

### Etap 4 — skalowanie projektu

- TypeScript i Vite, jeżeli kod stanie się trudny do utrzymania,
- automatyczne testy,
- GitHub Actions,
- ewentualna własna domena,
- sekcja `For Students` dopiero po powstaniu uporządkowanego kursu.

---

## 18. Kryterium sukcesu

Projekt odnosi sukces nie wtedy, gdy zawiera dużo apletów, lecz wtedy, gdy każdy aplet:

- wyjaśnia jedno zjawisko lepiej niż statyczny wykres,
- daje użytkownikowi realną kontrolę nad parametrami,
- pokazuje zależność przyczynową lub matematyczną,
- jest poprawny merytorycznie,
- prowadzi do pogłębionych notatek,
- działa bez instalacji i logowania.

**Interactive Explorations nie ma być zbiorem efektownych animacji. Ma być laboratorium do budowania intuicji matematycznej.**

---

## 19. Dokumentacja techniczna

- GitHub Pages — informacje ogólne: <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
- Konfiguracja źródła publikacji: <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>
- Szybki start GitHub Pages: <https://docs.github.com/en/pages/quickstart>
- Własna domena: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>
- Publikacja Vite na GitHub Pages: <https://vite.dev/guide/static-deploy>
- Plotly.js: <https://plotly.com/javascript/>
- KaTeX: <https://katex.org/>
- D3.js: <https://d3js.org/>

---

## 20. Podsumowanie decyzji

```text
Nazwa: Interactive Explorations
Hosting: GitHub Pages
Repozytorium: jedno wspólne repozytorium
Galeria: index.html na GitHub Pages
Aplety: osobne katalogi z własnym index.html
Technologia początkowa: HTML + CSS + JavaScript
Wykresy: Plotly.js lub SVG/Canvas
Integracja z WordPressem: zwykłe linki
Backend: brak, dopóki nie jest faktycznie potrzebny
Talks: ukryte do czasu pojawienia się treści
Jupyter Books: bez osobnej pozycji w menu na obecnym etapie
```
