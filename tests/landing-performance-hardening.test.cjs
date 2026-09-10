const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const css=fs.readFileSync('css/landing.css','utf8');
const stability=fs.readFileSync('css/branding.css','utf8');

test('landing reserves critical dynamic geometry before data hydration',()=>{
  assert.match(css,/\.landing-copy\s*\{[^}]*min-height:/);
  assert.match(css,/#landingCategoryGrid\s*\{[^}]*min-height:/);
  assert.match(css,/\.landing-heading\s*\{[^}]*min-height:/);
});

test('below-fold landing sections can skip initial rendering safely',()=>{
  assert.match(css,/\.landing-section\s*\{[^}]*content-visibility:auto/);
  assert.match(css,/contain-intrinsic-size:/);
});

test('hydrated hero copy can shrink inside its grid track without horizontal document overflow',()=>{
  assert.match(stability,/\.hero-copy\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%/);
});

test('mobile landing hero reserves translated text blocks so CTAs do not move after hydration',()=>{
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s*\{[^}]*min-height:\s*620px[^}]*display:\s*flex[^}]*flex-direction:\s*column/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s+\.eyebrow\s*\{[^}]*min-height:\s*36px/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s+h1\s*\{[^}]*min-height:\s*136px/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s*>\s*p\s*\{[^}]*min-height:\s*105px/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-actions\s*\{[^}]*margin-top:\s*auto[^}]*min-height:\s*112px/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-actions\s+\.btn\s*\{[^}]*flex:\s*1\s+1\s+100%/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.trust-line\s*\{[^}]*min-height:\s*20px/);
});

test('mobile explore hero reserves translated text and controls before hydration',()=>{
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-copy\s*\{[^}]*min-height:\s*620px/);
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-copy\s+\.eyebrow\s*\{[^}]*min-height:\s*36px/);
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-copy\s+h1\s*\{[^}]*min-height:\s*86px/);
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-copy\s*>\s*p\s*\{[^}]*min-height:\s*46px/);
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.quick-filter-chips\s*\{[^}]*min-height:\s*37px/);
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-actions\s*\{[^}]*min-height:\s*103px/);
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.trust-line\s*\{[^}]*min-height:\s*20px/);
});

test('public pages avoid external web-font swaps while layout is stabilized',()=>{
  for(const page of ['index.html','explore.html','platform.html']){
    const html=fs.readFileSync(page,'utf8');
    assert.doesNotMatch(html,/fonts\.googleapis\.com|fonts\.gstatic\.com/);
  }
});
