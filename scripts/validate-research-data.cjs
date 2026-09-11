const fs = require('node:fs');
const path = require('node:path');
const { validatePlatformPathData } = require('./content-schema.cjs');

const PUBLIC_IDS = Object.freeze(Array.from({length: 40}, (_, i) => `plat-${i + 1}`));
const ALL_IDS = Object.freeze(Array.from({length: 110}, (_, i) => `plat-${i + 1}`));
const PUBLIC_ID_SET = new Set(PUBLIC_IDS);

function assert(condition, message){ if (!condition) throw new Error(message); }
function isObject(value){ return value && typeof value === 'object' && !Array.isArray(value); }

function reconstructPlatforms(publicData, researchData){
  assert(isObject(publicData), 'data.json must contain an object');
  assert(Array.isArray(publicData.platforms), 'data.json platforms must be an array');
  assert(isObject(researchData), 'research-data.json must contain an object');
  assert(Array.isArray(researchData.publicPlatformResearch), 'publicPlatformResearch must be an array');
  assert(Array.isArray(researchData.nonPublicPlatforms), 'nonPublicPlatforms must be an array');

  const publicIds = publicData.platforms.map(row => row && row.id);
  assert(JSON.stringify(publicIds) === JSON.stringify(PUBLIC_IDS), 'data.json must contain exactly plat-1 through plat-40 in order');
  const researchIds = researchData.publicPlatformResearch.map(row => row && row.id);
  assert(JSON.stringify(researchIds) === JSON.stringify(PUBLIC_IDS), 'publicPlatformResearch must contain exactly plat-1 through plat-40 in order');

  const researchById = new Map();
  for (const row of researchData.publicPlatformResearch) {
    assert(isObject(row), 'public research row must be an object');
    assert(!Object.hasOwn(row, 'fields'), `${row.id}: research row must not duplicate public fields`);
    assert(Array.isArray(row.officialPaths), `${row.id}: officialPaths must be an array`);
    assert(isObject(row.pathResearch), `${row.id}: pathResearch must be an object`);
    assert(!researchById.has(row.id), `${row.id}: duplicate public research id`);
    researchById.set(row.id, row);
  }

  const publicMerged = publicData.platforms.map(platform => {
    const research = researchById.get(platform.id);
    assert(research, `${platform.id}: missing public research row`);
    const merged = {
      ...structuredClone(platform),
      officialPaths: structuredClone(research.officialPaths),
      pathResearch: structuredClone(research.pathResearch),
    };
    validatePlatformPathData(merged);
    return merged;
  });

  const nonPublic = researchData.nonPublicPlatforms.map(row => structuredClone(row));
  for (const row of nonPublic) {
    assert(isObject(row), 'non-public platform must be an object');
    assert(!PUBLIC_ID_SET.has(row.id), `${row.id}: public platform duplicated in nonPublicPlatforms`);
    validatePlatformPathData(row);
  }

  const all = [...publicMerged, ...nonPublic];
  const allIds = all.map(row => row && row.id);
  assert(JSON.stringify(allIds) === JSON.stringify(ALL_IDS), 'reconstructed research corpus must contain exactly plat-1 through plat-110 in order');

  const categoryIds = new Set((publicData.categories || []).map(row => row.id));
  const languageIds = new Set((publicData.languages || []).map(row => row.id));
  for (const row of all) {
    assert(categoryIds.has(row.categoryId), `${row.id}: unknown categoryId ${row.categoryId}`);
    for (const id of row.languageIds || []) assert(languageIds.has(id), `${row.id}: unknown languageId ${id}`);
  }
  return all;
}

function loadSplitData(root = path.resolve(__dirname, '..')){
  const publicData = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
  const researchData = JSON.parse(fs.readFileSync(path.join(root, 'research-data.json'), 'utf8'));
  return { publicData, researchData };
}

function run(root){
  const { publicData, researchData } = loadSplitData(root);
  const platforms = reconstructPlatforms(publicData, researchData);
  console.log(`Research content valid: ${platforms.length} platforms reconstructed (${publicData.platforms.length} public + ${researchData.nonPublicPlatforms.length} non-public)`);
  return platforms;
}

if (require.main === module) {
  try { run(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { PUBLIC_IDS, ALL_IDS, reconstructPlatforms, loadSplitData, run };
