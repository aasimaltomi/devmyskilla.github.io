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

test('mobile landing reservation is large enough to keep the orbit from shifting after hydration',()=>{
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s*\{[^}]*min-height:\s*520px/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*#landingCategoryGrid\s*\{[^}]*min-height:/);
});

test('mobile landing CTAs occupy stable rows before translated labels hydrate',()=>{
  assert.match(stability,/@media\(max-width:620px\)[\s\S]*\.landing-actions\s+\.btn\s*\{[^}]*flex:\s*1\s+1\s+100%/);
});

test('mobile explore hero reserves enough hydrated copy height to avoid the measured document shift',()=>{
  assert.match(stability,/@media\(max-width:680px\)[\s\S]*\.hero-copy\s*\{[^}]*min-height:\s*620px/);
});

test('Google font loading is non-render-blocking and optional on public pages',()=>{
  for(const page of ['index.html','explore.html','platform.html']){
    const html=fs.readFileSync(page,'utf8');
    assert.match(html,/rel="preload"[^>]*as="style"[^>]*fonts\.googleapis\.com|fonts\.googleapis\.com[^>]*rel="preload"[^>]*as="style"/);
    assert.match(html,/display=optional/);
    assert.doesNotMatch(html,/<link(?=[^>]*rel="stylesheet")(?=[^>]*fonts\.googleapis\.com)[^>]*>/);
  }
});
