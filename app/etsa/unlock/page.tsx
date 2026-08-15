import Link from "next/link";
import styles from "../etsa.module.css";

export default function EtsaUnlockPage(){
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
