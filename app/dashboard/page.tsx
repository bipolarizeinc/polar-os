import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DashboardReviewPrompt } from "../components/DashboardReviewPrompt";
import { PageShell } from "../components/SiteChrome";
import { getEtsaUser } from "../lib/etsa/auth";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description: "Secure BI POLARIZE client operations dashboard.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard" },
};

const actions = [
  ["01", "START YOUR BLUEPRINT", "/intake?source=dashboard", "Tell us what is in your head. P.O.L.A.R. will route the idea into the Bipolarization Method."],
  ["02", "CONTINUE ETSA™", "/etsa", "Open the Enterprise Talent & Skills Alignment system and continue your assessment workflow."],
  ["03", "EXPLORE SERVICES", "/services", "Review flagship systems, direct services, starting prices, and the right path for your thing."],
  ["04", "OPEN CUSTOMER PORTAL", "/portal", "Access every customer-facing destination, division, and P.O.L.A.R. operating surface."],
] as const;

export default async function DashboardPage() {
  const store = await cookies();
  const token = store.get("etsa_access")?.value;
  if (!token) redirect("/welcome?next=/dashboard");

  let user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  try {
    user = await getEtsaUser(token);
  } catch {
    redirect("/welcome?reason=session&next=/dashboard");
  }

  const displayName = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Client");
  const email = user.email ?? "Verified customer";

  return (
    <PageShell>
      <DashboardReviewPrompt />

      <section className={styles.hero}>
        <Image
          src="/brand/approved/POLAR_CLIENT_SUCCESS_FOLLOWUP.png"
          alt="P.O.L.A.R. client success interface"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.overlay} />
        <div className={styles.heroCopy}>
          <p className="eyebrow">POLAR OS // CLIENT OPERATIONS</p>
          <h1>WELCOME BACK,<br /><em>{displayName.toUpperCase()}.</em></h1>
          <p>Your secure operating space is active. Start your Blueprint, continue ETSA™, or contact the team without getting lost in the machinery.</p>
        </div>
      </section>

      <section className={styles.dashboard}>
        <div className={styles.statusBar}>
          <div><span>SESSION</span><strong>AUTHENTICATED</strong></div>
          <div><span>ACCOUNT</span><strong>{email}</strong></div>
          <div><span>P.O.L.A.R.</span><strong>ONLINE</strong></div>
        </div>

        <div className={styles.blueprint}>
          <div className={styles.blueprintCopy}>
            <p className={styles.kicker}>THE BIPOLARIZED BLUEPRINT™</p>
            <h2>YOUR THING<br /><em>STARTS HERE.</em></h2>
            <p>No Blueprint engagement is attached to this account yet. That is an honest empty state—not fabricated progress data. Begin intake and we will create the operating record from your actual submission.</p>
            <Link href="/intake?source=dashboard">INITIALIZE BLUEPRINT EXTRACTION →</Link>
          </div>
          <div className={styles.blueprintVisual}>
            <Image
              src="/brand/approved/BPEI_APPROVED_BIPOLARIZED_BLUEPRINT_ENTERPRISE_INFOGRAPHIC_HD.png"
              alt="The Bipolarized Blueprint enterprise architecture"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
        </div>

        <div className={styles.sectionHead}>
          <div>
            <p>DIRECT OPERATIONS</p>
            <h2>WHAT DO YOU NEED<br /><em>TO DO NEXT?</em></h2>
          </div>
          <span>04 ACTIVE PATHS</span>
        </div>

        <div className={styles.actionGrid}>
          {actions.map(([number, title, href, description]) => (
            <Link href={href} className={styles.actionCard} key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <b>OPEN →</b>
            </Link>
          ))}
        </div>

        <section className={styles.support}>
          <div>
            <p>HUMAN SUPPORT // INTAKE OPEN 24 / 7</p>
            <h2>NEED A HAND?</h2>
            <span>Questions, files, context, or something weird—send it directly to the official website inbox.</span>
          </div>
          <a href="mailto:YourThing@PolarPaw.Online?subject=Client%20Dashboard%20Support">YOURTHING@POLARPAW.ONLINE →</a>
        </section>

        <form action="/api/etsa/auth/logout" method="post" className={styles.logout}>
          <button type="submit">SIGN OUT OF CLIENT OPERATIONS</button>
        </form>
      </section>
    </PageShell>
  );
}
