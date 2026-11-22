/* GharWatt V2: browser-only electricity decision tools. No bill image or personal data is sent to our server. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const number=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(n);
const valid=(n,min,max)=>Number.isFinite(Number(n))&&String(n).trim()!==''&&Number(n)>=min&&Number(n)<=max;
const set=(id,text)=>{let el=$(id);if(el)el.textContent=text;};
const read=(id)=>$(id)?.value;
const lineMatch=(lines,labels)=>{
 for(const label of labels){for(const line of lines){
 if(!label.test(line))continue;
 const after=line.replace(label,'').replace(/^[\s:–-]+/,'');
 const nums=[...after.matchAll(/(?:₹|Rs\.?|INR)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+(?:\.\d{1,2})?|[0-9]+(?:\.\d{1,2})?)/gi)].map(x=>Number(x[1].replace(/,/g,'')));
 if(nums.length)return nums[0];
 }}return null;
};
function parseBillText(raw){
 const lines=String(raw||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,400);
 const amount=lineMatch(lines,[/^(?:net\s+)?(?:total\s+)?(?:amount\s+(?:payable|due)|bill\s+amount|total\s+(?:due|bill|payable)|payable\s+amount|current\s+bill\s+amount)\b[\s:–-]*/i,/^grand\s+total\b[\s:–-]*/i]);
 const units=lineMatch(lines,[/^(?:units\s+(?:consumed|billed)|(?:total\s+)?consumption\s*\(?(?:kwh|units)?\)?|billed\s+units|energy\s+consumed\s*\(?(?:kwh)?\)?)\b[\s:–-]*/i]);
 const days=lineMatch(lines,[/^(?:billing\s+(?:days|period\s+days)|number\s+of\s+days)\b[\s:–-]*/i]);
 return {amount:valid(amount,0,500000)?amount:null,units:valid(units,0,100000)?units:null,days:valid(days,1,120)?days:null};
}
function compareBills(a,b){
 if(![a,b].every(x=>x&&valid(x.amount,0,500000)&&valid(x.days,1,120)))return null;
 const x=Number(a.amount),y=Number(b.amount),xd=Number(a.days),yd=Number(b.days);
 const change=x?((y-x)/x*100):null;
 const perDayA=x/xd,perDayB=y/yd;
 const uKnown=valid(a.units,0,100000)&&valid(b.units,0,100000);
 const ua=uKnown?Number(a.units):null,ub=uKnown?Number(b.units):null;
 return {amountBefore:x,amountAfter:y,rupeeChange:y-x,percentChange:change,perDayBefore:perDayA,perDayAfter:perDayB,perDayChange:perDayB-perDayA,unitsKnown:uKnown,unitsBefore:ua,unitsAfter:ub,unitChange:uKnown?ub-ua:null,unitPerDayBefore:uKnown?ua/xd:null,unitPerDayAfter:uKnown?ub/yd:null};
}
function applianceUse(rows,rate,days=30){
 if(!Array.isArray(rows)||rows.length===0||rows.length>35||!valid(rate,0,30)||!valid(days,1,366))return null;
 let total=0,items=[];
 for(const x of rows){
 if(!x||!valid(x.watts,1,10000)||!valid(x.hours,0,24)||!valid(x.count,1,30)||!Number.isInteger(Number(x.count)))return null;
 const kwh=Number(x.watts)*Number(x.hours)*Number(x.count)*Number(days)/1000;
 total+=kwh;items.push({name:String(x.name||'Appliance').slice(0,80),units:kwh,cost:kwh*Number(rate)});
 }
 return {units:total,cost:total*Number(rate),items:items.sort((x,y)=>y.units-x.units)};
}
function savingsGoal(current,target,rate,days=30){
 if(!valid(current,0,500000)||!valid(target,0,500000)||!valid(rate,0.5,30))return null;
 const gap=Math.max(0,Number(current)-Number(target));
 return {gap,unitTarget:gap/Number(rate),dailyUnitTarget:gap/Number(rate)/Number(days),percent:Number(current)>0?gap/Number(current)*100:0};
}
function loanEmi(principal,apr,months){
 if(!valid(principal,0,10000000)||!valid(apr,0,36)||!Number.isInteger(Number(months))||!valid(months,1,360))return null;
 const p=Number(principal),r=Number(apr)/1200,n=Number(months);
 const emi=r===0?p/n:p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
 return {emi,total:emi*n,interest:emi*n-p};
}
const sampleAppliances=Object.freeze({fan:{label:'Ceiling fan',watts:65,hours:10},led:{label:'LED bulb',watts:9,hours:5},ac:{label:'Air conditioner',watts:1500,hours:6},tv:{label:'Television',watts:80,hours:5},geyser:{label:'Electric geyser',watts:2000,hours:1},cooler:{label:'Air cooler',watts:150,hours:8},pump:{label:'Water pump',watts:900,hours:1},other:{label:'Other appliance',watts:100,hours:4}});
function makeShare(buttonId,textFunction,statusId){
 const b=$(buttonId);if(!b)return;
 b.addEventListener('click',async()=>{
  const text=textFunction();if(!text)return;
  try{if(navigator.share){await navigator.share({title:'GharWatt summary',text});set(statusId,'Sharing opened.');}
  else if(navigator.clipboard){await navigator.clipboard.writeText(text);set(statusId,'Summary copied. You can paste it into WhatsApp.');}
  else set(statusId,'Use your browser’s share or copy feature.');}
  catch(e){if(e&&e.name!=='AbortError')set(statusId,'Could not share; please copy the results manually.');}
 });
}
function initReader(){
 if(!$('v2-reader'))return;
 function show(){
  const r=parseBillText(read('v2-ocr-text'));
  set('v2-ocr-amount',r.amount===null?'Not found — enter manually':money(r.amount));
  set('v2-ocr-units',r.units===null?'Not found — check your bill':number(r.units)+' units');
  set('v2-ocr-days',r.days===null?'Not found':r.days+' days');
  if(r.amount!==null) $('v2-confirm-amount').value=r.amount;
  if(r.units!==null) $('v2-confirm-units').value=r.units;
  set('v2-ocr-status','Review every value against the bill. Reading errors are possible.');
 }
 $('v2-extract').addEventListener('click',show);
 let scriptLoad=null;
 async function library(){
  if(window.Tesseract?.createWorker)return;
  if(scriptLoad)return scriptLoad;
  scriptLoad=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src='https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js';
   script.referrerPolicy='no-referrer';
   script.onload=()=>window.Tesseract?.createWorker?resolve():reject(new Error('OCR library did not initialize'));
   script.onerror=()=>reject(new Error('OCR download failed'));
   document.head.appendChild(script);
  }).catch(e=>{scriptLoad=null;throw e});
  return scriptLoad;
 }
 $('v2-read-photo').addEventListener('click',async()=>{
  const file=$('v2-photo').files?.[0];
  if(!file){set('v2-ocr-status','Choose a photograph first, or paste bill text below.');return;}
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>9*1024*1024){set('v2-ocr-status','Use a JPG, PNG or WebP photo smaller than 9 MB. PDF files are not supported.');return;}
  $('v2-read-photo').disabled=true;set('v2-ocr-status','Reading on your device. The first use downloads an OCR library and language data; this may take time.');
  let worker;
  try{
   await library();worker=await window.Tesseract.createWorker('eng');
   const result=await worker.recognize(file);
   $('v2-ocr-text').value=String(result.data.text||'').slice(0,16000);
   show();set('v2-ocr-status','Reading finished locally. Check and correct the values because OCR is not always accurate.');
  }catch(e){set('v2-ocr-status','Photo reading did not work. Try a clearer English-language photo, or type the amount and units manually.');}
  finally{if(worker)try{await worker.terminate()}catch{}$('v2-read-photo').disabled=false;}
 });
 $('v2-clear').addEventListener('click',()=>{['v2-ocr-text','v2-confirm-amount','v2-confirm-units'].forEach(id=>$(id).value='');$('v2-photo').value='';['v2-ocr-amount','v2-ocr-units','v2-ocr-days'].forEach(id=>set(id,'—'));set('v2-ocr-status','Photo and recognized text cleared from this page.');});
 $('v2-confirm').addEventListener('click',()=>{
  const a=read('v2-confirm-amount'),u=read('v2-confirm-units');
  if(!valid(a,0,500000)){set('v2-ocr-status','Please enter a valid amount in rupees.');return;}
  set('v2-ocr-status','Confirmed: '+money(Number(a))+(valid(u,0,100000)?' and '+number(Number(u))+' units. This page does not save your photo or values. Use the comparison or appliance tools to investigate savings.'));
 });
}
function initAppliances(){
 if(!$('v2-appliances'))return;
 const list=$('v2-appliance-rows');
 let serial=0;
 function add(kind='fan'){
  if(list.children.length>=20){set('v2-appliance-status','Maximum 20 rows. Remove an unused row.');return;}
  const sample=sampleAppliances[kind]||sampleAppliances.other;
  const row=document.createElement('div');row.className='v2-appliance-row';
  const choices=Object.entries(sampleAppliances).map(([id,x])=>'<option value="'+id+'"'+(id===kind?' selected':'')+'>'+x.label+'</option>').join('');
  row.innerHTML='<label>Appliance<select data-kind aria-label="Appliance type">'+choices+'</select></label><label>Number<input data-count aria-label="Number of appliances" type="number" min="1" max="30" step="1" value="1"></label><label>Watts each<input data-watts aria-label="Watts per appliance" type="number" min="1" max="10000" step="1" value="'+sample.watts+'"></label><label>Hours/day<input data-hours aria-label="Hours used per day" type="number" min="0" max="24" step=".5" value="'+sample.hours+'"></label><button type="button" class="v2-remove" aria-label="Remove appliance">Remove</button>';
  row.querySelector('[data-kind]').addEventListener('change',e=>{const s=sampleAppliances[e.target.value];row.querySelector('[data-watts]').value=s.watts;row.querySelector('[data-hours]').value=s.hours;render()});
  row.querySelector('.v2-remove').addEventListener('click',()=>{row.remove();render()});
  row.addEventListener('input',render);row.dataset.entry=String(++serial);list.appendChild(row);render();
 }
 function render(){
  const rows=[...list.children].map(el=>({name:sampleAppliances[el.querySelector('[data-kind]').value].label,count:el.querySelector('[data-count]').value,watts:el.querySelector('[data-watts]').value,hours:el.querySelector('[data-hours]').value}));
  const r=applianceUse(rows,read('v2-appliance-rate'));if(!r){set('v2-appliance-units','Check inputs');set('v2-appliance-cost','—');$('v2-appliance-breakdown').replaceChildren();return;}
  set('v2-appliance-units',number(r.units)+' units');set('v2-appliance-cost',money(r.cost));
  const box=$('v2-appliance-breakdown');box.replaceChildren();
  r.items.forEach(x=>{
   const item=document.createElement('div');item.className='v2-breakdown-row';
   const label=document.createElement('span');label.textContent=x.name;
   const amount=document.createElement('strong');amount.textContent=number(x.units)+' units';
   item.append(label,amount);box.appendChild(item);
  });
  set('v2-appliance-status','These are power-rating examples only. Compressor appliances, changing speeds, standby and usage conditions vary.');
 }
 $('v2-add-appliance').addEventListener('click',()=>add('other'));
 $('v2-appliance-rate').addEventListener('input',render);
 add('fan');add('led');add('ac');
 makeShare('v2-appliance-share',()=>list.children.length?'GharWatt appliance estimate: '+$('v2-appliance-units').textContent+' per month; illustrative energy cost '+$('v2-appliance-cost').textContent+'. Verify wattage and tariff. https://chennamatta889.github.io/gharwatt/appliance-planner/':'','v2-appliance-status');
}
function initComparison(){
 if(!$('v2-bill-compare'))return;
 function refresh(){
  const a={amount:read('v2-prev-amount'),units:read('v2-prev-units'),days:read('v2-prev-days')};
  const b={amount:read('v2-new-amount'),units:read('v2-new-units'),days:read('v2-new-days')};
  const r=compareBills(a,b);
  if(!r){set('v2-change-rupees','Check inputs');set('v2-change-units','—');set('v2-change-explain','Enter two bill amounts and billing days (usually around 30) to compare.');return;}
  set('v2-change-rupees',(r.rupeeChange>0?'+':'')+money(r.rupeeChange));
  set('v2-change-units',r.unitsKnown?(r.unitChange>0?'+':'')+number(r.unitChange)+' units':'Not entered');
  const more=r.rupeeChange>0?'rose':r.rupeeChange<0?'fell':'did not change';
  let note='Your bill '+more+'. After adjusting for the length of each billing period, the rupee amount per day changed by '+money(r.perDayChange)+'. ';
  if(r.unitsKnown)note+='Electricity use per billed day moved from '+number(r.unitPerDayBefore)+' to '+number(r.unitPerDayAfter)+' units. ';
  else note+='Without units (kWh), we cannot tell whether more electricity was used. ';
  note+='Changes may come from consumption, slabs, taxes, fixed charges, arrears, credits or number of days. Check your detailed bill before deciding why.';
  set('v2-change-explain',note);
 }
 [...document.querySelectorAll('#v2-bill-compare input')].forEach(el=>el.addEventListener('input',refresh));refresh();
 makeShare('v2-change-share',()=> 'GharWatt bill comparison: '+$('v2-change-rupees').textContent+'; '+$('v2-change-explain').textContent+' https://chennamatta889.github.io/gharwatt/bill-change/','v2-change-share-status');
}
function initGoal(){
 if(!$('v2-goal'))return;
 function refresh(){
  const r=savingsGoal(read('v2-goal-current'),read('v2-goal-target'),read('v2-goal-rate'));
  if(!r){set('v2-goal-gap','Check inputs');set('v2-goal-units','—');return;}
  set('v2-goal-gap',money(r.gap));set('v2-goal-units',number(r.unitTarget)+' units/month');
  set('v2-goal-explain',r.gap===0?'Your target is already at or above your current bill. You can still reduce wasted electricity.':'To close this illustrative gap at the example rate, you would need to avoid about '+number(r.dailyUnitTarget)+' units every day. Actual rupee savings depend on your tariff slabs and fixed charges.');
 }
 [...document.querySelectorAll('#v2-goal input')].forEach(el=>el.addEventListener('input',refresh));refresh();
 makeShare('v2-goal-share',()=> 'My GharWatt electricity savings goal: '+$('v2-goal-gap').textContent+' monthly reduction, roughly '+$('v2-goal-units').textContent+' at the example tariff. Not guaranteed. https://chennamatta889.github.io/gharwatt/savings-goal/','v2-goal-share-status');
}
function initTracker(){
 if(!$('v2-tracker'))return;
 const key='gharwatt:monthly-electricity-v2';
 const storage=(()=>{try{return window.localStorage}catch{return null}})();
 let rows=[];
 try{const data=JSON.parse(storage?.getItem(key)||'[]');if(Array.isArray(data))rows=data.filter(x=>/^\d{4}-(?:0[1-9]|1[0-2])$/.test(x.month)&&valid(x.amount,0,500000)).slice(-24)}catch{}
 function show(){
  rows.sort((a,b)=>a.month.localeCompare(b.month));
  const container=$('v2-tracker-rows');container.replaceChildren();
  if(!rows.length){const t=document.createElement('p');t.textContent='No months saved yet. Your entries stay on this device.';container.appendChild(t);}
  const max=Math.max(1,...rows.map(x=>Number(x.amount)));
  for(const x of rows.slice(-12)){
   const item=document.createElement('div');item.className='v2-month-row';
   const label=document.createElement('strong');label.textContent=x.month;
   const outer=document.createElement('div');outer.className='v2-bar-track';outer.setAttribute('aria-label',money(x.amount));
   const bar=document.createElement('div');bar.className='v2-bar';bar.style.width=(x.amount/max*100).toFixed(1)+'%';outer.appendChild(bar);
   const val=document.createElement('span');val.textContent=money(x.amount)+(x.units!==null?' · '+number(x.units)+' units':'');
   item.append(label,outer,val);container.appendChild(item);
  }
  const latest=rows.at(-1),prior=rows.at(-2);
  set('v2-tracker-summary',rows.length+' month(s) recorded'+(latest&&prior?' · Last bill changed '+money(latest.amount-prior.amount)+' from prior month.':' · Add another month to compare.'));
 }
 function persist(){if(storage){try{storage.setItem(key,JSON.stringify(rows))}catch{set('v2-tracker-status','Your browser could not save locally. Use Export CSV to keep a copy.');}}show();}
 $('v2-tracker-save').addEventListener('click',()=>{
  if(!$('v2-tracker-consent').checked){set('v2-tracker-status','Please tick the checkbox to permit saving bill amounts in this browser.');return;}
  const month=read('v2-tracker-month'),amount=read('v2-tracker-amount'),units=read('v2-tracker-units');
  if(!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(month)||!valid(amount,0,500000)||(String(units).trim()!==''&&!valid(units,0,100000))){set('v2-tracker-status','Enter a valid month, rupee amount and optional units.');return;}
  rows=rows.filter(x=>x.month!==month);rows.push({month,amount:Number(amount),units:String(units).trim()===''?null:Number(units)});rows.sort((a,b)=>a.month.localeCompare(b.month));rows=rows.slice(-24);
  persist();set('v2-tracker-status','Month saved in this browser only. No account or upload.');
 });
 $('v2-tracker-export').addEventListener('click',()=>{
  const csv='month,amount_inr,units_kwh\n'+rows.map(x=>[x.month,x.amount,x.units===null?'':x.units].join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download='gharwatt-monthly-bills.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  set('v2-tracker-status','CSV downloaded. Keep the file private if it contains your billing details.');
 });
 $('v2-tracker-delete').addEventListener('click',()=>{if(!window.confirm('Delete all locally saved monthly bill entries on this device?'))return;rows=[];try{storage?.removeItem(key)}catch{}show();set('v2-tracker-status','Local bill history deleted.');});
 show();
}
function initFinance(){
 if(!$('v2-finance'))return;
 function update(){
  const gross=read('v2-cost'),sub=read('v2-subsidy'),deposit=read('v2-deposit'),apr=read('v2-apr'),years=read('v2-loan-years'),save=read('v2-monthly-saving');
  if(![gross,sub,deposit,apr,years,save].every((x,i)=>valid(x,0,[2000000,2000000,2000000,36,30,500000][i]))||Number(years)<1||Number(gross)<Number(sub)){set('v2-finance-emi','Check inputs');return;}
  const net=Number(gross)-Number(sub),principal=Math.max(0,net-Number(deposit)),r=loanEmi(principal,apr,Math.round(Number(years)*12));
  if(!r)return;
  set('v2-finance-net',money(net));set('v2-finance-emi',money(r.emi)+'/month');
  set('v2-finance-interest',money(r.interest));set('v2-finance-cashflow',money(Number(save)-r.emi)+'/month before upkeep');
  set('v2-finance-explain','The loan amount assumes the example subsidy is already available. Real subsidy timing, eligibility, fees, maintenance, taxes and changing electricity savings can alter costs. Compare a written bank offer and installer quotation.');
 }
 [...document.querySelectorAll('#v2-finance input')].forEach(el=>el.addEventListener('input',update));update();
}
function initRoof(){
 if(!$('v2-roof'))return;
 function update(){
  const area=read('v2-roof-area'),space=read('v2-roof-clear');
  if(!valid(area,1,10000)||!valid(space,0,100)){set('v2-roof-result','Check inputs');return;}
  const usable=Number(area)*Number(space)/100;
  set('v2-roof-result',number(usable/12)+'–'+number(usable/9)+' kW (rough area range)');
  set('v2-roof-note','Using '+number(usable)+' m² assumed clear area and 9–12 m² per kW. Orientation, structural load, walkways, shade, setbacks and panel models require a professional roof survey.');
 }
 [...document.querySelectorAll('#v2-roof input')].forEach(el=>el.addEventListener('input',update));update();
}
function initCooling(){
 if(!$('v2-cooling'))return;
 function update(){
  const hours=read('v2-cooling-hours'),rate=read('v2-cooling-rate');
  if(!valid(hours,0,24)||!valid(rate,0,30))return;
  for(const [id,w] of [['fan',65],['cooler',150],['ac',1500]]){
   const units=w*Number(hours)*30/1000;
   set('v2-cooling-'+id,number(units)+' units · '+money(units*Number(rate)));
  }
 }
 ['v2-cooling-hours','v2-cooling-rate'].forEach(id=>$(id).addEventListener('input',update));update();
}
initReader();initAppliances();initComparison();initGoal();initTracker();initFinance();initRoof();initCooling();
window.GharWattV2=Object.freeze({parseBillText,compareBills,applianceUse,savingsGoal,loanEmi,sampleAppliances});
})();