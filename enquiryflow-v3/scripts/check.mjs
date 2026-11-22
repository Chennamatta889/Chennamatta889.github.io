import fs from 'node:fs';import path from 'node:path';
const base=process.cwd();const js=['assets/config.js','assets/fixtures.js','assets/utils.js','assets/discovery.js','assets/staff-form.js','assets/firebase-platform.js','assets/platform.js','assets/student.js','assets/staff.js'];
const html=['index.html','staff/index.html'];let count=0;
for(const file of [...js,...html]){if(!fs.existsSync(path.join(base,file)))throw Error('Missing '+file);count++;}
const contents=js.map(p=>fs.readFileSync(path.join(base,p),'utf8')).join('\n');
for(const illegal of [/sb_secret_[a-zA-Z0-9]{15,}/,/service[_-]?role\s*[:=]\s*['\"][^'\"]{20,}/i])if(illegal.test(contents))throw Error('Potential secret in client scripts');
const sql=fs.readFileSync(path.join(base,'supabase/migrations/20261122173000_enquiryflow_v3.sql'),'utf8');
for(const t of ['institutes','staff','courses','batches','faqs','enquiries','import_jobs','ingress_events']){
 if(!sql.includes(`alter table public.ef3_${t} enable row level security`))throw Error('Missing RLS: '+t);
}
if(/grant\s+insert[^;]*ef3_enquiries\s+to\s+(anon|authenticated)/i.test(sql))throw Error('Dangerous public enquiry write');
if(/grant\s+select[^;]*ef3_enquiries\s+to\s+anon/i.test(sql))throw Error('Dangerous public enquiry read');
for(const f of html){const s=fs.readFileSync(path.join(base,f),'utf8');if(!s.includes('assets/')||!s.includes('EnquiryFlow'))throw Error('Invalid html entrypoint: '+f)}
console.log(`Static integrity: ${count} entrypoint/source files checked; 8/8 tables RLS enabled; no secrets present.`);