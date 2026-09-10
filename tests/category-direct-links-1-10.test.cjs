const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);
const field=(id,fieldId)=>byId(id).fields.find(f=>f.id===fieldId);

test('platforms 2-10 store category-specific authoritative URLs in data.json',()=>{
  for(let n=2;n<=10;n++){
    const platform=byId(`plat-${n}`);
    assert.ok(platform.fields.length>0,`${platform.id} should have approved categories`);
    for(const item of platform.fields)assert.match(item.officialUrl||'',/^https:\/\//,`${platform.id}/${item.id}`);
    assert.ok(new Set(platform.fields.map(item=>item.officialUrl)).size>1,`${platform.id} should not reuse one URL for every category`);
  }
});

test('known direct category destinations are materialized exactly',()=>{
  assert.equal(field('plat-4','artificial-intelligence').officialUrl,'https://www.theforage.com/simulations?careers=ai');
  assert.equal(field('plat-5','artificial-intelligence').officialUrl,'https://learn.microsoft.com/en-us/training/browse/?terms=Artificial%20Intelligence');
  assert.equal(field('plat-7','computer-science').officialUrl,'https://www.edx.org/learn/computer-science');
  assert.equal(field('plat-8','python').officialUrl,'https://www.codecademy.com/catalog/language/python');
  assert.equal(field('plat-8','ai').officialUrl,'https://www.codecademy.com/catalog/subject/artificial-intelligence');
  assert.equal(field('plat-10','ai').officialUrl,'https://e.huawei.com/en/talent/search/?q=AI');
});

test('FutureLearn authoritative fields keep direct subject URLs',()=>{
  for(const item of byId('plat-1').fields)assert.match(item.officialUrl,/futurelearn\.com\/subjects\//);
});

test('production no longer ships a direct-link mutation layer',()=>{
  assert.equal(fs.existsSync('js/category-direct-links.js'),false);
  assert.equal(fs.readFileSync('platform.html','utf8').includes('category-direct-links.js'),false);
});
