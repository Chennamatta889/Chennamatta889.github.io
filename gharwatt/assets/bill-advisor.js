/* GharWatt Smart Bill Advisor: private, opt-in, deterministic household estimates. */
(function(root){
'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const nfmt=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(n);
const numeric=(v,min,max)=>String(v??'').trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const chargeTypes=Object.freeze([
 {id:'energy',label:'Energy charges',rx:/^(?:current\s+)?(?:energy|electricity|consumption|unit)\s+(?:charges?|cost|amount)\b/i,explain:'The amount charged for electricity consumed, usually using tariff slabs.'},
 {id:'fixed',label:'Fixed / service charges',rx:/^(?:fixed|customer|service|demand)\s+(?:charges?|fee)\b/i,explain:'Charges that may apply even when electricity use is low.'},
 {id:'tax',label:'Taxes / duty',rx:/^(?:electricity\s+duty|duty|tax(?:es)?|surcharge)\b/i,explain:'Taxes, duties or surcharges shown on the bill.'},
 {id:'arrears',label:'Previous dues',rx:/^(?:arrears?|previous\s+(?:balance|dues?)|outstanding\s+dues?)\b/i,explain:'Unpaid balance carried forward; not necessarily this month’s consumption.'},
 {id:'rebate',label:'Rebates / credits',rx:/^(?:rebate|subsidy|discount|bill\s+credit|government\s+credit)\b/i,explain:'Reductions or credits applied to the amount payable.'}
]);
function parseCharges(raw){
 const lines=String(raw||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,500);
 const out={energy:null,fixed:null,tax:null,arrears:null,rebate:null};
 for(const line of lines){
  for(const t of chargeTypes){
   if(out[t.id]!==null||!t.rx.test(line))continue;
   // Require a plausible amount after the label, never infer from account IDs or dates.
   const after=line.replace(t.rx,'').replace(/^\s*(?::|-|–|=)\s*/,'');
   const amounts=[...after.matchAll(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{2,3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/gi)].map(x=>Number(x[1].replace(/,/g,'')));
   const v=amounts.at(-1);
   if(numeric(v,0,500000))out[t.id]=v;
  }
 }
 return out;
}
function explainBill(bill,charges={}){
 if(!bill||!numeric(bill.amount,0,500000)||!numeric(bill.days,1,120))return null;
 const amount=Number(bill.amount),days=Number(bill.days);
 const units=numeric(bill.units,0.01,100000)?Number(bill.units):null;
 const found=chargeTypes.filter(t=>numeric(charges[t.id],0,500000));
 let explained=null,remainder=null;
 if(found.length){
  explained=found.reduce((acc,t)=>acc+Number(charges[t.id])*(t.id==='rebate'?-1:1),0);
  remainder=round(amount-explained);
 }
 return {amount,days,units,amountDaily:round(amount/days),unitsDaily:units===null?null:round(units/days),
  allInclusivePerUnit:units===null?null:round(amount/units),explained:explained===null?null:round(explained),
  remainder,breakdown:found.map(t=>({id:t.id,label:t.label,amount:Number(charges[t.id]),explain:t.explain}))};
}
function comparePeriods(prev,curr){
 if(!prev||!curr||![prev.amount,curr.amount].every(x=>numeric(x,0,500000))||![prev.days,curr.days].every(x=>numeric(x,1,120)))return null;
 const before=Number(prev.amount),after=Number(curr.amount);
 const dayBefore=before/Number(prev.days),dayAfter=after/Number(curr.days);
 const unitsKnown=numeric(prev.units,0,100000)&&numeric(curr.units,0,100000);
 const dailyBefore=unitsKnown?Number(prev.units)/Number(prev.days):null;
 const dailyAfter=unitsKnown?Number(curr.units)/Number(curr.days):null;
 let note;
 if(unitsKnown){
  const dailyDelta=dailyAfter-dailyBefore;
  if(dailyDelta>0.05)note='Daily electricity consumption increased. That can contribute to a higher bill, but other charges and tariff slabs may also affect it.';
  else if(dailyDelta<-.05)note='Daily electricity consumption decreased. If the bill rose, review fixed charges, tariff slabs, arrears, credits and period length.';
  else note='Daily electricity consumption was similar. Changes in billed days and non-energy charges may help explain the difference.';
 }else note='Units are missing from one bill, so we cannot establish whether electricity consumption changed.';
 if(Number(prev.days)!==Number(curr.days))note+=' The billing periods have different numbers of days, so compare daily averages rather than totals alone.';
 return {rupeeDelta:round(after-before),dailyRupeeDelta:round(dayAfter-dayBefore),
  dailyUnitsBefore:dailyBefore===null?null:round(dailyBefore),
  dailyUnitsAfter:dailyAfter===null?null:round(dailyAfter),
  dailyUnitsDelta:dailyBefore===null?null:round(dailyAfter-dailyBefore),
  unitsKnown,note};
}
function scenario(rows,rate,days=30){
 if(!Array.isArray(rows)||rows.length>20||!numeric(rate,.5,30)||!numeric(days,1,366))return null;
 const items=[];let totalUnits=0,totalSaved=0;
 for(const row of rows){
  if(!row||!numeric(row.count,0,30)||!Number.isInteger(Number(row.count))||!numeric(row.watts,1,10000)||!numeric(row.hours,0,24)||!numeric(row.reduce,0,24)||Number(row.reduce)>Number(row.hours))return null;
  const count=Number(row.count);if(!count)continue;
  const base=count*Number(row.watts)*Number(row.hours)*Number(days)/1000;
  const saved=count*Number(row.watts)*Number(row.reduce)*Number(days)/1000;
  totalUnits+=base;totalSaved+=saved;
  items.push({name:String(row.name||'Appliance').slice(0,65),baseline:round(base),savedUnits:round(saved),savedRupees:round(saved*Number(rate)),hoursReduced:Number(row.reduce)});
 }
 items.sort((a,b)=>b.savedUnits-a.savedUnits);
 return {baselineUnits:round(totalUnits),savedUnits:round(totalSaved),savedRupees:round(totalSaved*Number(rate)),rate:Number(rate),days:Number(days),items};
}
const presets=Object.freeze([
 {id:'fan',name:'Ceiling fans',watts:65,hours:10,reduce:1,tip:'Consider lowering running time only when comfortable and safe.'},
 {id:'ac',name:'Air conditioner',watts:1500,hours:5,reduce:1,tip:'Try a comfortable thermostat setting, fan assistance, shading or shorter AC runtime.'},
 {id:'led',name:'LED lights',watts:9,hours:6,reduce:1,tip:'Switch off lights in empty rooms and choose efficient LEDs.'},
 {id:'geyser',name:'Water heater',watts:2000,hours:1,reduce:.25,tip:'Avoid leaving a water heater on unnecessarily; follow electrical safety guidance.'},
 {id:'tv',name:'Television',watts:80,hours:4,reduce:1,tip:'Switch off unused screens and avoid unnecessary standby time.'},
 {id:'pump',name:'Water pump',watts:900,hours:1,reduce:.25,tip:'Check for leaks and use appropriate automatic shutoff controls.'}
]);
function buildReport(bill,comparison,plan,goal,charges){
 const lines=['GHARWATT INDIA — HOUSEHOLD ELECTRICITY ACTION REPORT','Generated locally on your device. No upload or account.',''];
 if(bill){
  lines.push('VERIFIED BILL: '+money(bill.amount)+' over '+bill.days+' days');
  lines.push('Electricity units: '+(bill.units===null?'Not provided':nfmt(bill.units)+' kWh'));
  lines.push('Bill per day: '+money(bill.amountDaily));
  if(bill.allInclusivePerUnit!==null)lines.push('All-inclusive amount / unit: '+money(bill.allInclusivePerUnit)+' (NOT your tariff)');
  if(charges?.length){lines.push('Charge details (user checked):');charges.forEach(x=>lines.push(' - '+x.label+': '+money(x.amount)));}
  if(bill.remainder!==null)lines.push('Remaining amount not explained by selected line items: '+money(bill.remainder));
 }else lines.push('No bill verified.');
 if(comparison){lines.push('','BILL COMPARISON','Difference: '+money(comparison.rupeeDelta),'Daily amount difference: '+money(comparison.dailyRupeeDelta),comparison.note);}
 if(plan){
  lines.push('','APPLIANCE SAVINGS SCENARIO','Selected appliance use: '+nfmt(plan.baselineUnits)+' kWh in a 30-day month','Possible reduction: '+nfmt(plan.savedUnits)+' kWh / '+money(plan.savedRupees)+' at illustrative ₹'+plan.rate+'/kWh');
  plan.items.forEach(x=>lines.push(' - '+x.name+': '+nfmt(x.savedUnits)+' kWh, '+money(x.savedRupees)+' with '+x.hoursReduced+' fewer hours/day'));
  if(goal>0)lines.push('Your monthly savings target: '+money(goal)+(plan.savedRupees>=goal?' (scenario meets target)':' (scenario does not yet meet target)'));
 }
 lines.push('','ESTIMATE ONLY — not a guarantee or official tariff. Electricity use and costs vary by appliance cycling, actual power draw, slabs, fixed charges, time and household habits.','Do not reduce essential cooling, safety equipment or necessary consumption.','https://chennamatta889.github.io/gharwatt/bill-reader/');
 return lines.join('\n');
}
root.GharWattAdvisor=Object.freeze({parseCharges,explainBill,comparePeriods,scenario,presets,buildReport});
if(typeof document==='undefined'||!$('gw-advisor'))return;
let verified=null,comparison=null,plan=null;
const status=$('gw-advisor-status'),reportNode=$('gw-advisor-report'),actions=$('gw-advisor-actions');
const msg=text=>{status.textContent=text;};
const input=id=>$(id)?.value??'';
const text=(id,value)=>{const el=$(id);if(el)el.textContent=value;};
const selectedCharges=()=>Object.fromEntries(chargeTypes.map(t=>[t.id,input('gw-charge-'+t.id)]));
function reportText(){return buildReport(verified,comparison,plan,Number(input('gw-saving-goal'))||0,verified?.breakdown)}
function updateReport(){reportNode.textContent=reportText();}
function showBreakdown(){
 const raw=parseCharges(input('v2-ocr-text'));
 for(const t of chargeTypes){const el=$('gw-charge-'+t.id);if(raw[t.id]!==null&&!el.dataset.edited)el.value=raw[t.id];}
}
function renderBill(){
 if(!verified)return;
 const checked=explainBill(verified,selectedCharges());if(!checked)return;
 verified=checked;
 text('gw-bill-per-day',money(checked.amountDaily));
 text('gw-units-per-day',checked.unitsDaily===null?'Unknown':nfmt(checked.unitsDaily)+' units');
 text('gw-all-in-rate',checked.allInclusivePerUnit===null?'Unknown':money(checked.allInclusivePerUnit)+'/unit');
 text('gw-remainder',checked.remainder===null?'Add line items to check':money(checked.remainder));
 $('gw-advisor-content').hidden=false;actions.hidden=false;updateReport();
}
function renderComparison(){
 if(!verified)return;
 const prev={amount:input('gw-prev-amount'),units:input('gw-prev-units'),days:input('gw-prev-days')};
 if(!numeric(prev.amount,0,500000)||!numeric(prev.days,1,120)){
  comparison=null;text('gw-comparison-result','Enter your previous bill amount and days to compare. Units are optional.');updateReport();return;
 }
 comparison=comparePeriods(prev,verified);
 text('gw-comparison-result','Amount change: '+money(comparison.rupeeDelta)+'; per-day amount change: '+money(comparison.dailyRupeeDelta)+'. '+(comparison.unitsKnown?'Daily usage: '+nfmt(comparison.dailyUnitsBefore)+' → '+nfmt(comparison.dailyUnitsAfter)+' units. ':'')+comparison.note);
 updateReport();
}
const applianceBox=$('gw-appliance-rows');
presets.forEach(p=>{
 const card=document.createElement('article');card.className='gw-appliance-card';card.dataset.name=p.name;
 const h=document.createElement('h4');h.textContent=p.name;card.append(h);
 const fields=[['count','How many?',0,0,30,1],['watts','Power (W)',p.watts,1,10000,1],['hours','Hours/day',p.hours,0,24,.25],['reduce','Reduce by hours/day',p.reduce,0,24,.25]];
 const area=document.createElement('div');area.className='gw-appliance-fields';
 fields.forEach(([key,label,value,min,max,step])=>{
  const wrap=document.createElement('label');wrap.textContent=label;
  const el=document.createElement('input');el.type='number';el.inputMode='decimal';el.dataset.field=key;el.value=value;el.min=min;el.max=max;el.step=step;el.addEventListener('input',()=>{plan=null;text('gw-plan-result','Update your plan to recalculate your estimate.');});
  wrap.append(el);area.append(wrap);
 });
 const help=document.createElement('p');help.textContent=p.tip;card.append(area,help);applianceBox.append(card);
});
function calculatePlan(){
 if(!verified){msg('First verify your bill so the results reflect your household.');return;}
 const rows=[...applianceBox.querySelectorAll('.gw-appliance-card')].map(c=>Object.fromEntries([['name',c.dataset.name],...[...c.querySelectorAll('input')].map(x=>[x.dataset.field,x.value])]));
 const r=scenario(rows,input('gw-saving-rate'),30);
 if(!r){plan=null;text('gw-plan-result','Check appliance counts, wattages, hours and your example unit rate. Reductions cannot exceed existing usage.');return;}
 if(r.items.length===0){plan=null;text('gw-plan-result','Set How many? above 0 for the appliances actually in your home.');return;}
 plan=r;
 const goal=Number(input('gw-saving-goal'))||0;
 text('gw-plan-result','Selected appliances: '+nfmt(r.baselineUnits)+' units/month. If you reduce the hours as entered, the illustrative reduction is '+nfmt(r.savedUnits)+' units or '+money(r.savedRupees)+' per month at ₹'+r.rate+'/unit.'+
 (goal>0?' Target: '+money(goal)+(r.savedRupees>=goal?' — estimated scenario meets it.':' — estimated scenario falls short.'):'')+
 ' Savings are not guaranteed: real power draw and tariff slabs vary.');
 const tips=$('gw-plan-tips');tips.replaceChildren();
 for(const row of r.items.filter(x=>x.savedUnits>0).slice(0,6)){
  const p=document.createElement('li');p.textContent=row.name+': '+nfmt(row.savedUnits)+' units/month — '+money(row.savedRupees)+' illustrative reduction.';tips.append(p);
 }
 updateReport();
}
$('gw-plan-calculate').addEventListener('click',calculatePlan);
for(const t of chargeTypes){
 const inputEl=$('gw-charge-'+t.id);
 inputEl.addEventListener('input',()=>{inputEl.dataset.edited='true';renderBill()});
}
['gw-prev-amount','gw-prev-units','gw-prev-days'].forEach(id=>$(id).addEventListener('input',renderComparison));
window.addEventListener('gharwatt:bill-confirmed',event=>{
 const detail=event.detail||{};
 const oldDays=detail.days;
 const data={amount:detail.amount,units:detail.units,days:oldDays};
 verified=explainBill(data,{});
 if(!verified){msg('Confirm an amount and valid billing days first.');return;}
 for(const t of chargeTypes){$('gw-charge-'+t.id).value='';delete $('gw-charge-'+t.id).dataset.edited;}
 showBreakdown();
 renderBill();renderComparison();
 msg('Your bill details are verified for this session. Review optional charge fields, compare bills, then build a personal plan.');
 $('gw-advisor').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});
$('gw-copy-report').addEventListener('click',async()=>{
 if(!verified)return;
 try{await navigator.clipboard.writeText(reportText());msg('Report copied. Only share it with people you trust.');}
 catch{msg('Copy was unavailable. Use Download report instead.');}
});
$('gw-download-report').addEventListener('click',()=>{
 if(!verified)return;
 const url=URL.createObjectURL(new Blob([reportText()],{type:'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='gharwatt-bill-savings-report.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 msg('Report downloaded on your device.');
});
$('gw-print-report').addEventListener('click',()=>{if(!verified)return;updateReport();window.print();});
window.addEventListener('gharwatt:bill-clear',()=>{$('gw-advisor-reset').click();});
$('gw-advisor-reset').addEventListener('click',()=>{
 verified=null;comparison=null;plan=null;['gw-prev-amount','gw-prev-units'].forEach(id=>$(id).value='');
 for(const t of chargeTypes){$('gw-charge-'+t.id).value='';delete $('gw-charge-'+t.id).dataset.edited;}
 for(const c of applianceBox.children)c.querySelector('[data-field=count]').value='0';
 $('gw-advisor-content').hidden=true;actions.hidden=true;text('gw-plan-result','Choose how many appliances you use, then build a scenario.');msg('Advisor cleared. The page does not save your bill information.');
});
})(window);
