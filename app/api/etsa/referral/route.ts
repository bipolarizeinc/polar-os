import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getEtsaUser } from "@/app/lib/etsa/auth";
import { etsaRest } from "@/app/lib/etsa/data";
import { getPaidEtsaEntitlement } from "@/app/lib/etsa/entitlements";
import { industries, roleFamilies, workModes } from "@/app/lib/etsa/discovery";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";
import { referralStorageReady, referralsEnabled } from "@/app/lib/etsa/referral-gate";
import { listReferrals, notifyReferral, type Referral } from "@/app/lib/etsa/referrals";

const kind=z.enum(["placement","founder"]);
const submission=z.object({kind,consent:z.literal(true),industry:z.enum(industries).optional(),roleFamily:z.enum(roleFamilies).optional(),workMode:z.enum(workModes).optional()});
const contact=z.object({kind:z.literal("placement"),choice:z.literal("schedule"),preferredTime:z.iso.datetime({local:true,precision:-1}).refine(value=>!value.endsWith("Z")),timeZone:z.string().max(64).refine(value=>{try{new Intl.DateTimeFormat("en",{timeZone:value});return true;}catch{return false;}})});
const reply=(body:object,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});

async function access(){
  const token=(await cookies()).get("etsa_access")?.value;
  if(!token)return {error:reply({error:"Sign in first."},401)};
  const user=await getEtsaUser(token);
  const sessions=await etsaRest<Array<{id:string;status:string}>>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=attempt_number.desc&select=id,status&limit=2`,token);
  const session=sessions[0];
  if(!session||session.status!=="COMPLETE")return {error:reply({error:"A finalized ETSA report is required."},409)};
  if(sessions.length>1&&!(await getPaidEtsaEntitlement(user.id,session.id,token)))return {error:reply({error:"Unlock this report before sharing it."},403)};
  const [result]=await etsaRest<Array<{id:string}>>(`etsa_results?assessment_id=eq.${session.id}&user_id=eq.${user.id}&select=id&limit=1`,token);
  if(!result)return {error:reply({error:"A finalized ETSA report is required."},409)};
  const [report]=await etsaRest<Array<{id:string}>>(`etsa_candidate_reports?result_id=eq.${result.id}&user_id=eq.${user.id}&select=id&limit=1`,token);
  if(!report)return {error:reply({error:"A finalized ETSA report is required."},409)};
  const config=getSupabaseConfig();
  if(!config)return {error:reply({error:"Secure referral storage is not available."},503)};
  return {config,session,user};
}

export async function GET(){
  if(!referralStorageReady())return reply({enabled:false,referrals:[]});
  try{
    const context=await access();
    if(context.error)return context.error;
    return reply({enabled:referralsEnabled(),referrals:await listReferrals(context.config,context.session.id)});
  }catch{return reply({error:"Referral status is unavailable."},503);}
}

export async function POST(request:Request){
  if(!referralsEnabled())return reply({error:"New ETSA referrals are not open right now."},503);
  if(request.headers.get("origin")!==new URL(request.url).origin)return reply({error:"Invalid origin."},403);
  const input=submission.safeParse(await request.json().catch(()=>null));
  if(!input.success)return reply({error:"Explicit consent and valid discovery options are required."},400);
  try{
    const context=await access();
    if(context.error)return context.error;
    const {config,session,user}=context;
    const {kind,industry,roleFamily,workMode}=input.data;
    const rows=await supabaseRequest<Referral[]>(config,`etsa_candidate_referrals?on_conflict=assessment_id,kind`,{
      method:"POST",headers:{Prefer:"resolution=ignore-duplicates,return=representation"},
      body:JSON.stringify({assessment_id:session.id,user_id:user.id,kind,contact_email:user.email??null,consent_version:"ETSA-REFERRAL-1.0",preferences:{industry,roleFamily,workMode}})
    });
    const notified=!!rows[0]&&await notifyReferral(config,session.id,kind);
    return reply({referrals:await listReferrals(config,session.id),notified},rows[0]?201:200);
  }catch{return reply({error:"Your referral could not be confirmed. Please check status and try again."},503);}
}

export async function PATCH(request:Request){
  if(!referralsEnabled())return reply({error:"New contact requests are not open right now."},503);
  if(request.headers.get("origin")!==new URL(request.url).origin)return reply({error:"Invalid origin."},403);
  const input=contact.safeParse(await request.json().catch(()=>null));
  if(!input.success)return reply({error:"Choose a contact preference."},400);
  try{
    const context=await access();
    if(context.error)return context.error;
    const rows=await supabaseRequest<Referral[]>(context.config,`etsa_candidate_referrals?assessment_id=eq.${context.session.id}&kind=eq.placement&decision=eq.invite`,{method:"PATCH",body:JSON.stringify({contact_choice:input.data.choice,requested_time:input.data.preferredTime,requested_timezone:input.data.timeZone})});
    if(!rows.length)return reply({error:"A human reviewer must invite you before you can request a conversation."},409);
    if(!rows[0].schedule_notified_at)await notifyReferral(context.config,context.session.id,"placement","schedule");
    return reply({referrals:await listReferrals(context.config,context.session.id)});
  }catch{return reply({error:"Your contact preference could not be saved."},503);}
}


export async function DELETE(request:Request){
  if(!referralStorageReady())return reply({error:"Referral storage is not configured."},503);
  if(request.headers.get("origin")!==new URL(request.url).origin)return reply({error:"Invalid origin."},403);
  const input=z.object({kind,assessmentId:z.uuid()}).safeParse(await request.json().catch(()=>null));
  if(!input.success)return reply({error:"Choose the referral to withdraw."},400);
  try{
    const token=(await cookies()).get("etsa_access")?.value;
    if(!token)return reply({error:"Sign in first."},401);
    const user=await getEtsaUser(token);
    const config=getSupabaseConfig();
    if(!config)return reply({error:"Secure referral storage is unavailable."},503);
    await supabaseRequest(config,`etsa_candidate_referrals?user_id=eq.${user.id}&assessment_id=eq.${input.data.assessmentId}&kind=eq.${input.data.kind}&decision=neq.withdrawn`,{
      method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({decision:"withdrawn",withdrawn_at:new Date().toISOString(),preferences:{},contact_email:null,contact_choice:null,requested_time:null,requested_timezone:null})
    });
    return reply({withdrawn:true});
  }catch{return reply({error:"Withdrawal could not be confirmed."},503);}
}
