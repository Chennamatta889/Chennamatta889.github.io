// Read-only, no-analytics Firebase pilot diagnostic. No user data is persisted by this page.
import {CONFIG} from './config.js';
const $=selector=>document.querySelector(selector);
const PROJECT='enquiryflow-v3-pilot';
const INSTITUTE='demo-tech-academy';
const SDK='12.6.0';
let state;
function add(list,kind,label,details=''){
  const li=document.createElement('li');li.className=kind;
  const heading=document.createElement('strong');heading.textContent=label;li.append(heading);
  if(details){const msg=document.createElement('div');msg.className='small';msg.textContent=details;li.append(msg)}
  $(list).append(li);
}
function errorCode(e){return String(e?.code||e?.message||'unknown error').slice(0,170)}
function setBusy(busy){$('#publicCheck').disabled=busy;$('#loginButton').disabled=busy;$('#logoutButton').disabled=busy||!state?.auth?.currentUser}
async function init(){
 if(!CONFIG.firebase||CONFIG.firebase.projectId!==PROJECT)throw Error('Unexpected Firebase project; no checks were run');
 const [appMod,authMod,dbMod]=await Promise.all([
  import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-app.js`),
  import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-auth.js`),
  import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-firestore.js`)
 ]);
 const app=appMod.initializeApp(CONFIG.firebase,'enquiryflow-diagnostics-memory-only');
 // In-memory auth isolates this diagnostic session from existing site logins.
 const auth=authMod.initializeAuth(app,{persistence:authMod.inMemoryPersistence});
 const db=dbMod.getFirestore(app);
 state={auth,db,...authMod,...dbMod};
 return state;
}
async function publicChecks(){
 $('#publicResults').replaceChildren();setBusy(true);
 try{
  const f=state||await init();
  if(f.auth.currentUser){add('#publicResults','note','Public checks require sign-out','Sign out of the diagnostic account and run again.');return}
  try{
   const doc=await f.getDoc(f.doc(f.db,'ef3_institutes',INSTITUTE));
   if(doc.exists()&&doc.data().published===true)add('#publicResults','ok','PASS · Published institute profile readable','The public document demo-tech-academy is accessible.');
   else add('#publicResults','bad','FAIL · Institute profile unavailable','Check the document ID and the published Boolean field.');
  }catch(e){add('#publicResults','bad','FAIL · Cannot read public institute',errorCode(e))}
  for(const [collection,label] of [['ef3_enquiries','private enquiries'],['ef3_staff','staff membership']]){
   try{await f.getDocs(f.query(f.collection(f.db,collection),f.limit(1)));add('#publicResults','bad',`FAIL · Anonymous list of ${label} was allowed`,'Do not enable live intake. Review the published security rules.');}
   catch(e){if(e?.code==='permission-denied')add('#publicResults','ok',`PASS · Anonymous ${label} access denied`);else add('#publicResults','note',`UNVERIFIED · ${label} check failed`,errorCode(e))}
  }
 }catch(e){add('#publicResults','bad','Unable to initialize Firebase',errorCode(e))}finally{setBusy(false)}
}
async function signInCheck(event){
 event.preventDefault();$('#ownerResults').replaceChildren();setBusy(true);
 const password=$('#ownerPassword').value;$('#ownerPassword').value='';
 try{
  const f=state||await init();
  await f.signInWithEmailAndPassword(f.auth,$('#ownerEmail').value.trim(),password);
  $('#ownerEmail').value='';
  $('#authProgress').textContent='Signed in to Firebase Authentication in this page only.';
  const user=f.auth.currentUser;
  const role=await f.getDoc(f.doc(f.db,'ef3_staff',user.uid));
  if(!role.exists()){add('#ownerResults','bad','FAIL · Staff authorization record missing','The ef3_staff document ID must exactly match the Firebase Auth UID.');return}
  const d=role.data();
  if(d.active===true&&d.role==='owner'&&d.institute_id===INSTITUTE)add('#ownerResults','ok','PASS · Owner authorization confirmed','Active owner for demo-tech-academy.');
  else{add('#ownerResults','bad','FAIL · Owner record fields incorrect','Required: active Boolean true, role owner, institute_id demo-tech-academy.');return}
  try{
   const inst=await f.getDoc(f.doc(f.db,'ef3_institutes',INSTITUTE));
   if(inst.exists())add('#ownerResults','ok','PASS · Owner can read institute profile');else add('#ownerResults','bad','FAIL · Institute document missing');
  }catch(e){add('#ownerResults','bad','FAIL · Owner cannot read institute',errorCode(e))}
  try{await f.getDocs(f.query(f.collection(f.db,'ef3_enquiries'),f.limit(1)));add('#ownerResults','ok','PASS · Owner can access private enquiry queue','Records remain hidden by this diagnostic; zero enquiries is valid.');}
  catch(e){add('#ownerResults','bad','FAIL · Owner cannot read enquiry queue',errorCode(e))}
 }catch(e){$('#authProgress').textContent='Sign-in or permissions check failed.';add('#ownerResults','bad','Unable to verify owner account',errorCode(e))}
 finally{setBusy(false)}
}
async function logout(){setBusy(true);try{if(state?.auth)await state.signOut(state.auth);$('#authProgress').textContent='Signed out.';$('#ownerResults').replaceChildren();}catch(e){$('#authProgress').textContent=`Sign-out error: ${errorCode(e)}`}finally{setBusy(false)}}
$('#publicCheck').addEventListener('click',publicChecks);
$('#loginForm').addEventListener('submit',signInCheck);
$('#logoutButton').addEventListener('click',logout);