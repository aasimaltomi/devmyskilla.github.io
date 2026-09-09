# Decap CMS setup for Dunya Al-Dawrat

The public site remains a static GitHub Pages site. Decap CMS edits the central `data.json`; the browser reads that file and applies the content through `js/content-api.js` and `js/site-runtime.js`.

## What the CMS controls

The `/admin/` editor exposes the editable content surface defined in `data.json`, including site settings, assets, localized text, taxonomy, quiz/comparison settings, SEO metadata and platform records.

The application logic, HTML component structure, CSS classes and routing logic remain code, not editable CMS content. Raw HTML/CSS/JavaScript injection is intentionally not supported.

## Production identity

The current production repository and site are:

- Repository: `aasimaltomi/devmyskilla.github.io`
- Branch: `main`
- GitHub Pages site: `https://aasimaltomi.github.io/devmyskilla.github.io/`
- Browser origin used by CORS checks: `https://aasimaltomi.github.io`

The configured Decap backend is:

```yaml
backend:
  name: github
  repo: aasimaltomi/devmyskilla.github.io
  branch: main
  base_url: https://dunya-decap-oauth.atomy8774.workers.dev
  auth_endpoint: auth
```

GitHub Pages cannot store the OAuth client secret. The secret must stay only in the OAuth proxy/Worker secret store and must never be committed to this repository. Anyone publishing through the GitHub backend needs write access to the repository.

## Editing and publishing

Open `https://aasimaltomi.github.io/devmyskilla.github.io/admin/`, sign in with GitHub, edit the appropriate group, then publish. Decap commits the updated `data.json` to `main`; GitHub Pages redeploys it and the site fetches the fresh JSON on the next load.

Images use Decap's Media Library:

```text
media_folder: assets/uploads
public_folder: /assets/uploads
```

Upload or select an image through the image field rather than typing an arbitrary file path when possible. Localized `alt` text should be completed for Arabic, English and Turkish.

## Stable IDs: important

These identifiers are data keys, not display labels:

- `platform.id`
- `category.id`
- `language.id`
- platform `categoryId`
- platform `languageIds`

You can freely change the visible localized labels. Do **not** change a published stable ID unless you also migrate every reference to it. Changing only the label does not break filters or links.

Learning-path stages and some editorial settings intentionally reference platform IDs rather than platform names so that renaming a platform does not break the configuration.

## Regenerating the CMS configuration

`scripts/generate-decap-config.cjs` is the source of truth for `admin/config.yml`. After changing the content schema, run:

```bash
node scripts/generate-decap-config.cjs
node scripts/generate-decap-config.cjs --check
```

Do not hand-edit generated fields in `admin/config.yml`; update the generator/schema instead. CI rejects a generated config that is out of sync with `data.json`.

## Validation

Before merging content-schema changes, run:

```bash
node --test tests/*.test.cjs
node scripts/validate-content.cjs
node scripts/generate-decap-config.cjs --check
```

The deployment-identity test additionally verifies that Decap, the inline editor and the Worker all point at the current repository and GitHub Pages origin.

## Content rules

- Use `pricingModel: free` for fully free platforms; the Arabic display remains `مجاناً` unless an editor changes that UI label deliberately.
- Set `freeCertificate: true` only when a certificate is actually free.
- Leave `officialCount` or `lastVerified` empty when unknown. Optional missing facts are hidden instead of inventing an “unknown” value.
- Do not place OAuth secrets, tokens or other credentials in `data.json`, `admin/config.yml` or any public repository file.
