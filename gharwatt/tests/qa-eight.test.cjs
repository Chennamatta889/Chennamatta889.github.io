'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.join(__dirname,'..');
const source=rel=>fs.readFileSync(path.join(base,rel),'utf8');

test('GW-01: Telugu and Hindi include English fallbacks and explicitly labelled script text',()=>{
 const home=source('index.html'),tools=source('energy-tools/index.html'),studio=source('home-energy-studio/index.html');
 for(const label of ['తెలుగు','हिंदी','Telugu','Hindi'])assert.ok(home.includes(label),'homepage missing '+label);
 for(const label of ['(Telugu electricity guide)','(Hindi electricity guide)','gw-language-icon'])assert.ok(tools.includes(label));
 assert.match(studio,/Telugu · తెలుగు/);assert.match(studio,/Hindi · हिंदी/);
 const css=source('assets/ui-refresh.css');
 assert.match(css,/Noto Sans Telugu/);assert.match(css,/Noto Sans Devanagari/);
 assert.match(source('assets/home-studio.css'),/Nirmala UI/);
});

test('GW-02: cross-page hash routes and post-layout scrolling are defined',()=>{
 const app=source('assets/app.js'),html=source('index.html'),css=source('assets/ui-refresh.css');
 assert.match(app,/stabilizeHomeAnchors/);
 assert.match(app,/window\.addEventListener\('load'/);
 assert.match(app,/target\.scrollIntoView/);
 assert.match(css,/#calculator,#compare,#guides\{scroll-margin-top:9px\}/);
 assert.match(html,/id="calculator"/);assert.match(html,/id="guides"/);
 assert.match(source('discover/index.html'),/href="\.\.\/#calculator"/);
 assert.match(source('energy-tools/index.html'),/href="\.\.\/#guides"/);
});

test('GW-03: maintenance icon has explicit SVG path rather than a potentially missing Unicode symbol',()=>{
 assert.match(source('index.html'),/<svg[^>]*viewBox="0 0 24 24"[^>]*>[\s\S]*?<path[^>]*><\/svg><\/div><h3>Maintain the system<\/h3>/);
});

test('GW-04: shared navigation is initialized for regular pages, with responsive menu',()=>{
 const app=source('assets/app.js'),css=source('assets/ui-refresh.css');
 assert.match(app,/function wireSharedNavigation/);
 assert.match(app,/wireSharedNavigation\(\);wireMenu\(\)/);
 for(const link of ['Start here','Solar calculator','Compare quotes','Bill analyzer','All tools','Guides','Energy Studio'])assert.ok(app.includes("'"+link),'Missing header item '+link);
 assert.match(css,/@media\(min-width:701px\) and \(max-width:1180px\)/);
 assert.match(app,/nav\.replaceChildren\(fragment\)/);
});

test('GW-05: tools count is derived from rendered cards, not a hardcoded badge',()=>{
 const tools=source('energy-tools/index.html'),js=source('assets/toolkit-ui.js');
 assert.match(tools,/id="gw-directory-total"/);
 assert.match(js,/countBadge\.textContent=String\(cards\.length\)/);
 assert.match(js,/shown\+' of '\+cards\.length/);
 assert.match(js,/cat\.split\(\/\\s\+\/\)\.includes\(filter\)/);
});

test('GW-06: invalid input does not keep stale roof note or silently clamp to minimum solar',()=>{
 const home=source('index.html'),js=source('assets/app.js'),roof=source('assets/energy-v2.js');
 assert.match(home,/id="solar-capacity-error"/);
 assert.match(js,/function validSolarCapacity/);
 assert.match(js,/if\(!capacityValid\)/);
 assert.match(js,/solar-savings/);
 assert.match(js,/textContent='—'/);
 assert.match(roof,/set\('v2-roof-note','Enter a roof area from 1 to 10,000 m²/);
});

test('GW-07: user-facing payback difference explanation exists on homepage and studio in all languages',()=>{
 const home=source('index.html'),studio=source('home-energy-studio/index.html'),i18n=source('assets/home-studio-i18n.js');
 assert.match(home,/85% of estimated generation/);assert.match(home,/50% solar self-use/);
 assert.match(home,/slab-based import charges/);
 assert.match(studio,/data-i18n="modelWhy"/);assert.match(studio,/data-i18n="modelCompare"/);
 assert.match(i18n,/"modelCompare"/);assert.match(i18n,/प्रति यूनिट/);assert.match(i18n,/సోలార్/);
});

test('GW-08: affiliate popup never overlays bill reader or homepage; bill placeholders and copy agree',()=>{
 const popup=source('assets/affiliate-popup.js'),bill=source('bill-reader/index.html'),css=source('assets/bill-advisor.css');
 assert.match(popup,/const inlineOffer=/);
 assert.match(popup,/bill-reader/);
 assert.match(popup,/gw-offer-inline/);
 assert.match(source('assets/styles.css'),/\.ghw-offer-popup\.gw-offer-inline\{position:relative/);
 assert.match(bill,/placeholder="e\.g\. 280"/);
 assert.match(bill,/id="gw-simple-calc" type="button">See result<\/button>/);
 assert.match(bill,/tap See result/);
 assert.match(css,/#v2-reader>\.v2-notice/);
});

test('GW-06: roof planner clears stale note on invalid percentage and recovers on valid input',()=>{
 const vm=require('node:vm');
 const listeners={};
 const nodes=new Map();
 for(const id of ['v2-roof','v2-roof-area','v2-roof-clear','v2-roof-result','v2-roof-note']){
  const node={value:id==='v2-roof-area'?'40':id==='v2-roof-clear'?'70':'',textContent:'',
   addEventListener(event,fn){listeners[id+':'+event]=fn;}};
  nodes.set(id,node);
 }
 const document={getElementById:id=>nodes.get(id)||null,querySelectorAll:selector=>selector==='#v2-roof input'?[nodes.get('v2-roof-area'),nodes.get('v2-roof-clear')]:[]};
 vm.runInNewContext(source('assets/energy-v2.js'),{document,window:{},Intl});
 assert.match(nodes.get('v2-roof-note').textContent,/Using 28 m²/);
 nodes.get('v2-roof-clear').value='150';listeners['v2-roof-clear:input']();
 assert.equal(nodes.get('v2-roof-result').textContent,'Check inputs');
 assert.doesNotMatch(nodes.get('v2-roof-note').textContent,/Using 28 m²/);
 nodes.get('v2-roof-clear').value='70';listeners['v2-roof-clear:input']();
 assert.match(nodes.get('v2-roof-note').textContent,/Using 28 m²/);
});
