"use client";

import { MouseEvent, useRef, useState } from "react";
import styles from "./PolarConsole.module.css";

const transmissions = [
  "I detect an unconventional idea. Good. Conventional ideas already have enough consultants.",
  "Vision integrity stable. Operational architecture is the next requirement.",
  "Contradictions are not defects. They are coordinates. I am mapping them now.",
  "BI POLARIZE protocol ready. Bring me the part nobody else understands.",
  "Institutional memory link established. Your intelligence does not have to disappear when you leave the room.",
];

const modules = ["RESEARCH", "ARCHITECTURE", "DOCUMENTATION", "DEPLOYMENT"];

export function PolarConsole() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [diagnostic, setDiagnostic] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [activeModule, setActiveModule] = useState("POLAR CORE");
  const [summoned, setSummoned] = useState(false);
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

  const polarImage = diagnostic || summoned ? "/brand/polar-activated.png" : "/brand/polar-primary.png";

  return (
    <div ref={consoleRef} className={styles.console} onMouseEnter={() => setTracking(true)} onMouseMove={trackPointer} onMouseLeave={resetTracking}>
      <div className={styles.top}><span>P.O.L.A.R. // PERSONALIZED OPERATIONS LIAISON</span><span className={styles.live}>ONLINE</span></div>

      <div className={`${styles.stage} ${summoned ? styles.summoned : ""}`}>
        <div className={styles.rings} />
        <div className={styles.moduleOrbit}>
          {modules.map((module, index) => <button key={module} className={styles[`module${index + 1}`]} onClick={() => setActiveModule(module)} aria-label={`Activate ${module}`}>{module.slice(0, 3)}</button>)}
        </div>
        <img className={styles.entityImage} key={polarImage} src={polarImage} alt="P.O.L.A.R., the BI POLARIZE enterprise intelligence companion" width={1536} height={1024} />
        <div className={styles.scan} />
        <div className={styles.identityTag}><b>P.O.L.A.R.</b><span>PROTECT · GUIDE · RETRIEVE · BUILD</span></div>
      </div>

      <div className={styles.transmission} aria-live="polite">
        <b>{activeModule} // {summoned ? "ENTITY LINK ACTIVE" : "SELECT ADVANCE"}</b>
        {summoned ? "P.O.L.A.R. presence established. Guidance protocol is online." : diagnostic ? "Diagnostic complete. The vision is not too complicated. It is under-architected." : transmissions[messageIndex]}
      </div>

      <div className={styles.readout}>
        <div><small>CORE</small><strong>{activeModule}</strong></div>
        <div><small>FUNCTION</small><strong>{diagnostic ? "VISION ANALYSIS" : "IDEA RETRIEVAL"}</strong></div>
        <div><small>STATUS</small><strong className={styles.cyan}>{summoned ? "SUMMONED" : tracking ? "TRACKING" : "READY"}</strong></div>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setMessageIndex((messageIndex + 1) % transmissions.length)}>ADVANCE TRANSMISSION</button>
        <button onClick={() => setDiagnostic(!diagnostic)}>{diagnostic ? "RETURN TO PRIMARY" : "RUN DIAGNOSTIC"}</button>
        <button onClick={() => setSummoned(!summoned)}>{summoned ? "RELEASE P.O.L.A.R." : "SUMMON P.O.L.A.R."}</button>
      </div>
    </div>
  );
}
