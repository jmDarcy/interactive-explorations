import { mulberry32, formatNumber } from "../../shared/utilities.js";
import { renderMath } from "../../shared/math-formatting.js";

const DISTRIBUTIONS = {
  uniform: {
    label: "Jednostajny na (0, 1)",
    mean: 0.5,
    variance: 1 / 12,
    draw: (rng) => rng(),
  },
  exponential: {
    label: "Wykładniczy (λ = 1)",
    mean: 1,
    variance: 1,
    draw: (rng) => -Math.log(1 - rng()),
  },
  bernoulli: {
    label: "Bernoulliego (p = 0.1)",
    mean: 0.1,
    variance: 0.1 * 0.9,
    draw: (rng) => (rng() < 0.1 ? 1 : 0),
  },
};

const distributionSelect = document.querySelector("#distribution");
const nInput = document.querySelector("#n");
const nValue = document.querySelector("#n-value");
const mInput = document.querySelector("#m");
const mValue = document.querySelector("#m-value");
const standardizeInput = document.querySelector("#standardize");
const resampleButton = document.querySelector("#resample");
const resultsEl = document.querySelector("#results");
const interpretationEl = document.querySelector("#interpretation");
const chartEl = document.querySelector("#chart");

let seed = 42;

function normalPdf(x, mean, variance) {
  const sd = Math.sqrt(variance);
  return Math.exp(-((x - mean) ** 2) / (2 * variance)) / (sd * Math.sqrt(2 * Math.PI));
}

function sampleMeans(dist, n, m, rng) {
  const means = new Array(m);
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) sum += dist.draw(rng);
    means[i] = sum / n;
  }
  return means;
}

function summarize(values) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  const skewness =
    sd > 0
      ? values.reduce((a, b) => a + ((b - mean) / sd) ** 3, 0) / n
      : 0;
  return { mean, variance, sd, skewness };
}

function renderResults({ theoreticalMean, theoreticalSd, empirical }) {
  resultsEl.innerHTML = `
    <div class="result-stat">
      <div class="label">Teoretyczna średnia μ</div>
      <div class="value">${formatNumber(theoreticalMean)}</div>
    </div>
    <div class="result-stat">
      <div class="label">Teoretyczne σ/√n</div>
      <div class="value">${formatNumber(theoreticalSd)}</div>
    </div>
    <div class="result-stat">
      <div class="label">Empiryczna średnia</div>
      <div class="value">${formatNumber(empirical.mean)}</div>
    </div>
    <div class="result-stat">
      <div class="label">Empiryczne odch. std.</div>
      <div class="value">${formatNumber(empirical.sd)}</div>
    </div>
    <div class="result-stat">
      <div class="label">Skośność empiryczna</div>
      <div class="value">${formatNumber(empirical.skewness)}</div>
    </div>
  `;
}

function renderInterpretation(n, skewness, distLabel) {
  const magnitude = Math.abs(skewness);
  let verdict;
  if (magnitude < 0.15) {
    verdict = "Histogram jest już praktycznie symetryczny i dobrze przypomina krzywą normalną.";
  } else if (magnitude < 0.5) {
    verdict = "Widoczna jest jeszcze łagodna asymetria — zbieżność do rozkładu normalnego trwa.";
  } else {
    verdict = "Asymetria jest wyraźna: przy tak małym n kształt rozkładu populacji wciąż dominuje.";
  }
  interpretationEl.innerHTML = `
    <p>
      Rozkład bazowy to <strong>${distLabel}</strong>, liczność próby n = ${n}.
      Skośność empiryczna rozkładu średnich wynosi ${formatNumber(skewness)}. ${verdict}
      Im większe n, tym szybciej znika wpływ kształtu rozkładu wyjściowego — to właśnie
      treść centralnego twierdzenia granicznego, a nie założenie, że pojedyncza obserwacja
      jest w jakikolwiek sposób „normalna”.
    </p>
  `;
}

function run() {
  const distKey = distributionSelect.value;
  const dist = DISTRIBUTIONS[distKey];
  const n = Number(nInput.value);
  const m = Number(mInput.value);
  const standardize = standardizeInput.checked;

  nValue.textContent = String(n);
  mValue.textContent = String(m);

  const rng = mulberry32(seed);
  const rawMeans = sampleMeans(dist, n, m, rng);

  const theoreticalMean = dist.mean;
  const theoreticalVariance = dist.variance / n;
  const theoreticalSd = Math.sqrt(theoreticalVariance);

  const plotted = standardize
    ? rawMeans.map((x) => (x - theoreticalMean) / theoreticalSd)
    : rawMeans;

  const plotMean = standardize ? 0 : theoreticalMean;
  const plotVariance = standardize ? 1 : theoreticalVariance;
  const plotSd = Math.sqrt(plotVariance);

  const xMin = plotMean - 4 * plotSd;
  const xMax = plotMean + 4 * plotSd;
  const curveX = Array.from({ length: 200 }, (_, i) => xMin + ((xMax - xMin) * i) / 199);
  const curveY = curveX.map((x) => normalPdf(x, plotMean, plotVariance));

  Plotly.newPlot(
    chartEl,
    [
      {
        x: plotted,
        type: "histogram",
        histnorm: "probability density",
        name: "Średnie z próby",
        marker: { color: "rgba(163, 176, 251, 0.55)" },
        nbinsx: 60,
      },
      {
        x: curveX,
        y: curveY,
        type: "scatter",
        mode: "lines",
        name: "Teoretyczny rozkład graniczny",
        line: { color: "#38ff9c", width: 2 },
      },
    ],
    {
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "#e6edf3" },
      margin: { t: 20, r: 20, b: 40, l: 50 },
      xaxis: { title: standardize ? "z" : "średnia z próby", gridcolor: "#30363d" },
      yaxis: { title: "gęstość", gridcolor: "#30363d" },
      legend: { orientation: "h", y: -0.2 },
    },
    { responsive: true, displayModeBar: false }
  );

  const empirical = summarize(rawMeans);
  renderResults({ theoreticalMean, theoreticalSd, empirical });
  renderInterpretation(n, empirical.skewness, dist.label);
}

resampleButton.addEventListener("click", () => {
  seed += 1;
  run();
});

[distributionSelect, nInput, mInput, standardizeInput].forEach((el) =>
  el.addEventListener("input", run)
);

renderMath();
run();
