import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";
import { PolarConsole } from "./components/PolarConsole";
import { BootSequence } from "./components/BootSequence";
import { IntakeLink } from "./components/IntakeLink";
import styles from "./home.module.css";

const method = [
  [
    "01",
    "Discover",
    "P.O.L.A.R. retrieves the entire idea, contradictions included, before anything gets simplified away.",
  ],
  [
    "02",
    "Polarize",
    "He challenges the vision from opposing angles, stress-testing assumptions and exposing weak points.",
  ],
  [
    "03",
    "Architect",
    "The system converts founder intelligence into documented workflows, governance, and automation pathways.",
  ],
  [
    "04",
    "Build",
    "P.O.L.A.R. coordinates practical operations, assets, integrations, and deployment across the enterprise stack.",
  ],
  [
    "05",
    "Institutionalize",
    "The intelligence becomes a permanent enterprise asset instead of tribal knowledge trapped in one person.",
  ],
];

const products = [
  [
    "SVG-001",
    "Sav.VidzGen™",
    "Commercials, explainers, social video, branded media, and AI-assisted production systems.",
  ],
  [
    "DOC-001",
    "Dr.Docx™",
    "SOPs, policies, agreements, manuals, proposals, and enterprise knowledge systems.",
  ],
  [
    "BLP-001",
    "Blueprint™",
    "The flagship architecture system that turns founder intelligence into an executable business operating model.",
  ],
  [
    "BRF-001",
    "BrandForge™",
    "Identity engineering, visual systems, brand standards, campaigns, and production assets.",
  ],
  [
    "LCH-001",
    "LaunchPad™",
    "Formation, registration, compliance, banking readiness, and operational business setup.",
  ],
  [
    "NXS-001",
    "Nexus™",
    "AI agents, integrations, APIs, CRM systems, client portals, and workflow automation.",
  ],
  [
    "PLS-001",
    "Pulse™",
    "Dashboards, KPIs, forecasts, reporting, analytics, and executive business intelligence.",
  ],
  [
    "VLT-001",
    "Vault™",
    "Institutional memory, governed archives, knowledge graphs, version control, and asset registries.",
  ],
  [
    "CPH-001",
    "Cipher™",
    "Cybersecurity architecture, identity protection, compliance, monitoring, and digital defense.",
  ],
];

