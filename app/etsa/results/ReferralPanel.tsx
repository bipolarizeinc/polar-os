"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { customerRequest } from "@/app/lib/customer-request";
import { discoveryKey, industries, roleFamilies, workModes } from "@/app/lib/etsa/discovery";
import { BPEI_SMS_URL, FOUNDER_BLUEPRINT_PRICE } from "@/app/lib/etsa/founder-offer";
import styles from "../etsa.module.css";

type Kind="placement"|"founder";
type Choice="as-soon-as-available"|"schedule";
type Referral={assessment_id:string;kind:Kind;decision:"pending"|"invite"|"closed"|"withdrawn";contact_choice:Choice|null;requested_time:string|null;requested_timezone:string|null;founder_offer_confirmed_at?:string|null};
type Intent={intent?:string;industry?:string;roleFamily?:string;workMode?:string};

export function ReferralPanel(){
  const [enabled,setEnabled]=useState(false);
  const [rows,setRows]=useState<Referral[]>([]);
  const [choice,setChoice]=useState<Kind|null>(null);
  const [intent,setIntent]=useState<Intent>({});
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  useEffect(()=>{
    try { const saved=sessionStorage.getItem(discoveryKey); if(saved)setIntent(JSON.parse(saved)); } catch { /* optional */ }
    customerRequest("/api/etsa/referral").then(async response=>{
      if(response.ok){const body=await response.json();setRows(body.referrals??[]);setEnabled(body.enabled===true);}
    }).catch(()=>{});
  },[]);

  async function request(method:"POST"|"PATCH"|"DELETE",payload:Record<string,unknown>){
    setBusy(true);setNotice("");setError("");
    try{
      const response=await customerRequest("/api/etsa/referral",{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error||"Could not save this request.");
      if(method==="DELETE"){setRows(prev=>prev.map(row=>row.kind===payload.kind?{...row,decision:"withdrawn"}:row));setNotice("Referral withdrawn. BPEI no longer has access to the shared referral details in this queue.");return;}
      setRows(body.referrals??[]);
      setChoice(null);
      setNotice(method==="POST"?"Your request is in the secure BPEI review queue.":"Preference saved. This is not a booking or a promise of immediate availability.");
      if(method==="POST"){try{sessionStorage.removeItem(discoveryKey);}catch{/* optional */}}
    }catch(err){setError(err instanceof Error?err.message:"Could not save this request.");}
    finally{setBusy(false);}
  }

  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!choice)return;
    const form=new FormData(event.currentTarget);
    void request("POST",{kind:choice,consent:form.get("consent")==="on",...Object.fromEntries(["industry","roleFamily","workMode"].map(field=>[field,form.get(field)||undefined]))});
  }

  const placement=rows.find(x=>x.kind==="placement");
  const founder=rows.find(x=>x.kind==="founder");
  return <section className={styles.resultHero}>
    <span className={styles.sectionLabel}>YOU CONTROL SHARING</span>
    <h2>Choose what happens after your report.</h2>
    <p className={styles.notice}>Your personal profile is separate from BPEI placement or a venture consultation. No referral is created unless you explicitly share it. A reviewer checks role requirements and evidence before inviting a conversation.</p>
    {intent.intent==="placement"&&!placement&&<p className={styles.muted}>You selected BPEI Placement Assessment. Share your report below if you want to continue that path.</p>}
    {!enabled&&<p className={styles.muted}>Placement and founder-offer referrals are not accepting new requests right now.</p>}
    {enabled&&<div className={styles.actions}>
      {!placement&&<button className={styles.button} onClick={()=>setChoice("placement")}>REQUEST BPEI PLACEMENT REVIEW</button>}
      {!founder&&<button className={styles.secondary} onClick={()=>setChoice("founder")}>REQUEST FOUNDER OFFER REVIEW</button>}
    </div>}
    {!!placement&&<p className={styles.notice}>Placement review: {placement.decision==="invite"?"A BPEI reviewer invited you to talk.":placement.decision==="withdrawn"?"Withdrawn.":placement.decision==="closed"?"Review closed. This does not determine eligibility for any role.":"Awaiting human review."}</p>}
    {enabled&&placement?.decision==="invite"&&<div className={styles.actions}>
      <a className={styles.button} href={BPEI_SMS_URL}>SEND SMS MESSAGE NOW!</a>
      <p className={styles.muted}>Opens your text messaging app. Nothing is sent until you press Send.</p>
      <form onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);void request("PATCH",{kind:"placement",choice:"schedule",preferredTime:form.get("preferredTime"),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone});}}>
        <label>Preferred time (your local time) <input type="datetime-local" name="preferredTime" required/></label>
        <button className={styles.secondary} disabled={busy}>REQUEST A BETTER TIME</button>
      </form>
      {placement.contact_choice==="schedule"&&<p className={styles.muted}>You asked BPEI to coordinate a time. No appointment has been booked.</p>}
    </div>}
    {!!founder&&<p className={styles.notice}>Founder offer: {founder.decision==="invite"?(founder.founder_offer_confirmed_at?`A BPEI reviewer confirmed your ${FOUNDER_BLUEPRINT_PRICE} Bipolarized Blueprint™ offer. Contact the team to request your private invoice using this account’s email. This offer is not applied at public checkout.`:"A BPEI reviewer invited you to discuss a Blueprint offer. No discounted price has been confirmed."):founder.decision==="withdrawn"?"Withdrawn.":founder.decision==="closed"?"Review closed.":"Awaiting human review. No discount is applied automatically."}</p>}
    {founder?.decision==="invite"&&founder.founder_offer_confirmed_at&&<Link className={styles.secondary} href="/contact?service=ETSA%20Founder%20Offer">CONTACT BPEI ABOUT MY PRIVATE INVOICE</Link>}
    {rows.filter(row=>row.decision!=="withdrawn").map(row=><button key={row.kind} className={styles.secondary} disabled={busy} onClick={()=>void request("DELETE",{kind:row.kind,assessmentId:row.assessment_id})}>WITHDRAW {row.kind==="placement"?"PLACEMENT REQUEST":"FOUNDER OFFER REQUEST"}</button>)}
    <p className={styles.muted}>Building a venture? <Link href="/flagships/blueprint">Explore the Bipolarized Blueprint™</Link></p>
    {choice&&<form onSubmit={submit} key={choice}>
      <h3>{choice==="placement"?"BPEI placement review":"Founder offer review"}</h3>
      <div className={styles.grid}>{([["industry","Industry",industries],["roleFamily","Role family",roleFamilies],["workMode","Preferred working arrangement",workModes]] as const).map(([field,label,options])=><label key={field}>{label}<select name={field} defaultValue={intent[field]??""}><option value="">No preference yet</option>{options.map(item=><option key={item}>{item}</option>)}</select></label>)}</div>
      <label className={styles.check}><input type="checkbox" name="consent" required/><span>I agree to share this finalized ETSA profile, my account email, and these preferences with authorized BPEI reviewers for {choice==="placement"?"placement review":"founder offer review"}. This does not guarantee a role or discount.</span></label>
      <button className={styles.button} disabled={busy}>SHARE FOR HUMAN REVIEW</button>
    </form>}
    {notice&&<p role="status" className={styles.notice}>{notice}</p>}
    {error&&<p role="alert" className={styles.error}>{error}</p>}
  </section>;
}
