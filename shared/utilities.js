// Wspólne funkcje pomocnicze dla apletów Interactive Explorations.

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value, digits = 3) {
  return Number(value).toFixed(digits);
}

export function bindRangeInput(inputEl, valueEl, onChange) {
  const update = () => {
    const value = Number(inputEl.value);
    if (valueEl) valueEl.textContent = String(value);
    onChange(value);
  };
  inputEl.addEventListener("input", update);
  update();
  return update;
}

export function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
