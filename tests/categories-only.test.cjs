const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');

test('explore removes the public official learning-path navigation and section',()=>{
  const LearningPathsSection=require(path.join(root,'js','learning-paths-section.js'));
  assert.equal(typeof LearningPathsSection.removeLearningPathsUi,'function');
  const removed=[];
  const nav={remove:()=>removed.push('nav')};
  const section={remove:()=>removed.push('section')};
  const fakeDocument={
    querySelector:selector=>selector==='a[href="#learningPaths"]'?nav:null,
    getElementById:id=>id==='learningPaths'?section:null
  };
  LearningPathsSection.removeLearningPathsUi(fakeDocument);
  assert.deepEqual(removed,['nav','section']);
});

test('platform page keeps categories visible and hides official learning paths',()=>{
  const html=fs.readFileSync(path.join(root,'platform.html'),'utf8');
  const cssPath=path.join(root,'css','categories-only.css');
  assert.match(html,/css\/categories-only\.css/);
  assert.equal(fs.existsSync(cssPath),true);
  const css=fs.readFileSync(cssPath,'utf8');
  assert.match(css,/\.profile-paths-section\s*\{[^}]*display\s*:\s*none\s*!important/i);
  const PlatformDetail=require(path.join(root,'js','platform-detail.js'));
  const fields=PlatformDetail.fieldsMarkup({fields:[{id:'ai',name:'Artificial Intelligence',officialUrl:'https://example.com/ai'}]},{title:'Categories'},value=>value);
  assert.match(fields,/Artificial Intelligence/);
});

test('stored path research remains preserved outside the public payload even though it is hidden publicly',()=>{
  const data=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
  const research=JSON.parse(fs.readFileSync(path.join(root,'research-data.json'),'utf8'));
  const futureLearn=data.platforms.find(platform=>platform.id==='plat-1');
  const futureLearnResearch=research.publicPlatformResearch.find(platform=>platform.id==='plat-1');
  assert.ok(futureLearn);
  assert.equal(Object.hasOwn(futureLearn,'officialPaths'),false);
  assert.ok(futureLearnResearch);
  assert.ok(Array.isArray(futureLearnResearch.officialPaths));
  assert.ok(futureLearnResearch.officialPaths.length>0);
});
