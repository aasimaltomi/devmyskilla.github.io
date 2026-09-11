# P1 Public Data Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the public JSON payload by keeping only the 40 public platforms and runtime-required fields in `data.json`, while preserving research/non-public records in `research-data.json` and keeping the approved 363 category fields authoritative in `data.json`.

**Architecture:** `data.json` remains the only runtime payload and the only source for public platform fields/categories. Research-only properties from public platforms plus all non-public platform records move to `research-data.json`. Validators and Decap configuration understand both files, while the browser and Service Worker never request the research file.

**Tech Stack:** Static HTML/JavaScript, Node.js 22 validation/generator scripts, Decap CMS, GitHub Actions, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-11-p1-public-data-split-design.md`

## Global Constraints

- Public platform count remains exactly 40 (`plat-1` through `plat-40`).
- Approved public platform field/category count remains exactly 363.
- `platforms[].fields` remains authoritative only in `data.json`; `research-data.json` must never duplicate public `fields`.
- Field IDs, AR/EN/TR labels, and official field URLs must remain unchanged.
- Public platform identity/order and visible behavior must remain unchanged.
- Learning Paths remain hidden.
- No research data may be requested or precached by public runtime code.
- Migration must preserve all moved research/non-public data semantically.

---

### Task 1: Freeze the P1 split contract and prove RED

**Files:**
- Create: `tests/p1-public-data-split.test.cjs`
- Reuse: `tests/fixtures/category-effective-baseline.json`

**Interfaces:**
- Consumes: current `data.json` and public category baseline.
- Produces: permanent target-state assertions for the split.

- [ ] **Step 1: Write failing tests**

Create tests that require:

```js
const data = require('../data.json');
const research = require('../research-data.json');

assert.deepEqual(data.platforms.map(p => p.id), Array.from({length:40}, (_,i)=>`plat-${i+1}`));
assert.equal(data.platforms.some(p => Object.hasOwn(p, 'officialPaths') || Object.hasOwn(p, 'pathResearch')), false);
assert.equal(research.publicPlatformResearch.length, 40);
assert.equal(research.nonPublicPlatforms.length > 0, true);
assert.equal(research.publicPlatformResearch.some(p => Object.hasOwn(p, 'fields')), false);
```

Also require the existing 363-field baseline to match `data.json` and scan `index.html`, `explore.html`, `platform.html`, `js/`, `sw.js`, and `manifest.webmanifest` to ensure no runtime reference to `research-data.json`.

- [ ] **Step 2: Run RED verification**

Run:

```bash
node --test tests/p1-public-data-split.test.cjs
```

Expected: FAIL because `research-data.json` does not exist and/or `data.json` still contains research/non-public data.

- [ ] **Step 3: Commit only the RED test**

```bash
git add tests/p1-public-data-split.test.cjs
git commit -m "test: define P1 public data split contract"
```

---

### Task 2: Migrate data without loss

**Files:**
- Create: `research-data.json`
- Modify: `data.json`
- Create: `scripts/validate-research-data.cjs`
- Test: `tests/p1-public-data-split.test.cjs`
- Test: `tests/category-field-reference-integrity.test.cjs`

**Interfaces:**
- Consumes: pre-P1 `data.json`.
- Produces: lightweight public `data.json` plus preserved `research-data.json`.

- [ ] **Step 1: Build migration programmatically**

For each `plat-1..plat-40`, copy research-only values to:

```js
{
  id: platform.id,
  officialPaths: platform.officialPaths,
  pathResearch: platform.pathResearch
}
```

Then remove `officialPaths` and `pathResearch` from the public platform record. Copy every platform outside `plat-1..plat-40` unchanged into `research-data.json.nonPublicPlatforms`, then remove those records from `data.json`.

- [ ] **Step 2: Add research validator**

`validate-research-data.cjs` must validate:

```js
research.publicPlatformResearch.length === 40
new Set(research.publicPlatformResearch.map(p => p.id)).size === 40
research.nonPublicPlatforms.every(p => !/^plat-(?:[1-9]|[1-3][0-9]|40)$/.test(p.id))
```

It must load public `data.json` and reject any `officialPaths[].fieldIds` value not found in the matching public platform `fields` list.

- [ ] **Step 3: Prove semantic preservation**

Compare the migrated pair against a pre-migration snapshot/transform: reconstruct the old platform corpus by joining `research-data.json.publicPlatformResearch` back into the 40 public platform records and appending `nonPublicPlatforms`, then deep-compare normalized platform records against the frozen pre-P1 source.

- [ ] **Step 4: Run focused tests**

```bash
node --test tests/p1-public-data-split.test.cjs tests/category-single-source.test.cjs tests/category-field-reference-integrity.test.cjs
node scripts/validate-content.cjs
node scripts/validate-research-data.cjs
```

Expected: all PASS.

- [ ] **Step 5: Commit migration**

```bash
git add data.json research-data.json scripts/validate-research-data.cjs tests/
git commit -m "perf: split public and research platform data"
```

---

### Task 3: Make validators and research audit consume the two-file model

**Files:**
- Modify: `scripts/validate-content.cjs`
- Modify: `scripts/platform-paths-audit.cjs`
- Modify: `.github/workflows/test.yml`
- Test: existing content/research tests

**Interfaces:**
- Consumes: public data + research data.
- Produces: CI coverage that validates both files and the cross-file references.

- [ ] **Step 1: Update content validation expectations**

Keep `validate-content.cjs` public-only and enforce exactly 40 ordered platform IDs plus no `officialPaths`/`pathResearch` keys.

- [ ] **Step 2: Update research audit**

Make `platform-paths-audit.cjs` source hidden path research from `research-data.json.publicPlatformResearch`, resolving field IDs against the matching public platform from `data.json`.

- [ ] **Step 3: Add CI research validation**

Add after public content validation:

```yaml
- name: Validate research content
  run: node scripts/validate-research-data.cjs
