# Standalone Editor Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the isolated private `devmyskilla-editor` application with GitHub-only owner login, structured content editing, safe GitHub writes, and Vercel deployment without Cloudflare.

**Architecture:** A private Next.js App Router application runs on Vercel. GitHub OAuth is used only to verify the signed-in GitHub identity; the short-lived OAuth access token is discarded after identity verification. Repository reads/writes use a fine-grained `GITHUB_WRITE_TOKEN` stored only in Vercel environment variables and scoped to `aasimaltomi/devmyskilla.github.io`. The browser receives only a signed `HttpOnly` session cookie and a CSRF token returned by the authenticated session endpoint.

**Tech Stack:** Next.js App Router, TypeScript, React, Zod, Node `crypto`, GitHub REST API, Vitest, Testing Library, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-11-standalone-editor-design.md`

## Global Constraints

- Editor repository is private and separate: `aasimaltomi/devmyskilla-editor`.
- Editor production URL target: `https://devmyskilla-editor.vercel.app`.
- Only GitHub user `aasimaltomi` is authorized.
- No GitHub token is exposed to browser JavaScript or `localStorage`.
- Session cookie uses `HttpOnly`, `Secure`, and `SameSite=Lax`.
- Mutation routes verify both request `Origin` and CSRF token.
- Public content writes target only `aasimaltomi/devmyskilla.github.io` on branch `main`.
- Structured editing covers `data.json`; `research-data.json` stays out of scope.
- Every write re-fetches the latest blob SHA and rejects stale edits with HTTP 409.
- Cloudflare is not used by this application.

---

### Task 1: Bootstrap the Private Editor Application

**Files:**
- Create in `aasimaltomi/devmyskilla-editor`: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `.env.example`
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

**Interfaces:**
- Produces: Next.js application shell and test runner used by all later tasks.

- [ ] **Step 1: Create the private repository and scaffold Next.js**

Run locally after the private GitHub repository exists:

```bash
npx create-next-app@latest devmyskilla-editor --ts --eslint --app --src-dir=false --import-alias='@/*'
cd devmyskilla-editor
npm install zod
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Add required environment variable contract**

Create `.env.example`:

```dotenv
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=
GITHUB_WRITE_TOKEN=
SESSION_SECRET=
ALLOWED_GITHUB_LOGIN=aasimaltomi
TARGET_REPO=aasimaltomi/devmyskilla.github.io
TARGET_BRANCH=main
APP_ORIGIN=https://devmyskilla-editor.vercel.app
```

- [ ] **Step 3: Write a failing smoke test**

Create `tests/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { APP_NAME } from '@/lib/config';

describe('editor app', () => {
  it('uses the standalone editor identity', () => {
    expect(APP_NAME).toBe('Dunya Editor');
  });
});
```

- [ ] **Step 4: Run the smoke test and verify failure**

Run:

```bash
npx vitest run tests/smoke.test.ts
```

Expected: FAIL because `@/lib/config` does not exist.

- [ ] **Step 5: Add minimal configuration module**

Create `lib/config.ts`:

```ts
export const APP_NAME = 'Dunya Editor';

export function serverConfig() {
  const required = [
    'GITHUB_OAUTH_CLIENT_ID',
    'GITHUB_OAUTH_CLIENT_SECRET',
    'GITHUB_WRITE_TOKEN',
    'SESSION_SECRET',
    'ALLOWED_GITHUB_LOGIN',
    'TARGET_REPO',
    'TARGET_BRANCH',
    'APP_ORIGIN',
  ] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  return Object.fromEntries(required.map((key) => [key, process.env[key]!])) as Record<(typeof required)[number], string>;
}
```

- [ ] **Step 6: Run tests and static checks**

```bash
npx vitest run
npm run lint
npx tsc --noEmit
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: bootstrap standalone editor"
```

---

### Task 2: Implement GitHub OAuth Owner Authentication

**Files:**
- Create: `lib/auth/session.ts`
- Create: `lib/auth/github-oauth.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/callback/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/session/route.ts`
- Create: `middleware.ts`
- Test: `tests/auth/session.test.ts`
- Test: `tests/auth/authorization.test.ts`

**Interfaces:**
- Produces: `createSession(login): string`, `readSession(cookie): SessionClaims | null`, `requireOwnerSession(request): SessionClaims`, authenticated `/api/session`.

- [ ] **Step 1: Write failing session tests**

```ts
import { describe, expect, it } from 'vitest';
import { createSession, readSession } from '@/lib/auth/session';

