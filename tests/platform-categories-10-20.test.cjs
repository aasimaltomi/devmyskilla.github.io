const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);
const expected={'plat-10':23,'plat-11':0,'plat-12':6,'plat-13':6,'plat-14':9,'plat-15':9,'plat-16':6,'plat-17':5,'plat-18':5,'plat-19':21,'plat-20':9};

test('authoritative category counts match the reviewed 10-20 batch',()=>{
  for(const [id,count] of Object.entries(expected))assert.equal((byId(id).fields||[]).length,count,`${id} category count`);
});

test('every visible 10-20 category is trilingual with an HTTPS destination',()=>{
  for(const [id,count] of Object.entries(expected)){
    if(!count)continue;
    for(const field of byId(id).fields){
      assert.ok(field.name?.ar&&field.name?.en&&field.name?.tr,`${id}/${field.id} trilingual`);
      assert.match(field.officialUrl||'',/^https:\/\//,`${id}/${field.id} HTTPS`);
    }
  }
});

test('AUC OpenLearn remains intentionally empty',()=>assert.deepEqual(byId('plat-11').fields||[],[]));
