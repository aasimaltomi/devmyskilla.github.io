import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE='https://aasimaltomi.github.io/devmyskilla.github.io/';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
const page=await context.newPage();
const consoleErrors=[];const pageErrors=[];const failedRequests=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText||''}));
await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
await page.evaluate(async()=>{if('serviceWorker' in navigator){await navigator.serviceWorker.ready;}});
await page.waitForTimeout(1000);
await context.setOffline(true);
let navigationError='';
try{await page.goto(BASE+'platform.html?id=plat-1&lang=ar',{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(1500);}catch(e){navigationError=String(e)}
const h1=(await page.locator('#platformProfile h1').textContent().catch(()=>''))?.trim()||'';
const categoryCount=await page.locator('#platformProfile .profile-field-link').count().catch(()=>0);
const result={h1,categoryCount,expectedCategoryCount:14,consoleErrors,pageErrors,failedRequests,navigationError,ok:Boolean(h1)&&categoryCount===14&&pageErrors.length===0};
fs.writeFileSync('offline-platform-audit.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await context.close();await browser.close();
