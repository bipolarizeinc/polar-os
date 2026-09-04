import Image from "next/image";
import Link from "next/link";
import { flagships } from "../brand-data";
import { IntakeLink } from "./IntakeLink";
import { MobileNav } from "./MobileNav";

export function MarketingHeader() {
  return <header className="parity-topbar">
    <Link className="parity-brand" href="/" aria-label="BI POLARIZE home">
      <Image src="/brand/approved/BPEI_PRIMARY_CORPORATE_LOGO_HD.png" alt="" width={40} height={40}/>
      <span><b>BI POLARIZE</b><small>ENTERPRISES, INC.</small></span>
    </Link>
    <nav className="parity-nav" aria-label="Main navigation">
      <Link href="/">Home</Link>
      <div className="parity-nav-menu"><Link href="/flagships" aria-haspopup="true">Flagships <span>⌄</span></Link><div className="parity-nav-dropdown">{flagships.map((item)=><Link key={item.slug} href={`/flagships/${item.slug}`}><small>{item.step}</small>{item.shortName}</Link>)}</div></div>
      <Link href="/divisions">Divisions</Link>
      <div className="parity-nav-menu"><Link href="/about" aria-haspopup="true">Company <span>⌄</span></Link><div className="parity-nav-dropdown parity-company-dropdown"><Link href="/about"><small>01</small>About BPEI</Link><Link href="/contact"><small>02</small>Contact</Link></div></div>
    </nav>
    <div className="parity-header-actions"><Link className="parity-client" href="/portal">Client Login</Link><IntakeLink className="parity-nav-cta">Start Intake</IntakeLink></div>
    <MobileNav/>
  </header>;
}

export function MarketingFooter() {
  return <footer className="parity-footer">
    <Link className="parity-brand" href="/"><Image src="/brand/approved/BPEI_PRIMARY_CORPORATE_LOGO_HD.png" alt="" width={40} height={40}/><span><b>BI POLARIZE</b><small>ENTERPRISES, INC.</small></span></Link>
    <p>Off the Wall and Out of the Box™.<br/>All the Business for Your Business™.</p>
    <div className="parity-footer-links"><Link href="/flagships">Flagships</Link><Link href="/divisions">Divisions</Link><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/etsa">ETSA™</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
    <div className="parity-footer-client"><Link href="/portal">Customer Portal</Link><Link href="/dashboard">Client Dashboard</Link><small>© {new Date().getFullYear()} BI POLARIZE ENTERPRISES, INC.<br/>Ogden, Utah</small></div>
  </footer>;
}

export function MarketingShell({children}:{children:React.ReactNode}) { return <main className="sites-parity"><MarketingHeader/>{children}<MarketingFooter/></main>; }
