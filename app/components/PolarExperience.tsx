"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./PolarExperience.module.css";

type ModuleKey = "products" | "blueprint" | "drdocx" | "nexus" | "about" | "intake";

type TransitionCopy = {
  title: string;
  subtitle: string;
  speech: string;
};

const STORAGE = {
  introSeen: "polar:intro-seen:v1",
  voice: "polar:voice-enabled:v1",
  reducedMotion: "polar:reduced-motion:v1",
};

const TRANSITIONS: Record<ModuleKey, TransitionCopy> = {
  products: {
    title: "P.O.L.A.R. MODULE NETWORK",
    subtitle: "ACCESSING PRODUCT SYSTEMS",
    speech: "Accessing product systems.",
  },
  blueprint: {
    title: "BLUEPRINT™",
    subtitle: "ARCHITECTURE PROTOCOL INITIALIZED",
    speech: "Blueprint architecture protocol initialized.",
  },
  drdocx: {
    title: "DR.DOCX™",
    subtitle: "DOCUMENTATION CORE ONLINE",
    speech: "Doctor Doc X documentation core online.",
  },
  nexus: {
    title: "NEXUS™",
    subtitle: "AUTOMATION PATHWAYS CONNECTING",
    speech: "Nexus automation pathways connecting.",
  },
  about: {
    title: "FOUNDER INTELLIGENCE",
    subtitle: "ACCESSING ORIGIN RECORD",
    speech: "Accessing founder origin record.",
  },
  intake: {
    title: "P.O.L.A.R. INTAKE",
    subtitle: "SECURE TRANSMISSION CHANNEL OPEN",
    speech: "Secure transmission channel open.",
  },
};

function resolveModule(target: HTMLAnchorElement): ModuleKey | null {
  const explicit = target.dataset.polarModule as ModuleKey | undefined;
  if (explicit && explicit in TRANSITIONS) return explicit;

  const href = target.getAttribute("href")?.toLowerCase() ?? "";
  const text = target.textContent?.toLowerCase() ?? "";

  if (href.includes("#products") || href.includes("/services") || text.includes("product")) return "products";
  if (text.includes("blueprint")) return "blueprint";
  if (text.includes("dr.docx") || text.includes("doctor doc")) return "drdocx";
  if (text.includes("nexus")) return "nexus";
  if (href.includes("/about") || text.includes("founder")) return "about";
  if (href.includes("/contact") || href.includes("/intake") || text.includes("intake") || text.includes("tell us")) return "intake";
  return null;
}

