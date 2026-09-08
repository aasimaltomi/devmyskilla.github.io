const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const root=path.join(__dirname,'..');

test('approved category dataset covers platforms 2 through 10 with approved counts',()=>{
  const Categories=require(path.join(root,'js','platform-categories.js'));
  const expected={'plat-2':6,'plat-3':11,'plat-4':15,'plat-5':6,'plat-6':25,'plat-7':27,'plat-8':37,'plat-9':6,'plat-10':22};
  for(const [id,count] of Object.entries(expected)){
    const fields=Categories.forPlatform(id);
    assert.equal(fields.length,count,`${id} should have ${count} approved categories`);
    assert.ok(fields.every(field=>field.id&&field.name&&field.name.en&&field.name.ar&&field.name.tr),`${id} categories must be trilingual`);
  }
});

test('key approved categories are preserved exactly in English',()=>{
  const Categories=require(path.join(root,'js','platform-categories.js'));
  assert.ok(Categories.forPlatform('plat-2').some(f=>f.name.en==='Focus areas'));
  assert.ok(Categories.forPlatform('plat-3').some(f=>f.name.en==='Artificial Intelligence'));
  assert.ok(Categories.forPlatform('plat-5').some(f=>f.name.en==='Technical Infrastructure'));
  assert.ok(Categories.forPlatform('plat-6').some(f=>f.name.en==='Spectrum Management'));
  assert.ok(Categories.forPlatform('plat-7').some(f=>f.name.en==='Computer Science'));
  assert.ok(Categories.forPlatform('plat-8').some(f=>f.name.en==='Web Development'));
  assert.ok(Categories.forPlatform('plat-9').some(f=>f.name.en==='Multilateral Diplomacy'));
  assert.ok(Categories.forPlatform('plat-10').some(f=>f.name.en==='Digital Power'));
});

test('platform detail uses approved category overrides without mutating stored platform fields',()=>{
  const PlatformDetail=require(path.join(root,'js','platform-detail.js'));
  const stored={id:'plat-5',name:{en:'Microsoft Learn'},description:{en:''},fields:[{id:'legacy',name:{en:'Legacy'}}],languageIds:[],editorial:{}};
  const model=PlatformDetail.buildDetailModel(stored,'en',new Date(),null);
  assert.equal(model.fields.length,6);
  assert.equal(model.fields[0].name,'Application Development');
  assert.equal(stored.fields[0].name.en,'Legacy');
});
