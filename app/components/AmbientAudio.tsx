"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function AmbientAudio() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState(false);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.14;
    await audio.play();
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setActive(false);
  }, []);

  const toggle = useCallback(() => {
    if (active) stop();
    else void start().catch(() => undefined);
  }, [active, start, stop]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/portal") || pathname.startsWith("/admin")) return null;

  return (
    <>
      <audio ref={audioRef} src="/media/innovate.mp3" loop preload="none" />
      <button className="ambient-control" data-active={active} onClick={toggle} aria-pressed={active} aria-label={active ? "Pause Innovate" : "Play Innovate"}>
        <span aria-hidden="true">{active ? "Ⅱ" : "♪"}</span><b>{active ? "PAUSE" : "PLAY"}</b><small>INNOVATE</small>
      </button>
    </>
  );
}
