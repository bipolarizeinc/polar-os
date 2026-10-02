import Link from "next/link";
import styles from "./etsa.module.css";

const architecture = [
  ["01", "TALENT INVENTORY", "Capability evidence across strategic, creative, technical, execution, communication, commercial, leadership, and adaptive dimensions."],
  ["02", "BEHAVIORAL ALIGNMENT", "Structured signals about how responsibility, collaboration, judgment, and operating conditions fit together."],
  ["03", "APPLIED CHALLENGES", "Real problem-solving prompts that create evidence beyond self-description and personality labels."],
  ["04", "EVIDENCE CONFIDENCE", "Results are versioned with confidence signals and human review where the evidence requires calibration."],
];

export default function EtsaPage(){
  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>BI POLARIZE ENTERPRISES, INC. • FLAGSHIP INTELLIGENCE PLATFORM</div>
    <h1 className={styles.title}>ETSA™</h1>
    <p className={styles.lead}>Enterprise Talent & Skills Alignment is BPEI&apos;s evidence-centered talent intelligence platform. It combines structured assessment, applied problem-solving, department alignment, readiness signals, and human review into a versioned candidate profile.</p>

    <div className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.metric}><strong>70</strong><span>assessment items</span></div>
        <div className={styles.metric}><strong>8</strong><span>core talent dimensions</span></div>
        <div className={styles.metric}><strong>9</strong><span>BPEI department alignments</span></div>
      </div>
      <div className={styles.divider}/>
      <p className={styles.sectionLabel}>WHAT ETSA ACTUALLY DOES</p>
      <div className={styles.platformGrid}>
        {architecture.map(([number,title,copy])=><article className={styles.platformCard} key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}
      </div>
      <div className={styles.divider}/>
      <div className={styles.resultHero}>
        <span className={styles.sectionLabel}>THE OPERATING LOOP</span>
        <strong>ASSESS → EVIDENCE → ALIGN → REVIEW → DEVELOP</strong>
        <p className={styles.notice}>ETSA is designed as an operating system for talent evidence, not a personality quiz. It does not make autonomous final employment decisions. Applied challenges can require human calibration during the pilot, and candidate records remain versioned for reassessment.</p>
      </div>
      <div className={styles.actions}>
        <Link className={styles.button} href="/etsa/notice">ENTER ETSA™</Link>
        <Link className={styles.secondary} href="/intake?service=ETSA%E2%84%A2%20Talent%20Alignment&source=etsa-platform">DISCUSS ETSA FOR YOUR ORGANIZATION</Link>
        <Link className={styles.secondary} href="/platforms">VIEW ALL PLATFORMS</Link>
      </div>
    </div>
  </div></main>;
}
