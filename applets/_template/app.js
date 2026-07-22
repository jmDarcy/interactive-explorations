import { clamp, formatNumber, bindRangeInput, mulberry32 } from "../../shared/utilities.js";
import { renderMath } from "../../shared/math-formatting.js";

const resultsEl = document.querySelector("#results");
const interpretationEl = document.querySelector("#interpretation");
const chartEl = document.querySelector("#chart");

function run() {
  // TODO: odczytaj kontrolki, policz wynik symulacji/modelu.

  Plotly.newPlot(
    chartEl,
    [
      // TODO: trace'y Plotly (np. { x, y, type: "scatter" })
    ],
    {
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "#e6edf3" },
      margin: { t: 20, r: 20, b: 40, l: 50 },
      xaxis: { gridcolor: "#30363d" },
      yaxis: { gridcolor: "#30363d" },
    },
    { responsive: true, displayModeBar: false }
  );

  resultsEl.innerHTML = `
    <div class="result-stat">
      <div class="label">TODO: etykieta</div>
      <div class="value">TODO</div>
    </div>
  `;

  interpretationEl.innerHTML = `<p>TODO: interpretacja wyniku, nie tylko jego opis.</p>`;
}

// TODO: podepnij inputy, np.
// bindRangeInput(document.querySelector("#n"), document.querySelector("#n-value"), run);

renderMath();
run();
