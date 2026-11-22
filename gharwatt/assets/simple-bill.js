/* GharWatt: quick bill calculation with two required numbers and no OCR dependency. */
(function(root){
'use strict';
const $=id=>typeof document==='undefined'?null:document.getElementById(id);
const numeric=(value,min,max)=>value!==null&&value!==undefined&&String(value).trim()!==''&&Number.isFinite(Number(value))&&Number(value)>=min&&Number(value)<=max;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const number=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(n);
function quickBill(amount,units,rate=8,arrears=null){
 if(!numeric(amount,0,500000))return {ok:false,error:'Enter a valid bill amount.'};
 if(!numeric(units,0,100000))return {ok:false,error:'Enter the units consumed (kWh), not the meter reading.'};
 if(!numeric(rate,.5,30))return {ok:false,error:'Enter an example savings rate from ₹0.50 to ₹30 per unit.'};
 if(arrears!==null&&String(arrears).trim()!==''&&!numeric(arrears,0,500000))return {ok:false,error:'Check the optional old dues amount.'};
 const due=Number(amount),kwh=Number(units);
 const old=arrears===null||String(arrears).trim()===''?null:Number(arrears);
 const unitsToAvoid=round(kwh*.10);
 const estimatedSaving=round(unitsToAvoid*Number(rate));
 const totalAverage=kwh>0?round(due/kwh):null;
 const mostlyArrears=old!==null&&due>0&&old/due>=.3;
 const note=old!==null&&old>due?
  'Entered previous dues are higher than the payable amount. Check for adjustments or correct the fields.':
  mostlyArrears?'Old dues are a large part of the payable amount. Do not treat this as the cost of electricity consumed.':
  kwh===0?'No consumption was entered. The payable amount may include fixed charges or old dues.':
  'The payable amount may include fixed charges, taxes and old dues; it is not a per-unit tariff.';
 return {ok:true,amount:due,units:kwh,oldDues:old,estimatedCurrentPortion:old===null?null:round(due-old),
  totalAverage,unitsToAvoid,estimatedSaving,mostlyArrears,rate:Number(rate),note};
}
root.GharWattSimpleBill=Object.freeze({quickBill});
if(!$('gw-simple-bill'))return;
const amount=$('gw-simple-amount'),units=$('gw-simple-units'),rate=$('gw-simple-rate'),dues=$('gw-simple-dues');
const result=$('gw-simple-result'),status=$('gw-simple-status'),toDetails=$('gw-simple-use');
const put=(id,value)=>{$(id).textContent=value};
let current=null;
function update(){
 const r=quickBill(amount.value,units.value,rate.value,dues.value);
 current=r.ok?r:null;
 result.hidden=!r.ok;
 toDetails.hidden=!r.ok;
 if(!r.ok){status.textContent=r.error;return;}
 put('gw-simple-bill-value',money(r.amount));
 put('gw-simple-use-value',number(r.units)+' units');
 put('gw-simple-reduce-value',number(r.unitsToAvoid)+' units');
 put('gw-simple-saving-value',money(r.estimatedSaving));
 put('gw-simple-explain',r.note);
 const oldBox=$('gw-simple-old-dues-note');
 oldBox.hidden=r.oldDues===null;
 if(r.oldDues!==null){
  oldBox.textContent='Old dues entered: '+money(r.oldDues)+
   (r.oldDues<=r.amount?'. Difference before other adjustments: '+money(r.estimatedCurrentPortion)+'.':' (more than total payable; check the bill).');
 }
 status.textContent='Example only: 10% fewer units at ₹'+r.rate+'/unit. The actual bill reduction depends on tariff slabs and other charges.';
}
$('gw-simple-calc').addEventListener('click',update);
[amount,units,rate,dues].forEach(el=>el.addEventListener('input',()=>{if(current){update();}else status.textContent='Enter your bill amount and consumed units, then tap See result.'}));
toDetails.addEventListener('click',()=>{
 if(!current)return;
 $('v2-confirm-amount').value=current.amount;
 $('v2-confirm-units').value=current.units;
 if(current.oldDues!==null)$('v2-confirm-arrears').value=current.oldDues;
 $('v2-manual-entry').scrollIntoView({behavior:'smooth',block:'start'});
 status.textContent='Numbers copied below. Confirm the actual billing days before opening the detailed advisor.';
});
window.addEventListener('gharwatt:bill-confirmed',e=>{
 const d=e.detail||{};
 if(numeric(d.amount,0,500000)&&numeric(d.units,0,100000)){
  amount.value=d.amount;units.value=d.units;
  if(numeric(d.arrears,0,500000))dues.value=d.arrears;
  update();
 }
});
})(window);
