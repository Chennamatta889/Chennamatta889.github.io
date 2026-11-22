export const $=(selector,root=document)=>root.querySelector(selector);
export const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
export function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export const money=n=>n!==null && n!==undefined && n!=='' && Number.isFinite(Number(n))?'₹'+Number(n).toLocaleString('en-IN'):'Contact institute';
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
// Deterministic, institute-grounded conversational assistant. Does not use an LLM or send messages.
const TALK_STOP = new Set('i me my we our the this that those these what which when where who why how can could should would please tell show give know like want need there here available do does is are a an of in for on and or to with at by from about much many you your course courses program programs classes class fee fees batch batches schedule timing cost price starts start'.split(' '));
const words = text => String(text || '').toLowerCase().match(/[a-z0-9]+/g) || [];
const has = (text, pattern) => pattern.test(text);
const isSample = institute => /^(demo|sample|test)/i.test(institute?.slug || '') || /fictional/i.test(institute?.about || '');
const dateString = (day = new Date()) => day instanceof Date ? day.toISOString().slice(0, 10) : String(day).slice(0, 10);
const prettyModes = c => (c.delivery_modes || []).join(' and ') || 'delivery mode not specified';
const feeLine = (course, sample) => Number.isFinite(Number(course.fee_inr)) && course.fee_inr !== null && course.fee_inr !== ''
 ? `${sample ? 'Illustrative demo fee' : 'Published fee'} for ${course.title}: ${money(course.fee_inr)}. ${course.fee_note || 'Confirm the final payable amount and inclusions directly with the institute.'}`
 : `No verified fee is published for ${course.title}. Please request a quote from the institute.`;

function courseHits(question, courses) {
 const q = ` ${words(question).join(' ')} `;
 return courses.map(c => {
  const titleWords = words(c.title).filter(w => w.length > 2 && !['full', 'stack', 'engineering', 'course', 'training'].includes(w));
  const aliases = [];
  if (/devops|cloud/i.test(c.title)) aliases.push(['devops',7],['aws',6],['azure',5],['kubernetes',5],['jenkins',5],['terraform',5],['cloud',5]);
  if (/python/i.test(c.title)) aliases.push(['python',8],['django',6],['flask',6]);
  if (/java/i.test(c.title)) aliases.push(['java',8],['spring boot',7],['spring',6]);
  if (/analytics|analyst/i.test(c.title)) aliases.push(['analytics',8],['data analytics',9],['power bi',7],['powerbi',7],['tableau',6]);
  let score = 0;
  const fullTitle = words(c.title).join(' ');
  if (q.includes(` ${fullTitle} `)) score += 12;
  for (const w of titleWords) if (q.includes(` ${w} `)) score += w === 'analytics' || w === 'devops' || w === 'python' || w === 'java' ? 7 : 1;
  for (const [alias, points] of aliases) if (q.includes(` ${alias} `)) score += points;
  return {course:c,score};
 }).filter(v => v.score >= 4).sort((a,b)=>b.score-a.score || a.course.title.localeCompare(b.course.title));
}
function faqAnswer(question, faqs) {
 const q = words(question).filter(w=>w.length>2 && !TALK_STOP.has(w));
 if (!q.length) return null;
 const matches = faqs.map(f => {
  const tokens = [...new Set(words(f.question).filter(w=>w.length>2 && !TALK_STOP.has(w)))];
  const overlap = tokens.filter(w=>q.includes(w)).length;
  const score = overlap / Math.max(1,Math.min(q.length,tokens.length));
  return {f,overlap,score};
 }).filter(x=>x.overlap>0 && x.score>=0.5).sort((a,b)=>b.score-a.score || b.overlap-a.overlap);
 return matches[0]?.f || null;
}
function nextBatches(course, batches, question, today) {
 const q = String(question||'').toLowerCase();
 const weekend = /\bweekends?|saturday|sunday|sat\s*sun\b/.test(q);
 const weekday = /\bweekdays?|monday|tuesday|wednesday|thursday|friday|mon\s*fri\b/.test(q);
 const online = /\bonline|remote|virtual\b/.test(q);
 const classroom = /\bclassroom|offline|in.person\b/.test(q);
 return batches.filter(b=>b.course_id===course.id && b.start_date>=today)
  .filter(b=>!weekend || /sat|sun|weekend/i.test(`${b.days} ${b.label}`))
  .filter(b=>!weekday || /mon|tue|wed|thu|fri|weekday/i.test(`${b.days} ${b.label}`))
  .filter(b=>!online || /online/i.test(b.mode))
  .filter(b=>!classroom || /classroom|offline|in.person/i.test(b.mode))
  .sort((a,b)=>String(a.start_date).localeCompare(String(b.start_date))).slice(0,3);
}
function combinedResult(answer, {courses=[],sourceUrls=[],handoff=false,suggestions=[],intent='knowledge',selectedCourseId=null}={}) {
 return {answer, sources:[...new Set(sourceUrls.map(safeUrl).filter(Boolean))], handoff, suggestions:suggestions.slice(0,4), intent, courseId:selectedCourseId, matchedCourses:courses.map(c=>c.id), mode:'approved-knowledge-retrieval'};
}

