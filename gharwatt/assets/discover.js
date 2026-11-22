/* GharWatt Discover: transparent household exploration, no account or default data retention. */
(function(root){
'use strict';
const $=id=>typeof document==='undefined'?null:document.getElementById(id);
const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
const num=value=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(value);
const good=(x,min,max)=>x!==null&&x!==undefined&&String(x).trim()!==''&&Number.isFinite(Number(x))&&Number(x)>=min&&Number(x)<=max;
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const APPLIANCES=Object.freeze([
 {id:'fan',name:'Ceiling fan',icon:'◉',watts:65,levels:[2,6,10],tip:'Turn it off when a room is empty. Efficient fans can help when replacement is worthwhile.'},
 {id:'led',name:'LED lights',icon:'✦',watts:9,levels:[2,5,8],tip:'Switch off lights in empty rooms. Existing LEDs are already relatively efficient.'},
 {id:'tv',name:'Television',icon:'▣',watts:80,levels:[1,3,6],tip:'Try built-in energy-saving settings and switch off when not watching.'},
 {id:'ac',name:'Air conditioner',icon:'❄',watts:1500,levels:[1,4,8],tip:'Try a comfortable temperature and clean filters. Actual inverter-AC power changes as it cycles.'},
 {id:'geyser',name:'Water heater',icon:'≈',watts:2000,levels:[.25,.5,1.5],tip:'Avoid unnecessary water heating, while following the appliance’s safety instructions.'},
 {id:'pump',name:'Water pump',icon:'◌',watts:900,levels:[.25,.5,1.5],tip:'Check leaks and running time; call a qualified technician for electrical faults.'}
]);
const CHALLENGE=Object.freeze([
 ['Switch off unused lights','Check empty rooms and switch off lights that nobody needs.'],
 ['Try a fan-use check','Turn off fans in empty rooms. Keep essential cooling comfortable.'],
 ['Check TV standby','Switch off an unused TV with the proper controls when practical.'],
 ['Use the fridge sensibly','Check the door seals and minimise unnecessary door opening. Never turn off a fridge storing perishables.'],
 ['Review cooling habits','If you use AC, clean filters and choose a comfortable setpoint. Otherwise check ventilation.'],
 ['Look for waste','Check water leaks, long-running pumps and appliances left on without purpose.'],
 ['Compare and continue','Record your next bill’s units to see if consumption improves over time.']
]);
function billSnapshot(amount,units='',period='unknown',oldDues=''){
 if(!good(amount,0,500000))return {ok:false,message:'Enter the bill amount in rupees to begin.'};
 if(String(units).trim()!==''&&!good(units,0,100000))return {ok:false,message:'Units should be a non-negative number from your bill.'};
 if(String(oldDues).trim()!==''&&!good(oldDues,0,500000))return {ok:false,message:'Check the optional previous dues amount.'};
 const a=Number(amount),u=String(units).trim()===''?null:Number(units);
 const dues=String(oldDues).trim()===''?null:Number(oldDues);
 const oldShare=dues!==null&&a>0?round(100*dues/a):null;
 const mostlyDues=oldShare!==null&&oldShare>=30;
 return {ok:true,amount:a,units:u,period:period==='monthly'?'monthly':'unknown',dues,oldShare,mostlyDues,
  perUnit:u===null||u===0?null:round(a/u),
  note:mostlyDues?'Old unpaid dues are a significant part of this amount. Do not use the total payable to estimate your electricity tariff or solar size.':
  u===null?'Your bill amount alone does not reveal your electricity consumption. You can still explore appliances and find where units appear.':
  'The total payable includes more than just energy charges. It is not the tariff per unit.'};
}
function estimateItem(id,count=1,usage='normal',watts=null){
 const a=APPLIANCES.find(x=>x.id===id);
 if(!a||!good(count,0,20)||!Number.isInteger(Number(count)))return null;
 const w=watts===null||String(watts).trim()===''?a.watts:Number(watts);
 if(!good(w,1,10000)||!['short','normal','long'].includes(usage))return null;
 const ix=usage==='short'?0:usage==='long'?2:1;
 const hours=a.levels[ix];
 return {id,name:a.name,count:Number(count),watts:w,hours,units:round(Number(count)*w*hours*30/1000),estimatedWatts:watts===null||String(watts).trim()===''};
}
function applianceSummary(selections,billedUnits=null){
 if(!Array.isArray(selections)||selections.length>APPLIANCES.length)return null;
 const ids=new Set(),items=[];let total=0;
 for(const s of selections){
  if(ids.has(s.id))return null;ids.add(s.id);
  const r=estimateItem(s.id,s.count,s.usage,s.watts);
  if(!r)return null;items.push(r);total+=r.units;
 }
 const billKnown=good(billedUnits,0,100000);
 const billed=billKnown?Number(billedUnits):null;
 return {items,units:round(total),billedUnits:billed,difference:billed===null?null:round(billed-total),
  exceedsBill:billed!==null&&total>billed*1.15,
  explanation:billed===null?'Estimated appliance units only. Your bill usage is unknown.':
   total>billed*1.15?'Your selected appliance estimates exceed the billed units. Check assumed hours, wattages, counts and billing-period length.':
   'This is a partial estimate for selected appliances, not a measured breakdown of your bill.'};
}
function compareBills(previous,current){
 if(!previous||!current||!good(previous.amount,0,500000)||!good(current.amount,0,500000))return null;
 const uKnown=good(previous.units,0,100000)&&good(current.units,0,100000);
 const daysKnown=good(previous.days,1,120)&&good(current.days,1,120);
 const amountChange=round(Number(current.amount)-Number(previous.amount));
 const unitChange=uKnown?round(Number(current.units)-Number(previous.units)):null;
 const dailyUnitsChange=uKnown&&daysKnown?round(Number(current.units)/Number(current.days)-Number(previous.units)/Number(previous.days)):null;
 return {amountChange,unitChange,dailyUnitsChange,
  explanation:!uKnown?'The amount changed, but without both sets of units we cannot tell whether consumption changed.':
   !daysKnown?'Units changed, but billing period lengths are unknown. More days could partly explain the difference.':
   dailyUnitsChange>0?'Average daily electricity usage increased; charges, arrears and tariffs can also affect the bill.':
   dailyUnitsChange<0?'Average daily electricity usage decreased; a higher bill may reflect non-energy charges, slabs or arrears.':
   'Average daily usage was similar. Check fixed charges, arrears, credits, slabs and tariffs.'};
}
function compareDevices(oldW,newW,hours,days=30,rate=8,priceDifference=''){
 if(![oldW,newW,hours,days,rate].every((n,i)=>good(n,[1,1,0,1,.5][i],[5000,5000,24,366,30][i])))return null;
 if(String(priceDifference).trim()!==''&&!good(priceDifference,0,1000000))return null;
 const savedUnits=round(Math.max(0,Number(oldW)-Number(newW))*Number(hours)*Number(days)/1000);
 const savedRupees=round(savedUnits*Number(rate));
 const cost=String(priceDifference).trim()===''?null:Number(priceDifference);
 return {savedUnits,savedRupees,priceDifference:cost,
  paybackMonths:cost===null||savedRupees<=0?null:round(cost/savedRupees),
  note:'Illustrative power draw, hours and savings rate. Not live product specifications or a confirmed tariff.'};
}
function challengeCount(done){return Array.isArray(done)?done.filter(Boolean).length:0;}
root.GharWattDiscover=Object.freeze({APPLIANCES,CHALLENGE,billSnapshot,estimateItem,applianceSummary,compareBills,compareDevices,challengeCount});
if(!$('gw-discover'))return;
const state={snapshot:null,selected:new Map(),challenge:Array(CHALLENGE.length).fill(false),answers:new Map(),saved:false};
const storage=(()=>{try{return root.localStorage}catch{return null}})(),session=(()=>{try{return root.sessionStorage}catch{return null}})();
const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
const show=(id,visible)=>{const e=$(id);if(e)e.hidden=!visible};
const focus=target=>$(target)?.scrollIntoView({behavior:'smooth',block:'start'});
const details=x=>{const e=$(x);if(e)e.open=true};
const formFields=()=>({
 amount:$('gw-bill-amount').value,units:$('gw-bill-units').value,
 period:$('gw-bill-period').value,oldDues:$('gw-old-dues').value
});
function summarize(){
 const s=billSnapshot(...Object.values(formFields()));
 if(!s.ok){set('gw-bill-status',s.message);return;}
 state.snapshot=s;
 set('gw-current-money',money(s.amount));
 set('gw-current-units',s.units===null?'Not entered':num(s.units)+' units');
 set('gw-bill-meaning',s.note);
 set('gw-bill-average',s.perUnit===null?'Your consumption units are needed for an average.':
  'Bill amount ÷ units = '+money(s.perUnit)+' per unit. This is NOT your electricity tariff.');
 set('gw-home-low',s.period==='monthly'&&s.units!==null&&s.units<=60?
  'Your stated monthly usage is relatively low in absolute units. Large appliance purchases may have limited payback; start with free habits.':'Explore your appliances, charges and monthly history before making a purchase.');
 show('gw-bill-result',true);
 show('gw-share-options',true);
 set('gw-bill-status','Your numbers are ready. Nothing was automatically uploaded or saved.');
 state.selected.size&&renderEstimate();
 focus('gw-bill-result');
}
$('gw-bill-start').addEventListener('click',summarize);
function addProgressMessage(message){set('gw-journey-status',message);}
function renderEstimate(){
 const selections=[...state.selected.values()];
 const estimate=applianceSummary(selections,state.snapshot?.units??null);
 const box=$('gw-appliance-result');box.replaceChildren();
 if(!estimate||!selections.length){box.textContent='Tap appliances you actually use to see illustrative energy consumption. No watts required.';return;}
 const head=document.createElement('p');head.className='gw-estimate-head';head.textContent='Selected appliances: about '+num(estimate.units)+' units in 30 days.';box.append(head);
 const p=document.createElement('p');p.textContent=estimate.explanation;box.append(p);
 if(state.snapshot?.period!=='monthly'){const note=document.createElement('p');note.textContent='Monthly estimate assumes 30 days. To compare it fairly with a bill, select a roughly one-month bill period above.';box.append(note);}
 const list=document.createElement('ul');list.className='gw-estimate-list';
 for(const x of estimate.items){const li=document.createElement('li');li.textContent=x.name+': '+num(x.units)+' units (1 device uses '+x.watts+' W at '+x.hours+' h/day; count '+x.count+').';list.append(li);}
 box.append(list);
}
const grid=$('gw-appliance-grid');
for(const item of APPLIANCES){
 const card=document.createElement('article');card.className='gw-choose-card';
 const top=document.createElement('button');top.type='button';top.className='gw-appliance-toggle';top.setAttribute('aria-pressed','false');
 top.innerHTML='<span class="gw-card-symbol" aria-hidden="true"></span><span class="gw-appliance-name"></span><span class="gw-choose-label">Add +</span>';
 top.querySelector('.gw-card-symbol').textContent=item.icon;
 top.querySelector('.gw-appliance-name').textContent=item.name;
 const explain=document.createElement('p');explain.textContent='Suggested '+item.watts+' W · adjustable';card.append(top,explain);
 const options=document.createElement('div');options.hidden=true;options.className='gw-appliance-options';
 const select=document.createElement('select');select.setAttribute('aria-label','Approximate daily use of '+item.name);
 ['short','normal','long'].forEach((key,i)=>{const o=document.createElement('option');o.value=key;o.textContent=['Short','Regular','Long'][i]+' · '+item.levels[i]+' hours/day';if(i===1)o.selected=true;select.append(o)});
 const advanced=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Adjust device count or watts (optional)';advanced.append(summary);
 const fields=document.createElement('div');fields.className='gw-advanced-pair';
 const countL=document.createElement('label');countL.textContent='How many';const count=document.createElement('input');count.type='number';count.min='1';count.max='20';count.step='1';count.inputMode='numeric';count.value='1';countL.append(count);
 const wattL=document.createElement('label');wattL.textContent='Watts per device';const watts=document.createElement('input');watts.type='number';watts.min='1';watts.max='10000';watts.step='1';watts.inputMode='numeric';watts.value=item.watts;wattL.append(watts);fields.append(countL,wattL);advanced.append(fields);
 const hint=document.createElement('p');hint.textContent=item.tip;options.append(select,advanced,hint);card.append(options);
 function update(){
  const choice={id:item.id,count:count.value,usage:select.value,watts:watts.value};
  const valid=estimateItem(choice.id,choice.count,choice.usage,choice.watts);
  if(!valid){set('gw-appliance-status','Check the optional count, watts or usage assumptions for '+item.name+'.');return;}
  state.selected.set(item.id,choice);renderEstimate();
  set('gw-appliance-status','These are estimates, not readings from your meter. You can correct the assumptions anytime.');
 }
 top.addEventListener('click',()=>{
  if(state.selected.has(item.id)){state.selected.delete(item.id);options.hidden=true;top.setAttribute('aria-pressed','false');top.querySelector('.gw-choose-label').textContent='Add +'}
  else{state.selected.set(item.id,{id:item.id,count:count.value,watts:watts.value,usage:select.value});options.hidden=false;top.setAttribute('aria-pressed','true');top.querySelector('.gw-choose-label').textContent='Selected ✓'}
  renderEstimate();
 });
 [count,watts,select].forEach(e=>e.addEventListener('input',update));
 grid.append(card);
}
function detective(){
 if(!state.snapshot){set('gw-compare-output','Enter your current bill at the top first.');return;}
 const oldAmount=$('gw-previous-money').value,oldUnits=$('gw-previous-units').value;
 const r=compareBills({amount:oldAmount,units:oldUnits,days:$('gw-prev-days').value},
  {amount:state.snapshot.amount,units:state.snapshot.units,days:$('gw-now-days').value});
 if(!r){set('gw-compare-output','Enter a valid previous bill amount, then compare.');return;}
 const fmt=n=>(n>=0?'+':'')+money(n);
 set('gw-compare-output','Bill amount changed by '+fmt(r.amountChange)+'. '+
  (r.unitChange===null?'No usage comparison available.':'Units changed by '+(r.unitChange>=0?'+':'')+num(r.unitChange)+'. ')+r.explanation);
}
$('gw-compare-now').addEventListener('click',detective);
function compareProduct(){
 const mode=$('gw-compare-choice').value;
 const presets={fan:[70,35,8],bulb:[60,9,5],tv:[100,70,4]};
 const [oldW,newW,hours]=presets[mode]||presets.fan;
 const customHours=$('gw-product-hours').value;
 const rate=$('gw-product-rate').value;
 const price=$('gw-price-extra').value;
 const res=compareDevices(oldW,newW,customHours||hours,30,rate,price);
 if(!res){set('gw-product-result','Check the hours, assumed rate and optional additional purchase price.');return;}
 set('gw-product-result','Example: '+oldW+' W versus '+newW+' W, used '+(customHours||hours)+' hours/day. Difference: '+num(res.savedUnits)+' units/month; illustrative variable energy cost difference '+money(res.savedRupees)+'/month.'+
  (res.paybackMonths!==null?' At the entered extra price, simple payback is about '+num(res.paybackMonths)+' months, excluding repairs and financing.':' Enter an actual extra purchase price to estimate simple payback.')+
  ' '+res.note+' Compare verified product labels before buying.');
}
$('gw-product-run').addEventListener('click',compareProduct);
$('gw-compare-choice').addEventListener('change',()=>{
 const item={fan:8,bulb:5,tv:4};$('gw-product-hours').value=item[$('gw-compare-choice').value];
});
const myths=[
 {q:'Does dividing your total bill by units always give your official tariff?',options:['Yes','No'],answer:1,explanation:'No. Fixed charges, taxes, arrears and credits can change the amount payable.'},
 {q:'A 10-watt LED running 5 hours a day for 30 days uses 1.5 units.',options:['True','False'],answer:0,explanation:'Correct: 10 × 5 × 30 ÷ 1000 = 1.5 kWh (units).'},
 {q:'Should you replace a working fan solely because a new fan has a higher efficiency rating?',options:['Yes, always','Compare total costs first'],answer:1,explanation:'Compare energy use, actual operating hours, price and payback before replacing working equipment.'}
];
let questionIndex=0;
function showMyth(){
 const m=myths[questionIndex];set('gw-myth-number','Question '+(questionIndex+1)+' of '+myths.length);
 set('gw-myth-question',m.q);
 const opts=$('gw-myth-options');opts.replaceChildren();set('gw-myth-answer','');
 for(let i=0;i<m.options.length;i++){
  const b=document.createElement('button');b.type='button';b.className='gw-choice-pill';b.textContent=m.options[i];
  b.addEventListener('click',()=>{
   set('gw-myth-answer',(i===m.answer?'Correct. ':'Not quite. ')+m.explanation);
   [...opts.children].forEach(el=>el.disabled=true);
   $('gw-myth-next').hidden=false;
  });opts.append(b);
 }
 $('gw-myth-next').hidden=true;
}
$('gw-myth-next').addEventListener('click',()=>{questionIndex=(questionIndex+1)%myths.length;showMyth()});showMyth();
function showChallenge(){
 const box=$('gw-challenge-list');box.replaceChildren();
 CHALLENGE.forEach(([name,description],i)=>{
  const label=document.createElement('label');label.className='gw-challenge-day';
  const check=document.createElement('input');check.type='checkbox';check.checked=Boolean(state.challenge[i]);
  check.addEventListener('change',()=>{state.challenge[i]=check.checked;set('gw-challenge-status','Progress not saved. Select the opt-in option below to keep it on this device.');set('gw-challenge-count',challengeCount(state.challenge)+' / 7 days marked complete.')});
  const detail=document.createElement('span');const strong=document.createElement('strong');strong.textContent='Day '+(i+1)+' · '+name;
  const small=document.createElement('small');small.textContent=description;detail.append(strong,small);
  label.append(check,detail);box.append(label);
 });
 set('gw-challenge-count',challengeCount(state.challenge)+' / 7 days marked complete.');
}
try{const stored=JSON.parse(storage?.getItem('gharwatt:challenge-v1')||'null');if(Array.isArray(stored)&&stored.length===7&&stored.every(x=>typeof x==='boolean')){state.challenge=stored;state.saved=true;}}
catch{}
showChallenge();
$('gw-challenge-save').addEventListener('click',()=>{
 if(!$('gw-challenge-consent').checked){set('gw-challenge-status','Tick the consent box before saving progress locally.');return;}
 try{storage?.setItem('gharwatt:challenge-v1',JSON.stringify(state.challenge));set('gw-challenge-status','Saved on this device. No account or server upload.');}
 catch{set('gw-challenge-status','Browser storage unavailable. Your checkmarks will disappear after reloading.');}
});
$('gw-challenge-clear').addEventListener('click',()=>{
 state.challenge=Array(7).fill(false);
 try{storage?.removeItem('gharwatt:challenge-v1')}catch{}
 showChallenge();$('gw-challenge-consent').checked=false;
 set('gw-challenge-status','Challenge progress cleared on this device.');
});
const langCopy={
 en:{title:'Understand your electricity bill in two numbers',lead:'Enter the amount and units you already know. Explore without an account.',start:'Show my electricity snapshot',guide:'More detailed advice is available in English. Telugu and Hindi introductory guides are linked below.'},
 te:{title:'రెండు సంఖ్యలతో మీ కరెంటు బిల్లును అర్థం చేసుకోండి',lead:'బిల్లు మొత్తం, వినియోగించిన యూనిట్లు నమోదు చేయండి. ఖాతా అవసరం లేదు.',start:'నా బిల్లు వివరాలు చూపించు',guide:'వివరమైన సాధనాలు ప్రస్తుతం ఆంగ్లంలో ఉన్నాయి. తెలుగు మార్గదర్శిని కింద అందుబాటులో ఉంది.'},
 hi:{title:'दो संख्याओं से अपना बिजली बिल समझें',lead:'बिल की राशि और इस्तेमाल की गई यूनिट दर्ज करें। खाता जरूरी नहीं है।',start:'मेरे बिल का सार दिखाएँ',guide:'विस्तृत टूल अभी अंग्रेज़ी में हैं। नीचे हिंदी मार्गदर्शिका उपलब्ध है।'}
};
$('gw-language').addEventListener('change',()=>{
 const copy=langCopy[$('gw-language').value]||langCopy.en;
 set('gw-discover-title',copy.title);set('gw-discover-lead',copy.lead);
 set('gw-bill-start',copy.start);set('gw-language-note',copy.guide);
});
function updateTrackerPreview(){
 try{
  const rows=JSON.parse(storage?.getItem('gharwatt:monthly-electricity-v2')||'[]');
  if(!Array.isArray(rows)||!rows.length){set('gw-track-preview','No bill history saved on this device yet. Add a month only if you choose to.');return;}
  const safe=rows.filter(x=>/^\d{4}-(?:0[1-9]|1[0-2])$/.test(x.month)&&good(x.amount,0,500000)).sort((a,b)=>a.month.localeCompare(b.month));
  const last=safe.at(-1),prev=safe.at(-2);
  if(!last)return;
  set('gw-track-preview','Last saved: '+last.month+' · '+money(last.amount)+
   (last.units!==null&&good(last.units,0,100000)?' · '+num(last.units)+' units':'')+
   (prev&&good(last.units,0,100000)&&good(prev.units,0,100000)?
    '. Compared with '+prev.month+': '+num(Number(last.units)-Number(prev.units))+' units (different billing periods may affect comparison).':''));
 }catch{set('gw-track-preview','Stored history could not be read. Open the tracker to review or clear it.');}
}
updateTrackerPreview();
$('gw-send-tracker').addEventListener('click',()=>{
 if(!state.snapshot){set('gw-track-note','Enter a bill amount above before copying details.');return;}
 const s=state.snapshot;
 try{session?.setItem('gharwatt:tracker-prefill-v1',JSON.stringify({amount:s.amount,units:s.units,createdAt:Date.now()}));}catch{}
 root.location.href='../monthly-tracker/';
});
function updateSolar(){
 const s=state.snapshot;
 set('gw-solar-guidance',!s||s.units===null?'Enter your consumption units to begin a solar discussion. We will not recommend a system from bill amount alone.':
  s.period!=='monthly'?'Your billing period is unknown. Confirm the number of months and your tariff before sizing solar.':
  s.units<=60?'At this low stated monthly consumption, start with free efficiency measures. Solar may not offer an attractive payback after fixed costs; compare quotes before deciding.':
  'You can explore solar, but proper sizing depends on monthly/annual kWh, roof, shade, costs, tariffs, export rules and eligibility.');
}
$('gw-bill-start').addEventListener('click',updateSolar);
updateSolar();
})(window);