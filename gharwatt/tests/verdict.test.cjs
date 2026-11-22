const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx={window:{},document:{getElementById:()=>null},Intl};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/verdict.js'),'utf8'),ctx);
const {verdict,comparePaths}=ctx.window.GharWattVerdict;
test('₹500 and 40 monthly units: recommend free habits not purchases',()=>{
 const v=verdict({amount:500,units:40,period:'monthly'});
 assert.equal(v.key,'free-first');
 assert.match(v.title,/free habits/i);
 assert.match(v.reason,/low in absolute terms/i);
 assert.match(v.caution,/not proof/i);
});
test('without billing period, no monthly consumption category is assigned',()=>{
 const v=verdict({amount:500,units:40,period:'unknown'});
 assert.equal(v.key,'check-period');
 assert.match(v.caution,/period/i);
});
test('no units does not produce advice about solar sizing or guessed consumption',()=>{
 const v=verdict({amount:500,units:null,period:'monthly'});
 assert.equal(v.key,'need-units');
 assert.match(v.caution,/cannot estimate/i);
});
test('arrears-heavy example is flagged before any solar advice',()=>{
 const v=verdict({amount:1830,units:18,period:'monthly',arrears:1667.15});
 assert.equal(v.key,'arrears');
 assert.match(v.reason,/Old dues/i);
 assert.match(v.caution,/never size solar/i);
});
test('large household with owned suitable roof is asked for quotes, not told to purchase',()=>{
 const v=verdict({amount:4000,units:400,period:'monthly',home:'own',roof:'yes'});
 assert.equal(v.key,'compare-roof');
 assert.match(v.caution,/not a recommendation to purchase solar/i);
});
test('renters and properties without suitable roof do not receive unsupported solar recommendation',()=>{
 for(const p of [{home:'rent',roof:'yes'},{home:'own',roof:'no'}]){
  const v=verdict({amount:3000,units:350,period:'monthly',...p});
  assert.equal(v.key,'efficiency-first');
 }
});
test('savings comparison is illustrative and uses user entered marginal rate',()=>{
 const r=comparePaths({units:40,period:'monthly',rate:8,reducePercent:10,
  upgrade:{oldWatts:70,newWatts:35,hours:6,count:1,extraCost:''}});
 assert.equal(r.save.unitsSaved,4);
 assert.equal(r.save.estimatedMonthlyRupees,32);
 assert.equal(r.upgrade.unitsSaved,6.3);
 assert.equal(r.upgrade.estimatedMonthlyRupees,50.4);
 assert.equal(r.upgrade.paybackMonths,null);
 assert.equal(r.solar.ready,false);
 assert.match(r.warning,/NOT total bill amount/i);
});
test('purchasing an actual efficient fan only has conditional simple payback',()=>{
 const r=comparePaths({units:40,period:'monthly',rate:8,reducePercent:10,
  upgrade:{oldWatts:70,newWatts:35,hours:6,count:1,extraCost:1000}});
 assert.equal(r.upgrade.paybackMonths,19.84);
});
test('no real solar quote means no invented solar return',()=>{
 const r=comparePaths({units:400,period:'monthly',rate:8,reducePercent:10,home:'own',roof:'yes',
  solar:{netCost:'',monthlyOffset:'',annualMaintenance:''}});
 assert.equal(r.solar.ready,false);
 assert.equal(r.solar.paybackMonths,undefined);
});
test('renter cannot see solar savings as if roof installation were approved',()=>{
 const r=comparePaths({units:400,period:'monthly',rate:8,reducePercent:10,home:'rent',roof:'no',
  solar:{netCost:100000,monthlyOffset:200,annualMaintenance:0}});
 assert.equal(r.solar.ready,false);
 assert.match(r.solar.message,/own the home/i);
});
test('quote offset is capped to billed units and export revenue is excluded',()=>{
 const r=comparePaths({units:40,period:'monthly',rate:8,reducePercent:10,home:'own',roof:'yes',
  solar:{netCost:180000,monthlyOffset:100,annualMaintenance:''}});
 assert.equal(r.solar.ready,true);
 assert.equal(r.solar.quotedOffset,100);
 assert.equal(r.solar.offsetUsed,40);
 assert.equal(r.solar.grossMonthlyRupees,320);
 assert.equal(r.solar.netMonthlyRupees,null);
 assert.equal(r.solar.paybackMonths,562.5);
 assert.match(r.solar.message,/No export revenue/i);
 assert.match(r.solar.message,/excludes maintenance/i);
});
test('maintenance can reduce financial return but does not become a fabricated default',()=>{
 const r=comparePaths({units:400,period:'monthly',rate:8,reducePercent:10,home:'own',roof:'yes',
  solar:{netCost:150000,monthlyOffset:200,annualMaintenance:1200}});
 assert.equal(r.solar.ready,true);
 assert.equal(r.solar.grossMonthlyRupees,1600);
 assert.equal(r.solar.netMonthlyRupees,1500);
 assert.equal(r.solar.paybackMonths,100);
 assert.equal(r.solar.maintenanceKnown,true);
});
test('no monthly bill or invalid savings rate prevents misleading cash estimates',()=>{
 const r=comparePaths({units:40,period:'unknown',rate:8,reducePercent:10,
  upgrade:{oldWatts:70,newWatts:35,hours:6,count:1}});
 assert.equal(r.baselineReady,false);
 assert.equal(r.save.ready,false);
 assert.equal(r.upgrade.ready,false);
 const bad=comparePaths({units:40,period:'monthly',rate:0,reducePercent:10});
 assert.equal(bad.save.ready,false);
});
test('implausible upgrade cannot show confident payback',()=>{
 const r=comparePaths({units:40,period:'monthly',rate:8,reducePercent:10,
  upgrade:{oldWatts:1500,newWatts:200,hours:20,count:1,extraCost:1000}});
 assert.equal(r.upgrade.ready,true);
 assert.equal(r.upgrade.plausible,false);
 assert.equal(r.upgrade.paybackMonths,null);
});
