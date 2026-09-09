const fs = require('node:fs');

function replace(file, pairs) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  for (const [from, to] of pairs) text = text.split(from).join(to);
  if (text === original) return false;
  fs.writeFileSync(file, text);
  console.log(`updated ${file}`);
  return true;
}

const repoOld = 'devmyskilla/devmyskilla.github.io';
const repoNew = 'aasimaltomi/devmyskilla.github.io';
const originOld = 'https://devmyskilla.github.io';
const originNew = 'https://aasimaltomi.github.io';
const siteNew = 'https://aasimaltomi.github.io/devmyskilla.github.io';

replace('inline-worker/wrangler.toml', [
  [repoOld, repoNew],
  [originOld, originNew]
]);
replace('inline-worker/src/worker.mjs', [
  [repoOld, repoNew],
  [originOld, originNew]
]);
replace('js/inline-editor-config.js', [[originOld, originNew]]);
replace('js/inline-editor-api.js', [[originOld, originNew]]);
replace('scripts/generate-decap-config.cjs', [
  [`repo: ${repoOld}`, `repo: ${repoNew}`],
  [`site_url: ${originOld}`, `site_url: ${siteNew}`],
  [`logo_url: ${originOld}/assets/dunya-logo-192.png`, `logo_url: ${siteNew}/assets/dunya-logo-192.png`]
]);
replace('admin/config.yml', [
  [`repo: ${repoOld}`, `repo: ${repoNew}`],
  [`site_url: ${originOld}`, `site_url: ${siteNew}`],
  [`logo_url: ${originOld}/assets/dunya-logo-192.png`, `logo_url: ${siteNew}/assets/dunya-logo-192.png`]
]);
