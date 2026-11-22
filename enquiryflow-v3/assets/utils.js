export const $=(selector,root=document)=>root.querySelector(selector);
export const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
export function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export const money=n=>Number.isFinite(Number(n))?'₹'+Number(n).toLocaleString('en-IN'):'Contact institute';
export const str=value=>String(value??'').trim();
export function safeUrl(value){try{const u=new URL(str(value));return u.protocol==='https:'?u.href:''}catch{return ''}}
export const slug=value=>str(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,65);
export const shortDate=date=>date?new Date(date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'To be announced';
export function validateEnquiry(e,{demo=false}={}){
 const errors=[];
 const name=str(e.full_name),email=str(e.email),question=str(e.question);
 if(name.length<2||name.length>90)errors.push('Enter a name between 2 and 90 characters.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)||email.length>180)errors.push('Enter a valid email address.');
 if(question.length>1500)errors.push('Please shorten the question to 1,500 characters.');
 if(demo&&(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(question)||/\b\d{10,}\b/.test(question)))errors.push('Do not include personal contact information in fictional demo questions.');
 if(!e.consent)errors.push('Confirm that you agree to be contacted about this enquiry.');
 if(demo&&(!/^(demo|test|sample)\b/i.test(name)||!/@example\.(com|org|net)$/i.test(email)))errors.push('Demo only: use a Demo/Test/Sample name and an @example.com email.');
 return errors;
}
export const uniqueId=()=>globalThis.crypto?.randomUUID?.() || `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function parseCsv(text){
 const out=[];let row=[],field='',quoted=false;const raw=String(text||'').replace(/^\uFEFF/,'');
 for(let i=0;i<raw.length;i++){const ch=raw[i];if(ch==='"'){if(quoted&&raw[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(ch===','&&!quoted){row.push(field);field='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&raw[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))out.push(row);row=[];field='';}else field+=ch;}
 if(quoted)throw Error('CSV has an unclosed quoted value.');row.push(field);if(row.some(v=>v.trim()))out.push(row);
 if(out.length<2)throw Error('CSV must contain headings and at least one course.');
 const keys=out.shift().map(x=>slug(x).replaceAll('-','_'));
 const allowed=['title','description','category','duration_weeks','fee_inr','delivery_modes','curriculum','source_url','fee_note'];
 if(!keys.includes('title'))throw Error('A title column is required.');
 if(out.length>100)throw Error('Maximum 100 courses per import.');
 return out.map((fields,rowIndex)=>{const entry={};keys.forEach((key,i)=>{if(allowed.includes(key))entry[key]=str(fields[i])});if(!entry.title||entry.title.length>150)throw Error(`Invalid title in CSV row ${rowIndex+2}.`);entry.fee_inr=entry.fee_inr?Number(entry.fee_inr):null;if(entry.fee_inr!==null&&(!Number.isFinite(entry.fee_inr)||entry.fee_inr<0||entry.fee_inr>10000000))throw Error(`Invalid fee in row ${rowIndex+2}.`);entry.duration_weeks=entry.duration_weeks?Number(entry.duration_weeks):null;if(entry.duration_weeks!==null&&(!Number.isInteger(entry.duration_weeks)||entry.duration_weeks<1||entry.duration_weeks>400))throw Error(`Invalid duration in row ${rowIndex+2}.`);entry.curriculum=entry.curriculum?entry.curriculum.split('|').map(str).filter(Boolean):[];entry.delivery_modes=entry.delivery_modes?entry.delivery_modes.split('|').map(str).filter(Boolean):[];entry.slug=slug(entry.title);entry.published=false;entry.verified_at=null;return entry});
}
export function searchKnowledge(query,records){
 const q=str(query).toLowerCase();if(!q)return {answer:'Ask about courses, fees, timings or demo classes.',sources:[],handoff:false};
 const tokens=q.match(/[a-z0-9]+/g)||[];
 const courses=(records.courses||[]).filter(c=>c.published&&c.verified_at);
 const batches=(records.batches||[]).filter(b=>b.published);
 const faqs=(records.faqs||[]).filter(f=>f.published);
 const ranked=courses.map(c=>({c,score:(c.title.toLowerCase().split(/\W+/).filter(w=>w.length>2).filter(w=>tokens.includes(w)).length*2)+(tokens.includes(c.slug?.split('-')[0])?1:0)})).sort((a,b)=>b.score-a.score);
 const top=ranked[0]?.score>0?ranked[0].c:null;
 const wantsFee=/\b(fee|fees|price|cost|pay|rupees|charge)\b/.test(q);
 const wantsTime=/\b(batch|batches|timing|schedule|start|weekend|weekday|seat|class)\b/.test(q);
 const wantsCourse=/\b(course|syllabus|curriculum|learn|duration|month|week)\b/.test(q);
 if(top&&wantsFee)return {answer:`Published sample fee for ${top.title}: ${money(top.fee_inr)}. ${top.fee_note||'Confirm final pricing with the institute.'}`,sources:top.source_url?[top.source_url]:[],handoff:false};
 if(top&&wantsTime){const selected=batches.filter(b=>b.course_id===top.id).slice(0,3);return selected.length?{answer:selected.map(b=>`${b.label}: ${shortDate(b.start_date)}, ${b.days}, ${b.time_window} (${b.mode}).`).join(' '),sources:top.source_url?[top.source_url]:[],handoff:false}:{answer:'No verified upcoming batch is published for that course. Request a staff callback.',sources:[],handoff:true};}
 if(top&&wantsCourse)return {answer:`${top.title}: ${top.description} Duration: ${top.duration_weeks} weeks. Syllabus: ${(top.curriculum||[]).join(', ')}.`,sources:top.source_url?[top.source_url]:[],handoff:false};
 const ignored=new Set(['what','when','where','does','this','that','with','from','have','there','will','would','please','give','tell','your','about','much','many']);
 const topics=tokens.filter(w=>w.length>3&&!ignored.has(w));
 const faq=faqs.map(f=>({f,score:((f.question.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>topics.includes(w))).length})).sort((a,b)=>b.score-a.score)[0];
 if(faq&&faq.score>0)return {answer:faq.f.answer,sources:faq.f.source_url?[faq.f.source_url]:[],handoff:false};
 if(/\b(courses|programs|offer|teach)\b/.test(q))return {answer:'Published courses: '+courses.map(c=>c.title).join(', ')+'.',sources:[],handoff:false};
 return {answer:'I cannot confirm that from the approved institute knowledge currently available. Please submit an enquiry for a staff response.',sources:[],handoff:true};
}