```

- [ ] **Step 4: Run full validation subset**

```bash
node scripts/validate-content.cjs
node scripts/validate-research-data.cjs
node scripts/platform-paths-audit.cjs --require-complete
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts .github/workflows/test.yml tests
git commit -m "test: validate split public and research data"
```

---

### Task 4: Extend Decap CMS without duplicating public fields

**Files:**
- Modify: `scripts/generate-decap-config.cjs`
- Modify generated: `admin/config.yml`
- Modify/Test: `tests/decap-cms.test.cjs`

**Interfaces:**
- Consumes: both JSON files.
- Produces: one Decap public-content entry and a separate research-content entry.

- [ ] **Step 1: Write RED CMS assertions**

Require generated config to contain both:

```yaml
file: data.json
file: research-data.json
```

Require public `fields` editor to exist only under the public platform schema. Research schema exposes `officialPaths`/`pathResearch` and non-public platform records but no second public `fields` list.

- [ ] **Step 2: Run RED test**

```bash
node --test tests/decap-cms.test.cjs
```

Expected: FAIL because the research entry is absent.

- [ ] **Step 3: Update generator and regenerate**

Run:

```bash
node scripts/generate-decap-config.cjs
```

- [ ] **Step 4: Verify generated config**

```bash
node scripts/generate-decap-config.cjs --check
node --test tests/decap-cms.test.cjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-decap-config.cjs admin/config.yml tests/decap-cms.test.cjs
git commit -m "feat: edit research data separately in CMS"
```

---

### Task 5: Verify runtime isolation and byte reduction

**Files:**
- Modify if needed: `js/data-loader.js`
- Modify if needed: `sw.js`
- Create: `tests/p1-public-payload-size.test.cjs`

**Interfaces:**
- Consumes: final public data shape.
- Produces: a measurable payload reduction and runtime guarantee.

- [ ] **Step 1: Keep runtime URL unchanged**

`DataLoader.loadSiteData()` continues to default to:

```js
const url = options.url || './data.json';
```

No browser code may fetch `research-data.json`.

- [ ] **Step 2: Add byte-size regression**

Record the pre-P1 `data.json` byte size from the base commit in a test fixture or constant, then assert:

```js
fs.statSync('data.json').size < PRE_P1_DATA_JSON_BYTES
```

Report old bytes, new bytes, and percent reduction.

- [ ] **Step 3: Run runtime/PWA tests**

```bash
node --test tests/p1-public-data-split.test.cjs tests/p1-public-payload-size.test.cjs tests/pwa-hardening.test.cjs tests/data-loader.test.cjs
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add js/data-loader.js sw.js tests
git commit -m "perf: enforce lightweight public payload"
```

---

### Task 6: Browser smoke, complete CI, review, and integration

**Files:**
- Temporary verification workflow only if browser tooling is unavailable locally; remove before PR.
- No production changes unless verification reveals a defect.

**Interfaces:**
- Consumes: complete P1 implementation.
- Produces: verified PR-ready branch.

- [ ] **Step 1: Browser smoke**

Verify homepage, Explore, one many-field platform (`plat-8` or `plat-19`), one zero-field platform (`plat-37`), AR/EN/TR switching, search/filter, favorites/comparison, and no request for `research-data.json`.

- [ ] **Step 2: Full CI**

Run the repository workflow equivalent:

```bash
node --test tests/*.test.cjs
for f in js/*.js scripts/*.cjs; do node --check "$f"; done
for f in inline-worker/src/*.mjs; do node --check "$f"; done
node scripts/validate-content.cjs
node scripts/validate-research-data.cjs
node scripts/platform-paths-audit.cjs --require-complete
node scripts/generate-decap-config.cjs --check
```

Expected: 0 failures.

- [ ] **Step 3: Review scope**

Confirm no public behavior change, no duplicate category source, no temporary workflow, and no unintended changes to field/category values.

- [ ] **Step 4: Open PR and integrate**

Create PR to `main`; after PR CI passes, squash merge. Verify CI and GitHub Pages deploy on the resulting `main` SHA.
