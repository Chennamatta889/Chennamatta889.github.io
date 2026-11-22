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


test('garbled OCR is not silently interpreted as zero units or zero rupees',()=>{
 const txt='Vaneasea Se Excrcy Danan Go 2\nDuplicate Bill\nall ETT [=] wo | Tm)\n[Fa Tes TRG somata Toe Tram]';
 const r=m.parseBillText(txt);
 assert.equal(r.amount,null);
 assert.equal(r.units,null);
 assert.equal(r.days,null);
 assert.equal(m.assessBillText(txt,r,20).readable,false);
});
test('Maharashtra-style rounded payable and arrears labels are parsed separately',()=>{
 const txt='Rounded Bill: 1,830.00\nTotal Current Charges: 164.24\nTotal Arrears: 1,667.15\nUnits Consumed: 18';
 const r=m.parseBillText(txt);
 assert.equal(r.amount,1830);
 assert.equal(r.units,18);
 assert.equal(r.currentCharges,164.24);
 assert.equal(r.arrears,1667.15);
});
test('low OCR confidence prevents silent suggestions even if some numbers look plausible',()=>{
 const text='Bill Amount: 2000\nUnits Consumed: 300';
 assert.equal(m.assessBillText(text,m.parseBillText(text),15).readable,false);
 assert.equal(m.assessBillText(text,m.parseBillText(text),75).readable,true);
});


test('high OCR confidence with just one bill field is not enough to auto-fill',()=>{
 const raw='Rounded Bill: 1,830.00';
 const parsed=m.parseBillText(raw);
 assert.equal(parsed.amount,1830);
 assert.equal(m.assessBillText(raw,parsed,95).readable,false);
 assert.equal(m.assessBillText(raw,parsed,null).readable,true);
});
test('full-page and focused photo scans use different page segmentation modes',()=>{
 assert.equal(m.ocrPageSegMode(false),'11');
 assert.equal(m.ocrPageSegMode(true),'6');
});
test('gibberish from a two-column printed bill is rejected even when Tesseract reports confidence',()=>{
 const text='sass San Er Ososm Co\\nDuplicate Bill\\n[B Fa Tes TRG somata Toe Tram]\\nB EDE MTT';
 const parsed=m.parseBillText(text);
 assert.equal(parsed.amount,null);
 assert.equal(parsed.units,null);
 assert.equal(m.assessBillText(text,parsed,87).readable,false);
});


test('photo plan reduces large uploads below a tighter mobile processing budget',()=>{
 const p=m.ocrResizePlan(6000,8000);
 assert.ok(p.width<=1800);
 assert.ok(p.height<=1800);
 assert.ok(p.width*p.height<=2000000);
});
test('optional contrast processing does not throw or invent detail for a flat image',()=>{
 const pixels=new Uint8ClampedArray(16*16*4);
 for(let i=0;i<pixels.length;i+=4){pixels[i]=220;pixels[i+1]=220;pixels[i+2]=220;pixels[i+3]=255;}
 const changed=m.enhanceBillPixels(pixels,16,16);
 assert.equal(changed,false);
 assert.equal(pixels[0],220);
});
test('optional contrast processing preserves alpha and stretches low-contrast ink',()=>{
 const pixels=new Uint8ClampedArray(16*16*4);
 for(let i=0;i<pixels.length;i+=4){const k=(i/4)%16;pixels[i]=pixels[i+1]=pixels[i+2]=k<8?90:220;pixels[i+3]=255;}
 const changed=m.enhanceBillPixels(pixels,16,16);
 assert.equal(changed,true);
 assert.equal(pixels[3],255);
 assert.equal(pixels[0],0);
 assert.equal(pixels[8*4],255);
});
