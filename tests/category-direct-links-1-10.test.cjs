const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const root=path.join(__dirname,'..');
const Categories=require(path.join(root,'js','platform-categories.js'));

test('approved categories for platforms 2-10 use category-specific URLs',()=>{
  for(let n=2;n<=10;n++){
    const id=`plat-${n}`;
    const source=Categories.sourceForPlatform(id);
    const fields=Categories.forPlatform(id);
    assert.ok(fields.length>0,`${id} should have approved categories`);
    for(const field of fields){
      assert.ok(/^https:\/\//.test(field.officialUrl||''),`${id}/${field.id} should have an absolute URL`);
      assert.notEqual(field.officialUrl,source,`${id}/${field.id} must not point only to the general source page`);
    }
    assert.ok(new Set(fields.map(field=>field.officialUrl)).size>1,`${id} should not reuse one URL for every category`);
  }
});

test('FutureLearn categories keep their direct subject URLs',()=>{
  const data=require(path.join(root,'data.json'));
  const platform=data.platforms.find(row=>row.id==='plat-1');
  assert.ok(platform&&platform.fields.length>0);
  for(const field of platform.fields){
    assert.match(field.officialUrl,/futurelearn\.com\/subjects\//);
  }
});
