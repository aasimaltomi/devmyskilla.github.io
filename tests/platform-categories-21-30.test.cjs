const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);
const expected={'plat-21':6,'plat-22':0,'plat-23':0,'plat-24':9,'plat-25':7,'plat-26':11,'plat-27':14,'plat-28':9,'plat-29':7,'plat-30':0};

test('authoritative category batch 21-30 has expected counts translations and URLs',()=>{
  for(const [id,count] of Object.entries(expected)){
    const fields=byId(id).fields||[];
    assert.equal(fields.length,count,`${id} category count`);
    for(const field of fields){assert.ok(field.id&&field.name?.ar&&field.name?.en&&field.name?.tr);assert.match(field.officialUrl,/^https:\/\//);}
  }
});

test('unverified platforms 22 23 and 30 intentionally expose no categories',()=>{
  for(const id of ['plat-22','plat-23','plat-30'])assert.deepEqual(byId(id).fields||[],[]);
});

test('CouponAmI rebrand is stored authoritatively in data.json',()=>{
  const p=byId('plat-21');
  assert.equal(p.name.en,'CouponAmI (formerly DiscUdemy)');
  assert.equal(p.officialUrl,'https://www.couponami.com/');
  assert.equal(p.catalogUrl,'https://www.couponami.com/category');
  assert.match(p.logo.src,/couponami\.com/);
  assert.equal(p.fields.length,6);
});
