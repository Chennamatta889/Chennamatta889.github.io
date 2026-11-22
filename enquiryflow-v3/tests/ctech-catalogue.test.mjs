import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courseTemplates,faqTemplates,remainingCourseTemplates,remainingFaqTemplates} from '../assets/ctech-catalogue.js';
import {staffFormPayload} from '../assets/staff-form.js';
const read=file=>readFileSync(new URL(file,import.meta.url),'utf8');

test('Ctech editorial catalogue includes 16 detailed, safe UNPUBLISHED proposals',()=>{
 assert.equal(courseTemplates.length,16);
 assert.equal(new Set(courseTemplates.map(t=>t.slug)).size,16);
 for(const c of courseTemplates){
  assert.ok(c.title&&c.description&&c.curriculum.length>=7&&c.outcomes.length>=3&&c.projects.length>=2);
  assert.ok(c.prerequisites&&c.audience&&c.level);
  assert.equal(c.published,false);
  assert.equal(c.verified_at,null);
  assert.equal(c.fee_inr,null);
  assert.equal(c.duration_weeks,null);
  assert.deepEqual(c.delivery_modes,[]);
 }
});
test('Ctech starter FAQs are private drafts until reviewed',()=>{
 assert.equal(faqTemplates.length,8);
 assert.ok(faqTemplates.every(f=>f.published===false&&f.reviewed_at===null));
});
test('Reimport skips matching slug and does not re-add existing FAQs',()=>{
 assert.equal(remainingCourseTemplates([{slug:'aws-cloud-engineering'},{title:'Python Programming and Automation'}]).length,14);
 assert.equal(remainingFaqTemplates([{question:faqTemplates[0].question}]).length,7);
});
test('Staff app imports only as drafts and verifies written records',()=>{
 const app=read('../assets/production-staff.js');
 assert.match(app,/importTemplateDrafts\('courses'\)/);
 assert.match(app,/importTemplateDrafts\('faqs'\)/);
 assert.match(app,/draft=\{\.\.\.template,published:false\}/);
 assert.match(app,/draft\.fee_inr=null;draft\.duration_weeks=null;draft\.delivery_modes=\[\]/);
 assert.match(app,/await saveRecord\(entity,draft,state.role\)/);
 assert.match(app,/await staffData\(\)/);
});
test('Expanded course form preserves arrays of outcomes and projects',()=>{
 const f=new FormData();
 for(const [k,v] of Object.entries({title:'Verified Sample',duration_weeks:'8',fee_inr:'12000',description:'Sample course',outcomes:'Skill A\nSkill B',projects:'Project 1\nProject 2',curriculum:'Module 1\nModule 2'}))f.append(k,v);
 const course=staffFormPayload(f,'courses',{canPublish:true});
 assert.equal(course.published,false);
 assert.deepEqual(course.outcomes,['Skill A','Skill B']);
 assert.deepEqual(course.projects,['Project 1','Project 2']);
});
test('Student detail modal only opens a record from approved public courses',()=>{
 const app=read('../assets/production-student.js');
 assert.match(app,/data-course-detail/);
 assert.match(app,/data\?\.courses\.find\(x=>x.id===id\)/);
 assert.match(app,/id="courseDetailsDialog"/);
 assert.match(app,/esc\(c\.title\)/);
});
