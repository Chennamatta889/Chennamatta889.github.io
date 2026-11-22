import {CONFIG} from './config.js';
import {sample} from './fixtures.js';
import {uniqueId,validateEnquiry} from './utils.js';
const BASE='enquiryflow_v3_demo_state';
const SESSION='enquiryflow_v3_auth_session';
const clone=x=>structuredClone(x);
export const isDemo=CONFIG.demoMode || !CONFIG.supabaseUrl || !CONFIG.supabasePublishableKey;
const origin=()=>CONFIG.supabaseUrl.replace(/\/$/,'');
function getStore(){try{const raw=localStorage.getItem(BASE);return raw?JSON.parse(raw):clone(sample);}catch{return clone(sample)}}
function putStore(data){localStorage.setItem(BASE,JSON.stringify(data));globalThis.dispatchEvent(new CustomEvent('enquiryflow:change'));}
function headers(accessToken){const h={'apikey':CONFIG.supabasePublishableKey,'Content-Type':'application/json'};if(accessToken)h.Authorization=`Bearer ${accessToken}`;return h;}
function authState(){try{return JSON.parse(sessionStorage.getItem(SESSION)||'null')}catch{return null}}
function saveAuth(state){if(state)sessionStorage.setItem(SESSION,JSON.stringify(state));else sessionStorage.removeItem(SESSION)}
export async function session(){
 if(isDemo)return {user:{id:'demo-owner',email:'owner@demo.example.com'},role:'owner',demo:true};
 const s=authState();if(!s)return null;
 if(Date.now()/1000 < (s.expires_at||0)-90)return s;
 try{const r=await fetch(`${origin()}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:headers(),body:JSON.stringify({refresh_token:s.refresh_token})});if(!r.ok)throw Error('Session expired');const j=await r.json();const next={access_token:j.access_token,refresh_token:j.refresh_token,user:j.user,expires_at:Math.floor(Date.now()/1000)+j.expires_in};saveAuth(next);return next;}catch{saveAuth(null);return null}
}
export async function signIn(email,password){if(isDemo)throw Error('Demo sign-in is not required.');const r=await fetch(`${origin()}/auth/v1/token?grant_type=password`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})});const j=await r.json();if(!r.ok)throw Error(j.msg||j.error_description||'Unable to sign in');const s={access_token:j.access_token,refresh_token:j.refresh_token,user:j.user,expires_at:Math.floor(Date.now()/1000)+j.expires_in};saveAuth(s);return s}
export async function signOut(){if(!isDemo){const s=await session();if(s)await fetch(`${origin()}/auth/v1/logout`,{method:'POST',headers:headers(s.access_token)}).catch(()=>{});saveAuth(null)}}
async function query(table,{filter='',method='GET',data,auth=false,limit=300,prefer}={}){
 const token=auth?(await session())?.access_token:null;if(auth&&!token)throw Error('Staff sign-in required');
 const url=`${origin()}/rest/v1/${table}?${filter||`select=*&limit=${limit}`}`;
 const h=headers(token);if(prefer)h.Prefer=prefer;
 const r=await fetch(url,{method,headers:h,body:data===undefined?undefined:JSON.stringify(data)});
 if(!r.ok){let reason;try{reason=(await r.json()).message}catch{reason=await r.text()}throw Error(reason||`Database request failed (${r.status})`)}
 const text=await r.text();return text?JSON.parse(text):null;
}
function cleanPublic(data){if(!data.institute.published)throw Error('Institute profile is not published');const publicCourses=data.courses.filter(c=>c.published&&c.verified_at);return {...data,courses:publicCourses,batches:data.batches.filter(b=>b.published&&publicCourses.some(c=>c.id===b.course_id)),faqs:data.faqs.filter(f=>f.published&&(!f.course_id||publicCourses.some(c=>c.id===f.course_id))),enquiries:[],imports:[]}}
export async function publicData(){
 if(isDemo)return cleanPublic(getStore());
 const ins=await query('ef3_institutes',{filter:`select=*&slug=eq.${encodeURIComponent(CONFIG.instituteSlug)}&published=eq.true&limit=1`});if(!ins?.length)throw Error('No published institute profile is available');
 const id=ins[0].id;
 const [courses,batches,faqs]=await Promise.all([
 query('ef3_courses',{filter:`select=*&institute_id=eq.${id}&published=eq.true&verified_at=not.is.null&order=title.asc&limit=100`}),
 query('ef3_batches',{filter:`select=*&institute_id=eq.${id}&published=eq.true&order=start_date.asc&limit=200`}),
 query('ef3_faqs',{filter:`select=*&institute_id=eq.${id}&published=eq.true&order=created_at.desc&limit=200`})
 ]);
 return cleanPublic({institute:ins[0],courses,batches,faqs,enquiries:[],imports:[]});
}
export async function staffData(){
 if(isDemo)return {...getStore(),role:'owner'};
 const s=await session();if(!s?.user?.id)throw Error('Sign in to access staff records');
 const p=await query('ef3_staff',{filter:`select=user_id,role,active,institute_id&user_id=eq.${s.user.id}&limit=1`,auth:true});
 if(!p?.[0]?.active)throw Error('Your account is not authorized for this institution. Contact the owner.');
 const id=p[0].institute_id;
 const [inst,courses,batches,faqs,enquiries,imports]=await Promise.all([
 query('ef3_institutes',{filter:`select=*&id=eq.${id}`,auth:true}),
 query('ef3_courses',{filter:`select=*&institute_id=eq.${id}&order=updated_at.desc&limit=300`,auth:true}),
 query('ef3_batches',{filter:`select=*&institute_id=eq.${id}&order=start_date.asc&limit=300`,auth:true}),
 query('ef3_faqs',{filter:`select=*&institute_id=eq.${id}&order=created_at.desc&limit=300`,auth:true}),
 query('ef3_enquiries',{filter:`select=*&institute_id=eq.${id}&order=created_at.desc&limit=80`,auth:true}),
 query('ef3_import_jobs',{filter:`select=*&institute_id=eq.${id}&order=created_at.desc&limit=100`,auth:true})
 ]);
 return {institute:inst[0],courses,batches,faqs,enquiries,imports,role:p[0].role};
}
function allowedToEdit(role,table,published){if(table==='enquiries')return ['owner','admin','editor','counselor'].includes(role);if(table==='institute')return ['owner','admin'].includes(role);return published?['owner','admin'].includes(role):['owner','admin','editor'].includes(role)}
export async function saveRecord(table,record,role='owner'){
 if(!['institute','courses','batches','faqs','enquiries'].includes(table))throw Error('Unsupported record type');
 if(!allowedToEdit(role,table,Boolean(record.published)))throw Error('Your role cannot save this record');
 if(isDemo){const data=getStore();if(table==='institute')data.institute={...data.institute,...record,updated_at:new Date().toISOString()};else{const current=data[table];const id=record.id||uniqueId();const index=current.findIndex(x=>x.id===id);const row={...(index>=0?current[index]:{}),...record,id};if(index>=0)current[index]=row;else current.unshift(row)}putStore(data);return record}
 const map={institute:'ef3_institutes',courses:'ef3_courses',batches:'ef3_batches',faqs:'ef3_faqs',enquiries:'ef3_enquiries'};
 const s=await staffData();const id=s.institute.id;
 const row={...record};if(table!=='institute')row.institute_id=id;
 if(table==='enquiries'){const allowed={status:row.status,next_followup_at:row.next_followup_at??null,staff_notes:row.staff_notes??'',assigned_to:row.assigned_to??null};return query(map[table],{filter:`id=eq.${row.id}`,method:'PATCH',auth:true,data:allowed,prefer:'return=representation'});}
 if(table==='institute')return query(map[table],{filter:`id=eq.${id}`,method:'PATCH',auth:true,data:row,prefer:'return=representation'});
 if(!row.id)delete row.id;
 return query(map[table],{filter:'on_conflict=id',method:'POST',auth:true,data:row,prefer:'resolution=merge-duplicates,return=representation'});
}

export async function olderEnquiries(offset=80,limit=80){
 if(isDemo)return getStore().enquiries.slice(offset,offset+limit);
 const s=await session();if(!s?.user?.id)throw Error('Staff sign-in required');
 const p=await query('ef3_staff',{filter:`select=institute_id,active&user_id=eq.${s.user.id}&limit=1`,auth:true});
 if(!p?.[0]?.active)throw Error('Not an authorized staff member');
 const id=p[0].institute_id;
 return query('ef3_enquiries',{filter:`select=*&institute_id=eq.${id}&order=created_at.desc&offset=${Number(offset)}&limit=${Math.min(80,Number(limit))}`,auth:true});
}

export async function submitEnquiry(payload){
 const errors=validateEnquiry(payload,{demo:isDemo});if(errors.length)throw Error(errors.join(' '));
 if(isDemo){const data=getStore();const row={id:'DEMO-'+Math.random().toString(36).slice(2,9).toUpperCase(),full_name:payload.full_name,email:payload.email,course_id:payload.course_id||null,batch_id:payload.batch_id||null,question:payload.question||'',status:'new',created_at:new Date().toISOString(),consent_at:new Date().toISOString(),staff_notes:'',next_followup_at:null};data.enquiries.unshift(row);putStore(data);return {id:row.id,demo:true}}
 const r=await fetch(`${origin()}/functions/v1/submit-enquiry`,{method:'POST',headers:headers(),body:JSON.stringify({...payload,institute_slug:CONFIG.instituteSlug})});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Unable to submit enquiry');return j;
}
export async function askAssistant(question,records,context={}){
 const {searchKnowledge}=await import('./utils.js?v=3.4');
 if(isDemo)return {...searchKnowledge(question,records,context),mode:'approved-faq-simulator'};
 try{const r=await fetch(`${origin()}/functions/v1/ai-assistant`,{method:'POST',headers:headers(),body:JSON.stringify({question,institute_slug:CONFIG.instituteSlug})});if(!r.ok)throw Error(`Assistant service unavailable (${r.status})`);return await r.json()}catch{return {...searchKnowledge(question,records,context),mode:'approved-knowledge-fallback',note:'AI service unavailable: answer generated from approved records only.'}}
}
export async function queueImport(rows,sourceUrl,role='owner'){
 if(!allowedToEdit(role,'courses',false))throw Error('Your role cannot import content');
 if(!Array.isArray(rows)||rows.length===0||rows.length>100)throw Error('Import must include 1–100 courses');
 if(isDemo){const data=getStore();data.imports.unshift({id:uniqueId(),source_url:sourceUrl||'',status:'pending',payload:rows,created_at:new Date().toISOString()});putStore(data);return}
 const s=await staffData();await query('ef3_import_jobs',{method:'POST',auth:true,data:{institute_id:s.institute.id,source_url:sourceUrl||null,status:'pending',payload:rows},prefer:'return=representation'});
}
export async function approveImport(job,role='owner'){
 if(!['owner','admin'].includes(role))throw Error('Only an owner or admin can approve imports');
 if(job.status!=='pending')throw Error('Only pending imports can be approved');
 const rows=job.payload.map(c=>{const record={...c,published:false,verified_at:null,source_url:c.source_url||job.source_url||null};delete record.id;return record});
 if(isDemo){for(const row of rows)await saveRecord('courses',row,role)}
 else{const s=await staffData();await query('ef3_courses',{filter:'on_conflict=id',method:'POST',auth:true,data:rows.map(x=>({...x,institute_id:s.institute.id})),prefer:'resolution=merge-duplicates,return=minimal'});}
 if(isDemo){const data=getStore();const found=data.imports.find(x=>x.id===job.id);if(found)found.status='approved';putStore(data)}
 else await query('ef3_import_jobs',{filter:`id=eq.${job.id}`,method:'PATCH',auth:true,data:{status:'approved',reviewed_at:new Date().toISOString()},prefer:'return=representation'});
}
export function resetDemo(){if(!isDemo)throw Error('Reset available only in demo mode');localStorage.removeItem(BASE);globalThis.dispatchEvent(new CustomEvent('enquiryflow:change'))}