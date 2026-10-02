"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { customerRequest } from "@/app/lib/customer-request";
import styles from "../etsa.module.css";

export default function EtsaNoticePage(){
  const router=useRouter(); const [accepted,setAccepted]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function continueAssessment(){
    if(!accepted)return; setLoading(true); setError("");
    try {
      const consent=await customerRequest("/api/etsa/consent",{method:"POST"});
      if(consent.status===401){router.replace("/welcome?mode=login&next=/etsa/notice");return;}
      if(!consent.ok){const body=await consent.json().catch(()=>({}));throw new Error(body.error||"Unable to record acknowledgment.");}
      const session=await customerRequest("/api/etsa/session",{method:"POST"});
      const body=await session.json().catch(()=>({}));
      if(!session.ok)throw new Error(body.error||"Unable to create assessment session.");
      router.push(["CREATED","IN_PROGRESS","PAUSED"].includes(body.session.status)?"/etsa/assessment":"/etsa/results");
    } catch(error){setError(error instanceof Error?error.message:"Unable to start assessment.");}
    finally {setLoading(false);}

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
