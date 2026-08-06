import Image from "next/image";
import { PageShell } from "../components/SiteChrome";

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
            <p>Our mission is to identify unrealized potential within people, ideas, and emerging markets, then engineer the infrastructure needed to move beyond the limitations of any single individual.</p>
            <p>Our vision is an entrepreneurial ecosystem where unconventional concepts are protected, documented, automation-ready, and positioned for sustainable growth.</p>
          </div>
        </div>
      </section>

      <section className="section-shell why-section" id="why">
        <div className="section-index">WHY // FOUNDER ORIGIN</div>
        <div className="declaration-grid">
          <div className="declaration-copy">
            <p className="eyebrow">WHY BI POLARIZE EXISTS</p>
            <h2>BECAUSE ORIGINAL IDEAS<br /><em>KEEP GETTING MISREAD.</em></h2>
            <p>BI POLARIZE was built for founders whose ideas arrive before the language, structure, funding package, or operating system required to explain them. Too many viable concepts are dismissed as scattered, unrealistic, or too complicated when the real problem is that nobody has taken the time to extract and engineer the intelligence behind them.</p>
            <p>Our work begins where conventional consulting usually loses patience. We retrieve the whole idea, challenge it from opposing angles, protect what makes it valuable, and convert it into systems that people, partners, lenders, and technology can actually understand and use.</p>
            <p className="declaration-punch">The goal is not to make unconventional founders more conventional. The goal is to make their vision functional.</p>
          </div>
          <aside className="founder-aside">
            <div className="founder-frame">
              <Image src="/founder.jpg" alt="Founder and Director of Operations" fill sizes="(max-width: 900px) 90vw, 32vw" />
            </div>
            <div className="founder-bio">
              <small>FOUNDER // DIRECTOR OF OPERATIONS</small>
              <h3>Architect of the Bipolarization Method</h3>
              <p>A multidisciplinary business architect, researcher, creative producer, and unconventional problem-solver based in Ogden, Utah.</p>
              <p>With formal education in audio production and business, multiple management certifications, and lived experience building through complexity, the Founder created BI POLARIZE to give unconventional vision the infrastructure it is usually denied.</p>
            </div>
          </aside>
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
              <p>I know what it means to see what others cannot yet understand, to carry a vision so unconventional that people mistake its complexity for confusion. But complexity is not failure, and chaos is not always disorder. Sometimes chaos is raw intelligence waiting to be extracted, challenged, organized, and transformed into something undeniable.</p>
              <p className="declaration-punch">That is what we do.</p>
              <p>We do not water down powerful ideas to make conventional minds comfortable. We examine both sides, expose the weaknesses, protect the value, strengthen the foundation, and engineer the infrastructure required to make the vision functional, profitable, and sustainable.</p>
              <blockquote>Tell Us About Your Thing.<br /><span>From idea to functional. From misunderstood to undeniable.</span></blockquote>
            </div>
            <aside className="founder-aside">
              <Image className="founder-signature" src="/brand/official/18_founder_signature_authentication.png" alt="Official founder signature authentication" width={340} height={158} />
              <Image className="founder-seal" src="/brand/official/02_official_corporate_seal.png" alt="Official corporate seal" width={150} height={114} />
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
