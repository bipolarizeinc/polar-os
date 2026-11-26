/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const test=require("node:test");
const load=require("./support/load-ts.cjs");
const host="https://www.polarpaw.online";
const id="5a496e6c-b207-4a92-96a6-2d86c704babe";
const account="af1aa318-c7a2-43a3-b6d7-3b02ed5e14ce";
const payload={kind:"placement",consent:true,industry:"Automotive & field services",roleFamily:"Operations & delivery"};
const request=(data,origin=host)=>new Request(host+"/api/etsa/referral",{method:"POST",headers:{Origin:origin},body:JSON.stringify(data)});
function candidate({auth=true,result=true,report=true,paid=true,attempts=1,decisionMatch=true,created=true,enabled=true}={}){
  const paths=[],calls=[],notifications=[];
  const route=load({
    "next/server":{NextResponse:{json:(data,options)=>({data,...options})}},
    "next/headers":{cookies:async()=>({get:()=>auth?{value:"authenticated"}:undefined})},
    "@/app/lib/etsa/auth":{getEtsaUser:async()=>({id:account,email:"participant@example.test"})},
    "@/app/lib/etsa/referral-gate":{referralsEnabled:()=>enabled},
    "@/app/lib/etsa/entitlements":{getPaidEtsaEntitlement:async()=>paid},
    "@/app/lib/etsa/data":{etsaRest:async path=>{
      paths.push(path);
      if(path.startsWith("etsa_assessment_sessions"))return Array.from({length:attempts},()=>({id,status:"COMPLETE"}));
      if(path.startsWith("etsa_results"))return result?[{id}]:[];
      if(path.startsWith("etsa_candidate_reports"))return report?[{id}]:[];
    }},
    "@/app/lib/polar-memory":{getSupabaseConfig:()=>({}),supabaseRequest:async(_config,path,init)=>{
      calls.push({path,data:JSON.parse(init.body)});return init.method==="POST"?(created?[{}]:[]):decisionMatch?[{}]:[];
    }},
    "@/app/lib/etsa/referrals":{listReferrals:async()=>[],notifyReferral:async(_config,id,kind)=>{notifications.push({id,kind});return true;}},
  })("app/api/etsa/referral/route.ts");
  return{route,paths,calls,notifications};
}
test("placement submission fails without consent, known industry, authenticated user or same origin",async()=>{
  for(const [data,origin,code] of [[{...payload,consent:false},host,400],[{...payload,industry:"FORGED"},host,400],[payload,"https://other.example",403]]){
    const fixture=candidate();assert.equal((await fixture.route.POST(request(data,origin))).status,code);assert.deepEqual(fixture.calls,[]);
  }
  const fixture=candidate({auth:false});assert.equal((await fixture.route.POST(request(payload))).status,401);assert.deepEqual(fixture.calls,[]);
});
test("editable session completion alone cannot submit reports; locked reassessments stay locked",async()=>{
  for(const settings of [{result:false},{report:false},{paid:false,attempts:2}]){
    const fixture=candidate(settings);assert.ok([403,409].includes((await fixture.route.POST(request(payload))).status));assert.deepEqual(fixture.calls,[]);
  }
});
test("consented referral uses authenticated IDs, local discovery, and one notification per insertion",async()=>{
  const fixture=candidate();
  assert.equal((await fixture.route.POST(request({...payload,user_id:"untrusted",assessment_id:"untrusted",decision:"invite"}))).status,201);
  assert.equal(fixture.calls[0].data.user_id,account);
  assert.equal(fixture.calls[0].data.assessment_id,id);
  assert.equal(fixture.calls[0].data.decision,undefined);
  assert.equal(fixture.calls[0].data.preferences.industry,payload.industry);
  assert.equal(fixture.notifications.length,1);
  const duplicate=candidate({created:false});assert.equal((await duplicate.route.POST(request(payload))).status,200);assert.equal(duplicate.notifications.length,0);
});
test("scheduling requires a human invite and never books; withdrawal erases shared contact and preferences",async()=>{
  const blocked=candidate({decisionMatch:false});
  const valid={kind:"placement",choice:"schedule",preferredTime:"2026-12-01T10:00",timeZone:"America/Denver"};
  assert.equal((await blocked.route.PATCH(request(valid))).status,409);
  assert.match(blocked.calls[0].path,/decision=eq.invite/);
  const allowed=candidate();
  assert.equal((await allowed.route.PATCH(request(valid))).status,200);
  assert.equal(allowed.calls[0].data.requested_timezone,"America/Denver");
  assert.equal((await allowed.route.DELETE(request({kind:"placement",assessmentId:id}))).status,200);
  assert.match(allowed.calls[1].path,new RegExp(account));
  assert.equal(allowed.calls[1].data.contact_email,null);
  assert.deepEqual(allowed.calls[1].data.preferences,{});
});


test("server-side gate prevents submissions and time requests independently of client choice; withdrawal remains available",async()=>{
  const fixture=candidate({enabled:false});
  assert.equal((await fixture.route.POST(request(payload))).status,503);
  assert.equal((await fixture.route.PATCH(request({}))).status,503);
  assert.equal(fixture.calls.length,0);
  assert.equal((await fixture.route.DELETE(request({kind:"placement",assessmentId:id}))).status,200);
  assert.equal(fixture.calls.length,1);
});
