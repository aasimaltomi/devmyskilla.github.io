# Visual Editor and Design Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe design data to the public site and build a visual editor in the standalone Vercel app that previews unsaved changes and saves validated content/design updates to GitHub.

**Architecture:** The public site gains `design.json`, a small design loader, and a preview bridge that activates only when `editorPreview=1`. The standalone editor embeds the public site in an iframe, receives stable editable-element selection messages, applies unsaved preview patches through `postMessage`, and saves only schema-approved values through authenticated Vercel API routes.

**Tech Stack:** Existing static public site JavaScript/CSS, JSON, Next.js/React editor app, TypeScript, Zod, `postMessage`, Vitest, existing Node `.cjs` public-site tests.

**Spec:** `docs/superpowers/specs/2026-09-11-standalone-editor-design.md`

## Global Constraints

- Public visitors must never see editor controls.
- Raw HTML, JavaScript, and CSS editing are forbidden.
- Design settings are restricted to allowlisted keys and bounded values.
- Visual preview may edit text, links, images, localized values, colors, font-size presets, spacing, alignment, border radius, image sizing, visibility, section ordering, and approved layouts.
- `research-data.json` is not editable.
- No browser request may depend on Cloudflare.
- Unsaved preview changes must not write to GitHub.
- Save operations must retain stale-SHA conflict protection.

---

### Task 1: Introduce `design.json` and Public-Site Design Runtime

**Files:**
- Create in public repo: `design.json`
- Create: `js/design-loader.js`
- Modify: `css/style.css`
- Modify: `index.html`
- Modify: `explore.html`
- Test: `tests/design-loader.test.cjs`
- Test: `tests/design-contract.test.cjs`

**Interfaces:**
- Produces: `window.DunyaDesign.load()` and CSS custom properties consumed by the public site.

- [ ] **Step 1: Write failing design contract test**

Create a test asserting `design.json` exists and contains only supported top-level sections. Initial shape:

```json
{
  "hero": {
    "visible": true,
    "titleSize": "xl",
    "alignment": "center",
    "paddingTop": 48,
    "paddingBottom": 48
  },
  "platformGrid": {
    "visible": true,
    "gap": 24,
    "cardRadius": 18
  }
}
```

- [ ] **Step 2: Run test and verify failure**

```bash
node --test tests/design-contract.test.cjs
```

Expected: FAIL because `design.json` does not exist.

- [ ] **Step 3: Add design loader**

`js/design-loader.js` must fetch `design.json`, validate/coerce nothing, ignore invalid fields, and apply only these initial CSS variables:

```text
--hero-padding-top
--hero-padding-bottom
--platform-grid-gap
--platform-card-radius
```

Map `titleSize` and `alignment` to predefined classes rather than arbitrary CSS.

- [ ] **Step 4: Bind CSS to design variables**

Use safe defaults matching the current production appearance so adding `design.json` produces no visual regression before any user edit.

- [ ] **Step 5: Load the design runtime on public pages**

Load `js/design-loader.js` before page-specific rendering code on `index.html` and `explore.html`.

- [ ] **Step 6: Run public-site tests**

```bash
node --test tests/design-loader.test.cjs tests/design-contract.test.cjs tests/*.test.cjs
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add design.json js/design-loader.js css/style.css index.html explore.html tests/design-*.test.cjs
git commit -m "feat: add safe design configuration"
```

---

### Task 2: Add a Preview-Only Public-Site Bridge

**Files:**
- Create in public repo: `js/editor-preview-bridge.js`
- Modify: `js/edit-descriptors.js`
- Modify: `index.html`
- Modify: `explore.html`
- Test: `tests/editor-preview-bridge.test.cjs`

**Interfaces:**
- Produces messages to parent: `{type:'dunya-editor-select', target:{kind,id,field}}`.
- Consumes messages from parent: `{type:'dunya-editor-preview-patch', patch}`.

- [ ] **Step 1: Write failing bridge activation tests**

Tests must prove the bridge is inactive without `editorPreview=1` and rejects parent messages whose origin is not exactly:

```text
https://devmyskilla-editor.vercel.app
```

