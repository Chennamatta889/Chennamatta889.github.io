/* GharWatt optional AI bill upload. No upload or provider call without explicit consent.
   Images are locally re-encoded to remove photo metadata; PDFs are sent unchanged.
   Neither the bill nor AI responses are saved by GharWatt. */
(function(root){
'use strict';
const ENDPOINT="https://nnhzihcugvifhegsfmua.supabase.co/functions/v1/gharwatt-ai";
const MAX_BILL_BYTES=3*1024*1024;
const MAX_IMAGE_SOURCE_BYTES=12*1024*1024;
const $=id=>root.document?.getElementById(id)||null;
function detectKind(file){
 if(!file||typeof file!=="object")return "";
 const mime=typeof file.type==="string"?file.type.toLowerCase():"";
 const name=typeof file.name==="string"?file.name.toLowerCase():"";
 if(mime==="application/pdf"||(!mime&&name.endsWith(".pdf")))return "pdf";
 if(["image/jpeg","image/png","image/webp"].includes(mime)||
     (!mime&&/\.(jpe?g|png|webp)$/.test(name)))return "image";
 return "";
}
function validateSelection(file){
 if(!file)return {ok:false,error:"Choose a bill photo or PDF first."};
 const kind=detectKind(file);
 if(!kind)return {ok:false,error:"Choose a JPG, PNG, WebP image or PDF file only."};
 if(!Number.isFinite(file.size)||file.size<100)return {ok:false,error:"The selected file appears empty or invalid."};
 if(kind==="pdf"&&file.size>MAX_BILL_BYTES)return {ok:false,error:"Please select a PDF no larger than 3 MB."};
 if(kind==="image"&&file.size>MAX_IMAGE_SOURCE_BYTES)return {ok:false,error:"This photo is over 12 MB. Take a smaller photo or crop it first."};
 return {ok:true,kind};
}
function bytesToBase64(arrayBuffer){
 const bytes=new Uint8Array(arrayBuffer);
 let raw="";
 for(let i=0;i<bytes.length;i+=32768)raw+=String.fromCharCode(...bytes.subarray(i,i+32768));
 return root.btoa(raw);
}
async function imageAsJpeg(file){
 if(typeof root.createImageBitmap!=="function")throw Error("Your browser cannot resize this photo. Try another browser or select a small PDF.");
 const bitmap=await root.createImageBitmap(file);
 try{
  if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>45000000)
    throw Error("Image dimensions are too large. Crop or resize the bill photo first.");
  const plans=[[2400,.8],[1800,.73],[1450,.67]];
  for(const [maxSide,quality] of plans){
   const ratio=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
   const canvas=root.document.createElement("canvas");
   canvas.width=Math.max(1,Math.round(bitmap.width*ratio));
   canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
   const ctx=canvas.getContext("2d");
   if(!ctx)throw Error("Your browser could not process this image.");
   ctx.fillStyle="#fff";
   ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",quality));
   if(blob&&blob.size>=100&&blob.size<=MAX_BILL_BYTES)
     return {mimeType:"image/jpeg",data:bytesToBase64(await blob.arrayBuffer()),byteCount:blob.size};
  }
  throw Error("This bill photo is still too large after resizing. Crop it and try again.");
 }finally{if(typeof bitmap.close==="function")bitmap.close();}
}
async function prepareBill(file){
 const result=validateSelection(file);
 if(!result.ok)throw Error(result.error);
 if(result.kind==="image")return imageAsJpeg(file);
 const buffer=await file.arrayBuffer();
 if(buffer.byteLength>MAX_BILL_BYTES)throw Error("This PDF is over 3 MB.");
 const bytes=new Uint8Array(buffer);
 // Reject mislabeled files before transmitting; the server independently checks the signature.
 if(bytes[0]!==37||bytes[1]!==80||bytes[2]!==68||bytes[3]!==70||bytes[4]!==45)
   throw Error("This file does not appear to be a valid PDF.");
 return {mimeType:"application/pdf",data:bytesToBase64(buffer),byteCount:buffer.byteLength};
}
root.GharWattBillAI=Object.freeze({detectKind,validateSelection,MAX_BILL_BYTES,MAX_IMAGE_SOURCE_BYTES});
const panel=$("gw-ai-upload-panel");
if(!panel)return;
const input=$("gw-ai-bill-file"),question=$("gw-ai-bill-question"),
 consent=$("gw-ai-bill-consent"),submit=$("gw-ai-bill-submit"),
 clear=$("gw-ai-bill-clear"),status=$("gw-ai-bill-status"),
 preview=$("gw-ai-bill-preview"),fileLabel=$("gw-ai-bill-selection"),
 answer=$("gw-ai-bill-answer");
let ready=false,busy=false,checked=false,previewUrl=null;
function tell(message){status.textContent=message;}
function selection(){return input.files&&input.files[0]||null;}
function updateButton(){submit.disabled=!ready||busy||!consent.checked||!validateSelection(selection()).ok;}
function showSelection(){
 if(previewUrl){root.URL.revokeObjectURL(previewUrl);previewUrl=null;}
 preview.hidden=true;preview.removeAttribute("src");
 const file=selection();const validation=validateSelection(file);
 answer.hidden=true;answer.replaceChildren();
 if(!file){fileLabel.textContent="Nothing selected. Your bill stays on your device.";tell("Choose a photo or PDF. No file is sent until you agree and press Analyze.");}
 else if(!validation.ok){fileLabel.textContent=file.name||"Selected file";tell(validation.error);}
 else{
  fileLabel.textContent=(file.name||"Selected bill")+" · "+(file.size/1024/1024).toFixed(2)+" MB · not uploaded";
  tell(validation.kind==="image"?
    "Photo selected locally. It will be resized to JPEG on your device before you choose to send it.":
    "PDF selected locally. It may contain names, addresses or account numbers. Review it before sending.");
  if(validation.kind==="image"){
   previewUrl=root.URL.createObjectURL(file);
   preview.src=previewUrl;preview.hidden=false;
  }
 }
 updateButton();
}
async function check(){
 if(checked)return;
 checked=true;tell("Checking AI availability…");
 try{
  const response=await root.fetch(ENDPOINT,{method:"GET",cache:"no-store",
   signal:root.AbortSignal.timeout(9000)});
  if(!response.ok)throw Error("unavailable");
  const data=await response.json();ready=data.ready===true;
  tell(ready?"AI is available. Select a bill and review what you share before sending.":
   "AI is not available right now. Your browser-only bill reader still works.");
 }catch{
  ready=false;tell("Could not connect to AI. The browser-only bill reader is still available.");
 }
 updateButton();
}
function getVisitor(){
 const helper=root.GharWattAIClient?.getOrCreateBrowserId;
 if(typeof helper!=="function")return null;
 let store=null;
 try{store=root.localStorage}catch{}
 if(!store)try{store=root.sessionStorage}catch{}
 return helper(store,typeof root.crypto?.randomUUID==="function"?()=>root.crypto.randomUUID():null);
}
function setBusy(flag){
 busy=flag;input.disabled=flag;question.disabled=flag;consent.disabled=flag;
 clear.disabled=flag;submit.textContent=flag?"Reading your bill…":"Analyze this bill with AI";
 updateButton();
}
panel.addEventListener("toggle",()=>{if(panel.open)void check()});
input.addEventListener("change",showSelection);
consent.addEventListener("change",updateButton);
submit.addEventListener("click",async()=>{
 const file=selection(),validation=validateSelection(file);
 if(!ready||busy||!consent.checked||!validation.ok)return;
 const visitorId=getVisitor();
 if(!visitorId){tell("AI could not create a private browser usage ID. Allow site storage or try another browser.");return;}
 setBusy(true);tell("Preparing your bill locally…");
 const original=file;
 try{
  const bill=await prepareBill(original);
  if(selection()!==original)throw Error("The selected file changed. Choose it again.");
  tell("Sending the selected bill securely to Gemini for a one-time explanation…");
  const message=question.value.trim().slice(0,550)||
   "Read this electricity bill and explain the payable amount, units and any old dues. Clearly mark any values you cannot read.";
  const res=await root.fetch(ENDPOINT,{
   method:"POST",
   headers:{"Content-Type":"application/json","X-GharWatt-Bill-Upload":"bill"},
   body:JSON.stringify({consent:true,billConsent:true,visitorId,message,
    shareBill:false,bill:{mimeType:bill.mimeType,data:bill.data}}),
   cache:"no-store",signal:root.AbortSignal.timeout(55000)
  });
  const data=await res.json();
  if(!res.ok||data?.ok!==true||typeof data.answer!=="string"){
   tell(typeof data?.error==="string"?data.error:"The bill could not be analyzed. Try again.");
   return;
  }
  answer.hidden=false;
  const title=root.document.createElement("h4");title.textContent="AI explanation — verify against your original bill";
  const content=root.document.createElement("p");content.textContent=data.answer.slice(0,2600);
  answer.append(title,content);
  tell("Analysis finished. Check every amount and unit against your bill. "+
    (typeof data.remainingToday==="number"?data.remainingToday+" AI requests remain for this browser today.":""));
 }catch(err){
  tell(err instanceof Error?err.message:"Unable to analyze this file. Your existing bill tools still work.");
 }finally{setBusy(false);}
});
clear.addEventListener("click",()=>{
 input.value="";question.value="";consent.checked=false;
 showSelection();tell("File and AI explanation cleared from this page. The anonymous usage counter is unchanged.");
});
function openFromHash(){
 if(["#gw-ai-bill-upload","#gw-ai-upload-panel"].includes(root.location?.hash||""))panel.open=true;
}
root.addEventListener("hashchange",openFromHash);
openFromHash();
updateButton();
})(window);