export function PolarExperience() {
  const router = useRouter();
  const pathname = usePathname();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHref = useRef<string | null>(null);

  const [introOpen, setIntroOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeTransition, setActiveTransition] = useState<TransitionCopy | null>(null);
  const [idleOpen, setIdleOpen] = useState(false);

  const speak = useCallback((message: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.03;
    utterance.pitch = 1.35;
    utterance.volume = 0.92;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const closeIntro = useCallback(() => {
    setIntroOpen(false);
    localStorage.setItem(STORAGE.introSeen, "true");
  }, []);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIdleOpen(false);
    idleTimer.current = setTimeout(() => {
      setIdleOpen(true);
      speak("Ummm, are you okay? Is everything alright? You can always tell me about your thing, idea, or issue directly.");
    }, 180_000);
  }, [speak]);

  useEffect(() => {
    const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const storedReduced = localStorage.getItem(STORAGE.reducedMotion);
    const shouldReduce = storedReduced === null ? systemReduced : storedReduced === "true";
    const storedVoice = localStorage.getItem(STORAGE.voice) === "true";
    const seen = localStorage.getItem(STORAGE.introSeen) === "true";

    setReducedMotion(shouldReduce);
    setVoiceEnabled(storedVoice);
    setIntroOpen(!seen);
  }, []);

  useEffect(() => {
    const activities: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];
    activities.forEach((event) => window.addEventListener(event, resetIdle, { passive: true }));
    document.addEventListener("visibilitychange", resetIdle);
    resetIdle();

    return () => {
      activities.forEach((event) => window.removeEventListener(event, resetIdle));
      document.removeEventListener("visibilitychange", resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const moduleKey = resolveModule(anchor);
      if (!moduleKey) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      event.preventDefault();
      const copy = TRANSITIONS[moduleKey];
      setActiveTransition(copy);
      speak(copy.speech);

      const duration = reducedMotion ? 160 : 880;
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      pendingHref.current = href;
      transitionTimer.current = setTimeout(() => {
        const destination = pendingHref.current;
        pendingHref.current = null;
        setActiveTransition(null);
        if (!destination) return;

        if (destination.startsWith("#")) {
          document.querySelector(destination)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
          history.replaceState(null, "", `${pathname}${destination}`);
        } else if (destination.startsWith("/")) {
          router.push(destination);
        } else {
          window.location.assign(destination);
        }
      }, duration);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, [pathname, reducedMotion, router, speak]);

  const enableVoice = () => {
    setVoiceEnabled(true);
    localStorage.setItem(STORAGE.voice, "true");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Voice channel enabled.");
      utterance.rate = 1.03;
      utterance.pitch = 1.35;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem(STORAGE.reducedMotion, String(next));
  };

  return (
    <>
      {introOpen && (
        <section className={`${styles.overlay} ${styles.intro} ${reducedMotion ? styles.reduced : ""}`} aria-label="P.O.L.A.R. introduction">
          <div className={styles.energy} aria-hidden="true" />
          <div className={styles.scanline} aria-hidden="true" />
          <div className={styles.silhouette} aria-hidden="true">P</div>
          <div className={styles.introCopy}>
            <span>BI POLARIZE ENTERPRISES, INC.</span>
            <h1>WELCOME.</h1>
            <h2>I’M P.O.L.A.R.</h2>
            <p>TELL ME WHAT YOU’RE BUILDING.</p>
            <div className={styles.caption}>Welcome to BI POLARIZE ENTERPRISES. I’m P.O.L.A.R. Tell me what you’re building.</div>
            <strong>POLAR OS // SYSTEM READY</strong>
          </div>
          <div className={styles.controls}>
            {!voiceEnabled && <button type="button" onClick={enableVoice}>ENABLE VOICE</button>}
            <button type="button" onClick={closeIntro}>SKIP INTRODUCTION</button>
          </div>
        </section>
      )}

      {activeTransition && (
        <section className={`${styles.overlay} ${styles.transition} ${reducedMotion ? styles.reduced : ""}`} aria-live="polite">
          <div className={styles.energy} aria-hidden="true" />
          <div className={styles.scanline} aria-hidden="true" />
          <div className={styles.moduleCopy}>
            <small>POLAR OS // MODULE ACCESS</small>
            <h2>{activeTransition.title}</h2>
            <p>{activeTransition.subtitle}</p>
            <span>MODULE CODE // POL-7709</span>
            <i aria-hidden="true"><b /></i>
          </div>
        </section>
      )}

      {idleOpen && !introOpen && !activeTransition && (
        <aside className={styles.idle} role="status">
          <button type="button" aria-label="Dismiss P.O.L.A.R. check-in" onClick={resetIdle}>×</button>
          <small>P.O.L.A.R. // PRESENCE CHECK</small>
          <h2>UMMM… ARE YOU OKAY?</h2>
          <p>Is everything alright? You can always tell me about your thing, idea, or issue directly.</p>
          <a href="/intake" data-polar-module="intake">TELL P.O.L.A.R. YOUR THING →</a>
        </aside>
      )}

      <div className={styles.utility}>
        <button type="button" onClick={() => setIntroOpen(true)}>REPLAY INTRO</button>
        {!voiceEnabled && <button type="button" onClick={enableVoice}>ENABLE VOICE</button>}
        <button type="button" onClick={toggleMotion}>{reducedMotion ? "ENABLE MOTION" : "REDUCE MOTION"}</button>
      </div>
    </>
  );
}
