import {publicData,submitEnquiry,askAssistant,isDemo,isProductionReady,studentIdentity,readProductionReadiness,signInStudentGoogle,signOutStudent,PRIVACY_VERSION} from './production-adapter.js?v=5.3-qa';
import {$,$$,esc,money,shortDate,str,safeUrl} from './utils.js?v=3.4';
import {filterCourses,filterUpcomingBatches,compareSelection,todayIndia} from './discovery.js';
import {courseTemplates,faqTemplates} from './ctech-catalogue.js?v=1.1';
let data,selectedCourse='',messages=[],query='',category='All',courseMode='All',sort='featured',batchCourse='All',batchMode='All',compared=[],chatContext={courseId:null},asking=false;
let productionReady=false,readinessRequest=0,guideQuery='',guideCategory='All';
const canonicalSite=/^\/enquiryflow-v3\/(?:index\.html)?$/.test(location.pathname);
const app=$('#app');
const link=url=>safeUrl(url)?`<a href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer">Original source ↗</a>`:'';
function shell(){
 app.innerHTML=`<div class="demo-ribbon">${isDemo?'V3 PREVIEW • Fictional course fees and student records. This is not an operating institute website.':(canonicalSite?'CTECH ACADEMY • Verified Google enquiries. No email alerts.':'REAL-DATA STAGING • Verified Google sign-in and institute approval required. No email alerts.')}</div>
 <header class="site-header"><div class="wrap nav-row"><a class="brand" href="#top"><span class="brand-icon" aria-hidden="true">EF</span><span>Enquiry<span class="accent">Flow</span><small>Student experience</small></span></a><button class="mobile-menu-toggle" id="mobileNavToggle" aria-controls="studentNav" aria-expanded="false" aria-label="Open navigation" type="button">☰</button><nav id="studentNav"><a href="#courses">Courses</a><a href="#batches">Batches</a><a href="#faq">FAQs</a><a href="#about">Institute</a><a href="#assistant">Ask assistant</a></nav><a class="nav-action" href="#enquire">Enquire now <span aria-hidden="true">↗</span></a></div></header>
 <main id="top"><section class="hero"><div class="wrap hero-grid"><div><span class="eyebrow">LEARN WITH CLARITY</span><h1>Find your next<br><em>learning opportunity.</em></h1><p id="heroIntro">Browse programs, compare fees and learning modes, find the right batch, and get clear answers from approved information.</p><div class="hero-actions"><a href="#courses" class="button primary">Explore courses <span>↗</span></a><a href="#assistant" class="button secondary">Ask the course assistant</a></div><div class="hero-trust"><span>✓ Compare up to 3 courses</span><span>✓ See upcoming batch dates</span><span>✓ Ask verified questions</span></div><div class="hero-metrics"><div><b id="courseMetric" aria-live="polite">Loading</b><span>Confirmed courses</span></div><div><b id="guideMetric" aria-live="polite">Loading</b><span>Curriculum guides</span></div><div><b id="batchMetric" aria-live="polite">Loading</b><span>Upcoming batches</span></div></div></div><div class="hero-panel"><div class="hero-panel-top"><span class="pill green">Course intelligence</span><span class="tiny">STUDENT VIEW</span></div><div class="orb">EF</div><h3>Learn what matters, before you enrol.</h3><p>Fees, syllabus, batches and verified answers — without endless back-and-forth.</p><div class="panel-check"><span>✓</span> Clear course comparisons</div><div class="panel-check"><span>✓</span> Current published batch details</div><div class="panel-check"><span>✓</span> Enquiry handoff to institute staff</div></div></div></section>
 <section class="section" id="courses"><div class="wrap"><div class="section-title"><div><span class="eyebrow">COURSE CATALOGUE</span><h2>Explore programs</h2><p>Fees and course descriptions come from the institution's published records.</p></div><span class="info-stamp" id="coursesCount"></span></div><div class="toolbar discovery-toolbar"><label class="search-control"><span>Search courses</span><input id="courseSearch" type="search" placeholder="Try AWS, Python, Java, analytics…" aria-label="Search courses"></label><label class="select-control"><span>Learning mode</span><select id="courseMode" aria-label="Filter by learning mode"><option value="All">All modes</option><option value="Online">Online</option><option value="Classroom">Classroom</option></select></label><label class="select-control"><span>Sort by</span><select id="courseSort" aria-label="Sort courses"><option value="featured">Featured</option><option value="fee-asc">Fee: low to high</option><option value="fee-desc">Fee: high to low</option><option value="duration">Shortest duration</option><option value="name">Course name A–Z</option></select></label></div><div class="category-row"><div id="categories" class="chip-group"></div><button type="button" class="text-button" id="resetCourseFilters">Reset filters</button></div><div class="cards" id="coursesGrid"></div><div id="compareTray" class="compare-tray" hidden aria-live="polite"></div>
 <section class="ctech-guide-section" id="learning-guides" aria-labelledby="guidesHeading"><div class="section-title"><div>
 <span class="eyebrow">EXPLORE TECHNOLOGY TOPICS</span><h2 id="guidesHeading">Curriculum guides</h2>
 <p>Explore 16 sample learning outlines, including skills, prerequisites and project ideas. <strong>These are not confirmed Ctech Academy course offerings.</strong> Contact the institute about available classes, fees, duration, delivery modes, teachers and batches.</p>
 </div><span class="info-stamp" id="guideCount"></span></div>
 <label class="ctech-guide-search">Search curriculum topics<input id="guideSearch" type="search" maxlength="120" placeholder="Search AWS, DevOps, Python, Java, AI…" aria-label="Search sample curriculum guides"></label>
 <div id="guideCategories" class="chip-group ctech-guide-categories" aria-label="Curriculum guide categories"></div>
 <div id="guideGrid" class="cards ctech-guide-grid"></div>
 <p class="ctech-guide-note">Educational reference outlines only. Enquiries about a topic do not constitute enrolment or confirm an available course, payment, certificate or seat.</p></section></div></section><dialog id="compareDialog" class="compare-dialog" aria-label="Compare selected courses"><div id="compareDialogContent"></div></dialog><dialog id="courseDetailsDialog" class="compare-dialog ctech-course-dialog" aria-label="Full course details"><div id="courseDetailsContent"></div></dialog>
 <section class="section soft" id="batches"><div class="wrap"><div class="section-title"><div><span class="eyebrow">SCHEDULES</span><h2>Upcoming batches</h2><p>These are published schedules, not confirmed seat reservations.</p></div></div><div class="batch-filters"><label>Course<select id="batchCourseFilter" aria-label="Filter batches by course"><option value="All">All courses</option></select></label><label>Mode<select id="batchModeFilter" aria-label="Filter batches by mode"><option value="All">All modes</option><option value="Online">Online</option><option value="Classroom">Classroom</option></select></label><span id="batchVisibleCount" class="batch-count"></span></div><div class="batch-list" id="batchList"></div></div></section>
 <section class="section" id="assistant"><div class="wrap two-col"><div class="assistant-intro"><span class="eyebrow">KNOWLEDGE ASSISTANT</span><h2>Ask a question.<br>Get a grounded answer.</h2><p>Ask about the institute, how many courses it offers, all published fees, the next batch or approved staff information. Answers use the published catalogue and FAQs. Unverified answers are escalated instead of invented.</p><div class="sample-questions"><button data-question="Tell me about the institute">About institute</button><button data-question="How many courses are available?">Course count</button><button data-question="Show all course fees">All fees</button><button data-question="When is the next batch?">Next batch</button><button data-question="Who are the trainers?">Staff information</button></div><div class="fineprint">${isDemo?'FAQ retrieval simulation (not a generative AI model).':'An AI response is only available when its secure server integration is configured.'}</div></div><div class="chat"><div class="chat-heading"><span class="bot-icon">AI</span><div><b>Course assistant</b><small>Answers grounded in approved knowledge</small></div><button id="clearChat" type="button" class="chat-clear" aria-label="Clear chat history" title="Clear chat">Clear</button><span class="online-dot"></span></div><div class="chat-messages" id="chatMessages" aria-live="polite"></div><div class="chat-suggestions" id="chatSuggestions" aria-label="Suggested follow-up questions"></div><form id="chatForm" class="chat-form"><input name="question" maxlength="500" placeholder="Ask about a course or batch…" aria-label="Ask the course assistant" required><button class="button primary" type="submit">Send</button></form><div class="chat-utilities"><button type="button" id="copyAnswer" class="text-button" aria-label="Copy latest assistant answer">Copy latest answer</button><span id="chatUtilityStatus" role="status"></span></div><div class="chat-disclaimer">${isDemo?'Fictional course data • No messages leave your device.':'Do not share sensitive personal information in the chat.'}</div></div></div></section>
 <section class="section faq-section soft" id="faq"><div class="wrap"><div class="section-title"><div><span class="eyebrow">GOOD TO KNOW</span><h2>Frequently asked questions</h2><p>Answers reviewed by the institute. Unpublished details are never shown.</p></div><a class="text-button" href="#assistant">Ask a different question ↗</a></div><div id="faqList" class="faq-list"></div><div class="ctech-general-help"><h3>Help using the enquiry website</h3><p>These answers describe how this website works. They are not confirmation of course availability, costs, certification or job-placement services.</p><div id="generalHelpList" class="faq-list"></div></div></div></section>
 <section class="section soft" id="about"><div class="wrap about-grid"><div><span class="eyebrow">ABOUT THE INSTITUTE</span><h2 id="instituteTitle">A modern learning experience.</h2><p id="instituteDescription"></p><div class="about-details" id="instituteDetails"></div></div><div class="about-panel"><span class="eyebrow">BEFORE ENROLLING</span><h3>Know the details, then decide.</h3><p>Check fees, course duration, delivery format and syllabus. When something is not published, contact the institute before making a payment.</p><div class="about-icons"><span>• Transparent course details</span><span>• Staff-managed knowledge</span><span>• No invented admission guarantees</span></div></div></div></section>
 <section class="section" id="enquire"><div class="wrap enquiry-grid"><div><span class="eyebrow">GET IN TOUCH</span><h2>Need more information?</h2><p>${isDemo?'Test the enquiry workflow with fictional details. This does NOT contact staff or send email; submissions remain in this browser.':'Ask the institute a genuine question using your verified Google email after the institute approves real admissions. Avoid sensitive personal and payment information.'}</p><div class="info-box">${isDemo?'<b>Demo-only intake.</b> Use a name beginning Demo/Test and an @example.com email. Nothing is sent to any institution.':'<b>Verified enquiry.</b> Sign in with Google, review the privacy notice and consent before sending. Only authorized staff can read your enquiry; no email is sent automatically.'}</div></div><div class="form-card"><h3>${isDemo?'Test an enquiry':'Send a verified enquiry'}</h3><form id="enquiryForm" class="stack"><div class="auth-box" id="authBox"><button class="button secondary" type="button" id="googleStudentLogin">Sign in with Google to verify email</button><button class="button ghost" type="button" id="googleStudentLogout" hidden>Sign out</button><span id="verifiedGoogle" role="status">Not verified</span></div><p class="tip" id="productionReadiness">Checking institute approval…</p><label>Full name<input name="full_name" placeholder="${isDemo?'Demo Learner':'Your full name'}" required maxlength="90"></label><label>Email<input name="email" type="email" placeholder="${isDemo?'demo@example.com':'you@gmail.com'}" required maxlength="180"></label><label>Course<select name="course_id" id="enquiryCourse"><option value="">General enquiry</option></select></label><label>Preferred batch<select name="batch_id" id="enquiryBatch"><option value="">Not decided</option></select></label><label>Question or preferred callback time<textarea name="question" rows="3" maxlength="1500" placeholder="Tell us what you'd like to know"></textarea></label><p class="tip">Before sending, read <a href="/enquiryflow-v3/assets/production-privacy.html" target="_blank" rel="noopener noreferrer">how the institute handles your information ↗</a>. Use a verified Google account; each account can submit once every 15 minutes. No automatic email notification is sent.</p><label class="checkboxline"><input type="checkbox" name="consent" required><span>I agree to the use of my details to respond to this enquiry.</span></label><div style="display:none" aria-hidden="true"><label>Do not fill<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div><button type="submit" class="button primary fill" aria-describedby="productionReadiness verifiedGoogle">${isDemo?'Save fictional enquiry locally':'Submit verified enquiry'} ↗</button><div id="formResponse" class="response" role="status" aria-live="polite"></div></form></div></div></section></main>
 <footer class="site-footer"><div class="wrap footer-grid"><span><b>EnquiryFlow</b><small>Independent institute platform.</small></span><a href="/enquiryflow-v3/staff/">Institution staff ↗</a><small><a href="/enquiryflow-v3/assets/production-privacy.html">Privacy and deletion requests</a></small></div></footer>`;
}

