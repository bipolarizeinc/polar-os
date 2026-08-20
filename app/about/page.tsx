import Image from "next/image";
import { PageShell } from "../components/SiteChrome";

const approvedAssets = [
  ["BPEI_BRANDED_ENVIRONMENT_HD.png", "BRANDED ENVIRONMENT", true, false],
  ["BPEI_OFF_THE_WALL_CONCEPT_HD.png", "OFF THE WALL // OUT OF THE BOX", true, false],
  ["BPEI_PRIMARY_CORPORATE_LOGO_HD.png", "PRIMARY CORPORATE LOGO", false, true],
  ["BPEI_OFFICIAL_CORPORATE_SEAL_HD.png", "OFFICIAL CORPORATE SEAL", false, true],
  ["BPEI_CORPORATE_FLAG_HD.png", "CORPORATE FLAG", false, true],
  ["BPEI_BUILDING_SIGNAGE_HD.png", "BUILDING SIGNAGE", false, false],
  ["BPEI_LOBBY_INSTALLATION_HD.png", "LOBBY INSTALLATION", false, false],
  ["BPEI_POLAR_TECH_INTERFACE_HD.png", "P.O.L.A.R. TECH INTERFACE", false, false],
] as const;

export default function AboutPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="section-index">ABOUT // CORPORATE IDENTITY</div>
        <p className="eyebrow">BUILT FOR WHAT DOES NOT FIT</p>
        <h1>VISION DESERVES<br /><em>ARCHITECTURE.</em></h1>
        <p>BI POLARIZE ENTERPRISES, INC. is a business infrastructure and AI systems company engineered for founders, creators, and unconventional visionaries.</p>
      </section>

      <section className="section-shell values-section">
        <div className="split-heading">
          <h2>WE SEE WHAT<br />OTHERS DISMISS.</h2>
          <div>
            <p>Our mission is to identify unrealized potential within people, ideas, and emerging markets—and engineer the infrastructure needed to move beyond the limitations of any single individual.</p>
            <p>Our vision is an entrepreneurial ecosystem where unconventional concepts are protected, documented, automation-ready, and positioned for sustainable growth.</p>
          </div>
        </div>
        <div className="value-grid">
          <article><span>01</span><h3>Creativity + discipline</h3><p>Original thought gets room to breathe and a structure strong enough to carry it.</p></article>
          <article><span>02</span><h3>Spirit + strategy</h3><p>Purpose can guide the work without replacing research, evidence, or execution.</p></article>
          <article><span>03</span><h3>Human + machine</h3><p>Knowledge is built for human clarity and clean machine-readable intelligence.</p></article>
        </div>
      </section>

      <section className="brand-gallery-section">
        <div className="section-shell">
          <div className="section-index">CORPORATE IDENTITY // APPROVED ASSET SYSTEM</div>
          <div className="brand-gallery-head">
            <div><p className="eyebrow">THE APPROVED SYSTEM, MADE VISIBLE</p><h2>ONE IDENTITY.<br /><em>EVERY ENVIRONMENT.</em></h2></div>
            <p>The current approved BI POLARIZE identity is deployed here from the canonical HD asset library. Retired and superseded visual marks are not served by the production site.</p>
          </div>
          <div className="brand-gallery">
            {approvedAssets.map(([file, label, wide, contain]) => (
              <figure key={file} className={`${wide ? "brand-gallery-wide " : ""}${contain ? "brand-gallery-contain" : ""}`}>
                <Image src={`/brand/approved/${file}`} alt={`BI POLARIZE ${label.toLowerCase()}`} fill sizes={wide ? "100vw" : "(max-width: 900px) 100vw, 50vw"} />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="declaration-section">
        <div className="section-shell">
          <div className="section-index">FOUNDER // DECLARATION OF INTENT</div>
          <div className="declaration-grid">
            <div className="declaration-copy">
              <p className="eyebrow">FOUNDER&apos;S DECLARATION</p>
              <h2>FROM MISUNDERSTOOD<br />TO <em>UNDENIABLE.</em></h2>
              <p>BI POLARIZE ENTERPRISES, INC. was built for the thinkers, creators, builders, and visionaries whose ideas refuse to fit inside somebody else&apos;s little-ass box.</p>
              <p>I know what it means to see what others cannot yet understand—to carry a vision so unconventional that people mistake its complexity for confusion. But complexity is not failure, and chaos is not always disorder. Sometimes chaos is raw intelligence waiting to be extracted, challenged, organized, and transformed into something undeniable.</p>
              <p className="declaration-punch">That is what we do.</p>
              <p>We do not water down powerful ideas to make conventional minds comfortable. We examine both sides, expose the weaknesses, protect the value, strengthen the foundation, and engineer the infrastructure required to make the vision functional, profitable, and sustainable.</p>
              <p>BI POLARIZE exists where creativity meets discipline, spirituality meets strategy, and imagination meets execution. The person carrying the vision may not yet possess every document, system, connection, or resource needed to build it. That does not make the vision less valuable. It means the right architecture has not been built around it yet.</p>
              <p className="declaration-punch">We are here to build that architecture.</p>
              <p>This company stands for the founder who was underestimated, the creator who was misunderstood, the problem-solver who never followed the traditional path, and the innovator holding something the market does not yet know how to name.</p>
              <p>Originality should never be punished for refusing to imitate what already exists. Vision should never die because it arrived before its instructions. Great ideas deserve more than encouragement, generic templates, and pretty-ass reports that collect digital dust. They deserve research, structure, protection, execution, and a legitimate path to revenue.</p>
              <p>So bring us the raw thought. Bring us the complicated problem, unfinished concept, strange invention, unconventional solution, or big-ass vision nobody else understands.</p>
              <p>We will question it. We will challenge it. We will polarize it. Then we will help build the systems required to make it real.</p>
              <blockquote>Tell Us About Your Thing.<br /><span>From idea to functional. From misunderstood to undeniable.</span></blockquote>
            </div>

            <aside id="douglas-arnold-long-jr" className="founder-aside">
              <div className="founder-frame">
                <Image src="/founder.jpg" alt="Douglas Arnold Long Jr., Founder and Director of Operations of BI POLARIZE ENTERPRISES, INC." fill sizes="(max-width: 900px) 90vw, 32vw" />
              </div>
              <Image className="founder-seal" src="/brand/approved/BPEI_OFFICIAL_CORPORATE_SEAL_HD.png" alt="Official BI POLARIZE corporate seal" width={180} height={180} />
              <div className="founder-bio">
                <small>FOUNDER // DIRECTOR OF OPERATIONS</small>
                <h3>Douglas Arnold Long Jr.</h3>
                <p><strong>Architect of the Bipolarization Method™</strong></p>
                <p>A multidisciplinary business architect, researcher, creative producer, and unconventional problem-solver based in Ogden, Utah.</p>
                <p>With a B.S. in Audio Production, an A.S. in Business, and multiple business-management certifications, the Founder combines formal education with lived experience, spiritual intelligence, creative instinct, strategic research, and streetwise execution.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
