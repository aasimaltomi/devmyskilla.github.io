const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const publicPlatforms=data.platforms.filter(p=>/^plat-(?:[1-9]|[1-3][0-9]|40)$/.test(p.id));
const byId=id=>publicPlatforms.find(p=>p.id===id);
const field=(platform,id)=>platform.fields.find(f=>f.id===id);

test('all public approved categories have absolute HTTPS URLs',()=>{
  const fields=publicPlatforms.flatMap(p=>p.fields||[]);
  assert.equal(fields.length,363,'approved public category total');
  for(const item of fields)assert.match(item.officialUrl||'',/^https:\/\//);
});

test('NVIDIA categories point to self-paced course filters rather than learning paths or workshops',()=>{
  for(const item of byId('plat-13').fields){
    assert.match(item.officialUrl,/nvidia\.com\/en-us\/training\/self-paced-courses\//);
    assert.doesNotMatch(item.officialUrl,/learning-path|instructor-led/i);
  }
});

test('Sololearn categories do not masquerade as a single course or learning path',()=>{
  for(const item of byId('plat-17').fields)assert.equal(item.officialUrl,'https://www.sololearn.com/en/learn/');
});

test('Edraak uses exact official category filters where verified',()=>{
  const exact={'career-readiness':'career-readiness',technology:'technology','personal-development':'personal-development','business-entrepreneurship':'business-and-entrepreneurship',languages:'languages'};
  for(const [id,slug] of Object.entries(exact))assert.equal(field(byId('plat-31'),id).officialUrl,`https://www.edraak.org/explore/?category=${slug}`);
});
