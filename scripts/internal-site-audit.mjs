import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE='https://aasimaltomi.github.io/devmyskilla.github.io/';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
const page=await context.newPage();
const paths=['','index.html','explore.html','course.html','offline.html','admin/',...Array.from({length:40},(_,i)=>`platform.html?id=plat-${i+1}&lang=ar`)];
const pages=[];const internal=new Set();
for(const path of paths){
  const url=new URL(path,BASE).href;
  let status=0,error='';
  try{
    const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});status=res?.status()||0;await page.waitForTimeout(path.startsWith('platform')?250:100);
  }catch(e){error=String(e)}
  const dupIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return [...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))]});
  const hrefs=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.href));
  for(const href of hrefs){try{const u=new URL(href);if(u.origin===new URL(BASE).origin&&u.pathname.startsWith(new URL(BASE).pathname))internal.add(u.href.split('#')[0]);}catch{}}
  pages.push({path,url,status,error,duplicateIds:dupIds,anchorCount:hrefs.length});
}
// Include known static endpoints not necessarily linked.
for(const p of ['manifest.webmanifest','sw.js','data.json','admin/config.yml','robots.txt','sitemap.xml'])internal.add(new URL(p,BASE).href);
const checked=[];
for(const url of [...internal].sort()){
  try{const r=await context.request.get(url,{timeout:20000,failOnStatusCode:false});checked.push({url,status:r.status(),ok:r.status()>=200&&r.status()<400});}
  catch(e){checked.push({url,status:0,ok:false,error:String(e)})}
}
const report={generatedAt:new Date().toISOString(),pages,internalLinks:checked,summary:{pagesTotal:pages.length,pagesNon2xx:pages.filter(x=>x.status<200||x.status>=400).length,pagesWithDuplicateIds:pages.filter(x=>x.duplicateIds.length).length,uniqueInternalUrls:checked.length,brokenInternalUrls:checked.filter(x=>!x.ok).length},brokenInternal:checked.filter(x=>!x.ok)};
fs.writeFileSync('internal-site-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report.summary,null,2));
for(const p of pages.filter(x=>x.status<200||x.status>=400||x.duplicateIds.length))console.log('PAGE_ISSUE',JSON.stringify(p));
for(const x of report.brokenInternal)console.log('BROKEN_INTERNAL',JSON.stringify(x));
await context.close();await browser.close();
