import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getEtsaUser } from "@/app/lib/etsa/auth";
import { etsaRest } from "@/app/lib/etsa/data";
import { getPaidEtsaEntitlement } from "@/app/lib/etsa/entitlements";
import styles from "../etsa.module.css";

export default async function EtsaUnlockPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }){
  const store=await cookies();
  const token=store.get("etsa_access")?.value;
  if(!token) redirect("/etsa/login?mode=login&next=/etsa/unlock");

  let eligible = false;
  let unlocked = false;
  try {
    const user=await getEtsaUser(token);
    const sessions=await etsaRest<Array<{id:string;status:string}>>(
      `etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id,status`,
      token,
    );
    const reassessment = sessions[1];
    eligible = Boolean(reassessment && reassessment.status === "COMPLETE");
    if (eligible) unlocked = Boolean(await getPaidEtsaEntitlement(user.id, reassessment.id));
  } catch {
    redirect("/etsa/login?mode=login&next=/etsa/unlock");
  }

  if (!eligible) redirect("/etsa/results");
  if (unlocked) redirect("/etsa/results");
  const checkout = (await searchParams).checkout;

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Reassessment Upgrade</div>
    <h1 className={styles.title}>Unlock your updated ETSA package.</h1>
    <div className={styles.card}>
      <div className={styles.resultHero}>
        <span className={styles.sectionLabel}>REASSESSMENT COMPLETE</span>
        <strong>Your updated talent intelligence is already calculated.</strong>
        <p className={styles.notice}>Your second ETSA assessment is retained in your account. Payment unlocks the updated candidate talent profile and corresponding reassessment paperwork, including competency results, department alignment, readiness classification, development priorities, and the versioned reassessment record.</p>
      </div>
      {checkout === "success" && <p className={styles.notice}>Payment received. Stripe is confirming your access now; refresh this page in a moment if your report does not open automatically.</p>}
      {checkout === "cancelled" && <p className={styles.notice}>Checkout was cancelled. Your reassessment remains saved and locked.</p>}
      {(checkout === "error" || checkout === "unavailable") && <p className={styles.error}>Secure checkout is temporarily unavailable. Your reassessment remains safely saved.</p>}
      <div className={styles.actions}>
        <form action="/api/etsa/checkout" method="post"><button className={styles.button} type="submit">UNLOCK WITH SECURE CHECKOUT</button></form>
        <Link className={styles.secondary} href="/etsa/results">BACK TO RESULTS</Link>
      </div>
      <p className={styles.muted}>Payment is handled by Stripe. Access is granted only after Stripe verifies the payment through the secure server webhook.</p>
    </div>
  </div></main>;
}
