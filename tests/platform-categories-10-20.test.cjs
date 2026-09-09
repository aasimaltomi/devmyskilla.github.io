const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const modulePath=path.join(root,'js','platform-categories-10-20.js');

const EXPECTED_COUNTS={
  'plat-10':23,
  'plat-11':0,
  'plat-12':6,
  'plat-13':6,
  'plat-14':9,
  'plat-15':9,
  'plat-16':6,
  'plat-17':5,
  'plat-18':5,
  'plat-19':21,
  'plat-20':9
};

test('approved category extension exists for platforms 10-20',()=>{
  assert.equal(fs.existsSync(modulePath),true,'platform-categories-10-20.js must exist');
});

test('approved category counts match the reviewed 10-20 batch',()=>{
  const Categories=require(modulePath);
  for(const [platformId,count] of Object.entries(EXPECTED_COUNTS)){
    assert.equal(Categories.forPlatform(platformId).length,count,`${platformId} category count`);
  }
});

test('every visible approved category is trilingual and links to category content',()=>{
  const Categories=require(modulePath);
  for(const [platformId,count] of Object.entries(EXPECTED_COUNTS)){
    if(count===0)continue;
    const source=Categories.sourceForPlatform(platformId);
    const fields=Categories.forPlatform(platformId);
    for(const field of fields){
      assert.ok(field.name&&field.name.ar&&field.name.en&&field.name.tr,`${platformId}/${field.id} must be ar/en/tr`);
      assert.match(field.officialUrl||'',/^https:\/\//,`${platformId}/${field.id} must have an absolute URL`);
      if(platformId!=='plat-10')assert.notEqual(field.officialUrl,source,`${platformId}/${field.id} must not use only the general platform page`);
    }
  }
});

test('AUC OpenLearn remains intentionally empty until its categories can be verified',()=>{
  const Categories=require(modulePath);
  assert.deepEqual(Categories.forPlatform('plat-11'),[]);
});

test('extension overrides reviewed platforms without mutating source data',()=>{
  const Categories=require(modulePath);
  const source={platforms:[
    {id:'plat-10',fields:[{id:'old'}]},
    {id:'plat-11',fields:[{id:'unverified'}]},
    {id:'plat-12',fields:[]},
    {id:'plat-21',fields:[{id:'keep'}]}
  ]};
  const result=Categories.applyToData(source);
  assert.equal(result.platforms.find(row=>row.id==='plat-10').fields.length,23);
  assert.deepEqual(result.platforms.find(row=>row.id==='plat-11').fields,[]);
  assert.equal(result.platforms.find(row=>row.id==='plat-12').fields.length,6);
  assert.deepEqual(result.platforms.find(row=>row.id==='plat-21').fields,[{id:'keep'}]);
  assert.deepEqual(source.platforms.find(row=>row.id==='plat-10').fields,[{id:'old'}]);
});

test('platform page loads batch categories before direct-link rewriting and rendering',()=>{
  const html=fs.readFileSync(path.join(root,'platform.html'),'utf8');
  const base=html.indexOf('js/platform-categories.js');
  const batch=html.indexOf('js/platform-categories-10-20.js');
  const links=html.indexOf('js/category-direct-links.js');
  const detail=html.indexOf('js/platform-detail.js');
  assert.ok(base>=0&&batch>base&&links>batch&&detail>links,'script order must be base categories -> 10-20 categories -> links -> detail');
});
