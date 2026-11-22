import test from 'node:test';
import assert from 'node:assert/strict';
import {todayIndia,filterCourses,filterUpcomingBatches,compareSelection,filterEnquiries,safeCsvCell,buildEnquiriesCsv} from '../assets/discovery.js';
const courses=[
 {id:'a',title:'DevOps',category:'Cloud',fee_inr:18000,duration_weeks:16,description:'AWS',delivery_modes:['Online']},
 {id:'b',title:'Java',category:'Development',fee_inr:17000,duration_weeks:24,description:'Spring',delivery_modes:['Classroom','Online']},
 {id:'c',title:'Python',category:'Development',fee_inr:15000,duration_weeks:20,description:'Django',delivery_modes:['Classroom']},
 {id:'d',title:'Cloud other',category:'Cloud',fee_inr:null,duration_weeks:12,delivery_modes:['Online']},
];
const batches=[{id:'old',course_id:'a',start_date:'2025-05-01',mode:'Online'},{id:'next',course_id:'a',start_date:'2026-12-07',mode:'Online'},{id:'class',course_id:'b',start_date:'2026-12-14',mode:'Classroom'},{id:'orphan',course_id:'xx',start_date:'2027-01-01',mode:'Online'}];
test('course search and category',()=>assert.deepEqual(filterCourses(courses,{query:'spring',category:'Development'}).map(x=>x.id),['b']));
test('filter modes',()=>assert.deepEqual(filterCourses(courses,{mode:'Classroom'}).map(x=>x.id),['b','c']));
test('sort low fee and leave unknown price last',()=>assert.deepEqual(filterCourses(courses,{sort:'fee-asc'}).map(x=>x.id),['c','b','a','d']));
test('sort high fee and leave unknown price last',()=>assert.deepEqual(filterCourses(courses,{sort:'fee-desc'}).map(x=>x.id),['a','b','c','d']));
test('sort by duration',()=>assert.equal(filterCourses(courses,{sort:'duration'})[0].id,'d'));
test('sort alphabetically',()=>assert.equal(filterCourses(courses,{sort:'name'})[0].id,'d'));
test('exclude past, unpublished/orphan and apply batch filters',()=>assert.deepEqual(filterUpcomingBatches(batches,courses,{today:'2026-11-22'}).map(x=>x.id),['next','class']));
test('filter batches by course and mode',()=>assert.deepEqual(filterUpcomingBatches(batches,courses,{today:'2026-11-22',courseId:'a',mode:'Online'}).map(x=>x.id),['next']));
test('todayIndia timezone',()=>assert.equal(todayIndia(new Date('2026-11-21T20:30:00Z')),'2026-11-22'));
test('comparison deduplicates and ignores unknown IDs',()=>assert.deepEqual(compareSelection(['a','a','no','b'],courses).map(x=>x.id),['a','b']));
test('comparison caps at three',()=>assert.equal(compareSelection(['a','b','c','d'],courses).length,3));
const leads=[{id:'1',full_name:'Demo Learner',email:'demo@example.com',status:'new',question:'AWS',course_id:'a'},{id:'2',full_name:'Test Person',email:'test@example.com',status:'closed',question:'Java',course_id:'b'}];
test('enquiries search private data and status',()=>assert.deepEqual(filterEnquiries(leads,{query:'aws',status:'new'}).map(x=>x.id),['1']));
test('CSV spreadsheet formula injection protection',()=>{for(const val of ['=1+1',' +SUM(A1)','-4+1','@command','\t=calc'])assert.ok(safeCsvCell(val).startsWith('"\''));});
test('CSV quotes and newlines safely',()=>assert.equal(safeCsvCell('hi, "bye"\nthere'),'"hi, ""bye""\nthere"'));
test('CSV includes headers and lead data',()=>{const csv=buildEnquiriesCsv(leads,{a:'DevOps'});assert.ok(csv.startsWith('\uFEFF"ID"'));assert.match(csv,/"DevOps"/);assert.match(csv,/"demo@example.com"/)});