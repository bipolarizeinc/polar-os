import Link from "next/link";
import styles from "./etsa.module.css";

export default function EtsaPage(){
  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>BI POLARIZE ENTERPRISES, INC. • Identify Your Thing™</div>
    <h1 className={styles.title}>ETSA™</h1>
    <p className={styles.lead}>Enterprise Talent & Skills Alignment identifies where your capabilities can create the greatest value, what responsibility you can handle now, and where focused development can take you next.</p>
    <div className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.metric}><strong>70</strong><span>assessment items</span></div>
        <div className={styles.metric}><strong>8</strong><span>core talent dimensions</span></div>
        <div className={styles.metric}><strong>9</strong><span>BPEI department alignments</span></div>
      </div>
      <p className={styles.notice}>ETSA is not a personality quiz and does not make autonomous employment decisions. Your customer account already secures this session, so you can move directly into the ETSA acknowledgment and assessment flow.</p>
      <div className={styles.actions}><Link className={styles.button} href="/etsa/notice">START ETSA ASSESSMENT</Link><Link className={styles.secondary} href="/portal">BACK TO CUSTOMER PORTAL</Link></div>
    </div>
  </div></main>;
}
