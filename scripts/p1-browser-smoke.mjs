import { chromium } from 'playwright';

const BASE = process.env.P1_SMOKE_BASE || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
const page = await context.newPage();
const researchRequests = [];
const consoleErrors = [];
const pageErrors = [];

page.on('request', request => {
  if (request.url().includes('research-data.json')) researchRequests.push(request.url());
});
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', error => pageErrors.push(String(error)));

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const goto = async path => {
  const response = await page.goto(new URL(path, BASE).href, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  check(response?.status() === 200, `${path} returned ${response?.status()}`);
};

// Home: public count and all language directions.
await goto('index.html');
await page.waitForFunction(() => document.querySelector('#landingStatPlatforms')?.textContent?.trim() === '40');
check((await page.textContent('#landingStatPlatforms'))?.trim() === '40', 'home did not render 40 public platforms');
for (const lang of ['en', 'tr', 'ar']) {
  await page.selectOption('#langSwitcher', lang);
  await page.waitForTimeout(100);
  const html = await page.locator('html').evaluate(node => ({ lang: node.lang, dir: node.dir }));
  check(html.lang === lang, `home language did not switch to ${lang}`);
  check(html.dir === (lang === 'ar' ? 'rtl' : 'ltr'), `home direction wrong for ${lang}`);
}

// Explore: directory, search, favorites and comparison.
await page.evaluate(() => localStorage.clear());
await goto('explore.html');
await page.waitForFunction(() => document.querySelectorAll('#platformGrid .platform-card').length === 40);
check(await page.locator('#platformGrid .platform-card').count() === 40, 'explore did not render 40 cards');
await page.fill('#searchInput', 'Coursera');
await page.waitForTimeout(200);
const searchCount = await page.locator('#platformGrid .platform-card').count();
check(searchCount > 0 && searchCount < 40, `search did not filter cards: ${searchCount}`);
await page.click('#resetFilters');
await page.waitForTimeout(100);
const firstCard = page.locator('#platformGrid .platform-card').first();
const firstId = await firstCard.getAttribute('data-id');
await firstCard.locator('[data-action="favorite"]').click();
await page.locator('.tab-btn[data-tab="favorites"]').click();
await page.waitForTimeout(100);
check(await page.locator('#platformGrid .platform-card').count() === 1, 'favorites tab did not isolate saved platform');
check(await page.locator('#platformGrid .platform-card').first().getAttribute('data-id') === firstId, 'favorite did not persist');
await page.locator('.tab-btn[data-tab="all"]').click();
await page.waitForTimeout(100);
const compareButtons = page.locator('#platformGrid .platform-card [data-action="compare"]');
await compareButtons.nth(0).click();
await compareButtons.nth(1).click();
await page.waitForTimeout(100);
check((await page.textContent('#compareCount'))?.trim() === '2/3', 'compare selection count is not 2/3');
await page.click('#compareNow');
check(await page.locator('#compareModal').getAttribute('aria-hidden') === 'false', 'compare modal did not open');

// Many-field and zero-field platform pages.
await goto('platform.html?id=plat-8&lang=en');
await page.waitForSelector('#platformProfile h1');
check(await page.locator('#platformProfile .profile-field-link').count() === 37, 'plat-8 category count changed');
check(!(await page.locator('#platformProfile .profile-paths-section').isVisible().catch(() => false)), 'learning paths became visible on plat-8');
let html = await page.locator('html').evaluate(node => ({ lang: node.lang, dir: node.dir }));
check(html.lang === 'en' && html.dir === 'ltr', 'plat-8 English direction changed');

await goto('platform.html?id=plat-37&lang=ar');
await page.waitForSelector('#platformProfile h1');
check(await page.locator('#platformProfile .profile-field-link').count() === 0, 'plat-37 should remain zero-field');
html = await page.locator('html').evaluate(node => ({ lang: node.lang, dir: node.dir }));
check(html.lang === 'ar' && html.dir === 'rtl', 'plat-37 Arabic direction changed');

check(researchRequests.length === 0, `public browser requested research-data.json: ${researchRequests.join(', ')}`);
check(pageErrors.length === 0, `page errors: ${pageErrors.join(' | ')}`);
check(consoleErrors.length === 0, `console errors: ${consoleErrors.join(' | ')}`);

console.log(JSON.stringify({
  ok: true,
  publicPlatforms: 40,
  plat8Fields: 37,
  plat37Fields: 0,
  researchRequests: researchRequests.length,
  consoleErrors: consoleErrors.length,
  pageErrors: pageErrors.length,
}, null, 2));

await context.close();
await browser.close();