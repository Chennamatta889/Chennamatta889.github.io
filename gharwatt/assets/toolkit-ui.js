/* GharWatt toolkit filtering and accessible search; runs locally, no network or storage. */
(function(){'use strict';
const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase().trim();
function matchTool(category,search,activeCategory,query){
 const cat=normalize(category),filter=normalize(activeCategory),q=normalize(query);
 return (filter==='all'||filter===''||cat===filter)&&(!q||normalize(search).includes(q));
}
const root=document.getElementById('gw-directory-grid');
if(root){
 const cards=[...root.querySelectorAll('[data-gw-tool-card]')];
 const input=document.getElementById('gw-tool-search');
 const buttons=[...document.querySelectorAll('[data-gw-filter]')];
 const result=document.getElementById('gw-result-count');
 const empty=document.getElementById('gw-no-results');
 const clear=document.getElementById('gw-clear-filters');
 let category='all';
 function update(){
  let shown=0;
  for(const card of cards){
   const match=matchTool(card.dataset.category,card.dataset.search,category,input.value);
   card.hidden=!match;if(match)shown++;
  }
  for(const btn of buttons){const selected=btn.dataset.gwFilter===category;btn.setAttribute('aria-pressed',String(selected));btn.classList.toggle('is-selected',selected)}
  result.textContent=shown+' of '+cards.length+' tools shown';
  empty.hidden=shown!==0;
 }
 buttons.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.gwFilter;update()}));
 input.addEventListener('input',update);
 clear.addEventListener('click',()=>{category='all';input.value='';update();input.focus()});
 document.addEventListener('keydown',e=>{
  const el=document.activeElement;const typing=el&&(['INPUT','TEXTAREA','SELECT'].includes(el.tagName)||el.isContentEditable);
  if(e.key==='/'&&!typing&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();input.focus()}
  if(e.key==='Escape'&&el===input&&input.value){input.value='';update();}
 });
 update();
}
window.GharWattToolkitUI=Object.freeze({matchTool});
})();