const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../data.json');

const publicPattern = /^plat-(?:[1-9]|[1-3][0-9]|40)$/;

test('official path fieldIds reference authoritative fields from the same public platform', () => {
  const broken = [];
  for (const platform of data.platforms.filter(p => publicPattern.test(String(p && p.id || '')))) {
    const fieldIds = new Set((platform.fields || []).map(field => field.id));
    for (const path of platform.officialPaths || []) {
      for (const fieldId of path.fieldIds || []) {
        if (!fieldIds.has(fieldId)) broken.push({platformId: platform.id, pathId: path.id, fieldId});
      }
    }
  }
  assert.deepEqual(broken, [], `stale officialPath fieldIds:\n${JSON.stringify(broken, null, 2)}`);
});
