/* GharWatt Home Energy Studio: browser-side UI, no data sent, explicit local save.
 * OCR text is kept in memory only and must be reviewed before insertion.
 */
(function(){
'use strict';
const M=window.GharWattStudioMath;
const L=window.GharWattStudioI18n||{};
const $=id=>document.getElementById(id);
if(!M||!$('gw-studio-form'))return;
const currency=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
const numeric=new Intl.NumberFormat('en-IN',{maximumFractionDigits:1});
const STORAGE_KEY='gharwatt.home-energy-studio.plan.v1';
const inputIds=['gw-region','gw-discom','gw-units','gw-load','gw-phase','gw-extra','gw-flat','gw-cfa-category','gw-roof','gw-yield','gw-kw','gw-shade','gw-self','gw-export','gw-price'];
let language='en',current=null,quoteResults=[],yieldTouched=false,lastRegion='TG',busy=false,busyAi=false;
const AI_ENDPOINT='https://nnhzihcugvifhegsfmua.supabase.co/functions/v1/gharwatt-ai';
const txt=(id,value)=>{const el=$(id);if(el)el.textContent=String(value)};
const fmt=n=>Number.isFinite(n)?currency.format(n):'—';
const num=n=>Number.isFinite(n)?numeric.format(n):'—';
const T=(key)=>L[language]?.[key]||L.en?.[key]||key;
function p(parent,words,cls){
 const node=document.createElement('p');node.textContent=words;
 if(cls)node.className=cls;parent.appendChild(node);return node;
}
function selected(){return {
 region:$('gw-region').value,discom:$('gw-discom').value,units:$('gw-units').value,
 load:$('gw-load').value,phase:$('gw-phase').value,extra:$('gw-extra').value,
 flatRate:$('gw-flat').value,roof:$('gw-roof').value,yieldRate:$('gw-yield').value,
 kw:$('gw-kw').value,shading:$('gw-shade').value,selfUse:$('gw-self').value,
 exportRate:$('gw-export').value,pricePerKw:$('gw-price').value,
 subsidyEligible:$('gw-eligible').checked&&($('gw-region').value!=='OTHER'||$('gw-cfa-category').value!=='unknown'),
 special:$('gw-region').value==='OTHER'&&$('gw-cfa-category').value==='special'
};}
function quotes(){return M.compareQuotes([0,1,2].map(i=>({
 name:$('gw-q-name-'+i).value,cost:$('gw-q-price-'+i).value,
 kw:$('gw-q-kw-'+i).value,warranty:$('gw-q-warranty-'+i).value,extras:$('gw-q-extras-'+i).value
})));}
function updateDiscom(preserve=false){
 const region=$('gw-region').value,group=M.REGIONS[region]||M.REGIONS.OTHER;
 const category=$('gw-cfa-category');
 if(!preserve&&lastRegion!==region)category.value=region==='OTHER'?'unknown':'standard';
 category.disabled=region!=='OTHER';
 $('gw-discom').replaceChildren();
 for(const name of group.discoms){
  const option=document.createElement('option');option.value=name;option.textContent=name;
  $('gw-discom').appendChild(option);
 }
 $('gw-discom').disabled=group.discoms.length===0;
 $('gw-flat-wrap').hidden=region!=='OTHER';
 $('gw-official-tariff').hidden=!group.source;
 if(group.source)$('gw-official-tariff').href=group.source;
 if(lastRegion!==region&&!yieldTouched&&!preserve)$('gw-yield').value=String(group.yield);
 lastRegion=region;
}
function translate(){
 document.documentElement.lang=language==='te'?'te-IN':language==='hi'?'hi-IN':'en-IN';
 for(const item of document.querySelectorAll('[data-i18n]')){
  const key=item.getAttribute('data-i18n');
  if(T(key)!==key)item.textContent=T(key);
 }
 $('gw-studio-language').value=language;
}
function renderBill(outcome){
 const bill=outcome.now;
 txt('gw-energy-cost',fmt(bill.energy));
 txt('gw-fixed-cost',fmt(bill.fixed));
 txt('gw-bill-total',fmt(bill.total));
 const slab=$('gw-slab-detail');slab.replaceChildren();
 for(const segment of bill.breakdown){
  const label=num(segment.units)+' '+T('unit')+' × ₹'+num(segment.rate)+' = '+fmt(segment.amount);
  const item=document.createElement('span');item.textContent=label;slab.appendChild(item);
 }
 txt('gw-tariff-status',T(bill.region==='TG'?'statusTG':bill.region==='AP'?'statusAP':'statusOTHER'));
}
function renderSolar(outcome,rec,opts){
 const o=outcome;
 txt('gw-after-cost',fmt(o.modeledAfter));
 txt('gw-monthly-saving',fmt(o.modeledSaving));
 txt('gw-after-caption',T('noteSim'));
 txt('gw-percent-saving',T('impact')+': '+num(o.percentage)+'%');
 txt('gw-chart-before',fmt(o.now.total));
 txt('gw-chart-after',fmt(o.modeledAfter));
 $('gw-bar-before').style.width='100%';
 $('gw-bar-after').style.width=(o.now.total>0?Math.max(0,Math.min(100,o.modeledAfter/o.now.total*100)):0)+'%';
 $('gw-bill-chart').setAttribute('aria-label',T('now')+': '+fmt(o.now.total)+'; '+T('withSolar')+': '+fmt(o.modeledAfter));
 txt('gw-production',num(o.monthlyProduction)+' '+T('unit'));
 txt('gw-gross',fmt(o.gross));
 txt('gw-subsidy',o.subsidy>0?fmt(o.subsidy):T('notEligible'));
 txt('gw-net',fmt(o.net));
 txt('gw-payback',Number.isFinite(o.payback)?num(o.payback)+' '+T('years'):T('notReached'));
 txt('gw-solar-method',T('noteSim'));
 const warn=$('gw-connection-note');
 const warnings=language==='en'?o.warnings.slice():[];
 if(language!=='en'){
  const kw=Number(opts.kw),load=Number(opts.load),roof=Number(opts.roof);
  if(kw>load)warnings.push(T('warnLoad'));
  if(Number.isFinite(roof)&&roof>=0&&kw*10>roof)warnings.push(T('warnRoof'));
  if(opts.phase==='single'&&(opts.region==='TG'||opts.region==='AP')&&kw>5)warnings.push(T('warnSingle'));
  if(opts.phase==='unknown'&&kw>3)warnings.push(T('warnUnknown'));
  if(!opts.subsidyEligible)warnings.push(T('warnNotEligible'));
 }
 warn.hidden=warnings.length===0;
 if(warnings.length)warn.textContent=warnings.join(' ');
 if(opts.region==='OTHER'&&$('gw-eligible').checked&&$('gw-cfa-category').value==='unknown'){
  warn.hidden=false;warn.textContent=(warn.hidden?'':warn.textContent+' ')+T('warnCategory');
 }
 const recommendation=$('gw-size-recommendation');recommendation.replaceChildren();
 if(rec.ok&&rec.recommendedKw!==null){
  p(recommendation,T('recommendPrefix')+' '+rec.recommendedKw+' kW. '+T('recommendSuffix'));
  if(rec.recommendedKw!==Number($('gw-kw').value)){
   const button=document.createElement('button');button.type='button';
   button.textContent=T('pickSize')+' · '+rec.recommendedKw+' kW';
   button.addEventListener('click',()=>{$('gw-kw').value=String(rec.recommendedKw);render();});
   recommendation.appendChild(button);
  }
 }else p(recommendation,T('recommendNone'));
}
function renderQuotes(){
 quoteResults=quotes();const valid=quoteResults.filter(q=>q.costPerKw!==null);
 refreshAiPreview();
 for(let i=0;i<3;i++){
  txt('gw-q-normalized-'+i,valid.some(q=>q.index===i)?T('perKw')+': '+fmt(quoteResults[i].costPerKw)+'/kW':T('perKw')+': —');
 }
 const div=$('gw-quote-summary');div.replaceChildren();
 if(valid.length===0){p(div,T('noQuotes'));return;}
 const lowest=Math.min(...valid.map(q=>q.costPerKw));
 p(div,T('quoteLowest')+' '+fmt(lowest)+'/kW');
 for(const q of valid)p(div,q.name+': '+fmt(q.cost)+' · '+num(q.kw)+' kW · '+fmt(q.costPerKw)+'/kW');
 p(div,T('quoteNote'));
}
function promptForQuotes(){
 const valid=quoteResults.filter(q=>q.costPerKw!==null);
 if(!valid.length)return '';
 const clean=valid.map((q,i)=>'Q'+(i+1)+': INR '+Math.round(q.cost)+', '+q.kw+' DC kWp, INR '+Math.round(q.costPerKw)+'/kW.').join(' ');
 return ('Compare these Indian residential rooftop solar quotes using only the verified numeric details shown. No vendor endorsement, no invented specifications or savings. '+clean+' State which is lowest per kW, explain why cheapest is not always best, and give 3 checks: equipment, warranty, GST/metering scope. Do not claim subsidy eligibility.').slice(0,550);
}
function refreshAiPreview(){
 const preview=$('gw-ai-quote-preview'),send=$('gw-ai-quote-send');
 if(!preview||!send)return;
 preview.value=promptForQuotes();
 send.disabled=busyAi||!preview.value||!$('gw-ai-quote-consent').checked;
}
async function sendQuotesToAI(){
 if(busyAi)return;
 const message=promptForQuotes();
 if(!message){txt('gw-ai-quote-status',T('aiNeedQuotes'));return;}
 if(!$('gw-ai-quote-consent').checked){txt('gw-ai-quote-status',T('aiNeedConsent'));return;}
 let visitorId=null;
 try{
  visitorId=window.GharWattAIClient?.getOrCreateBrowserId(
   window.localStorage,()=>window.crypto.randomUUID());
 }catch{}
 if(!visitorId){txt('gw-ai-quote-status',T('storageError'));return;}
 busyAi=true;refreshAiPreview();
 $('gw-ai-quote-answer').hidden=true;
 txt('gw-ai-quote-status',T('aiThinking'));
 try{
  const resp=await fetch(AI_ENDPOINT,{method:'POST',
   headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify({consent:true,visitorId,shareBill:false,context:null,message,history:[]}),
   cache:'no-store',signal:AbortSignal.timeout(25000)});
  const data=await resp.json();
  if(!resp.ok||data?.ok!==true||typeof data.answer!=='string'){
   txt('gw-ai-quote-status',typeof data?.error==='string'?data.error:T('aiUnavailable'));
   return;
  }
  $('gw-ai-quote-answer').textContent=data.answer.slice(0,1700);
  $('gw-ai-quote-answer').hidden=false;
  txt('gw-ai-quote-status',T('aiReady')+' '+(Number.isFinite(data.remainingToday)?data.remainingToday+' requests remain today.':''));
 }catch{
  txt('gw-ai-quote-status',T('aiUnavailable'));
 }finally{
  $('gw-ai-quote-consent').checked=false;
  busyAi=false;refreshAiPreview();
 }
}
function renderActions(){
 const actions=$('gw-plan-actions');actions.replaceChildren();
 const ol=document.createElement('ol');
 for(const key of ['action1','action2','action3']){
  const li=document.createElement('li');li.textContent=T(key);ol.appendChild(li);
 }
 actions.appendChild(ol);
}
function renderReport(){
 const summary=$('gw-report-summary'),lines=$('gw-report-quote-lines');
 summary.replaceChildren();lines.replaceChildren();
 txt('gw-report-date',new Date().toLocaleDateString(language==='te'?'te-IN':language==='hi'?'hi-IN':'en-IN'));
 if(!current){p(summary,T('invalid'));return;}
 const o=current;
 const fields=[
  [T('state'),T(o.now.region==='TG'?'tg':o.now.region==='AP'?'ap':'other')],
  [T('units'),num(o.now.units)],
  [T('before'),fmt(o.now.total)],
  [T('kw'),num(Number($('gw-kw').value))+' kW'],
  [T('after'),fmt(o.modeledAfter)],
  [T('monthlySavings'),fmt(o.modeledSaving)],
  [T('production'),num(o.monthlyProduction)+' '+T('unit')],
  [T('gross'),fmt(o.gross)],
  [T('subsidy'),o.subsidy>0?fmt(o.subsidy):T('notEligible')],
  [T('net'),fmt(o.net)],
  [T('payback'),Number.isFinite(o.payback)?num(o.payback)+' '+T('years'):T('notReached')]
 ];
 for(const [label,value] of fields){
  const row=document.createElement('p'),head=document.createElement('strong');
  head.textContent=label+': ';row.appendChild(head);row.appendChild(document.createTextNode(value));summary.appendChild(row);
 }
 for(const q of quoteResults.filter(q=>q.costPerKw!==null)){
  p(lines,q.name+' — '+fmt(q.cost)+' / '+num(q.kw)+' kW = '+fmt(q.costPerKw)+'/kW. '+q.warranty+' '+q.extras);
 }
}
function render(){
 const opts=selected(),result=M.simulate(opts);
 if(!result.ok){
  current=null;
  txt('gw-tariff-status',result.error||T('invalid'));
  for(const id of ['gw-energy-cost','gw-fixed-cost','gw-bill-total','gw-after-cost','gw-monthly-saving','gw-chart-before','gw-chart-after','gw-production','gw-gross','gw-subsidy','gw-net','gw-payback'])txt(id,'—');
  $('gw-slab-detail').replaceChildren();
  $('gw-size-recommendation').textContent=T('invalid');
  $('gw-connection-note').hidden=true;
 }else{
  current=result;
  renderBill(result);
  renderSolar(result,M.recommendation(opts),opts);
 }
 renderQuotes();renderActions();renderReport();
}
function getSaveData(){
 const fields={};
 for(const id of inputIds)fields[id]=$(id).value;
 fields['gw-eligible']=$('gw-eligible').checked;
 return {version:1,fields,quotes:[0,1,2].map(i=>({
  name:$('gw-q-name-'+i).value.slice(0,60),price:$('gw-q-price-'+i).value,
  kw:$('gw-q-kw-'+i).value,warranty:$('gw-q-warranty-'+i).value.slice(0,120),
  extras:$('gw-q-extras-'+i).value.slice(0,200)
 })),language};
}
function save(){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(getSaveData()));txt('gw-save-status',T('saved'));}
 catch{txt('gw-save-status',T('storageError'));}
}
function restore(){
 try{
  const raw=localStorage.getItem(STORAGE_KEY);if(!raw){txt('gw-save-status',T('noSaved'));return;}
  const data=JSON.parse(raw);if(data?.version!==1||!data.fields)throw Error('Invalid');
  for(const id of inputIds){if(Object.prototype.hasOwnProperty.call(data.fields,id)&&$(id))$(id).value=String(data.fields[id]).slice(0,100);}
  $('gw-eligible').checked=data.fields['gw-eligible']===true;
  language=['en','te','hi'].includes(data.language)?data.language:'en';
  translate();updateDiscom(true);
  if(data.fields['gw-discom'])$('gw-discom').value=data.fields['gw-discom'];
  if(Array.isArray(data.quotes))for(let i=0;i<Math.min(data.quotes.length,3);i++){
   const q=data.quotes[i]||{};
   for(const key of ['name','price','kw','warranty','extras'])if($('gw-q-'+key+'-'+i))$('gw-q-'+key+'-'+i).value=String(q[key]??'').slice(0,200);
  }
  txt('gw-save-status',T('restored'));render();
 }catch{txt('gw-save-status',T('storageError'));}
}
function clearSaved(){
 try{localStorage.removeItem(STORAGE_KEY);txt('gw-save-status',T('cleared'));}
 catch{txt('gw-save-status',T('storageError'));}
}
function download(){
 const report=$('gw-print-report').innerText||$('gw-print-report').textContent;
 const blob=new Blob([report+'\n\nhttps://chennamatta889.github.io/gharwatt/methodology/\n'],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='GharWatt-home-energy-report.txt';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function samples(){
 const examples=[
  {name:'Sample A — fictional',price:180000,kw:3,warranty:'Panel 12y · inverter 5y',extras:'Example, verify GST and metering'},
  {name:'Sample B — fictional',price:195000,kw:3.3,warranty:'Panel 15y · inverter 7y',extras:'Example, verify mounting and scope'},
  {name:'Sample C — fictional',price:270000,kw:5,warranty:'Panel 12y · inverter 8y',extras:'Example, verify workmanship'}
 ];
 for(let i=0;i<3;i++)for(const k of ['name','price','kw','warranty','extras'])$('gw-q-'+k+'-'+i).value=String(examples[i][k]);
 txt('gw-quote-status',T('sampleLoaded'));render();
}
function loadScript(src,verify){
 return new Promise((resolve,reject)=>{
  if(verify()){resolve();return;}
  const js=document.createElement('script');js.src=src;js.referrerPolicy='no-referrer';
  js.onload=()=>verify()?resolve():reject(new Error('Library did not initialize'));
  js.onerror=()=>reject(new Error('Library not available'));
  document.head.appendChild(js);
 });
}
async function readPdf(file){
 const modulePath=new URL('../../vendor/pdf.min.mjs',document.baseURI).href;
 const workerPath=new URL('../../vendor/pdf.worker.min.mjs',document.baseURI).href;
 const pdf=await import(modulePath);
 pdf.GlobalWorkerOptions.workerSrc=workerPath;
 const doc=await pdf.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
 try{
  let content='';
  for(let i=1;i<=Math.min(doc.numPages,3);i++){
   const page=await doc.getPage(i);
   const text=await page.getTextContent();
   content+=' '+text.items.map(t=>t.str||'').join(' ');
   if(content.length>30000)break;
  }
  if(!content.trim())throw Error('Scanned PDF without text');
  return content;
 }finally{await doc.destroy();}
}
async function resizedCanvas(file){
 let bitmap=null;
 try{bitmap=await createImageBitmap(file);}
 catch{throw Error('Image cannot be decoded');}
 try{
  const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  return canvas;
 }finally{bitmap.close();}
}
async function readImage(file){
 await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js',()=>!!window.Tesseract?.createWorker);
 let worker=null;
 try{
  worker=await window.Tesseract.createWorker('eng');
  const canvas=await resizedCanvas(file);
  const result=await worker.recognize(canvas);
  return result?.data?.text||'';
 }finally{if(worker)await worker.terminate().catch(()=>{});}
}
function resetReview(){
 $('gw-ocr-review').hidden=true;
 for(const id of ['gw-ocr-cost','gw-ocr-kw','gw-ocr-panel','gw-ocr-inverter'])$(id).value='';
}
async function scan(){
 if(busy)return;
 const file=$('gw-ocr-file').files?.[0];
 if(!file){txt('gw-ocr-status',T('chooseFile'));return;}
 const pdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name);
 const image=['image/jpeg','image/png','image/webp'].includes(file.type);
 if((!pdf&&!image)||(pdf&&file.size>12*1024*1024)||(image&&file.size>8*1024*1024)){
  txt('gw-ocr-status',T('docTooLarge'));return;
 }
 busy=true;resetReview();$('gw-ocr-read').disabled=true;txt('gw-ocr-status',T('ocrWorking'));
 try{
  const text=pdf?await readPdf(file):await readImage(file);
  const parsed=M.parseQuoteText(text);
  if(parsed.cost!==null)$('gw-ocr-cost').value=String(parsed.cost);
  if(parsed.kw!==null)$('gw-ocr-kw').value=String(parsed.kw);
  if(parsed.panelWarranty!==null)$('gw-ocr-panel').value=String(parsed.panelWarranty);
  if(parsed.inverterWarranty!==null)$('gw-ocr-inverter').value=String(parsed.inverterWarranty);
  $('gw-ocr-review').hidden=false;
  txt('gw-ocr-status',T('ocrReady')+' '+parsed.confidence);
 }catch(e){
  txt('gw-ocr-status',T('ocrFailed')+' '+(pdf?T('pdfFallback'):''));
 }finally{busy=false;$('gw-ocr-read').disabled=false;}
}
function acceptScan(){
 if($('gw-ocr-review').hidden)return;
 const idx=Number($('gw-ocr-target').value),cost=M.finiteNumber($('gw-ocr-cost').value,1,1e8),kw=M.finiteNumber($('gw-ocr-kw').value,.1,100);
 if(cost===null||kw===null){txt('gw-ocr-status',T('invalid'));return;}
 $('gw-q-price-'+idx).value=String(cost);
 $('gw-q-kw-'+idx).value=String(kw);
 const warranty=[];
 const panel=M.finiteNumber($('gw-ocr-panel').value,1,40),inverter=M.finiteNumber($('gw-ocr-inverter').value,1,30);
 if(panel!==null)warranty.push('Panel '+panel+'y');
 if(inverter!==null)warranty.push('Inverter '+inverter+'y');
 if(warranty.length)$('gw-q-warranty-'+idx).value=warranty.join(' · ');
 $('gw-ocr-review').hidden=true;txt('gw-ocr-status',T('ocrAccepted'));render();
}
async function loadAffiliate(){
 try{
  const r=await fetch(new URL('../assets/affiliate-links.json',document.baseURI),{cache:'no-store'});
  if(!r.ok)return;
  const offer=(await r.json())?.products?.['energy-meter'];
  if(!offer||typeof offer.profit_link!=='string')return;
  const u=new URL(offer.profit_link);
  if(u.protocol!=='https:'||!offer.product_name?.trim())return;
  $('gw-meter-affiliate').href=u.href;
  // This is paid placement disclosure, not a performance recommendation.
 }catch{}
}
$('gw-studio-form').addEventListener('submit',event=>event.preventDefault());
$('gw-studio-form').addEventListener('input',e=>{
 if(e.target.id==='gw-yield')yieldTouched=true;
 if(e.target.closest('#gw-quote-cards'))$('gw-ai-quote-consent').checked=false;
 render();
});
$('gw-studio-form').addEventListener('change',e=>{
 if(e.target.id==='gw-region')updateDiscom();
 render();
});
$('gw-studio-language').addEventListener('change',e=>{
 language=['en','te','hi'].includes(e.target.value)?e.target.value:'en';
 translate();render();
});
$('gw-samples').addEventListener('click',samples);
$('gw-ai-quote-consent').addEventListener('change',refreshAiPreview);
$('gw-ai-quote-send').addEventListener('click',sendQuotesToAI);
$('gw-save').addEventListener('click',save);
$('gw-restore').addEventListener('click',restore);
$('gw-clear-saved').addEventListener('click',clearSaved);
$('gw-print').addEventListener('click',()=>window.print());
$('gw-download').addEventListener('click',download);
$('gw-ocr-read').addEventListener('click',scan);
$('gw-ocr-accept').addEventListener('click',acceptScan);
$('gw-ocr-file').addEventListener('change',()=>{resetReview();txt('gw-ocr-status','');});
updateDiscom(true);translate();render();loadAffiliate();
window.GharWattStudio={render,selected,quotes};
})();
