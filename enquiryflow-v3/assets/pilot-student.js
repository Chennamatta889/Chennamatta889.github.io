/* Isolated, fictional-data-only Firestore write probe. No real contact form. */
import {CONFIG} from './config.js';
const $=s=>document.querySelector(s);
const PROJECT='enquiryflow-v3-pilot';
const INSTITUTE='demo-tech-academy';
const SDK='12.6.0';
const TEST_EMAIL='pilot.student@example.com';
let firebaseInstance, ready=false, sending=false, sent=false;
function report(el,message,type=''){const node=$(el);node.textContent=message;node.className='status '+type}
function code(e){return String(e?.code||e?.message||'unknown error').slice(0,160)}
async function init(){
 try{
  if(CONFIG.firebase?.projectId!==PROJECT)throw Error('Unexpected Firebase project. No write attempted.');
  const [appMod,dbMod]=await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-firestore.js`)
  ]);
  const app=appMod.initializeApp(CONFIG.firebase,'enquiryflow-isolated-student-write-pilot');
  const db=dbMod.getFirestore(app);
  const inst=await dbMod.getDoc(dbMod.doc(db,'ef3_institutes',INSTITUTE));
  if(!inst.exists()||inst.data().published!==true)throw Error('Published fictional institute document was not found.');
  const name=String(inst.data().name||'Demo Tech Academy').slice(0,100);
  report('#instituteStatus',`PASS — ${name} is readable from Firestore.`,'ok');
  try{
   const docs=await dbMod.getDocs(dbMod.query(dbMod.collection(db,'ef3_courses'),dbMod.where('published','==',true),dbMod.limit(100)));
   $('#courseStatus').textContent=`Published course records currently in Firestore: ${docs.size}. Course management will be tested separately.`;
  }catch(e){$('#courseStatus').textContent=`Course lookup not verified: ${code(e)}. The enquiry test can still proceed.`}
  firebaseInstance={db,...dbMod};ready=true;$('#sendTest').disabled=false;
  report('#sendStatus','Ready to submit one fixed fictional enquiry.','ok');
 }catch(e){report('#instituteStatus',`FAIL — ${code(e)}`,'fail');report('#sendStatus','No enquiry will be submitted while institute access is failing.','fail')}
}
async function send(){
 if(!ready||sending||sent)return;
 sending=true;$('#sendTest').disabled=true;report('#sendStatus','Saving synthetic enquiry in Firestore…');
 try{
  const f=firebaseInstance;
  const payload={
    full_name:'Test Pilot Student', email:TEST_EMAIL, course_id:null, batch_id:null,
    question:'Please confirm a fictional weekend demo class.', consent:true,
    created_at:new Date().toISOString(), status:'new', institute_id:INSTITUTE,
    next_followup_at:null, staff_notes:''
  };
  const ref=await f.addDoc(f.collection(f.db,'ef3_enquiries'),payload);
  sent=true;
  report('#sendStatus','PASS — Firebase confirmed this fictional record was saved. No email was sent.','ok');
  $('#reference').hidden=false;$('#reference').textContent=`Firestore test reference: ${ref.id}. Open the staff test inbox on another device to verify delivery.`;
  $('#sendTest').textContent='One test enquiry saved';
 }catch(e){report('#sendStatus',`FAIL — Firestore did not confirm the write: ${code(e)}. Do not assume this enquiry arrived.`,'fail');$('#sendTest').disabled=false}
 finally{sending=false}
}
$('#sendTest').addEventListener('click',send);
init();