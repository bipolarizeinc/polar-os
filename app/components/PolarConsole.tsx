"use client";

import { MouseEvent, useRef, useState } from "react";

const transmissions = [
  "I detect an unconventional idea. Good. Conventional ideas already have enough consultants.",
  "Vision integrity stable. Operational architecture is the next requirement.",
  "Contradictions are not defects. They are coordinates. I am mapping them now.",
  "BI POLARIZE protocol ready. Bring me the part nobody else understands.",
];

export function PolarConsole() {
  const [sound, setSound] = useState(false);
  const [diagnostic, setDiagnostic] = useState(false);
  const [bootOpen, setBootOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [tracking, setTracking] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  function toggleSound() {
    if (!audio.current) return;
    audio.current.volume = 0.35;
    if (sound) audio.current.pause();
    else void audio.current.play();
    setSound(!sound);
  }

  function trackPointer(event: MouseEvent<HTMLDivElement>) {
    const node = consoleRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
    const portrait = node.querySelector<HTMLImageElement>(".polar-portrait img");
    if (portrait) portrait.style.transform = `translate(${x * 10}px, ${y * 8}px) scale(1.025)`;
  }

  function resetTracking() {
    const node = consoleRef.current;
    if (node) node.style.transform = "";
    const portrait = node?.querySelector<HTMLImageElement>(".polar-portrait img");
    if (portrait) portrait.style.transform = "";
    setTracking(false);
  }

  const polarImage = diagnostic
    ? "/brand/polar-activated.png"
    : "/brand/polar-primary.png";

  return (
    <div
      ref={consoleRef}
      className={`polar-console${tracking ? " is-tracking" : ""}`}
      onMouseEnter={() => setTracking(true)}
      onMouseMove={trackPointer}
      onMouseLeave={resetTracking}
      onClick={() => setMessageIndex((messageIndex + 1) % transmissions.length)}
    >
      <div className="console-top">
        <span>P.O.L.A.R. // ONLINE</span>
        <span className="live-pip">LIVE</span>
      </div>

      <div className="polar-portrait">
        <img
          key={polarImage}
          src={polarImage}
          alt="P.O.L.A.R., cybernetic guide dog for BI POLARIZE"
          width={1024}
          height={1024}
          decoding="async"
          fetchPriority="high"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
        <div className="reticle r1" />
        <div className="reticle r2" />
        <div className="scan-beam" />
      </div>

      <div className="polar-message" aria-live="polite">
        <b>P.O.L.A.R. TRANSMISSION // CLICK TO ADVANCE</b>
        {transmissions[messageIndex]}
      </div>

      <div className="console-readout">
        <div><small>UNIT</small><strong>P.O.L.A.R.</strong></div>
        <div><small>FUNCTION</small><strong>{diagnostic ? "VISION ANALYSIS" : "IDEA EXTRACTION"}</strong></div>
        <div><small>STATUS</small><strong className="cyan">{tracking ? "TRACKING" : "READY"}</strong></div>
      </div>

      <div className="console-controls" onClick={(event) => event.stopPropagation()}>
        <button className="sound-control" onClick={toggleSound} aria-pressed={sound}>
          <span>{sound ? "◼" : "▶"}</span> {sound ? "PAUSE VOICE" : "HEAR P.O.L.A.R."}
        </button>
        <button className="sound-control" onClick={() => setDiagnostic(!diagnostic)} aria-pressed={diagnostic}>
          {diagnostic ? "RETURN TO PRIMARY" : "RUN DIAGNOSTIC"}
        </button>
        <button
          className="sound-control"
          onClick={() => {
            setVideoError(false);
            setBootOpen(true);
          }}
        >
          INITIATE BOOT FILM ↗
        </button>
      </div>

      <audio ref={audio} preload="metadata" src="/media/polar-voice.mp3" onEnded={() => setSound(false)} />

      {bootOpen && (
        <div className="boot-modal" role="dialog" aria-modal="true" aria-label="POLAR boot film" onClick={(event) => event.stopPropagation()}>
          <button onClick={() => setBootOpen(false)} aria-label="Close boot film">CLOSE ×</button>
          {videoError ? (
            <div className="video-fallback">
              <p>BOOT FILM TEMPORARILY UNAVAILABLE</p>
              <a href="/media/polar-intro.mp4" target="_blank" rel="noreferrer">OPEN VIDEO DIRECTLY ↗</a>
            </div>
          ) : (
            <video
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster="/brand/polar-primary.png"
              onError={() => setVideoError(true)}
            >
              <source src="/media/polar-intro.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          )}
        </div>
      )}
    </div>
  );
}
