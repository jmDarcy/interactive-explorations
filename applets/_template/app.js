import { clamp, formatNumber, bindRangeInput, mulberry32, plotlyTheme } from "../../shared/utilities.js";
import { renderMath } from "../../shared/math-formatting.js";
import { initAppletPage } from "../../shared/applet-page.js";

// TODO: id apletu z applets/registry.json
const page = initAppletPage("TODO-nazwa-apletu");

const resultsEl = document.querySelector("#results");
const interpretationEl = document.querySelector("#interpretation");
const chartEl = document.querySelector("#chart");

function run() {
  // TODO: odczytaj kontrolki, policz wynik symulacji/modelu.

  const theme = plotlyTheme(page?.domain.color);
  Plotly.react(
    chartEl,
    [
      // TODO: trace'y Plotly, np.
      // { type: "histogram", x: samples, ...theme.histogram },
      // { type: "scatter", mode: "lines", x, y, ...theme.curve },
    ],
    { ...theme.layout },
    theme.config
  );

  resultsEl.innerHTML = `
    <div class="result-stat theoretical">
      <span class="label">TODO: wartość teoretyczna</span>
      <span class="value">TODO</span>
    </div>
    <div class="result-stat">
      <span class="label">TODO: wartość empiryczna</span>
      <span class="value">TODO</span>
    </div>
  `;

  interpretationEl.innerHTML = `<p>TODO: interpretacja wyniku, nie tylko jego opis.</p>`;
}

// TODO: podepnij inputy, np.
// bindRangeInput(document.querySelector("#n"), document.querySelector("#n-value"), run);

renderMath();
run();
