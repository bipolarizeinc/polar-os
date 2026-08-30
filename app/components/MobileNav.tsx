"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./MobileNav.module.css";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["How It Works", "/#how-it-works"],
  ["Divisions", "/#products"],
  ["ETSA™", "/etsa"],
  ["P.O.L.A.R.", "/#polar"],
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
          {links.map(([label, href]) => (
            <Link key={`${label}-${href}`} href={href} onClick={close}>{label}</Link>
          ))}
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
