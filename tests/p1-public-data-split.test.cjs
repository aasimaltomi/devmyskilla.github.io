const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/category-effective-baseline.json'), 'utf8'));
const publicIds = Array.from({length: 40}, (_, i) => `plat-${i + 1}`);
const publicIdSet = new Set(publicIds);
const researchPath = path.join(root, 'research-data.json');

function readResearch(){
  assert.equal(fs.existsSync(researchPath), true, 'research-data.json must exist after P1 split');
  return JSON.parse(fs.readFileSync(researchPath, 'utf8'));
}

function walkFiles(dir){
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full);
    return [full];
  });
}

test('public data ships exactly plat-1 through plat-40', () => {
  assert.deepEqual(data.platforms.map(p => p.id), publicIds);
});

test('public platform records do not ship research-only keys', () => {
  const leaked = data.platforms.filter(p => Object.hasOwn(p, 'officialPaths') || Object.hasOwn(p, 'pathResearch')).map(p => p.id);
  assert.deepEqual(leaked, []);
});

test('approved 363 public fields remain identical to the frozen baseline', () => {
  assert.equal(Object.values(baseline).reduce((n, fields) => n + fields.length, 0), 363);
  const byId = Object.fromEntries(data.platforms.map(p => [p.id, p]));
  for (const id of publicIds) assert.deepEqual(byId[id]?.fields || [], baseline[id], `${id} fields changed during P1 split`);
});

test('research data preserves one research record per public platform without duplicating fields', () => {
  const research = readResearch();
  assert.deepEqual(research.publicPlatformResearch.map(p => p.id), publicIds);
  assert.equal(research.publicPlatformResearch.some(p => Object.hasOwn(p, 'fields')), false);
  assert.equal(research.publicPlatformResearch.length, 40);
});

test('non-public platform corpus is stored outside the public payload', () => {
  const research = readResearch();
  assert.ok(Array.isArray(research.nonPublicPlatforms));
  assert.ok(research.nonPublicPlatforms.length > 0, 'expected preserved non-public platforms');
  assert.equal(research.nonPublicPlatforms.some(p => publicIdSet.has(p.id)), false);
});

test('public runtime and service worker never reference research-data.json', () => {
  const candidates = [
    path.join(root, 'index.html'),
    path.join(root, 'explore.html'),
    path.join(root, 'platform.html'),
    path.join(root, 'sw.js'),
    path.join(root, 'manifest.webmanifest'),
    ...walkFiles(path.join(root, 'js')).filter(file => file.endsWith('.js')),
  ];
  const offenders = candidates.filter(file => fs.readFileSync(file, 'utf8').includes('research-data.json')).map(file => path.relative(root, file));
  assert.deepEqual(offenders, []);
});
