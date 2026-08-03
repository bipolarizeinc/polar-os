"use client";

import { useEffect } from "react";

const INTRO_SELECTOR = '[aria-label="P.O.L.A.R. introduction"]';
const VOICE_KEY = "polar:voice-enabled:v1";

export function PolarIntroAutoRelease() {
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let releaseTimer: ReturnType<typeof setTimeout> | null = null;
    let greetingTimer: ReturnType<typeof setTimeout> | null = null;

    const armIntro = () => {
      const intro = document.querySelector<HTMLElement>(INTRO_SELECTOR);
      if (!intro || intro.dataset.autoReleaseArmed === "true") return;
      intro.dataset.autoReleaseArmed = "true";

      if (localStorage.getItem(VOICE_KEY) === "true" && "speechSynthesis" in window) {
        greetingTimer = setTimeout(() => {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            "Welcome to B I POLARIZE ENTERPRISES. I'm P O L A R. Tell me what you're building.",
          );
          utterance.rate = 1.03;
          utterance.pitch = 1.35;
          utterance.volume = 0.92;
          window.speechSynthesis.speak(utterance);
        }, 500);
      }

      releaseTimer = setTimeout(() => {
        const buttons = Array.from(intro.querySelectorAll<HTMLButtonElement>("button"));
        const skip = buttons.find((button) => button.textContent?.includes("SKIP INTRODUCTION"));
        skip?.click();
      }, 8_000);
    };

    armIntro();
    observer = new MutationObserver(armIntro);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      if (releaseTimer) clearTimeout(releaseTimer);
      if (greetingTimer) clearTimeout(greetingTimer);
    };
  }, []);

  return null;
}
