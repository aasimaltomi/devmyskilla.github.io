# Full Site Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the production CMS/Worker identity, stale category destinations, offline/PWA behavior, SEO gaps, mobile navigation, accessibility defects, and the highest-impact home-page layout instability without changing the approved 40-platform taxonomy.

**Architecture:** Keep the existing static GitHub Pages architecture and current category overlay modules. Make narrowly-scoped fixes at the source of each audited defect, add Node regression tests before implementation, and preserve `data.json` as the CMS source while avoiding a risky data-architecture migration in this hardening change. Performance work is limited to layout stability and initial-render reductions that can be verified without changing content semantics.

**Tech Stack:** Static HTML/CSS/JavaScript, Node 22 built-in test runner, Decap CMS, Cloudflare Worker/Wrangler, GitHub Pages service worker/PWA.

**Spec:** Production audit summarized in the 2026-09-10 conversation; approved public scope remains `plat-1` through `plat-40`, categories only, no public learning-path UI.

## Global Constraints

- Publicly expose only the original 40 platforms.
- Do not reintroduce learning paths.
- Do not rename or remove approved category taxonomy during URL repairs.
- Every changed behavior gets a regression test first and must be observed failing before production code changes.
- Keep `main` untouched until branch CI is green and the final diff is reviewed.

---

### Task 1: Production CMS and Worker identity

**Files:**
- Modify: `admin/config.yml`
- Modify: `js/inline-editor-config.js`
- Modify: `inline-worker/wrangler.toml`
- Modify: `inline-worker/src/worker.mjs`
- Create/Test: `tests/production-identity.test.cjs`

**Interfaces:**
- Consumes: GitHub Pages origin `https://aasimaltomi.github.io` and project site `https://aasimaltomi.github.io/devmyskilla.github.io`.
- Produces: Decap repo `aasimaltomi/devmyskilla.github.io`, Worker allowed origin `https://aasimaltomi.github.io`, Worker fallback repo `aasimaltomi/devmyskilla.github.io`.

- [ ] **Step 1: Write the failing test** asserting all production identity values use the current owner/origin and the legacy owner/origin are absent from runtime/CMS configuration.
- [ ] **Step 2: Run** `node --test tests/production-identity.test.cjs` and verify it fails on the legacy values.
- [ ] **Step 3: Implement minimal configuration/fallback replacements** only in the four files above.
- [ ] **Step 4: Run** `node --test tests/production-identity.test.cjs tests/inline-worker.test.cjs tests/decap-cms.test.cjs` and verify pass.
- [ ] **Step 5: Commit** with `fix: align cms and worker production identity`.

### Task 2: Repair the nine stale category destinations

**Files:**
- Modify: `js/platform-categories-10-20.js`
- Modify: `js/platform-categories-21-30.js`
- Create/Test: `tests/stale-category-links.test.cjs`

**Interfaces:**
- Consumes: existing category IDs/names.
- Produces: current official destination URLs while preserving all category IDs and multilingual names.

- [ ] **Step 1: Write the failing test** for OpenLearn `money-business`, Alison `sales-marketing`, `engineering-construction`, `teaching-academics`, and the five audited Simplilearn category destinations; reject the known dead slugs.
- [ ] **Step 2: Run** `node --test tests/stale-category-links.test.cjs` and verify the expected dead URLs fail.
- [ ] **Step 3: Replace only the audited destination URLs**, using direct official pages where verified and the official SkillUp catalog search/filter URL when Simplilearn has no stable category slug.
- [ ] **Step 4: Run category tests** including `category-link-audit`, `platform-categories-10-20`, and `platform-categories-21-30`.
- [ ] **Step 5: Commit** with `fix: repair stale category destinations`.

### Task 3: Correct offline/PWA behavior

**Files:**
- Modify: `sw.js`
- Modify: `manifest.webmanifest`
- Create/Test: `tests/pwa-hardening.test.cjs`

**Interfaces:**
- Consumes: same-origin GET requests.
- Produces: HTML offline fallback only for navigation requests; scripts/styles fall back to cache or network error, never HTML; current category modules are precached; 192 and 512 icons are declared.

- [ ] **Step 1: Write the failing test** asserting navigation-only HTML fallback, current category modules/direct links in `CORE`, a bumped cache key, and `icon-512.png` in the manifest.
- [ ] **Step 2: Run** `node --test tests/pwa-hardening.test.cjs` and verify failure.
- [ ] **Step 3: Refactor `networkFirst` minimally** so fallback is explicit and only navigation receives `offline.html`; add category scripts/CSS needed by offline platform pages to `CORE`; add 512 icon.
- [ ] **Step 4: Run PWA test plus syntax check** `node --check sw.js`.
- [ ] **Step 5: Commit** with `fix: harden offline service worker behavior`.

