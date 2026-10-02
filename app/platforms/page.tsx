import Image from "next/image";
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
    <section className="parity-polar-functions" aria-labelledby="polar-functions-title">
      <div className="parity-polar-functions-head">
        <p className="parity-eyebrow">P.O.L.A.R. // OPERATING PRESENCE</p>
        <h2 id="polar-functions-title">ONE INTELLIGENCE.<br/><em>THREE CUSTOMER FUNCTIONS.</em></h2>
        <p>P.O.L.A.R. is not decorative brand chrome. It protects the operating environment, analyzes founder input, and guides each customer toward a real next action.</p>
      </div>
      <div className="parity-polar-functions-grid">
        <Link href="/welcome?next=/dashboard">
          <figure><Image src="/brand/approved/POLAR_FACILITY_GUARDIAN_APPROVED.jpg" alt="P.O.L.A.R. guarding the BI POLARIZE operating environment" fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>
          <span>01 // PROTECT</span><h3>Secure Client Operations</h3><p>Enter the authenticated dashboard, portal, assessment history, and Blueprint workspace.</p><b>OPEN CLIENT ACCESS →</b>
        </Link>
        <Link href="/intake">
          <figure><Image src="/brand/approved/POLAR_HOLOGRAPHIC_SYSTEMS_APPROVED.jpg" alt="P.O.L.A.R. analyzing business intelligence and system data" fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>
          <span>02 // ANALYZE</span><h3>Extract the Real Idea</h3><p>Turn scattered founder knowledge into a saved analysis, routing decision, and Blueprint starting point.</p><b>START BLUEPRINT EXTRACTION →</b>
        </Link>
        <Link href="/contact">
          <figure><Image src="/brand/approved/POLAR_HOLOGRAPHIC_PORTRAIT_APPROVED.png" alt="P.O.L.A.R. enterprise intelligence companion" fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>
          <span>03 // GUIDE</span><h3>Find the Right Build Lane</h3><p>Bring the raw version of the problem and let BPEI route it to the right platform, flagship, or division.</p><b>TELL US ABOUT YOUR THING™ →</b>
        </Link>
      </div>
    </section>
  </MarketingShell>;
}
