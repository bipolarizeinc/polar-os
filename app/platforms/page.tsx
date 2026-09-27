import Link from "next/link";
import { MarketingShell } from "../components/MarketingShell";

const platforms = [
  { number:"01", name:"Blueprint Extraction", status:"PUBLIC / ACTIVE", description:"P.O.L.A.R. extracts founder intelligence from the raw version of an idea, analyzes clarity and readiness, identifies contradictions and risks, and routes the work into the appropriate BPEI build path.", href:"/intake", action:"START EXTRACTION" },
  { number:"02", name:"ETSA™", status:"PILOT / ACTIVE", description:"Enterprise Talent & Skills Alignment turns assessment responses and applied challenges into a versioned talent profile with competency evidence, department alignment, readiness signals, development priorities, and human-review checkpoints.", href:"/etsa", action:"ENTER ETSA™" },
  { number:"03", name:"Client Operations", status:"AUTHENTICATED", description:"The secure client layer connects accounts to the dashboard, portal, assessment history, Blueprint work, services, support, and future BPEI operating modules.", href:"/welcome?next=/dashboard", action:"ENTER CLIENT OPERATIONS" },
];

export default function PlatformsPage() {
  return <MarketingShell>
    <section className="parity-page-hero">
      <div className="parity-page-hero-image flagship-network"/>
      <div className="parity-gridlines"/>
      <div className="parity-page-hero-copy">
        <div className="parity-status"><i/> PRODUCT SYSTEMS ONLINE</div>
        <p className="parity-eyebrow">BPEI OPERATING PLATFORMS</p>
        <h1>THE SITE IS THE FRONT DOOR.<br/><em>THE PLATFORMS DO THE WORK.</em></h1>
        <p>These are not decorative destinations. They are the functional product layer behind the BI POLARIZE experience.</p>
      </div>
    </section>
    <section className="parity-journey-grid">
      {platforms.map((platform)=><Link className="parity-journey-card" key={platform.number} href={platform.href}>
        <span>{platform.number}</span><p>{platform.status}</p><h2>{platform.name}</h2><small>{platform.description}</small><b>{platform.action} →</b>
      </Link>)}
    </section>
    <section className="parity-sequence">
      <span>PRODUCT LOGIC</span><b>EXTRACT → ASSESS → ARCHITECT → BUILD → OPERATE</b>
      <p>Public visitors can explore the system. Authenticated customers get operating access. Each platform is designed to produce a real artifact, record, route, or next action rather than another pretty dead end.</p>
    </section>
  </MarketingShell>;
}
