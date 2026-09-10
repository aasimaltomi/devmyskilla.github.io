const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/category-effective-baseline.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'platform.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

const publicIdPattern = /^plat-(?:[1-9]|[1-3][0-9]|40)$/;
const publicPlatforms = data.platforms.filter(p => publicIdPattern.test(String(p && p.id || '')));
const byId = Object.fromEntries(publicPlatforms.map(p => [p.id, p]));
const legacyFiles = [
  'platform-categories.js',
  'platform-categories-10-20.js',
  'platform-categories-21-30.js',
  'platform-categories-31-40.js',
  'category-direct-links.js',
];

test('frozen effective baseline covers exactly the 40 public platforms and 363 fields', () => {
  assert.equal(Object.keys(baseline).length, 40);
  assert.equal(Object.values(baseline).reduce((n, fields) => n + fields.length, 0), 363);
  assert.deepEqual(Object.keys(baseline), Array.from({length: 40}, (_, i) => `plat-${i + 1}`));
});

test('data.json public fields exactly match the frozen effective runtime baseline', () => {
  assert.equal(publicPlatforms.length, 40);
  for (const [id, fields] of Object.entries(baseline)) {
    assert.ok(byId[id], `${id} is missing from public platform data`);
    assert.deepEqual(byId[id].fields || [], fields, `${id} fields differ from frozen runtime baseline`);
  }
});

test('authoritative public fields have stable ids, multilingual labels, and valid HTTPS destinations', () => {
  for (const [platformId, fields] of Object.entries(baseline)) {
    const ids = new Set();
    for (const field of fields) {
      assert.equal(typeof field.id, 'string', `${platformId} field id must be a string`);
      assert.ok(field.id.length > 0, `${platformId} field id must not be empty`);
      assert.equal(ids.has(field.id), false, `${platformId} duplicate field id: ${field.id}`);
      ids.add(field.id);
      for (const lang of ['ar', 'en', 'tr']) {
        assert.equal(typeof field.name?.[lang], 'string', `${platformId}/${field.id} missing ${lang} label`);
        assert.ok(field.name[lang].trim(), `${platformId}/${field.id} empty ${lang} label`);
      }
      assert.match(String(field.officialUrl || ''), /^https:\/\//, `${platformId}/${field.id} must use HTTPS`);
    }
  }
});

test('production page and service worker do not load or precache category mutation scripts', () => {
  for (const name of legacyFiles) {
    assert.equal(html.includes(name), false, `${name} is still loaded by platform.html`);
    assert.equal(sw.includes(name), false, `${name} is still precached by sw.js`);
  }
});
