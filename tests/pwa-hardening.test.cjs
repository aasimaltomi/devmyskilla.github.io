const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));

test('service worker precaches current platform category runtime',()=>{
  for(const asset of [
    './css/categories-only.css',
    './js/platform-categories.js',
    './js/platform-categories-10-20.js',
    './js/platform-categories-21-30.js',
    './js/platform-categories-31-40.js',
    './js/category-direct-links.js'
  ]) assert.ok(sw.includes(`'${asset}'`),`missing from precache: ${asset}`);
  assert.match(sw,/dunya-al-dawrat-v1[4-9]/);
});

test('offline HTML fallback is limited to navigation requests',()=>{
  assert.match(sw,/event\.request\.mode\s*===\s*['"]navigate['"]/);
  assert.match(sw,/networkFirst\(event\.request,\s*null\)/);
  assert.ok(!sw.includes("['script','style'].includes(event.request.destination);\n  if(needsFreshCopy){\n    event.respondWith(networkFirst(event.request,(isDataRequest||isAdminConfigRequest)?null:'./offline.html'))"));
});

test('manifest exposes install-quality 192 and 512 PNG icons',()=>{
  const icons=manifest.icons||[];
  assert.ok(icons.some(icon=>icon.sizes==='192x192'&&icon.type==='image/png'));
  assert.ok(icons.some(icon=>icon.sizes==='512x512'&&icon.type==='image/png'));
});
