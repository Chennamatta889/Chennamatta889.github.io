import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const student=readFileSync(new URL('../assets/student.js',import.meta.url),'utf8');
const staff=readFileSync(new URL('../assets/staff.js',import.meta.url),'utf8');
const config=readFileSync(new URL('../assets/config.js',import.meta.url),'utf8');

test('public pilot stays in explicitly limited demo mode',()=>{
 assert.match(config,/demoMode:\s*true/);
 assert.doesNotMatch(config,/service[_-]?role\s*:/);
});
test('demo intake must not claim email or staff delivery',()=>{
 assert.match(student,/NOT sent to the institute/);
 assert.match(student,/Nothing was emailed or delivered/);
 assert.match(student,/Save fictional enquiry locally/);
});
test('student demo confirmation links to the same-browser staff enquiry screen',()=>{
 assert.match(student,/\.\/staff\/\?view=enquiries/);
 assert.match(staff,/new URLSearchParams\(location\.search\)\.get\('view'\)==='enquiries'/);
});
test('staff inbox warns about local-only demo',()=>{
 assert.match(staff,/Local demo inbox only/);
 assert.match(staff,/does not receive real student submissions/);
});
test('duplicate submit prevented, errors displayed clearly',()=>{
 assert.match(student,/if\(button\.disabled\)return/);
 assert.match(student,/button\.disabled=true/);
 assert.match(student,/finally\{/);
 assert.match(student,/Enquiry was not saved or sent/);
});