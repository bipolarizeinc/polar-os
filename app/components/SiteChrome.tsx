import Image from "next/image";
import Link from "next/link";
import { IntakeLink } from "./IntakeLink";

const links = [
  ["Home", "/"],
  ["Products", "/#products"],
  ["Solutions", "/services"],
  ["P.O.L.A.R.", "/#polar"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="system-strip">
        <span><i /> SYSTEM ACTIVE</span>
        <span>CLASSIFICATION: PUBLIC</span>
        <span>AUTHORIZATION: POLAR VERIFIED</span>
      </div>
      <div className="nav-shell">
        <Link href="/" className="brand-lockup" aria-label="BI POLARIZE home">
          <Image src="/brand/compact-mark.png" alt="" width={46} height={46} priority />
          <span>BI POLARIZE<small>ENTERPRISES, INC.</small></span>
        </Link>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <IntakeLink className="nav-cta" />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Image src="/brand/primary-logo.png" alt="BI POLARIZE ENTERPRISES, INC." width={250} height={110} />
          <p>Turning fragile human knowledge into durable institutional intelligence.</p>
        </div>
        <div><b>Explore</b><Link href="/#products">Products</Link><Link href="/services">Solutions</Link><Link href="/#polar">P.O.L.A.R.</Link><Link href="/about">About</Link></div>
        <div><b>Connect</b><a href="tel:+18016868143">801-686-8143</a><a href="mailto:YourThing@PolarPaw.Online">YourThing@PolarPaw.Online</a><span>Open 24 / 7</span></div>
      </div>
      <div className="footer-base"><span>© {new Date().getFullYear()} BI POLARIZE ENTERPRISES, INC.</span><span>OGDEN, UTAH · POWERED BY POLAR OS</span></div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="polar-site"><SiteHeader />{children}<SiteFooter /></main>;
}