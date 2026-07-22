// Cienka warstwa nad KaTeX do renderowania wzorów w apletach.
// Oczekuje, że katex.min.js/css jest załadowany w danym index.html apletu.

export function renderMath(selector = "[data-math]") {
  if (typeof window === "undefined" || !window.katex) return;
  document.querySelectorAll(selector).forEach((el) => {
    const expr = el.getAttribute("data-math") ?? el.textContent;
    const displayMode = el.hasAttribute("data-math-display");
    try {
      window.katex.render(expr, el, { throwOnError: false, displayMode });
    } catch (err) {
      console.error("KaTeX render error:", err);
    }
  });
}
