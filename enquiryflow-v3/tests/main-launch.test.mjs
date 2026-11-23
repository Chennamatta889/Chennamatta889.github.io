import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
test('canonical Ctech student uses real-data entry and public metadata',()=>{
 const h=read('../index.html');
 assert.match(h,/Ctech Academy/);
 assert.match(h,/assets\/production-student\.js\?v=5\.3-qa/);
 assert.doesNotMatch(h,/assets\/student\.js\?v=3\.7/);
});
test('staff canonical uses real-data entry with private indexing',()=>{
 const h=read('../staff/index.html');
 assert.match(h,/assets\/production-staff\.js\?v=5\.3-qa/);
 assert.match(h,/noindex,nofollow/);
});
test('original fictional demo routes remain isolated',()=>{
 const a=read('../demo/index.html'),b=read('../demo/staff/index.html');
 assert.match(a,/\.\.\/assets\/student\.js\?v=3\.7/);
 assert.match(b,/\.\.\/\.\.\/assets\/staff\.js\?v=3\.7/);
 assert.match(read('../assets/config.js'),/demoMode:\s*true/);
});
test('no broken relative production navigation',()=>{
 const a=read('../assets/production-student.js'),b=read('../assets/production-staff.js');
 assert.ok(!a.includes('href="./production-staff.html"'));
 assert.ok(!b.includes('./production-student.html'));
 assert.match(a,/href="\/enquiryflow-v3\/staff\/"/);
 assert.match(b,/href="\/enquiryflow-v3\/"/);
});
test('canonical student auth isolated and real submit gate remains',()=>{
 const adapter=read('../assets/production-adapter.js'),student=read('../assets/production-student.js');
 assert.match(adapter,/const studentPage=location\.pathname\.endsWith\('\/production-student\.html'\)\s*\|\|/);
 assert.match(adapter,/if\(!isProductionReady\(institute\.data\(\)\)\)throw Error/);
 assert.match(student,/button\.disabled=!\(productionReady&&identity\?\.verified&&identity\?\.google\)/);
 assert.match(adapter,/ef3_real_intake_limits/);
});
test('GitHub Pages publisher includes rollback demo',()=>{
 const workflow=read('../../.github/workflows/publish-career-ops.yml');
 assert.match(workflow,/cp -R account-site\/enquiryflow-v3\/demo site\/enquiryflow-v3\/demo/);
 assert.match(workflow,/cp account-site\/enquiryflow-v3\/index\.html site\/enquiryflow-v3\//);
});
