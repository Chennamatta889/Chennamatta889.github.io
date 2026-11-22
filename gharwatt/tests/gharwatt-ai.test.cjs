const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'../assets/gharwatt-ai.js'),'utf8');
const ctx={window:{},document:{getElementById:()=>null}};
vm.runInNewContext(js,ctx);
const ai=ctx.window.GharWattAIClient;
test('AI shares only whitelisted numeric context when visitor opts in',()=>{
 const c=ai.safeContext({amount:'500',units:'40',arrears:'',period:'monthly',home:'rent',roof:'no',
  account:'12345678',phone:'6666666666',name:'PRIVATE',address:'EXAMPLE STREET'});
 assert.equal(c.amount,500);
 assert.equal(c.units,40);
 assert.equal(c.arrears,null);
 assert.equal(c.period,'monthly');
 assert.equal(c.home,'rent');
 assert.equal(c.roof,'no');
 assert.equal(Object.prototype.hasOwnProperty.call(c,'account'),false);
 assert.equal(Object.prototype.hasOwnProperty.call(c,'address'),false);
 assert.equal(Object.prototype.hasOwnProperty.call(c,'name'),false);
});
test('unknown bill figures remain unknown and are not silently interpreted as zero',()=>{
 const c=ai.safeContext({amount:'',units:'',arrears:null,period:'invalid',home:'other',roof:'else'});
 assert.equal(c.amount,null);
 assert.equal(c.units,null);
 assert.equal(c.arrears,null);
 assert.equal(c.period,'unknown');
 assert.equal(c.home,'unknown');
 assert.equal(c.roof,'unknown');
});
test('messages have a short and bounded maximum',()=>{
 assert.equal(ai.cleanMessage('   Why is my bill high?  '),'Why is my bill high?');
 assert.equal(ai.cleanMessage('a'.repeat(1000)).length,550);
 assert.equal(ai.cleanMessage(null),'');
});
test('client does not embed API keys or auto-send unconsented bill details',()=>{
 assert.match(js,/consent\.checked/);
 assert.match(js,/shareBill\.checked/);
 assert.match(js,/context:share\?customerContext\(\):null/);
 assert.doesNotMatch(js,/GEMINI_API_KEY|OPENAI_API_KEY|SUPABASE_SERVICE_ROLE_KEY/);
 assert.match(js,/textContent=text/);
});
test('backend has default-off switch, durable quota, and no message storage',()=>{
 const ts=fs.readFileSync(path.join(__dirname,'../backend/gharwatt-ai/index.ts'),'utf8');
 assert.match(ts,/GHARWATT_AI_ENABLED/);
 assert.match(ts,/gharwatt_ai_reserve_request/);
 assert.match(ts,/GLOBAL_PER_DAY = 20/);
 assert.match(ts,/PER_VISITOR_PER_DAY = 3/);
 assert.match(ts,/origin!==ORIGIN/);
 assert.match(ts,/if\(body\.consent!==true\)/);
 assert.match(ts,/shareBill===true\?pickContext\(body\.context\):pickContext\(null\)/);
 assert.doesNotMatch(ts,/insert.*chat|persist.*question|store.*history/i);
});

test('anonymous browser IDs stay stable per browser, independent of IP and other browsers',()=>{
 const mapA=new Map(),mapB=new Map();
 const storage=m=>({getItem:k=>m.get(k)||null,setItem:(k,v)=>{m.set(k,v)}});
 const a='3df1db12-a7a9-4873-b9f6-cebe96ff9c43';
 const b='e647e6b5-f157-4b8b-a633-22d97c2c43b6';
 let minted=0;
 const first=ai.getOrCreateBrowserId(storage(mapA),()=>{minted++;return a});
 const firstAgain=ai.getOrCreateBrowserId(storage(mapA),()=>{minted++;return b});
 const other=ai.getOrCreateBrowserId(storage(mapB),()=>{minted++;return b});
 assert.equal(first,a);
 assert.equal(firstAgain,a);
 assert.equal(other,b);
 assert.equal(minted,2);
});
test('anonymous ID creation fails closed without storage or secure UUID',()=>{
 const a='3df1db12-a7a9-4873-b9f6-cebe96ff9c43';
 assert.equal(ai.getOrCreateBrowserId(null,()=>a),null);
 assert.equal(ai.getOrCreateBrowserId({getItem:()=>null,setItem:()=>{throw new Error('storage denied')}},()=>a),null);
 assert.equal(ai.getOrCreateBrowserId({getItem:()=>null,setItem:()=>{}},()=> 'user-controlled-name'),null);
});
test('backend keys per-visitor limit by random browser ID rather than shared IP',()=>{
 const ts=fs.readFileSync(path.join(__dirname,'../backend/gharwatt-ai/index.ts'),'utf8');
 assert.match(ts,/const visitorId=typeof body\.visitorId/);
 assert.match(ts,/const quota=await reserve\(visitorId\)/);
 assert.match(ts,/hash(?:ed)?Visitor\(visitorId:string,secret:string\)/);
 assert.doesNotMatch(ts,/req\.headers\.get\("x-real-ip"\)|req\.headers\.get\("x-forwarded-for"\)/);
 assert.match(ts,/GLOBAL_PER_DAY = 20/);
 assert.match(ts,/BROWSER_ID_REQUIRED/);
});
