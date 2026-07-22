// Pojedyncze źródło prawdy dla galerii. Dodanie nowego apletu = dodanie
// jednego wpisu tutaj, po utworzeniu jego katalogu na bazie applets/_template/.
// index.html NIE trzeba wtedy ręcznie edytować — galeria renderuje się z tej listy.

export const DOMAINS = {
  probability: { label: "Probability & Stochastic Processes", color: "#38ff9c" },
  statistics: { label: "Statistics & Econometrics", color: "#a3b0fb" },
  ml: { label: "Machine Learning", color: "#ffd166" },
  actuarial: { label: "Actuarial Science & Finance", color: "#f59e0b" },
};

export const APPLETS = [
  {
    id: "central-limit-theorem",
    domain: "statistics",
    title: "Central Limit Theorem",
    description:
      "Jak rozkład średniej z próby zbliża się do rozkładu normalnego wraz ze wzrostem liczności próby.",
    status: "live",
    notesUrl: null,
  },
  {
    id: "markov-chain-convergence",
    domain: "probability",
    title: "Markov Chain Convergence Explorer",
    description: "Zbieżność łańcucha Markowa do rozkładu stacjonarnego przy edytowalnej macierzy przejścia.",
    status: "soon",
    notesUrl: null,
  },
  {
    id: "poisson-process-timeline",
    domain: "probability",
    title: "Poisson Process Timeline",
    description: "Symulacja czasów zdarzeń procesu Poissona i wpływ intensywności na odstępy między nimi.",
    status: "soon",
    notesUrl: null,
  },
  {
    id: "bootstrap-confidence-intervals",
    domain: "statistics",
    title: "Bootstrap Confidence Intervals",
    description: "Konstrukcja przedziałów ufności metodą bootstrap bez założeń o rozkładzie populacji.",
    status: "soon",
    notesUrl: null,
  },
  {
    id: "decision-boundary-lab",
    domain: "ml",
    title: "Decision Boundary Lab",
    description: "Jak zmiana wag i wybór modelu obraca oraz odkształca granicę decyzyjną klasyfikatora.",
    status: "soon",
    notesUrl: null,
  },
  {
    id: "gradient-descent-surface",
    domain: "ml",
    title: "Gradient Descent Surface",
    description: "Ścieżka gradientu prostego na powierzchni funkcji straty w zależności od kroku uczenia.",
    status: "soon",
    notesUrl: null,
  },
  {
    id: "loss-distribution-explorer",
    domain: "actuarial",
    title: "Loss Distribution Explorer",
    description: "Wpływ rozkładu częstości i dotkliwości szkód na kształt rozkładu szkody zagregowanej.",
    status: "soon",
    notesUrl: null,
  },
  {
    id: "life-table-survival-curve",
    domain: "actuarial",
    title: "Life Table & Survival Curve",
    description: "Eksploracja tablicy trwania życia, funkcji przeżycia i intensywności śmiertelności.",
    status: "soon",
    notesUrl: null,
  },
];
