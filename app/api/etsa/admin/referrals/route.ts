import { NextResponse } from "next/server";
import { reviewerOperation } from "@/app/lib/etsa/reviewer";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";
import { founderOfferStorageReady, referralStorageReady } from "@/app/lib/etsa/referral-gate";
import type { Referral } from "@/app/lib/etsa/referrals";

const send=(body:object,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(){
  try{
    const authorization=await reviewerOperation("queue");
    if(authorization.status!==200)return send({error:"Reviewer authorization required."},authorization.status);
    if(!referralStorageReady())return send({available:false,referrals:[]});
    const config=getSupabaseConfig();
    if(!config)return send({error:"Secure referral storage is unavailable."},503);
    const founderReady=founderOfferStorageReady();
    const offerCondition=founderReady?",and(kind.eq.founder,decision.eq.invite,founder_offer_confirmed_at.not.is.null,founder_offer_invoice_reference.is.null)":"";
    const fields=founderReady?",founder_offer_confirmed_at":"";
    const rows=await supabaseRequest<Referral[]>(config,`etsa_candidate_referrals?or=(decision.eq.pending,contact_choice.eq.schedule${offerCondition})&select=assessment_id,kind,decision,contact_choice,consent_at,email_notified_at${fields}&order=consent_at.desc&limit=100`);
    return send({available:true,referrals:rows});
  }catch{return send({error:"Referral queue is unavailable."},503);}
}
