import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";
import { PolarConsole } from "./components/PolarConsole";
import { BootSequence } from "./components/BootSequence";
import { IntakeLink } from "./components/IntakeLink";
import styles from "./home.module.css";

const method = [
  ["01", "Discover", "P.O.L.A.R. retrieves the whole idea: the mess, brilliance, contradictions, context, and hidden value."],
  ["02", "Polarize", "He helps challenge both sides, expose weak points, and identify what deserves protection."],
  ["03", "Architect", "The system organizes documents, workflows, infrastructure, and intelligence around the vision."],
  ["04", "Build", "P.O.L.A.R. coordinates practical operations, assets, automation, and deployment pathways."],
  ["05", "Institutionalize", "The intelligence is preserved so the enterprise can scale beyond any one person."],
];

const products = [
  ["SVG-001", "Sav.VidzGen™", "AI video generation for commercials, reels, explainers, podcasts, and branded media."],
  ["DOC-001", "Dr.Docx™", "Enterprise documentation for SOPs, policies, agreements, manuals, proposals, and knowledge systems."],
  ["BLP-001", "Blueprint™", "Business architecture that turns founder intelligence into scalable operating infrastructure."],
  ["BRF-001", "BrandForge™", "Identity engineering, visual systems, brand standards, campaigns, and production assets."],
  ["LCH-001", "LaunchPad™", "Formation, registration, compliance, banking readiness, and operational business setup."],
  ["NXS-001", "Nexus™", "AI agents, integrations, APIs, CRM systems, client portals, and workflow automation."],
  ["PLS-001", "Pulse™", "Dashboards, KPIs, forecasts, reporting, analytics, and executive business intelligence."],
  ["VLT-001", "Vault™", "Institutional memory, governed archives, knowledge graphs, version control, and asset registries."],
  ["CPH-001", "Cipher™", "Cybersecurity architecture, identity protection, compliance, monitoring, and digital defense."],
];

const ticker = ["BI POLARIZE ENTERPRISES, INC.", "POLAR OS", "P.O.L.A.R. ACTIVE", "PROTECT · GUIDE · RETRIEVE · BUILD", "ENTERPRISE INTELLIGENCE", "TURN IDEAS INTO INSTITUTIONS"];

