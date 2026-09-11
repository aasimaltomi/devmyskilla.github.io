# Cloudflare Editor Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the old Cloudflare-based editing stack only after the standalone Vercel editor is verified, leaving the public site with no editing/authentication dependency on `*.workers.dev`.

**Architecture:** Treat this as a controlled migration, not a rewrite. First add tests that detect legacy Cloudflare/editor references, then remove the inline Worker, Decap OAuth configuration, public direct-edit scripts/entry points, and obsolete deployment workflow. Keep public runtime data, `design.json`, and the preview bridge required by the new standalone editor.

**Tech Stack:** Existing static site, GitHub Actions, Node test runner, GitHub Pages/Vercel public deployments.

**Spec:** `docs/superpowers/specs/2026-09-11-standalone-editor-design.md`

## Global Constraints

- Do not start this plan until the standalone editor can authenticate, load 40 public platforms, preview content/design changes, save safely, and pass stale-SHA tests.
- Preserve `data.json`, `research-data.json`, `design.json`, public site runtime, and the new preview bridge.
- Remove Cloudflare only from editing/CMS flows; do not change unrelated public hosting behavior.
- Final public browser traffic must contain no request to `*.workers.dev`.
- Final repository must contain no secret values.

---

### Task 1: Add Cutover Guard Tests

**Files:**
- Create: `tests/no-cloudflare-editor.test.cjs`
- Create: `tests/editor-cutover-contract.test.cjs`

**Interfaces:**
- Produces: regression guards that prevent reintroduction of old Cloudflare editor endpoints/files.

- [ ] **Step 1: Write failing legacy-reference test**

The test must recursively scan text files under `index.html`, `explore.html`, `js/`, `admin/`, `.github/workflows/`, and `inline-worker/` and fail when it finds either:

```text
atomy8774.workers.dev
dunya-inline-editor
dunya-decap-oauth
```

- [ ] **Step 2: Write failing legacy-file contract test**

Assert these paths do not exist after migration:

```text
inline-worker/
admin/config.yml
js/inline-editor-api.js
js/inline-editor-config.js
js/inline-editor.js
.github/workflows/deploy-inline-worker.yml
```

- [ ] **Step 3: Run tests and verify they fail before removal**

```bash
node --test tests/no-cloudflare-editor.test.cjs tests/editor-cutover-contract.test.cjs
```

Expected: FAIL because the legacy integration still exists.

- [ ] **Step 4: Commit tests before removal**

```bash
git add tests/no-cloudflare-editor.test.cjs tests/editor-cutover-contract.test.cjs
git commit -m "test: guard standalone editor cutover"
```

---

### Task 2: Remove Public Inline-Editor Entry Points

**Files:**
- Modify: `index.html`
- Modify: `explore.html`
- Modify any other HTML page that loads old inline editor assets
- Delete: `js/inline-editor-api.js`
- Delete: `js/inline-editor-config.js`
- Delete: `js/inline-editor.js`
- Modify/Delete old inline-editor-specific CSS only when no longer used by public runtime
- Test: existing HTML/runtime tests plus cutover tests.

**Interfaces:**
- Preserves: `js/editor-preview-bridge.js` for the new isolated editor.

- [ ] **Step 1: Identify exact old script/style references**

Use repository search for:

```text
inline-editor.js
inline-editor-api.js
inline-editor-config.js
?edit=1
```

Record each matching public HTML/CSS file in the commit description.

- [ ] **Step 2: Remove old public edit bootstrap**

Delete script/style tags and direct-edit UI tied to `?edit=1`. Do not remove normal public navigation or the new `editorPreview=1` bridge.

- [ ] **Step 3: Delete obsolete inline editor browser modules**

Delete the three `js/inline-editor*` files listed above after all references are removed.

- [ ] **Step 4: Run focused tests**

```bash
node --test tests/no-cloudflare-editor.test.cjs tests/editor-cutover-contract.test.cjs tests/accessibility-hardening.test.cjs tests/data-loader.test.cjs
```

The cutover contract may still fail because Worker/admin files remain; public inline-script assertions must now pass.

- [ ] **Step 5: Commit**

```bash
git add -A index.html explore.html js css tests
git commit -m "refactor: remove legacy inline editor client"
```

---

### Task 3: Remove Decap CMS and Cloudflare OAuth Configuration

**Files:**
- Delete: `admin/index.html`
- Delete: `admin/config.yml`
- Delete other files under `admin/` only when they belong exclusively to Decap CMS
- Modify/Delete: `tests/decap-cms.test.cjs`
- Modify/Delete: `tests/full-cms-schema.test.cjs`
- Add or modify: tests that validate the new editor contract instead of Decap.

**Interfaces:**
- Removes: legacy `/admin` editing surface.
- Preserves: public `data.json` as the authoritative 40-platform public content source.

- [ ] **Step 1: Confirm no current production workflow depends on `/admin`**

Verify the standalone editor production checks from the prior plan are green before deleting Decap files.

- [ ] **Step 2: Delete Decap UI/config**

Remove the old admin files containing:

```yaml
base_url: https://dunya-decap-oauth.atomy8774.workers.dev
auth_endpoint: auth
```

