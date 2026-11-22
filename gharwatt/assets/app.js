/* GharWatt India calculator — transparent, illustrative math; no personal data sent. */
(function(){
  'use strict';
  const INR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  const N=new Intl.NumberFormat('en-IN',{maximumFractionDigits:0});
  const $=(id)=>document.getElementById(id);
  const read=(id,fallback=0)=>{const n=Number($(id)?.value);return Number.isFinite(n)?n:fallback};
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const specialStates = new Set(['HP','UK','JK','LA','AR','AS','MN','ML','MZ','NL','SK','TR','AN','LD']);
  function centralSubsidy(kw,special=false){const first=Math.min(2,Math.max(kw,0));const third=Math.min(1,Math.max(kw-2,0));return first*(special?33000:30000)+third*(special?19800:18000)}
  function renderSolar(){
    if(!$('solar-calculator'))return;
    const kw=clamp(read('capacity',3),.5,20),units=clamp(read('monthly-units',300),0,10000),price=clamp(read('unit-rate',8),0,30),installedRate=clamp(read('install-price',60000),10000,200000),yieldRate=clamp(read('generation',4),.5,8),credit=clamp(read('effective-offset',85),0,100)/100;
    const state=$('solar-state').value,special=specialStates.has(state),gross=kw*installedRate,subsidy=centralSubsidy(kw,special),net=Math.max(0,gross-subsidy);
    const produced=kw*yieldRate*30,offset=Math.min(units,produced*credit),monthly=offset*price,annualGross=monthly*12,annualMaintenance=gross*.01,annualNet=Math.max(0,annualGross-annualMaintenance),payback=annualNet>0?net/annualNet:Infinity;
    const txt=(id,val)=>{$(id).textContent=val};
    txt('solar-savings',INR.format(monthly));txt('solar-gross',INR.format(gross));txt('solar-subsidy',INR.format(subsidy));txt('solar-net',INR.format(net));txt('solar-generation',N.format(produced)+' units');txt('solar-offset',N.format(offset)+' units');txt('solar-payback',Number.isFinite(payback)?(payback<100?payback.toFixed(1)+' years':'> 100 years'):'Not reached');txt('solar-annual',INR.format(annualNet));
    txt('subsidy-category',special?'Special-category central CFA estimate':'Standard-category central CFA estimate');
    const available=units*price;
    $('solar-bar-before').style.width='100%';
    $('solar-bar-after').style.width=(available?clamp(100-(monthly/available)*100,0,100):0)+'%';
    txt('solar-grid-after',INR.format(Math.max(0,available-monthly)));
    const status=$('calc-status');if(status)status.textContent=`Estimated production ${N.format(produced)} units monthly. These figures are illustrative and exclude fixed charges, taxes, exported-unit compensation, loans, tariffs/slabs and state incentives.`;
  }
  function wireSolar(){if(!$('solar-calculator'))return; document.querySelectorAll('#solar-calculator input,#solar-calculator select').forEach(el=>el.addEventListener('input',renderSolar));renderSolar()}
  function quoteData(){return [1,2,3].map(i=>({id:i,name:($('q-name-'+i)?.value||'Quote '+i).trim().slice(0,60),cost:clamp(read('q-cost-'+i,0),0,100000000),capacity:clamp(read('q-size-'+i,3),.5,100),panel:clamp(read('q-panel-'+i,12),0,40),inverter:clamp(read('q-inverter-'+i,5),0,30),extras:($('q-extras-'+i)?.value||'').trim().slice(0,150)}))}
  function renderQuotes(){if(!$('quote-tool'))return;const quotes=quoteData(),special=specialStates.has($('solar-state')?.value||'');const assessed=quotes.map(q=>({...q,costPerKw:q.cost/q.capacity,subsidy:centralSubsidy(q.capacity,special),after:Math.max(0,q.cost-centralSubsidy(q.capacity,special))}));const lowest=Math.min(...assessed.map(q=>q.cost));
    assessed.forEach(q=>{
      $('qr-name-'+q.id).textContent=q.name;
      $('qr-cost-'+q.id).textContent=INR.format(q.cost);
      $('qr-kw-'+q.id).textContent=INR.format(q.costPerKw)+'/kW';
      $('qr-tag-'+q.id).textContent=q.cost===lowest?'Lowest headline price':'Review inclusions';
    });
    $('quote-msg').textContent='Compare warranty, equipment model, DC/AC capacity, workmanship, GST, mounting, DISCOM costs and after-sales service. Lowest upfront price is not automatically the best quotation.';
  }
  function report(){const quotes=quoteData();return ['GHARWATT INDIA — SOLAR INSTALLER QUOTE COMPARISON','Independent worksheet; no vendor verification or endorsement.','Created: '+new Date().toLocaleDateString('en-IN'),'','Costs and warranty terms (as entered by visitor):',...quotes.map(q=>['',q.name,'Total quoted: '+INR.format(q.cost),'System: '+q.capacity+' kW','Quoted price/kW: '+INR.format(q.cost/q.capacity),'Panel warranty: '+q.panel+' years','Inverter warranty: '+q.inverter+' years','Inclusions / extras: '+(q.extras||'Not entered')].join('\n')),'','CHECKLIST: GST | panel make/model | inverter | mounting | earthing | surge protection | DISCOM/net metering | warranty terms | workmanship | maintenance | subsidy eligibility','Rates and subsidy are not confirmed in this worksheet. For verified vendor applications visit https://pmsuryaghar.gov.in/'].join('\n')}
  function wireQuotes(){if(!$('quote-tool'))return;document.querySelectorAll('#quote-tool input,#quote-tool select').forEach(el=>el.addEventListener('input',renderQuotes));renderQuotes();$('download-report').addEventListener('click',()=>{const blob=new Blob([report()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gharwatt-solar-quote-comparison.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});$('copy-report').addEventListener('click',async()=>{const button=$('copy-report');try{await navigator.clipboard.writeText(report());button.textContent='Copied ✓';setTimeout(()=>button.textContent='Copy comparison',1700)}catch{button.textContent='Use download instead';setTimeout(()=>button.textContent='Copy comparison',2500)}})}
  function wireMenu(){const b=$('menu-toggle'),nav=$('main-nav');if(!b||!nav)return;b.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));b.textContent=open?'Close':'Menu'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='Menu'}))}
  wireMenu();wireSolar();wireQuotes();
  window.GharWattMath=Object.freeze({centralSubsidy,specialStates});
  // Lazy-load the small GharWatt offer after existing calculator/menu setup.
  // Product link and dismiss frequency are handled independently.
  if(document.currentScript?.src){
    const offerScript=document.createElement('script');
    offerScript.src=new URL('affiliate-popup.js',document.currentScript.src).href;
    offerScript.async=true;
    document.head.appendChild(offerScript);
  }

})();
