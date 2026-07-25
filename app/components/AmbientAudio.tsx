"use client";

import { useEffect, useRef, useState } from "react";

export function AmbientAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const [active, setActive] = useState(false);

  function buildSoundscape() {
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass || contextRef.current) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.018;
    master.connect(context.destination);

    const frequencies = [55, 82.41, 110];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.55 : 0.18;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      return oscillator;
    });

    contextRef.current = context;
    masterRef.current = master;
    nodesRef.current = oscillators;
  }

  async function start() {
    buildSoundscape();
    const context = contextRef.current;
    if (!context) return;
    await context.resume();
    masterRef.current?.gain.setTargetAtTime(0.018, context.currentTime, 0.4);
    setActive(true);
  }

  function stop() {
    const context = contextRef.current;
    if (!context || !masterRef.current) return;
    masterRef.current.gain.setTargetAtTime(0, context.currentTime, 0.25);
    setActive(false);
  }

  function toggle() {
    if (active) stop();
    else void start();
  }

  useEffect(() => {
    const attemptStart = () => void start();
    void start().catch(() => undefined);
    window.addEventListener("pointerdown", attemptStart, { once: true });
    window.addEventListener("keydown", attemptStart, { once: true });

    return () => {
      window.removeEventListener("pointerdown", attemptStart);
      window.removeEventListener("keydown", attemptStart);
      nodesRef.current.forEach((node) => node.stop());
      void contextRef.current?.close();
    };
  }, []);

  return (
    <button className="ambient-control" data-active={active} onClick={toggle} aria-pressed={active}>
      <i /> {active ? "AMBIENT SYSTEM ON" : "ENABLE AMBIENT SYSTEM"}
    </button>
  );
}
