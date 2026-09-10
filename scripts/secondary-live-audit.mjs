import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE='https://aasimaltomi.github.io/devmyskilla.github.io/';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
const page=await context.newPage();
const report={generatedAt:new Date().toISOString(),checks:[],adminConsoleErrors:[]};
const add=(name,ok,details={})=>report.checks.push({name,ok,...details});
page.on('console',m=>{if(page.url().includes('/admin/')&&m.type()==='error')report.adminConsoleErrors.push(m.text())});

// Home headers
let r=await context.request.get(BASE,{failOnStatusCode:false});
const headers=r.headers();
add('home returns 200',r.status()===200,{status:r.status()});
for(const h of ['content-type','strict-transport-security','x-content-type-options','content-security-policy','referrer-policy','permissions-policy'])add(`header ${h} present`,Boolean(headers[h]),{value:headers[h]||''});

// Legacy course redirect preserves query and hash
await page.goto(BASE+'course.html?id=plat-5&lang=tr#details',{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(200);
const courseFinal=page.url();
add('course.html redirects to platform.html',courseFinal.includes('/platform.html'),{finalUrl:courseFinal});
add('course.html preserves id/lang/hash',courseFinal.includes('id=plat-5')&&courseFinal.includes('lang=tr')&&courseFinal.endsWith('#details'),{finalUrl:courseFinal});

// Admin page and CMS load
r=await page.goto(BASE+'admin/',{waitUntil:'domcontentloaded',timeout:30000});add('admin returns 200',r?.status()===200,{status:r?.status()||0});
await page.waitForTimeout(2500);
add('admin has noindex,nofollow',(await page.getAttribute('meta[name="robots"]','content'))==='noindex,nofollow',{robots:await page.getAttribute('meta[name="robots"]','content')});
const directHref=await page.getAttribute('a.direct-edit','href');add('admin direct edit points to edit mode',Boolean(directHref&&directHref.includes('?edit=1')),{href:directHref});
const cmsScript=await context.request.get('https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js',{failOnStatusCode:false,timeout:30000});add('Decap CMS CDN script is reachable',cmsScript.status()>=200&&cmsScript.status()<400,{status:cmsScript.status()});
add('admin page has no browser console errors',report.adminConsoleErrors.length===0,{errors:report.adminConsoleErrors});

// Admin config identity (production-served file)
r=await context.request.get(BASE+'admin/config.yml',{failOnStatusCode:false});const cfg=await r.text();
add('admin config targets current GitHub repo',cfg.includes('repo: aasimaltomi/devmyskilla.github.io'),{current:cfg.match(/^\s*repo:\s*(.+)$/m)?.[1]||''});
add('admin config targets current Pages URL',cfg.includes('site_url: https://aasimaltomi.github.io/devmyskilla.github.io'),{current:cfg.match(/^\s*site_url:\s*(.+)$/m)?.[1]||''});

// Edit mode shell
r=await page.goto(BASE+'?edit=1',{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(500);
add('edit mode home returns 200',r?.status()===200,{status:r?.status()||0});
const editText=(await page.locator('body').innerText()).slice(0,3000);add('edit mode exposes editor UI',/edit|تحرير|تعديل|sign in|تسجيل/i.test(editText),{sample:editText.slice(0,300)});

// 404 behavior
r=await context.request.get(BASE+'__definitely_missing__.html',{failOnStatusCode:false});add('unknown page returns real 404',r.status()===404,{status:r.status()});

report.summary={passed:report.checks.filter(x=>x.ok).length,failed:report.checks.filter(x=>!x.ok).length,total:report.checks.length};
fs.writeFileSync('secondary-live-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary,null,2));for(const c of report.checks.filter(x=>!x.ok))console.log('FAIL',c.name,JSON.stringify(c));
await context.close();await browser.close();
