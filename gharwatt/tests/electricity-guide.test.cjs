const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const path=require('node:path');
const sandbox={window:{},document:{getElementById:()=>null},Intl};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/electricity-guide.js'),'utf8'),sandbox);
const calc=sandbox.window.GharWattEnergyGuide.estimateUsage;
test('A 9 W LED for five hours per day uses 1.35 units in a month',()=>{const r=calc('led',5,1,8);assert.equal(r.units,1.35);assert.equal(r.cost,10.8)});
test('A sample 65 W fan for eight hours/day uses 15.6 units per month',()=>{const r=calc('fan',8,1,8);assert.equal(r.units,15.6);assert.equal(r.cost,124.8)});
test('Double appliance quantity doubles energy',()=>assert.equal(calc('fan',8,2,8).units,31.2));
test('Do not calculate exact fridge or unknown appliances',()=>assert.equal(calc('fridge',8,1,8),null));
test('Reject negative, impossible or misleading hours, counts or rates',()=>{for(const v of [calc('fan',25,1,8),calc('fan',-1,1,8),calc('fan',8,0,8),calc('fan',8,1,31),calc('fan',8,1,Infinity),calc('fan',8,1,8,0)])assert.equal(v,null)});
