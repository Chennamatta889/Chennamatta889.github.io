/* GharWatt household power guide. Units are examples; checklist is local-only. */
(function(){'use strict';
 const $=id=>document.getElementById(id);
 const sampleWatts=Object.freeze({led:9,fan:65,tv:80,geyser:2000,ac:1500});
 function estimateUsage(type,hours,count,rate,days=30){
  const watts=sampleWatts[type],h=Number(hours),n=Number(count),p=Number(rate),d=Number(days);
  if(!watts||![h,n,p,d].every(Number.isFinite)||h<0||h>24||n<1||n>30||!Number.isInteger(n)||p<0||p>30||d<1||d>366)return null;
  const units=watts*h*n*d/1000;
  return Object.freeze({watts,units,cost:units*p});
 }
 const fmt=new Intl.NumberFormat('en-IN',{maximumFractionDigits:2});
 const money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
 function initEstimator(){
  if(!$('energy-appliance-tool'))return;
  const ids=['energy-appliance','energy-hours','energy-count','energy-rate'];
  function recalc(){
   const result=estimateUsage($('energy-appliance').value,$('energy-hours').value,$('energy-count').value,$('energy-rate').value);
   $('energy-units-result').textContent=result?fmt.format(result.units)+' units':'Check your inputs';
   $('energy-cost-result').textContent=result?money.format(result.cost)+' (example)':'—';
   $('energy-usage-note').textContent=result?'Uses example power of '+result.watts+' watts for 30 days. Real power, duty cycle and tariff may be different.':'Please enter 0–24 hours, a valid number of appliances and a rate from 0 to 30.';
  }
  ids.forEach(id=>$(id).addEventListener('input',recalc));recalc();
 }
 const storageKey='gharwatt:energy-saving-seven-day:v1';
 function initChecklist(){
  const root=$('energy-week-plan');if(!root)return;
  const checks=[...root.querySelectorAll('[data-energy-task]')];
  const storage=(()=>{try{return window.localStorage}catch{return null}})();
  if(storage){try{const selected=JSON.parse(storage.getItem(storageKey)||'[]');if(Array.isArray(selected))checks.forEach(x=>{x.checked=selected.includes(x.dataset.energyTask)})}catch{}}
  function render(){
   const finished=checks.filter(x=>x.checked).length;
   $('energy-plan-count').textContent=finished+' of '+checks.length+' completed'+(finished===checks.length?' — well done!':'');
   $('energy-plan-progress').max=checks.length;
   $('energy-plan-progress').value=finished;
  }
  function save(){if(storage){try{storage.setItem(storageKey,JSON.stringify(checks.filter(x=>x.checked).map(x=>x.dataset.energyTask)))}catch{}}render()}
  checks.forEach(c=>c.addEventListener('change',save));
  $('energy-plan-reset').addEventListener('click',()=>{checks.forEach(c=>{c.checked=false});if(storage){try{storage.removeItem(storageKey)}catch{}}render()});
  render();
 }
 initEstimator();initChecklist();
 window.GharWattEnergyGuide=Object.freeze({estimateUsage});
})();
