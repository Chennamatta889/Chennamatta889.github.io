/* GharWatt V2: browser-only electricity decision tools. No bill image or personal data is sent to our server. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const number=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(n);
const valid=(n,min,max)=>n!==null&&n!==undefined&&typeof n!=='boolean'&&String(n).trim()!==''&&Number.isFinite(Number(n))&&Number(n)>=min&&Number(n)<=max;
const set=(id,text)=>{let el=$(id);if(el)el.textContent=text;};
const read=(id)=>$(id)?.value;
const lineMatch=(lines,labels)=>{
 for(const label of labels){for(const line of lines){
 if(!label.test(line))continue;
 const after=line.replace(label,'').replace(/^[\s:–-]+/,'');
 const nums=[...after.matchAll(/(?:₹|Rs\.?|INR)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+(?:\.\d{1,2})?|[0-9]+(?:\.\d{1,2})?)/gi)].map(x=>Number(x[1].replace(/,/g,'')));
 if(nums.length)return nums[0];
 }}return null;
};
function parseBillText(raw){
 const lines=String(raw||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,400);
 const amount=lineMatch(lines,[/^rounded\s+bill\b[\s:–-]*/i,/^(?:amount\s+(?:payable|due)|total\s+(?:due|payable)|payable\s+amount)\b[\s:–-]*/i,/^(?:net\s+bill\s+amount|bill\s+amount|total\s+bill\s+amount)\b[\s:–-]*/i,/^grand\s+total\b[\s:–-]*/i,/^current\s+bill\s+amount\b[\s:–-]*/i]);
 const units=lineMatch(lines,[/^(?:units\s+(?:consumed|billed)|(?:total\s+)?consumption\s*\(?(?:kwh|units)?\)?|billed\s+units|energy\s+consumed\s*\(?(?:kwh)?\)?)\b[\s:–-]*/i]);
 const days=lineMatch(lines,[/^(?:billing\s+(?:days|period\s+days)|number\s+of\s+days)\b[\s:–-]*/i]);
 const currentCharges=lineMatch(lines,[/^total\s+(?:current\s+)?charges?\b[\s:–-]*/i,/^current\s+charges?\b[\s:–-]*/i]);
 const arrears=lineMatch(lines,[/^total\s+arrears\b[\s:–-]*/i,/^net\s+arrears\b[\s:–-]*/i]);
 return {amount:valid(amount,0,500000)?amount:null,units:valid(units,0,100000)?units:null,days:valid(days,1,120)?days:null,
  currentCharges:valid(currentCharges,0,500000)?currentCharges:null,
  arrears:valid(arrears,0,500000)?arrears:null};
}
/* A missing label or unreliable OCR must not become a fabricated zero. */
function assessBillText(raw,result,confidence=null){
 const text=String(raw||'').trim();
 const recognized=['amount','units','days','currentCharges','arrears'].filter(k=>result?.[k]!==null&&result?.[k]!==undefined).length;
 const scanned=confidence!==null&&Number.isFinite(Number(confidence));
 const lowConfidence=scanned&&Number(confidence)<65;
 // Recognizing one plausible-looking value is not enough to fill a bill automatically.
 // A manually pasted/extracted PDF line can still display as a candidate.
 const readable=text.length>=12&&recognized>=(scanned?2:1)&&!lowConfidence;
 return {readable,recognized,lowConfidence,
  message:readable?'Possible values found. Check every number against your original bill.':
   lowConfidence?'The photo is too unclear for reliable extraction. Ignore the scanned numbers and try a focused crop or manual entry.':
   scanned?'The scanner did not reliably identify enough bill fields. Do not use this text for calculations. Select a smaller amount or meter area and retry, or enter details manually.':
   'Could not identify bill amount or units in this text. The document may be garbled. Use a clearer image or enter the numbers manually.'};
}
function ocrPageSegMode(focused){return focused?'6':'11';}
function compareBills(a,b){
 if(![a,b].every(x=>x&&valid(x.amount,0,500000)&&valid(x.days,1,120)))return null;
 const x=Number(a.amount),y=Number(b.amount),xd=Number(a.days),yd=Number(b.days);
 const change=x?((y-x)/x*100):null;
 const perDayA=x/xd,perDayB=y/yd;
 const uKnown=valid(a.units,0,100000)&&valid(b.units,0,100000);
 const ua=uKnown?Number(a.units):null,ub=uKnown?Number(b.units):null;
 return {amountBefore:x,amountAfter:y,rupeeChange:y-x,percentChange:change,perDayBefore:perDayA,perDayAfter:perDayB,perDayChange:perDayB-perDayA,unitsKnown:uKnown,unitsBefore:ua,unitsAfter:ub,unitChange:uKnown?ub-ua:null,unitPerDayBefore:uKnown?ua/xd:null,unitPerDayAfter:uKnown?ub/yd:null};
}
function applianceUse(rows,rate,days=30){
 if(!Array.isArray(rows)||rows.length===0||rows.length>35||!valid(rate,0,30)||!valid(days,1,366))return null;
 let total=0,items=[];
 for(const x of rows){
 if(!x||!valid(x.watts,1,10000)||!valid(x.hours,0,24)||!valid(x.count,1,30)||!Number.isInteger(Number(x.count)))return null;
 const kwh=Number(x.watts)*Number(x.hours)*Number(x.count)*Number(days)/1000;
 total+=kwh;items.push({name:String(x.name||'Appliance').slice(0,80),units:kwh,cost:kwh*Number(rate)});
 }
 return {units:total,cost:total*Number(rate),items:items.sort((x,y)=>y.units-x.units)};
}
function savingsGoal(current,target,rate,days=30){
 if(!valid(current,0,500000)||!valid(target,0,500000)||!valid(rate,0.5,30))return null;
 const gap=Math.max(0,Number(current)-Number(target));
 return {gap,unitTarget:gap/Number(rate),dailyUnitTarget:gap/Number(rate)/Number(days),percent:Number(current)>0?gap/Number(current)*100:0};
}
function loanEmi(principal,apr,months){
 if(!valid(principal,0,10000000)||!valid(apr,0,36)||!Number.isInteger(Number(months))||!valid(months,1,360))return null;
 const p=Number(principal),r=Number(apr)/1200,n=Number(months);
 const emi=r===0?p/n:p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
 return {emi,total:emi*n,interest:emi*n-p};
}
const sampleAppliances=Object.freeze({fan:{label:'Ceiling fan',watts:65,hours:10},led:{label:'LED bulb',watts:9,hours:5},ac:{label:'Air conditioner',watts:1500,hours:6},tv:{label:'Television',watts:80,hours:5},geyser:{label:'Electric geyser',watts:2000,hours:1},cooler:{label:'Air cooler',watts:150,hours:8},pump:{label:'Water pump',watts:900,hours:1},other:{label:'Other appliance',watts:100,hours:4}});
function makeShare(buttonId,textFunction,statusId){
 const b=$(buttonId);if(!b)return;
 b.addEventListener('click',async()=>{
  const text=textFunction();if(!text)return;
  try{if(navigator.share){await navigator.share({title:'GharWatt summary',text});set(statusId,'Sharing opened.');}
  else if(navigator.clipboard){await navigator.clipboard.writeText(text);set(statusId,'Summary copied. You can paste it into WhatsApp.');}
  else set(statusId,'Use your browser’s share or copy feature.');}
  catch(e){if(e&&e.name!=='AbortError')set(statusId,'Could not share; please copy the results manually.');}
 });
}
/* Resize very large bill photos before OCR to reduce mobile memory and processing time.
   Never upscale smaller images: tiny text still needs a sufficiently clear source. */
