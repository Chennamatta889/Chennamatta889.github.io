(function(){
 const sheet=document.getElementById('mk-menu-sheet');
 if(!sheet||typeof sheet.showModal!=='function')return;
 const mq=matchMedia('(max-width:930px)');
 let opener=null;
 const panel=sheet.querySelector('.mk-sheet-panel'),handle=sheet.querySelector('.mk-sheet-handle'),scroll=sheet.querySelector('.mk-sheet-scroll');
 const sizes=['collapsed','default','expanded'],ratios=[.40,.65,.90];
 let drag=null,skipClick=false;
 const viewport=()=>window.visualViewport?.height||window.innerHeight;
 function setSize(size){
   sheet.dataset.size=size;
   panel.style.removeProperty('height');
   handle.setAttribute('aria-label',size==='expanded'?'Collapse menu; drag down to resize or dismiss':'Expand menu; drag up or down to resize');
   handle.setAttribute('aria-expanded',String(size==='expanded'));
 }
 handle.addEventListener('pointerdown',e=>{
   if(!e.isPrimary||e.button!==0)return;
   skipClick=false;drag={id:e.pointerId,y:e.clientY,height:panel.getBoundingClientRect().height,index:sizes.indexOf(sheet.dataset.size),moved:false};
   handle.setPointerCapture(e.pointerId);
 });
 handle.addEventListener('pointermove',e=>{
   if(!drag||drag.id!==e.pointerId)return;
   const delta=e.clientY-drag.y;
   if(Math.abs(delta)>6)drag.moved=true;
   if(!drag.moved)return;
   sheet.dataset.dragging='true';
   panel.style.height=Math.max(viewport()*.18,Math.min(viewport()*.90,drag.height-delta))+'px';
 });
 function finish(e,cancelled=false){
   if(!drag||drag.id!==e.pointerId)return;
   const d=drag;drag=null;delete sheet.dataset.dragging;
   if(cancelled||!d.moved){panel.style.removeProperty('height');return;}
   skipClick=true;
   const delta=e.clientY-d.y;
   if(delta>65&&(d.index===0||delta>viewport()*.44)){close();return;}
   const next=Math.max(0,Math.min(2,d.index+(delta<-35?1:delta>35?-1:0)));
   setSize(sizes[next]);
 }
 handle.addEventListener('pointerup',finish);
 handle.addEventListener('pointercancel',e=>finish(e,true));
 handle.addEventListener('lostpointercapture',e=>finish(e,true));
 handle.addEventListener('click',e=>{if(skipClick&&e.detail!==0){skipClick=false;return;}skipClick=false;setSize(sheet.dataset.size==='expanded'?'default':'expanded');});
 handle.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();const i=sizes.indexOf(sheet.dataset.size);if(e.key==='ArrowDown'&&i===0)close();else setSize(sizes[Math.max(0,Math.min(2,i+(e.key==='ArrowUp'?1:-1)))]);}});

 const toggle=()=>document.getElementById('mwNavToggle');
 function prepare(){const t=toggle();if(!t)return;t.setAttribute('aria-controls',mq.matches?'mk-menu-sheet':'mwPrimaryNav');if(mq.matches)t.setAttribute('aria-haspopup','dialog');else t.removeAttribute('aria-haspopup');}
 function open(t){if(sheet.open)return;opener=t;prepare();drag=null;skipClick=false;delete sheet.dataset.dragging;setSize('collapsed');scroll.scrollTop=0;for(const [i,d] of Array.from(sheet.querySelectorAll('details')).entries())d.open=i===0;sheet.showModal();document.documentElement.classList.add('mk-sheet-open');t.setAttribute('aria-expanded','true');t.setAttribute('aria-label','Close navigation');sheet.querySelector('.mk-sheet-close').focus({preventScroll:true});document.dispatchEvent(new Event('mk-sheet-change'));}
 function close(){if(sheet.open)sheet.close();}
 function reset(){document.documentElement.classList.remove('mk-sheet-open');const t=toggle();if(t){t.setAttribute('aria-expanded','false');t.setAttribute('aria-label','Open navigation');}if(opener?.isConnected&&mq.matches)opener.focus({preventScroll:true});opener=null;document.dispatchEvent(new Event('mk-sheet-change'));}
 document.addEventListener('click',e=>{const t=e.target.closest?.('#mwNavToggle');if(!t||!mq.matches)return;e.preventDefault();e.stopImmediatePropagation();sheet.open?close():open(t);},true);
 sheet.querySelector('.mk-sheet-close').addEventListener('click',close);
 sheet.addEventListener('click',e=>{if(e.target===sheet||e.target.closest('a'))close();});
 sheet.addEventListener('cancel',e=>{e.preventDefault();close();});
 sheet.addEventListener('close',reset);
 mq.addEventListener('change',()=>{close();prepare();});
 window.addEventListener('pageshow',()=>{close();prepare();});
 const header=document.querySelector('.site-header');
 if(header)new MutationObserver(prepare).observe(header,{childList:true,subtree:true});
 prepare();document.documentElement.dataset.mkSheetReady='true';
})();