- [ ] **Step 2: Run test and verify failure**

```bash
node --test tests/editor-preview-bridge.test.cjs
```

- [ ] **Step 3: Implement preview activation guard**

The bridge must return immediately unless:

```js
new URLSearchParams(location.search).get('editorPreview') === '1'
```

It must never render toolbars, badges, buttons, overlays, or controls in the public document.

- [ ] **Step 4: Reuse stable edit descriptors**

Extend `js/edit-descriptors.js` so supported rendered nodes can receive a stable `data-editor-target` descriptor derived from current platform/site field identity. Do not expose arbitrary JSON paths.

- [ ] **Step 5: Implement selection and preview patch messaging**

In preview mode only, clicking a supported target sends a normalized descriptor to the trusted editor parent. Incoming patches may update only descriptor-backed text/image/link content and safe design values.

- [ ] **Step 6: Run regression tests**

```bash
node --test tests/editor-preview-bridge.test.cjs tests/edit-descriptors.test.cjs tests/*.test.cjs
```

- [ ] **Step 7: Commit**

```bash
git add js/editor-preview-bridge.js js/edit-descriptors.js index.html explore.html tests/editor-preview-bridge.test.cjs
git commit -m "feat: add isolated visual preview bridge"
```

---

### Task 3: Add Validated `design.json` APIs to the Editor

**Files:**
- Create in editor repo: `lib/design/schema.ts`
- Create: `app/api/design/route.ts`
- Create: `app/api/design/save/route.ts`
- Modify: `lib/github/content.ts`
- Test: `tests/design/schema.test.ts`
- Test: `tests/api/design-save.test.ts`

**Interfaces:**
- Produces: `DesignSchema`, `GET /api/design`, `POST /api/design/save`.

- [ ] **Step 1: Write failing schema tests**

```ts
expect(() => DesignSchema.parse({hero:{titleSize:'999px'}})).toThrow();
expect(DesignSchema.parse({hero:{titleSize:'xl',alignment:'center',visible:true,paddingTop:48,paddingBottom:48}})).toBeTruthy();
```

- [ ] **Step 2: Define exact safe design ranges**

Use:

```ts
titleSize: z.enum(['sm','md','lg','xl','2xl'])
alignment: z.enum(['start','center','end'])
paddingTop: z.number().int().min(0).max(160)
paddingBottom: z.number().int().min(0).max(160)
gap: z.number().int().min(0).max(80)
cardRadius: z.number().int().min(0).max(40)
visible: z.boolean()
```

Additional design controls added later must use explicit enums/ranges in this same schema.

- [ ] **Step 3: Extend GitHub file allowlist**

Allow exactly:

```ts
const EDITABLE_JSON_FILES = ['data.json', 'design.json'] as const;
```

`research-data.json` must continue to throw.

- [ ] **Step 4: Implement design read/save routes**

Use the same owner session, Origin, CSRF, and stale-SHA protections as content save.

- [ ] **Step 5: Run tests and checks**

```bash
npx vitest run tests/design tests/api/design-save.test.ts
npm run lint
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add lib/design lib/github/content.ts app/api/design tests/design tests/api/design-save.test.ts
git commit -m "feat: add validated design API"
```

---

### Task 4: Build the Visual Editor Shell

**Files:**
- Create in editor repo: `app/editor/page.tsx`
- Create: `components/editor/PreviewFrame.tsx`
- Create: `components/editor/Inspector.tsx`
- Create: `components/editor/usePreviewBridge.ts`
- Create: `lib/editor/patches.ts`
- Test: `tests/ui/visual-editor.test.tsx`
- Test: `tests/editor/patches.test.ts`

**Interfaces:**
- Consumes public iframe URL: `https://devmyskilla.vercel.app/?editorPreview=1`.
- Consumes selection messages and sends preview patch messages.
- Produces pending content/design patch state until Save.

- [ ] **Step 1: Write failing message-origin test**

The editor must ignore `message` events unless `event.origin` exactly matches `https://devmyskilla.vercel.app` and the payload uses a supported message type.

- [ ] **Step 2: Write failing inspector test**

