import Image from "next/image";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";
import { PolarConsole } from "./components/PolarConsole";

const method = [
  ["01", "Extract", "We get the whole idea out of your head—mess, brilliance, contradictions and all."],
  ["02", "Polarize", "We challenge both sides, expose weak points, and identify the value worth protecting."],
  ["03", "Architect", "We engineer the documents, workflows, systems, and intelligence the vision requires."],
  ["04", "Deploy", "We move the architecture into real operations with a practical path toward revenue."],
];

export default function Home() {
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-energy fire" /><div className="hero-energy ice" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span>BP-WEB-7709</span> INNOVATION INFRASTRUCTURE</p>
            <h1>OFF THE WALL.<br /><em>OUT OF THE BOX.</em></h1>
            <p className="hero-lede">We transform raw, unconventional ideas into structured, protected, automation-ready enterprises.</p>
            <div className="hero-actions">
              <Link href="/contact" className="primary-action">INITIALIZE BLUEPRINT EXTRACTION <span>↗</span></Link>
              <Link href="/services" className="text-action">EXPLORE THE SYSTEM <span>→</span></Link>
            </div>
            <div className="hero-metrics">
              <div><b>24/7</b><span>System access</span></div><div><b>4-PHASE</b><span>Bipolarization Method</span></div><div><b>1 OF NONE</b><span>Built for originals</span></div>
            </div>
          </div>
          <PolarConsole />
        </div>
        <div className="scroll-cue">SCROLL TO ENTER THE SYSTEM <span>↓</span></div>
      </section>

      <section className="manifesto-band">
        <span>RAW THOUGHT</span><i>×</i><span>STRATEGIC FRICTION</span><i>×</i><span>SYSTEM ARCHITECTURE</span><i>=</i><strong>FUNCTIONAL ENTERPRISE</strong>
      </section>

      <section className="section-shell intro-section">
        <div className="section-index">01 // THE PROBLEM</div>
        <div className="split-heading">
          <h2>YOUR IDEA ISN&apos;T<br />TOO MUCH.</h2>
          <div><p>It is probably under-architected.</p><p>Great ideas die every day—not because they lack value, but because the knowledge is trapped in someone&apos;s head, the systems do not exist, and generic advice cannot handle the complexity.</p></div>
        </div>
        <div className="wall-card">
          <Image src="/brand/off-the-wall.png" alt="Breaking through conventional limits" fill sizes="90vw" />
          <div className="wall-overlay"><small>CONVENTIONAL LIMIT</small><h3>We do not shrink the vision.<br />We build the infrastructure around it.</h3></div>
        </div>
      </section>

      <section className="method-section">
        <div className="section-shell">
          <div className="section-index">02 // THE BIPOLARIZATION METHOD</div>
          <div className="method-head"><h2>CHAOS, ENGINEERED<br />INTO <em>CLARITY.</em></h2><p>Not motivational theater. Not another pretty-ass report collecting digital dust. A disciplined method for making original ideas functional.</p></div>
          <div className="method-grid">{method.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div>
      </section>

      <section className="section-shell blueprint-section">
        <div className="blueprint-copy">
          <div className="section-index">03 // FLAGSHIP SYSTEM</div>
          <p className="eyebrow">THE BIPOLARIZED BLUEPRINT™</p>
          <h2>FROM VISION<br />TO OPERATING<br /><em>REALITY.</em></h2>
          <p>A structured enterprise architecture that translates founder intelligence into clear, human-readable and machine-ready business infrastructure.</p>
          <Link href="/services" className="text-action">VIEW CAPABILITIES <span>→</span></Link>
        </div>
        <div className="blueprint-terminal">
          <div className="terminal-bar"><span>BLUEPRINT.EXTRACTION</span><span>● ● ●</span></div>
          {["Identity + positioning", "Business architecture", "Operational documentation", "AI-ready knowledge systems", "Automation pathways", "Revenue deployment plan"].map((x,i)=><div className="terminal-row" key={x}><span>0{i+1}</span><b>{x}</b><i>VERIFIED</i></div>)}
          <div className="terminal-status">SYSTEM READINESS <strong>100%</strong></div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-mark"><Image src="/brand/bipolarization-symbol.png" alt="" fill /></div>
        <p className="eyebrow">TRANSMISSION OPEN // 24 HOURS</p>
        <h2>BRING US THE<br /><em>BIG-ASS VISION.</em></h2>
        <p>Complicated problem. Strange invention. Unfinished concept. Unconventional solution. Tell us about your thing.</p>
        <Link href="/contact" className="primary-action">INITIALIZE EXTRACTION <span>↗</span></Link>
      </section>
    </PageShell>
  );
}
