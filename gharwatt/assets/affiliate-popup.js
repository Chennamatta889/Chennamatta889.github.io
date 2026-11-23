/* GharWatt: small, non-modal smart-meter offer after 30 visible seconds.
 * One impression per tab session, no analytics or personal-data collection.
 * The retailer link is loaded from the same config as the buying guide.
 */
(function(){
  'use strict';
  const DELAY_MS=30000;
  const STEP_MS=1000;
  const SHOWN_KEY='ghw_smart_meter_popup_shown_v1';
  const TIME_KEY='ghw_smart_meter_visible_ms_v1';
  function validOffer(value){
    if(!value||typeof value!=='object')return null;
    const name=typeof value.product_name==='string'?value.product_name.trim():'';
    const href=typeof value.profit_link==='string'?value.profit_link.trim():'';
    if(name.length<3||name.length>120||!href)return null;
    try{
      const link=new URL(href);
      if(link.protocol!=='https:'||!link.hostname||link.username||link.password)return null;
      return {name,url:link.href};
    }catch{return null}
  }
  window.GharWattOfferPopup=Object.freeze({delayMs:DELAY_MS,validOffer});
  const path=window.location?.pathname||'';
  // The full buying guide already shows the smart-meter card.
  if(/\/solar-products\/(?:index\.html)?$/.test(path))return;
  // Never overlay the primary solar calculator or bill-reading form.
  if(/\/gharwatt\/(?:index\.html)?$/.test(path)||/\/gharwatt\/bill-reader\/(?:index\.html)?$/.test(path))return;
  if(!document.body||!document.currentScript?.src||typeof fetch!=='function')return;
  const source=document.currentScript.src;
  function stored(key){try{return window.sessionStorage.getItem(key)}catch{return null}}
  function save(key,value){try{window.sessionStorage.setItem(key,String(value))}catch{/* session storage can be disabled */}}
  if(stored(SHOWN_KEY)==='1')return;
  let visibleMs=Math.min(DELAY_MS,Math.max(0,Number(stored(TIME_KEY))||0));
  function createPopup(offer){
    if(stored(SHOWN_KEY)==='1'||document.getElementById('ghw-offer-popup'))return;
    const popup=document.createElement('aside');
    popup.id='ghw-offer-popup';
    popup.className='ghw-offer-popup';
    popup.setAttribute('role','complementary');
    popup.setAttribute('aria-label','Optional smart energy meter product suggestion');
    popup.innerHTML='<button class="ghw-offer-close" type="button" aria-label="Dismiss product suggestion">×</button>'+
      '<div class="ghw-offer-eyebrow">PRODUCT SPOTLIGHT · AFFILIATE LINK</div>'+
      '<div class="ghw-offer-main"><span aria-hidden="true" class="ghw-offer-symbol">⚡</span><div>'+
      '<strong class="ghw-offer-name"></strong>'+
      '<p>Want to understand home electricity usage?</p></div></div>'+
      '<a class="ghw-offer-cta" target="_blank" rel="sponsored nofollow noopener noreferrer"></a>'+
      '<a class="ghw-offer-guide"></a>'+
      '<p class="ghw-offer-disclosure">We may earn a commission from qualifying purchases. Confirm the model and seller before buying.</p>';
    popup.querySelector('.ghw-offer-name').textContent=offer.name;
    const affiliate=popup.querySelector('.ghw-offer-cta');
    affiliate.href=offer.url;
    affiliate.textContent='View smart meter ↗';
    const guide=popup.querySelector('.ghw-offer-guide');
    guide.href=new URL('../solar-products/#energy-meters',source).href;
    guide.textContent='Buying guide';
    function dismiss(){popup.remove()}
    popup.querySelector('.ghw-offer-close').addEventListener('click',dismiss);
    popup.addEventListener('keydown',e=>{if(e.key==='Escape')dismiss()});
    document.body.appendChild(popup);
    // Mark as seen on display, not on click, to avoid repeat interruptions.
    save(SHOWN_KEY,'1');
    save(TIME_KEY,DELAY_MS);
  }
  function showConfiguredOffer(){
    fetch(new URL('affiliate-links.json',source),{cache:'no-store'})
      .then(response=>{if(!response.ok)throw Error('No offer configuration');return response.json()})
      .then(data=>{
        const offer=validOffer(data&&data.products&&data.products['energy-meter']);
        if(offer)createPopup(offer);
      }).catch(()=>{/* No popup when offer is missing or unreachable */});
  }
  if(visibleMs>=DELAY_MS){
    if(document.visibilityState==='visible')showConfiguredOffer();
    else document.addEventListener('visibilitychange',function onVisible(){
      if(document.visibilityState!=='visible')return;
      document.removeEventListener('visibilitychange',onVisible);
      showConfiguredOffer();
    });
    return;
  }
  const timer=window.setInterval(()=>{
    if(document.visibilityState!=='visible')return;
    visibleMs=Math.min(DELAY_MS,visibleMs+STEP_MS);
    save(TIME_KEY,visibleMs);
    if(visibleMs>=DELAY_MS){
      window.clearInterval(timer);
      showConfiguredOffer();
    }
  },STEP_MS);
})();
