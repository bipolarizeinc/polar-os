import Image from "next/image";
import { PageShell } from "../components/SiteChrome";

const officialAssets = [
  ["17_branded_environment.png", "BRANDED ENVIRONMENT", true, false],
  [
    "07_off_the_wall_concept.png",
    "OFF THE WALL // OUT OF THE BOX",
    true,
    false,
  ],
  ["01_primary_corporate_logo.png", "PRIMARY CORPORATE LOGO", false, true],
  ["02_official_corporate_seal.png", "OFFICIAL CORPORATE SEAL", false, true],
  ["03_secondary_circular_logo.png", "SECONDARY CIRCULAR LOGO", false, true],
  ["05_compact_icon_mark.png", "COMPACT ICON MARK", false, true],
  ["06_polar_platform_mark.png", "P.O.L.A.R. PLATFORM MARK", false, true],
  ["08_polar_interface_mark.png", "P.O.L.A.R. INTERFACE MARK", false, true],
  ["10_brand_energy.png", "BRAND ENERGY", true, false],
  ["11_brand_color_palette.png", "OFFICIAL COLOR PALETTE", true, true],
  ["09_corporate_flag.png", "CORPORATE FLAG", false, true],
  ["13_building_signage.png", "BUILDING SIGNAGE", false, false],
  ["14_lobby_installation.png", "LOBBY INSTALLATION", false, false],
  ["16_tech_interface.png", "P.O.L.A.R. TECH INTERFACE", false, false],
  [
    "BI_POLARIZE_Assets_Contact_Sheet.png",
    "OFFICIAL ASSET SYSTEM // MASTER CONTACT SHEET",
    true,
    true,
  ],
] as const;

