const d='2026-11-22T07:00:00.000Z';
export const sample={
 institute:{id:'demo-institute',slug:'demo-tech-academy',name:'Demo Tech Academy',tagline:'Practical technology training for the next opportunity',about:'A fictional training institute created to demonstrate how real course, fee, timetable, and admissions content can be managed in one place. No real admissions are processed.',city:'Hyderabad',address:'Fictional campus · Hyderabad, Telangana',email:'admissions@example.com',phone:'',website_url:'',published:true,updated_at:d},
 courses:[
  {id:'c-devops',slug:'cloud-devops',title:'Cloud & DevOps Engineering',category:'Cloud',description:'Build, automate and operate cloud-native applications using Linux, Docker, CI/CD and Kubernetes.',duration_weeks:16,delivery_modes:['Classroom','Online'],curriculum:['Linux administration','Git and CI/CD','Docker and Kubernetes','AWS fundamentals','Infrastructure as code'],fee_inr:18000,fee_note:'Illustrative demo fee only',published:true,verified_at:d,source_url:'',updated_at:d},
  {id:'c-python',slug:'python-full-stack',title:'Python Full Stack',category:'Development',description:'Learn Python application development and front-end integrations through guided projects.',duration_weeks:20,delivery_modes:['Classroom','Online'],curriculum:['Python programming','SQL and APIs','Django essentials','HTML, CSS and JavaScript','Capstone project'],fee_inr:15000,fee_note:'Illustrative demo fee only',published:true,verified_at:d,source_url:'',updated_at:d},
  {id:'c-java',slug:'java-full-stack',title:'Java Full Stack',category:'Development',description:'Design and build enterprise applications using Java, Spring Boot and modern UI tools.',duration_weeks:24,delivery_modes:['Online'],curriculum:['Core Java','SQL','Spring Boot','REST APIs','Frontend integration'],fee_inr:17000,fee_note:'Illustrative demo fee only',published:true,verified_at:d,source_url:'',updated_at:d},
  {id:'c-data',slug:'data-analytics',title:'Data Analytics',category:'Data',description:'Learn how to analyze business data using spreadsheets, SQL and visualization tools.',duration_weeks:12,delivery_modes:['Classroom','Online'],curriculum:['Excel','SQL','Python analysis','Power BI','Analytics projects'],fee_inr:14000,fee_note:'Illustrative demo fee only',published:true,verified_at:d,source_url:'',updated_at:d}
 ],
 batches:[
  {id:'b1',course_id:'c-devops',label:'DevOps weekday evening',start_date:'2026-12-07',days:'Mon–Fri',time_window:'6:30–8:00 PM',mode:'Online',seats_available:18,published:true},
  {id:'b2',course_id:'c-devops',label:'DevOps weekend',start_date:'2026-12-12',days:'Sat–Sun',time_window:'10:00 AM–1:00 PM',mode:'Classroom',seats_available:12,published:true},
  {id:'b3',course_id:'c-python',label:'Python morning',start_date:'2026-12-14',days:'Mon–Fri',time_window:'8:00–9:30 AM',mode:'Online',seats_available:25,published:true},
  {id:'b4',course_id:'c-data',label:'Analytics weekend',start_date:'2026-12-19',days:'Sat–Sun',time_window:'11:00 AM–1:00 PM',mode:'Classroom',seats_available:16,published:true}
 ],
 faqs:[
  {id:'f1',course_id:null,question:'Is there a placement guarantee?',answer:'This demonstration does not offer or imply any job or placement guarantee. Ask the actual institute for its written placement policy.',published:true,source_url:''},
  {id:'f2',course_id:null,question:'Can I attend a demo class?',answer:'You can send a demo request through the enquiry form. In this prototype, requests are simulated only.',published:true,source_url:''},
  {id:'f3',course_id:'c-devops',question:'What do I learn in Cloud and DevOps?',answer:'The sample syllabus covers Linux, CI/CD, Docker, Kubernetes, AWS basics, and infrastructure as code.',published:true,source_url:''}
 ],
 enquiries:[
  {id:'DEMO-1001',full_name:'Demo Student One',email:'demo.one@example.com',course_id:'c-devops',batch_id:'b1',question:'Can I get a weekend demo?',status:'new',created_at:d,next_followup_at:null,staff_notes:''},
  {id:'DEMO-1002',full_name:'Test Student Two',email:'test.two@example.org',course_id:'c-python',batch_id:null,question:'Is the training online?',status:'contacted',created_at:d,next_followup_at:null,staff_notes:''}
 ],
 imports:[]
};