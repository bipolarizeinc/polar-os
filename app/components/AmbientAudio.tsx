"use client";

import { useEffect, useRef, useState } from "react";

export function AmbientAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioScheduledSourceNode[]>([]);
  const [active, setActive] = useState(false);

  function buildSoundscape() {
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass || contextRef.current) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    master.gain.value = 0;
    filter.type = "lowpass";
    filter.frequency.value = 720;
    filter.Q.value = 0.7;
    master.connect(filter);
    filter.connect(context.destination);

    const frequencies = [55, 82.41, 110, 164.81, 220];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index < 2 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = [0.48, 0.22, 0.12, 0.07, 0.04][index];
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      return oscillator;
    });

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 150;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    contextRef.current = context;
    masterRef.current = master;
    nodesRef.current = [...oscillators, lfo];
  }

  async function start() {
    buildSoundscape();
    const context = contextRef.current;
    if (!context) return;
    await context.resume();
    masterRef.current?.gain.cancelScheduledValues(context.currentTime);
    masterRef.current?.gain.setTargetAtTime(0.055, context.currentTime, 0.8);
    setActive(true);
  }

  function stop() {
    const context = contextRef.current;
    if (!context || !masterRef.current) return;
    masterRef.current.gain.cancelScheduledValues(context.currentTime);
    masterRef.current.gain.setTargetAtTime(0, context.currentTime, 0.3);
    setActive(false);
  }

  function toggle() {
    if (active) stop();
    else void start();
  }

  useEffect(() => {
    const attemptStart = () => void start().catch(() => undefined);
    void start().catch(() => undefined);
    window.addEventListener("pointerdown", attemptStart, { once: true });
    window.addEventListener("keydown", attemptStart, { once: true });
    window.addEventListener("touchstart", attemptStart, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", attemptStart);
      window.removeEventListener("keydown", attemptStart);
      window.removeEventListener("touchstart", attemptStart);
      nodesRef.current.forEach((node) => {
        try { node.stop(); } catch {}
      });
      void contextRef.current?.close();
    };
  }, []);

  return (
    <button className="ambient-control" data-active={active} onClick={toggle} aria-pressed={active}>
      <i /> {active ? "BACKGROUND AUDIO ON" : "ENABLE BACKGROUND AUDIO"}
    </button>
  );
}
