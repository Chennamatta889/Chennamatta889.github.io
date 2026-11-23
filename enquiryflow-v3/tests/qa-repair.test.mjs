import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const student=read('../assets/production-student.js');
const staff=read('../assets/production-staff.js');
const adapter=read('../assets/production-adapter.js');
const privacy=read('../assets/production-privacy.html');
const css=read('../assets/app.css');
const homepage=read('../index.html');
const dashboard=read('../staff/index.html');

test('student metric counts are dynamic and correctly distinguish upcoming batches',()=>{
 assert.match(student,/id="guideMetric"/);
 assert.match(student,/guideMetric'\)\.textContent=guides\.length/);
 assert.match(student,/batchMetric'\)\.textContent=filterUpcomingBatches/);
});
test('proposed descriptions do not masquerade as published courses',()=>{
 assert.match(adapter,/!\/\^a proposed/);
 assert.match(adapter,/enrichedCourses/);
 assert.match(adapter,/batches\.filter\(b=>b\.course_id===c\.id/);
});
test('staff enquiry save closes after Firestore acknowledgement rather than whole-workspace refresh',()=>{
 const start=staff.indexOf("if(entity==='enquiries'){",staff.indexOf('await saveRecord(entity,record,state.role)'));
 assert.ok(start>0);
 assert.match(staff.slice(start,start+440),/editorOverlay/);
 assert.match(staff.slice(start,start+440),/return;/);
});
test('delete endpoints require verified manager and guard related batches',()=>{
 assert.match(adapter,/export async function deleteManagedRecord/);
 assert.match(adapter,/Only owner\/admin may delete/);
 assert.match(adapter,/Delete related batches before deleting this course/);
 assert.match(staff,/data-delete-record/);
 assert.match(staff,/Permanently delete/);
});
test('staff and student control clarity and privacy failure fallback',()=>{
 assert.match(staff,/data-catalog-search/);
 assert.match(staff,/downloadCsvTemplate/);
 assert.match(staff,/location\.hash=tab/);
 assert.match(student,/publishedQuestions/);
 assert.match(student,/productionReadiness verifiedGoogle/);
 assert.match(privacy,/Promise\.race/);
 assert.match(privacy,/could not be verified/);
 assert.match(css,/\[hidden\]\{display:none!important\}/);
});
test('live entrypoints link versioned QA assets',()=>{
 assert.match(homepage,/production-student\.js\?v=5\.3-qa/);
 assert.match(dashboard,/production-staff\.js\?v=5\.3-qa/);
});
