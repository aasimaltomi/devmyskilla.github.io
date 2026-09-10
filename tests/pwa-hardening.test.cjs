const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const legacy=['platform-categories.js','platform-categories-10-20.js','platform-categories-21-30.js','platform-categories-31-40.js','category-direct-links.js'];

test('service worker precaches authoritative category data without legacy mutation scripts',()=>{
  assert.ok(sw.includes("'./data.json'"));
  assert.ok(sw.includes("'./css/categories-only.css'"));
  for(const name of legacy)assert.equal(sw.includes(name),false,`${name} must not be precached`);
  assert.match(sw,/dunya-al-dawrat-v14/);
});

test('offline HTML fallback is limited to navigation requests',()=>{
  assert.match(sw,/event\.request\.mode\s*===\s*['"]navigate['"]/);
  assert.match(sw,/networkFirst\(event\.request,\s*null\)/);
});

test('manifest exposes install-quality 192 and 512 PNG icons',()=>{
  const icons=manifest.icons||[];
  assert.ok(icons.some(icon=>icon.sizes==='192x192'&&icon.type==='image/png'));
  assert.ok(icons.some(icon=>icon.sizes==='512x512'&&icon.type==='image/png'));
});
