const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const expectedCounts={
  'plat-21':6,
  'plat-22':0,
  'plat-23':0,
  'plat-24':9,
  'plat-25':7,
  'plat-26':11,
  'plat-27':14,
  'plat-28':9,
  'plat-29':7,
  'plat-30':0
};

test('approved category batch 21-30 has expected counts, translations, and direct URLs',()=>{
  const Categories=require(path.join(root,'js','platform-categories-21-30.js'));
  for(const [id,count] of Object.entries(expectedCounts)){
    const fields=Categories.forPlatform(id);
    assert.equal(fields.length,count,`${id} category count`);
    for(const field of fields){
      assert.ok(field.id,`${id} category id`);
      assert.ok(field.name.ar&&field.name.en&&field.name.tr,`${id}/${field.id} trilingual name`);
      assert.match(field.officialUrl,/^https:\/\//,`${id}/${field.id} direct URL`);
    }
  }
});

test('unverified platforms 22, 23, and 30 intentionally expose no categories',()=>{
  const Categories=require(path.join(root,'js','platform-categories-21-30.js'));
  assert.deepEqual(Categories.forPlatform('plat-22'),[]);
  assert.deepEqual(Categories.forPlatform('plat-23'),[]);
  assert.deepEqual(Categories.forPlatform('plat-30'),[]);
});

test('platform 21 is rebranded at runtime to CouponAmI while keeping plat-21 identity',()=>{
  const Categories=require(path.join(root,'js','platform-categories-21-30.js'));
  const source={platforms:[{
    id:'plat-21',
    name:{ar:'Free Udemy',en:'Free Udemy',tr:'Free Udemy'},
    officialUrl:'https://www.discudemy.com/',
    catalogUrl:'https://www.discudemy.com/',
    logo:{src:'old',alt:{ar:'Free Udemy',en:'Free Udemy',tr:'Free Udemy'}},
    description:{ar:'old',en:'old',tr:'old'},
    fields:[{id:'old'}]
  }]};
  const result=Categories.applyToData(source);
  const platform=result.platforms[0];
  assert.equal(platform.id,'plat-21');
  assert.equal(platform.name.en,'CouponAmI (formerly DiscUdemy)');
  assert.equal(platform.officialUrl,'https://www.couponami.com/');
  assert.equal(platform.catalogUrl,'https://www.couponami.com/category');
  assert.match(platform.logo.src,/couponami\.com/);
  assert.equal(platform.fields.length,6);
  assert.equal(source.platforms[0].name.en,'Free Udemy','source must not mutate');
});

test('batch 21-30 loads before direct link rewriting and rendering in platform page',()=>{
  const html=fs.readFileSync(path.join(root,'platform.html'),'utf8');
  const batch=html.indexOf('js/platform-categories-21-30.js');
  const links=html.indexOf('js/category-direct-links.js');
  const detail=html.indexOf('js/platform-detail.js');
  assert.ok(batch>=0,'batch script is loaded');
  assert.ok(batch<links,'batch loads before link resolver');
  assert.ok(links<detail,'link resolver loads before renderer');
});
