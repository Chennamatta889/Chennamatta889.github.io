(function(){
 const bar=document.querySelector('.mk-dashboard-bottom'),restore=document.getElementById('mk-nav-restore');
 if(!bar||!restore)return;
 const mobile=window.matchMedia('(max-width:850px)');
 // Normalize legacy Home links without reloading or affecting calculator anchors.
 if(location.pathname==='/'&&location.hash==='#top')history.replaceState(history.state,'',location.pathname+location.search);
 const delay=5000;
 let timer=0,last=Math.max(0,window.scrollY),hidden=false,editing=false,scrollGuardUntil=location.hash?performance.now()+900:0;
 function guardAnchorScroll(){scrollGuardUntil=performance.now()+900;last=Math.max(0,window.scrollY);show();}
 const isEditor=e=>!!e&&e.matches('textarea,select,input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]),[contenteditable=true]');
 function active(){
   let section=bar.dataset.section;
   if(location.pathname==='/')section=location.hash==='#market'?'Market':location.hash==='#tools'||location.hash==='#quick-calculators'?'Tools':'Home';
   for(const a of bar.querySelectorAll('a')){if(a.dataset.tab===section)a.setAttribute('aria-current',location.pathname==='/'?'location':'page');else a.removeAttribute('aria-current');}
 }
 function clear(){window.clearTimeout(timer);timer=0}
 function schedule(){clear();if(mobile.matches&&!editing&&!document.documentElement.classList.contains('mk-sheet-open'))timer=window.setTimeout(()=>hide(false),delay);}
 function show(){if(!mobile.matches||editing||document.documentElement.classList.contains('mk-sheet-open'))return;hidden=false;bar.classList.remove('is-hidden');bar.inert=false;bar.removeAttribute('aria-hidden');restore.hidden=true;schedule();}
 function hide(keyboard){
   if(!mobile.matches)return;
   if(!keyboard&&bar.contains(document.activeElement)&&document.activeElement.matches(':focus-visible')){schedule();return;}
   clear();hidden=true;
   if(bar.contains(document.activeElement))document.activeElement.blur();
   bar.classList.add('is-hidden');bar.inert=true;bar.setAttribute('aria-hidden','true');restore.hidden=keyboard;
 }
 function sync(){
   clear();editing=isEditor(document.activeElement);
   if(!mobile.matches){hidden=false;bar.inert=false;bar.classList.remove('is-hidden');bar.removeAttribute('aria-hidden');restore.hidden=true;return;}
   if(editing)hide(true);else show();
 }
 document.addEventListener('pointerdown',e=>{if(!mobile.matches||editing||isEditor(e.target))return;if(!restore.contains(e.target))show();},{passive:true});
 restore.addEventListener('click',()=>{show();const a=bar.querySelector('[aria-current]')||bar.querySelector('a');a?.focus({preventScroll:true});});
 document.addEventListener('focusin',e=>{editing=isEditor(e.target);if(editing)hide(true);else if(mobile.matches)show();});
 document.addEventListener('focusout',()=>window.setTimeout(()=>{const was=editing;editing=isEditor(document.activeElement);if(was&&!editing)show();},0));
 window.addEventListener('scroll',()=>{const y=Math.max(0,window.scrollY);if(!mobile.matches||editing){last=y;return;}if(performance.now()<scrollGuardUntil){scrollGuardUntil=Math.max(scrollGuardUntil,performance.now()+200);last=y;return;}if(y-last>12)hide(false);else if(last-y>12)show();if(Math.abs(y-last)>12)last=y;},{passive:true});
 bar.addEventListener('click',e=>{
   const a=e.target.closest('a');if(!a)return;
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   document.activeElement?.blur();const url=new URL(a.href);
   if(a.dataset.tab==='Home'&&location.pathname==='/'&&url.pathname==='/'&&!url.hash){
     e.preventDefault();
     if(location.hash||location.search!==url.search)history.pushState(history.state,'',url.pathname+url.search);
     active();guardAnchorScroll();
     window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   }else if(url.pathname===location.pathname&&url.hash)guardAnchorScroll();else show();
 });
 document.addEventListener('mk-sheet-change',()=>{if(document.documentElement.classList.contains('mk-sheet-open'))clear();else sync();});
 window.addEventListener('hashchange',()=>{active();guardAnchorScroll();});
 window.addEventListener('pageshow',()=>{active();sync();if(location.hash)guardAnchorScroll();});
 mobile.addEventListener('change',sync);
 active();sync();document.documentElement.dataset.mkNavReady='true';
})();