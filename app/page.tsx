import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";
import { PolarConsole } from "./components/PolarConsole";
import { IntakeLink } from "./components/IntakeLink";
import styles from "./home.module.css";

const method = [
  ["01", "Discover", "We extract the whole idea: the mess, brilliance, contradictions, context, and hidden value."],
  ["02", "Polarize", "We challenge both sides, expose weak points, and identify what deserves protection."],
  ["03", "Architect", "We engineer the documents, workflows, systems, and intelligence the vision requires."],
  ["04", "Build", "We turn the architecture into practical operations, assets, automation, and deployment paths."],
  ["05", "Institutionalize", "We preserve the intelligence so the enterprise can scale beyond any one person."],
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

const ticker = [
  "BI POLARIZE ENTERPRISES, INC.",
  "POLAR OS",
  "ENTERPRISE INTELLIGENCE",
  "SYSTEM ARCHITECTURE",
  "P.O.L.A.R. ONLINE",
  "TURN IDEAS INTO INSTITUTIONS",
];

export default function Home() {
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-energy fire" /><div className="hero-energy ice" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span>BP-WEB-7709</span> POWERED BY POLAR OS</p>
            <h1>TURN IDEAS<br /><em>INTO INSTITUTIONS.</em></h1>
            <p className="hero-lede">BI POLARIZE ENTERPRISES transforms vision into scalable enterprise infrastructure through AI, documentation, automation, and business architecture.</p>
            <div className="hero-actions">
              <IntakeLink />
              <Link href="#polar" className="text-action">MEET P.O.L.A.R. <span>→</span></Link>
            </div>
            <div className="hero-metrics">
              <div><b>24/7</b><span>System access</span></div><div><b>9</b><span>Enterprise platforms</span></div><div><b>1 OF NONE</b><span>Built for originals</span></div>
            </div>
          </div>
          <PolarConsole />
        </div>
        <div className="scroll-cue">SCROLL TO ENTER THE SYSTEM <span>↓</span></div>
      </section>

      <div className="brand-ticker" aria-hidden="true"><div className="brand-ticker-track">{[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}><strong>◆</strong> {item}</span>)}</div></div>

      <section id="products" className={styles.suiteSection}>
        <div className={styles.suiteInner}>
          <div className="section-index">01 // ENTERPRISE PRODUCT SUITE</div>
          <div className={styles.suiteHead}>
            <h2>ONE INTELLIGENCE LAYER.<br /><em>MULTIPLE WAYS TO BUILD.</em></h2>
            <p>POLAR OS powers a connected suite of platforms that document, design, automate, protect, analyze, and deploy the modern enterprise.</p>
          </div>
          <div className={styles.suiteGrid}>
            {products.map(([code, name, description]) => <article className={styles.productCard} key={code}><span className={styles.productCode}>{code}</span><h3>{name}</h3><p>{description}</p><Link href="/services">EXPLORE CAPABILITIES →</Link></article>)}
          </div>
        </div>
      </section>

      <section id="polar" className={styles.polarSection}>
        <div className={styles.polarInner}>
          <div className={styles.polarVisual}><Image src="/brand/polar-hero.png" alt="P.O.L.A.R., the BI POLARIZE enterprise intelligence companion" fill sizes="(max-width: 900px) 90vw, 42vw" /></div>
          <div className={styles.polarCopy}>
            <div className="section-index">02 // MEET P.O.L.A.R.</div>
            <p className="eyebrow">PERSONALIZED OPERATIONS LIAISON AND AUTONOMOUS RETRIEVER</p>
            <h2>THE GUIDE BETWEEN<br /><em>VISION AND EXECUTION.</em></h2>
            <p>P.O.L.A.R. is the enterprise intelligence companion behind the BI POLARIZE ecosystem. He retrieves ideas, protects institutional knowledge, guides client onboarding, and connects every platform through one governed operating intelligence.</p>
            <div className={styles.polarPillars}><span>PROTECT</span><span>GUIDE</span><span>RETRIEVE</span><span>BUILD</span></div>
            <Link href="/about" className="text-action">ENTER THE P.O.L.A.R. SYSTEM <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="method-section">
        <div className="section-shell">
          <div className="section-index">03 // THE BIPOLARIZATION METHOD</div>
          <div className="method-head"><h2>CHAOS, ENGINEERED<br />INTO <em>CLARITY.</em></h2><p>Not motivational theater. Not another polished report collecting digital dust. A disciplined method for turning original ideas into durable enterprise systems.</p></div>
          <div className="method-grid">{method.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div>
      </section>

      <section className="section-shell blueprint-section">
        <div className="blueprint-copy"><div className="section-index">04 // FLAGSHIP SYSTEM</div><p className="eyebrow">THE BIPOLARIZED BLUEPRINT™</p><h2>FROM VISION<br />TO OPERATING<br /><em>REALITY.</em></h2><p>A structured enterprise architecture that translates founder intelligence into clear, human-readable and machine-ready business infrastructure.</p><Link href="/services" className="text-action">VIEW CAPABILITIES <span>→</span></Link></div>
        <div className="blueprint-terminal"><div className="terminal-bar"><span>BLUEPRINT.EXTRACTION</span><span>● ● ●</span></div>{["Identity + positioning", "Business architecture", "Operational documentation", "AI-ready knowledge systems", "Automation pathways", "Revenue deployment plan"].map((x,i)=><div className="terminal-row" key={x}><span>0{i+1}</span><b>{x}</b><i>VERIFIED</i></div>)}<div className="terminal-status">SYSTEM READINESS <strong>100%</strong></div></div>
      </section>

      <section className="cta-section"><div className="cta-mark"><Image src="/brand/bipolarization-symbol.png" alt="" fill /></div><p className="eyebrow">TRANSMISSION OPEN // 24 HOURS</p><h2>BRING US THE<br /><em>UNFILTERED VISION.</em></h2><p>Complicated problem. Strange invention. Unfinished concept. Unconventional solution. Tell us what you see that the market has not caught up to yet.</p><IntakeLink /></section>
    </PageShell>
  );
}