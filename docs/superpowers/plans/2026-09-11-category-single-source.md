# Category Single-Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `data.json` the only production and CMS source for public platform categories/fields while preserving the exact currently rendered taxonomy and final official URLs for `plat-1` through `plat-40`.

**Architecture:** Freeze the current effective runtime category output as a migration fixture, materialize that exact output into `data.json`, then remove all post-load category mutation scripts from production. Regression tests will compare every public platform field against the frozen baseline and enforce that production pages and the Service Worker no longer load or precache category override modules.

**Tech Stack:** Static HTML/CSS/JavaScript, Node 22 built-in test runner, JSON, Decap CMS, GitHub Actions, GitHub Pages Service Worker.

**Spec:** `docs/superpowers/specs/2026-09-10-category-single-source-design.md`

## Global Constraints

- Public catalog remains `plat-1` through `plat-40` only.
- Visible category set remains exactly 363 categories across the same approved platforms.
- Existing field IDs, Arabic/English/Turkish names, and final destination URLs remain equivalent to the pre-migration effective runtime output.
- Platforms intentionally having zero official categories remain at zero.
- Learning-path UI remains suppressed and is out of scope.
- Platforms 41+ are not promoted into the public catalog.
- No category is invented, renamed, removed, or broadened during this migration.
- `public-data.json` is explicitly out of scope for this change.

---

### Task 1: Freeze the pre-migration effective category baseline

**Files:**
- Create: `tests/fixtures/category-effective-baseline.json`
- Create: `tests/category-single-source.test.cjs`
- Temporary migration-only workflow: `.github/workflows/category-single-source-migration.yml`

**Interfaces:**
- Consumes: `data.json`, legacy `PlatformCategories*` modules, and `CategoryDirectLinks.applyToData(data)`.
- Produces: a deterministic baseline fixture keyed by public platform ID, where each value is the effective `fields` array after applying the current production mutation order.

- [ ] **Step 1: Create a temporary baseline-capture workflow** that checks out `refactor/category-single-source`, loads `data.json`, applies `PlatformCategories`, `PlatformCategories1020`, `PlatformCategories2130`, `PlatformCategories3140` when the module exports `applyToData`, then applies `CategoryDirectLinks.applyToData`, filters to `plat-1` through `plat-40`, and writes only `{ platformId: fields[] }` to `tests/fixtures/category-effective-baseline.json` with stable pretty JSON formatting.
- [ ] **Step 2: Commit the generated fixture** on the feature branch and print the total field count plus per-platform counts in the workflow log. Expected total: `363`.
- [ ] **Step 3: Add the RED architecture test** `tests/category-single-source.test.cjs`. It must read the fixture and `data.json`, compare all public `platform.fields` arrays to the baseline, assert total fields are exactly `363`, assert duplicate field IDs do not exist within a platform, and assert `platform.html` still contains none of the legacy category override script names only after migration.

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/category-effective-baseline.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'platform.html'), 'utf8');

const publicPlatforms = data.platforms.filter(p => /^plat-(?:[1-9]|[1-3][0-9]|40)$/.test(String(p.id || '')));
const byId = Object.fromEntries(publicPlatforms.map(p => [p.id, p]));

test('data.json is the authoritative public category source', () => {
  assert.equal(Object.values(baseline).reduce((n, fields) => n + fields.length, 0), 363);
  for (const [id, fields] of Object.entries(baseline)) {
    assert.deepEqual(byId[id]?.fields || [], fields, `${id} fields differ from frozen runtime baseline`);
  }
});

