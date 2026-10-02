import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DashboardReviewPrompt } from "../components/DashboardReviewPrompt";
import { PageShell } from "../components/SiteChrome";
import { getEtsaUser } from "../lib/etsa/auth";
import { etsaRest } from "../lib/etsa/data";
import { getSupabaseConfig, supabaseRequest } from "../lib/polar-memory";
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

  let assessment: {status:string;current_question:number} | undefined;
  let assessmentUnavailable = false;
  try {
    assessment = (await etsaRest<Array<{status:string;current_question:number}>>(`etsa_assessment_sessions?user_id=eq.${user.id}&order=started_at.desc&limit=1&select=status,current_question`, token))[0];
  } catch { assessmentUnavailable = true; }
  const assessmentPath = !assessment ? "/etsa/notice" : ["CREATED","IN_PROGRESS","PAUSED"].includes(assessment.status) ? "/etsa/assessment" : "/etsa/results";

  type Blueprint = { extraction_id: string; status: string; thing: string; recommended_module: string | null; submitted_at: string | null };
  let blueprints: Blueprint[] = [];
  try {
    const config = getSupabaseConfig();
    if (config) {
      const query = new URLSearchParams({
        customer_user_id: `eq.${user.id}`,
        select: "extraction_id,status,thing,recommended_module,submitted_at",
        order: "submitted_at.desc",
        limit: "3"
      });
      blueprints = await supabaseRequest<Blueprint[]>(config, `polar_intake_sessions?${query}`);
    }
  } catch {
    // Preserve dashboard access if Blueprint history is temporarily unavailable.
  }
  const latestBlueprint = blueprints[0];

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
            {latestBlueprint ? <>
              <p>Your latest operating record is <strong>{latestBlueprint.extraction_id}</strong>: {latestBlueprint.thing}. {latestBlueprint.recommended_module ? `P.O.L.A.R. routed it to ${latestBlueprint.recommended_module}.` : "Routing is in progress."}</p>
              <p>{blueprints.length > 1 ? `${blueprints.length} recent Blueprint records are attached to this account.` : "This Blueprint record is attached to your customer account."}</p>
              <Link href="/command-center">OPEN OR RECOVER BLUEPRINT →</Link>
            </> : <>
              <p>No Blueprint engagement is attached to this account yet. Begin intake and we will create the operating record from your actual submission.</p>
              <Link href="/intake?source=dashboard">INITIALIZE BLUEPRINT EXTRACTION →</Link>
            </>}
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

        <section className={styles.support} aria-label="Your ETSA assessment">
          <div><p>ETSA™ // YOUR ASSESSMENT</p><h2>{assessmentUnavailable ? "STATUS UNAVAILABLE" : assessment ? assessment.status.replaceAll("_", " ") : "READY TO BEGIN"}</h2><span>{assessmentUnavailable ? "We could not load your status. Retry through ETSA." : assessment ? `Saved progress: question ${assessment.current_question} of 70.` : "Your first assessment starts with the data notice."}</span></div>
          <Link href={assessmentUnavailable ? "/etsa/results" : assessmentPath}>{assessment ? "CONTINUE ETSA →" : "OPEN ETSA →"}</Link>
        </section>
        <div className={styles.actionGrid}>
          {actions.map(([number, title, href, description]) => (
            <Link href={number === "02" ? assessmentPath : href} className={styles.actionCard} key={title}>
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
