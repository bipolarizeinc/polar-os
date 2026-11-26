import "server-only";
import {createHash} from "node:crypto";
import type { SupabaseConfig } from "../polar-memory";
import { supabaseRequest } from "../polar-memory";

export type Referral = {
  assessment_id:string;
  kind:"placement"|"founder";
  preferences:{industry?:string;roleFamily?:string;workMode?:string};
  decision:"pending"|"invite"|"closed"|"withdrawn";
  contact_choice:"as-soon-as-available"|"schedule"|null;
  requested_time:string|null;
  requested_timezone:string|null;
  consent_at:string;
  email_notified_at:string|null;
  schedule_notified_at:string|null;
};
const fields="assessment_id,kind,preferences,decision,contact_choice,requested_time,requested_timezone,consent_at,email_notified_at,schedule_notified_at";

export async function listReferrals(config:SupabaseConfig, assessmentId:string, includeContact=false){
  return supabaseRequest<Referral[]>(config,`etsa_candidate_referrals?assessment_id=eq.${assessmentId}&select=${fields}${includeContact?",contact_email":""}&order=consent_at.asc`);
}

export async function notifyReferral(config:SupabaseConfig, assessmentId:string, kind:Referral["kind"],event:"referral"|"schedule"="referral"){
  const key=process.env.ETSA_RESEND_API_KEY?.trim();
  const from=process.env.ETSA_NOTIFICATION_FROM?.trim();
  if(!key||!from)return false;
  const dedupe=createHash("sha256").update(`etsa:${event}:${kind}:${assessmentId}`).digest("hex");
  const field=event==="schedule"?"schedule_notified_at":"email_notified_at";
  try{
    const response=await fetch("https://api.resend.com/emails",{
      method:"POST",cache:"no-store",signal:AbortSignal.timeout(5000),
      headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json","Idempotency-Key":`etsa-${dedupe}`},
      body:JSON.stringify({from,to:["yourthing@polarpaw.online"],subject:event==="schedule"?"ETSA: preferred-time request ready for review":"ETSA: consented referral ready for review",text:"Sign in to the BPEI ETSA reviewer queue to see the request securely: https://www.polarpaw.online/admin/etsa"})
    });
    if(!response.ok)return false;
    await supabaseRequest(config,`etsa_candidate_referrals?assessment_id=eq.${assessmentId}&kind=eq.${kind}`,{method:"PATCH",body:JSON.stringify({[field]:new Date().toISOString()}),headers:{Prefer:"return=minimal"}});
    return true;
  }catch{return false;}
}
