"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../etsa.module.css";

export default function EtsaNoticePage(){
  const router=useRouter(); const [accepted,setAccepted]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function continueAssessment(){
    if(!accepted)return; setLoading(true); setError("");
    const consent=await fetch("/api/etsa/consent",{method:"POST"});
    if(!consent.ok){const body=await consent.json().catch(()=>({}));setError(body.error||"Unable to record acknowledgment.");setLoading(false);return;}
    const session=await fetch("/api/etsa/session",{method:"POST"});
    if(!session.ok){const body=await session.json().catch(()=>({}));setError(body.error||"Unable to create assessment session.");setLoading(false);return;}
    router.push("/etsa/assessment");
  }
  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Assessment Data Notice</div>
    <h1 className={styles.title}>Before we begin.</h1>
    <div className={styles.card}>
      <div className={styles.notice}><p>ETSA™ stores your assessment responses, progress, scores, and generated talent profile so you can complete the assessment, access your results, and participate in future reassessments.</p><p>When ETSA is used for BPEI talent evaluation, authorized BPEI personnel may review your assessment results as one source of information for talent alignment, development, placement, or related organizational decisions.</p><p><strong>ETSA does not make autonomous final employment decisions.</strong></p></div>
      <label className={styles.check}><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><span>I understand how my ETSA assessment information will be retained and used, and I agree to continue.</span></label>
      {error&&<p className={styles.error}>{error}</p>}
      <div className={styles.actions}><button className={styles.button} disabled={!accepted||loading} onClick={continueAssessment}>{loading?"SETTING UP…":"CONTINUE TO ASSESSMENT"}</button></div>
    </div>
  </div></main>;
}
