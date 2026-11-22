/* EnquiryFlow: independent public facts snapshot, 2026-11-22. Not an official NareshIT service. */
(function(root){
'use strict';
const A=root.EnquiryAssistant;
if(!A)throw Error('FAQ assistant must load first');
const website='https://jntu.nareshit.com';
const catalog=website+'/courses/', contact=website+'/contact/', batchUrl=website+'/new-batches/';
const courses={
 'Python':{name:'Full Stack Python',duration:'5 months',fees:'₹20,000 without videos / ₹35,000 with videos',topics:'Python, Django, Flask, REST APIs, HTML, CSS, JavaScript and databases',url:website+'/courses/python-full-stack/'},
 'Java Full Stack':{name:'Java Full Stack',duration:'6 months',fees:'₹22,000 without videos / ₹34,000 with videos',topics:'Core Java, Spring Boot, ReactJS, SQL, microservices and Git',url:website+'/courses/java-full-stack/'},
 'Cloud & DevOps':{name:'DevOps with MultiCloud',duration:'4 months',fees:'₹22,000 without videos / ₹28,000 with videos',topics:'AWS, Azure, GCP, Linux, Git, Jenkins, Docker, Kubernetes and Terraform',url:website+'/courses/devops-with-multi-cloud/'},
 'Data Analytics':{name:'Data Analytics & Business Analytics',duration:'4 months',fees:'₹20,000 without videos / ₹26,000 with videos',topics:'Excel, SQL, Python, statistics, Power BI and Tableau',url:website+'/courses/data-analytics/'}
};
const base=A.answer;
function detectExplicit(question){
 const t=String(question||'');
 const hits=[['Cloud & DevOps',/\b(devops|multi.?cloud|aws|azure|kubernetes|jenkins|terraform)\b/i],['Java Full Stack',/\b(java|spring\s*boot)\b/i],['Python',/\b(python|django|flask)\b/i],['Data Analytics',/\b(analytics|power\s*bi|tableau|data\s*analysis)\b/i]].filter(([name,re])=>re.test(t));
 return hits.length===1?hits[0][0]:null;
}
A.answer=function(input,context){
 const q=String(input||'').trim(), b=base(input,context);
 if(b.intent==='empty'||b.intent==='too_long')return b;
 const key=detectExplicit(q)||b.course, c=courses[key]||null;
 const topic=c?c.name:'the chosen course';
 let answer='', sourceUrl=c?c.url:catalog, needsStaff=false;
 switch(b.intent){
  case 'greeting':answer='Hello! I can explain information published on the official NareshIT JNTU course pages. This independent EnquiryFlow demo is not operated by NareshIT and cannot book classes or forward your enquiry.';break;
  case 'courses':answer='The public NareshIT JNTU catalogue lists Full Stack Python, Java Full Stack, DevOps with MultiCloud, Data Analytics and Full Stack Software Testing, among other courses. This demonstration covers the first four in detail.';sourceUrl=catalog;break;
  case 'fees':answer=c?'The JNTU '+c.name+' page lists fees of '+c.fees+'. These were checked on 22 November 2026; confirm current fees, discounts, taxes and inclusions directly with the institute.':'The JNTU branch publicly lists fees for several programs. Please specify Full Stack Python, Java Full Stack, DevOps with MultiCloud or Data Analytics to see the published options and original source. Confirm current fees directly with the institute.';needsStaff=true;break;
  case 'batches':answer=c&&/\b(duration|how long|months?)\b/i.test(q)?'The official '+c.name+' page lists a '+c.duration+' course duration. Specific batch dates and timings still require institute confirmation.':'The JNTU campus advertises classroom and online learning, but I cannot verify which batches currently have places, or whether weekend sessions are offered for '+topic+'. Please check the official batch listings and confirm with its team.';sourceUrl=c&&/\b(duration|how long|months?)\b/i.test(q)?c.url:batchUrl;needsStaff=true;break;
  case 'syllabus':answer=c?'The official '+c.name+' course page describes '+c.topics+'. The published course duration is '+c.duration+'. Check the original page for more syllabus details.':'Choose a course to see its publicly listed topics and duration, with a source link.';needsStaff=true;break;
  case 'location':answer='Naresh i Technologies has a JNTU branch in the Kukatpally/JNTU area, Hyderabad, Telangana, India. The official JNTU contact page lists +91 99660 45222 and support@nareshit.com. Use that page for current directions.';sourceUrl=contact;needsStaff=true;break;
  case 'demo':answer='The institute publishes demo and batch information, but this independent EnquiryFlow demo cannot reserve or confirm a real class for '+topic+'. Check the official schedule or contact the institute.';sourceUrl=batchUrl;needsStaff=true;break;
  case 'placements':answer='No employment or placement guarantee can be inferred from course listings. Confirm current placement-assistance terms, eligibility and outcomes directly with the institute.';sourceUrl=contact;needsStaff=true;break;
  case 'enroll':answer='The EnquiryFlow form is only a browser-local simulation. It does not contact NareshIT, register a student, process payment or reserve a seat. For real admissions, use the official institute contact page.';sourceUrl=contact;needsStaff=true;break;
  default:answer='I cannot verify that from the published course pages. Please check the official institute website. This is an independent scripted FAQ demonstration, not an official admissions assistant.';sourceUrl=contact;needsStaff=true;
 }
 return {...b,course:key||null,answer,needsStaff,sourceUrl,source:'nareshit-jntu-public-pages-2026-11-22'};
};
root.EnquiryVerifiedInstitute={name:'Naresh i Technologies — JNTU Hyderabad',checked:'22 November 2026',courses,catalog,contact,batchUrl};
root.renderInstituteKnowledge=function(){
 const target=document.getElementById('instituteKnowledge');if(!target)return;
 target.replaceChildren();
 for(const course of Object.values(courses)){
  const card=document.createElement('div');card.className='program-card';
  const title=document.createElement('strong');title.textContent=course.name;
  const timing=document.createElement('p');timing.textContent='Published duration: '+course.duration;
  const fee=document.createElement('p');fee.textContent='Published fees: '+course.fees;
  const topics=document.createElement('p');topics.textContent='Topics: '+course.topics;
  const source=document.createElement('a');source.href=course.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Official course page ↗';
  card.append(title,timing,fee,topics,source);target.appendChild(card);
 }
};
})(window);
