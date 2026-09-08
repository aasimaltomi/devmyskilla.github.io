const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const PlatformDetail=require(path.join(root,'js','platform-detail.js'));

test('explore page has no public learning-paths section or learning-path assets',()=>{
  const html=fs.readFileSync(path.join(root,'explore.html'),'utf8');
  assert.doesNotMatch(html,/id="learningPaths"/);
  assert.doesNotMatch(html,/id="officialPathGrid"/);
  assert.doesNotMatch(html,/learning-paths\.css/);
  assert.doesNotMatch(html,/path-approvals\.js/);
  assert.doesNotMatch(html,/learning-paths-section\.js/);
});

test('platform pages render official categories but never render learning paths',()=>{
  const model={
    fields:[{id:'ai',name:'Artificial Intelligence',officialUrl:'https://example.com/ai'}],
    officialPaths:[{id:'path-1',name:'AI ExpertTrack',officialName:'AI ExpertTrack',typeLabel:'ExpertTrack',officialUrl:'https://example.com/path'}],
    showAllPathsLink:true,
    allPathsUrl:'https://example.com/paths'
  };
  const fields=PlatformDetail.fieldsMarkup(model,{title:'Categories'},value=>value);
  const paths=PlatformDetail.officialPathsMarkup(model,{title:'Learning Paths',viewPath:'View',viewAll:'View all'},value=>value);
  assert.match(fields,/Artificial Intelligence/);
  assert.equal(paths,'');
});

test('stored path research remains preserved in data.json even though it is hidden publicly',()=>{
  const data=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
  const futureLearn=data.platforms.find(platform=>platform.id==='plat-1');
  assert.ok(futureLearn);
  assert.ok(Array.isArray(futureLearn.officialPaths));
  assert.ok(futureLearn.officialPaths.length>0);
});