/** context: {courseId?: string, today?: Date | YYYY-MM-DD}. No cross-session storage. */
export function searchKnowledge(question, records, context={}) {
 const q=str(question).slice(0,500).toLowerCase();
 const courses=(records?.courses||[]).filter(c=>c.published===true && c.verified_at);
 const batches=(records?.batches||[]).filter(b=>b.published===true && courses.some(c=>c.id===b.course_id));
 const faqs=(records?.faqs||[]).filter(f=>f.published===true && (!f.course_id || courses.some(c=>c.id===f.course_id)));
 const sample=isSample(records?.institute);
 const today=dateString(context.today);
 const suggestions=['DevOps course fees','Next Python batch','Compare Java and Python','Placement policy'];
 if (!q.trim()) return combinedResult('Ask me about published course fees, topics, duration, upcoming batches, or institute policies.',{suggestions,intent:'welcome'});
 if (str(question).length>500) return combinedResult('Please shorten your question to 500 characters.',{suggestions,intent:'validation'});
 if (/(?:[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b\d{10,}\b)/i.test(q)) return combinedResult('Please do not share email addresses, phone numbers or other personal information in this chat. Use the enquiry form if you want staff to contact you.',{suggestions:['Show courses','Show upcoming batches'],intent:'privacy'});
 if (/^(?:hi|hello|hey|good morning|good evening|namaste|thanks|thank you)[!.\s]*$/i.test(q)) return combinedResult('Hello! I can help with published course details, fees, durations, schedules and institute policies. What would you like to explore?',{suggestions,intent:'greeting'});
 const hits=courseHits(q,courses);
 const explicit=hits.length?hits[0].course:null;
 const contextual=courses.find(c=>c.id===context.courseId)||null;
 const picked=explicit||contextual;
 const compare=/\b(?:compare|comparison|versus|vs|difference|cheaper|cheapest|affordable|lowest|best price|between|different|same)\b/.test(q);
 const fee=/\b(?:fees?|costs?|prices?|pricing|rupees?|pay|charges?|tuition|how much)\b/.test(q);
 const time=/\b(?:batches?|starts?|schedule|timings?|weekends?|weekdays?|morning|evening|slots?|seats?|online|offline|classroom|availability|when)\b/.test(q);
 const syllabus=/\b(?:syllabus|curriculum|topics?|teach|learn|duration|weeks?|months?|content|overview|details|what is covered)\b/.test(q);
 const guarantee=/\b(?:placements?|job guarantee|guaranteed job|employment guarantee|job assistance)\b/.test(q);
 const specialPricing=/\b(?:scholarships?|discounts?|offers?|refund|installments?|emi|cancellations?)\b/.test(q);
 const requestDemo=/\b(?:demo|trial|trial class)\b/.test(q);
 const admission=/\b(?:enrol|enroll|admission|register|join|apply)\b/.test(q);
 const contact=/\b(?:contact|address|location|where are you|phone|email|institute)\b/.test(q);
 const sources=hits.map(h=>h.course.source_url).filter(Boolean);
 const selectedSource=picked?.source_url?[picked.source_url]:[];
 const selectionSuggestions=courses.slice(0,4).map(c=>`${c.title} fees`);
 // Safety-sensitive or uncertain policies must never be invented from a generic FAQ similarity hit.
 if (guarantee || specialPricing) {
  const faq=faqAnswer(q,faqs) || (guarantee ? faqs.find(f=>/placement|employment|job guarantee/i.test(f.question)) : null);
  if (faq && (guarantee ? /placement|job|employment/i.test(faq.question) : /discount|scholarship|refund|installment|emi|cancellation/i.test(faq.question))) {
   return combinedResult(faq.answer,{sourceUrls:[faq.source_url],intent:'policy',suggestions:['What courses are available?','Request a demo class']});
  }
  return combinedResult(`I don't have a verified ${guarantee?'placement or employment guarantee':'discount, payment or refund policy'} to quote. Please ask the institute directly and request written confirmation.`,{handoff:true,intent:'policy',suggestions:['Show courses','Request a demo class']});
 }
 if (compare && courses.length) {
  let selected=hits.map(x=>x.course);
  if (selected.length<2 && /\b(?:cheapest|lowest|most affordable|cheaper)\b/.test(q)) selected=courses.filter(c=>c.fee_inr !== null && Number.isFinite(Number(c.fee_inr))).sort((a,b)=>Number(a.fee_inr)-Number(b.fee_inr)).slice(0,4);
  if (selected.length<2) return combinedResult('Which two courses would you like me to compare? Try “Compare Python and Java fees”.',{intent:'clarify',suggestions:['Compare Java and Python','Compare DevOps and Analytics'],handoff:false});
  const rows=selected.slice(0,3).map(c=>`${c.title}: ${c.fee_inr === null || !Number.isFinite(Number(c.fee_inr))?'fee not published':money(c.fee_inr)}; ${c.duration_weeks || 'unspecified'} weeks; ${prettyModes(c)}.`);
  return combinedResult(`${sample?'Illustrative demo comparison':'Published course comparison'}: ${rows.join(' ')} Published information can change; confirm current fees, batch seats and inclusions with the institute.`,{courses:selected,sourceUrls:selected.map(c=>c.source_url),intent:'compare',suggestions:[`${selected[0].title} syllabus`,`${selected[1].title} next batch`],selectedCourseId:null});
 }
 if (/\b(?:human|counselor|counsellor|counseling|counselling|staff|person|representative|callback|call back|talk to someone)\b/.test(q)) return combinedResult('I can help with published information, but an institute staff member must handle personal advice and confirmations. Use the enquiry form to request a callback. This preview records fictional enquiries only.',{handoff:true,intent:'handoff',selectedCourseId:picked?.id||null,suggestions:[picked?`${picked.title} fees`:'Show courses']});
 if (requestDemo) return combinedResult('You can request a demo class through the enquiry form. This pilot records fictional requests only and does not reserve a real seat. Dates and availability must be confirmed by staff.',{intent:'demo',handoff:true,selectedCourseId:picked?.id||null,suggestions:[picked?`${picked.title} next batch`:'Show upcoming batches']});
 if (admission) return combinedResult('The institute enquiry form is available below. Staff would handle admission steps and eligibility; this pilot does not complete enrollment or payment. Do not submit real contact details in demo mode.',{intent:'admissions',handoff:true,selectedCourseId:picked?.id||null,suggestions:[picked?`${picked.title} fees`:'Show course fees']});
 if (contact && !picked && !time && !fee && !syllabus) {
  const i=records?.institute||{};
  return combinedResult(`${i.name || 'The institute'}: ${i.address || i.city || 'Location not published'}. ${sample?'This is a fictional demo institute.':'For official contact details, use the institute website.'}`,{intent:'institute',sourceUrls:[i.website_url],handoff:!i.address,suggestions:['Show courses','Show upcoming batches']});
 }
 // Keep an approved FAQ as the source for generic questions not handled as a specific course fact.
 if (!picked && !fee && !time && !syllabus) {
  const faq=faqAnswer(q,faqs);
  if (faq) return combinedResult(faq.answer,{sourceUrls:[faq.source_url],intent:'faq',suggestions:['Show courses','Request a demo class']});
 }
 if (/\b(?:courses|programs|offer|teach|catalogue|catalog|list|options)\b/.test(q)&&!picked) {
  return combinedResult(`Published courses: ${courses.map(c=>c.title).join('; ')||'no courses published yet'}. Which one would you like to explore?`,{intent:'catalogue',suggestions:selectionSuggestions});
 }
 if (!picked && fee && /\b(?:all|every|each)\b/.test(q)) {
  return combinedResult(`${sample?'Illustrative demo fees':'Published fees'}: ${courses.map(c=>`${c.title}: ${money(c.fee_inr)}`).join('; ')}. Confirm the latest prices and inclusions directly with the institute.`,{courses,sourceUrls:courses.map(c=>c.source_url),intent:'fees-all',suggestions:selectionSuggestions});
 }
 if (hits.length>1 && !compare && (fee || time || syllabus)) {
  return combinedResult('I found multiple courses in your question. Please ask about one at a time, or say “Compare Java and Python”.',{intent:'clarify',suggestions:[`Compare ${hits[0].course.title} and ${hits[1].course.title}`,`${hits[0].course.title} fees`,`${hits[1].course.title} next batch`]});
 }
 if (!picked && (fee || time || syllabus)) return combinedResult('Which course do you mean? Please choose a published program so I can use its approved fees and schedule.',{intent:'clarify',suggestions:selectionSuggestions});
 if (picked) {
  // A named course may be known even when the user does not include an intent keyword.
  const parts=[];let handoff=false;
  const showFee=fee;
  const showTime=time && !/\b(?:duration|weeks?|months?)\b/.test(q);
  const showSyllabus=syllabus || (!fee && !time);
  if (showFee) {parts.push(feeLine(picked,sample));if(picked.fee_inr===null || picked.fee_inr==='')handoff=true;}
  if (showSyllabus) parts.push(`${picked.title}: ${picked.description || 'Description not published.'} Duration: ${picked.duration_weeks || 'not specified'} weeks. Topics: ${(picked.curriculum||[]).join(', ')||'syllabus not published'}. Delivery: ${prettyModes(picked)}.`);
  if (showTime) {
   const filtered=nextBatches(picked,batches,q,today);
   if(filtered.length)parts.push(`Upcoming published ${picked.title} batches: ${filtered.map(b=>`${b.label} starts ${shortDate(b.start_date)}; ${b.days}, ${b.time_window} (${b.mode})`).join('. ')}. Batch availability and seats require institute confirmation.`);
   else {parts.push(`No matching upcoming published batch was found for ${picked.title}${/weekend|saturday|sunday/i.test(q)?' with weekend timing':''}. Ask staff to confirm a new schedule.`);handoff=true;}
  }
  return combinedResult(parts.join('\n\n'),{courses:[picked],sourceUrls:selectedSource,handoff,intent:showFee&&showTime?'fee-and-batch':showFee?'fees':showTime?'batches':showSyllabus?'syllabus':'course',selectedCourseId:picked.id,suggestions:[`${picked.title} fees`,`${picked.title} next batch`,`${picked.title} syllabus`,'Request a demo class']});
 }
 return combinedResult('I cannot confirm that from the institute-approved information currently available. Please use the enquiry form to request a staff response rather than relying on a guess.',{handoff:true,intent:'unknown',suggestions:['Show courses','Compare Java and Python','Request a demo class']});
}