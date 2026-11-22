const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/production-adapter.js'),'utf8');
function harness(){
 let s=source.replace(/^import .*$/gm,'').replace(/\bexport\s+(?=(?:async\s+)?function|const|class|let)/g,'');
 s=s.replace('async function firebase(){','async function unreachableRealFirebase(){');
 s=s.replace('const rows=snapshot=>','let __fake;async function firebase(){return __fake}\nconst rows=snapshot=>');
 s+='\n__testing={submitEnquiry,isProductionReady,setFake:x=>(__fake=x)};';
 const ctx={CONFIG:{instituteSlug:'demo-tech-academy'},validateEnquiry:(p)=>(!p.consent?['Consent required']:[]),
  demo:{},location:{pathname:'/production-student.html'},console,Date,Promise,Error,crypto:{},__testing:null};
 vm.createContext(ctx);vm.runInContext(s,ctx,{timeout:3000});
 const institute={published:true,production_ready:true,name:'Example Institute',email:'office@institution.in'};
 const writes=[];
 const user={uid:'GOOGLE-USER',email:'real.person@gmail.com',emailVerified:true,providerData:[{providerId:'google.com'}]};
 const f={auth:{currentUser:user},db:'database',getDoc:async()=>({data:()=>institute}),
  collection:(db,c)=>({coll:c}),
  doc:(...args)=>args.length===1?{coll:args[0].coll,id:'REAL-TEST-ID-1234567'}:{coll:args[1],id:args[2]},
  serverTimestamp:()=>({serverTime:true}),
  writeBatch:()=>({set:(ref,data)=>writes.push({ref,data}),commit:async()=>{}})};
 ctx.__testing.setFake(f);
 return {api:ctx.__testing,f,user,institute,writes};
}
const payload={full_name:'Real Student Name',email:'real.person@gmail.com',course_id:'',batch_id:'',question:'Please send details.',consent:true};
test('real institute readiness blocks fictional records and requires approved contact',()=>{
 const {api,institute}=harness();
 assert.equal(api.isProductionReady(institute),true);
 assert.equal(api.isProductionReady({...institute,name:'Demo Tech Academy'}),false);
 assert.equal(api.isProductionReady({...institute,email:'admissions@example.com'}),false);
 assert.equal(api.isProductionReady({...institute,production_ready:false}),false);
});
test('verified Google identity submits an atomic two-document batch with real email',async()=>{
 const {api,writes}=harness();
 const result=await api.submitEnquiry(payload);
 assert.equal(result.id,'REAL-TEST-ID-1234567');assert.equal(result.demo,false);
 assert.equal(writes.length,2);
 assert.equal(writes[0].ref.coll,'ef3_real_enquiries');
 assert.equal(writes[1].ref.coll,'ef3_real_intake_limits');
 assert.equal(writes[1].ref.id,'GOOGLE-USER');
 assert.equal(writes[1].data.enquiry_id,result.id);
 assert.equal(writes[0].data.email,payload.email);
 assert.equal(writes[0].data.auth_uid,'GOOGLE-USER');
 assert.equal(writes[0].data.consent_version,'ef3-privacy-2026-11-22');
 assert.equal(writes[0].data.created_at.serverTime,true);
 assert.equal(writes[1].data.last_created_at.serverTime,true);
});
test('unverified users, forged email, disabled intake and missing consent fail closed',async()=>{
 const x=harness();
 x.f.auth.currentUser=null;
 await assert.rejects(x.api.submitEnquiry(payload),/Verify your Google account/);
 x.f.auth.currentUser=x.user;
 await assert.rejects(x.api.submitEnquiry({...payload,email:'forged@gmail.com'}),/must match/);
 await assert.rejects(x.api.submitEnquiry({...payload,consent:false}),/Consent/);
 x.institute.production_ready=false;
 await assert.rejects(x.api.submitEnquiry(payload),/Admissions are not open/);
 assert.equal(x.writes.length,0);
});