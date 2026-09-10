# Category Single-Source Architecture Design

## Goal
Make `data.json` the only runtime and CMS source for platform category/field data for the public catalog, while preserving the currently approved 40-platform scope and the exact visible category taxonomy and final official destination URLs.

## Current problem
The browser currently loads `data.json` through `js/data-loader.js`, but `platform.html` also loads separate category override modules (`platform-categories*.js`) and `category-direct-links.js`. Those modules can replace `platforms[].fields` and their URLs after `data.json` is loaded. Because Decap CMS edits `data.json`, a CMS edit can therefore be silently overridden at runtime.

## Approved architecture
`data.json` becomes the single source of truth for platform fields/categories. Each public platform keeps its final approved `fields` directly in `platforms[].fields`, including stable `id`, multilingual `name` (`ar`, `en`, `tr`), and the final verified `officialUrl`.

The browser will load those values only through `DataLoader.loadSiteData()`. Runtime category override scripts will no longer participate in the production page data flow.

## Scope guarantees
- Public catalog remains `plat-1` through `plat-40` only.
- The visible category set remains exactly 363 categories across the same platforms unless parity testing proves an existing count differs.
- Existing category IDs, Arabic/English/Turkish names, and final destination URLs must remain byte-for-byte/semantically equivalent to the currently rendered production output.
- Platforms intentionally having zero official categories remain at zero.
- Learning-path UI remains suppressed and is out of scope.
- Platforms 41+ remain present only as existing internal data where applicable and are not promoted into the public catalog.
- No category is invented, renamed, removed, or broadened during this migration.

## Migration strategy
### 1. Capture current rendered truth
Before changing runtime behavior, add a parity fixture/generator that computes the current effective public fields using the existing override modules plus `category-direct-links.js`. This becomes the migration baseline.

### 2. Materialize effective fields into `data.json`
For `plat-1` through `plat-40`, write the baseline effective field arrays into each platform's `fields` entry in `data.json`. Only these field arrays may change in the migration. Other platform metadata, research notes, paths, settings, text, and internal platforms must remain unchanged.

### 3. Prove parity
Add regression tests that compare the materialized `data.json` fields against the captured current effective output for every public platform and every field. Tests must cover:
- platform IDs
- field counts
- field IDs
- multilingual names
- final `officialUrl`
- zero-category platforms
- total visible category count

The migration must fail if any mismatch exists.

### 4. Remove runtime overrides from production
After parity is green:
- remove `platform-categories.js`, `platform-categories-10-20.js`, `platform-categories-21-30.js`, `platform-categories-31-40.js`, and `category-direct-links.js` from `platform.html` production script loading;
- remove those files from Service Worker precache if no other production page needs them;
- remove any loader-install hooks that mutate `DataLoader.loadSiteData()`.

The legacy files may be deleted only after repository-wide search confirms no production or test dependency remains. If retained temporarily for migration tests, they must not be loaded by production pages.

### 5. Make CMS behavior authoritative
Decap CMS continues editing `data.json`. Its generated configuration must expose the existing platform `fields` structure (id, multilingual name, official URL) without introducing a second file. An edit saved by CMS must therefore become the exact value read by the production page on the next load.

## Runtime data flow after migration
`data.json` → `DataLoader.validate()` → `DataLoader.publicCatalog()` → platform normalization/rendering.

There must be no post-load category mutation layer.

## Error handling and validation
- `DataLoader.validate()` remains responsible for top-level data structure validity.
- New tests validate public platform field shape and uniqueness.
- Duplicate field IDs within one platform are rejected by tests.
- Missing multilingual labels or malformed/non-HTTPS official URLs are rejected where the current category contract requires them.
- A zero-field platform is valid when intentionally approved.

## Performance impact
Removing four category modules plus `category-direct-links.js` reduces production JavaScript requests and runtime mutation work. `data.json` will grow only by materializing data already shipped separately today. A separate future optimization may generate a smaller `public-data.json`, but that is explicitly not part of this migration because it would introduce an additional architectural change.

## Testing strategy
1. RED: add a single-source architecture test that fails while `platform.html` still loads override scripts and while `data.json` does not exactly match current effective category output.
2. Build a deterministic migration script or one-time checked transformation to materialize the current effective fields.
3. GREEN: run parity tests over all 40 public platforms and all 363 categories.
4. Run existing category audit/link tests and update them to read the authoritative `data.json` fields rather than override modules.
5. Run complete repository CI, JavaScript syntax checks, Decap config generation/check, PWA tests, and release smoke tests.
6. Perform a browser smoke test for representative platforms with direct-link logic, ordinary static links, and zero-category platforms.

## Rollback
Because the migration is isolated on a feature branch and `main` is untouched until parity and CI are green, rollback before merge is simply abandoning the branch. After merge, the squash commit can be reverted atomically if production differs from the parity baseline.

## Success criteria
- `data.json` is the only production source of platform categories/fields.
- Decap CMS edits to a field are no longer overridden in the browser.
- Public platform scope remains exactly 1–40.
- Visible taxonomy and final links are identical to the pre-migration effective output.
- No learning-path UI is reintroduced.
- Full CI passes.
- Production no longer loads the category override scripts.