"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./MobileNav.module.css";
import { flagships } from "../brand-data";

const links = [
  ["Home", "/"],
  ["Divisions", "/divisions"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const close = () => setOpen(false);

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.toggle}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={styles.panel} data-open={open ? "true" : "false"}>
        <nav aria-label="Mobile navigation">
          <Link href="/" onClick={close}>Home</Link>
          <span className={styles.groupLabel}>FLAGSHIPS // FIVE-STAGE BUILD PATH</span>
          {flagships.map((item)=><Link className={styles.subLink} key={item.slug} href={`/flagships/${item.slug}`} onClick={close}><small>{item.step}</small>{item.shortName}</Link>)}
          {links.slice(1).map(([label, href]) => (
            <Link key={`${label}-${href}`} href={href} onClick={close}>{label}</Link>
          ))}
          <Link href="/services" onClick={close}>Focused Services</Link>
          <Link href="/etsa" onClick={close}>ETSA™</Link>
          <Link href="/intake" className={styles.cta} onClick={close}>
            TELL US ABOUT YOUR THING
          </Link>
          <Link href="/portal" className={styles.clientLink} onClick={close}>
            CLIENT LOGIN
          </Link>
        </nav>
      </div>
    </div>
  );
}
