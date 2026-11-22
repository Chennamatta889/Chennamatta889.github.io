/* GharWatt India calculator — transparent, illustrative math; no personal data sent. */
(function(){
  'use strict';
  const INR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  const N=new Intl.NumberFormat('en-IN',{maximumFractionDigits:0});
  const $=(id)=>document.getElementById(id);
  const appScript=document.currentScript; // Save before deferred DOMContentLoaded initialization
  const read=(id,fallback=0)=>{const n=Number($(id)?.value);return Number.isFinite(n)?n:fallback};
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const specialStates = new Set(['HP','UK','JK','LA','AR','AS','MN','ML','MZ','NL','SK','TR','AN','LD']);
  function centralSubsidy(kw,special=false){const first=Math.min(2,Math.max(kw,0));const third=Math.min(1,Math.max(kw-2,0));return first*(special?33000:30000)+third*(special?19800:18000)}
  // Region-specific examples are editable planning inputs, not billing tariffs or promises.
  const regionalExamples=Object.freeze({
    TG:Object.freeze({rate:7.7,yield:4.2,label:'Telangana',tariff:'An illustrative rate using the 201–300 unit slab as a reference; actual avoided energy charges vary by slab, scheme and household.'}),
    AP:Object.freeze({rate:8.75,yield:4.1,label:'Andhra Pradesh',tariff:'An illustrative rate referencing the 226–400 unit marginal slab; it is NOT the blended rate across your bill.'})
  });
  function costPerKw(cost,kw){return Number.isFinite(cost)&&cost>0&&Number.isFinite(kw)&&kw>0?cost/kw:null}
  function connectionGuidance(state,phase,kw,load){
    const notes=[];
    if(Number.isFinite(load)&&load>0&&kw>load)notes.push('Your proposed solar capacity exceeds the sanctioned load you entered ('+load+' kW). Ask the DISCOM whether a load enhancement or other approval is required.');
    if(phase==='single'){
      if(state==='TG'||state==='AP'){
        if(kw>5)notes.push('A '+kw+' kW system exceeds the published 5 kW single-phase rooftop limit used for eligible '+(state==='TG'?'Telangana':'Andhra Pradesh')+' services. Check a three-phase upgrade and DISCOM approval before proceeding.');
        else notes.push('Single-phase rooftop systems up to 5 kW may be eligible in '+(state==='TG'?'Telangana':'Andhra Pradesh')+', depending on sanctioned load and utility approval. Confirm with your DISCOM.');
      }else if(kw>3)notes.push('At this capacity, check your state DISCOM’s single-phase limit and whether three-phase supply is needed.');
    }else if(phase==='unknown'&&kw>3)notes.push('For systems above 3 kW, check whether your home has single- or three-phase supply and verify its sanctioned load. Do not assume a phase upgrade is mandatory.');
    if(phase==='three'&&kw>5)notes.push('Confirm grid feasibility, sanctioned load and DISCOM approval for this system size.');
    return notes;
  }
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
    const percent=available?clamp(monthly/available*100,0,100):0;
    const percentage=$('solar-reduction-percent');if(percentage)percentage.textContent=N.format(percent)+'%';
    const beforeLabel=$('solar-grid-before');if(beforeLabel)beforeLabel.textContent=INR.format(available);
    const afterLabel=$('solar-grid-after-label');if(afterLabel)afterLabel.textContent=INR.format(Math.max(0,available-monthly));
    const chart=$('solar-bars-chart');
    if(chart)chart.setAttribute('aria-label','Illustrative variable grid charge reduction: '+N.format(percent)+' percent, from '+INR.format(available)+' to '+INR.format(Math.max(0,available-monthly))+' monthly');
    const notes=connectionGuidance(state,$('connection-phase')?.value||'unknown',kw,Number($('sanctioned-load')?.value)||0);
    const warning=$('solar-connection-warning');
    if(warning){warning.hidden=!notes.length;warning.textContent=notes.join(' ');}
    const status=$('calc-status');if(status)status.textContent='Example: '+N.format(produced)+' units monthly production. Edit every assumption; the model excludes slab changes, fixed charges, taxes, export credit, loans and state incentives.';
  }
  function wireSolar(){
    if(!$('solar-calculator'))return;
    let rateEdited=false,yieldEdited=false;
    const rate=$('unit-rate'),generation=$('generation'),state=$('solar-state'),note=$('solar-assumption-note'),reset=$('solar-use-state-example');
    if(rate)rate.addEventListener('input',()=>{rateEdited=true;});
    if(generation)generation.addEventListener('input',()=>{yieldEdited=true;});
    function selectExample(force=false){
      const selected=regionalExamples[state?.value]||null;
      const defaults=selected||{rate:8,yield:4,label:'Other state/UT',tariff:'Generic starting assumptions; add your actual variable tariff and site-specific solar-yield estimate.'};
      if(rate&&(!rateEdited||force))rate.value=String(defaults.rate);
      if(generation&&(!yieldEdited||force))generation.value=String(defaults.yield);
      if(force){rateEdited=false;yieldEdited=false;}
      if(note)note.textContent=defaults.label+' planning example: '+defaults.tariff+(rateEdited||yieldEdited?' Your manually edited value(s) were kept.':'');
      renderSolar();
    }
    document.querySelectorAll('#solar-calculator input,#solar-calculator select').forEach(el=>el.addEventListener('input',renderSolar));
    if(state)state.addEventListener('change',()=>selectExample(false));
    if(reset)reset.addEventListener('click',()=>selectExample(true));
    selectExample(false);
  }
  function quoteData(){return [1,2,3].map(i=>{
    const costText=$('q-cost-'+i)?.value?.trim()||'',capacityText=$('q-size-'+i)?.value?.trim()||'';
    return {id:i,name:($('q-name-'+i)?.value||'Quote '+i).trim().slice(0,60),
      cost:costText&&Number(costText)>0?clamp(Number(costText),0,100000000):null,
      capacity:capacityText&&Number(capacityText)>0?clamp(Number(capacityText),.5,100):null,
      panel:clamp(read('q-panel-'+i,0),0,40),inverter:clamp(read('q-inverter-'+i,0),0,30),extras:($('q-extras-'+i)?.value||'').trim().slice(0,150)};
  })}
  function renderQuotes(){if(!$('quote-tool'))return;const quotes=quoteData();const assessed=quotes.map(q=>({...q,costPerKw:costPerKw(q.cost,q.capacity)}));const complete=assessed.filter(q=>q.costPerKw!==null);const lowest=Math.min(...complete.map(q=>q.cost));const lowestUnit=Math.min(...complete.map(q=>q.costPerKw));
    assessed.forEach(q=>{
      $('qr-name-'+q.id).textContent=q.name;
      $('qr-cost-'+q.id).textContent=q.cost!==null?INR.format(q.cost):'Add quote details';
      $('qr-kw-'+q.id).textContent=q.costPerKw!==null?'Cost per kW: '+INR.format(q.costPerKw)+'/kW':'Cost per kW: —';
      $('qr-tag-'+q.id).textContent=q.costPerKw===null?'Waiting for price and size':q.costPerKw===lowestUnit?'Lowest price per kW*':q.cost===lowest?'Lowest total price*':'Review inclusions';
    });
    const summary=$('quote-normalized-note');
    if(summary)summary.textContent=complete.length<2?'Add at least two priced quotes with system sizes to compare ₹/kW.': 'Lowest displayed ₹/kW: '+INR.format(lowestUnit)+'/kW. Compare DC capacity, panel and inverter quality, GST, mounting, warranty and exclusions before deciding.';
    $('quote-msg').textContent='*Price comparisons are illustrative only, not an installer ranking or vendor endorsement. Verify GST, equipment, workmanship, grid connection and after-sales terms.';
  }
  function report(){const quotes=quoteData();return ['GHARWATT INDIA — SOLAR INSTALLER QUOTE COMPARISON','Independent worksheet; no vendor verification or endorsement.','Created: '+new Date().toLocaleDateString('en-IN'),'','Costs and warranty terms (as entered by visitor):',...quotes.map(q=>['',q.name,'Total quoted: '+(q.cost!==null?INR.format(q.cost):'Not entered'),'System: '+(q.capacity!==null?q.capacity+' kW':'Not entered'),'Quoted price/kW: '+(costPerKw(q.cost,q.capacity)!==null?INR.format(costPerKw(q.cost,q.capacity))+'/kW':'Not available'),'Panel warranty: '+q.panel+' years','Inverter warranty: '+q.inverter+' years','Inclusions / extras: '+(q.extras||'Not entered')].join('\n')),'','CHECKLIST: GST | panel make/model | inverter | mounting | earthing | surge protection | DISCOM/net metering | warranty terms | workmanship | maintenance | subsidy eligibility','Rates and subsidy are not confirmed in this worksheet. For verified vendor applications visit https://pmsuryaghar.gov.in/'].join('\n')}
  function wireQuotes(){if(!$('quote-tool'))return;
    document.querySelectorAll('#quote-tool input,#quote-tool select').forEach(el=>el.addEventListener('input',renderQuotes));
    const sample=$('load-quote-examples');
    if(sample)sample.addEventListener('click',()=>{
      const demos=[
        {name:'Sample A',cost:180000,size:3,panel:12,inverter:5,extras:'Example only: GST and mounting — verify actual inclusions'},
        {name:'Sample B',cost:195000,size:3.3,panel:15,inverter:7,extras:'Example only: compare panel make and net-metering scope'},
        {name:'Sample C',cost:270000,size:5,panel:12,inverter:8,extras:'Example only: compare inverter and workmanship'}
      ];
      for(let i=1;i<=3;i++){
        const q=demos[i-1],values={'name':q.name,'cost':q.cost,'size':q.size,'panel':q.panel,'inverter':q.inverter,'extras':q.extras};
        for(const [key,value] of Object.entries(values)){const field=$('q-'+key+'-'+i);if(field)field.value=String(value);}
      }
      renderQuotes();
      const message=$('quote-sample-status');if(message)message.textContent='Illustrative examples loaded. They are not real installer offers; replace with your own quotations.';
    });
    renderQuotes();$('download-report').addEventListener('click',()=>{const blob=new Blob([report()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gharwatt-solar-quote-comparison.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});$('copy-report').addEventListener('click',async()=>{const button=$('copy-report');try{await navigator.clipboard.writeText(report());button.textContent='Copied ✓';setTimeout(()=>button.textContent='Copy comparison',1700)}catch{button.textContent='Use download instead';setTimeout(()=>button.textContent='Copy comparison',2500)}})}
  function wireMenu(){const b=$('menu-toggle'),nav=$('main-nav');if(!b||!nav)return;b.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));b.textContent=open?'Close':'Menu'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='Menu'}))}
  // Mobile-only quick navigation. URLs are based on this script path so subpages work.
  function wireMobileDock(){
    const script=appScript;
    if(!script?.src||document.querySelector('.gw-mobile-dock'))return;
    const root=new URL('../',script.src);
    const links=[
      {id:'home',href:'',label:'Home',icon:'⌂',description:'GharWatt home'},
      {id:'bill',href:'electricity-bill/',label:'My bill',icon:'₹',description:'Electricity bill calculator'},
      {id:'explore',href:'discover/',label:'Explore',icon:'✦',description:'Explore practical electricity savings'},
      {id:'solar',href:'#calculator',label:'Solar',icon:'☀',description:'Solar savings calculator'},
      {id:'tools',href:'energy-tools/',label:'Tools',icon:'▦',description:'Browse all energy tools'}
    ];
    const dock=document.createElement('nav');
    dock.className='gw-mobile-dock';
    dock.setAttribute('aria-label','Mobile quick navigation');
    const anchors=[];
    for(const item of links){
      const a=document.createElement('a');
      a.href=new URL(item.href,root).href;
      a.setAttribute('aria-label',item.description);
      a.dataset.gwDock=item.id;
      const symbol=document.createElement('span');
      symbol.className='gw-dock-icon';
      symbol.setAttribute('aria-hidden','true');
      symbol.textContent=item.icon;
      const label=document.createElement('span');
      label.textContent=item.label;
      a.append(symbol,label);dock.appendChild(a);anchors.push(a);
    }
    document.body.appendChild(dock);
    function markCurrent(){
      const path=window.location.pathname.replace(/index\.html$/,'');
      const rootPath=root.pathname;
      let selected='tools';
      if(path===rootPath)selected=window.location.hash==='#calculator'?'solar':'home';
      else if(path.startsWith(rootPath+'electricity-bill/'))selected='bill';
      else if(path.startsWith(rootPath+'discover/'))selected='explore';
      else if(path.startsWith(rootPath+'bill-reader/'))selected='bill';
      for(const a of anchors){
        if(a.dataset.gwDock===selected)a.setAttribute('aria-current','page');
        else a.removeAttribute('aria-current');
      }
    }
    markCurrent();
    window.addEventListener('hashchange',markCurrent);
  }
  function initGharWatt(){wireMenu();wireSolar();wireQuotes();wireMobileDock();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initGharWatt,{once:true});
  else initGharWatt();
  window.GharWattMath=Object.freeze({centralSubsidy,specialStates,regionalExamples,costPerKw,connectionGuidance});
  // Lazy-load the small GharWatt offer after existing calculator/menu setup.
  // Product link and dismiss frequency are handled independently.
  if(document.currentScript?.src){
    const offerScript=document.createElement('script');
    offerScript.src=new URL('affiliate-popup.js',document.currentScript.src).href;
    offerScript.async=true;
    document.head.appendChild(offerScript);
  }

})();
