import Link from "next/link";
import { PageShell } from "../components/SiteChrome";
import { IntakeLink } from "../components/IntakeLink";

export default function ContactPage() {
  return (
    <PageShell>
      <section className="page-hero contact-hero">
        <div className="section-index">P.O.L.A.R. INTAKE // CHANNEL OPEN</div>
        <p className="eyebrow">TELL US ABOUT YOUR THING</p>
        <h1>
          WHAT ARE YOU
          <br />
          TRYING TO <em>BUILD?</em>
        </h1>
        <p>
          Give us the raw version: the idea, the problem, the obstacle, and the
          outcome you can see even if the structure is not there yet.
        </p>
      </section>

      <section className="section-shell contact-grid">
        <div className="intake-panel">
          <div className="terminal-bar">
            <span>POLAR.BLUEPRINT.INTAKE</span>
            <span className="live-pip">ONLINE</span>
          </div>
          <h2>Begin extraction.</h2>
          <p>
            The live P.O.L.A.R. intake captures your answers, analyzes the
            concept, identifies contradictions and risks, and routes the first
            recommended BPEI division. Raw, incomplete, and unconventional is
            welcome. The point is to start with what is actually in your head.
          </p>
          <ol>
            <li>
              <span>01</span>
              <div>
                <b>What is your thing?</b>
                <p>Describe the idea, business, invention, project, problem, or transformation.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <b>Who is it for and what does it solve?</b>
                <p>Identify the people, market, need, friction, or opportunity.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <b>What is blocking it?</b>
                <p>Tell us where the confusion, risk, missing structure, or bottleneck lives.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <b>What should it become?</b>
                <p>Define the functional outcome, revenue goal, or impact you are aiming for.</p>
              </div>
            </li>
          </ol>
          <IntakeLink />
        </div>

        <aside className="contact-card">
          <p className="eyebrow">PUBLIC CONTACT</p>
          <h3>Use the channel that fits.</h3>
          <a href="tel:+18016868143">801-686-8143</a>
          <a href="mailto:YourThing@PolarPaw.Online">YourThing@PolarPaw.Online</a>
          <a href="https://PolarPaw.Online">PolarPaw.Online</a>
          <div>
            <small>BASE</small>
            <b>Ogden, Utah, United States</b>
          </div>
          <div>
            <small>INTAKE ACCESS</small>
            <b>Open 24 hours a day, 7 days a week</b>
          </div>
          <div className="social-row">
            <Link href="https://www.facebook.com/profile.php?id=61590119837823">Facebook ↗</Link>
            <Link href="https://www.instagram.com/bipolarizeinc/">Instagram ↗</Link>
          </div>
          <p className="contact-tag">Tell Us About Your Thing. Anytime.</p>
        </aside>
      </section>
    </PageShell>
  );
}
