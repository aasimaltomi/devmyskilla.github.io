const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../data.json');
const research = require('../research-data.json');

const researchById = new Map(research.publicPlatformResearch.map(row => [row.id, row]));

test('official path fieldIds reference authoritative fields from the same public platform', () => {
  const broken = [];
  for (const platform of data.platforms) {
    const fieldIds = new Set((platform.fields || []).map(field => field.id));
    const paths = researchById.get(platform.id)?.officialPaths || [];
    for (const path of paths) {
      for (const fieldId of path.fieldIds || []) {
        if (!fieldIds.has(fieldId)) broken.push({platformId: platform.id, pathId: path.id, fieldId});
      }
    }
  }
  assert.deepEqual(broken, [], `stale officialPath fieldIds:\n${JSON.stringify(broken, null, 2)}`);
});
