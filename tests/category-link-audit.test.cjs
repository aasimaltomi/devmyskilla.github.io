const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const root=path.join(__dirname,'..');
const Base=require(path.join(root,'js','platform-categories.js'));
const Batch1020=require(path.join(root,'js','platform-categories-10-20.js'));
const Batch2130=require(path.join(root,'js','platform-categories-21-30.js'));
const Batch3140=require(path.join(root,'js','platform-categories-31-40.js'));
const Links=require(path.join(root,'js','category-direct-links.js'));
const data=require(path.join(root,'data.json'));

function finalData(){
  let result={...data,platforms:data.platforms.filter(p=>/^plat-(?:[1-9]|[1-3][0-9]|40)$/.test(p.id))};
  result=Base.applyToData(result);
  result=Batch1020.applyToData(result);
  result=Batch2130.applyToData(result);
  result=Batch3140.applyToData(result);
  result=Links.applyToData(result);
  return result;
}

const byId=(id)=>finalData().platforms.find(p=>p.id===id);
const field=(platform,id)=>platform.fields.find(f=>f.id===id);

test('all public approved categories have absolute HTTPS URLs',()=>{
  const fields=finalData().platforms.flatMap(p=>p.fields||[]);
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
  for(const item of byId('plat-17').fields){
    assert.equal(item.officialUrl,'https://www.sololearn.com/en/learn/');
  }
});

test('Edraak uses exact official category filters where verified',()=>{
  const edraak=byId('plat-31');
  const exact={
    'career-readiness':'career-readiness',
    technology:'technology',
    'personal-development':'personal-development',
    'business-entrepreneurship':'business-and-entrepreneurship',
    languages:'languages'
  };
  for(const [id,slug] of Object.entries(exact)){
    assert.equal(field(edraak,id).officialUrl,`https://www.edraak.org/explore/?category=${slug}`);
  }
});
