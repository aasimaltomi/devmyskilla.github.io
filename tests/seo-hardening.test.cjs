const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const BASE='https://aasimaltomi.github.io/devmyskilla.github.io';

test('crawlable entry pages expose static title description and canonical metadata',()=>{
  const expectations={
    'index.html':`${BASE}/`,
    'explore.html':`${BASE}/explore.html`,
    'platform.html':`${BASE}/platform.html`
  };
  for(const [file,canonical] of Object.entries(expectations)){
    const html=read(file);
    assert.doesNotMatch(html,/<title>\s*<\/title>/);
    assert.doesNotMatch(html,/<meta\s+name="description"\s+content="">/);
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`),`${file} canonical`);
    assert.match(html,/property="og:title" content="[^"]+"/);
    assert.match(html,/property="og:description" content="[^"]+"/);
    assert.match(html,/property="og:url" content="https:\/\/aasimaltomi\.github\.io\/devmyskilla\.github\.io/);
  }
});

test('robots and sitemap expose the current project site and all 40 platform URLs',()=>{
  assert.equal(fs.existsSync('robots.txt'),true);
  assert.equal(fs.existsSync('sitemap.xml'),true);
  const robots=read('robots.txt');
  const sitemap=read('sitemap.xml');
  assert.ok(robots.includes(`Sitemap: ${BASE}/sitemap.xml`));
  assert.ok(robots.includes('Disallow: /devmyskilla.github.io/admin/'));
  assert.ok(sitemap.includes(`<loc>${BASE}/</loc>`));
  assert.ok(sitemap.includes(`<loc>${BASE}/explore.html</loc>`));
  for(let i=1;i<=40;i++) assert.ok(sitemap.includes(`<loc>${BASE}/platform.html?id=plat-${i}</loc>`),`missing plat-${i}`);
});
