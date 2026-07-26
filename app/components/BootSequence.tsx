"use client";

import { useEffect, useState } from "react";
import styles from "./BootSequence.module.css";

const logs = [
  "LOADING ENTERPRISE KERNEL...",
  "MOUNTING KNOWLEDGE VAULT...",
  "AUTHENTICATING VISITOR...",
  "CALIBRATING POLAR CORE...",
  "SYSTEM READY.",
];

const classifications = ["VISIONARY DETECTED", "BUILDER DETECTED", "CREATOR DETECTED", "FOUNDER DETECTED"];

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [classification] = useState(() => classifications[Math.floor(Math.random() * classifications.length)]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyBooted = sessionStorage.getItem("polar-os-booted");
    if (alreadyBooted || reduced) return;
    setVisible(true);
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, logs.length)), 650);
    const finish = window.setTimeout(() => {
      sessionStorage.setItem("polar-os-booted", "true");
      setVisible(false);
    }, 4700);
    return () => { window.clearInterval(timer); window.clearTimeout(finish); };
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <button className={styles.skip} onClick={() => { sessionStorage.setItem("polar-os-booted", "true"); setVisible(false); }}>SKIP BOOT</button>
      <div className={styles.grid} />
      <div className={styles.core}>
        <div className={styles.ringOuter} />
        <div className={styles.ringInner} />
        <img src="/brand/compact-mark.png" alt="P.O.L.A.R. Paw initializing" />
      </div>
      <div className={styles.identity}>
        <small>BI POLARIZE ENTERPRISES, INC.</small>
        <h1>POLAR OS</h1>
        <p>{step >= 4 ? classification : "INITIALIZING ENTERPRISE INTELLIGENCE"}</p>
      </div>
      <div className={styles.logs}>
        {logs.map((log, index) => <span key={log} className={index < step ? styles.active : ""}>{index < step ? "✓" : "›"} {log}</span>)}
      </div>
      <div className={styles.progress}><i style={{ width: `${Math.min(step / logs.length * 100, 100)}%` }} /></div>
    </div>
  );
}