function openCourseDetails(id){
 const c=data?.courses.find(x=>x.id===id);
 if(!c)return;
 const arr=x=>Array.isArray(x)?x:[];
 const listing=(items,ordered)=>items.length?'<'+(ordered?'ol':'ul')+' class="ctech-detail-list">'+items.map(item=>'<li>'+esc(item)+'</li>').join('')+'</'+(ordered?'ol':'ul')+'>':'<p class="muted">Details not yet published; please enquire with the institute.</p>';
 const dialog=$('#courseDetailsDialog');
 const upcoming=filterUpcomingBatches(data.batches,[c],{today:todayIndia()});
 $('#courseDetailsContent').innerHTML=
  '<div class="compare-dialog-head"><div><span class="eyebrow">COURSE DETAILS</span><h2>'+esc(c.title)+'</h2><p>'+esc(c.description||'')+'</p></div><button class="icon-close" type="button" data-close-course-details aria-label="Close course details">Close</button></div>'+
  '<div class="ctech-detail-stats"><span><b>Fee</b>'+esc(money(c.fee_inr))+'</span><span><b>Duration</b>'+esc(c.duration_weeks?c.duration_weeks+' weeks':'Confirm with institute')+'</span><span><b>Format</b>'+esc(arr(c.delivery_modes).join(' / ')||'Confirm with institute')+'</span><span><b>Level</b>'+esc(c.level||'Ask institute')+'</span></div>'+
  '<div class="ctech-detail-columns"><div><h3>Full syllabus</h3>'+listing(arr(c.curriculum),true)+'</div><div><h3>Learning outcomes</h3>'+listing(arr(c.outcomes),false)+'<h3>Practical project ideas</h3>'+listing(arr(c.projects),false)+'</div></div>'+
  '<div class="ctech-detail-columns"><div><h3>Who this course is for</h3><p>'+esc(c.audience||'Ask the institute for guidance.')+'</p></div><div><h3>Prerequisites</h3><p>'+esc(c.prerequisites||'Check with institute staff.')+'</p></div></div>'+
  '<p class="muted">Published fees and any dates should be verified with Ctech Academy before payment. '+esc(upcoming.length?'Next listed batch: '+shortDate(upcoming[0].start_date)+'.':'No future batch is currently published.')+'</p>'+
  '<div class="compare-dialog-foot"><button type="button" class="button secondary" data-close-course-details>Close</button><button type="button" class="button primary" data-choose="'+esc(c.id)+'">Enquire about this course →</button></div>';
 dialog.showModal();
}


