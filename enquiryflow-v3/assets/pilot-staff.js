/* Authenticated, read-only test inbox for synthetic pilot data. In-memory session. */
import {CONFIG} from './config.js';
const $=s=>document.querySelector(s);
const PROJECT='enquiryflow-v3-pilot';
const INSTITUTE='demo-tech-academy';
const TEST_EMAIL='pilot.student@example.com';
const SDK='12.6.0';
let f, busy=false, authorized=false;
function report(el,message,type=''){const node=$(el);node.textContent=message;node.className='status '+type}
function code(e){return String(e?.code||e?.message||'unknown error').slice(0,160)}
function setBusy(value){busy=value;$('#loginButton').disabled=value;$('#logoutButton').disabled=value||!f?.auth?.currentUser;$('#refreshButton').disabled=value||!authorized}
async function init(){
 if(CONFIG.firebase?.projectId!==PROJECT)throw Error('Unexpected Firebase project');
 const [appMod,authMod,dbMod]=await Promise.all([
  import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-app.js`),
  import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-auth.js`),
  import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-firestore.js`)
 ]);
 const app=appMod.initializeApp(CONFIG.firebase,'enquiryflow-isolated-staff-pilot');
 const auth=authMod.initializeAuth(app,{persistence:authMod.inMemoryPersistence});
 f={auth,db:dbMod.getFirestore(app),...authMod,...dbMod};return f;
}
async function login(e){
 e.preventDefault();if(busy)return;setBusy(true);
 const email=$('#ownerEmail').value.trim(),password=$('#ownerPassword').value;
 $('#ownerPassword').value='';$('#inbox').replaceChildren();
 try{
  const c=f||await init();await c.signInWithEmailAndPassword(c.auth,email,password);
  const uid=c.auth.currentUser.uid;
  const role=await c.getDoc(c.doc(c.db,'ef3_staff',uid));
  const d=role.exists()?role.data():{};
  if(d.active!==true || d.role!=='owner' || d.institute_id!==INSTITUTE){await c.signOut(c.auth);throw Error('Active owner role not found for this institute.');}
  authorized=true;$('#ownerEmail').value='';report('#loginStatus','PASS — Signed in as authorized Firebase owner (in-memory session only).','ok');
 }catch(error){authorized=false;report('#loginStatus',`FAIL — ${code(error)}`,'fail');report('#inboxStatus','Sign in as the institute owner to view the test inbox.','fail')}
 finally{setBusy(false)}
 if(authorized)await refresh();
}
async function refresh(){
 if(!authorized||busy)return;setBusy(true);$('#inbox').replaceChildren();report('#inboxStatus','Reading synthetic test records from protected Firestore…');
 try{
  const query=f.query(f.collection(f.db,'ef3_enquiries'),f.where('email','==',TEST_EMAIL),f.limit(50));
  const result=await f.getDocs(query);
  const records=result.docs.map(d=>({id:d.id,...d.data()})).filter(d=>d.full_name==='Test Pilot Student'&&d.institute_id===INSTITUTE)
    .sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
  report('#inboxStatus',`PASS — Authorized Firestore read succeeded. ${records.length} fictional test enquiry record(s) found.${records.length?' Compare the reference shown on the student page.':' Submit a test from the student page, then refresh here.'}`,'ok');
  for(const row of records){
   const li=document.createElement('li'),heading=document.createElement('strong'),details=document.createElement('small');
   heading.textContent=`Test Pilot Student · ${row.status||'new'}`;
   details.textContent=`Reference: ${row.id} · Submitted: ${String(row.created_at||'not recorded').slice(0,25)} · ${String(row.question||'').slice(0,150)}`;
   li.append(heading,details);$('#inbox').append(li);
  }
 }catch(error){report('#inboxStatus',`FAIL — Could not read private enquiry queue: ${code(error)}`,'fail')}
 finally{setBusy(false)}
}
async function logout(){if(busy)return;setBusy(true);try{if(f?.auth?.currentUser)await f.signOut(f.auth);authorized=false;$('#inbox').replaceChildren();report('#loginStatus','Signed out.');report('#inboxStatus','Sign in again to view test enquiries.');}catch(e){report('#loginStatus',`Sign-out failed: ${code(e)}`,'fail')}finally{setBusy(false)}}
$('#loginForm').addEventListener('submit',login);
$('#refreshButton').addEventListener('click',refresh);
$('#logoutButton').addEventListener('click',logout);