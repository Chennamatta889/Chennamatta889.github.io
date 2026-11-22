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
 assert.match(ts,/GLOBAL_PER_DAY = 400/);
 assert.match(ts,/PER_VISITOR_PER_DAY = 5/);
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
 assert.match(ts,/GLOBAL_PER_DAY = 400/);
 assert.match(ts,/BROWSER_ID_REQUIRED/);
});

test('rate caps include 10 requests in a rolling minute and no provider call on rejection',()=>{
 const ts=fs.readFileSync(path.join(__dirname,'../backend/gharwatt-ai/index.ts'),'utf8');
 assert.match(ts,/GLOBAL_PER_MINUTE = 10/);
 assert.match(ts,/globalPerMinuteLimit:GLOBAL_PER_MINUTE/);
 assert.match(ts,/quota.code==="MINUTE_LIMIT"/);
 assert.match(ts,/retryAfterSeconds/);
 assert.match(ts,/daily allowance was not used/);
 assert.ok(ts.indexOf('const quota=await reserve(visitorId)')<ts.indexOf('const api=await fetch("https://generativelanguage.googleapis.com'));
});
test('namespaced PostgreSQL limiter uses an atomic rolling 60-second window',()=>{
 const sql=fs.readFileSync(path.join(__dirname,'../backend/gharwatt-ai/quota-400-5-10.sql'),'utf8');
 assert.match(sql,/pg_advisory_xact_lock/);
 assert.match(sql,/interval '60 seconds'/);
 assert.match(sql,/recent_count >= 10/);
 assert.match(sql,/p_per_visitor not between 1 and 5/);
 assert.match(sql,/p_global not between 1 and 400/);
 assert.match(sql,/jsonb_build_object\('ok',false,'code','MINUTE_LIMIT'/);
 assert.ok(sql.indexOf('if recent_count >= 10')<sql.indexOf("insert into public.gharwatt_ai_request_quota"));
 assert.match(sql,/revoke all on function public.gharwatt_ai_reserve_request/);
 assert.match(sql,/to service_role/);
});

test('bill uploader rejects unsupported, oversized and empty files without sending',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../assets/gharwatt-ai-upload.js'),'utf8');
 const sandbox={window:{}};
 vm.runInNewContext(source,sandbox);
 const upload=sandbox.window.GharWattBillAI;
 assert.equal(upload.detectKind({type:'image/png',name:'bill.png'}),'image');
 assert.equal(upload.detectKind({type:'application/pdf',name:'bill.pdf'}),'pdf');
 assert.equal(upload.validateSelection({name:'bill.txt',type:'text/plain',size:2500}).ok,false);
 assert.equal(upload.validateSelection({name:'bill.pdf',type:'application/pdf',size:upload.MAX_BILL_BYTES+1}).ok,false);
 assert.equal(upload.validateSelection({name:'bill.jpg',type:'image/jpeg',size:upload.MAX_IMAGE_SOURCE_BYTES+1}).ok,false);
 assert.equal(upload.validateSelection({name:'empty.pdf',type:'application/pdf',size:0}).ok,false);
 assert.equal(upload.validateSelection({name:'bill.pdf',type:'application/pdf',size:2048}).ok,true);
 assert.equal(upload.validateSelection({name:'bill.webp',type:'image/webp',size:5000}).ok,true);
 assert.match(source,/consent\.checked/);
 assert.match(source,/billConsent:true/);
 assert.match(source,/root\.fetch\(ENDPOINT,\{/);
 assert.match(source,/X-GharWatt-Bill-Upload/);
 assert.match(source,/canvas\.toBlob/);
 assert.match(source,/file\.arrayBuffer\(\)/);
 assert.doesNotMatch(source,/GEMINI_API_KEY|SUPABASE_SERVICE_ROLE_KEY/);
 assert.match(source,/content\.textContent=data\.answer/);
});
test('backend keeps bill uploads bounded, opt-in and inside existing quotas',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../backend/gharwatt-ai/index.ts'),'utf8');
 assert.match(source,/const MAX_BODY = 4000/);
 assert.match(source,/MAX_BILL_BODY = 4_300_000/);
 assert.match(source,/readBodyLimited\(req,maxBody\)/);
 assert.match(source,/billConsent!==true/);
 assert.match(source,/if\(hasBill&&!bill\)/);
 assert.match(source,/validateBill\(body\.bill\)/);
 assert.match(source,/billUpload&&!hasBill/);
 assert.match(source,/mimeType!=="application\/pdf"&&mimeType!=="image\/jpeg"/);
 assert.match(source,/data\.startsWith\("JVBERi0"\)/);
 assert.match(source,/data\.startsWith\("\/9j\/"\)/);
 assert.match(source,/inlineData:\{mimeType:bill!\.mimeType,data:bill!\.data\}/);
 assert.ok(source.indexOf('const bill=hasBill?validateBill(body.bill):null;')<
   source.indexOf('const quota=await reserve(visitorId)'));
 assert.ok(source.indexOf('const quota=await reserve(visitorId)')<
   source.indexOf('const api=await fetch("https://generativelanguage.googleapis.com'));
 assert.match(source,/GLOBAL_PER_DAY = 400/);
 assert.match(source,/PER_VISITOR_PER_DAY = 5/);
 assert.match(source,/GLOBAL_PER_MINUTE = 10/);
});


test('uploaded-bill advice reuses deterministic verdict instead of trusting AI narrative',()=>{
 const sandbox={window:{},document:{getElementById:()=>null},Intl};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/verdict.js'),'utf8'),sandbox);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/gharwatt-ai-upload.js'),'utf8'),sandbox);
 const recommend=sandbox.window.GharWattBillAIAdvice.recommendOptions;
 const verdict=sandbox.window.GharWattVerdict.verdict;
 const low=recommend({amount:'500',units:'40',period:'monthly',home:'own',roof:'yes'},verdict);
 assert.equal(low.key,'free-first');
 assert.match(low.alternatives[2],/long time to pay back/);
 const high=recommend({amount:'4000',units:'400',period:'monthly',home:'own',roof:'yes'},verdict);
 assert.equal(high.key,'compare-roof');
 assert.match(high.alternatives[2],/worth comparing/);
 assert.match(high.alternatives[2],/NOT proven the best/);
 const renter=recommend({amount:'3500',units:'300',period:'monthly',home:'rent',roof:'yes'},verdict);
 assert.equal(renter.key,'efficiency-first');
 assert.match(renter.alternatives[2],/not the default next step/);
 const arrears=recommend({amount:'1800',units:'50',arrears:'1600',period:'monthly'},verdict);
 assert.equal(arrears.key,'arrears');
 assert.match(arrears.title,/unpaid charges/);
 const uncertain=recommend({amount:'3500',units:'400',period:'unknown',home:'own',roof:'yes'},verdict);
 assert.equal(uncertain.key,'check-period');
 assert.match(uncertain.alternatives[2],/Confirm monthly consumption/);
});
test('recommendations only display after an explicit customer review, with no extra provider call',()=>{
 const upload=fs.readFileSync(path.join(__dirname,'../assets/gharwatt-ai-upload.js'),'utf8');
 const html=fs.readFileSync(path.join(__dirname,'../discover/index.html'),'utf8');
 assert.match(upload,/reviewButton\.addEventListener\("click",showRecommendedOptions\)/);
 assert.match(upload,/review\.hidden=false/);
 assert.match(upload,/review\.addEventListener\("input"/);
 assert.match(upload,/result=verdictEngine\(input\)/);
 assert.match(upload,/item\.textContent=option/);
 assert.match(html,/id="gw-ai-bill-review"/);
 assert.match(html,/id="gw-ai-fact-units"/);
 assert.match(html,/id="gw-ai-fact-home"/);
 assert.match(html,/id="gw-ai-fact-roof"/);
 assert.match(html,/runs only in this browser/i);
 const backend=fs.readFileSync(path.join(__dirname,'../backend/gharwatt-ai/index.ts'),'utf8');
 assert.match(backend,/Recommended next step \(with the reason\)/);
 assert.match(backend,/never call it the best purchase from the bill alone/i);
 assert.match(backend,/GLOBAL_PER_DAY = 400/);
 assert.match(backend,/PER_VISITOR_PER_DAY = 5/);
 assert.match(backend,/GLOBAL_PER_MINUTE = 10/);
});
