const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const Base = require(path.join(root, 'js', 'platform-categories.js'));
const Batch1020 = require(path.join(root, 'js', 'platform-categories-10-20.js'));
const Batch2130 = require(path.join(root, 'js', 'platform-categories-21-30.js'));
const Batch3140 = require(path.join(root, 'js', 'platform-categories-31-40.js'));
const Links = require(path.join(root, 'js', 'category-direct-links.js'));
const data = require(path.join(root, 'data.json'));

function finalData() {
  let result = {
    ...data,
    platforms: data.platforms.filter((p) => /^plat-(?:[1-9]|[1-3][0-9]|40)$/.test(p.id)),
  };
  result = Base.applyToData(result);
  result = Batch1020.applyToData(result);
  result = Batch2130.applyToData(result);
  result = Batch3140.applyToData(result);
  result = Links.applyToData(result);
  return result;
}

const publicData = finalData();
const entries = publicData.platforms.flatMap((p) => (p.fields || []).map((f) => ({
  platformId: p.id,
  platformName: p.name?.en || p.name?.ar || p.name || p.id,
  categoryId: f.id,
  categoryName: f.name?.en || f.name?.ar || f.name || f.id,
  url: f.officialUrl,
})));

if (entries.length !== 363) {
  console.error(`Expected 363 categories, found ${entries.length}`);
  process.exit(2);
}

const byUrl = new Map();
for (const entry of entries) {
  if (!byUrl.has(entry.url)) byUrl.set(entry.url, []);
  byUrl.get(entry.url).push(entry);
}

function classify(status, error) {
  if (error) return error === 'timeout' ? 'timeout' : 'network_error';
  if (status >= 200 && status < 400) return 'ok';
  if ([401, 403, 429].includes(status)) return 'blocked_or_rate_limited';
  if ([404, 410].includes(status)) return 'broken';
  if (status >= 500) return 'server_error';
  return 'other_http_error';
}

async function checkUrl(url) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; DevMySkillaLinkAudit/1.0; +https://github.com/aasimaltomi/devmyskilla.github.io)',
        accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.8',
      },
    });
    if (response.body && typeof response.body.cancel === 'function') {
      try { await response.body.cancel(); } catch (_) {}
    }
    return {
      url,
      status: response.status,
      finalUrl: response.url,
      redirected: response.url !== url,
      contentType: response.headers.get('content-type') || '',
      elapsedMs: Date.now() - started,
      classification: classify(response.status),
      error: null,
    };
  } catch (err) {
    const timeout = err?.name === 'AbortError';
    return {
      url,
      status: null,
      finalUrl: null,
      redirected: false,
      contentType: '',
      elapsedMs: Date.now() - started,
      classification: classify(null, timeout ? 'timeout' : 'network_error'),
      error: timeout ? 'timeout' : String(err?.message || err),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runPool(items, concurrency, worker) {
  const out = new Array(items.length);
  let next = 0;
  async function runner() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await worker(items[i]);
      process.stdout.write(`[${i + 1}/${items.length}] ${out[i].classification} ${items[i]}\n`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runner));
  return out;
}

(async () => {
  const urls = [...byUrl.keys()];
  console.log(`Checking ${entries.length} category entries across ${urls.length} unique URLs...`);
  const checks = await runPool(urls, 8, checkUrl);
  const checkMap = new Map(checks.map((c) => [c.url, c]));
  const expanded = entries.map((entry) => ({ ...entry, ...checkMap.get(entry.url) }));

  const counts = {};
  for (const c of checks) counts[c.classification] = (counts[c.classification] || 0) + 1;
  const categoryCounts = {};
  for (const c of expanded) categoryCounts[c.classification] = (categoryCounts[c.classification] || 0) + 1;

  const report = {
    generatedAt: new Date().toISOString(),
    totalPlatforms: publicData.platforms.length,
    totalCategories: entries.length,
    uniqueUrls: urls.length,
    uniqueUrlStatusCounts: counts,
    categoryStatusCounts: categoryCounts,
    checks,
    categories: expanded,
  };
  fs.writeFileSync(path.join(root, 'live-link-audit.json'), JSON.stringify(report, null, 2));

  const problems = checks.filter((c) => c.classification !== 'ok');
  const redirects = checks.filter((c) => c.redirected && c.classification === 'ok');
  const lines = [];
  lines.push('# Live category-link audit');
  lines.push('');
  lines.push(`- Platforms: **${publicData.platforms.length}**`);
  lines.push(`- Category entries: **${entries.length}**`);
  lines.push(`- Unique URLs checked: **${urls.length}**`);
  lines.push(`- OK: **${counts.ok || 0}**`);
  lines.push(`- Blocked/rate-limited: **${counts.blocked_or_rate_limited || 0}**`);
  lines.push(`- Broken (404/410): **${counts.broken || 0}**`);
  lines.push(`- Server errors: **${counts.server_error || 0}**`);
  lines.push(`- Timeouts: **${counts.timeout || 0}**`);
  lines.push(`- Network errors: **${counts.network_error || 0}**`);
  lines.push(`- Successful redirects: **${redirects.length}**`);
  lines.push('');
  if (problems.length) {
    lines.push('## URLs requiring manual review');
    lines.push('');
    lines.push('| Class | HTTP | URL | Error / final URL |');
    lines.push('|---|---:|---|---|');
    for (const p of problems.slice(0, 200)) {
      const detail = p.error || p.finalUrl || '';
      lines.push(`| ${p.classification} | ${p.status ?? ''} | ${p.url.replace(/\|/g, '%7C')} | ${String(detail).replace(/\|/g, '%7C')} |`);
    }
    lines.push('');
  }
  if (redirects.length) {
    lines.push('## Successful redirects to inspect');
    lines.push('');
    lines.push('| HTTP | Original | Final |');
    lines.push('|---:|---|---|');
    for (const r of redirects.slice(0, 100)) {
      lines.push(`| ${r.status} | ${r.url.replace(/\|/g, '%7C')} | ${r.finalUrl.replace(/\|/g, '%7C')} |`);
    }
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
  }
  console.log(JSON.stringify({ counts, categoryCounts, uniqueUrls: urls.length }, null, 2));
})();
