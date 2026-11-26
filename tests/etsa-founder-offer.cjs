/* eslint-disable @typescript-eslint/no-require-imports */
const test=require("node:test");
const assert=require("node:assert/strict");
const ts=require("./support/load-ts.cjs");
const host="https://www.polarpaw.online";
const assessmentId="5a496e6c-b207-4a92-96a6-2d86c704babe";
const userId="af1aa318-c7a2-43a3-b6d7-3b02ed5e14ce";
const confirm={kind:"founder",decision:"confirm-founder-offer",confirmed:true};
const record={kind:"founder",decision:"record-founder-invoice",invoiceReference:"in_abcdefghijkl"};
const context={params:Promise.resolve({assessmentId})};
const req=(payload,origin=host)=>new Request(host+"/api/etsa/admin/referral/"+assessmentId,{method:"PATCH",headers:{Origin:origin},body:JSON.stringify(payload)});
function fixture({authorized=true,enabled=true,storage=true,report=true,pending=true}={}){
  const calls=[];
  const route=ts({
    "next/server":{NextResponse:{json:(data,options)=>({data,...options})}},
    "@/app/lib/etsa/reviewer":{reviewerOperation:async()=>({status:authorized?200:401})},
    "@/app/lib/etsa/referral-gate":{referralStorageReady:()=>true,referralsEnabled:()=>enabled,founderOfferStorageReady:()=>storage},
    "@/app/lib/etsa/referrals":{listReferrals:async()=>[]},
    "@/app/lib/polar-memory":{getSupabaseConfig:()=>({}),supabaseRequest:async(_config,path,init)=>{
      calls.push({path,body:init?.body?JSON.parse(init.body):undefined});
      if(path.startsWith("etsa_results"))return [{id:assessmentId,user_id:userId}];
      if(path.startsWith("etsa_candidate_reports"))return report?[{id:assessmentId}]:[];
      return pending?[{}]:[];
    }}
  })("app/api/etsa/admin/referral/[assessmentId]/route.ts");
  return {route,calls};
}
test("fixed offer is never granted without authorized review, explicit confirmation, and the storage gate",async()=>{
  for(const [options,payload,origin,code] of [[{authorized:false},confirm,host,401],[{enabled:false},confirm,host,503],[{storage:false},confirm,host,503],[{},confirm,"https://untrusted.example",403],[{}, {...confirm,confirmed:false},host,400],[{}, {...confirm,kind:"placement"},host,400]]){
    const f=fixture(options);assert.equal((await f.route.PATCH(req(payload,origin),context)).status,code);assert.equal(f.calls.length,0);
  }
});
test("founder confirmation checks immutable evidence and candidate binding, and cannot revive withdrawn offers",async()=>{
  const noReport=fixture({report:false});assert.equal((await noReport.route.PATCH(req(confirm),context)).status,409);assert.equal(noReport.calls.length,2);
  const f=fixture();assert.equal((await f.route.PATCH(req({...confirm,price:1,user_id:"forged"}),context)).status,200);
  const write=f.calls.at(-1);
  assert.ok(write.path.includes("kind=eq.founder")&&write.path.includes("decision=in.(pending,invite)")&&write.path.includes("contact_email=not.is.null"));
  assert.ok(write.path.includes(userId)&&write.path.includes("founder_offer_confirmed_at=is.null"));
  assert.deepEqual(Object.keys(write.body).sort(),["decided_at","decision","founder_offer_confirmed_at"]);
});
test("manual invoice reference recording requires a confirmed outstanding founder offer",async()=>{
  const absent=fixture({pending:false});assert.equal((await absent.route.PATCH(req(record),context)).status,409);
  const f=fixture();assert.equal((await f.route.PATCH(req(record),context)).status,200);
  assert.match(f.calls[0].path,/founder_offer_confirmed_at=not.is.null&founder_offer_invoice_reference=is.null/);
  assert.equal(f.calls[0].body.founder_offer_invoice_reference,record.invoiceReference);
  assert.equal((await f.route.PATCH(req({...record,invoiceReference:"https://any.example/"}),context)).status,400);
});
test("the public Blueprint price is unchanged; the verified SMS URI has no message body",()=>{
  const {FOUNDER_BLUEPRINT_PRICE,BPEI_SMS_URL}=ts()("app/lib/etsa/founder-offer.ts");
  const catalog=ts()("app/lib/service-catalog.ts");
  assert.equal(catalog.getServiceOffer("bipolarized-blueprint").amount,49900);
  assert.equal(FOUNDER_BLUEPRINT_PRICE,"$349");
  assert.equal(BPEI_SMS_URL,"sms:+18016868143");
});
