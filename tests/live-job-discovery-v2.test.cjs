"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("../live-job-discovery-v2.js");
const NOW = Date.parse("2026-11-22T05:00:00.000Z");
const item = (title, location="Hyderabad, India", date="2026-11-15T12:00:00Z", url="https://job-boards.greenhouse.io/example/jobs/123") =>
  ({title,location,date,url,company:"Example"});
test("keyword normalisation preserves real words and common .NET variants",()=>{
  assert.equal(api.normalize("Senior DevOps Engineer"),"senior devops engineer");
  assert.equal(api.normalize(".NET Developer"),"dotnet developer");
  assert.equal(api.normalize("Dot Net Developer"),"dotnet developer");
  assert.equal(api.normalize("C# / C++ Engineer"),"csharp cpp engineer");
  assert.equal(api.normalize("Service Now Consultant"),"servicenow consultant");
});
test("role title is relevant, but incidental tool mentions are not",()=>{
  assert.equal(api.matchesTitle("Senior DevOps Engineer","devops"),true);
  assert.equal(api.matchesTitle("Platform / DevOps Engineer","DevOps Engineer"),true);
  assert.equal(api.matchesTitle("ServiceNow Developer","servicenow"),true);
  assert.equal(api.matchesTitle("Salesforce Developer","servicenow"),false);
  assert.equal(api.matchesTitle("Sales Engineer","DevOps Engineer"),false);
  assert.equal(api.matchesTitle("Senior .NET Developer",".net developer"),true);
  assert.equal(api.matchesTitle("Dotnet Engineer",".NET"),true);
  assert.equal(api.matchesTitle("Data Analyst","analyst"),true);
  assert.equal(api.matchesTitle("Product Manager",""),false);
});
test("India location requires explicit country, Indian city or state",()=>{
  ["India","Hyderabad","Bengaluru, Karnataka","Bangalore (India)","Pune, Maharashtra","Remote - India","Noida, Uttar Pradesh","Ahmedabad","Delhi NCR"]
    .forEach(loc=>assert.equal(api.isIndiaLocation(loc),true,loc));
  ["Remote - Worldwide","Singapore","Remote - USA","San Francisco, CA","New York, United States","London, UK","Remote","India / United States",""]
    .forEach(loc=>assert.equal(api.isIndiaLocation(loc),false,loc));
});
test("location-specific matching works with aliases, and remote is India-only",()=>{
  assert.equal(api.matchesLocation("Bangalore, India","bengaluru"),true);
  assert.equal(api.matchesLocation("New Delhi, India","delhi"),true);
  assert.equal(api.matchesLocation("Remote, India","remote"),true);
  assert.equal(api.matchesLocation("Hyderabad, India","remote"),false);
  assert.equal(api.matchesLocation("Remote US","remote"),false);
  assert.equal(api.matchesLocation("Pune, India","hyderabad"),false);
  assert.equal(api.matchesLocation("Hyderabad, India","india"),true);
});
test("30-day updated-date filter excludes stale, missing and future dates",()=>{
  assert.equal(api.recentlyUpdated("2026-11-15T12:00:00Z",NOW),true);
  assert.equal(api.recentlyUpdated("2026-10-24T12:00:00Z",NOW),true);
  assert.equal(api.recentlyUpdated("2026-10-21T12:00:00Z",NOW),false);
  assert.equal(api.recentlyUpdated("2026-12-15T12:00:00Z",NOW),false);
  assert.equal(api.recentlyUpdated("",NOW),false);
  assert.equal(api.recentlyUpdated("invalid",NOW),false);
});
test("official posting links must be HTTPS and not local",()=>{
  assert.equal(api.validPostingUrl("https://job-boards.greenhouse.io/company/jobs/123"),true);
  assert.equal(api.validPostingUrl("http://example.com"),false);
  assert.equal(api.validPostingUrl("javascript:alert(1)"),false);
  assert.equal(api.validPostingUrl("https://localhost/test"),false);
  assert.equal(api.validPostingUrl("https://user:pass@example.com"),false);
});
test("live results exclude overseas, stale, mismatched, duplicates, and invalid URLs",()=>{
  const wanted=item("DevOps Engineer");
  const jobs=[
    wanted,{...wanted},item("DevOps Engineer","Remote US","2026-11-15T12:00:00Z","https://job-boards.greenhouse.io/b/jobs/2"),
    item("Software Engineer","Pune, India","2026-11-15T12:00:00Z","https://job-boards.greenhouse.io/b/jobs/3"),
    item("DevOps Engineer","Pune, India","2026-09-15T12:00:00Z","https://job-boards.greenhouse.io/b/jobs/4"),
    item("DevOps Engineer","Hyderabad, India","2026-11-16T12:00:00Z","http://example.com/jobs/5")
  ];
  assert.deepEqual(api.selectJobs(jobs,"devops","india",NOW).map(j=>j.url),[wanted.url]);
});
test("results sorted newest first",()=>{
  const a=item("DevOps Engineer","India","2026-11-15T12:00:00Z","https://example.com/a");
  const b=item("DevOps Engineer","India","2026-11-20T12:00:00Z","https://example.com/b");
  assert.deepEqual(api.selectJobs([a,b],"devops","india",NOW).map(j=>j.url),[b.url,a.url]);
});
test("provider fetch maps Greenhouse response, never invents a job",async()=>{
  const jobs=[{id:12,title:"DevOps Engineer",location:{name:"Hyderabad, India"},updated_at:"2026-11-20T12:00:00Z",absolute_url:"https://job-boards.greenhouse.io/zenoti/jobs/12"}];
  const out=await api.fetchBoard({slug:"zenoti",name:"Zenoti"},async(url,opts)=>{
    assert.match(url,/boards-api\.greenhouse\.io\/v1\/boards\/zenoti\/jobs/);
    assert.equal(opts.credentials,"omit");
    return {ok:true,json:async()=>({jobs})};
  },500);
  assert.equal(out.board,"Zenoti");
  assert.equal(out.jobs[0].company,"Zenoti");
  assert.equal(out.jobs.length,1);
});
test("provider 404 and invalid API response handled safely",async()=>{
  await assert.rejects(
    api.fetchBoard({slug:"wrong",name:"Wrong"},async()=>({ok:false,status:404}),500),
    /No public board/);
  await assert.rejects(
    api.fetchBoard({slug:"wrong",name:"Wrong"},async()=>({ok:true,json:async()=>({hello:1})}),500),
    /Unexpected API response/);
});
function fakeDom(query="DevOps", location="india") {
  class Element {
    constructor(name="div"){this.name=name;this.children=[];this.events={};this.style={};this.value="";this.textContent="";this.disabled=false;this.attributes={};}
    addEventListener(type,handler){this.events[type]=handler;}
    appendChild(node){this.children.push(node);return node;}
    replaceChildren(...nodes){this.children=nodes;}
    setAttribute(name,value){this.attributes[name]=value;}
    removeAttribute(name){delete this.attributes[name];}
    focus(){this.focused=true;}
  }
  const elements=Object.fromEntries(["jobSearch","locationFilter","experienceFilter",
    "liveDiscoveryV2Run","liveDiscoveryV2Results","liveDiscoveryV2Status",
    "liveDiscoveryV2"].map(x=>[x,new Element(x)]));
  elements.jobSearch.value=query;
  elements.locationFilter.value=location;
  const document={getElementById:id=>elements[id]||null,createElement:tag=>new Element(tag)};
  return {document,elements};
}
test("UI reports successful lookups and failures separately; only true matches shown",async()=>{
  const {document,elements}=fakeDom();
  const fetcher=async url=>url.includes("/zenoti/")?{
    ok:true,json:async()=>({jobs:[{
      title:"DevOps Engineer",id:10,location:{name:"Hyderabad, India"},
      updated_at:new Date(Date.now()-DAY()).toISOString(),
      absolute_url:"https://job-boards.greenhouse.io/zenoti/jobs/10"
    }]})
  }:{ok:false,status:404};
  assert.equal(api.mount(document,fetcher),true);
  await elements.liveDiscoveryV2Run.events.click();
  assert.match(elements.liveDiscoveryV2Status.textContent,/1 matching India job/);
  assert.match(elements.liveDiscoveryV2Status.textContent,/1\/12 sources responded/);
  assert.equal(elements.liveDiscoveryV2Results.children.some(node=>node.name==="article"),true);
  assert.equal(elements.liveDiscoveryV2Results.children.some(node=>node.name==="details"),true);
  assert.equal(elements.liveDiscoveryV2Run.disabled,false);
});
function DAY(){return 86400000;}
test("UI handles all providers failing without showing misleading zero jobs",async()=>{
  const {document,elements}=fakeDom();
  assert.equal(api.mount(document,async()=>({ok:false,status:404})),true);
  await elements.liveDiscoveryV2Run.events.click();
  assert.match(elements.liveDiscoveryV2Status.textContent,/Live search unavailable/);
  assert.match(elements.liveDiscoveryV2Results.children[0].textContent,/published job feed/i);
});
test("empty keyword does not send network requests",async()=>{
  const {document,elements}=fakeDom("   ");
  let calls=0;
  api.mount(document,async()=>{calls++;});
  await elements.liveDiscoveryV2Run.events.click();
  assert.equal(calls,0);
  assert.equal(elements.jobSearch.focused,true);
});
