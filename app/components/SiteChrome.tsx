import Image from "next/image";
import Link from "next/link";
import { IntakeLink } from "./IntakeLink";
import { MobileNav } from "./MobileNav";

const links = [
  ["Dashboard", "/dashboard"],
  ["Portal", "/portal"],
  ["Home", "/"],
  ["Divisions", "/#products"],
  ["Services", "/services"],
  ["ETSA™", "/etsa"],
  ["P.O.L.A.R.", "/#polar"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="system-strip">
        <span><i /> CUSTOMER SYSTEM ACTIVE</span>
        <span>CLASSIFICATION: CUSTOMER</span>
        <span>AUTHORIZATION: ACCESS VERIFIED</span>
      </div>
      <div className="nav-shell">
        <Link href="/dashboard" className="brand-lockup" aria-label="BI POLARIZE client dashboard">
          <Image src="/brand/official/05_compact_icon_mark.png" alt="" width={90} height={46} />
          <span>BI POLARIZE<small>ENTERPRISES, INC.</small></span>
        </Link>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={`${label}-${href}`} href={href}>{label}</Link>)}
        </nav>
        <IntakeLink className="nav-cta" />
        <MobileNav />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Image src="/brand/official/01_primary_corporate_logo.png" alt="BI POLARIZE ENTERPRISES, INC." width={250} height={194} />
          <p>All the business for your business. From raw idea to functioning enterprise, connected through P.O.L.A.R.</p>
        </div>
        <div>
          <b>Explore</b>
          <Link href="/dashboard">Client Dashboard</Link>
          <Link href="/portal">Customer Portal</Link>
          <Link href="/#products">Divisions</Link>
          <Link href="/services">Services</Link>
          <Link href="/etsa">ETSA™</Link>
          <Link href="/#polar">P.O.L.A.R.</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <b>Connect</b>
          <a href="tel:+18016868143">801-686-8143</a>
          <a href="mailto:YourThing@PolarPaw.Online">YourThing@PolarPaw.Online</a>
          <span>Intake open 24 / 7</span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} BI POLARIZE ENTERPRISES, INC.</span>
        <span>OGDEN, UTAH · OFF THE WALL AND OUT OF THE BOX · POWERED BY POLAR OS</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="polar-site"><SiteHeader />{children}<SiteFooter /></main>;
}
