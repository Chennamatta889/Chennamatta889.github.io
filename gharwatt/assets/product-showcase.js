/* GharWatt product spotlights: no tracking, no popups, no affiliate links unless configured. */
(function(){
'use strict';
function validAffiliate(item){
 if(!item||typeof item!=='object')return null;
 const name=typeof item.product_name==='string'?item.product_name.trim():'';
 const value=typeof item.profit_link==='string'?item.profit_link.trim():'';
 if(name.length<3||name.length>120||!value)return null;
 try{const url=new URL(value);if(url.protocol!=='https:'||!url.hostname||url.username||url.password)return null;return {name,url:url.href}}catch{return null}
}
const cards=document.querySelectorAll('[data-gw-product]');
const src=document.currentScript?.src;
if(cards.length&&src&&typeof fetch==='function'){
 fetch(new URL('affiliate-links.json',src),{cache:'no-store'})
 .then(response=>{if(!response.ok)throw Error('Affiliate configuration unavailable');return response.json()})
 .then(data=>{
   const products=data&&typeof data.products==='object'?data.products:{};
   const activeSections=new Set();
   cards.forEach(card=>{
     const entry=validAffiliate(products[card.dataset.gwProduct]);
     if(!entry)return;
     const cta=card.querySelector('[data-gw-affiliate-action]');
     const note=card.querySelector('[data-gw-affiliate-note]');
     if(!cta||!note)return;
     const anchor=document.createElement('a');
     anchor.href=entry.url;
     anchor.rel='sponsored nofollow noopener noreferrer';
     anchor.target='_blank';
     anchor.className='gw-affiliate-link';
     anchor.textContent='View '+entry.name+' ↗';
     cta.replaceChildren(anchor);
     note.textContent='Affiliate link · We may earn a commission from a qualifying purchase.';
     const section=card.closest('[data-gw-product-section]');
     if(section)activeSections.add(section);
   });
   activeSections.forEach(section=>{
     const p=section.querySelector('[data-gw-affiliate-disclosure]');
     if(p)p.textContent='Advertisement disclosure: Product links marked “Affiliate link” are paid affiliate promotions. GharWatt may earn a commission if you buy through them. Guides remain independently written.';
   });
 })
 .catch(()=>{}); // Preserve useful editorial buying-guide links when the configuration is unavailable.
}
window.GharWattProductLinks=Object.freeze({validAffiliate});
})();