export default function Home() {
  return (
    <>
      <BootSequence />
      <PageShell>
        <section className="hero">
          <Image className={styles.heroPolarBackdrop} src="/brand/approved/BPEI_BRANDED_ENVIRONMENT_HD.png" alt="" fill priority sizes="100vw" />
          <div className="hero-energy fire" /><div className="hero-energy ice" />
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span>BP-WEB-7709</span> P.O.L.A.R. SYSTEM ACTIVE</p>
              <h1>TURN IDEAS<br /><em>INTO INSTITUTIONS.</em></h1>
              <p className="hero-lede">BI POLARIZE ENTERPRISES transforms vision into scalable enterprise infrastructure through P.O.L.A.R., our enterprise intelligence companion for retrieval, architecture, documentation, and deployment.</p>
              <div className="hero-actions"><IntakeLink /><Link href="#polar" className="text-action">MEET P.O.L.A.R. <span>→</span></Link></div>
              <div className="hero-metrics"><div><b>24/7</b><span>P.O.L.A.R. access</span></div><div><b>9</b><span>Connected modules</span></div><div><b>1 CORE</b><span>Unified intelligence</span></div></div>
            </div>
            <PolarConsole />
          </div>
          <div className="scroll-cue">FOLLOW P.O.L.A.R. INTO THE SYSTEM <span>↓</span></div>
        </section>

        <div className="brand-ticker" aria-hidden="true"><div className="brand-ticker-track">{[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}><strong>◆</strong> {item}</span>)}</div></div>

        <section className={styles.polarDirective}>
          <div className={styles.directiveImage}><Image src="/brand/polar/full-body-master.png" alt="P.O.L.A.R. enterprise intelligence companion with operational holograms" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
          <div className={styles.directiveCopy}><div className="section-index">P.O.L.A.R. DIRECTIVE // 01</div><p className="eyebrow">THE INTELLIGENCE BETWEEN VISION AND EXECUTION</p><h2>HE DOES NOT REPLACE<br /><em>THE VISIONARY.</em></h2><p>P.O.L.A.R. protects the founder&apos;s intent, retrieves scattered knowledge, challenges assumptions, and guides every idea toward an operating system that can survive growth.</p><div className={styles.polarPillars}><span>PROTECT</span><span>GUIDE</span><span>RETRIEVE</span><span>BUILD</span></div></div>
        </section>

        <section id="products" className={styles.suiteSection}><div className={styles.suiteInner}><div className="section-index">LEVEL 01 // P.O.L.A.R. MODULE NETWORK</div><div className={styles.suiteHead}><h2>ONE INTELLIGENCE CORE.<br /><em>MULTIPLE WAYS TO BUILD.</em></h2><p>Every BI POLARIZE platform is connected through P.O.L.A.R., giving the enterprise one consistent layer of memory, logic, guidance, and operational context.</p></div><div className={styles.suiteGrid}>{products.map(([code, name, description]) => <article className={styles.productCard} key={code}><span className={styles.productCode}>{code} // P.O.L.A.R. LINKED</span><h3>{name}</h3><p>{description}</p><Link href="/services">OPEN MODULE →</Link></article>)}</div></div></section>

        <section id="polar" className={styles.polarSection}><div className={styles.polarInner}><div className={styles.polarVisual}><Image src="/brand/polar/deep-scan.png" alt="P.O.L.A.R. performing deep structural analysis" fill sizes="(max-width: 900px) 90vw, 42vw" /></div><div className={styles.polarCopy}><div className="section-index">LEVEL 02 // P.O.L.A.R. CORE</div><p className="eyebrow">PERSONALIZED OPERATIONS LIAISON AND AUTONOMOUS RETRIEVER</p><h2>THE GUIDE BETWEEN<br /><em>VISION AND EXECUTION.</em></h2><p>P.O.L.A.R. retrieves ideas, protects institutional knowledge, guides client onboarding, connects every platform, and keeps the enterprise aligned with the original intent while the system evolves.</p><div className={styles.polarStatus}><span><small>MODE</small>ACTIVE GUIDANCE</span><span><small>MEMORY</small>INSTITUTIONAL</span><span><small>LINK</small>ALL MODULES</span></div><Link href="/about" className="text-action">ENTER THE P.O.L.A.R. SYSTEM <span>→</span></Link></div></div></section>

        <section className="method-section"><div className="section-shell"><div className="section-index">LEVEL 03 // P.O.L.A.R. BIPOLARIZATION PROTOCOL</div><div className="method-head"><h2>CHAOS, ENGINEERED<br />INTO <em>CLARITY.</em></h2><p>P.O.L.A.R. guides the work through a disciplined five-stage method that turns original thought into durable enterprise intelligence.</p></div><div className="method-grid">{method.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

        <section className={styles.polarField}><Image src="/brand/approved/BPEI_OFF_THE_WALL_CONCEPT_HD.png" alt="" fill sizes="100vw" /><div><p className="eyebrow">P.O.L.A.R. TRANSMISSION</p><h2>YOUR IDEA IS NOT TOO COMPLICATED.<br /><em>IT IS WAITING FOR ARCHITECTURE.</em></h2></div></section>

        <section className="section-shell blueprint-section"><div className="blueprint-copy"><div className="section-index">LEVEL 04 // FLAGSHIP SYSTEM</div><p className="eyebrow">THE BIPOLARIZED BLUEPRINT™</p><h2>FROM VISION<br />TO OPERATING<br /><em>REALITY.</em></h2><p>P.O.L.A.R. translates founder intelligence into clear, human-readable and machine-ready business infrastructure.</p><Link href="/services" className="text-action">VIEW CAPABILITIES <span>→</span></Link></div><div className="blueprint-terminal"><div className="terminal-bar"><span>POLAR.BLUEPRINT.EXTRACTION</span><span>● ● ●</span></div>{["Identity + positioning", "Business architecture", "Operational documentation", "AI-ready knowledge systems", "Automation pathways", "Revenue deployment plan"].map((x,i)=><div className="terminal-row" key={x}><span>0{i+1}</span><b>{x}</b><i>POLAR VERIFIED</i></div>)}<div className="terminal-status">P.O.L.A.R. SYSTEM READINESS <strong>100%</strong></div></div></section>

        <section className="cta-section"><div className="cta-mark"><Image src="/brand/bipolarization-symbol.png" alt="" fill /></div><p className="eyebrow">P.O.L.A.R. INTAKE CHANNEL // OPEN 24 HOURS</p><h2>BRING P.O.L.A.R. THE<br /><em>UNFILTERED VISION.</em></h2><p>Complicated problem. Strange invention. Unfinished concept. Unconventional solution. P.O.L.A.R. will help retrieve what matters and map what comes next.</p><IntakeLink /></section>
      </PageShell>
    </>
  );
}
