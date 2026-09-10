import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE='https://aasimaltomi.github.io/devmyskilla.github.io/';
const expectedCounts={1:14,2:6,3:11,4:15,5:6,6:25,7:27,8:37,9:6,10:23,11:0,12:6,13:6,14:9,15:9,16:6,17:5,18:5,19:21,20:9,21:6,22:0,23:0,24:9,25:7,26:11,27:14,28:9,29:7,30:0,31:11,32:8,33:0,34:7,35:15,36:9,37:0,38:4,39:0,40:0};
const report={base:BASE,startedAt:new Date().toISOString(),checks:[],consoleErrors:[],pageErrors:[],failedRequests:[],badResponses:[],platforms:[]};
const add=(name,ok,details={})=>report.checks.push({name,ok,...details});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'allow'});
const page=await context.newPage();
page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({url:page.url(),text:m.text()})});
page.on('pageerror',e=>report.pageErrors.push({url:page.url(),text:String(e)}));
page.on('requestfailed',r=>{if(r.url().startsWith(BASE))report.failedRequests.push({url:r.url(),failure:r.failure()?.errorText||''})});
page.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()>=400)report.badResponses.push({url:r.url(),status:r.status()})});

async function goto(path){const r=await page.goto(new URL(path,BASE).href,{waitUntil:'domcontentloaded',timeout:30000});return r?.status()||0}
async function waitText(sel,timeout=15000){await page.waitForFunction(s=>{const e=document.querySelector(s);return e&&e.textContent&&e.textContent.trim()&&!/^0$/.test(e.textContent.trim())},sel,{timeout});}

// Home desktop + runtime metadata/languages/theme
let status=await goto('index.html');
add('home responds 200',status===200,{status});
try{await waitText('#landingStatPlatforms')}catch{}
add('home renders 40 public platforms',(await page.textContent('#landingStatPlatforms'))?.trim()==='40',{value:(await page.textContent('#landingStatPlatforms'))?.trim()});
add('home renders category cards',await page.locator('#landingCategoryGrid .category-card').count()>0,{count:await page.locator('#landingCategoryGrid .category-card').count()});
const title=await page.title(); const desc=await page.getAttribute('meta[name="description"]','content');
add('runtime SEO title is populated',Boolean(title?.trim()),{title});
add('runtime SEO description is populated',Boolean(desc?.trim()),{description:desc});
const langValues=await page.locator('#langSwitcher option').evaluateAll(os=>os.map(o=>o.value));
add('language switcher exposes ar/en/tr',['ar','en','tr'].every(v=>langValues.includes(v)),{values:langValues});
for(const lang of ['en','tr','ar']){
  await page.selectOption('#langSwitcher',lang); await page.waitForTimeout(150);
  const html=await page.locator('html').evaluate(e=>({lang:e.lang,dir:e.dir}));
  add(`home language ${lang} applies direction`,html.lang===lang&&html.dir===(lang==='ar'?'rtl':'ltr'),html);
}
const beforeTheme=await page.locator('html').getAttribute('data-theme'); await page.click('#themeToggle'); await page.waitForTimeout(100); const afterTheme=await page.locator('html').getAttribute('data-theme');
add('theme toggle changes theme',beforeTheme!==afterTheme,{beforeTheme,afterTheme});

