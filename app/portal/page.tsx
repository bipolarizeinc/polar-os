import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "../components/SiteChrome";
import { getEtsaUser } from "../lib/etsa/auth";
import styles from "./portal.module.css";

const destinations = [
  ["HOME", "/", "Enter the full BI POLARIZE website and P.O.L.A.R. operating environment."],
  ["DIVISIONS", "/#products", "Explore all nine BPEI divisions and their dedicated P.O.L.A.R. transmissions."],
  ["SERVICES", "/services", "Browse capabilities, direct services, starting prices, and routed intake paths."],
  ["ETSA™", "/etsa", "Take or continue the Enterprise Talent & Skills Alignment assessment."],
  ["P.O.L.A.R.", "/#polar", "Enter the P.O.L.A.R. intelligence and enterprise memory layer."],
  ["ABOUT", "/about", "Understand the company, methodology, founder doctrine, and operating philosophy."],
  ["CONTACT", "/contact", "Reach BI POLARIZE directly."],
  ["TELL US ABOUT YOUR THING", "/intake", "Start a routed intake with your customer context already connected."],
] as const;

export default async function CustomerPortalPage() {
  const store = await cookies();
  const token = store.get("etsa_access")?.value;
  if (!token) redirect("/welcome");

  let user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  try {
    user = await getEtsaUser(token);
  } catch {
    redirect("/welcome?reason=session");
  }

  const displayName = String(user.user_metadata?.full_name || user.email || "Customer");

  return (
    <PageShell>
      <section className={styles.hero}>
        <Image src="/brand/approved/BPEI_LOBBY_INSTALLATION_HD.png" alt="BI POLARIZE customer portal environment" fill priority sizes="100vw" />
        <div className={styles.overlay} />
        <div className={styles.heroCopy}>
          <p className="eyebrow">P.O.L.A.R. CUSTOMER PORTAL // ACCESS GRANTED</p>
          <h1>WELCOME,<br /><em>{displayName.toUpperCase()}.</em></h1>
          <p>Your account is authenticated. Everything customer-facing is unlocked from here.</p>
        </div>
      </section>

      <section className={styles.portal}>
        <div className={styles.portalHead}>
          <div><span>SESSION</span><strong>AUTHENTICATED</strong></div>
          <div><span>ACCOUNT</span><strong>{user.email ?? "VERIFIED"}</strong></div>
          <div><span>P.O.L.A.R.</span><strong>ONLINE</strong></div>
        </div>

        <div className={styles.grid}>
          {destinations.map(([label, href, description], index) => (
            <Link href={href} key={label} className={styles.card}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{label}</h2>
              <p>{description}</p>
              <b>OPEN →</b>
            </Link>
          ))}
        </div>

        <form action="/api/etsa/auth/logout" method="post" className={styles.logout}>
          <button type="submit">SIGN OUT OF CUSTOMER ACCESS</button>
        </form>
      </section>
    </PageShell>
  );
}
