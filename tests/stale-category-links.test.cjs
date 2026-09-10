const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const batch1020=fs.readFileSync('js/platform-categories-10-20.js','utf8');
const batch2130=fs.readFileSync('js/platform-categories-21-30.js','utf8');

test('OpenLearn and Alison use current official category destinations',()=>{
  assert.ok(batch1020.includes('https://www.open.edu/openlearn/money-management/free-courses'));
  assert.ok(!batch1020.includes('https://www.open.edu/openlearn/money-business/free-courses'));

  for(const url of [
    'https://alison.com/courses/marketing',
    'https://alison.com/courses/engineering',
    'https://alison.com/courses/education'
  ]) assert.ok(batch2130.includes(url),`missing ${url}`);
  for(const dead of [
    'https://alison.com/courses/sales-and-marketing',
    'https://alison.com/courses/engineering-and-construction',
    'https://alison.com/courses/teaching-and-academics'
  ]) assert.ok(!batch2130.includes(dead),`legacy URL remains: ${dead}`);
});

test('Simplilearn audited categories use verified live SkillUp landing pages',()=>{
  const live=[
    'https://www.simplilearn.com/skillup-free-online-courses/leadership',
    'https://www.simplilearn.com/skillup-free-online-courses/management',
    'https://www.simplilearn.com/skillup-free-online-courses/quality-assurance',
    'https://www.simplilearn.com/skillup-free-online-courses/ui-ux',
    'https://www.simplilearn.com/skillup-free-online-courses/self-development'
  ];
  for(const url of live) assert.ok(batch2130.includes(url),`missing ${url}`);
  for(const deadSlug of [
    'business-and-leadership',
    'it-service-and-architecture',
    'quality-management',
    'product-and-design',
    'personal-development'
  ]) assert.ok(!batch2130.includes(`/skillup-free-online-courses/${deadSlug}'`),`dead Simplilearn slug remains: ${deadSlug}`);
});
