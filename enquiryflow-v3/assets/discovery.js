/** Read-only collection helpers shared by the student portal and staff console. */
export function todayIndia(now=new Date()) {
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(part=>[part.type,part.value]));
 return `${parts.year}-${parts.month}-${parts.day}`;
}
export function filterCourses(courses,{query='',category='All',mode='All',sort='featured'}={}) {
 const q=String(query).trim().toLocaleLowerCase();
 const found=(courses||[]).filter(c=>(category==='All'||c.category===category)
  && (mode==='All'||(c.delivery_modes||[]).some(x=>x.toLowerCase()===mode.toLowerCase()))
  && (!q||[c.title,c.description,c.category,(c.curriculum||[]).join(' ')].join(' ').toLocaleLowerCase().includes(q)));
 const known=c=>c.fee_inr!==null&&c.fee_inr!==undefined&&c.fee_inr!==''&&Number.isFinite(Number(c.fee_inr));
 const feeCompare=(a,b)=>known(a)&&known(b)?Number(a.fee_inr)-Number(b.fee_inr):known(a)?-1:known(b)?1:0;
 if(sort==='fee-asc')found.sort((a,b)=>feeCompare(a,b)||a.title.localeCompare(b.title));
 else if(sort==='fee-desc')found.sort((a,b)=>known(a)&&known(b)?Number(b.fee_inr)-Number(a.fee_inr)||a.title.localeCompare(b.title):known(a)?-1:known(b)?1:a.title.localeCompare(b.title));
 else if(sort==='duration')found.sort((a,b)=>Number(a.duration_weeks||Infinity)-Number(b.duration_weeks||Infinity)||a.title.localeCompare(b.title));
 else if(sort==='name')found.sort((a,b)=>a.title.localeCompare(b.title));
 return found;
}
export function filterUpcomingBatches(batches,courses,{courseId='All',mode='All',today=todayIndia()}={}) {
 const allowed=new Set((courses||[]).map(c=>c.id));
 return (batches||[]).filter(b=>allowed.has(b.course_id)
  && String(b.start_date||'')>=today
  && (courseId==='All'||b.course_id===courseId)
  && (mode==='All'||String(b.mode||'').toLowerCase()===mode.toLowerCase()))
  .sort((a,b)=>String(a.start_date).localeCompare(String(b.start_date)));
}
export function compareSelection(ids,courses,{max=3}={}) {
 const byId=new Map((courses||[]).map(c=>[c.id,c]));
 return [...new Set(ids)].slice(0,max).map(id=>byId.get(id)).filter(Boolean);
}
export function filterEnquiries(enquiries,{query='',status='All'}={}){
 const needle=String(query).trim().toLowerCase();
 return (enquiries||[]).filter(e=>(status==='All'||e.status===status)
  && (!needle||[e.full_name,e.email,e.question,e.status,e.id,e.course_title].join(' ').toLowerCase().includes(needle)));
}
/** Prevent CSV formula execution in Excel/Sheets and conform to RFC4180 escaping. */
export function safeCsvCell(value){
 let text=String(value??'');
 if(/^\s*[=+@\-\t\r]/.test(text))text="'"+text;
 return '"'+text.replaceAll('"','""')+'"';
}
export function buildEnquiriesCsv(enquiries,courseNames={}) {
 const headers=['ID','Created','Student name','Email','Course','Status','Follow-up','Question'];
 const rows=(enquiries||[]).map(e=>[e.id,e.created_at,e.full_name,e.email,courseNames[e.course_id]||'General',e.status,e.next_followup_at||'',e.question||'']);
 return '\uFEFF'+[headers,...rows].map(row=>row.map(safeCsvCell).join(',')).join('\r\n')+'\r\n';
}