const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{},document:{getElementById:()=>null}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/toolkit-ui.js'),'utf8'),context);
const match=context.window.GharWattToolkitUI.matchTool;
test('all tools shown with no filter',()=>assert.equal(match('bills','Read my electricity bill','all',''),true));
test('category filter selects only matching category',()=>{assert.equal(match('appliances','My fan cost','bills',''),false);assert.equal(match('appliances','My fan cost','appliances',''),true)});
test('case-insensitive keyword search',()=>{assert.equal(match('appliances','Estimate Air Conditioner', 'all','AIR'),true);assert.equal(match('bills','Read my Bill','all','solar'),false)});
test('supports native-language search terms',()=>{assert.equal(match('guides','తెలుగు కరెంటు బిల్లు','guides','తెలుగు'),true);assert.equal(match('guides','हिंदी बिजली बिल','guides','बिजली'),true)});
test('search and category must both match',()=>{assert.equal(match('solar','Solar roof size','appliances','solar'),false);assert.equal(match('solar','Solar roof size','solar','roof'),true)});
