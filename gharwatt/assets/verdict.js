/* GharWatt Verdict: independent, deterministic decisions. NOT a generative-AI model.
   No telemetry, backend, network requests, storage or user identifiers. */
(function(root){
'use strict';
const good=(v,min,max)=>v!==null&&v!==undefined&&typeof v!=='boolean'&&String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const money=x=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(x);
const number=x=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(x);
function verdict(input={}){
 const amount=good(input.amount,0,500000)?Number(input.amount):null;
 const units=good(input.units,0,100000)?Number(input.units):null;
 const monthly=input.period==='monthly';
 const arrears=good(input.arrears,0,500000)?Number(input.arrears):null;
 const home=['own','rent','unknown'].includes(input.home)?input.home:'unknown';
 const roof=['yes','no','unknown'].includes(input.roof)?input.roof:'unknown';
 if(amount===null)return {key:'enter-bill',title:'Start with your electricity bill',reason:'Enter the amount on your bill to get an initial explanation.',steps:['Enter bill amount','Add units if available'],caution:'No electricity usage or tariff can be determined without supporting bill details.',confidence:'Needs your bill'};
 if(arrears!==null&&amount>0&&arrears/amount>=.3){
  return {key:'arrears',title:'Check previous unpaid charges first',reason:'Old dues are a large share of your bill ('+Math.round(arrears/amount*100)+'%). This does not mean you consumed that amount of electricity this month.',steps:['Review previous dues and interest on your bill','Check current charges separately','Add your consumption units before exploring solar'],caution:'Never size solar or calculate an electricity tariff from a payable amount dominated by arrears.',confidence:'Preliminary: based on the old-dues amount you entered'};
 }
 if(units===null){
  return {key:'need-units',title:'Find your electricity units',reason:'Your payable amount alone cannot tell us how much energy your home used.',steps:['Find “Units Consumed” or “kWh” on the bill','Try free energy-saving habits meanwhile','Review fixed charges and any arrears'],caution:'We cannot estimate appliance shares, solar size or energy savings from ₹ amount alone.',confidence:'Needs consumption details'};
 }
 if(!monthly){
  return {key:'check-period',title:'Confirm how many days the bill covers',reason:'You entered '+number(units)+' units, but we do not know whether they represent roughly one month. Long billing periods change the advice.',steps:['Confirm whether your bill is for approximately one month','Review current charges separately from previous dues','Explore appliances using clearly stated assumptions'],caution:'No monthly usage category or solar recommendation is assigned until the period is confirmed.',confidence:'Needs billing period'};
 }
 if(units<=60){
  return {key:'free-first',title:'Start with free habits—no big purchase yet',reason:'At '+number(units)+' units in about one month, your stated usage is low in absolute terms. An expensive upgrade or rooftop solar may have a long payback.',steps:['Check for avoidable running time and unnecessary lights','Keep your existing equipment unless a verified upgrade pays back','Compare your next bill before spending money'],caution:'This is not proof your bill is correct, or that solar can never make sense. Tariffs, roof conditions and household needs matter.',confidence:'Preliminary: usage-based guidance'};
 }
 if(units<=200){
  return {key:'habits-and-upgrades',title:'Try free changes before buying anything',reason:'Your stated monthly usage gives room to explore appliance habits, but exact savings depend on equipment and actual hours.',steps:['Review AC, water heating, fans and other high-use appliances you own','Check a replacement only when the old and new power draw and extra price are known','Compare the next bill before committing to expensive upgrades'],caution:'Do not assume that every selected appliance runs at its nameplate watts continuously.',confidence:'Preliminary: usage-based guidance'};
 }
 if(home==='rent'||roof==='no'){
  return {key:'efficiency-first',title:'Compare efficiency upgrades and low-cost changes',reason:'At '+number(units)+' monthly units, reducing energy use could matter, but your housing or roof selection makes rooftop solar less straightforward.',steps:['Identify appliances using the most energy','Compare the true cost and payback of efficient replacements','Ask the property owner before considering rooftop changes'],caution:'Solar may still be possible under specific arrangements, but we cannot assume an eligible roof.',confidence:'Preliminary: housing and usage guidance'};
 }
 if(home==='own'&&roof==='yes'){
  return {key:'compare-roof',title:'Compare savings, upgrades and a real solar quotation',reason:'At '+number(units)+' units in about one month, it may be useful to explore solar alongside lower-cost options because you indicated an owned home and an available roof.',steps:['Start with free consumption reductions','Check payback of existing-appliance replacements','Obtain written solar quotes and verify generation, subsidy, tariff and roof details'],caution:'This is not a recommendation to purchase solar; no system cost, output or subsidy has been verified.',confidence:'Preliminary: quote required'};
 }
 return {key:'compare-options',title:'Compare efficiency options before spending',reason:'With '+number(units)+' stated monthly units, multiple options may be worth evaluating, but roof eligibility and actual tariffs are unknown.',steps:['Start with free habits','Check replacement costs only if existing appliances are inefficient','Confirm housing and roof details before requesting solar quotes'],caution:'No provider tariff, roof availability, or solar quote has been verified.',confidence:'Preliminary: missing roof and tariff details'};
}
function comparePaths(input={}){
 const units=good(input.units,0,100000)?Number(input.units):null;
 const monthly=input.period==='monthly';
 const rate=good(input.rate,.5,30)?Number(input.rate):null;
 const reduction=good(input.reducePercent,0,30)?Number(input.reducePercent):null;
 const baselineReady=units!==null&&monthly&&rate!==null;
 let save={ready:false,message:'Confirm a roughly one-month bill, its units, and an illustrative marginal saving rate.'};
 if(baselineReady&&reduction!==null){
  const kwh=round(units*reduction/100);
  save={ready:true,unitsSaved:kwh,estimatedMonthlyRupees:round(kwh*rate),message:'Illustration only: '+reduction+'% fewer units. This is a target, not a prediction or guaranteed bill reduction.'};
 }
 const upgradeInput=input.upgrade||{};
 const oldW=good(upgradeInput.oldWatts,1,10000)?Number(upgradeInput.oldWatts):null;
 const newW=good(upgradeInput.newWatts,1,10000)?Number(upgradeInput.newWatts):null;
 const hours=good(upgradeInput.hours,0,24)?Number(upgradeInput.hours):null;
 const count=good(upgradeInput.count,1,20)&&Number.isInteger(Number(upgradeInput.count))?Number(upgradeInput.count):null;
 const extra=upgradeInput.extraCost===''||upgradeInput.extraCost===null||upgradeInput.extraCost===undefined?null:good(upgradeInput.extraCost,0,1000000)?Number(upgradeInput.extraCost):NaN;
 let upgrade={ready:false,message:'Adjust a real old/new wattage and operating hours to test an appliance upgrade.'};
 if(baselineReady&&oldW!==null&&newW!==null&&hours!==null&&count!==null&&(!Number.isNaN(extra))){
  const raw=round(Math.max(0,oldW-newW)*hours*count*30/1000);
  const plausible=raw<=units*1.1;
  const savings=round(raw*rate);
  const purchaseKnown=extra!==null;
  upgrade={ready:true,plausible,unitsSaved:raw,estimatedMonthlyRupees:savings,extraCost:extra,
   paybackMonths:purchaseKnown&&savings>0&&plausible?round(extra/savings):null,
   message:!plausible?'The upgrade estimate exceeds the household bill units. Review assumed wattage and hours before trusting this scenario.':
    'An illustrative device comparison. Check actual old/new watts, operating hours, purchase price and lifespan before buying.'};
 }
 const solarInput=input.solar||{};
 const cost=good(solarInput.netCost,1,10000000)?Number(solarInput.netCost):null;
 const offset=good(solarInput.monthlyOffset,0.01,100000)?Number(solarInput.monthlyOffset):null;
 const maint=solarInput.annualMaintenance===''||solarInput.annualMaintenance===null||solarInput.annualMaintenance===undefined?null:
   good(solarInput.annualMaintenance,0,1000000)?Number(solarInput.annualMaintenance):NaN;
 const roof=input.roof==='yes';
 const own=input.home==='own';
 let solar={ready:false,message:!monthly||units===null?'Confirm monthly units before assessing solar.':
  !own||!roof?'Confirm that you own the home and have a suitable roof before considering a quotation.':
  'Provide a real net installed quote and the estimated monthly grid units solar will offset. No cost or output is assumed.'};
 if(baselineReady&&own&&roof&&cost!==null&&offset!==null&&!Number.isNaN(maint)){
  const usable=round(Math.min(offset,units));
  const gross=round(usable*rate);
  const net=round(gross-(maint===null?0:maint/12));
  solar={ready:true,quotedOffset:offset,offsetUsed:usable,netCost:cost,grossMonthlyRupees:gross,
   netMonthlyRupees:maint===null?null:net,
   paybackMonths:(maint===null?gross:net)>0?round(cost/(maint===null?gross:net)):null,
   maintenanceKnown:maint!==null,
   message:(offset>units?'Estimated offset was capped to your current units. No export revenue was assumed. ':'')+
    (maint===null?'Gross simple payback excludes maintenance, repairs, financing and changes to policy.':
    'Simple payback includes only the maintenance amount you entered; excludes financing, degradation, repairs and policy changes.')};
 }
 return {rate,baselineReady,monthlyUnits:monthly?units:null,save,upgrade,solar,
  warning:'Three independent scenarios—not additive. ₹ savings use an illustrative marginal rate, NOT total bill amount ÷ units. Actual slabs, subsidies, fixed charges, exports, weather and changes in usage can affect results.'};
}
root.GharWattVerdict=Object.freeze({verdict,comparePaths});
const $=id=>typeof document==='undefined'?null:document.getElementById(id);
if(!$('gw-verdict'))return;
const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
const moneyDecimal=n=>'₹'+new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(n);
function snapshot(){
 const units=$('gw-bill-units').value,dues=$('gw-old-dues').value;
 return {amount:$('gw-bill-amount').value,units:units.trim()===''?null:units,
  arrears:dues.trim()===''?null:dues,
  period:$('gw-bill-period').value,
  home:$('gw-home-status').value,roof:$('gw-roof-status').value};
}
function renderVerdict(){
 const v=verdict(snapshot());
 set('gw-verdict-title',v.title);
 set('gw-verdict-reason',v.reason);
 set('gw-verdict-confidence',v.confidence);
 set('gw-verdict-caution',v.caution);
 const list=$('gw-verdict-steps');list.replaceChildren();
 for(const tip of v.steps){const li=document.createElement('li');li.textContent=tip;list.appendChild(li);}
}
function readUpgrade(){
 return {oldWatts:$('gw-old-watts').value,newWatts:$('gw-new-watts').value,
  hours:$('gw-upgrade-hours').value,count:$('gw-upgrade-count').value,extraCost:$('gw-upgrade-cost').value};
}
function readSolar(){
 return {netCost:$('gw-solar-net-cost').value,monthlyOffset:$('gw-solar-offset').value,
  annualMaintenance:$('gw-solar-maintenance').value};
}
const display=(id,title,lines)=>{
 const element=$(id);element.replaceChildren();
 const heading=document.createElement('strong');heading.textContent=title;element.appendChild(heading);
 lines.forEach(t=>{const p=document.createElement('p');p.textContent=t;element.appendChild(p);});
};
function renderComparison(){
 const bill=snapshot();
 const r=comparePaths({units:bill.units,period:bill.period,
  rate:$('gw-compare-rate').value,reducePercent:$('gw-reduce-percent').value,
  home:bill.home,roof:bill.roof,upgrade:readUpgrade(),solar:readSolar()});
 display('gw-path-save',r.save.ready?'Save energy · '+number(r.save.unitsSaved)+' units/month':
  'Save energy · needs bill details',
  r.save.ready?['Example variable-cost saving: '+moneyDecimal(r.save.estimatedMonthlyRupees)+'/month.',r.save.message]:
  [r.save.message]);
 display('gw-path-upgrade',r.upgrade.ready?'Upgrade appliance · '+number(r.upgrade.unitsSaved)+' units/month':
  'Upgrade appliance · needs assumptions',
  r.upgrade.ready?[r.upgrade.plausible?'Example variable-cost saving: '+moneyDecimal(r.upgrade.estimatedMonthlyRupees)+'/month.':
   'This estimate does not fit the entered monthly usage.',
   r.upgrade.paybackMonths===null?'Payback not verified. Provide an actual extra cost and plausible usage.':
    'Illustrative simple payback: '+number(r.upgrade.paybackMonths)+' months.',
   r.upgrade.message]:[r.upgrade.message]);
 display('gw-path-solar',r.solar.ready?'Solar quotation · '+number(r.solar.offsetUsed)+' units/month':
  'Solar quotation · not yet verified',
  r.solar.ready?[
   'Illustrative monthly gross avoided energy cost: '+moneyDecimal(r.solar.grossMonthlyRupees)+'.',
   r.solar.paybackMonths===null?'Simple payback cannot be established.':
    'Illustrative simple payback: '+number(r.solar.paybackMonths)+' months.',
   r.solar.message
  ]:[r.solar.message]);
 set('gw-path-disclaimer',r.warning);
 set('gw-compare-status',r.baselineReady?
  'Illustrations calculated locally. Please verify the tariff assumption and real equipment costs.':
  'Confirm your monthly bill period, consumed units, and illustrative saving rate to compare meaningful numbers.');
}
const update=()=>{renderVerdict();renderComparison()};
$('gw-bill-start').addEventListener('click',()=>{
 const bill=snapshot();
 if(!good(bill.amount,0,500000))return;
 update();
});
const controls=['gw-bill-amount','gw-bill-units','gw-bill-period','gw-old-dues','gw-home-status','gw-roof-status',
 'gw-compare-rate','gw-reduce-percent','gw-old-watts','gw-new-watts','gw-upgrade-hours',
 'gw-upgrade-count','gw-upgrade-cost','gw-solar-net-cost','gw-solar-offset','gw-solar-maintenance'];
for(const id of controls){const el=$(id);if(!el)continue;
 el.addEventListener('change',update);
 if(el.tagName==='INPUT')el.addEventListener('input',update);
}
const presets={fan:{old:70,new:35,hours:6},bulb:{old:60,new:9,hours:5},tv:{old:100,new:70,hours:4}};
$('gw-upgrade-example').addEventListener('change',()=>{
 const v=presets[$('gw-upgrade-example').value]||presets.fan;
 $('gw-old-watts').value=v.old;$('gw-new-watts').value=v.new;$('gw-upgrade-hours').value=v.hours;
 update();
});
update();
})(window);