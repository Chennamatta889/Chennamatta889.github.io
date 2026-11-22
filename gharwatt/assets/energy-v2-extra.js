/* Optional V2.2 GharWatt calculators. Inputs run locally, no backend calls. */
(function(){'use strict';
 const $=id=>document.getElementById(id);
 const fmt=x=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(x);
 const cash=x=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(x);
 const finite=(v,min,max)=>String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
 function compareLabels(oldKwh,newKwh,purchasePrice,tariff){
   if(!finite(oldKwh,0,50000)||!finite(newKwh,0,50000)||!finite(purchasePrice,0,2000000)||!finite(tariff,0,30))return null;
   const saved=Number(oldKwh)-Number(newKwh);
   const rupees=saved*Number(tariff);
   return {savedKwh:saved,savedRupees:rupees,paybackYears:rupees>0?Number(purchasePrice)/rupees:null};
 }
 function compareSolar(units,tariff,habitReduction,solarKw,usablePerKw=100){
   if(!finite(units,0,100000)||!finite(tariff,0,30)||!finite(habitReduction,0,100000)||!finite(solarKw,0,20)||!finite(usablePerKw,10,200))return null;
   const baseline=Number(units),habit=Math.min(baseline,Number(habitReduction)),solarGeneration=Number(solarKw)*Number(usablePerKw);
   const solarOnly=Math.min(baseline,solarGeneration);
   const solarAfterHabits=Math.min(Math.max(0,baseline-habit),solarGeneration);
   return {baseline,habitsUnits:habit,solarOnlyUnits:solarOnly,combinationUnits:habit+solarAfterHabits,solarAfterHabits,habitsAmount:habit*Number(tariff),solarOnlyAmount:solarOnly*Number(tariff),combinationAmount:(habit+solarAfterHabits)*Number(tariff)};
 }
 function readCsv(text){
   const source=String(text||'');
   if(source.length>1000000)return {error:'File too large for this tool.'};
   const lines=source.replace(/^\uFEFF/,'').trim().split(/\r?\n/).filter(x=>x.trim());
   if(lines.length<2)return {error:'Include a header row and at least one record.'};
   const cols=lines[0].split(',').map(x=>x.replace(/"/g,'').trim().toLowerCase());
   const dateIndex=cols.indexOf('date'),unitsIndex=cols.indexOf('units_kwh');
   if(dateIndex<0||unitsIndex<0)return {error:'Please use column names date,units_kwh (one reading per day).'};
   const out=[];let skipped=0;
   for(const row of lines.slice(1,1001)){
     const cells=row.split(',').map(x=>x.trim().replace(/^"|"$/g,''));const date=cells[dateIndex],units=cells[unitsIndex];
     if(!/^\d{4}-\d\d-\d\d$/.test(date||'')||!finite(units,0,2000)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))){skipped++;continue;}
     const parsed=new Date(date+'T00:00:00Z');
     if(parsed.toISOString().slice(0,10)!==date){skipped++;continue;}
     out.push({date,units:Number(units)});
   }
   if(!out.length)return {error:'No valid daily records found. Check the CSV date format YYYY-MM-DD.'};
   out.sort((a,b)=>a.date.localeCompare(b.date));
   const byMonth=new Map();for(const x of out){const m=x.date.slice(0,7);byMonth.set(m,(byMonth.get(m)||0)+x.units);}
   return {rows:out,byMonth:[...byMonth].map(([month,units])=>({month,units})),skipped};
 }
 function initStar(){
   const el=$('v2-star-label');if(!el)return;
   function show(){
     const r=compareLabels($('v2-star-old').value,$('v2-star-new').value,$('v2-star-price').value,$('v2-star-rate').value);
     if(!r){$('v2-star-units').textContent='Check inputs';return;}
     $('v2-star-units').textContent=(r.savedKwh>=0?'+':'')+fmt(r.savedKwh)+' units/year avoided';
     $('v2-star-rupees').textContent=cash(r.savedRupees)+' per year';
     $('v2-star-payback').textContent=r.paybackYears===null?'No positive payback from these inputs':fmt(r.paybackYears)+' years (simple calculation)';
     $('v2-star-note').textContent='These numbers come from your entered annual label values, not assumed star percentages. Compare the same appliance capacity and label test period. An existing appliance may be worth keeping.';
   }
   el.querySelectorAll('input').forEach(i=>i.addEventListener('input',show));show();
 }
 function initSolar(){
   const el=$('v2-solar-habits');if(!el)return;
   function show(){
     const r=compareSolar($('v2-solar-units').value,$('v2-solar-rate').value,$('v2-solar-habits-units').value,$('v2-solar-kw').value);
     if(!r){$('v2-solar-only').textContent='Check inputs';return;}
     $('v2-habits-only').textContent=cash(r.habitsAmount)+' /month';
     $('v2-solar-only').textContent=cash(r.solarOnlyAmount)+' /month';
     $('v2-both').textContent=cash(r.combinationAmount)+' /month';
     $('v2-solar-explain').textContent='For the combined example, solar is applied after the '+fmt(r.habitsUnits)+' units saved through habits, so the same units are not counted twice. Solar usable output is assumed 100 units per kW per month, not a production guarantee.';
   }
   el.querySelectorAll('input').forEach(i=>i.addEventListener('input',show));show();
 }
 function initCsv(){
   if(!$('v2-csv-reader'))return;
   $('v2-csv-load').addEventListener('click',async()=>{
     const file=$('v2-csv-file').files?.[0];
     if(!file||file.size>1000000||!/\.csv$/i.test(file.name)){ $('v2-csv-status').textContent='Choose a CSV file under 1 MB.';return;}
     let data;try{data=readCsv(await file.text())}catch{ $('v2-csv-status').textContent='Could not read the file on this device.';return;}
     if(data.error){$('v2-csv-status').textContent=data.error;return;}
     const box=$('v2-csv-months');box.replaceChildren();
     for(const x of data.byMonth.slice(-24)){
       const row=document.createElement('div');row.className='v2-breakdown-row';
       const label=document.createElement('span');label.textContent=x.month;
       const value=document.createElement('strong');value.textContent=fmt(x.units)+' units';
       row.append(label,value);box.appendChild(row);
     }
     $('v2-csv-status').textContent='Processed '+data.rows.length+' daily readings in this browser. '+data.skipped+' invalid row(s) ignored. No data uploaded or saved. Verify the readings represent usage, not cumulative meter readings.';
     $('v2-csv-file').value='';
   });
   $('v2-csv-clear').addEventListener('click',()=>{$('v2-csv-file').value='';$('v2-csv-months').replaceChildren();$('v2-csv-status').textContent='Imported readings cleared from this page.';});
 }
 initStar();initSolar();initCsv();
 window.GharWattV2Extra=Object.freeze({compareLabels,compareSolar,readCsv});
})();