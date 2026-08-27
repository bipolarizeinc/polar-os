import Link from "next/link";
import Image from "next/image";
import { PageShell } from "../components/SiteChrome";
import { IntakeLink } from "../components/IntakeLink";
import { servicePages } from "./service-pages";

const directServices = [
  ["launchpad", "Business Structure & Formation", "$199", "Build the legal and operational foundation around the concept."],
  ["launchpad", "State Registration & Compliance", "$149 + fees", "Registration guidance and compliance setup for a cleaner launch."],
  ["launchpad", "EIN Application Assistance", "$75", "Preparation and application support. The IRS issues EINs free; the listed amount is BPEI’s assistance fee."],
  ["launchpad", "Business Identity / D-U-N-S & UEI Guidance", "$29", "Guidance for commercial D-U-N-S profiles and federal UEI/SAM identification. Identifier issuance remains with the applicable third party or government platform."],
  ["dr-docx", "Operating Agreement / Bylaws", "$129", "Core governance documents aligned to the chosen entity."],
  ["brandforge", "Marketing Strategy Session", "$149", "A focused 60-minute positioning and promotion strategy session."],
  ["nexus", "5-Page Website", "$650", "A professional conversion-ready web presence built around the brand."],
  ["brandforge", "Logo + Branding Kit", "$199", "Core identity, color, typography, and usable brand assets."],
  ["brandforge", "Business Presence", "$249", "Coordinated setup of the essential public-facing business footprint."],
  ["launchpad", "Business Credit Development", "$399", "Structured guidance toward stronger commercial credit readiness."],
  ["blueprint", "Comprehensive Business Plan", "$499", "Research-backed plan connecting vision, market, operations, and finance."],
  ["launchpad", "Banking Solution Guidance", "$99", "Practical support selecting business banking solutions."],
  ["launchpad", "Registered Agent", "$125 / year", "Utah registered-agent coverage, subject to address, eligibility, and service-capacity confirmation before acceptance."],
  ["blueprint", "Business Coaching", "$200", "A direct 60-minute session for decisions, obstacles, and execution."],
  ["launchpad", "Annual Compliance Package", "$149", "Ongoing annual filing and compliance organization."],
] as const;

const divisions = [
  { slug: "sav-vidzgen", name: "Sav.VidzGen™", code: "SVG-001", description: "Commercials, explainers, social video, branded media, and AI-assisted production systems.", tags: ["Video", "Explainers", "Commercials", "Social Media", "AI Production"], poster: "/brand/divisions/polar/sav-vidzgen.webp" },
  { slug: "dr-docx", name: "Dr.Docx™", code: "DOC-001", description: "SOPs, policies, agreements, manuals, proposals, and enterprise knowledge systems.", tags: ["Documents", "SOPs", "Policies", "Proposals", "Knowledge Systems"], poster: "/brand/divisions/polar/dr-docx.webp" },
  { slug: "blueprint", name: "Blueprint™", code: "BLP-001", description: "Flagship business architecture that converts founder intelligence into an executable operating model.", tags: ["Architecture", "Business Plans", "Strategy", "Operations", "Flagship"], poster: "/brand/divisions/polar/blueprint.webp" },
  { slug: "brandforge", name: "BrandForge™", code: "BRF-001", description: "Identity engineering, visual systems, brand standards, campaigns, and production assets.", tags: ["Branding", "Identity", "Marketing", "Campaigns", "Creative"], poster: "/brand/divisions/polar/brandforge.webp" },
  { slug: "launchpad", name: "LaunchPad™", code: "LCH-001", description: "Formation, registration, compliance, banking readiness, and operational business setup.", tags: ["Formation", "Compliance", "EIN", "Banking", "Business Credit"], poster: "/brand/divisions/polar/launchpad.webp" },
  { slug: "nexus", name: "Nexus™", code: "NXS-001", description: "AI agents, integrations, APIs, CRM systems, websites, client portals, and workflow automation.", tags: ["AI", "Automation", "Websites", "CRM", "Integrations"], poster: "/brand/divisions/polar/nexus.webp" },
  { slug: "pulse", name: "Pulse™", code: "PLS-001", description: "Dashboards, KPIs, forecasts, reporting, analytics, and executive business intelligence.", tags: ["Analytics", "KPIs", "Forecasting", "Dashboards", "Intelligence"], poster: "/brand/divisions/polar/pulse.webp" },
  { slug: "vault", name: "Vault™", code: "VLT-001", description: "Institutional memory, governed archives, knowledge graphs, version control, and asset registries.", tags: ["Archives", "Knowledge", "Version Control", "Registers", "Institutional Memory"], poster: "/brand/divisions/polar/vault.webp" },
  { slug: "cipher", name: "Cipher™", code: "CPH-001", description: "Cybersecurity architecture, identity protection, compliance, monitoring, and digital defense.", tags: ["Security", "Identity", "Monitoring", "Compliance", "Defense"], poster: "/brand/divisions/polar/cipher.webp" },
] as const;

