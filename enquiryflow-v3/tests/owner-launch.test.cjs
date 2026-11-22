const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../assets/owner-launch.html'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'../assets/owner-launch.js'),'utf8');
test('Owner launch page stays separate from production student and staff',()=>{
 assert.match(html,/owner-launch\.js\?v=1\.0/);
 assert.match(html,/noindex,nofollow,noarchive/);
 assert.match(html,/type="password"/);
 assert.match(html,/id="ownerAck"/);
 assert.match(html,/id="privacyAck"/);
 assert.match(html,/id="catalogAck"/);
});
test('Only authenticated verified institute owner can change Firestore',()=>{
 assert.match(js,/inMemoryPersistence/);
 assert.match(js,/snap\.data\(\)\.role!=='owner'/);
 assert.match(js,/snap\.data\(\)\.active!==true/);
 assert.match(js,/snap\.data\(\)\.institute_id!==ID/);
 assert.match(js,/await assertOwner\(\)/);
});
test('Profile save keeps intake closed; activation requires 3 checkboxes and confirmation',()=>{
 assert.match(js,/else patch\.production_ready=false/);
 assert.match(js,/allApproved\(\)/);
 assert.match(js,/if\(!confirm\('Open Ctech Academy to genuine student names/);
 assert.match(js,/await writeProfile\(true\)/);
 assert.match(js,/await writeProfile\(false\)/);
 assert.match(js,/production_ready:false/);
});
test('Includes consistent Ctech Academy name and stable existing institute document ID',()=>{
 assert.match(js,/const ID='demo-tech-academy'/);
 assert.match(js,/name!=='Ctech Academy'/);
 assert.match(js,/slug:'ctech-academy'/);
 assert.doesNotMatch(js,/allow read, write: if true/);
});