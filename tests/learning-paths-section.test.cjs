const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');

test('explore page exposes a dedicated official learning paths section',()=>{
  const html=fs.readFileSync(path.join(root,'explore.html'),'utf8');
  assert.match(html,/id="learningPaths"/);
  assert.match(html,/id="officialPathGrid"/);
  assert.match(html,/js\/path-approvals\.js/);
  assert.match(html,/js\/learning-paths-section\.js/);
});

test('manual approval list exposes FutureLearn paths but not unapproved platforms',()=>{
  const modulePath=path.join(root,'js','path-approvals.js');
  assert.equal(fs.existsSync(modulePath),true,'path approval module must exist');
  const Approvals=require(modulePath);
  const futureLearn={id:'plat-1',officialPaths:Array.from({length:25},(_,i)=>({id:`fl-${i+1}`,featured:false})),pathResearch:{allPathsUrl:'https://www.futurelearn.com/experttracks'}};
  const agora={id:'plat-2',officialPaths:[{id:'agora-1',featured:false}],pathResearch:{allPathsUrl:'https://agora.unicef.org/'}};
  const groups=Approvals.approvedPathGroups([futureLearn,agora],20);
  assert.deepEqual(groups.map(group=>group.platform.id),['plat-1']);
  assert.equal(groups[0].paths.length,20);
  assert.equal(groups[0].showAll,true);
  assert.equal(groups[0].allPathsUrl,'https://www.futurelearn.com/experttracks');
});
