/* GharWatt India: estimate a plausible planning range from bill amount only. No data leaves browser. */
(function(){'use strict';
 const $=id=>document.getElementById(id);
 const rupees=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v);
 const number=v=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(v);
 const halfUp=n=>Math.max(0.5,Math.ceil(n*2)/2);
 function estimateFromAmount(amount,months){
  const bill=Number(amount),period=Number(months);
  if(!Number.isFinite(bill)||bill<100||bill>500000||![1,2,3].includes(period))return null;
  const monthly=bill/period;
  const nonEnergy=Math.min(150,monthly*0.20);
  const minimumUnits=Math.round((monthly-nonEnergy)/10);
  const maximumUnits=Math.round(monthly/5);
  const exampleUnits=(monthly-Math.min(75,monthly*0.1))/7.5;
  const creditedUnitsPerKw=4*30*0.85;
  return Object.freeze({monthly,nonEnergy,minimumUnits,maximumUnits,
   smallestKw:halfUp(minimumUnits/creditedUnitsPerKw),largestKw:halfUp(maximumUnits/creditedUnitsPerKw),
   exampleUnits:Math.round(exampleUnits),exampleKw:halfUp(exampleUnits/creditedUnitsPerKw),
   rateLow:5,rateHigh:10,exampleRate:7.5});
 }
 function sizeText(kw){return kw>20?'More than 20 kW':kw.toFixed(1)+' kW'}
 function attach(){
  if(!$('quick-bill-tool'))return;
  const input=$('quick-bill-amount'),period=$('quick-bill-period'),apply=$('quick-bill-apply');
  let current=null;
  function update(){
   current=estimateFromAmount(input.value,period.value);
   if(!current){$('quick-bill-prompt').textContent='Enter a bill amount of at least ₹100 to get started.';$('quick-bill-units').textContent='—';$('quick-bill-size').textContent='—';$('quick-bill-mid').textContent='An exact electricity rate cannot be known from the amount alone.';$('quick-bill-note').textContent='Amounts with subsidies, old dues or credits may not reflect actual electricity use.';apply.disabled=true;return}
   $('quick-bill-prompt').textContent='For a monthly bill equivalent of '+rupees(current.monthly)+', here is a broad planning illustration:';
   $('quick-bill-units').textContent=number(current.minimumUnits)+'–'+number(current.maximumUnits)+' units';
   $('quick-bill-size').textContent=sizeText(current.smallestKw)+' to '+sizeText(current.largestKw);
   $('quick-bill-mid').textContent='Example to explore: '+sizeText(current.exampleKw)+' (not an installation recommendation).';
   $('quick-bill-note').textContent='Illustrative ₹5–₹10/unit, non-energy charges up to ₹150/month, 4 units/kW/day and 85% usable generation. Real tariffs and savings can differ substantially.';
   apply.disabled=false;
  }
  input.addEventListener('input',update);period.addEventListener('change',update);
  apply.addEventListener('click',()=>{
   if(!current)return;
   const advanced=$('quick-bill-advanced');if(advanced){advanced.open=true;
    const vals=[['bill-amount',current.monthly],['bill-units',current.exampleUnits],['bill-fixed',Math.min(75,current.monthly*.1)],['bill-yield',4],['bill-usable',85]];
    for(const [id,v] of vals){const el=$(id);if(el){el.value=String(Math.round(v*100)/100);el.dispatchEvent(new Event('input',{bubbles:true}))}}
    $('bill-status').textContent='Approximate values copied from the bill-only estimate. Verify the units from your actual electricity bill before making decisions.';
    advanced.scrollIntoView({behavior:'smooth',block:'start'});
    return;
   }
   const vals=[['monthly-units',current.exampleUnits],['unit-rate',current.exampleRate],['capacity',Math.min(current.exampleKw,20)]];
   for(const [id,v] of vals){const el=$(id);if(el){el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))}}
   const target=$('calculator');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
  });
  update();
 }
 attach();window.GharWattBillOnly=Object.freeze({estimateFromAmount});
})();