test('production page does not load category mutation scripts', () => {
  for (const name of ['platform-categories.js','platform-categories-10-20.js','platform-categories-21-30.js','platform-categories-31-40.js','category-direct-links.js']) {
    assert.equal(html.includes(name), false, `${name} is still loaded by platform.html`);
  }
});
```

- [ ] **Step 4: Run** `node --test tests/category-single-source.test.cjs` through GitHub Actions. Expected: FAIL before migration because current `data.json` is not identical to the effective runtime baseline and `platform.html` still loads legacy scripts.
- [ ] **Step 5: Commit** the fixture and RED test with `test: freeze effective category runtime baseline`.

### Task 2: Materialize effective fields into data.json

**Files:**
- Modify: `data.json` (`platforms[].fields` only for `plat-1` through `plat-40`)
- Temporary workflow: `.github/workflows/category-single-source-migration.yml`

**Interfaces:**
- Consumes: `tests/fixtures/category-effective-baseline.json`.
- Produces: `data.json` whose public platform `fields` arrays exactly equal the frozen baseline.

- [ ] **Step 1: In the temporary workflow, load `data.json` and the frozen baseline.** Replace only `fields` for IDs present in the fixture. Preserve every other property by spreading the existing platform object and assigning `fields: baseline[platform.id]`.

```js
const next = {
  ...data,
  platforms: data.platforms.map(platform => baseline[platform.id]
    ? { ...platform, fields: baseline[platform.id] }
    : platform)
};
```

- [ ] **Step 2: Serialize with the repository's existing JSON formatting convention** and commit only `data.json` from this transformation.
- [ ] **Step 3: Run a migration integrity script** that compares the parsed pre/post JSON after deleting only `fields` from `plat-1` through `plat-40`; all remaining content must be deep-equal. It must also assert platforms 41+ are byte-semantically unchanged after parse/stringify.
- [ ] **Step 4: Run the first parity test again.** The `data.json` parity assertion must PASS; the production-script assertion should remain RED until Task 3.
- [ ] **Step 5: Commit** with `refactor: materialize effective categories in data json`.

### Task 3: Remove category mutation layers from production

**Files:**
- Modify: `platform.html`
- Modify: `sw.js`
- Modify/update tests that reference the legacy modules as runtime requirements.
- Delete after dependency scan: `js/platform-categories.js`
- Delete after dependency scan: `js/platform-categories-10-20.js`
- Delete after dependency scan: `js/platform-categories-21-30.js`
- Delete after dependency scan: `js/platform-categories-31-40.js`
- Delete after dependency scan: `js/category-direct-links.js`

**Interfaces:**
- Consumes: authoritative `platforms[].fields` from `DataLoader.loadSiteData()`.
- Produces: runtime flow `data.json -> DataLoader.validate() -> DataLoader.publicCatalog() -> platform normalization/rendering`, with no post-load field mutation.

- [ ] **Step 1: Remove the five legacy script tags from `platform.html`.** Keep `data-loader.js`, `platform-core.js`, `platform-detail.js`, and other unrelated scripts in their existing order.
- [ ] **Step 2: Remove the five legacy filenames from `sw.js` `CORE` precache.** Do not change navigation fallback semantics introduced in PR #12.
- [ ] **Step 3: Search the repository for** `PlatformCategories`, `PlatformCategories1020`, `PlatformCategories2130`, `PlatformCategories3140`, `CategoryDirectLinks`, and the five legacy filenames. Classify each remaining hit as a migration test, stale test, documentation reference, or production dependency.
- [ ] **Step 4: Update category/link tests to read `data.json` authoritative fields.** Tests that formerly required an override module must locate the public platform by ID and inspect its `fields`; preserve all existing count/name/HTTPS/direct-destination assertions.
- [ ] **Step 5: Delete the five legacy JavaScript files only when repository search proves there is no production dependency and no test still needs them.**
- [ ] **Step 6: Run** `node --test tests/category-single-source.test.cjs` and the existing category audit/link suites. Expected: PASS, including exact 363 parity.
- [ ] **Step 7: Commit** with `refactor: remove runtime category overrides`.

### Task 4: Make Decap CMS field editing explicitly authoritative

**Files:**
- Modify if required: `scripts/generate-decap-config.cjs`
- Regenerate if required: `admin/config.yml`
- Modify/create test: `tests/decap-cms.test.cjs` or `tests/category-single-source.test.cjs`

**Interfaces:**
- Consumes: `platforms[].fields[]` with `{ id, name: { ar, en, tr }, officialUrl }`.
- Produces: Decap fields that can edit those exact properties in `data.json` without a hidden runtime replacement layer.

- [ ] **Step 1: Inspect the generated Decap platform schema** and assert it exposes platform `fields` as a list/object structure containing `id`, multilingual `name.ar/name.en/name.tr`, and `officialUrl`.
- [ ] **Step 2: If the schema is incomplete, write a failing Decap regression assertion** before changing the generator.
- [ ] **Step 3: Modify `scripts/generate-decap-config.cjs` minimally** so the existing platform fields array is editable with stable IDs and multilingual names; do not add a second data file.
- [ ] **Step 4: Regenerate `admin/config.yml` using the repository generator and run** `node scripts/generate-decap-config.cjs --check`.
- [ ] **Step 5: Run CMS validation tests and commit** with `fix: make cms platform fields authoritative` only if a generator/config change was necessary.

### Task 5: Clean migration tooling and verify release readiness

**Files:**
- Delete: `.github/workflows/category-single-source-migration.yml`
- Delete any migration-only helper not required by production/tests.
- Keep: `tests/fixtures/category-effective-baseline.json` as a regression contract unless it creates unnecessary duplication after final review.
- Keep: `tests/category-single-source.test.cjs`.

**Interfaces:**
- Consumes: completed single-source implementation.
- Produces: a clean PR containing only production, permanent test, fixture, spec, and plan changes.

- [ ] **Step 1: Delete temporary migration workflow/helper files.** Confirm `.github/workflows` contains only permanent workflows.
- [ ] **Step 2: Run full CI**: Node tests, JavaScript syntax, CMS validation, research completeness, Decap `--check`, legacy Supabase guard, and branch diff hygiene.
- [ ] **Step 3: Run release smoke checks** for representative platforms covering direct-link behavior, static links, and zero-category platforms. Minimum representatives: `plat-3`, `plat-19`, `plat-31`, and one approved zero-category platform.
- [ ] **Step 4: Compare branch against `main`.** Verify platform scope remains 1-40 publicly, `officialPaths` UI remains suppressed, and no unrelated settings/research/internal-platform data changed.
- [ ] **Step 5: Review the final diff, open a PR, wait for PR CI, and merge only when green.** Prefer squash merge so migration-only commit noise does not enter `main`.
- [ ] **Step 6: Verify `main` CI and GitHub Pages deployment succeed on the merge SHA.** Confirm the production `platform.html` no longer includes any legacy category override filename.