export default function AboutPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="section-index">ABOUT // CORPORATE IDENTITY</div>
        <p className="eyebrow">BUILT FOR WHAT DOES NOT FIT</p>
        <h1>
          VISION DESERVES
          <br />
          <em>ARCHITECTURE.</em>
        </h1>
        <p>
          BI POLARIZE ENTERPRISES, INC. is a business infrastructure and AI
          systems company engineered for founders, creators, and unconventional
          visionaries.
        </p>
      </section>
      <section className="section-shell values-section">
        <div className="split-heading">
          <h2>
            WE SEE WHAT
            <br />
            OTHERS DISMISS.
          </h2>
          <div>
            <p>
              Our mission is to identify unrealized potential within people,
              ideas, and emerging markets—and engineer the infrastructure needed
              to move beyond the limitations of any single individual.
            </p>
            <p>
              Our vision is an entrepreneurial ecosystem where unconventional
              concepts are protected, documented, automation-ready, and
              positioned for sustainable growth.
            </p>
          </div>
        </div>
        <div className="value-grid">
          <article>
            <span>01</span>
            <h3>Creativity + discipline</h3>
            <p>
              Original thought gets room to breathe and a structure strong
              enough to carry it.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Spirit + strategy</h3>
            <p>
              Purpose can guide the work without replacing research, evidence,
              or execution.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Human + machine</h3>
            <p>
              Knowledge is built for human clarity and clean machine-readable
              intelligence.
            </p>
          </article>
        </div>
      </section>
      <section className="brand-gallery-section">
        <div className="section-shell">
          <div className="section-index">
            CORPORATE IDENTITY // OFFICIAL ASSET SYSTEM
          </div>
          <div className="brand-gallery-head">
            <div>
              <p className="eyebrow">THE UPDATED SYSTEM, MADE VISIBLE</p>
              <h2>
                ONE IDENTITY.
                <br />
                <em>EVERY ENVIRONMENT.</em>
              </h2>
            </div>
            <p>
              The complete approved BI POLARIZE identity is deployed here—from
              official marks and P.O.L.A.R. interfaces to physical and digital
              applications.
            </p>
          </div>
          <div className="brand-gallery">
            {officialAssets.map(([file, label, wide, contain]) => (
              <figure
                key={file}
                className={`${wide ? "brand-gallery-wide " : ""}${contain ? "brand-gallery-contain" : ""}`}
              >
                <Image
                  src={`/brand/official/${file}`}
                  alt={`BI POLARIZE ${label.toLowerCase()}`}
                  fill
                  sizes={wide ? "100vw" : "(max-width: 900px) 100vw, 50vw"}
                />
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
              <h2>
                FROM MISUNDERSTOOD
                <br />
                TO <em>UNDENIABLE.</em>
              </h2>
              <p>
                BI POLARIZE ENTERPRISES, INC. was built for the thinkers,
                creators, builders, and visionaries whose ideas refuse to fit
                inside somebody else&apos;s little-ass box.
              </p>
              <p>
                I know what it means to see what others cannot yet understand—to
                carry a vision so unconventional that people mistake its
                complexity for confusion. But complexity is not failure, and
                chaos is not always disorder. Sometimes chaos is raw
                intelligence waiting to be extracted, challenged, organized, and
                transformed into something undeniable.
              </p>
              <p className="declaration-punch">That is what we do.</p>
              <p>
                We do not water down powerful ideas to make conventional minds
                comfortable. We examine both sides, expose the weaknesses,
                protect the value, strengthen the foundation, and engineer the
                infrastructure required to make the vision functional,
                profitable, and sustainable.
              </p>
              <p>
                BI POLARIZE exists where creativity meets discipline,
                spirituality meets strategy, and imagination meets execution.
                The person carrying the vision may not yet possess every
                document, system, connection, or resource needed to build it.
                That does not make the vision less valuable. It means the right
                architecture has not been built around it yet.
              </p>
              <p className="declaration-punch">
                We are here to build that architecture.
              </p>
              <p>
                This company stands for the founder who was underestimated, the
                creator who was misunderstood, the problem-solver who never
                followed the traditional path, and the innovator holding
                something the market does not yet know how to name.
              </p>
              <p>
                Originality should never be punished for refusing to imitate
                what already exists. Vision should never die because it arrived
                before its instructions. Great ideas deserve more than
                encouragement, generic templates, and pretty-ass reports that
                collect digital dust. They deserve research, structure,
                protection, execution, and a legitimate path to revenue.
              </p>
              <p>
                So bring us the raw thought. Bring us the complicated problem,
                unfinished concept, strange invention, unconventional solution,
                or big-ass vision nobody else understands.
              </p>
              <p>
                We will question it. We will challenge it. We will polarize it.
                Then we will help build the systems required to make it real.
              </p>
              <blockquote>
                Tell Us About Your Thing.
                <br />
                <span>
                  From idea to functional. From misunderstood to undeniable.
                </span>
              </blockquote>
            </div>
            <aside className="founder-aside">
              <div className="founder-frame">
                <Image
                  src="/founder.jpg"
                  alt="Founder and Director of Operations"
                  fill
                  sizes="(max-width: 900px) 90vw, 32vw"
                />
              </div>
              <Image
                className="founder-signature"
                src="/brand/official/18_founder_signature_authentication.png"
                alt="Official founder signature authentication"
                width={340}
                height={158}
              />
              <Image
                className="founder-seal"
                src="/brand/official/02_official_corporate_seal.png"
                alt="Official corporate seal"
                width={150}
                height={114}
              />
              <div className="founder-bio">
                <small>FOUNDER // DIRECTOR OF OPERATIONS</small>
                <h3>Architect of the Bipolarization Method</h3>
                <p>
                  A multidisciplinary business architect, researcher, creative
                  producer, and unconventional problem-solver based in Ogden,
                  Utah.
                </p>
                <p>
                  With a B.S. in Audio Production, an A.S. in Business, and
                  multiple business-management certifications, the Founder
                  combines formal education with lived experience, spiritual
                  intelligence, creative instinct, strategic research, and
                  streetwise execution.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
