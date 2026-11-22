/* Optional on-device focus selection for small print in electricity bills. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const photo=$('v2-photo'),canvas=$('v2-crop-canvas'),wrap=$('v2-crop-wrap'),clear=$('v2-crop-reset'),hint=$('v2-crop-hint');
if(!photo||!canvas||!wrap)return;
const ctx=canvas.getContext('2d');
if(!ctx)return;
let image=null,objectUrl=null,selection=null,anchor=null;
const clamp=v=>Math.min(1,Math.max(0,v));
function draw(){
 if(!image)return;
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(image,0,0,canvas.width,canvas.height);
 if(!selection)return;
 const {x,y,width,height}=selection;
 ctx.fillStyle='rgba(17,16,39,.34)';
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.clearRect(x*canvas.width,y*canvas.height,width*canvas.width,height*canvas.height);
 ctx.drawImage(image,x*image.naturalWidth,y*image.naturalHeight,width*image.naturalWidth,height*image.naturalHeight,x*canvas.width,y*canvas.height,width*canvas.width,height*canvas.height);
 ctx.strokeStyle='#ffbf78';ctx.lineWidth=3;
 ctx.strokeRect(x*canvas.width,y*canvas.height,width*canvas.width,height*canvas.height);
}
function point(e){
 const b=canvas.getBoundingClientRect();
 return {x:clamp((e.clientX-b.left)/b.width),y:clamp((e.clientY-b.top)/b.height)};
}
function clearSelection(){selection=null;anchor=null;draw();if(hint)hint.textContent='Drag across the photo to select only the section you want to read. Leave it unselected to scan the whole page.';}
function discard(){
 image=null;selection=null;anchor=null;
 wrap.hidden=true;
 canvas.width=1;canvas.height=1;
 if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
}
photo.addEventListener('change',()=>{
 discard();
 const file=photo.files?.[0];
 if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))return;
 objectUrl=URL.createObjectURL(file);
 const currentUrl=objectUrl;
 const im=new Image();
 im.onload=()=>{
  if(objectUrl!==currentUrl)return;
  image=im;
  canvas.width=Math.min(960,im.naturalWidth);
  canvas.height=Math.max(1,Math.round(canvas.width*im.naturalHeight/im.naturalWidth));
  wrap.hidden=false;clearSelection();
 };
 im.onerror=()=>{if(hint)hint.textContent='Preview unavailable. You can still scan the original photo.';discard();};
 im.src=currentUrl;
});
canvas.addEventListener('pointerdown',e=>{
 if(!image)return;
 e.preventDefault();anchor=point(e);selection={x:anchor.x,y:anchor.y,width:0,height:0};
 try{canvas.setPointerCapture(e.pointerId)}catch{}draw();
});
canvas.addEventListener('pointermove',e=>{
 if(!anchor)return;
 e.preventDefault();const p=point(e);
 selection={x:Math.min(anchor.x,p.x),y:Math.min(anchor.y,p.y),width:Math.abs(p.x-anchor.x),height:Math.abs(p.y-anchor.y)};
 draw();
});
function finish(){
 if(!anchor)return;
 anchor=null;
 if(selection.width<.06||selection.height<.05){clearSelection();return;}
 if(hint)hint.textContent='Only the highlighted rectangle will be scanned. Move your selection if needed, or tap Clear selection to scan the whole page.';
 draw();
}
canvas.addEventListener('pointerup',finish);
canvas.addEventListener('pointercancel',finish);
clear?.addEventListener('click',clearSelection);
// Quick focus regions are optional shortcuts for two-column printed bills.
// They are not universal templates; the visitor can override by dragging.
const regions=Object.freeze({
 amounts:{x:.60,y:.15,width:.38,height:.52},
 meter:{x:.10,y:.36,width:.49,height:.14}
});
for(const btn of document.querySelectorAll('[data-gw-focus]')){
 btn.addEventListener('click',()=>{
  if(!image){if(hint)hint.textContent='Choose a bill photograph first, then select an area.';return;}
  const choice=regions[btn.dataset.gwFocus];
  if(!choice)return;
  selection={...choice};anchor=null;draw();
  const append=$('v2-ocr-add-mode');
  if(append)append.checked=btn.dataset.gwFocus==='meter';
  if(hint)hint.textContent=btn.dataset.gwFocus==='meter'
   ?'Meter-reading area selected. Tap Read photo to attempt units recognition. Check the original numbers: current reading minus previous reading may require a multiplier.'
   :'Charge area selected. Tap Read photo to attempt amount recognition. Check the printed total and previous dues before confirming.';
 });
}
$('v2-clear')?.addEventListener('click',discard);
window.GharWattCrop=Object.freeze({getSelection:()=>selection&&selection.width>=.06&&selection.height>=.05?{...selection}:null});
})();
