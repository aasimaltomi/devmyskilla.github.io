const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

const SITE_ORIGIN='https://aasimaltomi.github.io';
const SITE_URL='https://aasimaltomi.github.io/devmyskilla.github.io';
const REPO='aasimaltomi/devmyskilla.github.io';
const LEGACY_ORIGIN='https://devmyskilla.github.io';
const LEGACY_REPO='devmyskilla/devmyskilla.github.io';

test('Decap targets the current repository and project site',()=>{
  const config=read('admin/config.yml');
  assert.match(config,new RegExp(`repo: ${REPO.replace('/','\\/')}`));
  assert.ok(config.includes(`site_url: ${SITE_URL}`));
  assert.ok(config.includes(`logo_url: ${SITE_URL}/assets/dunya-logo-192.png`));
  assert.ok(!config.includes(LEGACY_REPO));
  assert.ok(!config.includes(`site_url: ${LEGACY_ORIGIN}`));
});

test('inline editor browser config uses the deployed GitHub Pages origin',()=>{
  const config=read('js/inline-editor-config.js');
  assert.ok(config.includes(`siteOrigin:'${SITE_ORIGIN}'`));
  assert.ok(!config.includes(`siteOrigin:'${LEGACY_ORIGIN}'`));
});

test('Worker configuration and runtime fallbacks use current production identity',()=>{
  const wrangler=read('inline-worker/wrangler.toml');
  const worker=read('inline-worker/src/worker.mjs');
  assert.ok(wrangler.includes(`ALLOWED_ORIGIN = "${SITE_ORIGIN}"`));
  assert.ok(wrangler.includes(`GITHUB_REPO = "${REPO}"`));
  assert.ok(worker.includes(`env.ALLOWED_ORIGIN||'${SITE_ORIGIN}'`));
  assert.ok(worker.includes(`env.GITHUB_REPO||'${REPO}'`));
  assert.ok(!wrangler.includes(LEGACY_ORIGIN));
  assert.ok(!wrangler.includes(LEGACY_REPO));
});
