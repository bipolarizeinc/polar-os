import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewerOperation } from "@/app/lib/etsa/reviewer";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";
import { referralsEnabled } from "@/app/lib/etsa/referral-gate";
import { listReferrals, notifyReferral, type Referral } from "@/app/lib/etsa/referrals";

type Context={params:Promise<{assessmentId:string}>};
const send=(body:object,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
async function authorize(context:Context){
  const {assessmentId}=await context.params;
  if(!z.uuid().safeParse(assessmentId).success)return {error:send({error:"Invalid assessment."},400)};
  const auth=await reviewerOperation("detail",assessmentId);
  if(auth.status!==200)return {error:send({error:"Reviewer authorization required."},auth.status)};
  const config=getSupabaseConfig();
  if(!config)return {error:send({error:"Secure referral storage is unavailable."},503)};
  return {config,assessmentId};
}

export async function GET(_:Request,context:Context){
  try{
    const access=await authorize(context);
    if(access.error)return access.error;
    const referrals=await listReferrals(access.config,access.assessmentId,true);
    if(!referrals.some(row=>row.decision!=="withdrawn"))return send({referrals,report:null});
    const [result]=await supabaseRequest<Array<{id:string}>>(access.config,`etsa_results?assessment_id=eq.${access.assessmentId}&select=id&limit=1`);
    if(!result)return send({referrals,report:null});
    const [candidate]=await supabaseRequest<Array<{report:Record<string,unknown>}>>(access.config,`etsa_candidate_reports?result_id=eq.${result.id}&select=report&limit=1`);
    return send({referrals,report:candidate?.report??null});
  }catch{return send({error:"Referral review is unavailable."},503);}
}
export async function PATCH(request:Request,context:Context){
  if(!referralsEnabled())return send({error:"New referral decisions are disabled."},503);
  if(request.headers.get("origin")!==new URL(request.url).origin)return send({error:"Invalid origin."},403);
  const input=z.object({kind:z.enum(["placement","founder"]),decision:z.enum(["invite","closed"])}).safeParse(await request.json().catch(()=>null));
  if(!input.success)return send({error:"Select a decision."},400);
  try{
    const access=await authorize(context);
    if(access.error)return access.error;
    const rows=await supabaseRequest<Referral[]>(access.config,`etsa_candidate_referrals?assessment_id=eq.${access.assessmentId}&kind=eq.${input.data.kind}&decision=eq.pending`,{method:"PATCH",body:JSON.stringify({decision:input.data.decision,decided_at:new Date().toISOString()})});
    if(!rows.length)return send({error:"No pending referral exists."},409);
    return send({referrals:await listReferrals(access.config,access.assessmentId,true)});
  }catch{return send({error:"The decision could not be saved."},503);}
}

export async function POST(request:Request,context:Context){
  if(!referralsEnabled())return send({error:"Referral notifications are disabled."},503);
  if(request.headers.get("origin")!==new URL(request.url).origin)return send({error:"Invalid origin."},403);
  const input=z.object({kind:z.enum(["placement","founder"]),event:z.enum(["referral","schedule"])}).safeParse(await request.json().catch(()=>null));
  if(!input.success)return send({error:"Select a notification to retry."},400);
  try{
    const access=await authorize(context);
    if(access.error)return access.error;
    const rows=await listReferrals(access.config,access.assessmentId,true);
    const row=rows.find(row=>row.kind===input.data.kind&&row.decision!=="withdrawn");
    if(!row||(input.data.event==="schedule"&&(row.decision!=="invite"||row.contact_choice!=="schedule")))return send({error:"No eligible request."},409);
    if((input.data.event==="schedule"?row.schedule_notified_at:row.email_notified_at))return send({referrals:rows});
    const sent=await notifyReferral(access.config,access.assessmentId,row.kind,input.data.event);
    if(!sent)return send({error:"Provider did not confirm delivery. Check sender configuration and try again."},503);
    return send({referrals:await listReferrals(access.config,access.assessmentId,true)});
  }catch{return send({error:"Email retry was not confirmed."},503);}
}
