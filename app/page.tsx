import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";
import { PolarConsole } from "./components/PolarConsole";
import { IntakeLink } from "./components/IntakeLink";
import { DeferredVideo } from "./components/DeferredVideo";
import styles from "./home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const method = [
  ["01", "Idea Extraction", "We pull the raw brilliance out of your vision before simplifying anything away."],
  ["02", "Concept Polarization", "We challenge, refine, and examine the idea from opposing angles for maximum clarity."],
  ["03", "System Architecture", "We design the structural framework, workflows, governance, and connected systems that make it real."],
  ["04", "Blueprint Engineering", "We build the operational plan, systems, documentation, and strategy required for execution."],
  ["05", "Deployment", "We launch, optimize, and connect the enterprise infrastructure so the work can operate and grow."],
] as const;

const products = [
  ["SVG-001", "Sav.VidzGen™", "sav-vidzgen", "Commercials, explainers, social video, branded media, and AI-assisted production systems."],
  ["DOC-001", "Dr.Docx™", "dr-docx", "SOPs, policies, agreements, manuals, proposals, and enterprise knowledge systems."],
  ["BLP-001", "Blueprint™", "blueprint", "The flagship architecture system that turns founder intelligence into an executable business operating model."],
  ["BRF-001", "BrandForge™", "brandforge", "Identity engineering, visual systems, brand standards, campaigns, and production assets."],
  ["LCH-001", "LaunchPad™", "launchpad", "Formation, registration, compliance, banking readiness, and operational business setup."],
  ["NXS-001", "Nexus™", "nexus", "AI agents, integrations, APIs, CRM systems, client portals, and workflow automation."],
  ["PLS-001", "Pulse™", "pulse", "Dashboards, KPIs, forecasts, reporting, analytics, and executive business intelligence."],
  ["VLT-001", "Vault™", "vault", "Institutional memory, governed archives, knowledge graphs, version control, and asset registries."],
  ["CPH-001", "Cipher™", "cipher", "Cybersecurity architecture, identity protection, compliance, monitoring, and digital defense."],
] as const;

const outcomes = [
  ["01", "MAKE THE THING CLEAR", "Extract the real idea, audience, problem, constraints, and desired outcome without flattening what makes it original."],
  ["02", "BUILD WHAT IT NEEDS", "Turn the idea into positioning, documents, systems, automation, media, launch infrastructure, and measurable operations."],
  ["03", "KEEP IT FROM GETTING LOST", "Preserve decisions, standards, assets, and institutional context so growth does not erase the founder's intent."],
] as const;

const ticker = [
  "BI POLARIZE ENTERPRISES, INC.",
  "ALL THE BUSINESS FOR YOUR BUSINESS",
  "P.O.L.A.R. ACTIVE",
  "THE FOUNDER IS THE SOURCE CODE",
  "OFF THE WALL AND OUT OF THE BOX",
  "TURN IDEAS INTO INSTITUTIONS",
];

