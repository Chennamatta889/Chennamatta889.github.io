import test from 'node:test';
import assert from 'node:assert/strict';
import { sample } from '../assets/fixtures.js';
import { searchKnowledge, money } from '../assets/utils.js';
const source=structuredClone(sample);
const ask=(query, context={today:'2026-11-22'})=>searchKnowledge(query,source,context);
test('combined fee and weekend schedule uses same approved course',()=>{
 const a=ask('DevOps fee and next weekend batch');assert.match(a.answer,/₹18,000/);assert.match(a.answer,/12 Dec 2026/);assert.equal(a.intent,'fee-and-batch');
});
test('follow-up uses prior explicitly selected course',()=>{
 const first=ask('What is Python fee?');const second=ask('What about upcoming online batches?',{courseId:first.courseId,today:'2026-11-22'});
 assert.match(second.answer,/Python morning/);assert.doesNotMatch(second.answer,/DevOps weekend/);
});
test('course comparisons show correct distinct fees',()=>{
 const a=ask('Compare Java vs Python prices');assert.equal(a.intent,'compare');assert.match(a.answer,/₹17,000/);assert.match(a.answer,/₹15,000/);
});
test('cheapest selection uses approved published prices',()=>{
 const a=ask('Which course is cheapest?');assert.equal(a.intent,'compare');assert.match(a.answer,/Data Analytics: ₹14,000/);
});
test('all course fee overview is grounded',()=>{
 const a=ask('Show all course fees');assert.equal(a.intent,'fees-all');assert.match(a.answer,/Cloud & DevOps Engineering: ₹18,000/);
});
test('unknown refund does not guess',()=>{
 const a=ask('Can I get a refund?');assert.equal(a.handoff,true);assert.doesNotMatch(a.answer,/refund is available|100%/i);
});
test('approved placement FAQ used, no guarantee invented',()=>{
 const a=ask('Are placements guaranteed?');assert.match(a.answer,/does not offer or imply/i);assert.equal(a.intent,'policy');
});
test('a request for a human gets a handoff',()=>{
 const a=ask('Can I talk to a counselor?');assert.equal(a.intent,'handoff');assert.equal(a.handoff,true);
});
test('unavailable future schedule gets human followup',()=>{
 const a=ask('Next Java weekend batch?',{today:'2026-11-22'});assert.equal(a.handoff,true);assert.match(a.answer,/No matching upcoming published batch/);
});
test('past batches never marketed as upcoming',()=>{
 const a=ask('When is the next DevOps batch?',{today:'2027-01-01'});assert.equal(a.handoff,true);assert.doesNotMatch(a.answer,/starts 7 Dec 2026/);
});
test('unpublished and unverified content cannot appear',()=>{
 const d=structuredClone(source);d.courses[0].published=false;d.courses[1].verified_at=null;
 const a=searchKnowledge('Show all course fees',d,{today:'2026-11-22'});
 assert.doesNotMatch(a.answer,/₹18,000|₹15,000/);
});
test('no false zero fee when amount is missing',()=>{
 const d=structuredClone(source);d.courses[0].fee_inr=null;
 const a=searchKnowledge('DevOps fee',d,{today:'2026-11-22'});
 assert.equal(money(null),'Contact institute');assert.doesNotMatch(a.answer,/₹0\b/);assert.equal(a.handoff,true);
});
test('untrusted source URLs not returned to browser as clickable javascript',()=>{
 const d=structuredClone(source);d.courses[0].source_url='javascript:alert(1)';
 const a=searchKnowledge('DevOps fee',d,{today:'2026-11-22'});
 assert.deepEqual(a.sources,[]); // Unsafe links are rejected before rendering.
});
test('privacy-sensitive contact details cause no personal-data answer',()=>{
 const a=ask('My number is 9876543210. Tell me about Python');assert.equal(a.intent,'privacy');assert.doesNotMatch(a.answer,/9876543210/);
});
test('unknown question hands off rather than guessing',()=>{
 const a=ask('Can I use the campus helicopter?');assert.equal(a.handoff,true);
});
test('ambiguously mentioning multiple courses prompts clarification',()=>{
 const a=ask('Do Python and Java both have weekend batches?');assert.equal(a.intent,'clarify');assert.match(a.answer,/multiple courses/);
});
test('fresh staff updates are reflected in assistant responses',()=>{
 const d=structuredClone(source);d.courses[0].fee_inr=21999;d.courses[0].fee_note='Staff-approved price';
 const a=searchKnowledge('DevOps fees',d,{today:'2026-11-22'});assert.match(a.answer,/₹21,999/);assert.doesNotMatch(a.answer,/₹18,000/);
});
test('unknown course name does not invent a match',()=>{
 const a=ask('What is the C++ fee?');assert.equal(a.intent,'clarify');assert.doesNotMatch(a.answer,/₹18,000/);
});
test('result provides next-step question chips',()=>{
 const a=ask('Python syllabus');assert.ok(a.suggestions.length>0);assert.equal(a.courseId,'c-python');
});