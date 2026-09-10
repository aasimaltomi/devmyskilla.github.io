const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('responsive navigation has a keyboard-operable mobile toggle',()=>{
  const js=read('js/accessibility.js');
  const css=read('css/style.css');
  assert.match(js,/mobile-nav-toggle/);
  assert.match(js,/aria-expanded/);
  assert.match(js,/mobile-nav-open/);
  assert.match(css,/\.mobile-nav-toggle/);
  assert.match(css,/\.main-nav\.mobile-nav-open/);
});

test('tablists support arrow Home and End keyboard navigation',()=>{
  const js=read('js/accessibility.js');
  for(const key of ['ArrowRight','ArrowLeft','Home','End'])assert.ok(js.includes(key),`missing ${key}`);
  assert.match(js,/\.focus\(\)/);
});

test('open dialogs restore trigger focus and trap Tab while open',()=>{
  const app=read('js/app.js');
  const a11y=read('js/accessibility.js');
  assert.match(app,/modalReturnFocus/);
  assert.match(app,/\.isConnected/);
  assert.match(a11y,/event\.key\s*===\s*['"]Tab['"]/);
  assert.match(a11y,/\.modal\.open/);
});

test('icon-only favorite and share buttons use localized accessible names',()=>{
  const app=read('js/app.js');
  assert.match(app,/data-action="favorite"[^>]*aria-label=/);
  assert.match(app,/data-action="share"[^>]*aria-label=/);
  assert.ok(app.includes("getText('sharePlatform')"));
  assert.ok(app.includes("getText('savePlatform')"));
});
