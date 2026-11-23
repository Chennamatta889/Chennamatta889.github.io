const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');

function harness(){
  const nodes=new Map(),listener={};
  const add=(id,value='')=>{
    const el={value:String(value),style:{},hidden:false,textContent:'',attrs:{},events:{},
      addEventListener(type,fn){this.events[type]=fn;},
      setAttribute(key,value){this.attrs[key]=String(value);}};
    nodes.set(id,el);return el;
  };
  add('solar-calculator');add('solar-state','TG');add('capacity',3);add('monthly-units',300);
  add('unit-rate',7.7);add('install-price',60000);add('generation',4.2);add('effective-offset',85);
  add('connection-phase','unknown');add('sanctioned-load','');add('solar-assumption-note');add('solar-capacity-error');
  add('solar-use-state-example');add('solar-connection-warning');add('solar-bars-chart');
  for(const id of ['solar-savings','solar-gross','solar-subsidy','solar-net','solar-generation',
   'solar-offset','solar-payback','solar-annual','subsidy-category','solar-grid-after',
   'solar-reduction-percent','solar-grid-before','solar-grid-after-label','calc-status',
   'solar-bar-before','solar-bar-after'])add(id);
  add('quote-tool');add('load-quote-examples');add('quote-sample-status');
  add('quote-msg');add('quote-normalized-note');add('download-report');add('copy-report');
  for(let i=1;i<=3;i++){
    for(const key of ['name','cost','size','panel','inverter','extras'])add('q-'+key+'-'+i);
    for(const key of ['name','cost','kw','tag'])add('qr-'+key+'-'+i);
  }
  const doc={readyState:'loading',currentScript:null,
    getElementById(id){return nodes.get(id)||null;},
    querySelectorAll(){return [];},addEventListener(type,fn){listener[type]=fn;}};
  const context={document:doc,window:{},Intl,Number,Math,Set};
  vm.runInNewContext(src,context);
  assert.equal(typeof listener.DOMContentLoaded,'function','init is deferred until DOM ready');
  listener.DOMContentLoaded();
  return {nodes,add,math:context.window.GharWattMath};
}
test('home has nonblank 3kW example and valid calculator + comparison hooks',()=>{
  for(const id of ['solar-savings','solar-gross','solar-subsidy','solar-net','solar-payback',
    'solar-reduction-percent','load-quote-examples','solar-assumption-note','solar-connection-warning']){
      assert.ok(html.includes('id="'+id+'"'),id);
    }
  assert.match(html,/id="solar-savings">₹2,310/);
  assert.match(html,/id="solar-net">₹1,02,000/);
  assert.ok(!html.includes('Estimates will update as you edit inputs.'));
  assert.match(html,/Find my solar size from my bill/);
  assert.match(html,/assets\/solar-polish\.css/);
  assert.match(html,/Provisional brand · Illustrative estimates only/);
  assert.ok(!html.includes('NEW · PERSONALIZED PLANNING'));
});
test('DOMContentLoaded computes solar output immediately and not ₹0 on valid defaults',()=>{
  const {nodes}=harness();
  assert.equal(nodes.get('solar-savings').textContent,'₹2,310');
  assert.equal(nodes.get('solar-gross').textContent,'₹1,80,000');
  assert.equal(nodes.get('solar-subsidy').textContent,'₹78,000');
  assert.equal(nodes.get('solar-net').textContent,'₹1,02,000');
  assert.equal(nodes.get('solar-payback').textContent,'3.9 years');
  assert.equal(nodes.get('solar-reduction-percent').textContent,'100%');
});
test('regional examples change, while explicit edits remain under user control',()=>{
  const {nodes}=harness();
  const state=nodes.get('solar-state'),rate=nodes.get('unit-rate'),yieldEl=nodes.get('generation');
  state.value='AP';state.events.change();
  assert.equal(rate.value,'8.75');assert.equal(yieldEl.value,'4.1');
  rate.value='6.5';rate.events.input();
  state.value='TG';state.events.change();
  assert.equal(rate.value,'6.5');assert.equal(yieldEl.value,'4.2');
  nodes.get('solar-use-state-example').events.click();
  assert.equal(rate.value,'7.7');
});
test('phase and sanctioned-load rules warn without inventing a universal 3kW hard cap',()=>{
  const {math}=harness();
  const toStr=(x)=>x.join(' ');
  assert.equal(math.connectionGuidance('TG','unknown',3,0).length,0);
  assert.match(toStr(math.connectionGuidance('TG','single',5,0)),/up to 5 kW/);
  assert.match(toStr(math.connectionGuidance('AP','single',5.5,0)),/exceeds the published 5 kW/);
  assert.match(toStr(math.connectionGuidance('AP','unknown',4,2)),/sanctioned load/);
  assert.doesNotMatch(toStr(math.connectionGuidance('OTHER','single',4,0)),/mandatory/);
});
test('cost per kW is normalized and empty prices do not rank as free',()=>{
  const {nodes,math}=harness();
  assert.equal(math.costPerKw(180000,3),60000);
  assert.equal(math.costPerKw(195000,3.3),195000/3.3);
  assert.equal(math.costPerKw(null,3),null);
  assert.match(nodes.get('qr-cost-1').textContent,/Add quote details/);
  nodes.get('load-quote-examples').events.click();
  assert.equal(nodes.get('q-size-2').value,'3.3');
  assert.equal(nodes.get('qr-kw-1').textContent,'Cost per kW: ₹60,000/kW');
  assert.match(nodes.get('quote-normalized-note').textContent,/Lowest displayed/);
  assert.match(nodes.get('quote-sample-status').textContent,/not real installer offers/);
});


test('GW-06: zero or empty solar capacity is rejected, never silently clamped to 0.5 kW',()=>{
 const {nodes,math}=harness();
 assert.equal(math.validSolarCapacity('0'),false);
 assert.equal(math.validSolarCapacity(''),false);
 assert.equal(math.validSolarCapacity('.5'),true);
 assert.equal(math.validSolarCapacity('20.1'),false);
 const cap=nodes.get('capacity');
 cap.value='0';nodes.get('solar-state').events.change();
 assert.equal(nodes.get('solar-savings').textContent,'—');
 assert.equal(nodes.get('solar-payback').textContent,'—');
 assert.match(nodes.get('calc-status').textContent,/between 0.5 and 20/);
 assert.equal(nodes.get('solar-capacity-error').hidden,false);
 assert.equal(cap.attrs['aria-invalid'],'true');
 cap.value='3';nodes.get('solar-state').events.change();
 assert.equal(nodes.get('solar-capacity-error').hidden,true);
 assert.equal(nodes.get('solar-savings').textContent,'₹2,310');
 assert.equal(cap.attrs['aria-invalid'],'false');
});
