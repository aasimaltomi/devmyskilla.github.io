const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const css=fs.readFileSync('css/landing.css','utf8');

test('landing reserves critical dynamic geometry before data hydration',()=>{
  assert.match(css,/\.landing-copy\s*\{[^}]*min-height:/);
  assert.match(css,/#landingCategoryGrid\s*\{[^}]*min-height:/);
  assert.match(css,/\.landing-heading\s*\{[^}]*min-height:/);
});

test('below-fold landing sections can skip initial rendering safely',()=>{
  assert.match(css,/\.landing-section\s*\{[^}]*content-visibility:auto/);
  assert.match(css,/contain-intrinsic-size:/);
});

test('mobile reservations adapt instead of forcing desktop whitespace',()=>{
  assert.match(css,/@media\(max-width:620px\)[\s\S]*\.landing-copy\s*\{[^}]*min-height:/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*#landingCategoryGrid\s*\{[^}]*min-height:/);
});
