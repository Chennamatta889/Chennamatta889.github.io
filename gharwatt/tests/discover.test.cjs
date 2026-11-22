const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{},document:{getElementById:()=>null},Intl};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/discover.js'),'utf8'),context);
const m=context.window.GharWattDiscover;
test('bill snapshot handles ₹500 and 40 units without implying actual tariff',()=>{
 const r=m.billSnapshot(500,40,'monthly');
 assert.equal(r.ok,true);assert.equal(r.amount,500);assert.equal(r.units,40);
 assert.equal(r.perUnit,12.5);assert.match(r.note,/not the tariff/i);
});
test('new visitor with amount only is supported',()=>{
 const r=m.billSnapshot(500,'','unknown','');
 assert.equal(r.ok,true);assert.equal(r.units,null);assert.equal(r.perUnit,null);
});
test('missing and invalid numbers never masquerade as zero',()=>{
 assert.equal(m.billSnapshot('',40).ok,false);
 assert.equal(m.billSnapshot(500,'forty').ok,false);
 assert.equal(m.billSnapshot(500,'', 'monthly', 'unknown').ok,false);
});
test('large previous dues are separated from current electricity consumption',()=>{
 const r=m.billSnapshot(1830,18,'unknown',1667.15);
 assert.equal(r.mostlyDues,true);assert.ok(r.oldShare>=90);
 assert.match(r.note,/old unpaid dues/i);
});
test('appliance presets work without asking users to supply watts',()=>{
 const f=m.estimateItem('fan',1,'normal');
 const led=m.estimateItem('led',2,'short');
 assert.equal(f.watts,65);assert.equal(f.hours,6);assert.equal(f.units,11.7);
 assert.equal(led.units,1.08);assert.equal(f.estimatedWatts,true);
});
test('explicit watt correction and counts are respected',()=>{
 const f=m.estimateItem('fan',2,'long',35);
 assert.equal(f.watts,35);assert.equal(f.units,21);
 assert.equal(f.estimatedWatts,false);
});
test('rejects invalid appliance assumptions',()=>{
 assert.equal(m.estimateItem('fan',1,'normal',0),null);
 assert.equal(m.estimateItem('ac',22,'normal'),null);
 assert.equal(m.estimateItem('unknown',1,'normal'),null);
 assert.equal(m.estimateItem('tv',1,'wrong'),null);
});
test('selected appliances do not claim to explain a meter bill precisely',()=>{
 const x=m.applianceSummary([{id:'fan',count:1,usage:'normal',watts:65}],40);
 assert.equal(x.units,11.7);assert.equal(x.exceedsBill,false);
 assert.match(x.explanation,/partial estimate/i);
});
test('warnings when assumptions exceed billed usage',()=>{
 const x=m.applianceSummary([{id:'ac',count:1,usage:'long',watts:1500}],40);
 assert.equal(x.exceedsBill,true);assert.match(x.explanation,/exceed the billed units/i);
});
test('bill detective does not infer causes with unknown units or billing days',()=>{
 const r=m.compareBills({amount:450,units:''},{amount:500,units:40});
 assert.equal(r.amountChange,50);assert.equal(r.unitChange,null);
 assert.match(r.explanation,/cannot tell/i);
});
test('bill detective only computes daily rate with both period lengths',()=>{
 const r=m.compareBills({amount:400,units:20,days:20},{amount:500,units:40,days:40});
 assert.equal(r.unitChange,20);assert.equal(r.dailyUnitsChange,0);
});
test('illustrative product comparisons compute kWh and payback and reject bad inputs',()=>{
 const r=m.compareDevices(70,35,8,30,8,900);
 assert.equal(r.savedUnits,8.4);assert.equal(r.savedRupees,67.2);
 assert.equal(r.paybackMonths,13.39);
 assert.equal(m.compareDevices(70,35,25,30,8,900),null);
});
test('empty product purchase price is not interpreted as free product',()=>{
 const r=m.compareDevices(60,9,5,30,8,'');
 assert.equal(r.priceDifference,null);
 assert.equal(r.paybackMonths,null);
});
test('challenge progress tracks completed days without pretending energy was saved',()=>{
 assert.equal(m.challengeCount([true,false,true,false,false,false,false]),2);
 assert.equal(m.challengeCount([]),0);
});
