"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { discoveryKey, industries, roleFamilies, workModes } from "../lib/etsa/discovery";
import styles from "./product.module.css";

export function Discovery({placementEnabled}:{placementEnabled:boolean}){
  const router=useRouter();
  const [placement,setPlacement]=useState(false);
  function continueAssessment(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.currentTarget));
    try { sessionStorage.setItem(discoveryKey,JSON.stringify({...data,intent:placement?"placement":"explore"})); } catch { /* the assessment is still available */ }
    router.push("/etsa/notice");
  }
  return <form className={styles.discovery} onSubmit={continueAssessment}>
    <fieldset><legend>Choose your assessment path</legend><div className={styles.paths}>
      <label><input type="radio" name="path" checked={!placement} onChange={()=>setPlacement(false)}/><span><strong>Explore my strengths</strong><small>Get an evidence-based profile for your own planning.</small></span></label>
      <label><input type="radio" name="path" checked={placement} disabled={!placementEnabled} onChange={()=>setPlacement(true)}/><span><strong>BPEI Placement Assessment</strong><small>{placementEnabled?"Take ETSA, then choose whether to share your completed profile with BPEI.":"Not accepting new referrals right now. You can still take the personal assessment."}</small></span></label>
    </div></fieldset>
    <div className={styles.questions}>
      {[["industry","What industry are you exploring?",industries],["roleFamily","What kind of work do you want to do?",roleFamilies],["workMode","How would you prefer to work?",workModes]].map(([name,label,options])=><label key={String(name)}>{label}<select name={String(name)} defaultValue=""><option value="">No preference yet</option>{(options as readonly string[]).map(option=><option key={option}>{option}</option>)}</select></label>)}
    </div>
    <p>These answers orient the conversation. They don’t change your ETSA score and aren’t shared with the placement team unless you choose to share them.</p>
    <button className={styles.primary}>REVIEW THE DATA NOTICE & START <span aria-hidden="true">↗</span></button>
  </form>;
}
