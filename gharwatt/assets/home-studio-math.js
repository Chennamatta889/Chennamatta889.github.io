/* GharWatt Home Energy Studio · FY 2026–27 residential reference tariff calculator.
 * Source: TGERC TGSPDCL FY26-27 RST schedule, APERC FY26-27 Domestic LT (telescopic).
 * These are statutory base energy rates. Customer charges, duty, fuel adjustment,
 * eligible schemes, actual net-meter settlement & taxes require bill/DISCOM data.
 * No network, no user storage, no third-party data transmission.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GharWattStudioMath=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const FY='2026–27';
const SOURCES=Object.freeze({
 TG:'https://tgsouthernpower.org/resources/PDF/Tariffs/69tarifffile.pdf',
 AP:'https://www.apcpdcl.in/pdf/RST-Order-for-FY-2026-27.pdf',
 SOLAR:'https://pmsuryaghar.gov.in/'
});
const REGIONS=Object.freeze({
 TG:{label:'Telangana',discoms:['TGSPDCL','TGNPDCL'],yield:4.2,profile:'TG',source:SOURCES.TG},
 AP:{label:'Andhra Pradesh',discoms:['APSPDCL','APCPDCL','APEPDCL'],yield:4.1,profile:'AP',source:SOURCES.AP},
 OTHER:{label:'Other state or UT',discoms:[],yield:4.0,profile:'flat',source:''}
});
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function finiteNumber(raw,min=0,max=100000){
  if(raw===null||raw===undefined||String(raw).trim()==='')return null;
  const n=Number(raw);
  return Number.isFinite(n)&&n>=min&&n<=max?n:null;
}
function bySlabs(units,ranges){
  let subtotal=0,start=0;
  const breakdown=[];
  for(const [end,rate] of ranges){
    if(units<=start)break;
    const count=Math.min(units,end)-start;
    if(count>0){const amount=count*rate;breakdown.push({from:start,to:Math.min(units,end),units:count,rate,amount});subtotal+=amount;}
    start=end;
  }
  return {energy:subtotal,breakdown};
}
function tgEnergy(units){
  if(units<=100)return bySlabs(units,[[50,1.95],[100,3.10]]);
  if(units<=200)return bySlabs(units,[[100,3.40],[200,4.80]]);
  return bySlabs(units,[[200,5.10],[300,7.70],[400,9],[800,9.50],[Infinity,10]]);
}
function apEnergy(units){
  return bySlabs(units,[[30,1.90],[75,3],[125,4.50],[225,6],[400,8.75],[Infinity,9.75]]);
}
function tariff(input={}){
 const region=REGIONS[input.region]?input.region:'OTHER';
 const units=finiteNumber(input.units,0,10000);
 const sanctioned=finiteNumber(input.load,0.5,100);
 const other=finiteNumber(input.extra??0,0,100000);
 if(units===null||sanctioned===null||other===null)return {ok:false,error:'Enter valid monthly units (0–10,000), sanctioned load (0.5–100 kW) and non-energy charges (₹0–100,000).'};
 const flat=finiteNumber(input.flatRate,0,50);
 if(region==='OTHER'&&flat===null)return {ok:false,error:'Enter your actual variable tariff for this unmodeled state.'};
 const calculated=region==='TG'?tgEnergy(units):region==='AP'?apEnergy(units):bySlabs(units,[[Infinity,flat]]);
 const fixed=region==='TG'?sanctioned*(units>800?50:10):region==='AP'?sanctioned*10:0;
 const energy=calculated.energy;
 return {ok:true,region,units,sanctioned,energy,fixed,extra:other,total:energy+fixed+other,breakdown:calculated.breakdown,fy:FY,source:REGIONS[region].source,
   note:region==='OTHER'?'Manual flat variable rate. The state tariff has not been verified.':'FY '+FY+' domestic base tariff illustration. Additional duty, fuel adjustments, customer charges, concession eligibility and tax must be entered separately if known.'};
}
function recommendation(input={}){
 const units=finiteNumber(input.units,0,10000),roof=finiteNumber(input.roof,0,10000),yieldRate=finiteNumber(input.yieldRate,1,8);
 const load=finiteNumber(input.load,0.5,100);
 if(units===null||roof===null||yieldRate===null)return {ok:false,error:'Enter valid electricity use, roof area and daily solar output.'};
 const options=[1,2,3,5].map(kw=>({kw,roofNeeded:kw*10,monthlyGeneration:kw*yieldRate*30,roofFits:roof>=kw*10,loadFits:load===null||kw<=load}));
 const target=units/(yieldRate*30*0.85||1);
 const fitted=options.filter(x=>x.roofFits&&x.loadFits);
 const selected=fitted.length?fitted.reduce((a,b)=>Math.abs(b.kw-target)<Math.abs(a.kw-target)?b:a):null;
 return {ok:true,options,targetKw:target,recommendedKw:selected?.kw||null,roofLimited:fitted.length===0,
   note:selected?'An illustrative starting capacity. A roof survey, sanctioned load check and DISCOM feasibility review are still required.':'No listed system fits the entered roof area and sanctioned-load constraints; check the inputs or seek a site survey.'};
}
function centralCFA(kw,eligible=true,special=false){
 if(!eligible||!Number.isFinite(kw)||kw<=0)return 0;
 return Math.min(2,kw)*(special?33000:30000)+Math.min(1,Math.max(0,kw-2))*(special?19800:18000);
}
function simulate(input={}){
 const current=tariff(input);
 if(!current.ok)return current;
 const kw=finiteNumber(input.kw,0.5,20),yieldRate=finiteNumber(input.yieldRate,1,8),selfUse=finiteNumber(input.selfUse,0,100);
 const shading=finiteNumber(input.shading??0,0,80),exportRate=finiteNumber(input.exportRate??0,0,30);
 const pricePerKw=finiteNumber(input.pricePerKw??60000,10000,200000);
 if([kw,yieldRate,selfUse,shading,exportRate,pricePerKw].some(x=>x===null))return {ok:false,error:'Enter a system size, generation yield, self-consumption, shading and valid price assumptions.'};
 const generation=kw*yieldRate*30*(1-shading/100);
 const selfUnits=Math.min(current.units,generation*selfUse/100);
 const gridUnits=Math.max(0,current.units-selfUnits);
 const exports=Math.max(0,generation-selfUnits);
 const gridBase=tariff({...input,units:gridUnits});
 const grossExportCredit=exports*exportRate;
 const appliedExportCredit=Math.min(gridBase.energy,grossExportCredit);
 const gridEnergyAfter=Math.max(0,gridBase.energy-appliedExportCredit);
 // Fixed charges & manual extras are held at pre-solar values for conservative comparability.
 const modeledAfter=current.fixed+current.extra+gridEnergyAfter;
 const modeledSaving=Math.max(0,current.total-modeledAfter);
 const gross=kw*pricePerKw,subsidy=centralCFA(kw,input.subsidyEligible===true,input.special===true);
 const net=Math.max(0,gross-subsidy),maintenance=gross*0.01;
 const annualNet=12*modeledSaving-maintenance;
 const payback=annualNet>0?net/annualNet:null;
 const load=current.sanctioned,phase=input.phase||'unknown',warnings=[];
 if(kw>load)warnings.push('System exceeds the entered sanctioned load; ask your DISCOM about eligibility or load enhancement.');
 if(phase==='single'&&(input.region==='TG'||input.region==='AP')&&kw>5)warnings.push('Above the published 5 kW single-phase guidance for this state: confirm whether a three-phase upgrade is required.');
 if(phase==='unknown'&&kw>3)warnings.push('Confirm your supply phase and DISCOM approvals before choosing this capacity.');
 if(input.subsidyEligible!==true)warnings.push('Central CFA is not included until you confirm eligible residential status.');
 return {ok:true,now:current,gridUnits,monthlyProduction:generation,selfUnits,exports,exportCredit:appliedExportCredit,
   modeledAfter,modeledSaving,percentage:current.total>0?modeledSaving/current.total*100:0,
   gross,subsidy,net,annualNet,payback,maintenance,warnings,
   methodology:'Planning model only: reduced imports are repriced under the base domestic energy tariff. Actual net metering and solar billing can use different settlement rules. Export credit defaults to zero, and fixed charges & manually-entered extras stay unchanged.'};
}
function compareQuotes(quotes){
 return (Array.isArray(quotes)?quotes:[]).map((q,index)=>{
   const cost=finiteNumber(q.cost,1,1e8),kw=finiteNumber(q.kw,0.1,100);
   return {index,name:String(q.name||'Quote '+(index+1)).slice(0,60),cost,kw,
     costPerKw:cost!==null&&kw!==null?cost/kw:null,
     warranty:String(q.warranty||'').slice(0,120),extras:String(q.extras||'').slice(0,200)};
 });
}
function parseQuoteText(input){
 const text=String(input||'').slice(0,40000).replace(/,/g,'').replace(/\s+/g,' ');
 const capacity=/(?:capacity|system size|plant size|solar system|kwp|kilowatt)(?:.{0,65}?)(\d+(?:\.\d+)?)\s*k\s*w(?:p)?\b/i.exec(text)
   ||/(\d+(?:\.\d+)?)\s*k\s*w(?:p)?\b/i.exec(text);
 const amount=/(?:total|grand total|quoted price|project cost|system cost|amount payable|net amount|quotation)(?:.{0,40}?)(?:rs\.?|inr|₹)\s*(\d{4,8}(?:\.\d{1,2})?)/i.exec(text)
   ||/(?:₹|inr|rs\.?)\s*(\d{4,8}(?:\.\d{1,2})?)/i.exec(text);
 const panel=/(?:panel|module)(?:.{0,35}?)(\d{1,2})\s*(?:years?|yrs?)/i.exec(text);
 const inverter=/(?:inverter)(?:.{0,35}?)(\d{1,2})\s*(?:years?|yrs?)/i.exec(text);
 const kw=capacity?finiteNumber(capacity[1],0.1,100):null;
 const cost=amount?finiteNumber(amount[1],1000,1e8):null;
 return {kw,cost,panelWarranty:panel?finiteNumber(panel[1],1,40):null,inverterWarranty:inverter?finiteNumber(inverter[1],1,30):null,
   confidence:kw!==null&&cost!==null?'Needs manual verification':'Low — missing one or more critical fields',
   warnings:['Automatic extraction can mistake line items for final totals. Confirm GST, net-metering scope, system DC kWp, price and warranty against the original document.']};
}
return Object.freeze({FY,SOURCES,REGIONS,finiteNumber,tgEnergy,apEnergy,tariff,recommendation,centralCFA,simulate,compareQuotes,parseQuoteText});
});