### Task 4: Add static SEO discovery metadata

**Files:**
- Modify: `index.html`
- Modify: `explore.html`
- Modify: `platform.html`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create/Test: `tests/seo-hardening.test.cjs`

**Interfaces:**
- Produces: non-empty static title/description, canonical and social URL metadata for crawlable entry pages, a project-path-aware sitemap and robots file.

- [ ] **Step 1: Write the failing test** for non-empty title/description, canonical links, `robots.txt`, and `sitemap.xml` entries.
- [ ] **Step 2: Run** `node --test tests/seo-hardening.test.cjs` and verify failure.
- [ ] **Step 3: Add conservative Arabic static defaults** that existing runtime i18n may replace after load; add canonical/OG URL tags and crawler files.
- [ ] **Step 4: Run** SEO test and existing no-hardcoded-content/branding tests; adjust only if an existing architectural rule requires data attributes instead of visible hardcoded copy.
- [ ] **Step 5: Commit** with `fix: add static seo discovery metadata`.

### Task 5: Mobile navigation and accessibility

**Files:**
- Modify: `index.html`
- Modify: `explore.html`
- Modify: `platform.html`
- Modify: `css/style.css`
- Modify: `js/accessibility.js`
- Modify: `js/app.js` only if modal focus restoration cannot be implemented generically.
- Create/Test: `tests/accessibility-hardening.test.cjs`

**Interfaces:**
- Produces: a keyboard-operable mobile navigation toggle; tab-list ArrowLeft/ArrowRight/Home/End support; modal trigger focus restoration; icon-only favorite/share controls receive accessible labels through existing localized strings/runtime hooks.

- [ ] **Step 1: Write failing structural/behavior tests** for mobile nav hooks and tab keyboard handler/focus restoration hooks.
- [ ] **Step 2: Run** `node --test tests/accessibility-hardening.test.cjs` and verify failure.
- [ ] **Step 3: Implement mobile nav button/menu state** with `aria-expanded`, Escape/outside-close behavior, and responsive CSS.
- [ ] **Step 4: Extend `accessibility.js`** with roving tab keyboard behavior and generic dialog focus restoration using the existing modal classes/data-close attributes.
- [ ] **Step 5: Ensure favorite/share buttons receive localized accessible names at render time using existing `siteText.accessibility`/i18n data, without hardcoding a single language.
- [ ] **Step 6: Run accessibility test plus relevant app/runtime tests and syntax checks.
- [ ] **Step 7: Commit** with `fix: improve mobile navigation and accessibility`.

### Task 6: Reduce landing-page layout instability

**Files:**
- Modify: `css/landing.css`
- Modify: `js/landing.js` only if necessary after CSS reservation is insufficient.
- Create/Test: `tests/landing-performance-hardening.test.cjs`

**Interfaces:**
- Produces: stable reserved geometry for the dynamic platform cloud/category/stat areas and avoids avoidable first-paint layout jumps without changing landing content.

- [ ] **Step 1: Write the failing static regression test** for reserved dimensions/min-block-size on dynamic landing containers and reduced-motion-safe animation behavior.
- [ ] **Step 2: Run** `node --test tests/landing-performance-hardening.test.cjs` and verify failure.
- [ ] **Step 3: Add minimal CSS containment/reserved geometry** based on current desktop/mobile layout; do not hide content or remove animations globally.
- [ ] **Step 4: Run landing tests and syntax checks.
- [ ] **Step 5: Commit** with `perf: stabilize landing initial layout`.

### Task 7: Full verification and integration

**Files:**
- Review all changed files; no unrelated refactor.

- [ ] **Step 1: Run** `node --test tests/*.test.cjs`.
- [ ] **Step 2: Run JavaScript syntax checks** matching `.github/workflows/test.yml`.
- [ ] **Step 3: Run** `node scripts/validate-content.cjs`.
- [ ] **Step 4: Run** `node scripts/platform-paths-audit.cjs --require-complete`.
- [ ] **Step 5: Run** `node scripts/generate-decap-config.cjs --check`.
- [ ] **Step 6: Run `git diff --check` equivalent through CI and inspect the branch compare/PR patch.
- [ ] **Step 7: Create PR only after fresh green CI, review changed filenames/patch, merge, then verify `main` CI and GitHub Pages deployment.
