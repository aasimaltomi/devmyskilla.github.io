# P1 Public Data Split Design

## Goal

Reduce the JSON payload loaded by the public site without changing the visible 40-platform catalog, the approved 363 platform fields, localization, search/filter behavior, favorites/comparison behavior, or the CMS category source of truth.

## Current State

`data.json` is the central CMS file and is fetched by the public runtime. It contains the complete platform corpus, including non-public platforms and research-only structures such as `officialPaths` and `pathResearch`. `DataLoader.publicCatalog()` filters the platform list to `plat-1` through `plat-40` only after the full JSON file has already been transferred to the browser.

The previous P0 migration made `platforms[].fields` in `data.json` the single authoritative source for the 363 approved public platform fields. This invariant must not be weakened.

## Chosen Architecture

Split content by responsibility rather than introduce a generated public mirror.

### `data.json` — public runtime data

`data.json` remains the file fetched by the site and remains authoritative for every field the public UI consumes. It keeps the existing top-level public sections:

- `settings`
- `assets`
- `seo`
- `siteText`
- `categories`
- `languages`
- `quiz`
- `comparison`
- `platforms`

Its `platforms` array contains only `plat-1` through `plat-40`.

For those 40 platform records, `fields` remains in `data.json` unchanged and therefore remains the single source of truth for category names, IDs, and official category URLs.

Research-only properties are removed from the public platform records:

- `officialPaths`
- `pathResearch`

No other platform property is removed in this P1 migration unless a test proves the public runtime never consumes it. This keeps the migration conservative and limits regression risk.

### `research-data.json` — research and non-public catalog data

Create `research-data.json` with this schema:

```json
{
  "publicPlatformResearch": [
    {
      "id": "plat-1",
      "officialPaths": [],
      "pathResearch": {}
    }
  ],
  "nonPublicPlatforms": []
}
```

`publicPlatformResearch` contains one entry for each of `plat-1` through `plat-40` and preserves the exact research-only values removed from those public records. Missing optional source values are represented exactly as they were semantically in the source; migration tests compare normalized objects rather than inventing new research content.

`nonPublicPlatforms` contains the complete original records for platforms outside `plat-1` through `plat-40`, preserving them without loading them in the public runtime.

This split is for runtime performance, not confidentiality. The repository is public, so research data must not contain secrets even when it is no longer loaded by the site.

## Runtime Data Flow

The public pages continue to call `DataLoader.loadSiteData()` and fetch `./data.json`. They do not fetch `research-data.json`.

`DataLoader.publicCatalog()` remains as a defensive compatibility boundary, but tests require the shipped `data.json` itself to contain exactly 40 platform records. Filtering is therefore no longer relied upon to enforce public scope.

The Service Worker continues to cache `data.json` for public offline behavior and must not precache `research-data.json`.

## CMS Data Flow

Decap continues to edit `data.json` for public site content, including `platforms[].fields`.

The Decap configuration generator is extended so research content is editable through a separate `research-data.json` entry. The two responsibilities are explicit:

- Public platform identity, display metadata, and fields/categories → `data.json`
- Official path research and non-public platform records → `research-data.json`

The CMS must not expose a second editable copy of public `fields` in `research-data.json`.

## Validation and Cross-File Integrity

Validation is split into two layers:

1. Existing public content validation validates `data.json` and enforces exactly the required public shape.
2. Research validation validates `research-data.json` and cross-checks IDs against the public file where relevant.

Required invariants:

- `data.json.platforms` contains exactly `plat-1` through `plat-40` and no other platform IDs.
- The total approved public fields remains exactly 363.
- Public platform `fields` are byte-semantic equivalents of the pre-P1 state.
- `data.json` contains no `officialPaths` or `pathResearch` keys inside public platform records.
- `research-data.json.publicPlatformResearch` contains no public `fields` arrays.
- Every public research record references an existing public platform ID.
- Every hidden `officialPaths[].fieldIds` reference still resolves to a field ID in the matching public platform from `data.json`.
- `research-data.json.nonPublicPlatforms` contains every pre-P1 non-public platform record unchanged.
- The public runtime, HTML, JavaScript, Service Worker, and manifest contain no request for `research-data.json`.

## Migration Strategy

The migration is data-preserving and test-first:

1. Freeze a normalized pre-P1 snapshot of the public 40-platform runtime data and the research/non-public data to be moved.
2. Add RED tests for the target split and runtime non-loading requirements.
3. Produce `research-data.json` from the current `data.json` without modifying research content.
4. Remove `officialPaths` and `pathResearch` from the 40 public records and remove platforms 41+ from `data.json`.
5. Update validators and Decap generator/configuration for the two-file model.
6. Update runtime/PWA tests to ensure only `data.json` is requested.
7. Run full CI and browser smoke tests.
8. Measure raw bytes for pre-P1 `data.json`, post-P1 `data.json`, and `research-data.json`, and report the public payload reduction. The migration is accepted only if the public `data.json` becomes smaller; no arbitrary percentage target is imposed because correctness has priority over a guessed threshold.

## Public Behavior Guarantees

The migration must not change:

- Public platform count: 40
- Approved platform-field count: 363
- Field IDs, Arabic names, English names, Turkish names, or official field URLs
- Platform display identity or ordering for `plat-1` through `plat-40`
- Search, filters, favorites, comparison, quiz, languages, RTL/LTR, theme, or platform-page behavior
- Learning Paths visibility: they remain hidden
- Public category source of truth: `data.json` remains authoritative

## Testing Strategy

Add permanent regression tests covering:

- Public payload shape and exact 40-platform scope
- 363-field parity against the existing frozen category baseline
- Absence of research-only keys from public platform records
- Cross-file research/path field reference integrity
- Preservation of non-public platform records in `research-data.json`
- Decap configuration for both files without duplicate public category editing
- No runtime or Service Worker fetch/precache of `research-data.json`
- Byte-size comparison showing the shipped public JSON is smaller than the pre-P1 baseline

Run the existing full CI suite after each migration boundary. Before merge, run browser smoke tests for the homepage, Explore, a platform with many fields, a zero-field platform, and language switching.

## Rollback

The change is isolated to a feature branch and merged by PR. If a regression is discovered before merge, the branch is corrected without touching `main`. If a production regression appears after merge, the squash merge can be reverted to restore the prior single-file representation without losing research data because the migration is required to prove semantic preservation before integration.
