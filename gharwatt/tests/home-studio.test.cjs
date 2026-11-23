const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const M=require('../assets/home-studio-math.js');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Telangana 2026-27 LT-I switches slab groups at 100 and 200 units',()=>{
 assert.equal(M.tariff({region:'TG',units:50,load:1}).energy,97.5);
 assert.equal(M.tariff({region:'TG',units:100,load:1}).energy,252.5);
 assert.equal(M.tariff({region:'TG',units:150,load:1}).energy,580);
 assert.equal(M.tariff({region:'TG',units:200,load:1}).energy,820);
 assert.equal(M.tariff({region:'TG',units:300,load:3}).energy,1790);
 assert.equal(M.tariff({region:'TG',units:400,load:3}).energy,2690);
 assert.equal(M.tariff({region:'TG',units:300,load:3,extra:100}).total,1920);
 assert.equal(M.tariff({region:'TG',units:801,load:3}).fixed,150);
});
test('Andhra Pradesh 2026-27 telescopic domestic rates',()=>{
 assert.equal(M.tariff({region:'AP',units:30,load:1}).energy,57);
 assert.equal(M.tariff({region:'AP',units:75,load:1}).energy,192);
 assert.equal(M.tariff({region:'AP',units:125,load:1}).energy,417);
 assert.equal(M.tariff({region:'AP',units:225,load:1}).energy,1017);
 assert.equal(M.tariff({region:'AP',units:300,load:3}).energy,1673.25);
 assert.equal(M.tariff({region:'AP',units:401,load:3}).energy,2558); // 30*1.9 + 45*3 + 50*4.5 +100*6 +175*8.75
});
test('Other states require manually-entered tariff; no false state averages',()=>{
 assert.equal(M.tariff({region:'OTHER',units:300,load:3}).ok,false);
 const r=M.tariff({region:'OTHER',units:300,load:3,flatRate:7.5,extra:100});
 assert.equal(r.energy,2250);assert.equal(r.fixed,0);assert.equal(r.total,2350);
 assert.match(r.note,/not been verified/);
});
test('Solar simulator avoids guaranteed bill elimination and export credit',()=>{
 const opts={region:'TG',units:300,load:3,extra:0,kw:3,yieldRate:4.2,shading:10,selfUse:50,exportRate:0,pricePerKw:60000,subsidyEligible:false,phase:'unknown'};
 const s=M.simulate(opts);assert.equal(s.ok,true);
 assert.equal(s.now.total,1820);
 assert.ok(Math.abs(s.monthlyProduction-340.2)<1e-8);
 assert.ok(s.modeledAfter>0);
 assert.equal(s.subsidy,0);
 assert.equal(s.gross,180000);
 assert.equal(s.net,180000);
 assert.ok(s.modeledSaving<s.now.energy);
 assert.match(s.methodology,/net metering/);
 const e=M.simulate({...opts,subsidyEligible:true});
 assert.equal(e.subsidy,78000);
 assert.equal(e.net,102000);
 assert.ok(Number.isFinite(e.payback));
});
test('phase and load checks are advisory, not hidden constraints',()=>{
 const s=M.simulate({region:'TG',units:500,load:3,roof:40,extra:0,kw:6,yieldRate:4.2,shading:0,selfUse:60,exportRate:0,pricePerKw:60000,phase:'single'});
 assert.equal(s.ok,true);
 assert.match(s.warnings.join(' '),/sanctioned load/);
 assert.match(s.warnings.join(' '),/single.phase/i);
 assert.match(s.warnings.join(' '),/roof area/);
});
test('Solar sizing honors roof area and sanctioned load',()=>{
 const normal=M.recommendation({units:300,roof:40,yieldRate:4.2,load:3});
 assert.equal(normal.recommendedKw,3);
 const small=M.recommendation({units:300,roof:20,yieldRate:4.2,load:3});
 assert.equal(small.recommendedKw,2);
 assert.equal(M.recommendation({units:300,roof:3,yieldRate:4.2,load:3}).recommendedKw,null);
});
test('quote normalization rejects zero and missing prices, parses only reviewable suggestions',()=>{
 const q=M.compareQuotes([{name:'A',cost:180000,kw:3},{name:'B',cost:'',kw:3.3},{name:'C',cost:270000,kw:5}]);
 assert.equal(q[0].costPerKw,60000);
 assert.equal(q[1].costPerKw,null);
 assert.equal(q[2].costPerKw,54000);
 const parsed=M.parseQuoteText('Grand total INR 195000. System size 3.3 kWp. Panel warranty 12 years. Inverter warranty 7 years.');
 assert.equal(parsed.cost,195000);assert.equal(parsed.kw,3.3);
 assert.equal(parsed.panelWarranty,12);assert.equal(parsed.inverterWarranty,7);
 assert.match(parsed.warnings[0],/Confirm/);
});
test('input constraints prevent invalid values and impossible costs',()=>{
 assert.equal(M.tariff({region:'AP',units:'',load:3}).ok,false);
 assert.equal(M.tariff({region:'AP',units:-1,load:3}).ok,false);
 assert.equal(M.tariff({region:'AP',units:3,load:0}).ok,false);
 assert.equal(M.simulate({region:'TG',units:300,load:3,kw:0,yieldRate:4,shading:0,selfUse:80,exportRate:0,pricePerKw:60000}).ok,false);
 assert.equal(M.centralCFA(3,false),0);
 assert.equal(M.centralCFA(3,true),78000);
 assert.equal(M.centralCFA(3,true,true),85800);
});
test('complete HTML, script and language assets are linked and localized',()=>{
 const page=read('home-energy-studio/index.html');
 const requiredIds=['gw-ai-quote-consent','gw-ai-quote-send','gw-ai-quote-preview','gw-ai-quote-answer','gw-cfa-category','gw-region','gw-discom','gw-units','gw-load','gw-phase','gw-extra','gw-kw','gw-roof','gw-yield','gw-shade','gw-self','gw-export','gw-eligible','gw-samples','gw-q-price-0','gw-q-kw-0','gw-q-normalized-0','gw-ocr-file','gw-ocr-read','gw-ocr-review','gw-ocr-accept','gw-print-report','gw-print','gw-download','gw-save','gw-restore','gw-clear-saved'];
 for(const id of requiredIds)assert.ok(page.includes('id="'+id+'"'),id);
 assert.match(page,/home-studio-math\.js/);assert.match(page,/home-studio-i18n\.js/);assert.match(page,/home-studio\.js/);assert.match(page,/home-studio\.css/);
 const context={window:{}};
 vm.runInNewContext(read('assets/home-studio-i18n.js'),context);
 const languages=context.window.GharWattStudioI18n;
 const keys=[...page.matchAll(/data-i18n="([^"]+)"/g)].map(m=>m[1]);
 for(const locale of ['en','te','hi'])for(const key of keys)assert.ok(languages[locale][key],locale+' missing '+key);
 assert.ok(!page.includes('type="submit"'));
 assert.ok(read('sitemap.xml').includes('/gharwatt/home-energy-studio/'));
 assert.ok(read('index.html').includes('href="home-energy-studio/"'));
 assert.ok(read('energy-tools/index.html').includes('href="../home-energy-studio/"'));
 assert.ok(read('discover/index.html').includes('href="../home-energy-studio/"'));
});
test('quote file text stays in browser and report save is opt-in',()=>{
 const ui=read('assets/home-studio.js');
 assert.match(ui,/localStorage\.setItem\(STORAGE_KEY/);
 assert.match(ui,/window\.print\(\)/);
 assert.match(ui,/readPdf\(file\)/);
 assert.match(ui,/readImage\(file\)/);
 assert.match(ui,/M\.parseQuoteText\(text\)/);
 assert.match(ui,/gw-ocr-accept/);
 assert.match(ui,/gw-ai-quote-consent/);
 assert.match(ui,/promptForQuotes/);
 assert.match(ui,/getOrCreateBrowserId/);
 assert.match(ui,/shareBill:false,context:null,message,history:\[\]/);
 assert.match(ui,/const message=promptForQuotes\(\)/);
 assert.match(ui,/gw-ai-quote-preview/);
 assert.ok(!ui.includes('FormData('));
});

test('other-state special CFA requires verified, explicit assumption',()=>{
 const base={region:'OTHER',units:300,load:3,flatRate:7.5,extra:0,kw:3,yieldRate:4,shading:10,selfUse:50,exportRate:0,pricePerKw:60000};
 const none=M.simulate({...base,subsidyEligible:false});
 const special=M.simulate({...base,subsidyEligible:true,special:true});
 assert.equal(none.ok,true);assert.equal(none.subsidy,0);
 assert.equal(special.subsidy,85800);
 assert.equal(special.net,94200);
});
