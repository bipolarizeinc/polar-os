/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const loader = require('./support/load-ts.cjs');
const assessmentId = '11111111-1111-4111-8111-111111111111';
const context = { params: Promise.resolve({ assessmentId }) };
const questions = loader()('app/lib/etsa/questions.ts').ETSA_QUESTIONS;
const responses = questions.map(q => ({question_id:q.id,answer_value:q.type==='multi'?[q.options[0]]:q.options?0:null,answer_text:q.type==='text'||q.type==='challenge'?'Synthetic test response.':null}));
const scores = [66,67,68,69,70].map(question_id => ({question_id,score:3,notes:null}));
function finalizer(detail, finalizeResult = {status:200,data:{ok:true,resultId:'saved'}}) {
 const calls=[];
 const POST=loader({'@/app/lib/etsa/reviewer':{reviewerOperation:async(operation,id,payload)=>{
   calls.push({operation,id,payload});
   return operation==='detail'?{status:200,data:detail}:finalizeResult;
 }}})('app/api/etsa/admin/finalize/[assessmentId]/route.ts').POST;
 return {POST,calls};
}
const completeDetail = {session:{status:'REVIEW_REQUIRED'},responses,scores};
test('reviewer finalization scores all responses and hands one snapshot to the atomic RPC',async()=>{
 const {POST,calls}=finalizer(completeDetail);
 assert.equal((await POST(new Request('https://test.invalid'),context)).status,200);
 assert.deepEqual(calls.map(c=>c.operation),['detail','finalize']);
 assert.equal(calls[1].payload.expected.responses.length,70);
 assert.equal(calls[1].payload.expected.scores.length,5);
 assert.equal(calls[1].payload.result.candidateReport.assessmentVersion,'ETSA-1.0');
});
test('finalization refuses an incomplete response set',async()=>{
 const {POST,calls}=finalizer({...completeDetail,responses:responses.slice(1)});
 assert.equal((await POST(new Request('https://test.invalid'),context)).status,400);
 assert.equal(calls.length,1);
});
test('finalization refuses missing reviewer scores',async()=>{
 const {POST,calls}=finalizer({...completeDetail,scores:scores.slice(1)});
 assert.equal((await POST(new Request('https://test.invalid'),context)).status,400);
 assert.equal(calls.length,1);
});
test('finalization refuses drafts without writing results',async()=>{
 const {POST,calls}=finalizer({...completeDetail,session:{status:'IN_PROGRESS'}});
 assert.equal((await POST(new Request('https://test.invalid'),context)).status,409);
 assert.equal(calls.length,1);
});
test('completed results retry without scoring or replacing the record',async()=>{
 const {POST,calls}=finalizer({session:{status:'COMPLETE'},responses:[],scores:[]});
 assert.equal((await POST(new Request('https://test.invalid'),context)).status,200);
 assert.equal(Object.keys(calls[1].payload).length,0);
});
test('a concurrent review change is returned as a retryable conflict',async()=>{
 const {POST}=finalizer(completeDetail,{status:409,error:'Review changed during finalization.'});
 const response=await POST(new Request('https://test.invalid'),context);
 assert.equal(response.status,409);
 assert.match((await response.json()).error,/Review changed/);
});
test('reviewer RPC requires the founder cookie before accessing the database',async()=>{
 let called=false;
 const op=loader({'next/headers':{cookies:async()=>({get:()=>undefined})},'../polar-founder-public-db':{founderPublicRpc:async()=>{called=true;}}})('app/lib/etsa/reviewer.ts').reviewerOperation;
 assert.equal((await op('queue')).status,401);assert.equal(called,false);
});
test('customer entitlement reads use customer RLS, without a service-role key',async()=>{
 let called;
 const get=loader({'./data':{etsaRest:async(path,token)=>{called={path,token};return [{id:'entitlement'}];}}})('app/lib/etsa/entitlements.ts').getPaidEtsaEntitlement;
 const result=await get('customer',assessmentId,'customer-jwt');
 assert.equal(result.id,'entitlement');assert.equal(called.token,'customer-jwt');assert.match(called.path,/status=eq.paid/);
});
test('pending reassessment status does not depend on payment configuration',async()=>{
 const GET=loader({'next/headers':{cookies:async()=>({get:()=>({value:'customer-jwt'})})},'@/app/lib/etsa/auth':{getEtsaUser:async()=>({id:'customer'})},'@/app/lib/etsa/data':{etsaRest:async()=>[{id:'first',status:'COMPLETE'},{id:'second',status:'REVIEW_REQUIRED'}]},'@/app/lib/etsa/entitlements':{getPaidEtsaEntitlement:async()=>{throw new Error('must not be called');}}})('app/api/etsa/results/route.ts').GET;
 const response=await GET();assert.equal(response.status,200);assert.equal((await response.json()).session.status,'REVIEW_REQUIRED');
});
test('login restores a missing participant profile before setting session cookies',async()=>{
 let profile;
 const POST=loader({'@/app/lib/etsa/auth':{loginEtsaUser:async()=>({access_token:'access',refresh_token:'refresh',expires_in:3600,user:{id:'customer',user_metadata:{full_name:'Test Participant'}}})},'@/app/lib/etsa/data':{ensureEtsaProfile:async(...args)=>{profile=args;}}})('app/api/etsa/auth/login/route.ts').POST;
 const response=await POST(new Request('https://test.invalid/api/etsa/auth/login',{method:'POST',body:JSON.stringify({email:'test@example.invalid',password:'test-password'})}));
 assert.equal(response.status,200);assert.deepEqual(profile,['access','customer','Test Participant']);assert.match(response.headers.get('set-cookie'),/etsa_access=access/);
});
