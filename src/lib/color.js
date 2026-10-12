// Small color helpers so text stays readable on every theme (WCAG contrast).

const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Contrast ratio between two #rrggbb colors, from 1 (identical) to 21 (black on white)
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const LIGHT_TEXT = '#FFFFFF';
const DARK_TEXT = '#1F2430';

// White or dark text, whichever reads better on this background
export function readableOn(background) {
  return contrast(LIGHT_TEXT, background) >= contrast(DARK_TEXT, background)
    ? LIGHT_TEXT
    : DARK_TEXT;
}

// Darkens `color` just enough to reach `ratio` contrast against every background given.
// Colors that already pass are returned unchanged.
export function ensureContrast(color, backgrounds, ratio = 4.5) {
  const passes = (c) => backgrounds.every((bg) => contrast(c, bg) >= ratio);
  let rgb = toRgb(color);
  for (let step = 0; step < 40 && !passes(toHex(rgb)); step++) {
    rgb = rgb.map((v) => v * 0.94);
  }
  return toHex(rgb);
}

// For colors that get filled behind text: if neither white nor dark text reaches 4.5:1
// (typical of mid-tone reds and greens), darken the fill until white text does.
export function fillColor(color, ratio = 4.5) {
  const text = readableOn(color);
  return contrast(text, color) >= ratio ? color : ensureContrast(color, [LIGHT_TEXT], ratio);
}
