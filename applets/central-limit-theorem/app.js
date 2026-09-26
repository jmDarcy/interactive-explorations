import { mulberry32, formatNumber, plotlyTheme } from "../../shared/utilities.js";
import { renderMath } from "../../shared/math-formatting.js";
import { initAppletPage } from "../../shared/applet-page.js";

const page = initAppletPage("central-limit-theorem");
const domainColor = page?.domain.color;

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
const resetButton = document.querySelector("#reset");
const resultsEl = document.querySelector("#results");
const interpretationEl = document.querySelector("#interpretation");
const chartEl = document.querySelector("#chart");

const DEFAULT_SEED = 42;
let seed = DEFAULT_SEED;

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
    <div class="result-stat theoretical">
      <span class="label">μ (teoretyczna)</span>
      <span class="value">${formatNumber(theoreticalMean)}</span>
    </div>
    <div class="result-stat theoretical">
      <span class="label">σ / √n</span>
      <span class="value">${formatNumber(theoreticalSd, 4)}</span>
    </div>
    <div class="result-stat">
      <span class="label">średnia z M średnich</span>
      <span class="value">${formatNumber(empirical.mean)}</span>
    </div>
    <div class="result-stat">
      <span class="label">odch. std. średnich</span>
      <span class="value">${formatNumber(empirical.sd, 4)}</span>
    </div>
    <div class="result-stat wide">
      <span class="label">skośność empiryczna średnich</span>
      <span class="value">${formatNumber(empirical.skewness)}</span>
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

  const theme = plotlyTheme(domainColor);
  Plotly.react(
    chartEl,
    [
      {
        x: plotted,
        type: "histogram",
        histnorm: "probability density",
        name: "Średnie z próby",
        nbinsx: 60,
        ...theme.histogram,
      },
      {
        x: curveX,
        y: curveY,
        type: "scatter",
        mode: "lines",
        name: "Teoretyczny rozkład graniczny",
        ...theme.curve,
      },
    ],
    {
      ...theme.layout,
      xaxis: { ...theme.layout.xaxis, title: { ...theme.layout.xaxis.title, text: standardize ? "z" : "średnia z próby" } },
      yaxis: { ...theme.layout.yaxis, title: { ...theme.layout.yaxis.title, text: "gęstość" } },
      shapes: [
        {
          type: "line",
          xref: "x",
          yref: "paper",
          x0: plotMean,
          x1: plotMean,
          y0: 0,
          y1: 1,
          line: { color: theme.curve.line.color, width: 1, dash: "dot" },
        },
      ],
    },
    theme.config
  );

  const empirical = summarize(rawMeans);
  renderResults({ theoreticalMean, theoreticalSd, empirical });
  renderInterpretation(n, empirical.skewness, dist.label);
}

resampleButton.addEventListener("click", () => {
  seed += 1;
  run();
});

resetButton.addEventListener("click", () => {
  distributionSelect.selectedIndex = 0;
  nInput.value = nInput.defaultValue;
  mInput.value = mInput.defaultValue;
  standardizeInput.checked = standardizeInput.defaultChecked;
  seed = DEFAULT_SEED;
  run();
});

[distributionSelect, nInput, mInput, standardizeInput].forEach((el) =>
  el.addEventListener("input", run)
);

renderMath();
run();
