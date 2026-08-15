"use client";

import { useEffect } from "react";

const divisionRoutes: Record<string, string> = {
  "Sav.VidzGen™": "/services#sav-vidzgen",
  "Dr.Docx™": "/services#dr-docx",
  "Blueprint™": "/services#blueprint",
  "BrandForge™": "/services#brandforge",
  "LaunchPad™": "/services#launchpad",
  "Nexus™": "/services#nexus",
  "Pulse™": "/services#pulse",
  "Vault™": "/services#vault",
  "Cipher™": "/services#cipher",
};

export function RouteIntentGuard() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const label = anchor.textContent?.replace(/\s+/g, " ").trim() ?? "";

      if (label.includes("OPEN DIVISION")) {
        const divisionName = anchor.closest("article")?.querySelector("h3")?.textContent?.trim();
        const destination = divisionName ? divisionRoutes[divisionName] : undefined;
        if (destination) {
          event.preventDefault();
          window.location.assign(destination);
          return;
        }
      }

      if (label.includes("ENTER THE P.O.L.A.R. SYSTEM") && anchor.getAttribute("href") === "/about") {
        event.preventDefault();
        window.location.assign("/#polar");
        return;
      }

      if (label.includes("FOUNDER CONTROL") && anchor.getAttribute("href") === "/founder") {
        event.preventDefault();
        window.location.assign("/about");
      }
    };

    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  return null;
}
