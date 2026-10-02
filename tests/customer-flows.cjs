/* Node test harness loads isolated TypeScript modules with mocked network boundaries. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest } = require('next/server');
function loader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} }; cache.set(file, loadedModule);
    const js = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const req = name => {
      if(name === 'server-only')return {};
      if(name in overrides)return overrides[name];
      if(name.startsWith('@/'))return load(name.replace('@/', './') + '.ts');
      if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name)+'.ts');
      return require(name);
    };
    vm.runInNewContext(js,{require:req,module:loadedModule,exports:loadedModule.exports,process,URL,URLSearchParams,fetch:overrides.fetch||fetch,AbortSignal,console},{filename:file});
    return loadedModule.exports;
  }
  return load;
}
const destination = loader()('app/lib/customer-navigation.ts').customerDestination;
for (const unsafe of ['//evil.test','/\\evil.test','https://evil.test','/api/etsa/submit','/welcome','/etsa/login'])test(`reject unsafe destination ${unsafe}`,()=>assert.equal(destination(unsafe),'/dashboard'));
test('preserve customer destination and query',()=>assert.equal(destination('/etsa/results?attempt=2'),'/etsa/results?attempt=2'));
const validate=loader()('app/lib/etsa/answer-validation.ts').validEtsaAnswer;
test('option zero is a valid answer',()=>assert.equal(validate(1,0,null),true));
test('reject invalid option, blank text and excessive words',()=>{
 assert.equal(validate(1,99,null),false);assert.equal(validate(15,null,'  '),false);
 const questions=loader()('app/lib/etsa/questions.ts').ETSA_QUESTIONS;
 const q=questions.find(q=>q.maxWords); assert.equal(validate(q.id,null,Array(q.maxWords+1).fill('word').join(' ')),false);
});
function authResponse(status,body){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});}
test('fresh verified session continues without refresh',async()=>{
 let calls=0; const proxy=loader({fetch:async()=>{calls++;return authResponse(200,{id:'customer'});}})('proxy.ts').proxy;
 const response=await proxy(new NextRequest('https://www.polarpaw.online/dashboard',{headers:{cookie:'etsa_access=valid'}}));
 assert.equal(response.headers.get('x-middleware-next'),'1');assert.equal(calls,1);
});
test('expired session refreshes browser and downstream request cookies',async()=>{
 const proxy=loader({fetch:async(url)=>url.includes('grant_type=refresh_token')?authResponse(200,{access_token:'new-access',refresh_token:'new-refresh',expires_in:3600,user:{id:'customer'}}):authResponse(401,{msg:'expired'})})('proxy.ts').proxy;
 const response=await proxy(new NextRequest('https://www.polarpaw.online/etsa/results',{headers:{cookie:'etsa_access=expired; etsa_refresh=refresh'}}));
 assert.equal(response.cookies.get('etsa_access').value,'new-access');
 assert.match(response.headers.get('x-middleware-request-cookie'),/etsa_access=new-access/);
 assert.equal(response.headers.get('cache-control'),'private, no-store');
});
test('refresh-only cookie restores access',async()=>{
 const proxy=loader({fetch:async()=>authResponse(200,{access_token:'new',refresh_token:'rotated',expires_in:3600,user:{id:'customer'}})})('proxy.ts').proxy;
 const response=await proxy(new NextRequest('https://www.polarpaw.online/dashboard',{headers:{cookie:'etsa_refresh=refresh'}}));assert.equal(response.cookies.get('etsa_access').value,'new');
});
test('unauthenticated page keeps intended destination',async()=>{
 const response=await loader()('proxy.ts').proxy(new NextRequest('https://www.polarpaw.online/etsa/results?attempt=2'));
 assert.equal(new URL(response.headers.get('location')).searchParams.get('next'),'/etsa/results?attempt=2');
});
test('unauthenticated API returns JSON 401, not HTML redirect',async()=>{
 const response=await loader()('proxy.ts').proxy(new NextRequest('https://www.polarpaw.online/api/etsa/session'));
 assert.equal(response.status,401);assert.equal((await response.json()).authenticated,false);
});
test('auth outage keeps cookies and returns retryable 503',async()=>{
 const response=await loader({fetch:async()=>authResponse(503,{message:'unavailable'})})('proxy.ts').proxy(new NextRequest('https://www.polarpaw.online/dashboard',{headers:{cookie:'etsa_access=valid; etsa_refresh=valid'}}));
 assert.equal(response.status,503);assert.equal(response.headers.get('set-cookie'),null);
});
test('repeat acknowledgment uses insert-only conflict handling',async()=>{
 let preference;
 const POST=loader({'next/headers':{cookies:async()=>({get:()=>({value:'valid'})})},fetch:async(url,init)=>{
  if(url.includes('/auth/'))return authResponse(200,{id:'customer'});
  preference=init.headers.Prefer;return authResponse(200,[]);
 }})('app/api/etsa/consent/route.ts').POST;
 assert.equal((await POST()).status,200);assert.match(preference,/resolution=ignore-duplicates/);
});
test('submitted assessment cannot be edited',async()=>{
 let writes=0;
 const PUT=loader({'next/headers':{cookies:async()=>({get:()=>({value:'valid'})})},fetch:async(url,init)=>{
  if(url.includes('/auth/'))return authResponse(200,{id:'customer'});
  if(init.method==='POST'||init.method==='PATCH')writes++;
  return authResponse(200,[{id:'assessment',status:'REVIEW_REQUIRED'}]);
 }})('app/api/etsa/response/route.ts').PUT;
 const response=await PUT(new Request('https://www.polarpaw.online/api/etsa/response',{method:'PUT',body:JSON.stringify({assessmentId:'assessment',questionId:1,answerValue:0})}));
 assert.equal(response.status,409);assert.equal(writes,0);
});
test('email-confirmation signup returns guidance without a failing password login',async()=>{
 let calls=0;
 const POST=loader({fetch:async()=>{calls++;return authResponse(200,{user:{id:'new-user'}});}})('app/api/etsa/auth/register/route.ts').POST;
 const response=await POST(new Request('https://www.polarpaw.online/api/etsa/auth/register',{method:'POST',body:JSON.stringify({fullName:'Test',email:'test@example.com',password:'valid-test-password'})}));
 assert.equal((await response.json()).confirmationRequired,true);assert.equal(calls,1);assert.equal(response.headers.get('set-cookie'),null);
});
