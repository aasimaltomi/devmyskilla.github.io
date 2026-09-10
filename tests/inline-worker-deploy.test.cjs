const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('inline Worker declares OAuth secrets as required without storing values',()=>{
  const toml=read('inline-worker/wrangler.toml');
  assert.match(toml,/\[secrets\]/);
  assert.match(toml,/required\s*=\s*\[\s*"GITHUB_OAUTH_ID"\s*,\s*"GITHUB_OAUTH_SECRET"\s*\]/);
  assert.doesNotMatch(toml,/GITHUB_OAUTH_(?:ID|SECRET)\s*=\s*"[^"\n]+"/);
});

test('Worker deployment workflow supports manual and main-branch automatic deployment without embedding credentials',()=>{
  const yml=read('.github/workflows/deploy-inline-worker.yml');
  assert.match(yml,/workflow_dispatch:/);
  assert.match(yml,/push:\s*\n\s*branches:\s*\[?\s*main\s*\]?/m);
  assert.match(yml,/paths:\s*\n\s*-\s*['"]?inline-worker\/\*\*['"]?/m);
  for(const secret of ['CLOUDFLARE_API_TOKEN','CLOUDFLARE_ACCOUNT_ID','INLINE_GITHUB_OAUTH_ID','INLINE_GITHUB_OAUTH_SECRET']){
    assert.ok(yml.includes(`secrets.${secret}`),`workflow must reference ${secret}`);
  }
  assert.doesNotMatch(yml,/secrets\.GITHUB_OAUTH_(?:ID|SECRET)/);
  assert.match(yml,/GITHUB_OAUTH_ID=\$\{\{ secrets\.INLINE_GITHUB_OAUTH_ID \}\}/);
  assert.match(yml,/GITHUB_OAUTH_SECRET=\$\{\{ secrets\.INLINE_GITHUB_OAUTH_SECRET \}\}/);
  assert.match(yml,/wrangler@4\.97\.0 deploy/);
  assert.match(yml,/--secrets-file inline-worker\/\.deploy-secrets\.env/);
  assert.doesNotMatch(yml,/client-secret|secret-token|access_token/i);
});