// Explore core flows
await page.evaluate(()=>localStorage.clear());
status=await goto('explore.html');
add('explore responds 200',status===200,{status});
try{await page.waitForFunction(()=>document.querySelectorAll('#platformGrid .platform-card').length===40,{timeout:15000})}catch{}
add('explore initially renders 40 cards',await page.locator('#platformGrid .platform-card').count()===40,{count:await page.locator('#platformGrid .platform-card').count()});
add('official learning paths section is hidden',!(await page.locator('#learningPaths').isVisible()).valueOf());
await page.fill('#searchInput','Coursera'); await page.waitForTimeout(250); let filtered=await page.locator('#platformGrid .platform-card').count();
add('search filters directory',filtered>0&&filtered<40,{count:filtered,text:await page.locator('#platformGrid').innerText()});
await page.click('#resetFilters'); await page.waitForTimeout(200);
const categoryOpts=await page.locator('#filterCategory option').evaluateAll(os=>os.map(o=>o.value).filter(Boolean));
if(categoryOpts.length){await page.selectOption('#filterCategory',categoryOpts[0]);await page.waitForTimeout(200);filtered=await page.locator('#platformGrid .platform-card').count();add('category filter works',filtered>0&&filtered<40,{category:categoryOpts[0],count:filtered});}
await page.click('#resetFilters');await page.check('#filterFree');await page.waitForTimeout(200);filtered=await page.locator('#platformGrid .platform-card').count();add('free-only filter works',filtered>0&&filtered<=40,{count:filtered});
await page.click('#resetFilters');
const firstId=await page.locator('#platformGrid .platform-card').first().getAttribute('data-id');
await page.locator(`#platformGrid .platform-card[data-id="${firstId}"] [data-action="favorite"]`).click();
await page.locator('.tab-btn[data-tab="favorites"]').click();await page.waitForTimeout(150);
add('favorite persists and favorites tab filters',await page.locator('#platformGrid .platform-card').count()===1&&await page.locator('#platformGrid .platform-card').first().getAttribute('data-id')===firstId,{firstId,count:await page.locator('#platformGrid .platform-card').count()});
await page.locator('.tab-btn[data-tab="all"]').click();await page.waitForTimeout(100);
const compareBtns=page.locator('#platformGrid .platform-card [data-action="compare"]'); await compareBtns.nth(0).click(); await compareBtns.nth(1).click();await page.waitForTimeout(150);
add('compare dock shows two selections',(await page.textContent('#compareCount'))?.trim()==='2/3'&&await page.locator('#compareDock').evaluate(e=>e.classList.contains('show')),{count:(await page.textContent('#compareCount'))?.trim()});
await page.click('#compareNow');await page.waitForTimeout(100);add('compare modal opens with table',await page.locator('#compareModal').getAttribute('aria-hidden')==='false'&&await page.locator('#compareTable table').count()===1);
await page.locator('#compareModal [data-close="compareModal"]').click();
await page.click('#heroQuizBtn');await page.waitForTimeout(100);add('quiz modal opens',await page.locator('#quizModal').getAttribute('aria-hidden')==='false');
const quizClose=page.locator('#quizModal [data-close="quizModal"]');await quizClose.click();await page.waitForTimeout(50);add('modal close restores focus to opener',(await page.evaluate(()=>document.activeElement?.id))==='heroQuizBtn',{activeElement:await page.evaluate(()=>document.activeElement?.id||document.activeElement?.tagName)});
// Keyboard tab behavior
const firstTab=page.locator('.tab-btn').first();await firstTab.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(50);add('tabs support arrow-key focus navigation',(await page.evaluate(()=>document.activeElement?.getAttribute('data-tab')))!=='all',{activeTab:await page.evaluate(()=>document.activeElement?.getAttribute('data-tab'))});
// Icon-only accessible names
const iconNames=await page.locator('#platformGrid .card-icon-actions button').evaluateAll(btns=>btns.slice(0,4).map(b=>({text:(b.textContent||'').trim(),aria:b.getAttribute('aria-label'),title:b.getAttribute('title')})));
add('card icon actions have descriptive accessible labels',iconNames.every(x=>Boolean(x.aria||x.title)),{sample:iconNames});

// All platform pages and expected category counts
await page.evaluate(()=>localStorage.clear());
for(let i=1;i<=40;i++){
  const s=await goto(`platform.html?id=plat-${i}&lang=ar`);
  try{await page.waitForSelector('#platformProfile h1',{timeout:10000})}catch{}
  const h1=(await page.locator('#platformProfile h1').textContent().catch(()=>''))?.trim()||'';
  const links=await page.locator('#platformProfile .profile-field-link').count();
  const pathsVisible=await page.locator('#platformProfile .profile-paths-section').isVisible().catch(()=>false);
  const hrefs=await page.locator('#platformProfile .profile-field-link').evaluateAll(as=>as.map(a=>a.href));
  const ok=s===200&&Boolean(h1)&&links===expectedCounts[i]&&!pathsVisible&&hrefs.every(h=>h.startsWith('https://'));
  report.platforms.push({id:`plat-${i}`,status:s,name:h1,categoryLinks:links,expectedCategoryLinks:expectedCounts[i],pathsVisible,allHttps:hrefs.every(h=>h.startsWith('https://')),ok});
}
add('all 40 platform pages render expected categories',report.platforms.every(x=>x.ok),{failed:report.platforms.filter(x=>!x.ok)});
// language query behavior on platform detail
await goto('platform.html?id=plat-1&lang=en');try{await page.waitForSelector('#platformProfile h1',{timeout:10000})}catch{};let htmlState=await page.locator('html').evaluate(e=>({lang:e.lang,dir:e.dir}));add('platform ?lang=en applies LTR',htmlState.lang==='en'&&htmlState.dir==='ltr',htmlState);
await goto('platform.html?id=plat-1&lang=tr');try{await page.waitForSelector('#platformProfile h1',{timeout:10000})}catch{};htmlState=await page.locator('html').evaluate(e=>({lang:e.lang,dir:e.dir}));add('platform ?lang=tr applies LTR',htmlState.lang==='tr'&&htmlState.dir==='ltr',htmlState);

