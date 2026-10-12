import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, readableOn, ensureContrast, fillColor } from '../src/lib/color.js';
import { COLOR_THEMES } from '../src/data/colorThemes.js';

test('contrast matches the WCAG reference values', () => {
  assert.equal(Math.round(contrast('#000000', '#FFFFFF')), 21);
  assert.equal(contrast('#777777', '#777777'), 1);
  // #767676 on white is the well-known smallest gray that passes AA (4.54:1)
  assert.ok(Math.abs(contrast('#767676', '#FFFFFF') - 4.54) < 0.02);
});

test('readableOn picks the more readable of white and dark text', () => {
  assert.equal(readableOn('#FBBF24'), '#1F2430'); // yellow needs dark text
  assert.equal(readableOn('#1E3A8A'), '#FFFFFF'); // navy needs white text
});

test('ensureContrast darkens only when needed', () => {
  assert.equal(ensureContrast('#000000', ['#FFFFFF']), '#000000');
  const fixed = ensureContrast('#FBBF24', ['#FFFFFF']);
  assert.ok(contrast(fixed, '#FFFFFF') >= 4.5);
});

test('every theme has readable text on all of its colored surfaces', () => {
  for (const [name, t] of Object.entries(COLOR_THEMES)) {
    for (const key of ['primary', 'accent', 'success', 'error', 'textLight']) {
      const on = t['on' + key[0].toUpperCase() + key.slice(1)];
      assert.ok(
        contrast(on, t[key]) >= 4.5,
        `${name}: text on ${key} is ${contrast(on, t[key]).toFixed(1)}:1`,
      );
    }
    for (const key of ['primary', 'accent', 'success', 'error']) {
      const text = t[key + 'Text'];
      for (const bg of [t.surface, t.background]) {
        assert.ok(
          contrast(text, bg) >= 4.5,
          `${name}: ${key}Text on ${bg} is ${contrast(text, bg).toFixed(1)}:1`,
        );
      }
    }
    assert.ok(contrast(t.text, t.surface) >= 4.5, `${name}: body text`);
    assert.ok(contrast(t.textLight, t.background) >= 4.5, `${name}: secondary text`);
  }
});

test('fillColor keeps colors that already work and fixes ones that do not', () => {
  assert.equal(fillColor('#FBBF24'), '#FBBF24'); // dark text already reads on yellow
  const fixed = fillColor('#E5484D');
  assert.ok(contrast('#FFFFFF', fixed) >= 4.5);
});
