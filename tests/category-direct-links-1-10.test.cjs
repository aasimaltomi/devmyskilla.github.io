const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const Categories=require(path.join(root,'js','platform-categories.js'));
const Links=require(path.join(root,'js','category-direct-links.js'));

test('category link resolver gives every approved category a category-specific URL',()=>{
  for(let n=2;n<=10;n++){
    const id=`plat-${n}`;
    const source=Categories.sourceForPlatform(id);
    const fields=Categories.forPlatform(id);
    assert.ok(fields.length>0,`${id} should have approved categories`);
    const resolved=fields.map(field=>Links.resolve(id,field));
    for(const url of resolved){
      assert.ok(/^https:\/\//.test(url||''),`${id} should resolve to an absolute URL`);
      assert.notEqual(url,source,`${id} category must not point only to the general source page`);
    }
    assert.ok(new Set(resolved).size>1,`${id} should not reuse one URL for every category`);
  }
});

test('resolver uses known official category URL patterns',()=>{
  assert.equal(Links.resolve('plat-4',{id:'artificial-intelligence',name:{en:'Artificial Intelligence'}}),'https://www.theforage.com/simulations?careers=ai');
  assert.equal(Links.resolve('plat-5',{id:'artificial-intelligence',name:{en:'Artificial Intelligence'}}),'https://learn.microsoft.com/en-us/training/browse/?terms=Artificial%20Intelligence');
  assert.equal(Links.resolve('plat-7',{id:'computer-science',name:{en:'Computer Science'}}),'https://www.edx.org/learn/computer-science');
  assert.equal(Links.resolve('plat-8',{id:'python',name:{en:'Python'}}),'https://www.codecademy.com/catalog/language/python');
  assert.equal(Links.resolve('plat-8',{id:'ai',name:{en:'AI'}}),'https://www.codecademy.com/catalog/subject/artificial-intelligence');
  assert.equal(Links.resolve('plat-10',{id:'ai',name:{en:'AI'}}),'https://e.huawei.com/en/talent/search/?q=AI');
});

test('link layer rewrites fields without mutating source data',()=>{
  const source={platforms:[{id:'plat-5',fields:[{id:'security',name:{en:'Security'},officialUrl:'https://learn.microsoft.com/en-us/training/browse/'}]}]};
  const result=Links.applyToData(source);
  assert.equal(result.platforms[0].fields[0].officialUrl,'https://learn.microsoft.com/en-us/training/browse/?terms=Security');
  assert.equal(source.platforms[0].fields[0].officialUrl,'https://learn.microsoft.com/en-us/training/browse/');
});

test('FutureLearn direct subject URLs stay unchanged',()=>{
  const data=require(path.join(root,'data.json'));
  const platform=data.platforms.find(row=>row.id==='plat-1');
  const result=Links.applyToData({platforms:[platform]});
  for(const field of result.platforms[0].fields){
    assert.match(field.officialUrl,/futurelearn\.com\/subjects\//);
  }
});

test('platform page loads direct-link layer after category overrides and before detail rendering',()=>{
  const html=fs.readFileSync(path.join(root,'platform.html'),'utf8');
  const categories=html.indexOf('js/platform-categories.js');
  const links=html.indexOf('js/category-direct-links.js');
  const detail=html.indexOf('js/platform-detail.js');
  assert.ok(categories>=0&&links>categories&&detail>links,'category link resolver must be wired between categories and platform detail');
});
