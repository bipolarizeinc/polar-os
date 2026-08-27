"use client";

import { useEffect, useState } from "react";
import styles from "./DashboardReviewPrompt.module.css";

const LOGIN_FLAG = "bpei_dashboard_login";
const SHOWN_FLAG = "bpei_trustpilot_dashboard_shown";

export function DashboardReviewPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const arrivedFromLogin = sessionStorage.getItem(LOGIN_FLAG) === "1";
      const alreadyShown = sessionStorage.getItem(SHOWN_FLAG) === "1";

      if (!arrivedFromLogin || alreadyShown) return;

      sessionStorage.removeItem(LOGIN_FLAG);
      sessionStorage.setItem(SHOWN_FLAG, "1");
      const timer = window.setTimeout(() => setOpen(true), 1400);
      return () => window.clearTimeout(timer);
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={() => setOpen(false)}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trustpilot-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.close} type="button" onClick={() => setOpen(false)} aria-label="Close review request">×</button>
        <p className={styles.eyebrow}>CUSTOMER FEEDBACK // 60 SECONDS</p>
        <h2 id="trustpilot-title">THANKS FOR TRUSTING<br /><em>BI POLARIZE.</em> 🐾</h2>
        <p>Got 60 seconds? Leave us an honest Trustpilot review.</p>
        <p>Your feedback helps us build better.</p>
        <div className={styles.actions}>
          <a href="https://www.trustpilot.com/review/polarpaw.online" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            LEAVE AN HONEST REVIEW
          </a>
          <button type="button" onClick={() => setOpen(false)}>NOT RIGHT NOW</button>
        </div>
      </section>
    </div>
  );
}
