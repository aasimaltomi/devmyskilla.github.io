const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const PRE_P1_DATA_JSON_BYTES = 595721;
const TARGET_MAX_BYTES = 300000;

test('public data payload remains substantially smaller than the pre-P1 corpus', () => {
  const currentBytes = fs.statSync('data.json').size;
  const reduction = 1 - currentBytes / PRE_P1_DATA_JSON_BYTES;

  assert.ok(
    currentBytes < PRE_P1_DATA_JSON_BYTES,
    `expected data.json < ${PRE_P1_DATA_JSON_BYTES} bytes, got ${currentBytes}`,
  );
  assert.ok(
    currentBytes <= TARGET_MAX_BYTES,
    `expected data.json <= ${TARGET_MAX_BYTES} bytes, got ${currentBytes}`,
  );
  assert.ok(
    reduction >= 0.5,
    `expected at least 50% reduction, got ${(reduction * 100).toFixed(1)}%`,
  );

  console.log(
    `data.json: ${PRE_P1_DATA_JSON_BYTES} -> ${currentBytes} bytes (${(reduction * 100).toFixed(1)}% reduction)`,
  );
});