export default function Home() {
  return (
    <PageShell>
        <section className="hero">
          <Image className={`${styles.heroPolarBackdrop} ${styles.heroDesktopBackdrop}`} src="/brand/approved/BPEI_WEBSITE_HOME_HERO_APPROVED.png" alt="" fill priority sizes="100vw" />
          <Image className={`${styles.heroPolarBackdrop} ${styles.heroMobileBackdrop}`} src="/brand/approved/BPEI_WEBSITE_HOME_MOBILE_APPROVED.png" alt="" fill priority sizes="100vw" />
          <div className="hero-energy fire" />
          <div className="hero-energy ice" />
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span>BP-WEB-7709</span> INNOVATION INFRASTRUCTURE // P.O.L.A.R. ACTIVE</p>
              <h1>ALL THE BUSINESS<br /><em>FOR YOUR BUSINESS.</em></h1>
              <p className="hero-lede">BI POLARIZE ENTERPRISES turns unconventional ideas into functioning enterprises. Bring us the thing in your head. P.O.L.A.R. helps extract it, pressure-test it, architect what it needs, and keep the intelligence connected as the business grows.</p>
              <div className={styles.heroPromise}><span>IDEA → ARCHITECTURE</span><span>ARCHITECTURE → OPERATIONS</span><span>OPERATIONS → INSTITUTION</span></div>
              <div className="hero-actions">
                <IntakeLink />
                <Link href="/services" className="text-action">SEE WHAT WE BUILD <span>→</span></Link>
              </div>
              <div className="hero-metrics">
                <div><b>24/7</b><span>P.O.L.A.R. intake</span></div>
                <div><b>9</b><span>Connected divisions</span></div>
                <div><b>1 CORE</b><span>Unified memory</span></div>
              </div>
            </div>
            <PolarConsole />
          </div>
          <div className="scroll-cue">SEE HOW THE SYSTEM WORKS <span>↓</span></div>
        </section>

        <div className="brand-ticker" aria-hidden="true"><div className="brand-ticker-track">
          {[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}><strong>◆</strong> {item}</span>)}
        </div></div>

        <section id="how-it-works" className={styles.outcomeBand} aria-label="How BI POLARIZE works">
          <div className={styles.outcomeIntro}>
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>YOU BRING THE THING. <em>WE BUILD THE SYSTEM AROUND IT.</em></h2>
            <p>Tell us what you are building, fixing, or launching. We identify what it actually needs, route the work through the right BPEI divisions, and build usable business infrastructure around the original vision.</p>
          </div>
          <div className={styles.outcomeGrid}>{outcomes.map(([n, title, description]) => (
            <article className={styles.outcomeCard} key={n}><span>{n}</span><h3>{title}</h3><p>{description}</p></article>
          ))}</div>
        </section>

        <section className={styles.polarDirective}>
          <div className={styles.directiveImage}><Image src="/brand/approved/POLAR_INTERFACE_PROJECTION.png" alt="P.O.L.A.R. projecting an enterprise interface" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
          <div className={styles.directiveCopy}>
            <div className="section-index">P.O.L.A.R. DIRECTIVE // 01</div>
            <p className="eyebrow">THE FOUNDER IS THE SOURCE CODE</p>
            <h2>HE DOES NOT REPLACE<br /><em>THE VISIONARY.</em></h2>
            <p>Most business infrastructure treats the founder as a bottleneck to eliminate. BI POLARIZE treats the founder as the source code. P.O.L.A.R. retrieves scattered thinking, protects institutional intent, challenges assumptions, and converts high-context decision-making into systems that can scale without drift.</p>
            <div className={styles.polarPillars}><span>PROTECT</span><span>GUIDE</span><span>RETRIEVE</span><span>BUILD</span></div>
          </div>
        </section>

        <section className={styles.transitionBand} aria-label="P.O.L.A.R. division transition">
          <DeferredVideo src="/media/polar/02_Products_Transition.mp4" poster="/brand/approved/POLAR_DEEP_SCAN_ANALYSIS.png" />
          <div><span>P.O.L.A.R. ROUTING</span><strong>ENTERING DIVISION NETWORK</strong></div>
        </section>

        <section id="products" className={styles.suiteSection}>
          <div className={styles.suiteInner}>
            <div className="section-index">LEVEL 01 // P.O.L.A.R. DIVISION NETWORK</div>
            <div className={styles.suiteHead}>
              <h2>ONE BUSINESS.<br /><em>ONE CONNECTED BUILD SYSTEM.</em></h2>
              <div>
                <p>Start with the outcome, not a shopping list. Blueprint™ maps the architecture, then P.O.L.A.R. routes the work through the divisions required to build it. A document can inform an automation, a brand standard can govern a video, and every approved decision can remain part of institutional memory.</p>
                <Link href="/services" className="text-action">VIEW ALL CAPABILITIES <span>→</span></Link>
              </div>
            </div>
            <div className={styles.suiteGrid}>
              {products.map(([code, name, slug, description]) => {
                const featured = slug === "blueprint";
                const href = featured
                  ? "/intake?division=blueprint&service=Bipolarized%20Blueprint&source=homepage-division"
                  : `/services#${slug}`;
                return (
                  <article className={`${styles.productCard} ${featured ? styles.productCardFeatured : ""}`} key={code}>
                    <span className={styles.productCode}>{code} // {featured ? "FLAGSHIP ENTRY POINT" : "P.O.L.A.R. LINKED"}</span>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <Link
                      href={href}
                      aria-label={`Open ${name}`}
                      style={{ position: "absolute", inset: 0, zIndex: 3, marginTop: 0 }}
                    >
                      <span style={{ position: "absolute", left: 30, bottom: 30 }}>
                        {featured ? "START WITH BLUEPRINT →" : "OPEN DIVISION →"}
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="polar" className={styles.polarSection}>
          <div className={styles.polarInner}>
            <div className={styles.polarVisual}><Image src="/brand/approved/POLAR_SYSTEM_ORCHESTRATION.png" alt="P.O.L.A.R. coordinating connected enterprise systems" fill sizes="(max-width: 900px) 90vw, 42vw" /></div>
            <div className={styles.polarCopy}>
              <div className="section-index">LEVEL 02 // P.O.L.A.R. CORE</div>
              <p className="eyebrow">PERSONALIZED OPERATIONS LIAISON AND AUTONOMOUS RETRIEVER</p>
              <h2>MEMORY IS NOT A FEATURE.<br /><em>IT IS THE INFRASTRUCTURE.</em></h2>
              <p>P.O.L.A.R. is the connective intelligence layer between what a founder means and what the enterprise actually does. He retrieves, maps, challenges, routes, and preserves context across the BPEI system so decisions do not disappear every time the work changes hands.</p>
              <div className={styles.polarStatus}>
                <span><small>MODE</small>ACTIVE GUIDANCE</span>
                <span><small>MEMORY</small>INSTITUTIONAL</span>
                <span><small>LINK</small>ALL DIVISIONS</span>
              </div>
              <Link href="/about" className="text-action">ENTER THE P.O.L.A.R. SYSTEM <span>→</span></Link>
            </div>
          </div>
        </section>

        <section className={styles.identitySystem} aria-label="BI POLARIZE identity system">
          <div className={styles.identityCopy}>
            <div className="section-index">CORPORATE IDENTITY // AUTHENTICATED</div>
            <p className="eyebrow">THE BIPOLARIZATION STANDARD</p>
            <h2>BALANCING EXTREMES.<br /><em>CREATING POSSIBILITIES.</em></h2>
            <p>Fire and ice. Vision and execution. Founder intelligence and durable infrastructure. Bipolarization does not erase opposing forces—it engineers them into a system capable of producing something new.</p>
            <Link href="/about" className="text-action">EXPLORE BI POLARIZE <span>→</span></Link>
          </div>
          <div className={styles.identityGallery}>
            <figure className={styles.philosophyCard}><Image src="/brand/approved/BPEI_OFF_THE_WALL_CONCEPT_HD.png" alt="BI POLARIZE Off the Wall and Out of the Box concept" fill sizes="(max-width: 900px) 100vw, 52vw" /></figure>
            <figure><Image src="/brand/approved/BPEI_OFFICIAL_CORPORATE_SEAL_HD.png" alt="Official BI POLARIZE corporate seal" fill sizes="(max-width: 900px) 50vw, 26vw" /></figure>
            <figure><Image src="/brand/approved/BPEI_CORPORATE_FLAG_HD.png" alt="Official BI POLARIZE corporate flag" fill sizes="(max-width: 900px) 50vw, 26vw" /></figure>
          </div>
        </section>

        <section className="method-section"><div className="section-shell">
          <div className="section-index">LEVEL 03 // BIPOLARIZATION METHOD</div>
          <div className="method-head">
            <h2>FROM COMPLEX IDEA<br />TO <em>FUNCTIONING ENTERPRISE.</em></h2>
            <p>The Bipolarization Method™ protects the original idea while forcing it through the five stages required to become something that can actually operate: extraction, polarization, architecture, blueprint engineering, and deployment.</p>
          </div>
          <div className="method-grid">{method.map(([n, t, d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div></section>

        <section className={styles.polarField}>
          <Image src="/brand/approved/BPEI_OFF_THE_WALL_CONCEPT_HD.png" alt="BI POLARIZE Off the Wall and Out of the Box concept" fill sizes="100vw" />
          <div><p className="eyebrow">OFF THE WALL AND OUT OF THE BOX</p><h2>COMPLEXITY IS A FEATURE.<br /><em>NOT A BUG.</em></h2></div>
        </section>

        <section className={styles.transitionBand} aria-label="Bipolarized Blueprint transition">
          <DeferredVideo src="/media/polar/03_Blueprint_Transition.mp4" poster="/brand/approved/POLAR_BLUEPRINT_CONSTRUCTION.png" />
          <div><span>FLAGSHIP SYSTEM</span><strong>BLUEPRINT EXTRACTION READY</strong></div>
        </section>

        <section className="section-shell blueprint-section">
          <div className="blueprint-copy">
            <div className="section-index">LEVEL 04 // FLAGSHIP SYSTEM</div>
            <p className="eyebrow">THE BIPOLARIZED BLUEPRINT™</p>
            <h2>FROM FOUNDER<br />INTELLIGENCE TO<br /><em>OPERATING REALITY.</em></h2>
            <p>The Blueprint is where a complicated idea becomes an executable business architecture. It defines what the enterprise is, who it is for, what must be built, which divisions are involved, what comes first, and how the original intent stays intact as execution expands.</p>
            <div className={styles.blueprintActions}>
              <IntakeLink division="blueprint" service="Bipolarized Blueprint" source="homepage-blueprint" />
              <Link href="/services#blueprint" className="text-action">VIEW CAPABILITIES <span>→</span></Link>
            </div>
          </div>
          <div className="blueprint-terminal">
            <div className="terminal-bar"><span>POLAR.BLUEPRINT.EXTRACTION</span><span>● ● ●</span></div>
            {["Identity + positioning", "Business architecture", "Operational documentation", "AI-ready knowledge systems", "Automation pathways", "Revenue deployment plan"].map((x, i) => (
              <div className="terminal-row" key={x}><span>0{i + 1}</span><b>{x}</b><i>POLAR VERIFIED</i></div>
            ))}
            <div className="terminal-status">BLUEPRINT EXTRACTION STATUS <strong>READY</strong></div>
          </div>
        </section>

        <section className={`cta-section ${styles.videoCta}`}>
          <DeferredVideo className={styles.ctaVideo} src="/media/polar/07_Intake_Transition.mp4" poster="/brand/approved/POLAR_GREETING_ONBOARDING.png" />
          <div className="cta-mark"><Image src="/brand/bipolarization-symbol.png" alt="" fill sizes="370px" /></div>
          <p className="eyebrow">P.O.L.A.R. INTAKE CHANNEL // OPEN 24 HOURS</p>
          <h2>TELL US ABOUT<br /><em>YOUR THING.</em></h2>
          <p>A short guided intake helps us understand what you are building, what is missing, and where you need help. You do not need a finished pitch deck or consultant-approved vocabulary. Bring the idea as it actually exists.</p>
          <IntakeLink />
        </section>
    </PageShell>
  );
}