import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {staffFormPayload} from '../assets/staff-form.js';

const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,String(value)),removeItem:key=>store.delete(key)};
globalThis.CustomEvent=class{constructor(type){this.type=type}};
globalThis.dispatchEvent=()=>{};
const backend=await import('../assets/platform.js');
const form=values=>{const fd=new FormData();for(const [key,value] of Object.entries(values))fd.append(key,String(value));return fd};
const courseData={title:'Sample UI Automation',category:'Technology',description:'Fictional class',fee_inr:'0',duration_weeks:'6',delivery_modes:'Classroom, Online',curriculum:'Basics\nProject',source_url:''};
const batchData={course_id:'c-devops',label:'Test Weekend Cohort',start_date:'2026-12-26',days:'Saturday',time_window:'10:00-12:00',mode:'Online',seats_available:'0'};

test('free ₹0 course is valid, and numeric fee is normalized',()=>{
 const record=staffFormPayload(form(courseData),'courses',{canPublish:true});
 assert.equal(record.fee_inr,0);assert.equal(record.duration_weeks,6);
 assert.deepEqual(record.delivery_modes,['Classroom','Online']);
 assert.deepEqual(record.curriculum,['Basics','Project']);
 assert.equal(record.published,false);
});
test('validates missing/negative/non-numeric course fees and impossible duration',()=>{
 for(const fee of ['','-1','abc','2.4'])assert.throws(()=>staffFormPayload(form({...courseData,fee_inr:fee}),'courses',{canPublish:true}),/fee/i);
 assert.throws(()=>staffFormPayload(form({...courseData,duration_weeks:'0'}),'courses',{canPublish:true}),/duration/i);
});
test('save draft is visible to staff but not to students',async()=>{
 backend.resetDemo();
 const record=staffFormPayload(form(courseData),'courses',{canPublish:true});
 const saved=await backend.saveRecord('courses',record,'owner');
 assert.ok(saved.id,'new record must have persisted ID');
 const staff=await backend.staffData(),student=await backend.publicData();
 assert.ok(staff.courses.some(x=>x.id===saved.id && !x.published));
 assert.ok(!student.courses.some(x=>x.id===saved.id));
});
test('explicit Save & publish exposes the course to student view in this browser',async()=>{
 const fd=form(courseData);const record=staffFormPayload(fd,'courses',{canPublish:true,forcePublish:true});
 assert.equal(record.published,true);assert.ok(record.verified_at);
 const saved=await backend.saveRecord('courses',record,'owner');
 const student=await backend.publicData();
 assert.equal(student.courses.find(x=>x.id===saved.id).fee_inr,0);
 assert.equal(student.courses.find(x=>x.id===saved.id).published,true);
});
test('editor cannot force-publish even if submitter requests it',()=>{
 const row=staffFormPayload(form(courseData),'courses',{canPublish:false,forcePublish:true});
 assert.equal(row.published,false);
});
test('new published batch is confirmed from shared browser storage',async()=>{
 const data=staffFormPayload(form(batchData),'batches',{canPublish:true,forcePublish:true});
 const saved=await backend.saveRecord('batches',data,'owner');
 assert.ok(saved.id);
 const student=await backend.publicData();assert.ok(student.batches.find(x=>x.id===saved.id));
});
test('new published FAQ is available in approved knowledge',async()=>{
 const data=staffFormPayload(form({question:'What is Sample UI Automation?',answer:'Fictional answer.',course_id:'',source_url:''}),'faqs',{canPublish:true,forcePublish:true});
 const saved=await backend.saveRecord('faqs',data,'owner');
 assert.ok(saved.id);
 const student=await backend.publicData();assert.ok(student.faqs.find(x=>x.id===saved.id));
});
test('new draft FAQ stays hidden from student',async()=>{
 const data=staffFormPayload(form({question:'Internal-only question',answer:'Internal-only answer'}),'faqs',{canPublish:true});
 const saved=await backend.saveRecord('faqs',data,'owner');
 assert.ok((await backend.staffData()).faqs.find(x=>x.id===saved.id));
 assert.ok(!(await backend.publicData()).faqs.find(x=>x.id===saved.id));
});
test('institute form updates and can be verified after save',async()=>{
 const data=staffFormPayload(form({name:'Sample Academy Updated',city:'Demo City',published:'on'}),'institute',{canPublish:true});
 const saved=await backend.saveRecord('institute',data,'owner');
 assert.equal(saved.name,'Sample Academy Updated');
 assert.equal((await backend.publicData()).institute.name,'Sample Academy Updated');
});
test('enquiry status and notes can be saved without publishing private information',async()=>{
 const data=staffFormPayload(form({id:'DEMO-1001',status:'contacted',staff_notes:'Fictional staff follow-up',next_followup_at:''}),'enquiries',{canPublish:true});
 await backend.saveRecord('enquiries',data,'owner');
 const staff=await backend.staffData();assert.equal(staff.enquiries.find(x=>x.id==='DEMO-1001').status,'contacted');
 assert.equal((await backend.publicData()).enquiries.length,0);
});
test('browser storage write failure is surfaced rather than showing a success',async()=>{
 const original=globalThis.localStorage.setItem;
 globalThis.localStorage.setItem=()=>{throw Error('QuotaExceededError: storage blocked')};
 await assert.rejects(backend.saveRecord('courses',staffFormPayload(form(courseData),'courses',{canPublish:true}),'owner'),/storage blocked/);
 globalThis.localStorage.setItem=original;
});
test('staff form renders explicit publish and on-form feedback for errors',()=>{
 const ui=fs.readFileSync(new URL('../assets/staff.js',import.meta.url),'utf8');
 assert.ok(ui.includes('data-save-and-publish="true"'));
 assert.ok(ui.includes('data-form-feedback'));
 assert.ok(ui.includes('Save failed: '));
 assert.ok(ui.includes('The save was not confirmed in storage'));
 assert.ok(ui.includes('not in Firebase'));
});
test('no secrets or live data are enabled in the public pilot',()=>{
 const config=fs.readFileSync(new URL('../assets/config.js',import.meta.url),'utf8');
 assert.ok(config.includes('demoMode: true'));
 assert.ok(!config.includes('service_role'));
});