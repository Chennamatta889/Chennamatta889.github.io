/** Validate and normalize staff form inputs before writing a draft or approved record.
 *  Browser-only demo and eventual authenticated backend share the same validation.
 *  A "Save & publish" click is an explicit approval by an authorized publisher. */
import {str, slug} from './utils.js';
const required=(value,label,max=150)=>{
 const x=str(value);
 if(!x || x.length>max)throw Error(`${label} is required (maximum ${max} characters).`);
 return x;
};
const integer=(value,label,min,max)=>{
 const raw=str(value),num=Number(raw);
 if(raw===''||!Number.isSafeInteger(num)||num<min||num>max)throw Error(`${label} must be a whole number from ${min} to ${max}.`);
 return num;
};

export function staffFormPayload(fd,entity,{canPublish=false,forcePublish=false}={}){
 if(!['courses','batches','faqs','institute','enquiries'].includes(entity))throw Error('Unknown form type.');
 const record={};
 for(const [key,value] of fd){if(key!=='published'&&key!=='save_action'&&key!=='save_intent'&&typeof value==='string')record[key]=str(value)}
 if(!record.id)delete record.id;
 const shouldPublish=Boolean(canPublish&&(forcePublish||fd.get('published')==='on'));
 if(entity==='courses'){
  record.title=required(record.title,'Course title',150);
  record.duration_weeks=integer(record.duration_weeks,'Course duration',1,400);
  record.fee_inr=integer(record.fee_inr,'Course fee',0,10000000);
  record.slug=slug(record.title);
  if(!record.slug)throw Error('Course title must include letters or numbers.');
  record.curriculum=(record.curriculum||'').split(/\r?\n/).map(str).filter(Boolean);
  record.delivery_modes=(record.delivery_modes||'').split(',').map(str).filter(Boolean);
  record.source_url=record.source_url||null;
  record.published=shouldPublish;
  record.verified_at=shouldPublish?new Date().toISOString():null;
 }else if(entity==='batches'){
  record.course_id=required(record.course_id,'Course',100);
  record.label=required(record.label,'Batch name',150);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(record.start_date||''))throw Error('Choose a valid batch start date.');
  record.seats_available=integer(record.seats_available,'Available seats',0,10000);
  record.published=shouldPublish;
 }else if(entity==='faqs'){
  record.question=required(record.question,'FAQ question',500);
  record.answer=required(record.answer,'FAQ answer',3000);
  record.course_id=record.course_id||null;
  record.source_url=record.source_url||null;
  record.published=shouldPublish;
  record.reviewed_at=shouldPublish?new Date().toISOString():null;
 }else if(entity==='institute'){
  record.name=required(record.name,'Institute name',150);
  record.published=fd.get('published')==='on';
 }else if(entity==='enquiries'){
  if(!record.id)throw Error('An existing enquiry is required.');
  if(!['new','contacted','demo_requested','enrolled','closed'].includes(record.status))throw Error('Choose a valid enquiry status.');
  record.next_followup_at=record.next_followup_at||null;
 }
 return record;
}