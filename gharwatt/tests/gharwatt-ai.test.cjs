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