function ocrResizePlan(width,height,maxEdge=1800,maxPixels=2000000){
 const w=Number(width),h=Number(height);
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0||w>50000||h>50000)return null;
 const scale=Math.min(1,Number(maxEdge)/Math.max(w,h),Math.sqrt(Number(maxPixels)/(w*h)));
 return Object.freeze({width:Math.max(1,Math.round(w*scale)),height:Math.max(1,Math.round(h*scale)),resized:scale<0.999});
}
/* Optional lightweight automatic contrast normalization, applied only to small resized images.
   This does not recover detail missing from the original photo. */
function enhanceBillPixels(bytes,width,height){
 if(!bytes||!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||bytes.length!==width*height*4)return false;
 const counts=new Uint32Array(256);
 for(let p=0;p<bytes.length;p+=4*8){
  const gray=Math.round(bytes[p]*.299+bytes[p+1]*.587+bytes[p+2]*.114);
  counts[gray]++;
 }
 let total=0;for(const count of counts)total+=count;
 const loTarget=Math.floor(total*.006),hiTarget=Math.floor(total*.994);
 let seen=0,low=0,high=255;
 for(let i=0;i<256;i++){seen+=counts[i];if(seen>=loTarget){low=i;break}}
 seen=0;for(let i=0;i<256;i++){seen+=counts[i];if(seen>=hiTarget){high=i;break}}
 if(high-low<30)return false;
 const factor=255/(high-low);
 for(let p=0;p<bytes.length;p+=4){
  const gray=bytes[p]*.299+bytes[p+1]*.587+bytes[p+2]*.114;
  const out=Math.max(0,Math.min(255,Math.round((gray-low)*factor)));
  bytes[p]=bytes[p+1]=bytes[p+2]=out;
 }
 return true;
}
function initReader(){
 if(!$('v2-reader'))return;
 const status=$('v2-ocr-status'),button=$('v2-read-photo'),cancel=$('v2-ocr-cancel'),progress=$('v2-ocr-progress');
 let scriptLoad=null,pdfScriptLoad=null,sharedWorker=null,workerLoad=null,currentJob=null;
 function show(confidence=null){
  const r=parseBillText(read('v2-ocr-text'));
  const quality=assessBillText(read('v2-ocr-text'),r,confidence);
  set('v2-ocr-amount',!quality.readable?'Unreliable scan':r.amount===null?'Not found — enter manually':money(r.amount));
  set('v2-ocr-units',!quality.readable?'Unreliable scan':r.units===null?'Not found — check your bill':number(r.units)+' units');
  set('v2-ocr-days',!quality.readable?'Unreliable scan':r.days===null?'Not found':r.days+' days');
  if(quality.readable){
   if(r.amount!==null)$('v2-confirm-amount').value=r.amount;
   if(r.units!==null)$('v2-confirm-units').value=r.units;
   if(r.days!==null&&$('v2-confirm-days'))$('v2-confirm-days').value=r.days;
   if(r.currentCharges!==null&&$('v2-confirm-current'))$('v2-confirm-current').value=r.currentCharges;
   if(r.arrears!==null&&$('v2-confirm-arrears'))$('v2-confirm-arrears').value=r.arrears;
  }
  set('v2-ocr-status',quality.message);
  return quality;
 }
 $('v2-extract').addEventListener('click',show);
 function updateProgress(message,value){
  if(!currentJob)return;
  status.textContent=message;
  if(!progress)return;
  progress.hidden=false;
  if(typeof value==='number'){progress.value=Math.max(0,Math.min(100,Math.round(value)))}
  else progress.removeAttribute('value'); // indeterminate while downloading/initializing
 }
 function showIdle(){
  button.disabled=false;
  if(cancel)cancel.hidden=true;
  if(progress)progress.hidden=true;
 }
 function discardWorker(){
  const worker=sharedWorker,loading=workerLoad;
  sharedWorker=null;workerLoad=null;
  if(worker){try{Promise.resolve(worker.terminate()).catch(()=>{})}catch{}}
  else if(loading){loading.then(w=>w?.terminate?.()).catch(()=>{})}
 }
 function stopReading(message){
  const job=currentJob;if(!job)return;
  job.cancelled=true;
  job.rejectCancel?.(new Error('stopped'));
  currentJob=null;
  discardWorker();
  showIdle();
  set('v2-ocr-status',message||'Photo reading stopped. You can type the amount and units manually below.');
 }
 if(cancel)cancel.addEventListener('click',()=>stopReading('Stopped. You can choose a smaller photo or enter the bill numbers manually.'));
 function limit(promise,ms,label,job){
  let timeout;
  const deadline=new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error(label)),ms)});
  return Promise.race([Promise.resolve(promise),deadline,job.cancelPromise]).finally(()=>clearTimeout(timeout));
 }
 async function library(){
  if(window.Tesseract?.createWorker)return;
  if(scriptLoad)return scriptLoad;
  scriptLoad=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src='https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js';
   script.referrerPolicy='no-referrer';
   script.onload=()=>window.Tesseract?.createWorker?resolve():reject(new Error('OCR library unavailable'));
   script.onerror=()=>reject(new Error('OCR library download blocked'));
   document.head.appendChild(script);
  }).catch(e=>{scriptLoad=null;throw e});
  return scriptLoad;
 }
 function getWorker(){
  if(sharedWorker)return Promise.resolve(sharedWorker);
  if(workerLoad)return workerLoad;
  let started;
  const initializing=window.Tesseract.createWorker('eng',1,{logger:e=>{
   const job=currentJob;
   if(!job||job.cancelled||!e)return;
   if(e.status==='recognizing text'&&Number.isFinite(e.progress)){
    const pct=Math.max(0,Math.min(100,Math.round(e.progress*100)));
    if(progress){progress.hidden=false;progress.value=pct;}
    if(pct===100||pct>=job.lastReported+10){
     job.lastReported=pct;
     status.textContent='Reading your bill: '+pct+'% complete. Keep this tab open.';
    }
   }else if(e.status&&/loading language|loading tesseract|initializing|core/i.test(e.status)){
    updateProgress('Preparing the text reader: '+String(e.status).slice(0,65)+'…');
   }
  }});
  // A cancelled initialisation must not resurrect a terminated worker during the next attempt.
  started=initializing.then(w=>{
   if(workerLoad!==started){
    try{Promise.resolve(w.terminate()).catch(()=>{})}catch{}
    throw new Error('OCR initialization cancelled');
   }
   sharedWorker=w;
   return w;
  }).catch(e=>{if(workerLoad===started)workerLoad=null;throw e});
  workerLoad=started;
  return started;
 }
 async function pdfReader(){
  if(window.pdfjsLib?.getDocument)return;
  if(pdfScriptLoad)return pdfScriptLoad;
  pdfScriptLoad=new Promise((resolve,reject)=>{
   const js=document.createElement('script');
   js.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
   js.referrerPolicy='no-referrer';
   js.onload=()=>window.pdfjsLib?.getDocument?resolve():reject(new Error('PDF text reader unavailable'));
   js.onerror=()=>reject(new Error('PDF text reader download blocked'));
   document.head.appendChild(js);
  }).catch(e=>{pdfScriptLoad=null;throw e});
  return pdfScriptLoad;
 }
 async function extractPdf(file,job){
  updateProgress('Downloading the PDF text reader on your device…');
  await limit(pdfReader(),30000,'PDF reader download was too slow',job);
  if(job.cancelled)return '';
  // Only text-based PDFs are processed: scanned PDFs should use a photo/manual entry.
  const pdfjs=window.pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const data=new Uint8Array(await file.arrayBuffer());
  const task=pdfjs.getDocument({data,isEvalSupported:false});
  let pdf;
  try{
   pdf=await limit(task.promise,45000,'PDF decoding was too slow',job);
   const blocks=[];
   for(let index=1;index<=Math.min(5,pdf.numPages);index++){
    if(job.cancelled)return '';
    updateProgress('Reading selectable text from PDF page '+index+' of '+Math.min(pdf.numPages,5)+'…',Math.round((index-1)/Math.min(pdf.numPages,5)*100));
    const page=await limit(pdf.getPage(index),18000,'PDF page timed out',job);
    const txt=await limit(page.getTextContent(),18000,'PDF text extraction timed out',job);
    const lines=new Map();
    for(const item of txt.items||[]){
     const fragment=String(item.str||'').trim();
     if(!fragment)continue;
     const transform=item.transform||[];
     const y=Math.round((Number(transform[5])||0)/3)*3;
     const x=Number(transform[4])||0;
     if(!lines.has(y))lines.set(y,[]);
     lines.get(y).push({x,fragment});
    }
    blocks.push([...lines.entries()].sort((a,b)=>b[0]-a[0]).map(([,items])=>items.sort((a,b)=>a.x-b.x).map(item=>item.fragment).join(' ')).join('\n'));
    page.cleanup?.();
   }
   return blocks.join('\n').slice(0,16000);
  }finally{try{await pdf?.destroy?.()}catch{}}
 }
 async function preparedPhoto(file){
  let bitmap=null,image=null,objectURL=null;
  try{
   if(typeof createImageBitmap==='function'){
    bitmap=await createImageBitmap(file);
    image=bitmap;
   }else{
    objectURL=URL.createObjectURL(file);
    image=await new Promise((resolve,reject)=>{
     const i=new Image();
     i.onload=()=>resolve(i);
     i.onerror=()=>reject(new Error('Could not open photo'));
     i.src=objectURL;
    });
   }
   const w=image.width||image.naturalWidth,h=image.height||image.naturalHeight;
   const focus=window.GharWattCrop?.getSelection?.();
   const sx=focus?Math.floor(w*focus.x):0,sy=focus?Math.floor(h*focus.y):0;
   const sw=focus?Math.max(1,Math.min(w-sx,Math.round(w*focus.width))):w;
   const sh=focus?Math.max(1,Math.min(h-sy,Math.round(h*focus.height))):h;
   const basePlan=ocrResizePlan(sw,sh);
   if(!basePlan)throw new Error('Invalid image dimensions');
   const improve=Boolean($('v2-improve-contrast')?.checked);
   const scale=focus?Math.min(2,1800/Math.max(sw,sh),Math.sqrt(2000000/(sw*sh))):1;
   const plan=focus?{width:Math.max(1,Math.round(sw*scale)),height:Math.max(1,Math.round(sh*scale)),resized:true}:basePlan;
   if(!focus&&!improve&&!plan.resized&&file.size<=2000000)return {blob:file,compressed:false,plan};
   const canvas=document.createElement('canvas');canvas.width=plan.width;canvas.height=plan.height;
   const ctx=canvas.getContext('2d',{alpha:false});
   if(!ctx)throw new Error('Image resizing not supported');
   ctx.fillStyle='#fff';ctx.fillRect(0,0,plan.width,plan.height);
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   ctx.drawImage(image,sx,sy,sw,sh,0,0,plan.width,plan.height);
   if(improve){
    try{
     const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
     if(enhanceBillPixels(pixels.data,canvas.width,canvas.height))ctx.putImageData(pixels,0,0);
    }catch{/* A blocked canvas enhancement must never stop normal local OCR. */}
   }
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Photo processing failed')),'image/jpeg',.88));
   canvas.width=0;canvas.height=0;
   return {blob,compressed:true,plan};
  }finally{
   if(bitmap&&typeof bitmap.close==='function')bitmap.close();
   if(objectURL)URL.revokeObjectURL(objectURL);
  }
 }
 button.addEventListener('click',async()=>{
  if(currentJob)return;
  const file=$('v2-photo').files?.[0];
  if(!file){set('v2-ocr-status','Choose a photo, or enter the amount and units manually below.');return;}
  const isPdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name);
  if((isPdf&&file.size>12*1024*1024)||(!isPdf&&(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>9*1024*1024))){
   set('v2-ocr-status','Use a PDF smaller than 12 MB or a JPG, PNG or WebP photo smaller than 9 MB.');return;
  }
  let rejectCancel;
  const job={cancelled:false,lastReported:-10,cancelPromise:new Promise((_,reject)=>{rejectCancel=reject})};
  job.rejectCancel=rejectCancel;currentJob=job;
  button.disabled=true;if(cancel)cancel.hidden=false;
  try{
   if(isPdf){
    const extracted=await limit(extractPdf(file,job),100000,'PDF reading was too slow',job);
    if(job.cancelled)return;
    if(!extracted.trim()){set('v2-ocr-status','This PDF contains no selectable text (it may be a scan). Try an image of the relevant bill area or enter details manually.');return;}
    $('v2-ocr-text').value=extracted;
    const quality=show();
    if(quality.readable)set('v2-ocr-status','Possible fields extracted from the PDF. Check the original bill and table values before confirming.');
    return;
   }
   updateProgress('Preparing a smaller image for faster local recognition…',undefined);
   const image=await limit(preparedPhoto(file),12000,'Photo preparation took too long',job);
   if(job.cancelled)return;
   updateProgress('Loading the OCR reader (first use downloads language data)…',undefined);
   await limit(library(),22000,'OCR download was too slow or blocked',job);
   if(job.cancelled)return;
   updateProgress('Starting the text-recognition engine…',undefined);
   const worker=await limit(getWorker(),40000,'The OCR engine took too long to start',job);
   if(job.cancelled)return;
   updateProgress(image.compressed?'Reading optimized photo…':'Reading photo…',0);
   // Sparse text for a full multi-column bill; single text block for a focused region.
   const focused=Boolean(window.GharWattCrop?.getSelection?.());
   await limit(worker.setParameters({
    tessedit_pageseg_mode:ocrPageSegMode(focused),
    preserve_interword_spaces:'1'
   }),10000,'OCR layout setup took too long',job);
   if(job.cancelled)return;
   const result=await limit(worker.recognize(image.blob),30000,'Reading the photo took too long',job);
   if(job.cancelled)return;
   const fresh=String(result?.data?.text||'').trim();
   const append=Boolean($('v2-ocr-add-mode')?.checked);
   const earlier=read('v2-ocr-text').trim();
   $('v2-ocr-text').value=(append&&earlier?earlier+'\n'+fresh:fresh).slice(0,16000);
   if(progress){progress.value=100;}
   const quality=show(result?.data?.confidence??null);
   if(quality.readable)set('v2-ocr-status','Possible fields extracted from this photo. Verify them with the printed bill before using them.');
   // Otherwise retain the prominent warning from show().
  }catch(e){
   if(job.cancelled)return;
   discardWorker();
   const detail=String(e?.message||'').toLowerCase();
   if(/slow|long|blocked|unavailable|download/.test(detail))
    set('v2-ocr-status','The reader could not finish. Your network or phone may be slowing it down. Try cropping the photo to the bill details, changing network, or typing the amount and units below.');
   else set('v2-ocr-status','Could not read this photo. Try a clearer, cropped photo or enter your bill amount and units manually.');
  }finally{
   if(currentJob===job){currentJob=null;showIdle();}
  }
 });
 $('v2-photo').addEventListener('change',()=>{
  if(currentJob)stopReading('Photo selection changed; choose Read photo to start again.');
  else set('v2-ocr-status','File selected. PDFs with selectable text are read without OCR; photos use local OCR. Or enter the amount manually.');
 });
 $('v2-clear').addEventListener('click',()=>{
  if(currentJob)stopReading('Photo reading stopped and cleared.');
  ['v2-ocr-text','v2-confirm-amount','v2-confirm-units','v2-confirm-current','v2-confirm-arrears','v2-confirm-days'].forEach(id=>{if($(id))$(id).value=''});
  $('v2-photo').value='';
  ['v2-ocr-amount','v2-ocr-units','v2-ocr-days'].forEach(id=>set(id,'—'));
  set('v2-ocr-status','Photo, PDF and recognized text cleared from this page.');
  window.dispatchEvent(new CustomEvent('gharwatt:bill-clear'));
 });
 $('v2-confirm').addEventListener('click',()=>{
  const a=read('v2-confirm-amount'),u=read('v2-confirm-units'),d=read('v2-confirm-days'),current=read('v2-confirm-current'),arrears=read('v2-confirm-arrears');
  if(!valid(a,0,500000)){set('v2-ocr-status','Please enter a valid amount in rupees.');return;}
  if(!valid(d,1,120)||!Number.isInteger(Number(d))){set('v2-ocr-status','Please check the billing period. Enter a whole number from 1 to 120 days.');return;}
  if(String(u).trim()!==''&&!valid(u,0,100000)){set('v2-ocr-status','Please correct the optional units consumed field.');return;}
  if(String(current).trim()!==''&&!valid(current,0,500000)){set('v2-ocr-status','Please correct the current charges.');return;}
  if(String(arrears).trim()!==''&&!valid(arrears,0,500000)){set('v2-ocr-status','Please correct the arrears amount.');return;}
  set('v2-ocr-status','Verified for analysis: '+money(Number(a))+(String(u).trim()!==''?' and '+number(Number(u))+' units':'')+' across '+d+' days. Nothing has been uploaded or saved by GharWatt.');
  window.dispatchEvent(new CustomEvent('gharwatt:bill-confirmed',{detail:{amount:Number(a),units:String(u).trim()===''?null:Number(u),days:Number(d),currentCharges:String(current).trim()===''?null:Number(current),arrears:String(arrears).trim()===''?null:Number(arrears)}}));
 });
 window.addEventListener('pagehide',()=>{if(currentJob)stopReading();else discardWorker()},{once:true});
}
function initAppliances(){
 if(!$('v2-appliances'))return;
 const list=$('v2-appliance-rows');
 let serial=0;
 function add(kind='fan'){
  if(list.children.length>=20){set('v2-appliance-status','Maximum 20 rows. Remove an unused row.');return;}
  const sample=sampleAppliances[kind]||sampleAppliances.other;
  const row=document.createElement('div');row.className='v2-appliance-row';
  const choices=Object.entries(sampleAppliances).map(([id,x])=>'<option value="'+id+'"'+(id===kind?' selected':'')+'>'+x.label+'</option>').join('');
  row.innerHTML='<label>Appliance<select data-kind aria-label="Appliance type">'+choices+'</select></label><label>Number<input data-count aria-label="Number of appliances" type="number" min="1" max="30" step="1" value="1"></label><label>Watts each<input data-watts aria-label="Watts per appliance" type="number" min="1" max="10000" step="1" value="'+sample.watts+'"></label><label>Hours/day<input data-hours aria-label="Hours used per day" type="number" min="0" max="24" step=".5" value="'+sample.hours+'"></label><button type="button" class="v2-remove" aria-label="Remove appliance">Remove</button>';
  row.querySelector('[data-kind]').addEventListener('change',e=>{const s=sampleAppliances[e.target.value];row.querySelector('[data-watts]').value=s.watts;row.querySelector('[data-hours]').value=s.hours;render()});
  row.querySelector('.v2-remove').addEventListener('click',()=>{row.remove();render()});
  row.addEventListener('input',render);row.dataset.entry=String(++serial);list.appendChild(row);render();
 }
 function render(){
  const rows=[...list.children].map(el=>({name:sampleAppliances[el.querySelector('[data-kind]').value].label,count:el.querySelector('[data-count]').value,watts:el.querySelector('[data-watts]').value,hours:el.querySelector('[data-hours]').value}));
  const r=applianceUse(rows,read('v2-appliance-rate'));if(!r){set('v2-appliance-units','Check inputs');set('v2-appliance-cost','—');$('v2-appliance-breakdown').replaceChildren();return;}
  set('v2-appliance-units',number(r.units)+' units');set('v2-appliance-cost',money(r.cost));
  const box=$('v2-appliance-breakdown');box.replaceChildren();
  r.items.forEach(x=>{
   const item=document.createElement('div');item.className='v2-breakdown-row';
   const label=document.createElement('span');label.textContent=x.name;
   const amount=document.createElement('strong');amount.textContent=number(x.units)+' units';
   item.append(label,amount);box.appendChild(item);
  });
  set('v2-appliance-status','These are power-rating examples only. Compressor appliances, changing speeds, standby and usage conditions vary.');
 }
 $('v2-add-appliance').addEventListener('click',()=>add('other'));
 $('v2-appliance-rate').addEventListener('input',render);
 add('fan');add('led');add('ac');
 makeShare('v2-appliance-share',()=>list.children.length?'GharWatt appliance estimate: '+$('v2-appliance-units').textContent+' per month; illustrative energy cost '+$('v2-appliance-cost').textContent+'. Verify wattage and tariff. https://chennamatta889.github.io/gharwatt/appliance-planner/':'','v2-appliance-status');
}
function initComparison(){
 if(!$('v2-bill-compare'))return;
 function refresh(){
  const a={amount:read('v2-prev-amount'),units:read('v2-prev-units'),days:read('v2-prev-days')};
  const b={amount:read('v2-new-amount'),units:read('v2-new-units'),days:read('v2-new-days')};
  const r=compareBills(a,b);
  if(!r){set('v2-change-rupees','Check inputs');set('v2-change-units','—');set('v2-change-explain','Enter two bill amounts and billing days (usually around 30) to compare.');return;}
  set('v2-change-rupees',(r.rupeeChange>0?'+':'')+money(r.rupeeChange));
  set('v2-change-units',r.unitsKnown?(r.unitChange>0?'+':'')+number(r.unitChange)+' units':'Not entered');
  const more=r.rupeeChange>0?'rose':r.rupeeChange<0?'fell':'did not change';
  let note='Your bill '+more+'. After adjusting for the length of each billing period, the rupee amount per day changed by '+money(r.perDayChange)+'. ';
  if(r.unitsKnown)note+='Electricity use per billed day moved from '+number(r.unitPerDayBefore)+' to '+number(r.unitPerDayAfter)+' units. ';
  else note+='Without units (kWh), we cannot tell whether more electricity was used. ';
  note+='Changes may come from consumption, slabs, taxes, fixed charges, arrears, credits or number of days. Check your detailed bill before deciding why.';
  set('v2-change-explain',note);
 }
 [...document.querySelectorAll('#v2-bill-compare input')].forEach(el=>el.addEventListener('input',refresh));refresh();
 makeShare('v2-change-share',()=> 'GharWatt bill comparison: '+$('v2-change-rupees').textContent+'; '+$('v2-change-explain').textContent+' https://chennamatta889.github.io/gharwatt/bill-change/','v2-change-share-status');
}
function initGoal(){
 if(!$('v2-goal'))return;
 function refresh(){
  const r=savingsGoal(read('v2-goal-current'),read('v2-goal-target'),read('v2-goal-rate'));
  if(!r){set('v2-goal-gap','Check inputs');set('v2-goal-units','—');return;}
  set('v2-goal-gap',money(r.gap));set('v2-goal-units',number(r.unitTarget)+' units/month');
  set('v2-goal-explain',r.gap===0?'Your target is already at or above your current bill. You can still reduce wasted electricity.':'To close this illustrative gap at the example rate, you would need to avoid about '+number(r.dailyUnitTarget)+' units every day. Actual rupee savings depend on your tariff slabs and fixed charges.');
 }
 [...document.querySelectorAll('#v2-goal input')].forEach(el=>el.addEventListener('input',refresh));refresh();
 makeShare('v2-goal-share',()=> 'My GharWatt electricity savings goal: '+$('v2-goal-gap').textContent+' monthly reduction, roughly '+$('v2-goal-units').textContent+' at the example tariff. Not guaranteed. https://chennamatta889.github.io/gharwatt/savings-goal/','v2-goal-share-status');
}
function initTracker(){
 if(!$('v2-tracker'))return;
 const key='gharwatt:monthly-electricity-v2';
 const currentMonth=new Date();$('v2-tracker-month').value=currentMonth.getFullYear()+'-'+String(currentMonth.getMonth()+1).padStart(2,'0');
 const storage=(()=>{try{return window.localStorage}catch{return null}})();
 let rows=[];
 try{const data=JSON.parse(storage?.getItem(key)||'[]');if(Array.isArray(data))rows=data.filter(x=>/^\d{4}-(?:0[1-9]|1[0-2])$/.test(x.month)&&valid(x.amount,0,500000)).slice(-24)}catch{}
 function show(){
  rows.sort((a,b)=>a.month.localeCompare(b.month));
  const container=$('v2-tracker-rows');container.replaceChildren();
  if(!rows.length){const t=document.createElement('p');t.textContent='No months saved yet. Your entries stay on this device.';container.appendChild(t);}
  const max=Math.max(1,...rows.map(x=>Number(x.amount)));
  for(const x of rows.slice(-12)){
   const item=document.createElement('div');item.className='v2-month-row';
   const label=document.createElement('strong');label.textContent=x.month;
   const outer=document.createElement('div');outer.className='v2-bar-track';outer.setAttribute('aria-label',money(x.amount));
   const bar=document.createElement('div');bar.className='v2-bar';bar.style.width=(x.amount/max*100).toFixed(1)+'%';outer.appendChild(bar);
   const val=document.createElement('span');val.textContent=money(x.amount)+(x.units!==null?' · '+number(x.units)+' units':'');
   item.append(label,outer,val);container.appendChild(item);
  }
  const latest=rows.at(-1),prior=rows.at(-2);
  set('v2-tracker-summary',rows.length+' month(s) recorded'+(latest&&prior?' · Last bill changed '+money(latest.amount-prior.amount)+' from prior month.':' · Add another month to compare.'));
 }
 function persist(){if(storage){try{storage.setItem(key,JSON.stringify(rows))}catch{set('v2-tracker-status','Your browser could not save locally. Use Export CSV to keep a copy.');}}show();}
 $('v2-tracker-save').addEventListener('click',()=>{
  if(!$('v2-tracker-consent').checked){set('v2-tracker-status','Please tick the checkbox to permit saving bill amounts in this browser.');return;}
  const month=read('v2-tracker-month'),amount=read('v2-tracker-amount'),units=read('v2-tracker-units');
  if(!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(month)||!valid(amount,0,500000)||(String(units).trim()!==''&&!valid(units,0,100000))){set('v2-tracker-status','Enter a valid month, rupee amount and optional units.');return;}
  rows=rows.filter(x=>x.month!==month);rows.push({month,amount:Number(amount),units:String(units).trim()===''?null:Number(units)});rows.sort((a,b)=>a.month.localeCompare(b.month));rows=rows.slice(-24);
  persist();set('v2-tracker-status','Month saved in this browser only. No account or upload.');
 });
 $('v2-tracker-export').addEventListener('click',()=>{
  const csv='month,amount_inr,units_kwh\n'+rows.map(x=>[x.month,x.amount,x.units===null?'':x.units].join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download='gharwatt-monthly-bills.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  set('v2-tracker-status','CSV downloaded. Keep the file private if it contains your billing details.');
 });
 $('v2-tracker-delete').addEventListener('click',()=>{if(!window.confirm('Delete all locally saved monthly bill entries on this device?'))return;rows=[];try{storage?.removeItem(key)}catch{}show();set('v2-tracker-status','Local bill history deleted.');});
 show();
}
function initFinance(){
 if(!$('v2-finance'))return;
 function update(){
  const gross=read('v2-cost'),sub=read('v2-subsidy'),deposit=read('v2-deposit'),apr=read('v2-apr'),years=read('v2-loan-years'),save=read('v2-monthly-saving');
  if(![gross,sub,deposit,apr,years,save].every((x,i)=>valid(x,0,[2000000,2000000,2000000,36,30,500000][i]))||Number(years)<1||Number(gross)<Number(sub)){set('v2-finance-emi','Check inputs');return;}
  const net=Number(gross)-Number(sub),principal=Math.max(0,net-Number(deposit)),r=loanEmi(principal,apr,Math.round(Number(years)*12));
  if(!r)return;
  set('v2-finance-net',money(net));set('v2-finance-emi',money(r.emi)+'/month');
  set('v2-finance-interest',money(r.interest));set('v2-finance-cashflow',money(Number(save)-r.emi)+'/month before upkeep');
  set('v2-finance-explain','The loan amount assumes the example subsidy is already available. Real subsidy timing, eligibility, fees, maintenance, taxes and changing electricity savings can alter costs. Compare a written bank offer and installer quotation.');
 }
 [...document.querySelectorAll('#v2-finance input')].forEach(el=>el.addEventListener('input',update));update();
}
function initRoof(){
 if(!$('v2-roof'))return;
 function update(){
  const area=read('v2-roof-area'),space=read('v2-roof-clear');
  if(!valid(area,1,10000)||!valid(space,0,100)){set('v2-roof-result','Check inputs');return;}
  const usable=Number(area)*Number(space)/100;
  set('v2-roof-result',number(usable/12)+'–'+number(usable/9)+' kW (rough area range)');
  set('v2-roof-note','Using '+number(usable)+' m² assumed clear area and 9–12 m² per kW. Orientation, structural load, walkways, shade, setbacks and panel models require a professional roof survey.');
 }
 [...document.querySelectorAll('#v2-roof input')].forEach(el=>el.addEventListener('input',update));update();
}
function initCooling(){
 if(!$('v2-cooling'))return;
 function update(){
  const hours=read('v2-cooling-hours'),rate=read('v2-cooling-rate');
  if(!valid(hours,0,24)||!valid(rate,0,30))return;
  for(const [id,w] of [['fan',65],['cooler',150],['ac',1500]]){
   const units=w*Number(hours)*30/1000;
   set('v2-cooling-'+id,number(units)+' units · '+money(units*Number(rate)));
  }
 }
 ['v2-cooling-hours','v2-cooling-rate'].forEach(id=>$(id).addEventListener('input',update));update();
}
function initWhatsApp(){
 function wire(id,formatter){
  const b=$(id);if(!b)return;
  b.addEventListener('click',()=>{
   const message=formatter();
   if(!message)return;
   // This action intentionally opens WhatsApp only on explicit visitor request.
   const link='https://wa.me/?text='+encodeURIComponent(message);
   window.open(link,'_blank','noopener,noreferrer');
  });
 }
 wire('v2-goal-whatsapp',()=> 'My GharWatt electricity saving goal: '+$('v2-goal-gap').textContent+' per month, about '+$('v2-goal-units').textContent+' at an example tariff. Not guaranteed. https://chennamatta889.github.io/gharwatt/savings-goal/');
 wire('v2-change-whatsapp',()=> 'My GharWatt electricity bill comparison: '+$('v2-change-rupees').textContent+'. '+$('v2-change-explain').textContent+' https://chennamatta889.github.io/gharwatt/bill-change/');
}
initReader();initAppliances();initComparison();initGoal();initTracker();initFinance();initRoof();initCooling();initWhatsApp();
window.GharWattV2=Object.freeze({parseBillText,assessBillText,ocrPageSegMode,enhanceBillPixels,compareBills,applianceUse,savingsGoal,loanEmi,sampleAppliances,ocrResizePlan});
})();