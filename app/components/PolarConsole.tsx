"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function PolarConsole() {
  const [sound, setSound] = useState(false);
  const [diagnostic, setDiagnostic] = useState(false);
  const [bootOpen, setBootOpen] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  function toggleSound() {
    if (!audio.current) return;
    if (sound) audio.current.pause(); else void audio.current.play();
    setSound(!sound);
  }

  return (
    <div className="polar-console">
      <div className="console-top"><span>P.O.L.A.R. // ONLINE</span><span className="live-pip">LIVE</span></div>
      <div className="polar-portrait">
        <Image src={diagnostic ? "/brand/polar-activated.png" : "/brand/polar-primary.png"} alt="P.O.L.A.R., cybernetic guide dog for BI POLARIZE" fill priority sizes="(max-width: 900px) 90vw, 44vw" />
        <div className="reticle r1" /><div className="reticle r2" />
        <div className="scan-beam" />
      </div>
      <div className="console-readout">
        <div><small>UNIT</small><strong>P.O.L.A.R.</strong></div>
        <div><small>FUNCTION</small><strong>IDEA EXTRACTION</strong></div>
        <div><small>STATUS</small><strong className="cyan">READY</strong></div>
      </div>
      <div className="console-controls">
        <button className="sound-control" onClick={toggleSound} aria-pressed={sound}><span>{sound ? "◼" : "▶"}</span> {sound ? "PAUSE" : "HEAR POLAR"}</button>
        <button className="sound-control" onClick={() => setDiagnostic(!diagnostic)} aria-pressed={diagnostic}>{diagnostic ? "PRIMARY STATE" : "DIAGNOSTIC STATE"}</button>
        <button className="sound-control" onClick={() => setBootOpen(true)}>BOOT FILM ↗</button>
      </div>
      <audio ref={audio} src="/media/polar-voice.mp3" onEnded={() => setSound(false)} />
      {bootOpen && <div className="boot-modal" role="dialog" aria-modal="true" aria-label="POLAR boot film"><button onClick={() => setBootOpen(false)} aria-label="Close boot film">CLOSE ×</button><video src="/media/polar-intro.mp4" controls autoPlay playsInline /></div>}
    </div>
  );
}