const outcomes = [
  [
    "01",
    "MAKE THE THING CLEAR",
    "Extract the real idea, audience, problem, constraints, and desired outcome without flattening what makes it original.",
  ],
  [
    "02",
    "BUILD WHAT IT NEEDS",
    "Turn the idea into positioning, documents, systems, automation, media, launch infrastructure, and measurable operations.",
  ],
  [
    "03",
    "KEEP IT FROM GETTING LOST",
    "Preserve decisions, standards, assets, and institutional context so growth does not erase the founder's intent.",
  ],
];

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
    <>
      <BootSequence />
      <PageShell>
        <section className="hero">
          <Image
            className={styles.heroPolarBackdrop}
            src="/brand/official/17_branded_environment.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-energy fire" />
          <div className="hero-energy ice" />
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span>BP-WEB-7709</span> INNOVATION INFRASTRUCTURE // P.O.L.A.R. ACTIVE
              </p>
              <h1>
                ALL THE BUSINESS
                <br />
                <em>FOR YOUR BUSINESS.</em>
              </h1>
              <p className="hero-lede">
                BI POLARIZE ENTERPRISES turns unconventional ideas into functioning
                enterprises. Bring us the thing in your head. P.O.L.A.R. helps
                extract it, pressure-test it, architect what it needs, and keep the
                intelligence connected as the business grows.
              </p>
              <div className={styles.heroPromise}>
                <span>IDEA → ARCHITECTURE</span>
                <span>ARCHITECTURE → OPERATIONS</span>
                <span>OPERATIONS → INSTITUTION</span>
              </div>
              <div className="hero-actions">
                <IntakeLink />
                <Link href="/services" className="text-action">
                  SEE WHAT WE BUILD <span>→</span>
                </Link>
              </div>
              <div className="hero-metrics">
                <div>
                  <b>24/7</b>
                  <span>P.O.L.A.R. intake</span>
                </div>
                <div>
                  <b>9</b>
                  <span>Connected divisions</span>
                </div>
                <div>
                  <b>1 CORE</b>
                  <span>Unified memory</span>
                </div>
              </div>
            </div>
            <PolarConsole />
          </div>
          <div className="scroll-cue">
            SEE HOW THE SYSTEM WORKS <span>↓</span>
          </div>
        </section>

        <div className="brand-ticker" aria-hidden="true">
          <div className="brand-ticker-track">
            {[...ticker, ...ticker].map((item, index) => (
              <span key={`${item}-${index}`}>
                <strong>◆</strong> {item}
              </span>
            ))}
          </div>
        </div>

        <section className={styles.outcomeBand} aria-label="What BI POLARIZE does">
          <div className={styles.outcomeIntro}>
            <p className="eyebrow">FROM IDEA TO FUNCTIONAL</p>
            <h2>YOU BRING THE THING. <em>WE BUILD THE SYSTEM AROUND IT.</em></h2>
            <p>
              Strategy without infrastructure dies in a folder. Infrastructure
              without the founder&apos;s intent becomes somebody else&apos;s company.
              BPEI connects both.
            </p>
          </div>
          <div className={styles.outcomeGrid}>
            {outcomes.map(([n, title, description]) => (
              <article className={styles.outcomeCard} key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.polarDirective}>
          <div className={styles.directiveImage}>
            <Image
              src="/brand/polar/full-body-master.png"
              alt="P.O.L.A.R. enterprise intelligence companion with operational holograms"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
          <div className={styles.directiveCopy}>
            <div className="section-index">P.O.L.A.R. DIRECTIVE // 01</div>
            <p className="eyebrow">THE FOUNDER IS THE SOURCE CODE</p>
            <h2>
              HE DOES NOT REPLACE
              <br />
              <em>THE VISIONARY.</em>
            </h2>
            <p>
              Most business infrastructure treats the founder as a bottleneck
              to eliminate. BI POLARIZE treats the founder as the source code.
              P.O.L.A.R. retrieves scattered thinking, protects institutional
              intent, challenges assumptions, and converts high-context
              decision-making into systems that can scale without drift.
            </p>
            <div className={styles.polarPillars}>
              <span>PROTECT</span>
              <span>GUIDE</span>
              <span>RETRIEVE</span>
              <span>BUILD</span>
            </div>
          </div>
        </section>

        <section id="products" className={styles.suiteSection}>
          <div className={styles.suiteInner}>
            <div className="section-index">LEVEL 01 // P.O.L.A.R. DIVISION NETWORK</div>
            <div className={styles.suiteHead}>
              <h2>
                ONE BUSINESS.
                <br />
                <em>ONE CONNECTED BUILD SYSTEM.</em>
              </h2>
              <div>
                <p>
                  Start with the outcome, not a shopping list. Blueprint™ maps the
                  architecture, then P.O.L.A.R. routes the work through the divisions
                  required to build it. A document can inform an automation, a brand
                  standard can govern a video, and every approved decision can remain
                  part of institutional memory.
                </p>
                <Link href="/services" className="text-action">
                  VIEW ALL CAPABILITIES <span>→</span>
                </Link>
              </div>
            </div>
            <div className={styles.suiteGrid}>
              {products.map(([code, name, description]) => {
                const featured = name === "Blueprint™";
                return (
                  <article
                    className={`${styles.productCard} ${featured ? styles.productCardFeatured : ""}`}
                    key={code}
                  >
                    <span className={styles.productCode}>
                      {code} // {featured ? "FLAGSHIP ENTRY POINT" : "P.O.L.A.R. LINKED"}
                    </span>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <Link href={featured ? "/intake" : "/services"}>
                      {featured ? "START WITH BLUEPRINT →" : "OPEN DIVISION →"}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="polar" className={styles.polarSection}>
          <div className={styles.polarInner}>
            <div className={styles.polarVisual}>
              <Image
                src="/brand/polar/deep-scan.png"
                alt="P.O.L.A.R. performing deep structural analysis"
                fill
                sizes="(max-width: 900px) 90vw, 42vw"
              />
            </div>
            <div className={styles.polarCopy}>
              <div className="section-index">LEVEL 02 // P.O.L.A.R. CORE</div>
              <p className="eyebrow">
                PERSONALIZED OPERATIONS LIAISON AND AUTONOMOUS RETRIEVER
              </p>
              <h2>
                MEMORY IS NOT A FEATURE.
                <br />
                <em>IT IS THE INFRASTRUCTURE.</em>
              </h2>
              <p>
                P.O.L.A.R. is the connective intelligence layer between what a
                founder means and what the enterprise actually does. He retrieves,
                maps, challenges, routes, and preserves context across the BPEI
                system so decisions do not disappear every time the work changes hands.
              </p>
              <div className={styles.polarStatus}>
                <span>
                  <small>MODE</small>ACTIVE GUIDANCE
                </span>
                <span>
                  <small>MEMORY</small>INSTITUTIONAL
                </span>
                <span>
                  <small>LINK</small>ALL DIVISIONS
                </span>
              </div>
              <Link href="/about" className="text-action">
                ENTER THE P.O.L.A.R. SYSTEM <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="method-section">
          <div className="section-shell">
            <div className="section-index">LEVEL 03 // BIPOLARIZATION PROTOCOL</div>
            <div className="method-head">
              <h2>
                CHAOS, ENGINEERED
                <br />
                INTO <em>CLARITY.</em>
              </h2>
              <p>
                P.O.L.A.R. does not generate before the idea is polarized, and
                he does not institutionalize until the logic holds. The five-stage
                protocol converts unconventional thinking into durable enterprise
                intelligence without simplifying away what makes it valuable.
              </p>
            </div>
            <div className="method-grid">
              {method.map(([n, t, d]) => (
                <article key={n}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.polarField}>
          <Image
            src="/brand/official/07_off_the_wall_concept.png"
            alt="BI POLARIZE Off the Wall and Out of the Box concept"
            fill
            sizes="100vw"
          />
          <div>
            <p className="eyebrow">OFF THE WALL AND OUT OF THE BOX</p>
            <h2>
              COMPLEXITY IS A FEATURE.
              <br />
              <em>NOT A BUG.</em>
            </h2>
          </div>
        </section>

        <section className="section-shell blueprint-section">
          <div className="blueprint-copy">
            <div className="section-index">LEVEL 04 // FLAGSHIP SYSTEM</div>
            <p className="eyebrow">THE BIPOLARIZED BLUEPRINT™</p>
            <h2>
              FROM FOUNDER
              <br />
              INTELLIGENCE TO
              <br />
              <em>OPERATING REALITY.</em>
            </h2>
            <p>
              The Blueprint is where a complicated idea becomes an executable
              business architecture. It defines what the enterprise is, who it is
              for, what must be built, which divisions are involved, what comes
              first, and how the original intent stays intact as execution expands.
            </p>
            <div className={styles.blueprintActions}>
              <IntakeLink />
              <Link href="/services" className="text-action">
                VIEW CAPABILITIES <span>→</span>
              </Link>
            </div>
          </div>
          <div className="blueprint-terminal">
            <div className="terminal-bar">
              <span>POLAR.BLUEPRINT.EXTRACTION</span>
              <span>● ● ●</span>
            </div>
            {[
              "Identity + positioning",
              "Business architecture",
              "Operational documentation",
              "AI-ready knowledge systems",
              "Automation pathways",
              "Revenue deployment plan",
            ].map((x, i) => (
              <div className="terminal-row" key={x}>
                <span>0{i + 1}</span>
                <b>{x}</b>
                <i>POLAR VERIFIED</i>
              </div>
            ))}
            <div className="terminal-status">
              P.O.L.A.R. SYSTEM READINESS <strong>100%</strong>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-mark">
            <Image src="/brand/bipolarization-symbol.png" alt="" fill />
          </div>
          <p className="eyebrow">P.O.L.A.R. INTAKE CHANNEL // OPEN 24 HOURS</p>
          <h2>
            TELL US ABOUT
            <br />
            <em>YOUR THING.</em>
          </h2>
          <p>
            You do not need a finished pitch deck or consultant-approved vocabulary.
            Bring the idea as it actually exists. P.O.L.A.R. will extract the signal,
            identify what is missing, and route the next move through the right BPEI system.
          </p>
          <IntakeLink />
        </section>
      </PageShell>
    </>
  );
}
