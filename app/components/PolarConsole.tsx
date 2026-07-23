"use client";

import { useRef, useState } from "react";

export function PolarConsole() {
  const [sound, setSound] = useState(false);
  const [diagnostic, setDiagnostic] = useState(false);
  const [bootOpen, setBootOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  function toggleSound() {
    if (!audio.current) return;
    if (sound) audio.current.pause();
    else void audio.current.play();
    setSound(!sound);
  }

  const polarImage = diagnostic
    ? "/brand/polar-activated.png"
    : "/brand/polar-primary.png";

  return (
    <div className="polar-console">
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

      <div className="console-readout">
        <div><small>UNIT</small><strong>P.O.L.A.R.</strong></div>
        <div><small>FUNCTION</small><strong>IDEA EXTRACTION</strong></div>
        <div><small>STATUS</small><strong className="cyan">READY</strong></div>
      </div>

      <div className="console-controls">
        <button className="sound-control" onClick={toggleSound} aria-pressed={sound}>
          <span>{sound ? "◼" : "▶"}</span> {sound ? "PAUSE" : "HEAR POLAR"}
        </button>
        <button className="sound-control" onClick={() => setDiagnostic(!diagnostic)} aria-pressed={diagnostic}>
          {diagnostic ? "PRIMARY STATE" : "DIAGNOSTIC STATE"}
        </button>
        <button
          className="sound-control"
          onClick={() => {
            setVideoError(false);
            setBootOpen(true);
          }}
        >
          BOOT FILM ↗
        </button>
      </div>

      <audio ref={audio} preload="metadata" src="/media/polar-voice.mp3" onEnded={() => setSound(false)} />

      {bootOpen && (
        <div className="boot-modal" role="dialog" aria-modal="true" aria-label="POLAR boot film">
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
