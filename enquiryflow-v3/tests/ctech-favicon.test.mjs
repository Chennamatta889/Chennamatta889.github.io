import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const pages = [
  '../index.html',
  '../staff/index.html',
  '../assets/production-student.html',
  '../assets/production-staff.html',
  '../assets/owner-launch.html',
  '../assets/production-privacy.html'
];

test('Ctech Academy favicon is a self-contained accessible SVG', () => {
  const icon=read('../assets/favicon.svg');
  assert.match(icon, /<svg\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(icon, /viewBox="0 0 64 64"/);
  assert.match(icon, /<title id="title">Ctech Academy<\/title>/);
  assert.match(icon, /<path /);
  assert.match(icon, /<circle /);
  assert.ok(icon.length < 2000, 'favicon should be lightweight');
  assert.doesNotMatch(icon, /<(?:script|image|foreignObject)\b|https?:\/\//i);
});

test('All production entry pages refer to the isolated Ctech favicon', () => {
  for(const path of pages){
    const html=read(path);
    assert.match(html, /rel="icon" type="image\/svg\+xml" sizes="any" href="\/enquiryflow-v3\/assets\/favicon\.svg\?v=1"/, path);
    assert.match(html, /name="theme-color" content="#0D2F3E"/, path);
    assert.equal((html.match(/rel="icon"/g)||[]).length,1,path);
  }
});

test('Homepage, staff and demo entrypoints retain their original roles',()=>{
  assert.match(read('../index.html'), /production-student\.js/);
  assert.match(read('../staff/index.html'), /production-staff\.js/);
  assert.match(read('../demo/index.html'), /assets\/student\.js/);
  assert.match(read('../demo/staff/index.html'), /assets\/staff\.js/);
});
