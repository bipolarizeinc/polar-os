"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../etsa.module.css";

export default function EtsaResultsPage(){
  const router=useRouter();
  const [status,setStatus]=useState("LOADING");
  const [error,setError]=useState("");
  useEffect(()=>{(async()=>{
    const response=await fetch("/api/etsa/session");
    if(response.status===401){router.replace("/etsa/login");return;}
    const body=await response.json().catch(()=>({}));
    if(!response.ok){setError(body.error||"Unable to load assessment status.");return;}
    if(!body.session){router.replace("/etsa");return;}
    setStatus(body.session.status);
  })();},[router]);

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Assessment Record</div>
    <h1 className={styles.title}>Assessment complete.</h1>
    <div className={styles.card}>
      {error?<p className={styles.error}>{error}</p>:<div className={styles.resultHero}>
        <strong>{status==="REVIEW_REQUIRED"?"Your responses are in review.":status.replaceAll("_"," ")}</strong>
        <p className={styles.notice}>ETSA v1.0 includes applied challenges that require human calibration during the internal pilot. Your original responses have been retained as a versioned assessment record. Once review is completed, your candidate-facing talent profile can include your competency pattern, strongest department alignments, readiness level, and development priorities.</p>
        <p className={styles.muted}>Assessment version: ETSA-1.0</p>
      </div>}
      <div className={styles.actions}><button className={styles.secondary} onClick={()=>router.push("/")}>RETURN TO BPEI</button></div>
    </div>
  </div></main>;
}
