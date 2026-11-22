/* EnquiryFlow v3: Firebase Spark adapter. Public data can be read anonymously; staff data
   requires verified Firebase Auth and an administrator-provisioned ef3_staff role document.
   Until production anti-abuse is added, enquiry writes accept ONLY fictitious test records. */
import {CONFIG} from './config.js';
import * as demo from './platform.js?v=3.6';
import {validateEnquiry,searchKnowledge,uniqueId} from './utils.js?v=3.4';
// Isolated fictional Firebase pilot. The normal v3 pages still use the local demo.
export const isDemo = false;
let initialized;
async function firebase(){
 if(CONFIG.firebase?.projectId!=='enquiryflow-v3-pilot') throw Error('Unexpected Firebase project.');
 if(initialized) return initialized;
 initialized=(async()=>{
  const v='12.6.0';
  const [{initializeApp},{getAuth,signInWithEmailAndPassword,signOut:onSignOut,onAuthStateChanged},{getFirestore,collection,doc,getDoc,getDocs,query,where,orderBy,limit,setDoc,updateDoc,addDoc,writeBatch}]=await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`)
  ]);
  const app=initializeApp(CONFIG.firebase,'enquiryflow-v3');
  const auth=getAuth(app),db=getFirestore(app);
  await new Promise(resolve=>{const off=onAuthStateChanged(auth,()=>{off();resolve()},()=>{off();resolve()})});
  return {auth,db,collection,doc,getDoc,getDocs,query,where,orderBy,limit,setDoc,updateDoc,addDoc,writeBatch,signInWithEmailAndPassword,onSignOut};
 })();
 try{return await initialized}catch(e){initialized=null;throw e}
}
const rows=snapshot=>snapshot.docs.map(d=>({...d.data(),id:d.id}));
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
 const courses=rows(co).filter(c=>c.verified_at&&c.institute_id===institutionId());
 const ids=new Set(courses.map(c=>c.id));
 return {institute:{...ins.data(),id:ins.id},courses,batches:rows(ba).filter(b=>b.institute_id===institutionId()&&ids.has(b.course_id)),faqs:rows(fa).filter(k=>k.institute_id===institutionId()&&(!k.course_id||ids.has(k.course_id))),enquiries:[],imports:[]};
}
export async function staffData(){
 if(isDemo)return demo.staffData();
 const role=await verifiedRole(),f=await firebase();
 const [ins,co,ba,fa,en,im]=await Promise.all([
  f.getDoc(f.doc(f.db,'ef3_institutes',institutionId())),
  f.getDocs(f.query(f.collection(f.db,'ef3_courses'),f.limit(300))),
  f.getDocs(f.query(f.collection(f.db,'ef3_batches'),f.limit(300))),
  f.getDocs(f.query(f.collection(f.db,'ef3_faqs'),f.limit(300))),
  f.getDocs(f.query(f.collection(f.db,'ef3_enquiries'),f.limit(80))),
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
  if(record.id) await f.updateDoc(f.doc(f.db,'ef3_enquiries',id),allowed);
  else throw Error('Enquiries must originate through the student intake');
 } else {
  await f.setDoc(f.doc(f.db,`ef3_${type==='institute'?'institutes':type}`,id),patch,{merge:true});
 }
 return {...record,id};
}
export async function olderEnquiries(offset=80,count=80){if(isDemo)return demo.olderEnquiries(offset,count);const r=await staffData();return r.enquiries.slice(offset,offset+count)}
export async function submitEnquiry(payload){
 if(isDemo)return demo.submitEnquiry(payload);
 const errors=validateEnquiry(payload,{demo:true});if(errors.length)throw Error('Pilot test-only: '+errors.join(' '));
 const f=await firebase();const body={full_name:String(payload.full_name).trim(),email:String(payload.email).trim(),course_id:payload.course_id||null,batch_id:payload.batch_id||null,question:payload.question||'',consent:true,created_at:new Date().toISOString(),status:'new',institute_id:institutionId(),next_followup_at:null,staff_notes:''};
 const ref=await f.addDoc(f.collection(f.db,'ef3_enquiries'),body);return {id:ref.id,demo:false};
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