const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);
const expected={'plat-2':6,'plat-3':11,'plat-4':15,'plat-5':6,'plat-6':25,'plat-7':27,'plat-8':37,'plat-9':6,'plat-10':23};

test('authoritative data covers platforms 2 through 10 with approved counts',()=>{
  for(const [id,count] of Object.entries(expected)){
    const fields=byId(id).fields||[];
    assert.equal(fields.length,count,`${id} category count`);
    assert.ok(fields.every(f=>f.id&&f.name?.en&&f.name?.ar&&f.name?.tr&&/^https:\/\//.test(f.officialUrl||'')),`${id} authoritative fields`);
  }
});

test('key approved category names are preserved exactly',()=>{
  assert.ok(byId('plat-2').fields.some(f=>f.name.en==='Focus areas'));
  assert.ok(byId('plat-3').fields.some(f=>f.name.en==='Artificial Intelligence'));
  assert.ok(byId('plat-5').fields.some(f=>f.name.en==='Technical Infrastructure'));
  assert.ok(byId('plat-6').fields.some(f=>f.name.en==='Spectrum Management'));
  assert.ok(byId('plat-7').fields.some(f=>f.name.en==='Computer Science'));
  assert.ok(byId('plat-8').fields.some(f=>f.name.en==='Web Development'));
  assert.ok(byId('plat-9').fields.some(f=>f.name.en==='Multilateral Diplomacy'));
  assert.ok(byId('plat-10').fields.some(f=>f.name.en==='Digital Power'));
});

test('platform detail now follows DataLoader directly without category override scripts',()=>{
  const html=fs.readFileSync('platform.html','utf8');
  assert.ok(html.includes('js/data-loader.js'));
  assert.ok(html.includes('js/platform-detail.js'));
  assert.doesNotMatch(html,/platform-categories|category-direct-links/);
});