Selecting a descriptor such as:

```ts
{kind:'platform',id:'plat-1',field:'name.ar'}
```

must render the correct localized text control and update pending state without calling a save API.

- [ ] **Step 3: Implement preview frame and bridge hook**

`PreviewFrame` uses a sandbox that allows scripts and same-site navigation required by the site but does not grant unnecessary permissions. `usePreviewBridge` owns all `postMessage` validation.

- [ ] **Step 4: Implement safe inspector controls**

Render controls by descriptor type. Use selects/sliders/number inputs for design fields so raw CSS cannot be entered.

- [ ] **Step 5: Implement local preview patches**

Changing a control updates React pending state and sends a preview patch to the iframe. No GitHub request occurs until Save.

- [ ] **Step 6: Run UI tests**

```bash
npx vitest run tests/ui/visual-editor.test.tsx tests/editor/patches.test.ts
npm run lint
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add app/editor components/editor lib/editor tests/ui/visual-editor.test.tsx tests/editor
git commit -m "feat: add visual editing workspace"
```

---

### Task 5: Add Save/Discard and End-to-End Conflict Handling

**Files:**
- Modify in editor repo: `app/editor/page.tsx`
- Create: `lib/editor/save.ts`
- Test: `tests/editor/save.test.ts`
- Test: `tests/ui/save-discard.test.tsx`

**Interfaces:**
- Consumes `/api/content/save` and `/api/design/save`.
- Produces atomic per-file saves with explicit conflict handling.

- [ ] **Step 1: Write failing discard test**

After multiple preview edits, Discard must restore the last loaded content/design snapshot and send reset patches to the iframe without writing to GitHub.

- [ ] **Step 2: Write failing stale-SHA save test**

When either API returns 409, keep pending changes visible, do not auto-retry, and show:

```text
The site changed after this editor was opened. Reload the latest version before saving.
```

- [ ] **Step 3: Implement save coordinator**

Save only dirty files. Each file uses its original SHA. After success, replace the local baseline SHA/value with the response and clear that file's dirty state.

- [ ] **Step 4: Run tests**

```bash
npx vitest run tests/editor tests/ui/save-discard.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add app/editor/page.tsx lib/editor/save.ts tests/editor tests/ui/save-discard.test.tsx
git commit -m "feat: add safe visual editor save flow"
```

---

### Task 6: Verify Visual Editing in Production

**Files:**
- Modify editor repo: `docs/deployment.md`
- Test: production browser checks and public-site regression suite.

**Interfaces:**
- Produces: verified visual editor ready for cutover.

- [ ] **Step 1: Deploy both repos**

Deploy public-site design/bridge changes and the editor changes without removing old Cloudflare code yet.

- [ ] **Step 2: Verify public mode**

Open the normal public site and confirm no editor UI, no preview click interception, and no request to `devmyskilla-editor.vercel.app` or `*.workers.dev` caused by the new bridge.

- [ ] **Step 3: Verify preview mode**

Open `/editor`, select at least one site text field and one design field, modify both, confirm iframe updates immediately while GitHub remains unchanged.

- [ ] **Step 4: Verify Save and Discard**

Discard one preview change and confirm it is restored. Save one controlled change, verify expected GitHub commit and deployed public result, then revert the controlled change through the editor.

- [ ] **Step 5: Run public regression suite**

```bash
node --test tests/*.test.cjs
```

Confirm 40 public platforms and current category integrity remain intact.

- [ ] **Step 6: Document verified preview origin**

Record in `docs/deployment.md` that the trusted preview origin is exactly `https://devmyskilla.vercel.app` and editor origin is exactly `https://devmyskilla-editor.vercel.app`.

- [ ] **Step 7: Commit documentation**

```bash
git add docs/deployment.md
git commit -m "docs: verify visual editor integration"
```

## Self-Review Result

- Spec coverage: design allowlist, visual selection, safe controls, unsaved preview, Save/Discard, stale-SHA conflict, no raw code editing, public visitor isolation, and production verification are covered.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: descriptor selection feeds pending patches; design/content APIs consume validated snapshots; save coordinator owns per-file SHA updates.
