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

test('mobile landing hero anchors dynamic CTAs inside a reserved column',()=>{
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s*\{[^}]*min-height:\s*520px[^}]*display:\s*flex[^}]*flex-direction:\s*column/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-actions\s*\{[^}]*margin-top:\s*auto/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-actions\s+\.btn\s*\{[^}]*flex:\s*1\s+1\s+100%/);
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.trust-line\s*\{[^}]*min-height:/);
});

test('mobile explore hero reserves enough hydrated copy height',()=>{
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-copy\s*\{[^}]*min-height:\s*620px/);
});

test('public pages avoid external web-font swaps that caused measured CLS',()=>{
  for(const page of ['index.html','explore.html','platform.html']){
    const html=fs.readFileSync(page,'utf8');
    assert.doesNotMatch(html,/fonts\.googleapis\.com|fonts\.gstatic\.com/);
  }
});
