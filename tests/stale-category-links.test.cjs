const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const serialized=JSON.stringify(data);

test('OpenLearn and Alison use current official category destinations',()=>{
  assert.ok(serialized.includes('https://www.open.edu/openlearn/money-management/free-courses'));
  assert.ok(!serialized.includes('https://www.open.edu/openlearn/money-business/free-courses'));
  for(const url of ['https://alison.com/courses/marketing','https://alison.com/courses/engineering','https://alison.com/courses/education'])assert.ok(serialized.includes(url),`missing ${url}`);
  for(const dead of ['https://alison.com/courses/sales-and-marketing','https://alison.com/courses/engineering-and-construction','https://alison.com/courses/teaching-and-academics'])assert.ok(!serialized.includes(dead),`legacy URL remains: ${dead}`);
});

test('Simplilearn audited categories use verified live SkillUp landing pages',()=>{
  for(const url of ['https://www.simplilearn.com/skillup-free-online-courses/leadership','https://www.simplilearn.com/skillup-free-online-courses/management','https://www.simplilearn.com/skillup-free-online-courses/quality-assurance','https://www.simplilearn.com/skillup-free-online-courses/ui-ux','https://www.simplilearn.com/skillup-free-online-courses/self-development'])assert.ok(serialized.includes(url),`missing ${url}`);
  for(const deadSlug of ['business-and-leadership','it-service-and-architecture','quality-management','product-and-design','personal-development'])assert.ok(!serialized.includes(`/skillup-free-online-courses/${deadSlug}`),`dead Simplilearn slug remains: ${deadSlug}`);
});
