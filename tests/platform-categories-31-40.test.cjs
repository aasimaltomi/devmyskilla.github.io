const test=require('node:test');
const assert=require('node:assert/strict');

let mod;
try{mod=require('../js/platform-categories-31-40.js');}catch(e){mod=null;}

const expected={
  'plat-31':11,'plat-32':8,'plat-33':0,'plat-34':7,'plat-35':15,
  'plat-36':9,'plat-37':0,'plat-38':4,'plat-39':0,'plat-40':0
};

test('approved category batch 31-40 exists with exact counts',()=>{
  assert.ok(mod,'platform-categories-31-40.js must exist');
  for(const [id,count] of Object.entries(expected))assert.equal(mod.forPlatform(id).length,count,id);
  assert.equal(Object.values(expected).reduce((a,b)=>a+b,0),54);
});

test('all approved categories are trilingual and link directly to official content',()=>{
  assert.ok(mod);
  for(const id of Object.keys(expected)){
    for(const field of mod.forPlatform(id)){
      assert.ok(field.id);
      assert.ok(field.name?.ar);
      assert.ok(field.name?.en);
      assert.ok(field.name?.tr);
      assert.match(field.officialUrl,/^https:\/\//);
      assert.ok(!/google\.com\/search/.test(field.officialUrl),'must not use external search');
    }
  }
});

test('platforms without verified taxonomy expose no categories',()=>{
  assert.deepEqual(mod.forPlatform('plat-33'),[]);
  assert.deepEqual(mod.forPlatform('plat-37'),[]);
  assert.deepEqual(mod.forPlatform('plat-39'),[]);
  assert.deepEqual(mod.forPlatform('plat-40'),[]);
});

test('batch application replaces only platforms 31-40 and does not mutate source',()=>{
  assert.ok(mod);
  const original={platforms:[
    {id:'plat-31',fields:[{id:'old'}]},
    {id:'plat-33',fields:[{id:'old-rwaq'}]},
    {id:'plat-30',fields:[{id:'keep'}]},
    {id:'plat-40',fields:[{id:'old-coursat'}]}
  ]};
  const result=mod.applyToData(original);
  assert.equal(original.platforms[0].fields[0].id,'old');
  assert.equal(result.platforms.find(p=>p.id==='plat-31').fields.length,11);
  assert.equal(result.platforms.find(p=>p.id==='plat-33').fields.length,0);
  assert.equal(result.platforms.find(p=>p.id==='plat-30').fields[0].id,'keep');
  assert.equal(result.platforms.find(p=>p.id==='plat-40').fields.length,0);
});

test('platform page loads batch 31-40 before category direct links and detail renderer',()=>{
  const fs=require('node:fs');
  const html=fs.readFileSync('platform.html','utf8');
  const batch=html.indexOf('js/platform-categories-31-40.js');
  const links=html.indexOf('js/category-direct-links.js');
  const detail=html.indexOf('js/platform-detail.js');
  assert.ok(batch>=0,'batch script missing');
  assert.ok(batch<links,'batch must load before direct-link layer');
  assert.ok(batch<detail,'batch must load before detail renderer');
});
