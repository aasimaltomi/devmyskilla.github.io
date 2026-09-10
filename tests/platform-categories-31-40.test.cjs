const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);
const expected={'plat-31':11,'plat-32':8,'plat-33':0,'plat-34':7,'plat-35':15,'plat-36':9,'plat-37':0,'plat-38':4,'plat-39':0,'plat-40':0};

test('authoritative category batch 31-40 has exact reviewed counts',()=>{
  for(const [id,count] of Object.entries(expected))assert.equal((byId(id).fields||[]).length,count,id);
  assert.equal(Object.values(expected).reduce((a,b)=>a+b,0),54);
});

test('all approved 31-40 categories are trilingual and use official HTTPS destinations',()=>{
  for(const id of Object.keys(expected))for(const field of byId(id).fields||[]){
    assert.ok(field.id&&field.name?.ar&&field.name?.en&&field.name?.tr);
    assert.match(field.officialUrl,/^https:\/\//);
    assert.doesNotMatch(field.officialUrl,/google\.com\/search/);
  }
});

test('platforms without verified taxonomy expose no categories',()=>{
  for(const id of ['plat-33','plat-37','plat-39','plat-40'])assert.deepEqual(byId(id).fields||[],[]);
});
