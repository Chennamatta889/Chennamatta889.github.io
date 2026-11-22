const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const sandbox={window:{},document:{getElementById:()=>null},Intl};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/energy-v2.js'),'utf8'),sandbox);
const m=sandbox.window.GharWattV2;
test('bill OCR parser reads labelled amount and units, not meter number',()=>{
 const r=m.parseBillText('Meter Number: 12345678\nUnits Consumed: 256\nBill Amount: Rs. 2,340.00\nBilling Days: 31');
 assert.equal(r.amount,2340);assert.equal(r.units,256);assert.equal(r.days,31);
});
test('OCR parser rejects unlabelled numbers and identity information',()=>{
 const r=m.parseBillText('Customer: 9876543210\nMeter 145000\nDate 02-01-2026');
 assert.equal(r.amount,null);assert.equal(r.units,null);
});
test('bill difference normalizes by days and does not invent usage',()=>{
 const a=m.compareBills({amount:1000,days:30},{amount:1400,days:35});
 assert.equal(a.rupeeChange,400);assert.equal(a.unitsKnown,false);assert.equal(a.perDayAfter,40);
});
test('units comparison available with both readings',()=>{
 const a=m.compareBills({amount:1000,days:30,units:100},{amount:1500,days:30,units:150});assert.equal(a.unitChange,50);assert.equal(a.unitsKnown,true);
});
test('appliance plan sorts high consumption and computes units',()=>{
 const r=m.applianceUse([{name:'Fan',watts:65,hours:10,count:2},{name:'AC',watts:1500,hours:6,count:1}],8);
 assert.equal(r.units,309);assert.equal(r.cost,2472);assert.equal(r.items[0].name,'AC');
});
test('appliance planner rejects impossible hours and wattages',()=>{assert.equal(m.applianceUse([{watts:100,hours:27,count:1}],8),null)});
test('goal requires plausible target and rate',()=>{assert.equal(m.savingsGoal(2000,1500,10).unitTarget,50);assert.equal(m.savingsGoal(1000,1200,10).gap,0);assert.equal(m.savingsGoal(1000,800,0),null)});
test('zero interest EMI and normal EMI calculations',()=>{
 assert.equal(m.loanEmi(12000,0,12).emi,1000);
 const r=m.loanEmi(100000,10,12);assert.ok(r.emi>8500&&r.emi<9000);assert.ok(r.interest>0);
});

test('photo resizer does not enlarge small readable images',()=>{
 const r=m.ocrResizePlan(1200,1600);assert.equal(r.width,1200);assert.equal(r.height,1600);assert.equal(r.resized,false);
});
test('photo resizer scales large camera images and preserves aspect ratio',()=>{
 const r=m.ocrResizePlan(6000,8000);assert.ok(r.height<=2400);assert.ok(r.width*r.height<=3600000);assert.ok(Math.abs(r.width/r.height-0.75)<0.001);assert.equal(r.resized,true);
});
test('photo resizer caps huge square images by pixel area',()=>{
 const r=m.ocrResizePlan(6000,6000);assert.ok(r.width*r.height<=3600000);assert.equal(r.width,r.height);
});
test('photo resizer rejects corrupt dimension values',()=>{
 assert.equal(m.ocrResizePlan(0,100),null);assert.equal(m.ocrResizePlan(100,Infinity),null);
});