export default function ServicesPage() {
  return (
    <PageShell>
      <section className="page-hero services-hero">
        <Image src="/brand/divisions/polar/division-network-headquarters.webp" alt="Nine approved divisional P.O.L.A.R. agents assembled at BPEI headquarters" fill priority sizes="100vw" className="page-hero-media" />
        <div className="section-index">CAPABILITIES // SERVICE CATALOG</div>
        <p className="eyebrow">ALL THE BUSINESS FOR YOUR BUSINESS</p>
        <h1>STRUCTURE.<br />SYSTEMS. <em>MOMENTUM.</em></h1>
        <p>Focused services for founders who need real infrastructure, routed through one connected BPEI operating system.</p>
        <IntakeLink source="services-hero" />
      </section>

      <section className="section-shell catalog">
        <div className="catalog-intro">
          <div><p className="eyebrow">POPULAR SERVICE PATHS</p><h2>START WITH THE<br />OUTCOME YOU NEED.</h2></div>
          <p>These focused service pages explain scope, process, fit, and starting investment for the needs Utah founders search for most often.</p>
        </div>
        <div className="service-grid">
          {servicePages.map((page, index) => (
            <article key={page.slug}>
              <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
              <h3>{page.label}</h3>
              <p>{page.metaDescription}</p>
              <Link className="text-action" href={`/services/${page.slug}`}>VIEW SERVICE <span>→</span></Link>
            </article>
          ))}
        </div>

        <div className="catalog-intro">
          <div><p className="eyebrow">DIVISION NETWORK</p><h2>NINE DIVISIONS.<br />NINE P.O.L.A.R. IDENTITIES.</h2></div>
          <p>Each division is represented by its officially approved P.O.L.A.R., keeping the visual identity, service purpose, and intake route aligned.</p>
        </div>

        <nav aria-label="BPEI service divisions" className="service-tags">
          {divisions.map((division) => <Link key={division.slug} href={`#${division.slug}`}>{division.name}</Link>)}
        </nav>

        <div className="division-catalog">
          {divisions.map((division) => (
            <section id={division.slug} key={division.slug} className="division-service-block division-service-block-media">
              <div className="division-polar-transmission">
                <Image src={division.poster} alt={`${division.name} approved divisional P.O.L.A.R.`} fill sizes="(max-width: 880px) 100vw, 45vw" className="division-polar-profile" />
                <div className="division-transmission-label"><span>{division.name} // P.O.L.A.R.</span><span>DIVISION POLAR // ACTIVE</span></div>
              </div>
              <div className="division-service-copy">
                <div className="section-index">{division.code} // P.O.L.A.R. LINKED DIVISION</div>
                <h2>{division.name}</h2>
                <p>{division.description}</p>
                <div className="service-tags">
                  {division.tags.map((tag) => <IntakeLink key={tag} className="service-tag" division={division.slug} service={tag} source="division-tag">{tag}</IntakeLink>)}
                </div>
                <IntakeLink division={division.slug} source="division-cta">
                  <><span>START WITH {division.name.toUpperCase()}</span><span>↗</span></>
                </IntakeLink>
              </div>
            </section>
          ))}
        </div>

        <div className="catalog-intro">
          <div><p className="eyebrow">DIRECT SERVICES</p><h2>KNOWN NEED?<br />GO STRAIGHT TO IT.</h2></div>
          <p>These services have defined starting prices. Selecting one carries the exact service and division into the P.O.L.A.R. intake so the request reaches the right lane immediately.</p>
        </div>

        <div className="service-grid">
          {directServices.map(([division, name, price, description], i) => (
            <article key={name}>
              <div className="service-number">{String(i + 1).padStart(2, "0")}</div>
              <h3>{name}</h3>
              <p>{description}</p>
              <div className="service-price"><span>STARTING AT</span><b>{price}</b></div>
              <IntakeLink className="text-action" division={division} service={name} source="direct-service">
                <>{`START ${name.toUpperCase()}`} <span>→</span></>
              </IntakeLink>
            </article>
          ))}
        </div>

        <div className="blueprint-offer" id="bipolarized-blueprint">
          <div>
            <p className="eyebrow">FLAGSHIP ENGAGEMENT</p>
            <h2>THE BIPOLARIZED BLUEPRINT™</h2>
            <p>For concepts requiring research, positioning, business architecture, operational systems, knowledge extraction, and a coordinated path from raw thought to functional enterprise.</p>
          </div>
          <IntakeLink division="blueprint" service="Bipolarized Blueprint" source="flagship-offer" />
        </div>
      </section>
    </PageShell>
  );
}
