"use client";
import {useEffect,useState,type FormEvent} from "react";
import { FOUNDER_BLUEPRINT_PRICE } from "@/app/lib/etsa/founder-offer";

type Referral={kind:"placement"|"founder";decision:"pending"|"closed"|"invite"|"withdrawn";preferences:Record<string,string>;requested_time:string|null;requested_timezone:string|null;email_notified_at:string|null;schedule_notified_at:string|null;contact_email:string|null;founder_offer_confirmed_at?:string|null;founder_offer_invoice_reference?:string|null};
type Report={assessmentVersion:string;readinessLevel:string;topStrengths:string[];developmentPriority:string;evidenceConfidence:Record<string,string>;departmentAlignments:Array<{department:string;score:number}>};
export function ReferralReview({assessmentId}:{assessmentId:string}){
  const [founderOfferReady,setFounderOfferReady]=useState(false);
  const [available,setAvailable]=useState(false);
  const [rows,setRows]=useState<Referral[]>([]);
  const [report,setReport]=useState<Report|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const path=`/api/etsa/admin/referral/${assessmentId}`;
  useEffect(()=>{fetch(path).then(async r=>{const body=await r.json();if(!r.ok)throw new Error(body.error);setAvailable(body.available!==false);setFounderOfferReady(body.founderOfferReady===true);setRows(body.referrals??[]);setReport(body.report??null);}).catch(()=>setError("Referral records are unavailable."));},[path]);
  async function decide(kind:Referral["kind"],decision:"invite"|"closed"|"confirm-founder-offer"|"record-founder-invoice",extra:Record<string,unknown>={}){
    setBusy(true);setError("");
    try{
      const r=await fetch(path,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind,decision,...extra})});
      const body=await r.json();
      if(!r.ok)throw new Error(body.error);
      setRows(body.referrals??[]);
    }catch{setError("The decision could not be saved.");}
    finally{setBusy(false);}
  }
  async function retry(kind:Referral["kind"],event:"referral"|"schedule"){
    setBusy(true);setError("");
    try{const r=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind,event})});const body=await r.json();if(!r.ok)throw new Error(body.error);setRows(body.referrals??[]);}
    catch(err){setError(err instanceof Error?err.message:"Email retry was not confirmed.");}
    finally{setBusy(false);}
  }
  function recordInvoice(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    void decide("founder","record-founder-invoice",{invoiceReference:new FormData(event.currentTarget).get("invoiceReference")});
  }
  if(!available&&!error)return null;
  return <section style={{margin:"28px 0",padding:24,border:"1px solid #32404b"}}>
    <h2>Consented follow-up requests</h2>
    <p>Make decisions using the specific role requirements and applied work evidence. A general profile, archetype or founder interest is not an employment eligibility rule. Check role-specific ability and any need for accommodations separately.</p>
    {error&&<p role="alert">{error}</p>}
    {!rows.length&&!error&&<p>No optional referral has been shared.</p>}
    {report&&<section><h3>Finalized ETSA report {report.assessmentVersion}</h3><p>Readiness: {report.readinessLevel} · Development priority: {report.developmentPriority}</p><ul>{report.departmentAlignments?.map(item=><li key={item.department}>{item.department}: {item.score}% (alignment hypothesis)</li>)}</ul><p>Evidence confidence: {Object.entries(report.evidenceConfidence??{}).map(([key,value])=>`${key}: ${value}`).join(" · ")}</p></section>}
    {rows.map(row=><article key={row.kind} style={{borderTop:"1px solid #32404b",padding:"16px 0"}}>
      <h3>{row.kind==="placement"?"BPEI placement":"Founder offer review"}</h3>
      <p>Status: {row.decision} · {row.email_notified_at?"Team email accepted by provider":"Email not confirmed; continue in this queue"}</p>
      <p>{Object.values(row.preferences).join(" · ")||"No industry preferences shared."}</p>
      {row.contact_email&&<p>Candidate contact: {row.contact_email}</p>}
      {row.decision!=="withdrawn"&&!row.email_notified_at&&<button disabled={busy} onClick={()=>retry(row.kind,"referral")}>Retry team email</button>}
      {row.decision==="invite"&&row.requested_time&&!row.schedule_notified_at&&<button disabled={busy} onClick={()=>retry(row.kind,"schedule")}>Retry preferred-time email</button>}
      {row.requested_time&&<p>Candidate requests {row.requested_time} ({row.requested_timezone}). Confirm with the candidate before booking.</p>}
      {founderOfferReady&&!!report&&row.kind==="founder"&&!!row.contact_email&&["pending","invite"].includes(row.decision)&&!row.founder_offer_confirmed_at&&
        <form onSubmit={event=>{event.preventDefault();void decide("founder","confirm-founder-offer",{confirmed:true});}}>
          <label><input type="checkbox" required/> I reviewed the finalized ETSA report and independent venture evidence and confirm this candidate for the {FOUNDER_BLUEPRINT_PRICE} founder offer.</label>
          <button disabled={busy}>Confirm {FOUNDER_BLUEPRINT_PRICE} founder offer</button>
        </form>}
      {row.kind==="founder"&&row.decision==="invite"&&row.founder_offer_confirmed_at&&<div>
        <p>Confirmed {FOUNDER_BLUEPRINT_PRICE} Blueprint. Verify the signed-in candidate’s account email, check for an existing invoice, and issue a private customer-specific invoice only. Never share a publicly redeemable code.</p>
        {row.founder_offer_invoice_reference?<p>Staff recorded invoice: {row.founder_offer_invoice_reference}</p>:<form onSubmit={recordInvoice}>
          <label>Existing Stripe invoice reference <input name="invoiceReference" placeholder="in_…" required pattern="in_[A-Za-z0-9]{8,100}"/></label>
          <button disabled={busy}>Record private invoice reference</button>
        </form>}
      </div>}
      {row.decision==="pending"&&<div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <button disabled={busy} onClick={()=>decide(row.kind,"invite")}>{row.kind==="placement"?"Invite a conversation":"Invite to discuss an offer"}</button>
        <button disabled={busy} onClick={()=>decide(row.kind,"closed")}>Close review</button>
      </div>}
    </article>)}
  </section>;
}