function activeCurriculumGuides(){
 const official=new Set((data?.courses||[]).map(c=>String(c.title||'').trim().toLowerCase()));
 return courseTemplates.filter(t=>!official.has(t.title.trim().toLowerCase()));
}
function renderCurriculumGuides(){
 const guides=activeCurriculumGuides();
 const q=guideQuery.trim().toLowerCase();
 const visible=guides.filter(t=>(guideCategory==='All'||guideCategory===t.category)&&(!q||
 [t.title,t.category,t.level,t.description,t.prerequisites,...t.curriculum,...t.outcomes].join(' ').toLowerCase().includes(q)));
 $('#guideCount').textContent='Showing '+visible.length+' of '+guides.length+' outlines';
 $('#guidesHeading').textContent=guides.length+' sample curriculum guides';$('#guideMetric').textContent=guides.length;
 $('#guideCategories').innerHTML=['All',...new Set(guides.map(t=>t.category))].map(c=>
  '<button type="button" class="filter '+(c===guideCategory?'active':'')+'" data-guide-category="'+esc(c)+'" aria-pressed="'+(c===guideCategory)+'">'+esc(c)+'</button>').join('');
 const items=(xs,ordered=false)=>'<'+(ordered?'ol':'ul')+'>'+xs.map(x=>'<li>'+esc(x)+'</li>').join('')+'</'+(ordered?'ol':'ul')+'>';
 $('#guideGrid').innerHTML=visible.map(t=>
  '<article class="course-card ctech-guide-card"><div class="card-top"><span class="pill">'+esc(t.category)+'</span><span class="ctech-proposal-label">Sample outline</span></div>'+
  '<h3>'+esc(t.title)+'</h3><p>'+esc(t.description)+'</p>'+
  '<div class="course-tags">'+t.curriculum.slice(0,3).map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>'+
  '<div class="ctech-guide-facts"><span><b>Fees</b>Not confirmed</span><span><b>Duration & batches</b>Not announced</span><span><b>Level</b>'+esc(t.level)+'</span></div>'+
  '<details class="ctech-guide-details"><summary>View complete syllabus and projects</summary>'+
  '<h4>Suggested syllabus</h4>'+items(t.curriculum,true)+
  '<h4>Potential learning outcomes</h4>'+items(t.outcomes)+
  '<h4>Hands-on project ideas</h4>'+items(t.projects)+
  '<h4>Who might benefit</h4><p>'+esc(t.audience)+'</p>'+
  '<h4>Suggested prerequisites</h4><p>'+esc(t.prerequisites)+'</p>'+
  '<p class="ctech-guide-note">This is an example curriculum, not a confirmed Ctech Academy course.</p></details>'+
  '<button type="button" class="ctech-guide-enquire" data-guide-enquire="'+esc(t.slug)+'">Ask if this course is available →</button></article>'
 ).join('')||'<div class="empty">No sample outlines match. Try a different keyword or category.</div>';
}

