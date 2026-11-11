import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/leads.js';
const originalFetch = globalThis.fetch;
const originalError = console.error;
const savedEnv = { ...process.env };
let ip = 0;
afterEach(() => { globalThis.fetch = originalFetch; console.error = originalError; process.env = { ...savedEnv }; });
function setup() {
  process.env.WEB3FORMS_ACCESS_KEY = 'test-key-never-used-live';
  process.env.GOOGLE_SHEETS_GENERAL_URL = 'https://sheet.invalid/test';
  const logs = []; console.error = (...args) => logs.push(args);
  return logs;
}
async function submit(overrides={}) {
  const req={method:'POST',headers:{host:'site.invalid',origin:'https://site.invalid','x-forwarded-for':`192.0.2.${++ip}`},body:{formType:'contact',name:'Test Person',email:'test@example.invalid',phone:'9876543210',...overrides}};
  const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await handler(req,res);return res;
}
const sheetOK = () => new Response('{"success":true}');
test('both channels succeed and preserve established sheet field contract',async()=>{
 setup();let sheetData;
 globalThis.fetch=async(url,opts)=>{if(String(url).includes('sheet.invalid')){sheetData=opts.body;return sheetOK();}return new Response('{"success":true}');};
 const res=await submit();assert.equal(res.code,200);assert.deepEqual(res.body.delivery,{sheetSaved:true,emailSent:true});
 assert.equal(sheetData.get('email'),'9876543210');assert.equal(sheetData.get('phone'),'test@example.invalid');
});
test('provider rejection keeps saved lead and logs only sanitized diagnostics',async()=>{
 const logs=setup();globalThis.fetch=async url=>String(url).includes('sheet.invalid')?sheetOK():new Response('{"success":false,"message":"test@example.invalid test-key-never-used-live"}',{status:400});
 const res=await submit();assert.equal(res.code,200);assert.deepEqual(res.body.delivery,{sheetSaved:true,emailSent:false});
 const output=JSON.stringify(logs);assert.ok(output.includes('400'));assert.ok(!output.includes('test@example.invalid'));assert.ok(!output.includes('test-key-never-used-live'));
});
test('rate-limit rejection retries email once without repeating successful sheet write',async()=>{
 setup();let emails=0,sheets=0;
 globalThis.fetch=async url=>{if(String(url).includes('sheet.invalid')){sheets++;return sheetOK();}emails++;return emails===1?new Response('{}',{status:429,headers:{'retry-after':'0'}}):new Response('{"success":true}');};
 const res=await submit();assert.equal(res.code,200);assert.equal(res.body.delivery.emailSent,true);assert.equal(emails,2);assert.equal(sheets,1);
});
test('ambiguous transport failure is not retried',async()=>{
 setup();let emails=0;globalThis.fetch=async url=>{if(String(url).includes('sheet.invalid'))return sheetOK();emails++;throw new Error('timeout');};
 const res=await submit();assert.equal(res.code,200);assert.equal(emails,1);assert.equal(res.body.delivery.emailSent,false);
});
test('both channels fail with actionable failure rather than false success',async()=>{
 setup();globalThis.fetch=async()=>new Response('{"success":false}',{status:503});
 const res=await submit();assert.equal(res.code,502);assert.equal(res.body.ok,false);
});
test('wrong-origin requests never invoke delivery providers',async()=>{
 setup();let called=false;globalThis.fetch=async()=>{called=true;throw new Error('unexpected');};
 const req={method:'POST',headers:{host:'site.invalid',origin:'https://other.invalid'},body:{}};
 const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
 await handler(req,res);assert.equal(res.code,403);assert.equal(called,false);
});
