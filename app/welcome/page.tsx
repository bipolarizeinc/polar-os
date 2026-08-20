import type { Metadata } from "next";
import Image from "next/image";
import { CustomerAuthPanel } from "../components/CustomerAuthPanel";
import styles from "./welcome.module.css";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Enter the BI POLARIZE customer gateway, meet P.O.L.A.R., and access the customer portal.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/welcome" },
};

export default function WelcomePage() {
  return (
    <main className={styles.gateway}>
      <section className={styles.intro}>
        <Image className={styles.backdrop} src="/brand/approved/BPEI_BRANDED_ENVIRONMENT_HD.png" alt="" fill priority sizes="100vw" />
        <div className={styles.overlay} />
        <div className={styles.introInner}>
          <div className={styles.brandLine}>BI POLARIZE ENTERPRISES, INC. // CUSTOMER ACCESS</div>
          <h1>WELCOME TO<br /><em>THE SYSTEM.</em></h1>
          <p>Meet P.O.L.A.R., then create or enter your customer account. One login unlocks the portal, divisions, ETSA™, services, and customer-facing operating systems.</p>
          <div className={styles.videoFrame}>
            <video
              src="/media/polar-intro.mp4"
              poster="/brand/approved/BPEI_POLAR_TECH_INTERFACE_HD.png"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
            />
            <div className={styles.videoLabel}><span>P.O.L.A.R. INTRO TRANSMISSION</span><span>01 // VERIFIED</span></div>
          </div>
        </div>
      </section>

      <section className={styles.access} id="access">
        <div className={styles.accessVisual}>
          <Image src="/brand/approved/BPEI_POLAR_TECH_INTERFACE_HD.png" alt="P.O.L.A.R. customer access interface" fill sizes="(max-width: 900px) 100vw, 46vw" />
        </div>
        <CustomerAuthPanel nextPath="/portal" />
      </section>
    </main>
  );
}
