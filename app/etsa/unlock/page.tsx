import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getEtsaUser } from "@/app/lib/etsa/auth";
import { etsaRest } from "@/app/lib/etsa/data";
import styles from "../etsa.module.css";

export default async function EtsaUnlockPage(){
  const store=await cookies();
  const token=store.get("etsa_access")?.value;
  if(!token) redirect("/etsa/login?mode=login&next=/etsa/unlock");

  try {
    const user=await getEtsaUser(token);
    const sessions=await etsaRest<Array<{id:string;status:string}>>(
      `etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id,status`,
      token,
    );
    if(sessions.length<2) redirect("/etsa/results");
    const reassessment=sessions[1];
    if(reassessment.status!=="COMPLETE") redirect("/etsa/results");
  } catch {
    redirect("/etsa/login?mode=login&next=/etsa/unlock");
  }

  const checkoutUrl=process.env.ETSA_REASSESSMENT_PAYMENT_URL?.trim();
  const checkoutReady=Boolean(checkoutUrl);

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Reassessment Upgrade</div>
    <h1 className={styles.title}>Unlock your updated ETSA package.</h1>
    <div className={styles.card}>
      <div className={styles.resultHero}>
        <span className={styles.sectionLabel}>REASSESSMENT COMPLETE</span>
        <strong>Your updated talent intelligence is already calculated.</strong>
        <p className={styles.notice}>Your second ETSA assessment is retained in your account. Payment unlocks the updated candidate talent profile and corresponding reassessment paperwork, including competency results, department alignment, readiness classification, development priorities, and the versioned reassessment record.</p>
      </div>
      <div className={styles.actions}>
        {checkoutReady?<a className={styles.button} href={checkoutUrl}>PAY & UNLOCK ETSA REASSESSMENT</a>:<Link className={styles.button} href="/contact?service=ETSA%20Reassessment">PAY FOR ETSA REASSESSMENT</Link>}
        <Link className={styles.secondary} href="/etsa/results">BACK TO RESULTS</Link>
      </div>
      {!checkoutReady&&<p className={styles.muted}>Secure checkout is being connected. Your completed reassessment remains saved and will not be lost.</p>}
    </div>
  </div></main>;
}
