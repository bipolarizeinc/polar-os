import { getIndustryEvidence } from "../lib/etsa/career-evidence";
import styles from "./product.module.css";

export function CareerEvidence({industry}:{industry:unknown}){
  const guide=getIndustryEvidence(industry);
  if(!guide||typeof industry!=="string")return null;
  return <section className={styles.evidence} aria-label="Career exploration guide">
    <p className={styles.kicker}>Career exploration · {industry}</p>
    <h3>Try one real-world task.</h3>
    <dl>
      <div><dt>Practice sample</dt><dd>{guide.workSample}</dd></div>
      <div><dt>Evidence to look for</dt><dd>{guide.lookFor}</dd></div>
      <div><dt>Next step</dt><dd>{guide.nextStep}</dd></div>
    </dl>
    <p>These are practice ideas, not ETSA scores, screening criteria, or proof that you qualify for a role or license. BPEI organized these examples using the <a href="https://www.onetcenter.org/content.html">O*NET Content Model</a> as a framework; O*NET did not validate these examples or ETSA.</p>
  </section>;
}
