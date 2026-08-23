"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function AmbientAudio() {
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

  return (
    <>
      <audio ref={audioRef} src="/media/polar-ambient.mp3" loop preload="none" />
      <button className="ambient-control" data-active={active} onClick={toggle} aria-pressed={active}>
        <i /> {active ? "BACKGROUND MUSIC ON" : "PLAY BACKGROUND MUSIC"}
      </button>
    </>
  );
}