describe('signed session', () => {
  it('round-trips owner identity and csrf token', () => {
    process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret';
    const cookie = createSession('aasimaltomi', 1_800);
    const session = readSession(cookie);
    expect(session?.login).toBe('aasimaltomi');
    expect(session?.csrf).toMatch(/^[a-f0-9]{32,}$/);
  });

  it('rejects a modified cookie', () => {
    process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret';
    const cookie = createSession('aasimaltomi', 1_800);
    expect(readSession(`${cookie}x`)).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

```bash
npx vitest run tests/auth/session.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement signed owner session**

Use HMAC-SHA256 over a base64url JSON payload containing exactly:

```ts
type SessionClaims = {
  login: string;
  csrf: string;
  exp: number;
};
```

`createSession()` must generate `csrf` with `randomBytes(24).toString('hex')`; `readSession()` must use `timingSafeEqual`, reject expired claims, and never contain an OAuth or write token.

- [ ] **Step 4: Implement OAuth start and callback**

`GET /api/auth/login` must generate OAuth `state`, store it in a short-lived signed cookie, and redirect to GitHub with callback:

```text
https://devmyskilla-editor.vercel.app/api/auth/callback
```

The callback must:

```ts
1. verify state cookie
2. exchange code at https://github.com/login/oauth/access_token
3. call https://api.github.com/user with the returned token
4. compare user.login exactly to ALLOWED_GITHUB_LOGIN
5. discard the OAuth token after verification
6. issue the signed HttpOnly session cookie
7. redirect to /dashboard
```

Return HTTP 403 for any different GitHub login.

- [ ] **Step 5: Add route protection and session endpoint**

Protect `/dashboard/:path*` and `/editor/:path*` in `middleware.ts`. `/api/session` returns only:

```json
{"authenticated":true,"login":"aasimaltomi","csrf":"<session csrf>"}
```

- [ ] **Step 6: Run auth tests**

```bash
npx vitest run tests/auth
npm run lint
npx tsc --noEmit
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add lib/auth app/api/auth app/api/session middleware.ts tests/auth
git commit -m "feat: add owner-only GitHub authentication"
```

---

### Task 3: Add Safe GitHub Repository Read/Write Service

**Files:**
- Create: `lib/github/client.ts`
- Create: `lib/github/content.ts`
- Create: `lib/content/schema.ts`
- Create: `app/api/content/route.ts`
- Create: `app/api/content/save/route.ts`
- Test: `tests/github/content.test.ts`
- Test: `tests/api/content-save.test.ts`

**Interfaces:**
- Produces: `readJsonFile(path) -> { value, sha }`, `writeJsonFile({path,value,expectedSha,message})`, `PublicSiteDataSchema`.

- [ ] **Step 1: Write failing stale-SHA and path allowlist tests**

Test that only `data.json` is accepted in this phase and that a changed SHA returns a conflict instead of writing.

```ts
expect(() => assertEditablePath('research-data.json')).toThrow();
expect(() => assertEditablePath('data.json')).not.toThrow();
```

- [ ] **Step 2: Run tests and verify failure**

```bash
npx vitest run tests/github/content.test.ts tests/api/content-save.test.ts
```

- [ ] **Step 3: Implement GitHub REST client**

Use server-only `GITHUB_WRITE_TOKEN` and GitHub API version `2022-11-28`. Read and write:

```text
/repos/aasimaltomi/devmyskilla.github.io/contents/data.json
```

A write must first GET the current blob, compare its `sha` with `expectedSha`, and throw a typed conflict error when different.

- [ ] **Step 4: Validate public data before writing**

`PublicSiteDataSchema` must at minimum assert:

```ts
{
  platforms: z.array(z.object({ id: z.string() })).length(40)
}
```

and preserve unknown existing keys with `.passthrough()` so the editor does not strip fields it does not edit.

- [ ] **Step 5: Implement authenticated APIs**

`GET /api/content` returns `{data,sha}`. `POST /api/content/save` requires owner session, exact `Origin === APP_ORIGIN`, `X-CSRF-Token === session.csrf`, valid schema, and returns HTTP 409 on stale SHA.

- [ ] **Step 6: Run tests and checks**

```bash
npx vitest run tests/github tests/api
npm run lint
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add lib/github lib/content app/api/content tests/github tests/api
git commit -m "feat: add safe GitHub content API"
```

---

### Task 4: Build the Structured Dashboard

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/platforms/page.tsx`
- Create: `components/dashboard/Shell.tsx`
- Create: `components/platforms/PlatformList.tsx`
- Create: `components/platforms/PlatformForm.tsx`
- Create: `lib/content/platform-fields.ts`
- Test: `tests/ui/platform-form.test.tsx`

**Interfaces:**
- Consumes: `/api/content`, `/api/content/save`.
- Produces: structured editing UI for all 40 public platforms and public category data.

- [ ] **Step 1: Write failing platform form test**

```tsx
render(<PlatformForm platform={fixturePlatform} onChange={onChange} />);
expect(screen.getByLabelText('Arabic name')).toHaveValue(fixturePlatform.name.ar);
expect(screen.getByLabelText('Official URL')).toHaveValue(fixturePlatform.url);
```

- [ ] **Step 2: Run test and verify failure**

```bash
npx vitest run tests/ui/platform-form.test.tsx
```

- [ ] **Step 3: Implement field descriptors**

Define explicit editable field paths for platform name, description, URL, image/logo fields present in current data, localized values, and public categories. Do not generate controls for `research-data.json` or arbitrary unknown fields.

- [ ] **Step 4: Implement dashboard shell and platforms UI**

The UI must show 40 platforms, searchable by name, with Save and Discard controls. Save sends the original SHA plus the fully validated updated `data.json`.

- [ ] **Step 5: Add conflict UI**

On HTTP 409 display:

```text
The site data changed after you opened this editor. Reload the latest version before saving.
```

Do not retry or overwrite automatically.

- [ ] **Step 6: Run UI and integration tests**

```bash
npx vitest run
npm run lint
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add app/dashboard components lib/content tests/ui
git commit -m "feat: add structured platform dashboard"
```

---

### Task 5: Deploy and Verify the Foundation on Vercel

**Files:**
- Modify: `README.md`
- Create: `docs/deployment.md`
- Test: production smoke checks.

**Interfaces:**
- Produces: reachable standalone editor foundation at `https://devmyskilla-editor.vercel.app`.

- [ ] **Step 1: Configure Vercel environment variables**

Set exactly the keys documented in `.env.example`. `GITHUB_WRITE_TOKEN` must be a fine-grained token restricted to `aasimaltomi/devmyskilla.github.io` with Contents read/write permission.

- [ ] **Step 2: Configure the GitHub OAuth App callback**

Set callback URL exactly to:

```text
https://devmyskilla-editor.vercel.app/api/auth/callback
```

- [ ] **Step 3: Deploy the private repository to Vercel**

Deploy from `main` and confirm the final project URL is `https://devmyskilla-editor.vercel.app`.

- [ ] **Step 4: Run production authentication checks**

Verify:

```text
anonymous /dashboard -> redirected to login
GitHub user aasimaltomi -> dashboard opens
any other GitHub user -> HTTP 403
browser localStorage -> contains no GitHub token
```

- [ ] **Step 5: Run production data safety checks**

Load `data.json`, confirm exactly 40 platforms, edit one non-critical text field, save, verify a GitHub commit is created, then revert that test edit through the editor. Confirm stale-SHA simulation returns 409.

- [ ] **Step 6: Document deployment**

`docs/deployment.md` must list environment variable names, OAuth callback URL, target repo/branch, and recovery procedure without including secret values.

- [ ] **Step 7: Commit**

```bash
git add README.md docs/deployment.md
git commit -m "docs: document standalone editor deployment"
```

## Self-Review Result

- Spec coverage: authentication, owner authorization, token isolation, CSRF/origin checks, structured editing, 40-platform boundary, stale-SHA protection, Vercel deployment, and no Cloudflare dependency are covered.
- Placeholder scan: no implementation placeholders remain.
- Interface consistency: auth produces owner session + CSRF; content APIs consume that session; dashboard consumes content APIs.