// Mobile navigation
await page.setViewportSize({width:390,height:844});await goto('index.html');try{await waitText('#landingStatPlatforms')}catch{};
const mobileNav=await page.locator('.main-nav').evaluate(e=>getComputedStyle(e).display);const visibleMenuButtons=await page.locator('button').evaluateAll(bs=>bs.filter(b=>{const s=getComputedStyle(b);const n=((b.getAttribute('aria-label')||'')+' '+(b.textContent||'')).toLowerCase();return s.display!=='none'&&s.visibility!=='hidden'&&/(menu|القائمة|menü)/i.test(n)}).length);
add('mobile has an alternative navigation control',mobileNav!=='none'||visibleMenuButtons>0,{mainNavDisplay:mobileNav,visibleMenuButtons});

// PWA / static SEO resources
const req=context.request;
for(const path of ['manifest.webmanifest','sw.js','robots.txt','sitemap.xml']){const r=await req.get(new URL(path,BASE).href);add(`${path} is available`,r.status()===200,{status:r.status()});if(path==='manifest.webmanifest'&&r.status()===200){const m=await r.json();const sizes=(m.icons||[]).map(x=>x.sizes);add('manifest includes 192 and 512 icons',sizes.some(x=>String(x).includes('192'))&&sizes.some(x=>String(x).includes('512')),{sizes});}}
const source=await (await req.get(new URL('index.html',BASE).href)).text();
add('static home title is non-empty',!/<title>\s*<\/title>/i.test(source));
add('static meta description is non-empty',!/<meta\s+name="description"\s+content=""/i.test(source));
add('static canonical link exists',/rel=["']canonical["']/i.test(source));

// Offline cold platform navigation after only home precache
const offlineContext=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});const offlinePage=await offlineContext.newPage();await offlinePage.goto(BASE,{waitUntil:'networkidle',timeout:30000});
try{await offlinePage.evaluate(()=>navigator.serviceWorker?.ready);await offlinePage.waitForTimeout(500)}catch{}
await offlineContext.setOffline(true);let offlineOk=false;let offlineDetail='';try{await offlinePage.goto(new URL('platform.html?id=plat-1&lang=ar',BASE).href,{waitUntil:'domcontentloaded',timeout:15000});await offlinePage.waitForTimeout(1000);offlineDetail=(await offlinePage.locator('#platformProfile h1').textContent().catch(()=>''))?.trim()||'';offlineOk=Boolean(offlineDetail)}catch(e){offlineDetail=String(e)}
add('PWA can open a platform cold while offline after home install',offlineOk,{detail:offlineDetail});await offlineContext.close();

report.finishedAt=new Date().toISOString();report.summary={passed:report.checks.filter(x=>x.ok).length,failed:report.checks.filter(x=>!x.ok).length,total:report.checks.length,platformsOk:report.platforms.filter(x=>x.ok).length,platformsFailed:report.platforms.filter(x=>!x.ok).length,consoleErrors:report.consoleErrors.length,pageErrors:report.pageErrors.length,failedRequests:report.failedRequests.length,badResponses:report.badResponses.length};
fs.writeFileSync('live-ui-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary,null,2));for(const c of report.checks.filter(x=>!x.ok))console.log('FAIL',c.name,JSON.stringify(c));
await context.close();await browser.close();