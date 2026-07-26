"use client";

import { MouseEvent, useRef, useState } from "react";
import styles from "./PolarConsole.module.css";

const transmissions = [
  "I detect an unconventional idea. Good. Conventional ideas already have enough consultants.",
  "Vision integrity stable. Operational architecture is the next requirement.",
  "Contradictions are not defects. They are coordinates. I am mapping them now.",
  "BI POLARIZE protocol ready. Bring me the part nobody else understands.",
];

export function PolarConsole() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [diagnostic, setDiagnostic] = useState(false);
  const [tracking, setTracking] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  function trackPointer(event: MouseEvent<HTMLDivElement>) {
    const node = consoleRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
  }

  function resetTracking() {
    if (consoleRef.current) consoleRef.current.style.transform = "";
    setTracking(false);
  }

  return (
    <div
      ref={consoleRef}
      className={styles.console}
      onMouseEnter={() => setTracking(true)}
      onMouseMove={trackPointer}
      onMouseLeave={resetTracking}
    >
      <div className={styles.top}>
        <span>P.O.L.A.R. PAW // CORE INTERFACE</span>
        <span className={styles.live}>ONLINE</span>
      </div>

      <div className={styles.stage}>
        <div className={styles.rings} />
        <img className={styles.mark} src="/brand/compact-mark.png" alt="Official P.O.L.A.R. Paw mark" width={512} height={512} />
        <div className={styles.scan} />
      </div>

      <div className={styles.transmission} aria-live="polite">
        <b>P.O.L.A.R. TRANSMISSION // SELECT ADVANCE</b>
        {diagnostic
          ? "Diagnostic complete. The vision is not too complicated. It is under-architected."
          : transmissions[messageIndex]}
      </div>

      <div className={styles.readout}>
        <div><small>CORE</small><strong>P.O.L.A.R.</strong></div>
        <div><small>FUNCTION</small><strong>{diagnostic ? "VISION ANALYSIS" : "IDEA RETRIEVAL"}</strong></div>
        <div><small>STATUS</small><strong className={styles.cyan}>{tracking ? "TRACKING" : "READY"}</strong></div>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setMessageIndex((messageIndex + 1) % transmissions.length)}>ADVANCE TRANSMISSION</button>
        <button onClick={() => setDiagnostic(!diagnostic)}>{diagnostic ? "RETURN TO PRIMARY" : "RUN DIAGNOSTIC"}</button>
      </div>
    </div>
  );
}
