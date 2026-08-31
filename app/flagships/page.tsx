import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/SiteChrome";
import { flagships } from "../brand-data";
import styles from "../marketing-pages.module.css";

export const metadata: Metadata = { title: "Flagship Business Build Path", description: "Five BI POLARIZE flagship engagements from Idea Extraction through Enterprise Deployment.", alternates: { canonical: "/flagships" } };

export default function FlagshipsPage(){return <PageShell><section className={styles.hero}><video className={styles.heroVideo} autoPlay muted loop playsInline preload="none" poster="/brand/approved/POLAR_INTERFACE_PROJECTION.png" aria-hidden="true"><source src="/media/polar-intro.mp4" type="video/mp4"/>Your browser does not support background video.</video><div className={styles.heroShade}/><div className={styles.heroCopy}><p className="eyebrow">FIVE FLAGSHIP ENGAGEMENTS</p><h1>FROM RAW IDEA<br/><em>TO OPERATING REALITY.</em></h1><p>Each flagship solves a different stage of the same problem: turning founder intelligence into an enterprise that can function beyond the founder’s head.</p></div></section><section className={styles.journey}>{flagships.map((item)=><Link className={styles.journeyCard} key={item.slug} href={`/flagships/${item.slug}`}><span>{item.step}</span><p>{item.eyebrow}</p><h2>{item.name}</h2><small>OPEN FLAGSHIP →</small></Link>)}</section><section className={styles.sequence}><span>REALISTIC ORDER</span><b>EXTRACTION → BLUEPRINT → BUILDOUT → FUNDING READINESS → DEPLOYMENT</b><p>Funding readiness is engineered throughout the process. The formal funding ask happens when the structure, story, numbers, and use-of-capital plan can survive scrutiny.</p></section></PageShell>}
