const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const script=fs.readFileSync(path.join(__dirname,'../assets/affiliate-popup.js'),'utf8');
function setup({initialMs=0,alreadySeen=false,page='/gharwatt/',visible=true,offer={product_name:'Smart Energy Meter',profit_link:'https://amzn-to.co/hrCK1f'}}={}){
  const memory=new Map();
  if(initialMs)memory.set('ghw_smart_meter_visible_ms_v1',String(initialMs));
  if(alreadySeen)memory.set('ghw_smart_meter_popup_shown_v1','1');
  let tick=null,requests=0,created=null;
  const elems=new Map();
  const document={
    visibilityState:visible?'visible':'hidden',
    currentScript:{src:'https://chennamatta889.github.io/gharwatt/assets/affiliate-popup.js'},
    head:{},body:{appendChild(el){created=el;elems.set(el.id,el)}},
    getElementById(id){return elems.get(id)||null},
    createElement(tag){
      if(tag!=='aside')throw Error('Unexpected element');
      const children=new Map();
      const el={id:'',className:'',innerHTML:'',setAttribute(){},addEventListener(){},remove(){created=null;elems.delete(this.id)},
        querySelector(selector){if(!children.has(selector))children.set(selector,{textContent:'',href:'',addEventListener(){}});return children.get(selector)},
        _children:children};
      return el;
    }
  };
  const window={location:{pathname:page},sessionStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},
    setInterval(fn){tick=fn;return 1},clearInterval(){tick=null}};
  const fetch=()=>{requests++;return Promise.resolve({ok:true,json:()=>Promise.resolve({products:{'energy-meter':offer}})})};
  vm.runInNewContext(script,{window,document,fetch,URL});
  return{window,document,memory,tick:()=>{if(tick)tick()},requests:()=>requests,created:()=>created};
}
const flush=()=>new Promise(r=>setImmediate(r));
test('offer link is HTTPS-only, named, and blocks embedded credentials',()=>{
  const r=setup().window.GharWattOfferPopup;
  assert.equal(r.delayMs,30000);
  assert.equal(r.validOffer({product_name:'Smart Meter',profit_link:'javascript:alert(1)'}),null);
  assert.equal(r.validOffer({product_name:'Smart Meter',profit_link:'https://bad:pass@example.org'}),null);
  assert.equal(r.validOffer({product_name:'',profit_link:'https://example.com'}),null);
  assert.equal(r.validOffer({product_name:'Smart Energy Meter',profit_link:'https://amzn-to.co/hrCK1f'}).url,'https://amzn-to.co/hrCK1f');
});
test('30 visible seconds before popup and once-per-session marker',async()=>{
  const e=setup();for(let i=0;i<29;i++)e.tick();
  assert.equal(e.requests(),0);assert.equal(e.created(),null);
  e.tick();await flush();await flush();
  assert.equal(e.requests(),1);
  assert.equal(e.created().querySelector('.ghw-offer-cta').href,'https://amzn-to.co/hrCK1f');
  assert.equal(e.created().querySelector('.ghw-offer-cta').textContent,'View smart meter ↗');
  assert.equal(e.memory.get('ghw_smart_meter_popup_shown_v1'),'1');
});
test('background time does not count toward browsing time',()=>{
  const e=setup({visible:false});for(let i=0;i<45;i++)e.tick();
  assert.equal(e.memory.get('ghw_smart_meter_visible_ms_v1'),undefined);
  assert.equal(e.requests(),0);
});
test('elapsed browsing time survives site navigation within session',async()=>{
  const e=setup({initialMs:28000});e.tick();assert.equal(e.requests(),0);e.tick();await flush();await flush();
  assert.equal(e.requests(),1);assert.ok(e.created());
});
test('a previously seen offer is never displayed again in same session',()=>{
  const e=setup({alreadySeen:true});for(let i=0;i<45;i++)e.tick();
  assert.equal(e.requests(),0);assert.equal(e.created(),null);
});
test('do not duplicate offer on product buying guide',()=>{
  const e=setup({page:'/gharwatt/solar-products/'});for(let i=0;i<40;i++)e.tick();assert.equal(e.requests(),0);
});
test('unconfigured affiliate link does not create pop-up',async()=>{
  const e=setup({initialMs:29000,offer:{product_name:'Smart meter',profit_link:''}});
  e.tick();await flush();await flush();assert.equal(e.requests(),1);assert.equal(e.created(),null);
});
