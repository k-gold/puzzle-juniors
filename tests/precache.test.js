import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precacheServiceWorker, buildServiceWorker } from '../scripts/precache-plugin.mjs';

test('the service worker lists every built file and a cache name for this build', () => {
  const source = buildServiceWorker(['/', '/assets/app-123.js'], 'abc');
  assert.ok(source.includes("'puzzle-juniors-abc'"));
  assert.ok(source.includes('"/assets/app-123.js"'));
  assert.doesNotThrow(() => new Function(source));
});

test('the build plugin emits sw.js containing the built assets and the dictionary', () => {
  const emitted = [];
  const plugin = precacheServiceWorker();
  plugin.generateBundle.call(
    { emitFile: (file) => emitted.push(file) },
    {},
    { 'assets/index-xyz.js': {}, 'assets/index-xyz.css': {} },
  );
  assert.equal(emitted.length, 1);
  assert.equal(emitted[0].fileName, 'sw.js');
  for (const needed of ['/assets/index-xyz.js', '/assets/index-xyz.css', '/words.txt', '/']) {
    assert.ok(emitted[0].source.includes(`"${needed}"`), `missing ${needed}`);
  }
});
