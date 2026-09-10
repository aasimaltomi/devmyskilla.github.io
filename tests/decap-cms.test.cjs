const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('Decap admin shell and configuration exist',()=>{
  assert.equal(fs.existsSync('admin/index.html'),true);
  assert.equal(fs.existsSync('admin/config.yml'),true);
  assert.match(read('admin/index.html'),/decap-cms/);
});

test('Decap uses GitHub main and edits central data.json',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/name: github/);
  assert.match(config,/repo: aasimaltomi\/devmyskilla\.github\.io/);
  assert.match(config,/branch: main/);
  assert.match(config,/file: data\.json/);
});

test('Decap exposes all full CMS groups',()=>{
  const config=read('admin/config.yml');
  for(const label of ['إعدادات الموقع','الهوية والصور','نصوص الموقع','التصنيفات','اللغات','الاختبار والترشيحات','المقارنة','SEO','المنصات']){
    assert.ok(config.includes(label),`missing ${label}`);
  }
});

test('Decap exposes translations, taxonomy IDs and platform fields',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/label: "العربية"/);
  assert.match(config,/label: "English"/);
  assert.match(config,/label: "Türkçe"/);
  assert.match(config,/name: categoryId/);
  assert.match(config,/name: languageIds/);
  assert.match(config,/name: freeCertificate/);
  assert.match(config,/name: editorial/);
});

test('Decap exposes platform fields, official paths and research metadata',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/name: fields/);
  assert.match(config,/name: officialPaths/);
  assert.match(config,/name: pathResearch/);
  assert.match(config,/name: officialName/);
  assert.match(config,/name: fieldIds/);
  assert.match(config,/name: fieldsSourceUrl/);
  assert.match(config,/name: pathsSourceUrl/);
  assert.match(config,/name: allPathsUrl/);
  for(const type of ['learning-path','career-path','skill-path','professional-certificate','professional-program','specialization','role-path','structured-series','other-official-path'])assert.ok(config.includes(type),`missing path type ${type}`);
});

test('Decap authoritative platform field editor exposes stable id translated name and official URL',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/label: "المجالات \/ Fields"[\s\S]*?name: fields[\s\S]*?widget: list/);
  assert.match(config,/label: "معرّف المجال الثابت"\s*\n\s*name: id\s*\n\s*widget: string/);
  assert.match(config,/label: "اسم المجال"\s*\n\s*name: name\s*\n\s*widget: object[\s\S]*?label: "العربية"[\s\S]*?name: ar[\s\S]*?label: "English"[\s\S]*?name: en[\s\S]*?label: "Türkçe"[\s\S]*?name: tr/);
  assert.match(config,/label: "رابط المجال الرسمي"\s*\n\s*name: officialUrl\s*\n\s*widget: string/);
});

test('image fields use media library and OAuth proxy remains configured',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/widget: image/);
  assert.match(config,/media_folder: assets\/uploads/);
  assert.match(config,/public_folder: \/assets\/uploads/);
  assert.match(config,/base_url: https:\/\/dunya-decap-oauth\.atomy8774\.workers\.dev/);
  assert.match(config,/auth_endpoint: auth/);
});

test('Decap configuration contains no OAuth client secret',()=>{
  const config=read('admin/config.yml');
  assert.doesNotMatch(config,/client_secret|CLIENT_SECRET|github_client_secret|GITHUB_OAUTH_SECRET/i);
});