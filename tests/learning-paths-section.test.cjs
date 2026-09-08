const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const root=path.join(__dirname,'..');

test('public catalog keeps only the original 40 numbered platforms without deleting source data',()=>{
  const DataLoader=require(path.join(root,'js','data-loader.js'));
  assert.equal(typeof DataLoader.publicCatalog,'function','DataLoader.publicCatalog must exist');
  const source={platforms:[{id:'plat-1'},{id:'plat-40'},{id:'plat-41'},{id:'plat-110'}],settings:{}};
  const scoped=DataLoader.publicCatalog(source);
  assert.deepEqual(scoped.platforms.map(row=>row.id),['plat-1','plat-40']);
  assert.equal(source.platforms.length,4,'source catalog must remain untouched');
});
