const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const document={querySelectorAll:()=>[],currentScript:null};
const context={window:{},document,URL,fetch:undefined};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/product-showcase.js'),'utf8'),context);
const verify=context.window.GharWattProductLinks.validAffiliate;
test('no link means editorial card only',()=>{assert.equal(verify({product_name:'Meter',profit_link:''}),null)});
test('avoid unsafe link schemes',()=>{assert.equal(verify({product_name:'Meter',profit_link:'javascript:alert(1)'}),null);assert.equal(verify({product_name:'Meter',profit_link:'http://example.com/'}),null)});
test('require named actual product and secure URL',()=>{assert.equal(verify({product_name:'',profit_link:'https://example.com/'}),null);let good=verify({product_name:'Home energy meter',profit_link:'https://example.com/item?ref=abc'});assert.equal(good.name,'Home energy meter');assert.equal(good.url,'https://example.com/item?ref=abc')});
test('block embedded credentials in affiliate URL',()=>assert.equal(verify({product_name:'Home meter',profit_link:'https://me:pass@example.com/x'}),null));
