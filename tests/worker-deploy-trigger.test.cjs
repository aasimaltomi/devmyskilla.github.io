const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const workflow = fs.readFileSync('.github/workflows/deploy-inline-worker.yml', 'utf8');

test('inline editor Worker deploys automatically from main when Worker files change', () => {
  assert.match(workflow, /push:\s*\n\s*branches:\s*\[?\s*main\s*\]?/m);
  assert.match(workflow, /paths:\s*\n\s*-\s*['"]?inline-worker\/\*\*['"]?/m);
});

test('inline editor Worker can still be deployed manually', () => {
  assert.match(workflow, /workflow_dispatch:/);
});
