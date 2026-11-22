/* Owner-only Firebase setup. Authorization is enforced by Firestore rules, not these controls. */
import {CONFIG} from './config.js';
const ID='demo-tech-academy';
const $=s=>document.querySelector(s);
let fb=null,verified=false,docData=null,busy=false;
const status=(message,kind='')=>{const el=$('#status');el.textContent=message;el.className=kind;};
function mode(active){busy=active;for(const id of ['login','save','logout','activate','deactivate']){const el=$('#'+id);if(el)el.disabled=active;}if(!active)buttons();}
function buttons(){
 const ready=docData?.production_ready===true;
 $('#logout').disabled=!verified;
 $('#login').disabled=verified;
 $('#save').disabled=!verified;
 $('#activate').disabled=!verified||ready||!allApproved();
 $('#deactivate').disabled=!verified||!ready;
}
const allApproved=()=>['ownerAck','privacyAck','catalogAck'].every(id=>$('#'+id).checked);
async function client(){
 if(fb)return fb;
 if(CONFIG.firebase?.projectId!=='enquiryflow-v3-pilot')throw Error('Unexpected Firebase project; no change made.');
 const ver='12.6.0';
 const [appMod,authMod,storeMod]=await Promise.all([
  import(`https://www.gstatic.com/firebasejs/${ver}/firebase-app.js`),
  import(`https://www.gstatic.com/firebasejs/${ver}/firebase-auth.js`),
  import(`https://www.gstatic.com/firebasejs/${ver}/firebase-firestore.js`)
 ]);
 const app=appMod.initializeApp(CONFIG.firebase,'enquiryflow-owner-launch-in-memory');
 const auth=authMod.initializeAuth(app,{persistence:authMod.inMemoryPersistence});
 const db=storeMod.getFirestore(app);
 fb={auth,db,authMod,storeMod};
 return fb;
}
async function assertOwner(){
 const {auth,db,storeMod:f}=await client(),user=auth.currentUser;
 if(!user)throw Error('Sign in to your Firebase owner account first.');
 const snap=await f.getDoc(f.doc(db,'ef3_staff',user.uid));
 if(!snap.exists()||snap.data().active!==true||snap.data().role!=='owner'||snap.data().institute_id!==ID)
   throw Error('This Firebase user is not the active Ctech Academy owner. No changes made.');
 return f;
}
async function refresh(){
 const f=await assertOwner();const {db}=fb;
 const snap=await f.getDoc(f.doc(db,'ef3_institutes',ID));
 if(!snap.exists())throw Error('The institute profile does not exist. No changes made.');
 docData=snap.data();
 $('#instituteName').value=docData.name==='Demo Tech Academy'?'Ctech Academy':docData.name||'Ctech Academy';
 $('#contact').value=docData.email||'';
 $('#city').value=docData.city||'Hyderabad';
 $('#tagline').value=docData.tagline||'';
 $('#about').value=String(docData.about||'').startsWith('Fictional institute')?'Ctech Academy provides information about its courses and responds to prospective learner enquiries.':docData.about||'';
 $('#readiness').textContent=docData.production_ready===true?'Real enquiry intake is ACTIVE.':'Real enquiry intake is CLOSED.';
 $('#setup').hidden=false;$('#launchSection').hidden=false;
 buttons();
}
function validated(){
 const name=$('#instituteName').value.trim(),email=$('#contact').value.trim(),city=$('#city').value.trim();
 const about=$('#about').value.trim(),tagline=$('#tagline').value.trim();
 if(name!=='Ctech Academy')throw Error('For this launch, use the approved name Ctech Academy.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)||/@example\.(com|org|net)$/i.test(email))throw Error('Set a valid, monitored contact email (not @example.com).');
 if(city.length<2||city.length>100)throw Error('Enter a valid city.');
 if(about.length<20||about.length>1500||/fictional|testing only|demo institute/i.test(about))throw Error('Enter an accurate, genuine description of at least 20 characters.');
 if(tagline.length>160)throw Error('Tagline is too long.');
 return {name,email,city,about,tagline,slug:'ctech-academy',published:true};
}
async function writeProfile(ready){
 const patch=validated();
 const f=await assertOwner();
 const old=await f.getDoc(f.doc(fb.db,'ef3_institutes',ID));
 if(!old.exists())throw Error('Institute profile missing.');
 if(ready!==undefined)patch.production_ready=ready;
 else patch.production_ready=false; // saving draft always closes real intake deliberately
 await f.updateDoc(f.doc(fb.db,'ef3_institutes',ID),patch);
 const current=await f.getDoc(f.doc(fb.db,'ef3_institutes',ID));
 if(!current.exists()||Object.entries(patch).some(([k,v])=>current.data()[k]!==v))throw Error('Saved but verification failed; confirm the Firebase document before proceeding.');
 await refresh();return current.data();
}
$('#loginForm').addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;
 mode(true);const password=$('#password').value;$('#password').value='';
 try{
  const f=await client();await f.authMod.signInWithEmailAndPassword(f.auth,$('#email').value.trim(),password);
  await assertOwner();verified=true;$('#email').value='';await refresh();
  status(docData?.production_ready===true
    ?'Owner verified. Real enquiry intake is ACTIVE in Firebase. Test a genuine Google-verified submission from the student website and confirm its reference in the staff inbox.'
    :'Owner verified. Real enquiry intake is CLOSED. Review and save the profile, then activate only after approving the privacy and course information.','ok');
 }catch(e){verified=false;$('#setup').hidden=true;$('#launchSection').hidden=true;status('Sign-in or owner check failed: '+String(e.code||e.message||e),'err');if(fb?.auth.currentUser)await fb.authMod.signOut(fb.auth);}finally{mode(false)}
});
$('#profileForm').addEventListener('submit',async e=>{
 e.preventDefault();if(busy||!verified)return;mode(true);
 try{await writeProfile(false);status('Ctech Academy profile saved and independently read back from Firestore. Genuine student enquiries remain CLOSED.','ok');}
 catch(error){status('Could not save profile: '+String(error.code||error.message||error),'err');}
 finally{mode(false)}
});
for(const id of ['ownerAck','privacyAck','catalogAck'])$('#'+id).addEventListener('change',buttons);
$('#activate').addEventListener('click',async()=>{
 if(busy||!verified||!allApproved())return;
 if(!confirm('Open Ctech Academy to genuine student names, verified Google email addresses and private enquiry submissions now?'))return;
 mode(true);
 try{await writeProfile(true);status('ACTIVE: Ctech Academy can receive genuine verified student enquiries. Refresh the student site and perform one end-to-end test.','ok');}
 catch(error){status('Activation failed: '+String(error.code||error.message||error),'err');}
 finally{mode(false)}
});
$('#deactivate').addEventListener('click',async()=>{
 if(busy||!verified||!confirm('Close real student enquiry intake now? Existing enquiries remain private and available to staff.'))return;
 mode(true);try{
  const f=await assertOwner();await f.updateDoc(f.doc(fb.db,'ef3_institutes',ID),{production_ready:false});await refresh();
  status('Real intake is now CLOSED. Existing records remain private.','ok');
 }catch(error){status('Could not close intake: '+String(error.code||error.message||error),'err');}finally{mode(false)}
});
$('#logout').addEventListener('click',async()=>{
 if(!fb||busy)return;mode(true);
 try{await fb.authMod.signOut(fb.auth);verified=false;docData=null;$('#setup').hidden=true;$('#launchSection').hidden=true;
  for(const id of ['ownerAck','privacyAck','catalogAck'])$('#'+id).checked=false;
  status('Signed out; no credentials are retained by this setup page.','ok');}
 catch(e){status('Sign-out failed: '+String(e.message||e),'err');}finally{mode(false)}
});
buttons();