# Standalone Editor Design

Date: 2026-09-11
Status: Approved design

## Goal

Replace the current Cloudflare-dependent editing stack with a fully isolated administration system hosted on Vercel. The public site remains in `aasimaltomi/devmyskilla.github.io`; the editor becomes a separate private application and repository.

## Target Architecture

- Public site repository: `aasimaltomi/devmyskilla.github.io`
- Private editor repository: `aasimaltomi/devmyskilla-editor`
- Public editor deployment: `https://devmyskilla-editor.vercel.app`
- Hosting: Vercel only for the editor
- Authentication: GitHub OAuth
- Authorization: only GitHub user `aasimaltomi`
- Repository writes: GitHub API to `aasimaltomi/devmyskilla.github.io`
- Cloudflare: removed from all editor and CMS flows

## Editor Modes

### 1. Structured Dashboard

The dashboard manages site content through forms rather than raw JSON. Initial sections:

- Dashboard overview
- Platforms
- Site content
- Site settings
- Assets/images
- Change history

Platform management must support the existing 40 public platforms and their public category data without exposing internal research-only data.

### 2. Visual Editor

The visual editor renders a preview of the public site and lets the owner select supported elements directly.

Editable content includes:

- text
- links
- images
- localized values
- platform card content
- section visibility
- section ordering

Editable presentation includes only safe, schema-backed design controls:

- colors
- font-size presets
- spacing
- alignment
- border radius
- image sizing
- visibility
- section ordering
- approved layout options

The editor must not expose arbitrary HTML, JavaScript, or raw CSS editing.

## Design Data Model

Presentation settings live in a dedicated public-site file such as `design.json`.

Example shape:

```json
{
  "hero": {
    "visible": true,
    "titleSize": "xl",
    "alignment": "center",
    "paddingTop": 48,
    "paddingBottom": 48
  }
}
```

The public site maps these values to predefined CSS variables/classes. Both client and server validate design values against an allowlist and numeric ranges.

## Authentication and Security

The editor uses GitHub OAuth and server-side sessions.

Requirements:

- only GitHub user `aasimaltomi` is authorized
- all editor pages require authentication
- GitHub access tokens stay server-side
- tokens must never be stored in browser `localStorage`
- session cookies use `HttpOnly`, `Secure`, and `SameSite`
- mutation endpoints validate CSRF and request origin
- secrets live only in Vercel Environment Variables
- unauthorized GitHub users receive HTTP 403
- API routes validate every write payload server-side

## GitHub Write Flow

1. Editor requests the current file and SHA through a Vercel server route.
2. User edits a validated field.
3. Preview updates locally without committing.
4. On Save, the server fetches the latest GitHub SHA again.
5. If the SHA changed, the write is rejected as a conflict and the user must refresh/reconcile.
6. If unchanged, the server validates the payload and writes the updated file through GitHub API.
7. Commits use clear messages such as:
   - `content: update FutureLearn description`
   - `design: update hero spacing`

The editor must never blindly overwrite a newer version.

## Public-Site Data Boundaries

The editor may modify public runtime files and approved assets only.

Primary public content source:

- `data.json`

Design source:

- `design.json`

Research-only content such as `research-data.json` is not part of the visual editor or normal platform editing surface unless explicitly added in a future feature.

## Existing CMS Migration

Current editing integrations are deprecated after the replacement is verified:

- Cloudflare inline editor Worker
- Cloudflare Decap OAuth Worker
- public-site direct-edit entry points tied to the old Worker flow
- Decap configuration that depends on Cloudflare OAuth
- Cloudflare deployment workflow for the inline editor

Removal happens only after the standalone editor can authenticate, load data, preview changes, save safely, and the public site still passes regression tests.

## Vercel Application Responsibilities

The private editor app contains:

- GitHub OAuth start/callback routes
- authenticated session handling
- repository read APIs
- validated content write APIs
- validated design write APIs
- image upload handling where required
- structured dashboard UI
- visual preview/editor UI

No GitHub client secret or write token is exposed to browser code.

## Visual Preview Integration

The preview must be isolated from the editor shell while still allowing selection of editable elements.

Preferred interaction:

- render the public site or a local preview representation in an iframe/preview surface
- mark supported editable elements with stable editor identifiers
- send selection events to the editor shell
- show an inspector panel for the selected field
- apply unsaved changes in preview state
- commit only when Save is pressed

The public visitor experience must not display editor controls.

## Validation and Error Handling

The system must explicitly handle:

- expired GitHub sessions
- unauthorized account
- invalid field/value
- stale GitHub SHA conflicts
- GitHub API failures/rate limits
- malformed `data.json` or `design.json`
- failed asset uploads
- preview errors

Failed saves must leave repository content unchanged and show a clear recoverable error in the editor.

## Testing

Minimum verification before migration:

- OAuth login succeeds for `aasimaltomi`
- other GitHub users are rejected
- protected routes cannot be accessed anonymously
- `data.json` can be read and edited through validated forms
- all 40 platforms remain intact
- current category counts remain intact unless intentionally edited
- `design.json` rejects unsupported values
- visual preview reflects unsaved changes
- stale-SHA conflict protection works
- save creates the expected GitHub commit
- no secret appears in client bundles or browser storage
- public-site tests pass after design integration
- no production browser request depends on `*.workers.dev`

## Migration Sequence

1. Build and verify the isolated editor in a new private repository.
2. Connect it to the public repository using GitHub OAuth.
3. Add `design.json` and safe public-site design bindings.
4. Verify structured and visual editing end-to-end.
5. Deploy the editor as its own Vercel project.
6. Confirm the editor works independently of Cloudflare.
7. Remove old Cloudflare editor/CMS integration from the public repository.
8. Remove obsolete Cloudflare editor deployment workflow/configuration.
9. Run final regression and security verification.

## Non-Goals

This phase does not provide:

- raw HTML editing
- raw CSS editing
- JavaScript editing
- arbitrary repository file editing
- multi-user roles
- public registration
- research-data editing in the visual editor

## Success Criteria

The migration is complete when the owner can sign in at the isolated Vercel editor, modify public content and approved design settings, preview those changes, save them safely to GitHub, and the public site updates without any dependency on Cloudflare for editing or authentication.
