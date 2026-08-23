"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./PolarExperience.module.css";
import videoStyles from "./PolarVideo.module.css";

type ModuleKey = "products" | "blueprint" | "drdocx" | "nexus" | "about" | "intake";

type Transition = {
  title: string;
  subtitle: string;
  video: string;
};

const STORAGE = {
  introSeen: "polar:intro-seen:v2",
  sound: "polar:video-sound-enabled:v1",
  reducedMotion: "polar:reduced-motion:v1",
};

const INTRO_VIDEO = "/media/polar-intro.mp4";
const IDLE_VIDEO = "/media/polar/07_Intake_Transition.mp4";
const POLAR_POSTER = "/brand/launch-888/polar-portrait.png";

const TRANSITIONS: Record<ModuleKey, Transition> = {
  products: { title: "P.O.L.A.R. MODULE NETWORK", subtitle: "ACCESSING PRODUCT SYSTEMS", video: "/media/polar/02_Products_Transition.mp4" },
  blueprint: { title: "BLUEPRINT™", subtitle: "ARCHITECTURE PROTOCOL INITIALIZED", video: "/media/polar/03_Blueprint_Transition.mp4" },
  drdocx: { title: "DR.DOCX™", subtitle: "DOCUMENTATION CORE ONLINE", video: "/media/polar/04_DrDocx_Transition.mp4" },
  nexus: { title: "NEXUS™", subtitle: "AUTOMATION PATHWAYS CONNECTING", video: "/media/polar/05_Nexus_Transition.mp4" },
  about: { title: "FOUNDER INTELLIGENCE", subtitle: "ACCESSING ORIGIN RECORD", video: "/media/polar/06_About_Transition.mp4" },
  intake: { title: "P.O.L.A.R. INTAKE", subtitle: "SECURE TRANSMISSION CHANNEL OPEN", video: "/media/polar/07_Intake_Transition.mp4" },
};

function resolveModule(target: HTMLAnchorElement): ModuleKey | null {
  const explicit = target.dataset.polarModule as ModuleKey | undefined;
  if (explicit && explicit in TRANSITIONS) return explicit;
  return null;
}

export function PolarExperience() {
  const router = useRouter();
  const pathname = usePathname();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionFallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHref = useRef<string | null>(null);

  const [introOpen, setIntroOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeTransition, setActiveTransition] = useState<Transition | null>(null);
  const [idleOpen, setIdleOpen] = useState(false);
  const [introReplayKey, setIntroReplayKey] = useState(0);

  const closeIntro = useCallback(() => {
    setIntroOpen(false);
    localStorage.setItem(STORAGE.introSeen, "true");
  }, []);

  const completeNavigation = useCallback(() => {
    if (transitionFallback.current) clearTimeout(transitionFallback.current);
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
  }, [pathname, reducedMotion, router]);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIdleOpen(false);
    idleTimer.current = setTimeout(() => setIdleOpen(true), 180_000);
  }, []);

  useEffect(() => {
    const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const storedReduced = localStorage.getItem(STORAGE.reducedMotion);
    setReducedMotion(storedReduced === null ? systemReduced : storedReduced === "true");
    setSoundEnabled(localStorage.getItem(STORAGE.sound) === "true");
    setIntroOpen(localStorage.getItem(STORAGE.introSeen) !== "true");
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
      pendingHref.current = href;
      setActiveTransition(TRANSITIONS[moduleKey]);

      if (transitionFallback.current) clearTimeout(transitionFallback.current);
      transitionFallback.current = setTimeout(completeNavigation, reducedMotion ? 300 : 6000);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (transitionFallback.current) clearTimeout(transitionFallback.current);
    };
  }, [completeNavigation, reducedMotion]);

  const enableSound = () => {
    setSoundEnabled(true);
    localStorage.setItem(STORAGE.sound, "true");
    setIntroReplayKey((key) => key + 1);
  };

  const toggleMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem(STORAGE.reducedMotion, String(next));
  };

  return (
    <>
      {introOpen && (
        <section className={`${styles.overlay} ${videoStyles.videoOverlay} ${reducedMotion ? styles.reduced : ""}`} aria-label="P.O.L.A.R. introduction">
          <video key={`intro-${introReplayKey}`} className={videoStyles.fullVideo} src={INTRO_VIDEO} poster={POLAR_POSTER} autoPlay playsInline muted={!soundEnabled} preload="auto" onEnded={closeIntro} onError={closeIntro} />
          <div className={videoStyles.videoShade} aria-hidden="true" />
          <div className={videoStyles.videoStatus}>POLAR OS // SYSTEM READY</div>
          <div className={styles.controls}>
            {!soundEnabled && <button type="button" onClick={enableSound}>ENABLE SOUND + REPLAY</button>}
            <button type="button" onClick={closeIntro}>ENTER WEBSITE</button>
          </div>
        </section>
      )}

      {activeTransition && (
        <section className={`${styles.overlay} ${videoStyles.videoOverlay} ${reducedMotion ? styles.reduced : ""}`} aria-live="polite">
          <video className={videoStyles.fullVideo} src={activeTransition.video} poster={POLAR_POSTER} autoPlay playsInline muted={!soundEnabled} preload="auto" onEnded={completeNavigation} onError={completeNavigation} />
          <div className={videoStyles.videoShade} aria-hidden="true" />
          <div className={videoStyles.moduleLabel}>
            <small>POLAR OS // MODULE ACCESS</small>
            <strong>{activeTransition.title}</strong>
            <span>{activeTransition.subtitle}</span>
          </div>
        </section>
      )}

      {idleOpen && !introOpen && !activeTransition && (
        <aside className={styles.idle} role="status">
          <button type="button" aria-label="Dismiss P.O.L.A.R. check-in" onClick={resetIdle}>×</button>
          <video className={videoStyles.idleVideo} src={IDLE_VIDEO} poster={POLAR_POSTER} autoPlay playsInline muted={!soundEnabled} preload="metadata" />
          <small>P.O.L.A.R. // PRESENCE CHECK</small>
          <h2>UMMM… ARE YOU OKAY?</h2>
          <p>Is everything alright? You can always tell me about your thing, idea, or issue directly.</p>
          <a href="/intake" data-polar-module="intake">TELL P.O.L.A.R. YOUR THING →</a>
        </aside>
      )}

      <div className={styles.utility}>
        <button type="button" onClick={() => { setIntroReplayKey((key) => key + 1); setIntroOpen(true); }}>REPLAY INTRO</button>
        {!soundEnabled && <button type="button" onClick={enableSound}>ENABLE SOUND</button>}
        <button type="button" onClick={toggleMotion}>{reducedMotion ? "ENABLE MOTION" : "REDUCE MOTION"}</button>
      </div>
    </>
  );
}
