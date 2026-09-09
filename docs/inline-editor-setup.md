# إعداد المحرر المباشر

المحرر المباشر يعمل فوق `data.json` ولا يغيّر بنية المحتوى الأساسية. الزائر العادي لا يدخل وضع التحرير؛ التفعيل يتم فقط عند فتح الموقع مع `?edit=1` ثم تسجيل الدخول عبر GitHub.

## المكونات

- الواجهة العامة: `https://aasimaltomi.github.io/devmyskilla.github.io/?edit=1`
- Origin المتصفح المستخدم في CORS: `https://aasimaltomi.github.io`
- Worker المتوقع: `https://dunya-inline-editor.atomy8774.workers.dev`
- OAuth callback: `https://dunya-inline-editor.atomy8774.workers.dev/inline/callback`
- المستودع: `aasimaltomi/devmyskilla.github.io`
- الفرع الذي يكتب إليه Worker: `main`
- تخزين الجلسات: Cloudflare Workers KV عبر binding باسم `INLINE_SESSIONS`

## 1. GitHub OAuth App

أنشئ GitHub OAuth App منفصلًا للمحرر المباشر، واجعل Authorization callback URL مساويًا تمامًا لـ:

`https://dunya-inline-editor.atomy8774.workers.dev/inline/callback`

احتفظ بـ Client ID وClient Secret خارج المستودع. لا تضع أي قيمة سرية داخل `wrangler.toml` أو ملفات الموقع.

## 2. GitHub Actions Secrets للنشر

أضف في:

`Settings → Secrets and variables → Actions → New repository secret`

الأسماء التالية بالضبط:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `INLINE_GITHUB_OAUTH_ID` — قيمته هي GitHub OAuth Client ID
- `INLINE_GITHUB_OAUTH_SECRET` — قيمته هي GitHub OAuth Client Secret

Workflow النشر يحوّل الاسمين الأخيرين وقت النشر إلى متغيري Worker الداخليين `GITHUB_OAUTH_ID` و`GITHUB_OAUTH_SECRET`.

## 3. إعداد Cloudflare Worker

ملف الإعداد هو `inline-worker/wrangler.toml`. القيم العامة للإنتاج هي:

- `ALLOWED_ORIGIN=https://aasimaltomi.github.io`
- `GITHUB_REPO=aasimaltomi/devmyskilla.github.io`
- `GITHUB_BRANCH=main`
- `SESSION_TTL_SECONDS=3600`
- KV binding: `INLINE_SESSIONS`

مهم: قيمة `ALLOWED_ORIGIN` هي **Origin فقط**، وليست رابط GitHub Pages الكامل؛ لذلك لا نضيف `/devmyskilla.github.io` إليها.

إذا نشرت يدويًا من جهازك بدل GitHub Actions، فمن مجلد `inline-worker` خزّن بيانات OAuth كأسرار Cloudflare بالأسماء الداخلية:

```bash
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler deploy
```

لا تُدخل قيم الأسرار في الأوامر نفسها؛ Wrangler سيطلبها تفاعليًا.

## 4. التحقق بعد النشر

افتح `https://aasimaltomi.github.io/devmyskilla.github.io/?edit=1`. عند عدم وجود جلسة سيعرض المحرر زر تسجيل الدخول. بعد نجاح GitHub OAuth يجب أن تظهر أدوات التحرير فقط للحقول المسموح بها. المتصفح يحتفظ بمعرّف جلسة opaque فقط؛ GitHub access token يبقى داخل Worker/KV ولا يُرسل إلى الواجهة.

الحفظ يقرأ أحدث `data.json` من `main` ويقارن `baseSha`. إذا تغيّر الملف منذ بدء التعديل، يرجع Worker تعارض HTTP 409 بدل الكتابة فوق تعديل أحدث. بعد نجاح الحفظ يكتب Worker `data.json` فقط.

## 5. لوحة Decap

`/admin/` تبقى لوحة Decap CMS الكاملة، وبداخلها رابط **تحرير مباشر** يعيد إلى الصفحة الرئيسية مع `?edit=1`.

## أسرار يجب ألا تظهر في المستودع

- `INLINE_GITHUB_OAUTH_ID` في GitHub Actions
- `INLINE_GITHUB_OAUTH_SECRET` في GitHub Actions
- `GITHUB_OAUTH_ID` و`GITHUB_OAUTH_SECRET` داخل بيئة Cloudflare Worker
- GitHub access tokens
- معرفات الجلسات الفعلية

يمكن أن تكون بيانات مثل `ALLOWED_ORIGIN` و`GITHUB_REPO` و`GITHUB_BRANCH` علنية لأنها إعدادات وليست أسرارًا.
