import fs from 'node:fs';

const inputs=[
  ['home-mobile','lh-home-mobile.json'],
  ['explore-mobile','lh-explore-mobile.json'],
  ['platform-mobile','lh-platform-mobile.json'],
  ['home-desktop','lh-home-desktop.json'],
];
const reports={};
for(const [name,file] of inputs){
  const r=JSON.parse(fs.readFileSync(file,'utf8'));
  const score=k=>Math.round((r.categories?.[k]?.score??0)*100);
  reports[name]={
    performance:score('performance'),
    accessibility:score('accessibility'),
    bestPractices:score('best-practices'),
    seo:score('seo'),
    metrics:{
      fcp:r.audits?.['first-contentful-paint']?.displayValue||'',
      lcp:r.audits?.['largest-contentful-paint']?.displayValue||'',
      tbt:r.audits?.['total-blocking-time']?.displayValue||'',
      cls:r.audits?.['cumulative-layout-shift']?.displayValue||'',
      speedIndex:r.audits?.['speed-index']?.displayValue||''
    },
    failedAudits:Object.values(r.audits||{}).filter(a=>a?.score!==null&&a?.score<1&&a?.details?.type!=='opportunity').map(a=>({id:a.id,title:a.title,score:a.score,displayValue:a.displayValue||''})).slice(0,40)
  };
}
async function preflight(origin){
  try{
    const res=await fetch('https://dunya-inline-editor.atomy8774.workers.dev/inline/session',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'GET'}});
    return {status:res.status,allowOrigin:res.headers.get('access-control-allow-origin')||'',body:await res.text()};
  }catch(e){return {error:String(e)}}
}
const worker={
  actualOrigin:await preflight('https://aasimaltomi.github.io'),
  legacyOrigin:await preflight('https://devmyskilla.github.io')
};
const summary={generatedAt:new Date().toISOString(),reports,worker};
fs.writeFileSync('lighthouse-summary.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
