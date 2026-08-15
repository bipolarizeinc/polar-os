"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["Home", "/"],
  ["Divisions", "/#products"],
  ["Services", "/services"],
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
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="mobile-menu-panel" data-open={open ? "true" : "false"}>
        <nav aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={close}>{label}</Link>
          ))}
          <Link href="/intake" className="mobile-menu-cta" onClick={close}>
            TELL US ABOUT YOUR THING
          </Link>
        </nav>
      </div>
    </div>
  );
}
