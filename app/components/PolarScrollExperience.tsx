"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./PolarScrollExperience.module.css";

const stages = ["P", "P.O", "P.O.L", "P.O.L.A", "P.O.L.A.R."];

export function PolarScrollExperience() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;
        const distance = Math.max(root.scrollHeight - window.innerHeight, 1);
        setProgress(Math.min(1, Math.max(0, window.scrollY / distance)));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const stage = stages[Math.min(stages.length - 1, Math.floor(progress * stages.length))];
  const landed = progress >= 0.965;

  return (
    <>
      <div className={styles.flagField} aria-hidden="true">
        <div className={styles.flagWave}>
          <Image src="/brand/official/09_corporate_flag.png" alt="" fill sizes="100vw" />
        </div>
        <div className={styles.flagVeil} />
      </div>

      <aside
        className={`${styles.beacon} ${landed ? styles.landed : ""}`}
        aria-label={`P.O.L.A.R. scroll progress ${Math.round(progress * 100)} percent`}
      >
        <div className={styles.ring}><span>{stage}</span></div>
        <div className={styles.track} aria-hidden="true"><i style={{ height: `${progress * 100}%` }} /></div>
        <div className={styles.pounce}>
          <Image
            src="/brand/polar/pounce-landing.png"
            alt="P.O.L.A.R. pounce landing"
            width={168}
            height={168}
          />
        </div>
      </aside>
    </>
  );
}
