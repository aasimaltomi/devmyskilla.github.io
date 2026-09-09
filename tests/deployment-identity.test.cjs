const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const REPO = 'aasimaltomi/devmyskilla.github.io';
const ORIGIN = 'https://aasimaltomi.github.io';
const SITE_URL = `${ORIGIN}/devmyskilla.github.io`;

test('CMS, inline editor, and Worker target the production repository and origin', () => {
  const wrangler = read('inline-worker/wrangler.toml');
  const worker = read('inline-worker/src/worker.mjs');
  const inlineConfig = read('js/inline-editor-config.js');
  const inlineApi = read('js/inline-editor-api.js');
  const decap = read('admin/config.yml');

  assert.match(wrangler, new RegExp(`ALLOWED_ORIGIN = "${ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  assert.match(wrangler, new RegExp(`GITHUB_REPO = "${REPO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));

  assert.ok(worker.includes(`env.ALLOWED_ORIGIN||'${ORIGIN}'`));
  assert.ok(worker.includes(`env.GITHUB_REPO||'${REPO}'`));
  assert.equal(
    inlineConfig.includes(`siteOrigin:'${ORIGIN}'`),
    true,
    `inline editor config did not contain the production origin; actual file: ${JSON.stringify(inlineConfig)}`
  );
  assert.ok(inlineApi.includes(`config.siteOrigin||'${ORIGIN}'`));

  assert.ok(decap.includes(`repo: ${REPO}`));
  assert.ok(decap.includes(`site_url: ${SITE_URL}`));
  assert.ok(decap.includes(`logo_url: ${SITE_URL}/assets/dunya-logo-192.png`));
});

test('runtime deployment configuration contains no legacy repository or site origin', () => {
  const files = [
    'inline-worker/wrangler.toml',
    'inline-worker/src/worker.mjs',
    'js/inline-editor-config.js',
    'js/inline-editor-api.js',
    'admin/config.yml'
  ];

  for (const file of files) {
    const text = read(file);
    assert.equal(text.includes('devmyskilla/devmyskilla.github.io'), false, `${file} still contains the legacy repository`);
    assert.equal(text.includes('https://devmyskilla.github.io'), false, `${file} still contains the legacy site origin`);
  }
});
