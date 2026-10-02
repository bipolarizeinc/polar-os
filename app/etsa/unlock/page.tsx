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

  let eligible = false;
  try {
    const user=await getEtsaUser(token);
    const sessions=await etsaRest<Array<{id:string;status:string}>>(
      `etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id,status`,
      token,
    );
    eligible = sessions.length >= 2 && sessions[1].status === "COMPLETE";
  } catch {
    redirect("/etsa/login?mode=login&next=/etsa/unlock");
  }

  if (!eligible) redirect("/etsa/results");

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
        <Link className={styles.button} href="/contact?service=ETSA%20Reassessment">REQUEST REASSESSMENT ACCESS</Link>
        <Link className={styles.secondary} href="/etsa/results">BACK TO RESULTS</Link>
      </div>
      <p className={styles.muted}>Contact BPEI to arrange access. Online payment and automatic unlocking are not available yet. Your completed reassessment remains saved.</p>
    </div>
  </div></main>;
}
