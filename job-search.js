/* Career-Ops job discovery relevance.
 * The default search intentionally does not match incidental description text.
 * Full-description search is a separate, explicit visitor choice.
 */
(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.CareerOpsJobSearch=api;
})(typeof window!=="undefined"?window:null,function(){
  "use strict";
  function normalize(value){
    return String(value==null?"":value).normalize("NFKC").toLowerCase()
      // Canonicalize technology spellings BEFORE discarding punctuation.
      .replace(/\basp\s*\.?\s*net\b/g,"asp dotnet")
      .replace(/\.net\b/g,"dotnet")
      .replace(/\bdot\s+net\b/g,"dotnet")
      .replace(/c#/g,"csharp")
      .replace(/c\+\+/g,"cpp")
      .replace(/[^\p{L}\p{N}]+/gu," ").replace(/\s+/g," ").trim()
      .replace(/\bservice now\b/g,"servicenow")
      .replace(/\bsales force\b/g,"salesforce");
  }
  const containsTerm=(value,term)=>Boolean(value&&(" "+value+" ").includes(" "+term+" "));
  function evaluate(job,query,{includeDescription=false}={}){
    const search=normalize(query);
    if(!search)return {matches:true,score:0,source:"all"};
    const terms=search.split(" ").filter(Boolean);
    const fields=[
      ["title",normalize(job?.title),120],
      ["skills",normalize(Array.isArray(job?.skills)?job.skills.join(" "):""),100],
      ["department",normalize(job?.department),80],
      ["company",normalize(job?.company),70],
      ["location",normalize(job?.location),55]
    ];
    if(includeDescription)fields.push(["description",normalize(job?.description),8]);
    let points=0,mainHits=0;
    for(const term of terms){
      let best=0,bestSource="";
      for(const [source,text,weight] of fields){
        if(containsTerm(text,term) && weight>best){best=weight;bestSource=source;}
      }
      if(!best)return {matches:false,score:0,source:"none"};
      points+=best;
      if(bestSource!=="description")mainHits++;
    }
    // Explicit platform/role names cannot match solely through skills.
    // Example: DevOps should not return a Product Manager who merely lists DevOps.
    // Likewise a Salesforce posting mentioning ServiceNow tools is not a
    // ServiceNow role. Employer-name searches remain valid for ServiceNow.
    const roleIdentity=[fields[0][1],fields[2][1],fields[3][1]].join(" ");
    if(["devops","sre","servicenow"].some(term=>terms.includes(term)&&
        !containsTerm(roleIdentity,term))){
      return {matches:false,score:0,source:"role-mismatch"};
    }
    // A role query must be supported by the role itself, not split across a
    // generic title word ("Engineer") and an incidental employer name ("AI").
    // Exact employer-name searches remain supported.
    const roleWords=new Set(["engineer","developer","architect","analyst","administrator","tester","scientist","consultant","specialist","designer","manager","lead","intern","trainee"]);
    const requestedRole=terms.some(term=>roleWords.has(term));
    const exactCompany=containsTerm(fields[3][1],search);
    if(requestedRole&&!exactCompany){
      const roleText=[fields[0][1],fields[1][1],fields[2][1]].join(" ");
      const meaningful=terms.filter(term=>!roleWords.has(term)&&!["senior","junior","associate","entry","level","full","stack"].includes(term));
      if(meaningful.length&&!meaningful.every(term=>containsTerm(roleText,term)))
        return {matches:false,score:0,source:"role-mismatch"};
    }
    // Exact job-role phrases outrank broad company or description mentions.
    if(containsTerm(fields[0][1],search))points+=180;
    else if(containsTerm(fields[1][1],search))points+=100;
    else if(containsTerm(fields[2][1],search))points+=70;
    else if(containsTerm(fields[3][1],search))points+=65;
    if(mainHits===terms.length)points+=30;
    return {matches:true,score:points,source:mainHits===terms.length?"primary":"description"};
  }
  return Object.freeze({normalize,evaluate});
});
