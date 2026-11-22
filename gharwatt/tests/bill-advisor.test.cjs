const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const context={window:{},document:{getElementById:()=>null},Intl};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/bill-advisor.js'),'utf8'),context);
const a=context.window.GharWattAdvisor;
test('extracts only recognized charge labels from text and ignores account numbers',()=>{
 const r=a.parseCharges('Account: 9876543210\nEnergy Charges: Rs 1,850.50\nFixed Charge: Rs 120\nElectricity Duty: 75\nArrears: 200\nRebate: 50');
 assert.equal(r.energy,1850.50);assert.equal(r.fixed,120);assert.equal(r.tax,75);assert.equal(r.arrears,200);assert.equal(r.rebate,50);
});
test('does not invent charges from unlabeled bill',()=>{
 const r=a.parseCharges('Bill date: 11-11-2026\nMeter number 123456789\nUsage 270 kWh');
 assert.equal(r.energy,null);assert.equal(r.fixed,null);
});
test('bill explanation separates daily values from tariff and checks reconciliation',()=>{
 const r=a.explainBill({amount:2400,units:300,days:30},{energy:2000,fixed:100,tax:200,arrears:200,rebate:100});
 assert.equal(r.amountDaily,80);assert.equal(r.unitsDaily,10);assert.equal(r.allInclusivePerUnit,8);assert.equal(r.remainder,0);
 assert.equal(r.breakdown.length,5);
});
test('no units means no inferred rate or units per day',()=>{
 const r=a.explainBill({amount:1250,units:null,days:28},{});
 assert.equal(r.unitsDaily,null);assert.equal(r.allInclusivePerUnit,null);assert.equal(r.remainder,null);
});
test('different billing lengths are normalized',()=>{
 const c=a.comparePeriods({amount:2000,units:200,days:25},{amount:2500,units:300,days:30});
 assert.equal(c.rupeeDelta,500);assert.equal(c.dailyUnitsBefore,8);assert.equal(c.dailyUnitsAfter,10);assert.equal(c.dailyRupeeDelta,3.33);
 assert.match(c.note,/different numbers of days/i);
});
test('missing prior kWh does not make a consumption claim',()=>{
 const c=a.comparePeriods({amount:1000,days:30},{amount:1400,units:210,days:30});
 assert.equal(c.unitsKnown,false);assert.equal(c.dailyUnitsDelta,null);
 assert.match(c.note,/cannot establish/i);
});
test('savings estimates use only user-selected appliance counts and reductions',()=>{
 const r=a.scenario([{name:'Fans',count:2,watts:65,hours:10,reduce:2},{name:'AC',count:1,watts:1500,hours:5,reduce:1}],8);
 assert.equal(r.savedUnits,52.8);assert.equal(r.savedRupees,422.4);assert.equal(r.items.length,2);
});
test('absent appliance does not contribute speculative savings',()=>{
 const r=a.scenario([{name:'AC',count:0,watts:1500,hours:6,reduce:1}],8);
 assert.equal(r.savedUnits,0);assert.equal(r.items.length,0);
});
test('rejects impossible savings scenario assumptions',()=>{
 assert.equal(a.scenario([{name:'Fan',count:1,watts:65,hours:5,reduce:7}],8),null);
 assert.equal(a.scenario([{name:'Fan',count:1,watts:65,hours:5,reduce:2}],0),null);
});
test('report explains assumptions and is printable without personal identifiers',()=>{
 const bill=a.explainBill({amount:1600,units:200,days:30},{});
 const plan=a.scenario([{name:'Fans',count:2,watts:65,hours:10,reduce:2}],8);
 const report=a.buildReport(bill,null,plan,100,bill.breakdown);
 assert.match(report,/ESTIMATE ONLY/);
 assert.match(report,/NOT your tariff/);
 assert.match(report,/30-day month/);
 assert.doesNotMatch(report,/Account:/);
});


test('arrears dominate historical bill; advisor explicitly blocks solar sizing from total payable',()=>{
 const bill=a.explainBill({amount:1830,units:18,days:46,currentCharges:164.24,arrears:1667.15},{});
 const insight=a.arrearsInsight(bill);
 assert.equal(bill.amount,1830);
 assert.equal(bill.currentCharges,164.24);
 assert.equal(bill.arrears,1667.15);
 assert.equal(insight.dominant,true);
 assert.ok(insight.percentage>=90);
 assert.match(insight.message,/Do NOT use total payable/);
 const report=a.buildReport(bill,null,null,0,[]);
 assert.match(report,/Total previous dues \/ arrears: ₹1,667/);
 assert.match(report,/IMPORTANT:/);
});
test('advisor does not invent arrears warnings when old dues were not supplied',()=>{
 const bill=a.explainBill({amount:2200,units:300,days:30},{});
 assert.equal(a.arrearsInsight(bill),null);
});