- [ ] **Step 3: Replace obsolete CMS tests**

Remove tests whose only purpose is validating Decap schema/config. Keep category/data integrity tests that protect `data.json`.

- [ ] **Step 4: Run content integrity tests**

```bash
node --test tests/categories-only.test.cjs tests/category-single-source.test.cjs tests/category-field-reference-integrity.test.cjs tests/data-loader.test.cjs
```

Expected: all pass and public platform count remains 40.

- [ ] **Step 5: Commit**

```bash
git add -A admin tests
git commit -m "refactor: remove Decap Cloudflare CMS"
```

---

### Task 4: Remove Cloudflare Worker and Deployment Workflow

**Files:**
- Delete: `inline-worker/`
- Delete: `.github/workflows/deploy-inline-worker.yml`
- Modify: `.github/workflows/test.yml` only if it still references inline-worker tests/dependencies.
- Delete inline-worker-only tests/fixtures that are no longer applicable.

**Interfaces:**
- Removes: all Cloudflare Worker deployment/runtime code for site editing.

- [ ] **Step 1: Search workflow and test references**

Search repository for:

```text
inline-worker
wrangler
GITHUB_OAUTH_SECRET
INLINE_SESSIONS
```

Classify each hit as legacy editor-only or still required elsewhere. Remove only editor-only hits.

- [ ] **Step 2: Delete Worker source/config**

Remove `inline-worker/` completely, including `wrangler.toml`, Worker source, and Worker-specific package/test files.

- [ ] **Step 3: Delete Worker deployment workflow**

Remove `.github/workflows/deploy-inline-worker.yml`.

- [ ] **Step 4: Clean the main CI workflow**

If `.github/workflows/test.yml` contains Worker-specific install/test steps, remove those steps while preserving public-site tests.

- [ ] **Step 5: Run the cutover guards**

```bash
node --test tests/no-cloudflare-editor.test.cjs tests/editor-cutover-contract.test.cjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A inline-worker .github/workflows tests
git commit -m "chore: remove Cloudflare editor worker"
```

---

### Task 5: Run Full Repository and Browser Regression Verification

**Files:**
- Modify: `README-UPGRADE.md` or current operational documentation to point to the standalone editor.
- Test: all existing public-site tests and production browser smoke checks.

**Interfaces:**
- Produces: final verified migration state.

- [ ] **Step 1: Run every repository test**

```bash
node --test tests/*.test.cjs
```

Expected: all pass.

- [ ] **Step 2: Verify data boundaries**

Programmatically assert:

```text
data.json -> exactly 40 platforms
research-data.json -> remains present for research validators
public category integrity tests -> unchanged unless intentionally edited
design.json -> valid
```

- [ ] **Step 3: Verify public browser behavior**

Check home, explore, and at least one platform detail page in Arabic, English, and Turkish. Verify search, favorites, comparison, mobile navigation, and no horizontal overflow.

- [ ] **Step 4: Verify network requests**

With browser DevTools Network open, load the public site and standalone editor. Search request URLs for:

```text
workers.dev
```

Expected: zero matches.

- [ ] **Step 5: Verify standalone editor after legacy removal**

Sign in at `https://devmyskilla-editor.vercel.app`, load content, open visual preview, make a temporary safe edit, save, verify the GitHub commit, and revert the temporary edit through the editor.

- [ ] **Step 6: Update operational docs**

Document the new editor URL and state explicitly that Cloudflare is no longer part of the editing/authentication architecture.

- [ ] **Step 7: Commit**

```bash
git add README-UPGRADE.md docs tests
git commit -m "docs: complete standalone editor cutover"
```

---

### Task 6: Final CI and Deployment Gate

**Files:**
- No code changes expected unless verification exposes a defect.

**Interfaces:**
- Produces: merge-ready cutover branch.

- [ ] **Step 1: Push the cutover branch and wait for CI**

All required GitHub Actions checks must finish successfully.

- [ ] **Step 2: Verify GitHub Pages/Vercel public deployment**

Confirm the deployed commit matches the branch SHA under review.

- [ ] **Step 3: Verify editor Vercel deployment**

Confirm the editor deployment is healthy and owner login/save works after the public-site deployment.

- [ ] **Step 4: Re-run `workers.dev` repository scan**

Run:

```bash
git grep -n "workers\.dev\|dunya-inline-editor\|dunya-decap-oauth" -- . ':!docs/superpowers/specs/*' ':!docs/superpowers/plans/*'
```

Expected: no output.

- [ ] **Step 5: Merge only after all gates are green**

Use the repository's normal PR review/merge process. Do not delete the old Cloudflare deployments from the Cloudflare dashboard until the merged production site/editor are re-verified, so rollback remains possible during the cutover window.

## Self-Review Result

- Spec coverage: legacy inline editor, Decap OAuth, Worker source, deployment workflow, public references, regression verification, and zero `workers.dev` browser dependency are covered.
- Placeholder scan: no implementation placeholders remain.
- Interface consistency: the new preview bridge survives; only legacy client/CMS/Worker paths are removed after the standalone editor is verified.
