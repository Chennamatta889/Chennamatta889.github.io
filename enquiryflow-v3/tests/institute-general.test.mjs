import test from 'node:test';
import assert from 'node:assert/strict';
import {sample} from '../assets/fixtures.js';
import {searchKnowledge} from '../assets/utils.js';
const data=()=>structuredClone(sample);
const ask=(q,d=data(),context={today:'2026-11-22'})=>searchKnowledge(q,d,context);

test('gives useful general institute profile grounded in published description',()=>{
 const a=ask('Tell me about the institute');
 assert.equal(a.intent,'institute');
 assert.match(a.answer,/Demo Tech Academy/);
 assert.match(a.answer,/fictional demonstration institute/i);
 assert.match(a.answer,/Hyderabad/);
 assert.match(a.answer,/4 published and verified courses/);
});
test('answers how many courses and lists verified published names',()=>{
 const a=ask('How many courses are available?');
 assert.equal(a.intent,'course-count');
 assert.match(a.answer,/4 published and verified courses/);
 assert.match(a.answer,/Python Full Stack/);
 assert.match(a.answer,/Data Analytics/);
});
test('course count excludes drafts and unverified records',()=>{
 const d=data();d.courses[0].published=false;d.courses[1].verified_at=null;
 const a=ask('Total number of courses?',d);
 assert.match(a.answer,/2 published and verified courses/);
 assert.doesNotMatch(a.answer,/DevOps|Python/);
});
test('answers all course fees on an unspecific fee question',()=>{
 const a=ask('What are the fees?');
 assert.equal(a.intent,'fees-all');
 assert.match(a.answer,/₹18,000/);
 assert.match(a.answer,/₹15,000/);
 assert.match(a.answer,/₹17,000/);
 assert.match(a.answer,/₹14,000/);
 assert.match(a.answer,/Illustrative demo/);
});
test('missing published fee is not represented as zero',()=>{
 const d=data();d.courses[0].fee_inr=null;
 const a=ask('Show all course fees',d);
 assert.match(a.answer,/Cloud & DevOps Engineering: fee not published/);
 assert.doesNotMatch(a.answer,/₹0\b/);
});
test('finds earliest upcoming batch across all published courses',()=>{
 const a=ask('When is the next batch?');
 assert.equal(a.intent,'batches-all');
 assert.match(a.answer,/DevOps weekday evening/);
 assert.match(a.answer,/7 Dec 2026/);
 assert.doesNotMatch(a.answer,/12 Dec 2026/);
});
test('shows filtered weekend batches across all courses',()=>{
 const a=ask('Show all upcoming weekend batches');
 assert.equal(a.intent,'batches-all');
 assert.match(a.answer,/12 Dec 2026/);
 assert.match(a.answer,/19 Dec 2026/);
 assert.doesNotMatch(a.answer,/7 Dec 2026/);
});
test('does not show past dates as upcoming',()=>{
 const a=ask('When is the next batch?',data(),{today:'2027-01-01'});
 assert.equal(a.intent,'batches-all');
 assert.equal(a.handoff,true);
 assert.doesNotMatch(a.answer,/starts 7 Dec 2026/);
});
test('answers combined generic fees and next batches',()=>{
 const a=ask('What are the fees and next batch?');
 assert.equal(a.intent,'fees-and-batches-all');
 assert.match(a.answer,/₹18,000/);
 assert.match(a.answer,/7 Dec 2026/);
});
test('does not leak unpublished staff account records',()=>{
 const d=data();d.staff=[{id:'private',name:'Private Teacher',role:'admin',email:'internal-secret@example.com'}];
 const a=ask('Who are the trainers?',d);
 assert.equal(a.intent,'staff');
 assert.equal(a.handoff,true);
 assert.match(a.answer,/not been approved for publication/);
 assert.doesNotMatch(a.answer,/Private Teacher|internal-secret/);
});
test('approved institute-wide staff FAQ can answer trainer questions',()=>{
 const d=data();d.faqs.push({id:'approved',course_id:null,question:'Who are the trainers?',answer:'Published faculty information: team details are available at the institute desk.',published:true,source_url:'https://example.org/faculty'});
 const a=ask('Tell me about the faculty',d);
 assert.equal(a.intent,'staff');
 assert.match(a.answer,/Published faculty information/);
 assert.deepEqual(a.sources,['https://example.org/faculty']);
});
test('unpublished staff FAQ never appears',()=>{
 const d=data();d.faqs.push({id:'draft',course_id:null,question:'Who are the trainers?',answer:'Secret Instructor XYZ',published:false,source_url:''});
 const a=ask('Who are the trainers?',d);
 assert.doesNotMatch(a.answer,/Secret Instructor/);
 assert.equal(a.handoff,true);
});
test('request to talk to counselor still provides handoff',()=>{
 const a=ask('Can I talk to someone?');
 assert.equal(a.intent,'handoff');assert.equal(a.handoff,true);
});
test('general question after course context still counts all courses',()=>{
 const a=ask('How many courses?',data(),{courseId:'c-devops',today:'2026-11-22'});
 assert.equal(a.intent,'course-count');assert.match(a.answer,/4 published/);
});
test('specific next batch after course context remains contextual',()=>{
 const a=ask('What about next batch?',data(),{courseId:'c-python',today:'2026-11-22'});
 assert.match(a.answer,/Python morning/);assert.doesNotMatch(a.answer,/DevOps weekday evening/);
});
test('combined question includes institute, courses, fees, schedules and team caveat',()=>{
 const a=ask('Tell me about the institute, courses, fees, next batch, and staff');
 assert.equal(a.intent,'institution-summary');
 for(const v of ['Demo Tech Academy','4 published and verified courses','₹18,000','7 Dec 2026','trainer names'])assert.match(a.answer,new RegExp(v));
});
test('institute contact question only shares the published profile contact',()=>{
 const a=ask('Where is your institute?');
 assert.equal(a.intent,'contact');assert.match(a.answer,/Hyderabad/);
 assert.doesNotMatch(a.answer,/Demo Student One/);
});
test('large catalogue answer is bounded in length',()=>{
 const d=data();d.courses=[...Array.from({length:90},(_,i)=>({...d.courses[0],id:'id'+i,title:'Skill '+i}))];
 const a=ask('How many courses?',d);
 assert.match(a.answer,/90 published and verified courses/);
 assert.match(a.answer,/78 more/);
 assert.ok(a.answer.length<600);
});