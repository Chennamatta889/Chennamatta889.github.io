/* Career-Ops Live Discovery v2. Opt-in, read-only public ATS discovery.
   Results are shown only after a successful live employer-board response. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const btn=$("liveDiscoveryV2Run"),output=$("liveDiscoveryV2Results"),status=$("liveDiscoveryV2Status");
if(!btn||!output||!status)return;
const boards=["zenoti","techholding","freshworks","browserstack","razorpay","meesho","groww","phonepe"];
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[^\\p{L}\\p{N}]+/gu," ").replace(/\\s+/g," ").trim();
const india=loc=>/\\b(india|hyderabad|bengaluru|bangalore|pune|mumbai|chennai|delhi|noida|gurugram|gurgaon|kolkata|kochi|ahmedabad|jaipur|indore|coimbatore|bhubaneswar|visakhapatnam|trivandrum)\\b/i.test(loc)&&!/\\b(united states|usa|canada|uk|united kingdom|germany|australia|singapore)\\b/i.test(loc);
const roleWords=new Set(["engineer","developer","analyst","specialist","architect","consultant","administrator","tester","scientist","manager","lead","intern","trainee","senior","junior","full","stack"]);
function relevant(title,q){
 const words=norm(q).split(" ").filter(Boolean);
 if(!words.length)return false;
 const t=norm(title);
 const essential=words.filter(w=>!roleWords.has(w));
 return essential.length?essential.every(w=>(" "+t+" ").includes(" "+w+" ")):words.every(w=>(" "+t+" ").includes(" "+w+" "));
}
const safeDate=v=>{const d=new Date(v);return Number.isFinite(d.getTime())?d:null;};
const recent=v=>{const d=safeDate(v);if(!d)return false;const delta=Date.now()-d.getTime();return delta>=0&&delta<=30*86400000;};
const link=(text,url)=>{const a=document.createElement("a");a.textContent=text;a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.style.cssText="color:#a5f3ed;text-decoration:underline";return a;};
function card(job){
 const el=document.createElement("article");el.style.cssText="padding:14px;border:1px solid #31506a;border-radius:12px;background:#122a40;min-width:0";
 const title=document.createElement("strong");title.textContent=job.title;el.appendChild(title);
 const meta=document.createElement("p");meta.style.cssText="font-size:12px;opacity:.82;margin:7px 0";meta.textContent=job.company+" · "+job.location+" · Updated "+job.date.slice(0,10);el.appendChild(meta);
 el.appendChild(link("View official employer listing ↗",job.url));return el;
}
async function loadBoard(board,signal){
 const res=await fetch("https://boards-api.greenhouse.io/v1/boards/"+encodeURIComponent(board)+"/jobs",{signal,headers:{"Accept":"application/json"},cache:"no-store"});
 if(!res.ok)throw Error("Board unavailable");
 const json=await res.json();
 if(!Array.isArray(json.jobs))throw Error("Invalid board response");
 return json.jobs.map(j=>({title:String(j.title||""),company:board,location:String(j.location?.name||""),date:String(j.updated_at||""),url:String(j.absolute_url||""),id:String(j.id||"")}));
}
let active=null;
btn.addEventListener("click",async()=>{
 if(active)active.abort();
 const controller=new AbortController();active=controller;
 const q=$("jobSearch")?.value?.trim()||"software developer";
 const loc=$("locationFilter")?.value||"india";
 btn.disabled=true;output.replaceChildren();status.textContent="Checking public employer boards for “"+q+"”…";
 const timeout=setTimeout(()=>controller.abort(),12000);
 const settled=await Promise.allSettled(boards.map(b=>loadBoard(b,controller.signal)));
 clearTimeout(timeout);
 if(active!==controller)return;
 active=null;btn.disabled=false;
 let found=[],ok=0;
 for(const item of settled)if(item.status==="fulfilled"){ok++;found.push(...item.value);}
 const seen=new Set();
 found=found.filter(j=>{
  if(!j.url.startsWith("https://")||!recent(j.date)||!india(j.location)||!relevant(j.title,q))return false;
  if(loc!=="india"&&loc!=="remote"&&!norm(j.location).includes(norm(loc)))return false;
  if(loc==="remote"&&!/remote/i.test(j.location))return false;
  const key=j.url.toLowerCase();if(seen.has(key))return false;seen.add(key);return true;
 }).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,60);
 status.textContent=found.length+" matching India jobs updated within 30 days · "+ok+"/"+boards.length+" employer boards responded"+(ok===0?" (live lookup unavailable)":"")+". These are separate from the published job feed.";
 for(const j of found)output.appendChild(card(j));
 if(!found.length){const p=document.createElement("p");p.textContent=ok?"No matching recent jobs found on the responding boards. Try another role or the external search links below.":"Could not retrieve live jobs from these boards. Browser restrictions or source availability may be responsible; use the external searches below.";output.appendChild(p);}
});
})();
