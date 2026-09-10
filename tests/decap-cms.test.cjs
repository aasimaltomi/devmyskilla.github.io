const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('Decap admin shell and configuration exist',()=>{
  assert.equal(fs.existsSync('admin/index.html'),true);
  assert.equal(fs.existsSync('admin/config.yml'),true);
  assert.match(read('admin/index.html'),/decap-cms/);
});

test('Decap uses GitHub main and edits public and research JSON separately',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/name: github/);
  assert.match(config,/repo: aasimaltomi\/devmyskilla\.github\.io/);
  assert.match(config,/branch: main/);
  assert.match(config,/file: data\.json/);
  assert.match(config,/file: research-data\.json/);
});

test('Decap exposes all full public CMS groups',()=>{
  const config=read('admin/config.yml');
  for(const label of ['إعدادات الموقع','الهوية والصور','نصوص الموقع','التصنيفات','اللغات','الاختبار والترشيحات','المقارنة','SEO','المنصات']){
    assert.ok(config.includes(label),`missing ${label}`);
  }
});

test('Decap exposes translations, taxonomy IDs and public platform fields',()=>{
  const config=read('admin/config.yml');
  assert.match(config,/label: "العربية"/);
  assert.match(config,/label: "English"/);
  assert.match(config,/label: "Türkçe"/);
  assert.match(config,/name: categoryId/);
  assert.match(config,/name: languageIds/);
  assert.match(config,/name: freeCertificate/);
  assert.match(config,/name: editorial/);
});

test('Decap exposes research paths and metadata in research-data.json',()=>{
  const config=read('admin/config.yml');
  const researchStart=config.indexOf('file: research-data.json');
  assert.ok(researchStart>=0,'research-data.json entry missing');
  const researchSection=config.slice(researchStart);
  assert.match(researchSection,/name: publicPlatformResearch/);
  assert.match(researchSection,/name: nonPublicPlatforms/);
  assert.match(researchSection,/name: officialPaths/);
  assert.match(researchSection,/name: pathResearch/);
  assert.match(researchSection,/name: officialName/);
  assert.match(researchSection,/name: fieldIds/);
  assert.match(researchSection,/name: fieldsSourceUrl/);
  assert.match(researchSection,/name: pathsSourceUrl/);
  assert.match(researchSection,/name: allPathsUrl/);
  for(const type of ['learning-path','career-path','skill-path','professional-certificate','professional-program','specialization','role-path','structured-series','other-official-path'])assert.ok(researchSection.includes(type),`missing path type ${type}`);
});

test('public research rows never duplicate authoritative public fields',()=>{
  const config=read('admin/config.yml');
  const researchStart=config.indexOf('file: research-data.json');
  assert.ok(researchStart>=0,'research-data.json entry missing');
  const researchSection=config.slice(researchStart);
  const publicResearchStart=researchSection.indexOf('name: publicPlatformResearch');
  const nonPublicStart=researchSection.indexOf('name: nonPublicPlatforms');
  assert.ok(publicResearchStart>=0&&nonPublicStart>publicResearchStart,'research subsections missing');
  const publicResearchSection=researchSection.slice(publicResearchStart,nonPublicStart);
  assert.doesNotMatch(publicResearchSection,/\n\s*name: fields\s*\n/,'public research must not duplicate public fields');
});

test('Decap authoritative public platform field editor exposes stable id translated name and official URL',()=>{
  const config=read('admin/config.yml');
  const publicStart=config.indexOf('file: data.json');
  const researchStart=config.indexOf('file: research-data.json');
  const publicSection=config.slice(publicStart,researchStart);
  assert.match(publicSection,/label: "المجالات \/ Fields"[\s\S]*?name: fields[\s\S]*?widget: list/);
  assert.match(publicSection,/label: "معرّف المجال الثابت"\s*\n\s*name: id\s*\n\s*widget: string/);
  assert.match(publicSection,/label: "اسم المجال"\s*\n\s*name: name\s*\n\s*widget: object[\s\S]*?label: "العربية"[\s\S]*?name: ar[\s\S]*?label: "English"[\s\S]*?name: en[\s\S]*?label: "Türkçe"[\s\S]*?name: tr/);
  assert.match(publicSection,/label: "رابط المجال الرسمي"\s*\n\s*name: officialUrl\s*\n\s*widget: string/);
  assert.doesNotMatch(publicSection,/name: officialPaths/);
  assert.doesNotMatch(publicSection,/name: pathResearch/);
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