/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const test=require("node:test");
const load=require("./support/load-ts.cjs")();
const {getIndustryEvidence}=load("app/lib/etsa/career-evidence.ts");
const {industries}=load("app/lib/etsa/discovery.ts");

test("every ETSA industry has a unique concrete sample, evidence lens and exploration step",()=>{
  assert.equal(industries.length,12);
  const samples=new Set(), steps=new Set();
  for(const label of industries){
    const guide=getIndustryEvidence(label);
    assert.ok(guide,label);
    for(const key of ["workSample","lookFor","nextStep"])assert.ok(guide[key].length>45,`${label}: ${key}`);
    samples.add(guide.workSample);
    steps.add(guide.nextStep);
  }
  assert.equal(samples.size,industries.length);
  assert.equal(steps.size,industries.length);
});

test("unselected, unknown, malformed, and prototype values never surface a guide",()=>{
  for(const value of ["","Unmapped","constructor","__proto__",null,undefined,1,{},["Technology & data"]]){
    assert.equal(getIndustryEvidence(value),undefined);
  }
});
