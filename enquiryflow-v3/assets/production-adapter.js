/* EnquiryFlow real-data staging: verified Google identity, Firestore atomic rate limit, staff-only reads. */
import {CONFIG} from './config.js';
import * as demo from './platform.js?v=3.6';
import {validateEnquiry,searchKnowledge,uniqueId} from './utils.js?v=3.4';
// Production staging; existing fictional pilot pages are preserved.
export const isDemo = false;
let initialized;
async function firebase(){
 if(CONFIG.firebase?.projectId!=='enquiryflow-v3-pilot') throw Error('Unexpected Firebase project.');
 if(initialized) return initialized;
 initialized=(async()=>{
  const v='12.6.0';
  const [{initializeApp},{getAuth,initializeAuth,inMemoryPersistence,browserPopupRedirectResolver,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,signOut:onSignOut,onAuthStateChanged},{getFirestore,collection,doc,getDoc,getDocFromServer,getDocs,query,where,orderBy,limit,setDoc,updateDoc,addDoc,writeBatch,runTransaction,serverTimestamp,deleteDoc}]=await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`)
  ]);
  const studentPage=location.pathname.endsWith('/production-student.html') || /^\/enquiryflow-v3\/(?:index\.html)?$/.test(location.pathname);
  const app=initializeApp(CONFIG.firebase,studentPage?'enquiryflow-v3-real-student':'enquiryflow-v3-real-staff');
  // Student auth is tab-local; it never replaces the owner's persisted staff login.
  const auth=studentPage?initializeAuth(app,{persistence:inMemoryPersistence,popupRedirectResolver:browserPopupRedirectResolver}):getAuth(app);
  const db=getFirestore(app);
  await new Promise(resolve=>{const off=onAuthStateChanged(auth,()=>{off();resolve()},()=>{off();resolve()})});
  return {auth,db,collection,doc,getDoc,getDocFromServer,getDocs,query,where,orderBy,limit,setDoc,updateDoc,addDoc,writeBatch,runTransaction,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,onSignOut,serverTimestamp,deleteDoc};
 })();
 try{return await initialized}catch(e){initialized=null;throw e}
}
const rows=snapshot=>snapshot.docs.map(d=>{const data=d.data();if(data.created_at&&typeof data.created_at.toDate==='function')data.created_at=data.created_at.toDate().toISOString();return {...data,id:d.id}});
const institutionId=()=>CONFIG.instituteSlug||'demo-tech-academy';
async function verifiedRole(){
 const f=await firebase(),user=f.auth.currentUser;
 if(!user)throw Error('Staff sign-in required');
 const r=await f.getDoc(f.doc(f.db,'ef3_staff',user.uid));
 if(!r.exists() || r.data().active!==true || !['owner','admin','editor','counselor'].includes(r.data().role))throw Error('This account is not approved for staff access. Contact the institution owner.');
 return r.data().role;
}
export async function session(){
 if(isDemo)return demo.session();
 const f=await firebase();return f.auth.currentUser?{user:{id:f.auth.currentUser.uid,email:f.auth.currentUser.email}}:null;
}
export async function signIn(email,password){
 if(isDemo)return demo.signIn(email,password);
 const f=await firebase();
 await f.signInWithEmailAndPassword(f.auth,String(email).trim(),password);
 try{await verifiedRole()}catch(e){await f.onSignOut(f.auth);throw e}
 return session();
}
export async function signOut(){if(isDemo)return demo.signOut();const f=await firebase();await f.onSignOut(f.auth)}
export async function publicData(){
 if(isDemo)return demo.publicData();
 const f=await firebase(),ins=await f.getDoc(f.doc(f.db,'ef3_institutes',institutionId()));
 if(!ins.exists()||ins.data().published!==true)throw Error('The institute has not published its profile.');
 const [co,ba,fa]=await Promise.all([
  f.getDocs(f.query(f.collection(f.db,'ef3_courses'),f.where('published','==',true),f.limit(100))),
  f.getDocs(f.query(f.collection(f.db,'ef3_batches'),f.where('published','==',true),f.limit(200))),
  f.getDocs(f.query(f.collection(f.db,'ef3_faqs'),f.where('published','==',true),f.limit(200)))
 ]);
 // Draft proposal descriptions must never be shown as confirmed offerings.
 const courses=rows(co).filter(c=>c.verified_at&&c.institute_id===institutionId()
  && !/^a proposed\b/i.test(String(c.description||'').trim()));
 const ids=new Set(courses.map(c=>c.id));
 const batches=rows(ba).filter(b=>b.institute_id===institutionId()&&ids.has(b.course_id));
 // Published batch records can fill missing delivery mode metadata.
 const enrichedCourses=courses.map(c=>({...c,delivery_modes:[...new Set([
  ...(Array.isArray(c.delivery_modes)?c.delivery_modes:[]),
  ...batches.filter(b=>b.course_id===c.id&&['Online','Classroom'].includes(b.mode)).map(b=>b.mode)
 ])]}));
 return {institute:{...ins.data(),id:ins.id},courses:enrichedCourses,batches,faqs:rows(fa).filter(k=>k.institute_id===institutionId()&&(!k.course_id||ids.has(k.course_id))),enquiries:[],imports:[]};
}
export async function staffData(){
 if(isDemo)return demo.staffData();
 const role=await verifiedRole(),f=await firebase();
 const [ins,co,ba,fa,en,im]=await Promise.all([
  f.getDoc(f.doc(f.db,'ef3_institutes',institutionId())),
  f.getDocs(f.query(f.collection(f.db,'ef3_courses'),f.limit(300))),
  f.getDocs(f.query(f.collection(f.db,'ef3_batches'),f.limit(300))),
  f.getDocs(f.query(f.collection(f.db,'ef3_faqs'),f.limit(300))),
  f.getDocs(f.query(f.collection(f.db,'ef3_real_enquiries'),f.limit(80))),
  f.getDocs(f.query(f.collection(f.db,'ef3_import_jobs'),f.limit(100)))
 ]);
 if(!ins.exists())throw Error('Institute record missing. An administrator must initialize the institute.');
 const own=list=>rows(list).filter(r=>r.institute_id===institutionId());
 return {institute:{...ins.data(),id:ins.id},courses:own(co),batches:own(ba),faqs:own(fa),enquiries:own(en).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))),imports:own(im),role};
}
export async function saveRecord(type,record,claimedRole){
 if(isDemo)return demo.saveRecord(type,record,claimedRole);
 const role=await verifiedRole();
 if(!['institute','courses','batches','faqs','enquiries'].includes(type))throw Error('Unknown entity');
 if(type==='institute'&&!['owner','admin'].includes(role))throw Error('Only admins can change the institute');
 if(type==='enquiries'&&!['owner','admin','editor','counselor'].includes(role))throw Error('Not permitted');
 if(['courses','batches','faqs'].includes(type) && (!['owner','admin','editor'].includes(role)|| (record.published&& !['owner','admin'].includes(role))))throw Error('Publishing requires owner/admin');
 const f=await firebase(),id=type==='institute'?institutionId():(record.id||uniqueId());
 const patch={...record,institute_id:institutionId()};delete patch.id;
 if(type==='enquiries'){
  const keys=['status','next_followup_at','staff_notes','assigned_to'];const allowed={};for(const k of keys)if(k in patch)allowed[k]=patch[k];
  if(record.id) await f.updateDoc(f.doc(f.db,'ef3_real_enquiries',id),allowed);
  else throw Error('Enquiries must originate through the student intake');
 } else {
  await f.setDoc(f.doc(f.db,`ef3_${type==='institute'?'institutes':type}`,id),patch,{merge:true});
 }
 return {...record,id};
}
/**
 * Owner-authorized catalogue import. Safe to retry: deterministic Firestore
 * IDs and transactions ensure existing records are never overwritten.
 * Every installed course and FAQ is a private unpublished draft.
 */
export async function installCtechCatalogueDrafts(courseRows=[],faqRows=[]){
 if(isDemo)throw Error('Real catalogue import cannot run in demo mode.');
 if((await verifiedRole())!=='owner')throw Error('Only the verified institute owner can install catalogue drafts.');
 if(!Array.isArray(courseRows)||courseRows.length>25||!Array.isArray(faqRows)||faqRows.length>20)
  throw Error('Invalid catalogue size.');
 const f=await firebase(),counts={courses:0,faqs:0,existing:0};
 const makeSlug=text=>String(text||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,160);
 for(const [type,rows] of [['courses',courseRows],['faqs',faqRows]]){
  for(const item of rows){
   if(!item||typeof item!=='object')throw Error('Invalid catalogue draft');
   const slug=makeSlug(type==='courses'?(item.slug||item.title):item.question);
   if(!slug)throw Error('Draft is missing an identifier');
   const id='ctech-proposal-'+slug;
   const ref=f.doc(f.db,'ef3_'+type,id);
   const record={...item,institute_id:institutionId(),published:false};
   delete record.id;
   if(type==='courses'){
    record.fee_inr=null;record.duration_weeks=null;record.delivery_modes=[];record.verified_at=null;
   }else record.reviewed_at=null;
   const created=await f.runTransaction(f.db,async transaction=>{
    const existing=await transaction.get(ref);
    if(existing.exists())return false;
    transaction.set(ref,record);
    return true;
   });
   if(created)counts[type]++;else counts.existing++;
  }
 }
 return counts;
}

export async function olderEnquiries(offset=80,count=80){if(isDemo)return demo.olderEnquiries(offset,count);const r=await staffData();return r.enquiries.slice(offset,offset+count)}
export const PRIVACY_VERSION='ef3-privacy-2026-11-22';
export const CONTACT_POLICY_URL='./production-privacy.html';
export function isProductionReady(institute){
 return !!(institute?.published===true && institute?.production_ready===true &&
  typeof institute.name==='string' && institute.name.trim()!=='' && institute.name!=='Demo Tech Academy' &&
  typeof institute.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(institute.email) &&
  !/@example\.(com|org|net)$/i.test(institute.email));
}
export async function readProductionReadiness(){
 const f=await firebase();
 const latest=await f.getDocFromServer(f.doc(f.db,'ef3_institutes',institutionId()));
 return latest.exists()&&isProductionReady(latest.data());
}
export async function studentIdentity(){
 const f=await firebase(),u=f.auth.currentUser;
 return u?{email:u.email,verified:!!u.emailVerified,google:u.providerData.some(p=>p.providerId==='google.com')}:null;
}
export async function signInStudentGoogle(){
 const f=await firebase(),result=await f.signInWithPopup(f.auth,new f.GoogleAuthProvider());
 if(!result.user.emailVerified || result.user.providerData.every(p=>p.providerId!=='google.com'))throw Error('A verified Google account is required.');
 return {email:result.user.email,verified:true};
}
export async function signOutStudent(){const f=await firebase();await f.onSignOut(f.auth)}
/** Delete only institute-owned managed catalogue records; preserve referential integrity. */
export async function deleteManagedRecord(type,id){
 if(!['courses','batches','faqs'].includes(type)||!id)throw Error('Invalid delete request.');
 if(isDemo)throw Error('Catalogue deletion requires the authenticated workspace.');
 if(!['owner','admin'].includes(await verifiedRole()))throw Error('Only owner/admin may delete catalogue records.');
 const f=await firebase(),ref=f.doc(f.db,'ef3_'+type,id);
 const current=await f.getDoc(ref);
 if(!current.exists()||current.data().institute_id!==institutionId())throw Error('The record is unavailable for this institute.');
 if(type==='courses'){
  const linked=await f.getDocs(f.query(f.collection(f.db,'ef3_batches'),f.where('course_id','==',id),f.limit(1)));
  if(!linked.empty)throw Error('Delete related batches before deleting this course.');
 }
 await f.deleteDoc(ref);
}

export async function deleteRealEnquiry(id){
 const role=await verifiedRole();if(!['owner','admin'].includes(role))throw Error('Only owner/admin can delete enquiries.');
 const f=await firebase();await f.deleteDoc(f.doc(f.db,'ef3_real_enquiries',id));
}
export async function submitEnquiry(payload){
 if(isDemo)return demo.submitEnquiry(payload);
 const errors=validateEnquiry(payload);if(errors.length)throw Error(errors.join(' '));
 const f=await firebase(),user=f.auth.currentUser;
 if(!user || !user.emailVerified || user.providerData.every(x=>x.providerId!=='google.com'))throw Error('Verify your Google account before submitting.');
 if(String(payload.email).trim()!==user.email)throw Error('The enquiry email must match your verified Google account.');
 const institute=await f.getDoc(f.doc(f.db,'ef3_institutes',institutionId()));
 if(!isProductionReady(institute.data()))throw Error('Admissions are not open yet. The institute owner must approve the real-data policy and publish a genuine contact email.');
 // Firestore rules independently enforce this approval and a 15-minute per-account limit.
 const ref=f.doc(f.collection(f.db,'ef3_real_enquiries'));
 const batch=f.writeBatch(f.db);
 const body={auth_uid:user.uid,full_name:String(payload.full_name).trim(),email:user.email,
  course_id:payload.course_id||null,batch_id:payload.batch_id||null,
  question:String(payload.question||'').trim(),consent:true,consent_version:PRIVACY_VERSION,
  created_at:f.serverTimestamp(),status:'new',institute_id:institutionId(),next_followup_at:null,staff_notes:''};
 batch.set(ref,body);
 batch.set(f.doc(f.db,'ef3_real_intake_limits',user.uid),{enquiry_id:ref.id,last_created_at:f.serverTimestamp()});
 try{await batch.commit()}catch(error){
  if(error?.code==='permission-denied')throw Error('Submission blocked by Firebase. Check that production rules are published, the institute is approved, and 15 minutes have elapsed since your last enquiry.');
  throw error;
 }
 return {id:ref.id,demo:false};
}
export async function askAssistant(question,records,context={}){if(isDemo)return demo.askAssistant(question,records,context);return {...searchKnowledge(question,records,context),mode:'verified-knowledge-only',note:'No generative model connected. Responses use published institute records.'}}
export async function queueImport(rows,sourceUrl,claimedRole){
 if(isDemo)return demo.queueImport(rows,sourceUrl,claimedRole);
 const role=await verifiedRole();if(!['owner','admin','editor'].includes(role))throw Error('Import requires editor access');
 if(!Array.isArray(rows)||!rows.length||rows.length>100)throw Error('Import must contain 1-100 courses');
 const f=await firebase();await f.addDoc(f.collection(f.db,'ef3_import_jobs'),{institute_id:institutionId(),source_url:sourceUrl||'',status:'pending',payload:rows,created_at:new Date().toISOString()});
}
export async function approveImport(job,claimedRole){
 if(isDemo)return demo.approveImport(job,claimedRole);
 const role=await verifiedRole();if(!['owner','admin'].includes(role))throw Error('Only an owner or admin can approve imports');
 if(job.status!=='pending'||!Array.isArray(job.payload)||job.payload.length>100)throw Error('Invalid pending import');
 const f=await firebase(),batch=f.writeBatch(f.db);
 for(const row of job.payload){const id=uniqueId();batch.set(f.doc(f.db,'ef3_courses',id),{...Object.fromEntries(Object.entries(row).filter(([k])=>k!=='id')),institute_id:institutionId(),published:false,verified_at:null})}
 batch.update(f.doc(f.db,'ef3_import_jobs',job.id),{status:'approved',reviewed_at:new Date().toISOString()});await batch.commit();
}
export function resetDemo(){return demo.resetDemo()}