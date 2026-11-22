"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const search = require("../job-search.js");
const job = (title, skills=[], company="Acme", department="Engineering", description="") =>
  ({title,skills,company,department,location:"Hyderabad, India",description});
test("technology aliases are canonical before punctuation is removed",()=>{
  assert.equal(search.normalize(".NET Developer"),"dotnet developer");
  assert.equal(search.normalize("Dotnet Developer"),"dotnet developer");
  assert.equal(search.normalize("Dot Net Developer"),"dotnet developer");
  assert.equal(search.normalize("ASP.NET Developer"),"asp dotnet developer");
  assert.equal(search.normalize("C# Engineer"),"csharp engineer");
  assert.equal(search.normalize("C++ Engineer"),"cpp engineer");
  assert.equal(search.normalize("Service Now Developer"),"servicenow developer");
});
test("DevOps search matches DevOps-titled roles",()=>{
  assert.equal(search.evaluate(job("Senior DevOps Engineer"),"DevOps").matches,true);
  assert.equal(search.evaluate(job("DevOps Automation Engineer"),"DevOps Engineer").matches,true);
});
test("DevOps cannot return unrelated non-DevOps job on skill mention alone",()=>{
  const irrelevant=job("Senior Product Manager - Data Integrations",["DevOps","SQL"]);
  assert.equal(search.evaluate(irrelevant,"DevOps").matches,false);
  assert.equal(search.evaluate(irrelevant,"DevOps",{includeDescription:true}).matches,false);
});
test("SRE search does not return unrelated engineering titles on incidental skills",()=>{
  assert.equal(search.evaluate(job("Senior Site Reliability Engineer (SRE)"),"SRE").matches,true);
  assert.equal(search.evaluate(job("Product Manager",["SRE","Agile"]),"SRE").matches,false);
});
test("ServiceNow cannot return Salesforce based solely on a skill or description",()=>{
  assert.equal(search.evaluate(job("Salesforce Developer",["ServiceNow","CRM"]),"ServiceNow").matches,false);
  assert.equal(search.evaluate(job("Salesforce Developer",[],"Acme","Engineering","Works with ServiceNow"),
    "ServiceNow",{includeDescription:true}).matches,false);
  assert.equal(search.evaluate(job("ServiceNow Developer"),"ServiceNow").matches,true);
  assert.equal(search.evaluate(job("Software Engineer",[],"ServiceNow"),"ServiceNow").matches,true);
});
test(".NET aliases match actual .NET roles but not Java-only roles",()=>{
  assert.equal(search.evaluate(job("Dotnet Developer"),".NET Developer").matches,true);
  assert.equal(search.evaluate(job("ASP.NET Core Developer"),".NET Developer").matches,true);
  assert.equal(search.evaluate(job("Java Developer",["Java","Spring"] ),".NET Developer").matches,false);
});
test("ordinary skill and company searches still work",()=>{
  assert.equal(search.evaluate(job("Cloud Engineer",["Terraform","AWS"]),"AWS").matches,true);
  assert.equal(search.evaluate(job("Software Engineer",[],"Acme"),"Acme").matches,true);
  assert.equal(search.evaluate(job("Data Analyst",["SQL"]),"SQL").matches,true);
});
