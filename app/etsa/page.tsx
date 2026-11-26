import Link from "next/link";
import { referralsEnabled } from "../lib/etsa/referral-gate";
import { Discovery } from "./Discovery";
import styles from "./product.module.css";

const process = [
  ["01","Describe how you work","Structured questions capture how you approach responsibility, judgment, collaboration, and unfamiliar problems."],
  ["02","Show your reasoning","Applied challenges give reviewers examples of how you think through a situation, beyond what a résumé or self-rating can show."],
  ["03","See what the evidence supports","A reviewer calibrates the written challenges. Your report separates demonstrated strengths, possible alignments, development priorities, and evidence confidence."],
];
const deliverables=[
  ["Your talent profile","Eight capability dimensions, supported strengths, and a current readiness signal."],
  ["Role-alignment hypotheses","Possible work lanes to explore and verify in conversation, not a claim that you qualify for a specific job."],
  ["A development priority","One next capability to strengthen and a versioned baseline to compare with a future assessment."],
];

export default function EtsaPage(){
  return <main className={styles.product}>
    <header className={styles.nav}><Link href="/etsa">ETSA<span>™</span></Link><nav aria-label="ETSA product"><a href="#method">Method</a><a href="#report">Your report</a><a href="#discovery">Start</a></nav><Link href="/">BI POLARIZE</Link></header>
    <section className={styles.hero}><div><span className={styles.kicker}>Enterprise Talent & Skills Alignment System</span><h1>Show what<br/>you can <em>do.</em></h1><p>ETSA turns your answers and work-style challenges into a talent profile you can use to decide what to pursue, develop, or discuss with a reviewer.</p><a href="#discovery" className={styles.primary}>FIND YOUR STARTING POINT</a></div><div className={styles.art} role="img" aria-label="BI POLARIZE ETSA visual identity"/></section>
    <div className={styles.metrics}><span><b>70</b> assessment items</span><span><b>8</b> talent dimensions</span><span><b>Human</b> review of applied evidence</span></div>
    <section className={styles.section} id="method"><p className={styles.kicker}>The method</p><h2>From answers to evidence.</h2><div className={styles.cards}>{process.map(([n,title,description])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className={styles.section} id="report"><p className={styles.kicker}>The delivery</p><h2>Know what to do next.</h2><div className={styles.cards}>{deliverables.map(([title,description])=><article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div><p className={styles.note}>A profile makes the evidence easier to discuss. It is not a hiring decision, qualification, personality diagnosis, or guarantee of placement. Lower confidence means more evidence is needed, not that a candidate is less capable.</p></section>
    <section className={styles.section} id="discovery"><p className={styles.kicker}>Start here</p><h2>Where do you want to take your skills?</h2><Discovery placementEnabled={referralsEnabled()}/></section>
    <section className={styles.section}><p className={styles.kicker}>For founders and organizations</p><h2>Build the thing, not just the profile.</h2><p>ETSA maps what you can demonstrate today. The Bipolarized Blueprint™ turns a venture idea into a clear offer, operating model, and execution plan. Neither product requires purchasing the other.</p><div className={styles.related}><Link href="/flagships/blueprint">Explore the Bipolarized Blueprint™</Link><Link href="/intake/start?service=ETSA%E2%84%A2%20Talent%20Alignment&source=etsa-platform">Discuss ETSA for your organization</Link><a href="/brand/etsa/etsa-platform-dna-v2.webp">View ETSA Platform DNA poster</a><a href="/brand/etsa/etsa-platform-dna-employer.webp">ETSA Platform DNA: Employer Edition</a></div></section>
  </main>;
}
