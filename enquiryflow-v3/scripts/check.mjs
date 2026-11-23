import fs from 'node:fs';
import path from 'node:path';
const base=process.cwd();
const js=['assets/config.js','assets/fixtures.js','assets/utils.js','assets/discovery.js','assets/staff-form.js','assets/firebase-platform.js','assets/platform.js','assets/student.js','assets/staff.js','assets/production-adapter.js','assets/production-student.js','assets/production-staff.js'];
const html=['index.html','staff/index.html','assets/production-privacy.html'];
const read=file=>fs.readFileSync(path.join(base,file),'utf8');
for(const file of [...js,...html,'firestore-production.rules']){
 if(!fs.existsSync(path.join(base,file)))throw Error('Missing '+file);
}
const sources=js.map(read).join('\n');
for(const illegal of [/sb_secret_[a-zA-Z0-9]{15,}/,/service[_-]?role\s*[:=]\s*['"][^'"]{20,}/i]){
 if(illegal.test(sources))throw Error('Potential secret in browser scripts');
}
const rules=read('firestore-production.rules');
for(const collection of ['ef3_staff','ef3_institutes','ef3_courses','ef3_batches','ef3_faqs','ef3_real_enquiries','ef3_real_intake_limits','ef3_import_jobs']){
 if(!rules.includes('match /'+collection+'/{'))throw Error('Missing Firestore security rules: '+collection);
}
if(!rules.includes('match /{document=**} { allow read, write: if false; }'))
 throw Error('Missing Firestore default-deny rule');
if(!rules.includes('allow delete: if manager();'))
 throw Error('Missing manager-scoped deletion rule');
if(!rules.includes('function mayCreateRealEnquiry(id)')||!rules.includes('getAfter('))
 throw Error('Real student enquiry intake guardrails missing');
for(const file of html.slice(0,2)){
 const htmlSource=read(file);
 if(!htmlSource.includes('assets/')||!/(Ctech Academy|EnquiryFlow)/.test(htmlSource))
  throw Error('Invalid EnquiryFlow HTML entrypoint: '+file);
}
console.log('Static integrity: '+js.length+' scripts, '+html.length+' HTML routes, Firebase rules and default deny verified; no client secrets.');