function renderCourses(){
 const found=filterCourses(data.courses,{query,category,mode:courseMode,sort});
 $('#coursesCount').textContent=`${data.courses.length} confirmed courses · ${activeCurriculumGuides().length} example guides`;
 $('#coursesGrid').innerHTML=found.map(c=>`<article class="course-card ${compared.includes(c.id)?'is-compared':''}"><div class="card-top"><span class="pill">${esc(c.category||'Course')}</span><button class="compare-pick" type="button" data-compare="${esc(c.id)}" aria-pressed="${compared.includes(c.id)}" aria-label="${compared.includes(c.id)?'Remove':'Add'} ${esc(c.title)} ${compared.includes(c.id)?'from':'to'} comparison">${compared.includes(c.id)?'✓ Selected':'+ Compare'}</button></div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><div class="course-tags">${(c.curriculum||[]).slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="course-meta"><div><small>Published fee</small><b>${money(c.fee_inr)}</b></div><div><small>Duration</small><b>${esc(c.duration_weeks)} weeks</b></div></div><div class="card-bottom"><span>${esc((c.delivery_modes||[]).join(' · '))}</span><button data-choose="${esc(c.id)}">Enquire <span>→</span></button></div><button type="button" class="ctech-detail-btn" data-course-detail="${esc(c.id)}">View full syllabus &amp; project ideas →</button>${link(c.source_url)}</article>`).join('')||'<div class="empty discovery-empty">No verified courses are published that match these filters. Browse the sample curriculum guides below or <button type="button" class="text-button" id="emptyResetFilters">reset filters</button>.</div>';
 const categories=['All',...new Set(data.courses.map(c=>c.category).filter(Boolean))];
 $('#categories').innerHTML=categories.map(c=>`<button class="filter ${category===c?'active':''}" data-category="${esc(c)}" aria-pressed="${category===c}">${esc(c)}</button>`).join('');
 renderCompareTray();
}
function renderCompareTray(){
 compared=compared.filter(id=>data.courses.some(c=>c.id===id)).slice(0,3);
 const tray=$('#compareTray');if(!compared.length){tray.hidden=true;tray.innerHTML='';return}
 const chosen=compareSelection(compared,data.courses);
 tray.hidden=false;
 tray.innerHTML=`<div><span class="eyebrow">COURSE COMPARISON</span><b>${chosen.length} of 3 selected</b><small>${chosen.map(c=>esc(c.title)).join(' · ')}</small></div><div class="compare-tray-actions"><button type="button" class="text-button" id="clearComparison">Clear</button><button type="button" class="button primary" id="openComparison" ${chosen.length<2?'disabled':''}>Compare courses ↗</button></div>`;
}
function openComparison(){
 const chosen=compareSelection(compared,data.courses);if(chosen.length<2)return;
 const attrs=[['Published fee',c=>money(c.fee_inr)],['Duration',c=>c.duration_weeks?`${c.duration_weeks} weeks`:'Not specified'],['Learning modes',c=>(c.delivery_modes||[]).join(', ')||'Not specified'],['Syllabus highlights',c=>(c.curriculum||[]).slice(0,5).join(', ')||'Not specified'],['Next published batch',c=>{const b=filterUpcomingBatches(data.batches,[c],{today:todayIndia()})[0];return b?`${shortDate(b.start_date)} · ${b.label}`:'No upcoming batch published'}]];
 $('#compareDialogContent').innerHTML=`<div class="compare-dialog-head"><div><span class="eyebrow">SIDE BY SIDE</span><h2>Find your best fit</h2><p>Compare approved information before enquiring. ${isDemo?'All fees and dates are fictional.':''}</p></div><button type="button" class="icon-close" id="closeCompareDialog" aria-label="Close comparison">Close</button></div><div class="compare-table-scroll"><table class="compare-table"><thead><tr><th>Details</th>${chosen.map(c=>`<th>${esc(c.title)}</th>`).join('')}</tr></thead><tbody>${attrs.map(([name,format])=>`<tr><th scope="row">${name}</th>${chosen.map(c=>`<td>${esc(format(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="compare-dialog-foot"><p>Prices and availability should be confirmed with the institute.</p><button class="button primary" type="button" id="closeCompareDialogFooter">Done</button></div>`;
 $('#compareDialog').showModal();
}

function renderBatches(){
 const listed=filterUpcomingBatches(data.batches,data.courses,{courseId:batchCourse,mode:batchMode,today:todayIndia()});
 $('#batchVisibleCount').textContent=`${listed.length} upcoming ${listed.length===1?'batch':'batches'}`;
 $('#batchList').innerHTML=listed.map(b=>{const c=data.courses.find(c=>c.id===b.course_id);return `<div class="batch-row"><div class="batch-date"><b>${esc(new Date(b.start_date+'T12:00:00').toLocaleDateString('en-IN',{day:'2-digit'}))}</b><small>${esc(new Date(b.start_date+'T12:00:00').toLocaleDateString('en-IN',{month:'short'}))}</small></div><div class="batch-info"><b>${esc(c?.title||'Course')}</b><span>${esc(b.label)} · ${esc(b.days)}, ${esc(b.time_window)}</span></div><span class="pill">${esc(b.mode)}</span><button class="batch-action" data-choose="${esc(c?.id||'')}" data-batch="${esc(b.id)}">Ask about batch →</button></div>`}).join('')||'<div class="empty">No upcoming batches match those filters. Check another course or ask staff for future schedules.</div>';
}
function renderBatchFilterOptions(){const select=$('#batchCourseFilter');select.innerHTML='<option value="All">All courses</option>'+data.courses.map(c=>`<option value="${esc(c.id)}">${esc(c.title)}</option>`).join('');if(!data.courses.some(c=>c.id===batchCourse))batchCourse='All';select.value=batchCourse;$('#batchModeFilter').value=batchMode;}
function renderFaqs(){
 const publishedQuestions=new Set((data.faqs||[]).map(f=>String(f.question||'').trim().toLowerCase()));
 $('#generalHelpList').innerHTML=faqTemplates.filter(f=>!publishedQuestions.has(String(f.question||'').trim().toLowerCase())).map((f,i)=>'<details class="faq-card"><summary><span>'+esc(f.question)+'</span><span aria-hidden="true" class="faq-chevron">+</span></summary><div class="faq-answer"><p>'+esc(f.answer)+'</p></div></details>').join('');
 const faqs=(data.faqs||[]).slice(0,8);
 $('#faqList').innerHTML=faqs.map((f,i)=>`<details class="faq-card" ${i===0?'open':''}><summary><span>${esc(f.question)}</span><span aria-hidden="true" class="faq-chevron">+</span></summary><div class="faq-answer"><p>${esc(f.answer)}</p>${link(f.source_url)}</div></details>`).join('')||'<div class="empty">The institute has not published FAQs yet. Ask the course assistant or request a clarification.</div>';
}

function renderAbout(){const i=data.institute;$('#instituteTitle').textContent=i.name;$('#instituteDescription').textContent=(i.about&& !/^genuine institute description\.?$/i.test(i.about.trim()))?i.about:'The institute has not yet published a verified profile description. Contact the institute for current course information.';$('#heroIntro').textContent=i.tagline||'Discover courses, fees and batches in one place.';$('#instituteDetails').innerHTML=`<span>Location: ${esc(i.city||'Location to be confirmed')}</span><span>Email: ${esc(i.email||'Contact institute')}</span>${safeUrl(i.website_url)?`<a href="${esc(safeUrl(i.website_url))}" rel="noopener noreferrer" target="_blank">Official website ↗</a>`:''}`;$('#courseMetric').textContent=data.courses.length;$('#batchMetric').textContent=filterUpcomingBatches(data.batches,data.courses,{today:todayIndia()}).length;}
function renderSelects(){const course=$('#enquiryCourse'),batch=$('#enquiryBatch');course.innerHTML='<option value="">General enquiry</option>'+data.courses.map(c=>`<option value="${esc(c.id)}">${esc(c.title)}</option>`).join('');course.value=selectedCourse||'';const opts=data.batches.filter(b=>!course.value||b.course_id===course.value);batch.innerHTML='<option value="">Not decided</option>'+opts.map(b=>`<option value="${esc(b.id)}">${esc(b.label)}</option>`).join('');}
function renderChat(){
 const area=$('#chatMessages');
 area.innerHTML=messages.map(m=>`<div class="bubble ${m.role}"><span class="speaker">${m.role==='bot'?'EnquiryFlow assistant':'You'}</span><div class="bubble-text">${esc(m.text)}</div>${(m.sources||[]).map(link).join('')}${m.handoff?'<button class="chat-handoff" type="button" data-chat-handoff="'+esc(m.courseId||'')+'">Request staff clarification ↗</button>':''}</div>`).join('');
 if(asking)area.insertAdjacentHTML('beforeend','<div class="bubble bot chat-loading" role="status">Checking approved institute information…</div>');
 const latest=[...messages].reverse().find(m=>m.role==='bot');
 const prompts=asking?[]:(latest?.suggestions?.length?latest.suggestions:['About the institute','How many courses are available?','Show all course fees','When is the next batch?']);
 $('#chatSuggestions').innerHTML=prompts.map(q=>`<button type="button" data-question="${esc(q)}">${esc(q)}</button>`).join('');
 const button=$('#chatForm button[type=submit]');button.disabled=asking;button.textContent=asking?'Checking…':'Send';
 area.scrollTop=area.scrollHeight;
}
async function sendChatQuestion(question){
 const q=str(question);if(!q||asking)return;
 asking=true;messages.push({role:'user',text:q});renderChat();
 try{
  const result=await askAssistant(q,data,chatContext);
  if(result.courseId && data.courses.some(c=>c.id===result.courseId))chatContext.courseId=result.courseId;
  if(result.intent==='compare'||result.intent==='clarify')chatContext.courseId=null;
  messages.push({role:'bot',text:result.answer||'I could not find an approved answer.',sources:result.sources||[],handoff:!!result.handoff,courseId:result.courseId||chatContext.courseId,suggestions:result.suggestions||[]});
 }catch(error){messages.push({role:'bot',text:'The assistant cannot answer just now. Please use the enquiry form for staff help.',handoff:true,suggestions:['Show courses']});}
 asking=false;
 if(messages.length>32)messages=messages.slice(-32);
 renderChat();
}

function bind(){
 $('#courseSearch').addEventListener('input',e=>{query=e.target.value;renderCourses()});
 $('#guideSearch').addEventListener('input',e=>{guideQuery=e.target.value;renderCurriculumGuides()});
 $('#guideCategories').addEventListener('click',e=>{const b=e.target.closest('[data-guide-category]');if(b){guideCategory=b.dataset.guideCategory;renderCurriculumGuides()}});
 $('#courseMode').addEventListener('change',e=>{courseMode=e.target.value;renderCourses()});
 $('#courseSort').addEventListener('change',e=>{sort=e.target.value;renderCourses()});
 $('#batchCourseFilter').addEventListener('change',e=>{batchCourse=e.target.value;renderBatches()});
 $('#batchModeFilter').addEventListener('change',e=>{batchMode=e.target.value;renderBatches()});
 const resetFilters=()=>{category='All';query='';courseMode='All';sort='featured';$('#courseSearch').value='';$('#courseMode').value='All';$('#courseSort').value='featured';renderCourses()};
 $('#resetCourseFilters').addEventListener('click',resetFilters);
 $('#mobileNavToggle').addEventListener('click',()=>{const nav=$('#studentNav');const open=nav.classList.toggle('is-open');$('#mobileNavToggle').setAttribute('aria-expanded',String(open))});
 $('#studentNav').addEventListener('click',e=>{if(e.target.closest('a')){$('#studentNav').classList.remove('is-open');$('#mobileNavToggle').setAttribute('aria-expanded','false')}});
 $('#compareDialog').addEventListener('click',e=>{if(e.target===$('#compareDialog'))$('#compareDialog').close()});
 $('#courseDetailsDialog').addEventListener('click',e=>{if(e.target===$('#courseDetailsDialog')||e.target.closest('[data-close-course-details]'))$('#courseDetailsDialog').close()});
 $('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;renderCourses()}});
 document.addEventListener('click',e=>{
 const proposal=e.target.closest('[data-guide-enquire]');
 if(proposal){
  const guide=courseTemplates.find(t=>t.slug===proposal.dataset.guideEnquire);
  if(!guide)return;
  selectedCourse='';renderSelects();
  const question=$('#enquiryForm [name="question"]');
  question.value='I am interested in '+guide.title+'. Does Ctech Academy offer this course? Please confirm the fee, duration, learning format and next batch.';
  location.hash='enquire';question.focus();return;
 }
 const detail=e.target.closest('[data-course-detail]');if(detail){openCourseDetails(detail.dataset.courseDetail);return}
 const compare=e.target.closest('[data-compare]');if(compare){const id=compare.dataset.compare;if(compared.includes(id))compared=compared.filter(x=>x!==id);else if(compared.length<3)compared.push(id);else{compare.title='Maximum 3 courses can be compared';return}renderCourses();return}
 if(e.target.closest('#openComparison')){openComparison();return}
 if(e.target.closest('#clearComparison')){compared=[];renderCourses();return}
 if(e.target.closest('#closeCompareDialog')||e.target.closest('#closeCompareDialogFooter')){$('#compareDialog').close();return}
 if(e.target.closest('#emptyResetFilters')){resetFilters();return}
 const b=e.target.closest('[data-choose]');if(b){if($('#courseDetailsDialog').open)$('#courseDetailsDialog').close();selectedCourse=b.dataset.choose;renderSelects();if(b.dataset.batch)$('#enquiryBatch').value=b.dataset.batch;location.hash='enquire'}const q=e.target.closest('[data-question]');if(q){location.hash='assistant';sendChatQuestion(q.dataset.question);}const handoff=e.target.closest('[data-chat-handoff]');if(handoff){selectedCourse=handoff.dataset.chatHandoff||chatContext.courseId||'';renderSelects();location.hash='enquire';$('#enquiryForm [name=question]').value='Please confirm the details discussed in the course assistant.';}});
 $('#enquiryCourse').addEventListener('change',()=>{selectedCourse=$('#enquiryCourse').value;renderSelects()});
 $('#chatForm').addEventListener('submit',async e=>{e.preventDefault();const input=$('#chatForm [name=question]');const q=str(input.value);if(!q||asking)return;input.value='';await sendChatQuestion(q);});$('#clearChat').addEventListener('click',()=>{if(asking)return;chatContext={courseId:null};messages=[{role:'bot',text:'Conversation cleared. Ask about the institute, total courses, fees, next batches or staff information.',suggestions:['About the institute','How many courses are available?','Show all course fees','When is the next batch?']}];renderChat()});
 $('#copyAnswer').addEventListener('click',async()=>{const last=[...messages].reverse().find(m=>m.role==='bot');if(!last)return;const status=$('#chatUtilityStatus');try{await navigator.clipboard.writeText(last.text);status.textContent='Copied';}catch{status.textContent='Copy not available in this browser';}});
 $('#googleStudentLogin').addEventListener('click',async()=>{
  const button=$('#googleStudentLogin');button.disabled=true;$('#verifiedGoogle').textContent='Opening Google sign-in…';
  try{await signInStudentGoogle();await updateVerifiedIdentity()}catch(error){$('#verifiedGoogle').textContent='Sign-in failed: '+error.message}
  finally{button.disabled=false}
 });
 $('#googleStudentLogout').addEventListener('click',async()=>{await signOutStudent();await updateVerifiedIdentity()});
 $('#enquiryForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget, r=$('#formResponse');
  const button=form.querySelector('button[type=submit]');
  if(button.disabled)return;
  const fields=Object.fromEntries(new FormData(form));
  const payload={...fields,consent:form.elements.consent.checked};
  r.replaceChildren();r.className='response';
  if(fields.website){r.textContent='Submission rejected.';r.classList.add('enquiry-error');return;}
  button.disabled=true;
  button.textContent='Submitting verified enquiry…';
  r.textContent='Saving securely for authorized institute staff…';
  try{
    const result=await submitEnquiry(payload);
    r.replaceChildren();
    const heading=document.createElement('strong');
    const description=document.createElement('span');
    if(result.demo){
      r.classList.add('enquiry-local');
      r.dataset.delivery='local-only';
      heading.textContent='Saved locally — NOT sent to the institute.';
      description.textContent=` Enquiry reference: ${result.id||'DEMO'}. Nothing was emailed or delivered. Test records are only visible on this browser and device.`;
      const staffLink=document.createElement('a');
      staffLink.href='/enquiryflow-v3/staff/?view=enquiries';
      staffLink.textContent='View the test enquiry in Staff → Enquiries ↗';
      r.append(heading,description,staffLink);
    }else{
      r.classList.add('enquiry-success');
      r.dataset.delivery='staff-backend';
      heading.textContent='Enquiry saved to the institute inbox.';
      description.textContent=` Reference: ${result.id||'received'}. Authorized staff can review it privately. No automatic email was sent.`;
      r.append(heading,description);
    }
    form.reset();selectedCourse='';renderSelects();
  }catch(error){
    r.replaceChildren();r.classList.add('enquiry-error');
    delete r.dataset.delivery;
    r.textContent=`Enquiry was not saved or sent: ${error.message}`;
  }finally{
    button.textContent='Submit verified enquiry ↗';
    await updateVerifiedIdentity();
  }
});
 window.addEventListener('storage',async e=>{if(isDemo&&e.key==='enquiryflow_v3_demo_state'){data=await publicData();refresh()}});
 // Refresh readiness when a user returns from the owner setup in another tab.
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void updateVerifiedIdentity()});
 window.addEventListener('focus',()=>{void updateVerifiedIdentity()});
}
async function updateVerifiedIdentity(){
 // Do not rely on readiness loaded at initial page-open: owner may have activated
 // or closed intake in another tab while this page remains open.
 const requestId=++readinessRequest;
 const button=$('#enquiryForm button[type="submit"]');
 const email=$('#enquiryForm input[name="email"]');
 const note=$('#productionReadiness');
 button.disabled=true;
 note.textContent='Checking current enquiry intake status with Firebase…';
 let identity=null,ready=false,error=null;
 try{
  [identity,ready]=await Promise.all([studentIdentity(),readProductionReadiness()]);
 }catch(e){error=e}
 if(requestId!==readinessRequest)return;
 productionReady=ready&&!error;
 if(error){
  note.textContent='Enquiry status UNAVAILABLE: could not verify live Firebase approval ('+
   String(error?.code||error?.message||'unknown error').slice(0,130)+'). Submission remains disabled.';
 }else if(productionReady){
  note.textContent='Enquiry intake ACTIVE in Firebase. Verified Google sign-in and consent are required.';
 }else{
  note.textContent='Enquiry submission is unavailable: the institute has not opened verified intake. You can browse courses, but no enquiry can be sent yet.';
 }
 // Google identity can be verified even while real intake is closed.
 $('#googleStudentLogin').disabled=false;
 if(identity?.verified&&identity?.google){
  $('#verifiedGoogle').textContent='Verified: '+identity.email;
  email.value=identity.email;email.readOnly=true;
  $('#googleStudentLogout').hidden=false;$('#googleStudentLogin').hidden=true;
 }else{
  $('#verifiedGoogle').textContent=error?'Identity/status check unavailable.':'Google verification required.';
  email.readOnly=false;email.value='';
  $('#googleStudentLogout').hidden=true;$('#googleStudentLogin').hidden=false;
 }
 button.disabled=!(productionReady&&identity?.verified&&identity?.google);
}

function refresh(){renderBatchFilterOptions();renderCourses();renderCurriculumGuides();renderBatches();renderAbout();renderSelects();renderFaqs()}
async function init(){shell();messages=[{role:'bot',text:'Welcome! Ask about published courses, fees, batches, or institute information. Verify information directly before making a payment.',suggestions:['DevOps course fees','Next Python batch','Compare Java and Python','Is placement guaranteed?']}];renderChat();try{data=await publicData();productionReady=isProductionReady(data.institute);refresh();bind();await updateVerifiedIdentity()}catch(err){$('#coursesGrid').innerHTML=`<p class="error">Unable to load published institute data: ${esc(err.message)}</p>`;}}
init();