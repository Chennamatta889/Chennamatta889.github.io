const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const context={window:{},document:{getElementById:()=>null}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/bill-only.js'),'utf8'),context);
const estimate=context.window.GharWattBillOnly.estimateFromAmount;
test('bill amount is insufficient if blank, nonnumeric, negative or tiny',()=>{for(const x of ['',0,-50,99,'abc',Infinity])assert.equal(estimate(x,1),null)});
test('one-month bill produces transparent range and solar sizing',()=>{const r=estimate(2000,1);assert.equal(r.monthly,2000);assert.equal(r.minimumUnits,185);assert.equal(r.maximumUnits,400);assert.equal(r.smallestKw,2);assert.equal(r.largestKw,4);assert.equal(r.exampleRate,7.5);assert.ok(r.exampleUnits>r.minimumUnits&&r.exampleUnits<r.maximumUnits)});
test('two-month bills are divided before estimating usage',()=>{const r=estimate(2000,2);assert.equal(r.monthly,1000);assert.equal(r.minimumUnits,85);assert.equal(r.maximumUnits,200)});
test('negative or impossible billing periods are not accepted',()=>{assert.equal(estimate(2000,0),null);assert.equal(estimate(2000,4),null)});
test('non-energy assumption is limited to 20 percent on small bills',()=>{const r=estimate(200,1);assert.equal(r.nonEnergy,40);assert.equal(r.minimumUnits,16);assert.equal(r.maximumUnits,40)});
