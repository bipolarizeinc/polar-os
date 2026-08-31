import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";
import { IntakeLink } from "./components/IntakeLink";
import styles from "./home.module.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <PageShell>
    <section className={styles.hero}>
      <Image className={styles.heroDesktop} src="/brand/approved/BPEI_WEBSITE_HOME_HERO_APPROVED.png" alt="" fill priority sizes="100vw" />
      <Image className={styles.heroMobile} src="/brand/approved/BPEI_WEBSITE_HOME_MOBILE_APPROVED.png" alt="" fill priority sizes="100vw" />
      <div className={styles.heroShade} />
      <div className={styles.heroCopy}>
        <p className="eyebrow">INNOVATION INFRASTRUCTURE // P.O.L.A.R. ACTIVE</p>
        <h1>YOUR IDEA ISN’T TOO MUCH.<br/><em>IT’S UNDER-ARCHITECTED.</em></h1>
        <p>BI POLARIZE turns unconventional, founder-dependent ideas into structured, documented, automation-ready enterprises that can operate, grow, and pursue funding with the right structure already in place.</p>
        <div className={styles.actions}><IntakeLink /><Link href="/flagships" className="text-action">SEE THE BUILD PATH <span>→</span></Link></div>
      </div>
    </section>

    <section className={`${styles.answer} ${styles.who}`}>
      <span className={styles.index}>01 // WHO WE ARE</span>
      <div><p className="eyebrow">THE BUSINESS BEHIND THE BLUEPRINT</p><h2>WE ARE AN INNOVATION<br/><em>INFRASTRUCTURE FIRM.</em></h2></div>
      <div className={styles.answerCopy}><p>Not an agency. Not a motivational consulting studio. BI POLARIZE is the architecture lab for founders whose ideas do not fit neatly into somebody else’s template.</p><p>We protect the original vision while engineering the structure required to make it usable, fundable, repeatable, and durable.</p></div>
    </section>

    <section className={`${styles.answer} ${styles.what}`}>
      <span className={styles.index}>02 // WHAT WE DO</span>
      <div><p className="eyebrow">ALL THE BUSINESS FOR YOUR BUSINESS™</p><h2>WE TURN THE THING<br/><em>INTO A SYSTEM.</em></h2></div>
      <div className={styles.answerCopy}><p>We extract the founder intelligence, architect the operating model, build the infrastructure, engineer funding readiness, and coordinate deployment.</p><p>Five flagship engagements move the work from raw idea to functioning enterprise. Nine specialized divisions build what the Blueprint requires.</p><div className={styles.inlineLinks}><Link href="/flagships">EXPLORE FLAGSHIPS →</Link><Link href="/divisions">MEET THE DIVISIONS →</Link></div></div>
    </section>

    <section className={`${styles.answer} ${styles.why}`}>
      <span className={styles.index}>03 // WHY YOU NEED US</span>
      <div><p className="eyebrow">FOUNDERS SHOULD BE THE SOURCE CODE—NOT THE BOTTLENECK</p><h2>HUSTLE IS NOT<br/><em>INFRASTRUCTURE.</em></h2></div>
      <div className={styles.answerCopy}><p>If everything depends on what you remember, personally explain, or fix at 2 a.m., you do not own a scalable system. You own an exhausting job wearing a company logo.</p><p>We make the business less dependent on your constant presence without stripping away what makes it yours.</p></div>
    </section>

    <section className={styles.close}><p className="eyebrow">OFF THE WALL AND OUT OF THE BOX™</p><h2>BRING US THE PART<br/><em>NOBODY ELSE UNDERSTANDS.</em></h2><p>You do not need a polished pitch. You need an honest starting point.</p><IntakeLink /></section>
  </PageShell>;
}
