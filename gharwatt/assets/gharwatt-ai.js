/* GharWatt AI client. Anonymous visitors; no account or persisted conversation.
   Only communicates when the visitor explicitly ticks consent and sends a message.
   A provider may not be active until the operator completes secure setup. */
(function(root){
'use strict';
const ENDPOINT='https://nnhzihcugvifhegsfmua.supabase.co/functions/v1/gharwatt-ai';
const $=id=>typeof document==='undefined'?null:document.getElementById(id);
const valid=(x,min,max)=>x!==null&&x!==undefined&&String(x).trim()!==''&&Number.isFinite(Number(x))&&Number(x)>=min&&Number(x)<=max;
function safeContext(raw){
 const o=raw&&typeof raw==='object'?raw:{};
 return {amount:valid(o.amount,0,500000)?Number(o.amount):null,
  units:valid(o.units,0,100000)?Number(o.units):null,
  arrears:valid(o.arrears,0,500000)?Number(o.arrears):null,
  period:o.period==='monthly'?'monthly':'unknown',
  home:['own','rent'].includes(o.home)?o.home:'unknown',
  roof:['yes','no'].includes(o.roof)?o.roof:'unknown'};
}
function cleanMessage(raw){
 return typeof raw==='string'?raw.trim().slice(0,550):'';
}
const BROWSER_ID_KEY="gharwatt:ai-browser-id-v1";
const UUID_V4=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function getOrCreateBrowserId(store,randomUUID){
 // Only called after the visitor explicitly consents to a Gemini request.
 // An opaque random browser ID is stored locally; no account or bill is saved.
 if(!store||typeof randomUUID!=='function')return null;
 try{
  const existing=store.getItem(BROWSER_ID_KEY);
  if(typeof existing==='string'&&UUID_V4.test(existing))return existing;
  const id=randomUUID();
  if(typeof id!=='string'||!UUID_V4.test(id))return null;
  store.setItem(BROWSER_ID_KEY,id);
  return id;
 }catch{return null}
}
function browserId(){
 let store=null;
 try{store=root.localStorage}catch{}
 if(!store)try{store=root.sessionStorage}catch{}
 const randomUUID=typeof root.crypto?.randomUUID==='function'?()=>root.crypto.randomUUID():null;
 return getOrCreateBrowserId(store,randomUUID);
}
root.GharWattAIClient=Object.freeze({safeContext,cleanMessage,getOrCreateBrowserId});
const panel=$('gw-ask-ai');
if(!panel)return;
const status=$('gw-ai-live-status'),send=$('gw-ai-send'),message=$('gw-ai-message'),
 consent=$('gw-ai-consent'),shareBill=$('gw-ai-share-bill'),historyBox=$('gw-ai-history'),clear=$('gw-ai-clear');
let ready=false,busy=false,checked=false;
const transcript=[];
function statusText(value){status.textContent=value;}
function updateSend(){send.disabled=!ready||busy||!consent.checked||cleanMessage(message.value).length<3;}
function customerContext(){
 return safeContext({amount:$('gw-bill-amount')?.value,units:$('gw-bill-units')?.value,
  arrears:$('gw-old-dues')?.value,period:$('gw-bill-period')?.value,
  home:$('gw-home-status')?.value,roof:$('gw-roof-status')?.value});
}
function showMessage(role,text){
 const node=document.createElement('div');node.className='gw-ai-bubble '+(role==='user'?'gw-ai-from-user':'gw-ai-from-assistant');
 const title=document.createElement('strong');title.textContent=role==='user'?'You':'GharWatt AI';
 const body=document.createElement('p');body.textContent=text;
 node.append(title,body);historyBox.append(node);
 historyBox.scrollTop=historyBox.scrollHeight;
}
async function check(){
 if(checked)return;
 checked=true;
 statusText('Checking AI availability…');
 try{
  const response=await fetch(ENDPOINT,{method:'GET',headers:{Accept:'application/json'},
   cache:'no-store',signal:AbortSignal.timeout(9000)});
  if(!response.ok)throw Error('unavailable');
  const data=await response.json();ready=data?.ready===true;
  statusText(ready?'AI is available. Choose what to share before sending a question.':
    'AI chat is not activated yet. You can still copy a reviewed question into ChatGPT below.');
 }catch{
  ready=false;statusText('AI chat cannot be reached right now. The rest of GharWatt works normally.');
 }
 updateSend();
}
panel.addEventListener('toggle',()=>{if(panel.open)void check()});
const prompts=[
 ['Explain my bill','Explain the difference between total payable, units consumed and electricity tariff in simple terms.'],
 ['Find free savings','What free electricity-saving habits should an Indian household try before buying new appliances?'],
 ['Should I buy solar?','What details should I check before deciding whether rooftop solar is financially worthwhile?']
];
const suggestions=$('gw-ai-suggestions');
prompts.forEach(([label,value])=>{
 const b=document.createElement('button');b.type='button';b.className='gw-ai-suggestion';b.textContent=label;
 b.addEventListener('click',()=>{message.value=value;message.focus();updateSend()});suggestions.append(b);
});
message.addEventListener('input',updateSend);consent.addEventListener('change',updateSend);
function setBusy(b){busy=b;send.textContent=b?'Asking AI…':'Ask GharWatt AI';updateSend();}
send.addEventListener('click',async()=>{
 if(!ready||busy||!consent.checked)return;
 const question=cleanMessage(message.value);
 if(question.length<3)return;
 const share=shareBill.checked;
 const visitorId=browserId();
 if(!visitorId){
  statusText('Your browser could not save an anonymous AI usage ID. Allow site storage to use AI, or try another browser. GharWatt calculators still work.');
  return;
 }
 setBusy(true);statusText('AI is preparing an explanation…');
 const requestHistory=transcript.slice(-4).map(x=>({role:x.role==='user'?'user':'model',text:x.text}));
 try{
  const response=await fetch(ENDPOINT,{
   method:'POST',
   headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify({consent:true,visitorId,shareBill:share,
    context:share?customerContext():null,message:question,history:requestHistory}),
   cache:'no-store',signal:AbortSignal.timeout(25000)
  });
  const data=await response.json();
  if(!response.ok||data?.ok!==true||typeof data.answer!=='string'){
   if(data?.code==='NOT_CONFIGURED')ready=false;
   statusText(typeof data?.error==='string'?data.error:'AI could not answer. Try again later.');
   return;
  }
  showMessage('user',question);
  showMessage('assistant',data.answer.slice(0,1700));
  transcript.push({role:'user',text:question},{role:'assistant',text:data.answer.slice(0,1700)});
  while(transcript.length>8)transcript.shift();
  message.value='';
  statusText('AI explanation only: actual tariffs, charges and savings must be verified. '+
    (typeof data.remainingToday==='number'?data.remainingToday+' request(s) remain today.':''));
 }catch{
  statusText('The AI connection did not respond. Please try again later or use the copy option below.');
 }finally{setBusy(false);}
});
clear.addEventListener('click',()=>{
 transcript.length=0;historyBox.replaceChildren();message.value='';consent.checked=false;shareBill.checked=false;
 statusText(ready?'Conversation cleared from this tab.':'Chat cleared. Provider setup is still pending.');
 updateSend();
});
updateSend();
})(window);