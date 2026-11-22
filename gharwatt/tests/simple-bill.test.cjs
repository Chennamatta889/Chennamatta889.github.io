const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{},document:{getElementById:()=>null},Intl};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/simple-bill.js'),'utf8'),context);
const quick=context.window.GharWattSimpleBill.quickBill;
test('only bill amount and units required for a quick result',()=>{
 const r=quick(1830,18);
 assert.equal(r.ok,true);
 assert.equal(r.amount,1830);
 assert.equal(r.units,18);
 assert.equal(r.unitsToAvoid,1.8);
 assert.equal(r.estimatedSaving,14.4);
 assert.equal(r.totalAverage,101.67);
 assert.equal(r.oldDues,null);
});
test('arrears-heavy real example is flagged without confusing payable with consumption costs',()=>{
 const r=quick(1830,18,8,1667.15);
 assert.equal(r.ok,true);
 assert.equal(r.mostlyArrears,true);
 assert.equal(r.estimatedCurrentPortion,162.85);
 assert.match(r.note,/Old dues/);
});
test('empty units never become zero or implied consumption',()=>{
 assert.equal(quick(1400,'').ok,false);
 assert.equal(quick('',250).ok,false);
 assert.equal(quick(1500,270,0).ok,false);
});
test('zero consumption is handled without dividing by zero',()=>{
 const r=quick(500,0);
 assert.equal(r.ok,true);
 assert.equal(r.totalAverage,null);
 assert.equal(r.estimatedSaving,0);
});
test('optional arrears must be plausible and clearly rejected if bad',()=>{
 assert.equal(quick(1800,200,8,'text').ok,false);
 assert.equal(quick(1800,200,8,1900).ok,true);
});
