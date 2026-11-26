import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewerOperation } from "@/app/lib/etsa/reviewer";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";
import { founderOfferStorageReady, referralStorageReady, referralsEnabled } from "@/app/lib/etsa/referral-gate";
import { listReferrals, notifyReferral, type Referral } from "@/app/lib/etsa/referrals";

type Context={params:Promise<{assessmentId:string}>};
const send=(body:object,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
async function authorize(context:Context){
  const {assessmentId}=await context.params;
  if(!z.uuid().safeParse(assessmentId).success)return {error:send({error:"Invalid assessment."},400)};
  const auth=await reviewerOperation("detail",assessmentId);
  if(auth.status!==200)return {error:send({error:"Reviewer authorization required."},auth.status)};
  if(!referralStorageReady())return {unconfigured:true as const};
  const config=getSupabaseConfig();
  if(!config)return {error:send({error:"Secure referral storage is unavailable."},503)};
  return {config,assessmentId};
}

export async function GET(_:Request,context:Context){
  try{
    const access=await authorize(context);
    if(access.error)return access.error;
    if(access.unconfigured)return send({available:false,referrals:[],report:null});
    const referrals=await listReferrals(access.config,access.assessmentId,true);
    if(!referrals.some(row=>row.decision!=="withdrawn"))return send({referrals,report:null});
    const [result]=await supabaseRequest<Array<{id:string}>>(access.config,`etsa_results?assessment_id=eq.${access.assessmentId}&select=id&limit=1`);
    if(!result)return send({referrals,report:null});
    const [candidate]=await supabaseRequest<Array<{report:Record<string,unknown>}>>(access.config,`etsa_candidate_reports?result_id=eq.${result.id}&select=report&limit=1`);
    return send({referrals,report:candidate?.report??null,founderOfferReady:founderOfferStorageReady()});
  }catch{return send({error:"Referral review is unavailable."},503);}
}
export async function PATCH(request:Request,context:Context){
  if(!referralsEnabled())return send({error:"New referral decisions are disabled."},503);
  if(request.headers.get("origin")!==new URL(request.url).origin)return send({error:"Invalid origin."},403);
  const input=z.union([
    z.object({kind:z.enum(["placement","founder"]),decision:z.enum(["invite","closed"])}),
    z.object({kind:z.literal("founder"),decision:z.literal("confirm-founder-offer"),confirmed:z.literal(true)}),
    z.object({kind:z.literal("founder"),decision:z.literal("record-founder-invoice"),invoiceReference:z.string().trim().regex(/^in_[A-Za-z0-9]{8,100}$/)}),
  ]).safeParse(await request.json().catch(()=>null));
  if(!input.success)return send({error:"Select a decision."},400);
  try{
    const access=await authorize(context);
    if(access.error)return access.error;
    if(access.unconfigured)return send({available:false,referrals:[],report:null});
    const {config,assessmentId}=access;
    const action=input.data;
    const now=new Date().toISOString();
    if(action.decision==="confirm-founder-offer"||action.decision==="record-founder-invoice"){
      if(!founderOfferStorageReady())return send({error:"Founder offer records are not available."},503);
      const basePath=`etsa_candidate_referrals?assessment_id=eq.${assessmentId}&kind=eq.founder`;
      if(action.decision==="confirm-founder-offer"){
        const [result]=await supabaseRequest<Array<{id:string;user_id:string}>>(config,`etsa_results?assessment_id=eq.${assessmentId}&select=id,user_id&limit=1`);
        if(!result)return send({error:"A finalized ETSA report is required."},409);
        const [report]=await supabaseRequest<Array<{id:string}>>(config,`etsa_candidate_reports?result_id=eq.${result.id}&user_id=eq.${result.user_id}&select=id&limit=1`);
        if(!report)return send({error:"A finalized ETSA report is required."},409);
        const rows=await supabaseRequest<Referral[]>(config,`${basePath}&user_id=eq.${result.user_id}&decision=in.(pending,invite)&founder_offer_confirmed_at=is.null&contact_email=not.is.null`,
          {method:"PATCH",body:JSON.stringify({decision:"invite",decided_at:now,founder_offer_confirmed_at:now})});
        if(!rows.length)return send({error:"No consented, unconfirmed founder request with a contact email is available."},409);
      }else{
        const rows=await supabaseRequest<Referral[]>(config,`${basePath}&decision=eq.invite&founder_offer_confirmed_at=not.is.null&founder_offer_invoice_reference=is.null`,
          {method:"PATCH",body:JSON.stringify({founder_offer_invoice_reference:action.invoiceReference})});
        if(!rows.length)return send({error:"No confirmed founder offer without a recorded invoice is available."},409);
      }
      return send({referrals:await listReferrals(config,assessmentId,true),founderOfferReady:true});
    }
    const rows=await supabaseRequest<Referral[]>(config,`etsa_candidate_referrals?assessment_id=eq.${assessmentId}&kind=eq.${action.kind}&decision=eq.pending`,{method:"PATCH",body:JSON.stringify({decision:action.decision,decided_at:now})});
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
    if(access.unconfigured)return send({available:false,referrals:[],report:null});
    const rows=await listReferrals(access.config,access.assessmentId,true);
    const row=rows.find(row=>row.kind===input.data.kind&&row.decision!=="withdrawn");
    if(!row||(input.data.event==="schedule"&&(row.decision!=="invite"||row.contact_choice!=="schedule")))return send({error:"No eligible request."},409);
    if((input.data.event==="schedule"?row.schedule_notified_at:row.email_notified_at))return send({referrals:rows});
    const sent=await notifyReferral(access.config,access.assessmentId,row.kind,input.data.event);
    if(!sent)return send({error:"Provider did not confirm acceptance. Check sender configuration and try again."},503);
    return send({referrals:await listReferrals(access.config,access.assessmentId,true)});
  }catch{return send({error:"Email retry was not confirmed."},503);}
}
