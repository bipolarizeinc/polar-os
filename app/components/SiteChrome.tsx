"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IntakeLink } from "./IntakeLink";
import { PolarScrollExperience } from "./PolarScrollExperience";
import styles from "./SiteChrome.module.css";

const links = [
  ["Home", "/"],
  ["Products", "/#products"],
  ["Solutions", "/services"],
  ["P.O.L.A.R.", "/#polar"],
  ["About", "/about"],
  ["Press", "/press"],
  ["Join", "/join"],
  ["Contact", "/contact"],
] as const;

function PolarAudioControl() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.22);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("polar-audio-enabled");
    if (stored === "true" && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {
        window.sessionStorage.setItem("polar-audio-enabled", "false");
      });
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setPlaying(true);
      window.sessionStorage.setItem("polar-audio-enabled", "true");
    } else {
      audio.pause();
      setPlaying(false);
      window.sessionStorage.setItem("polar-audio-enabled", "false");
    }
  }

  return (
    <div className={styles.audioControl} aria-label="P.O.L.A.R. background music controls">
      <audio ref={audioRef} src="/brand/audio/YA.wav" loop preload="none" />
      <button type="button" onClick={toggleAudio} aria-pressed={playing}>
        {playing ? "Pause POLAR Music" : "Play POLAR Music"}
      </button>
      <input
        aria-label="Background music volume"
        type="range"
        min="0"
        max="0.55"
        step="0.05"
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
      />
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="system-strip">
        <span><i /> SYSTEM ACTIVE</span>
        <span>CLASSIFICATION: PUBLIC</span>
        <span>AUTHORIZATION: POLAR VERIFIED</span>
      </div>
      <div className="nav-shell">
        <Link href="/" className={`brand-lockup ${styles.headerBrand}`} aria-label="BI POLARIZE ENTERPRISES, INC. home" onClick={closeMenu}>
          <Image className={styles.headerSeal} src="/brand/official/02_official_corporate_seal.png" alt="BI POLARIZE ENTERPRISES, INC. corporate seal" width={64} height={64} priority />
          <span className={styles.brandName}>
            <strong>BI POLARIZE ENTERPRISES, INC.</strong>
            <small>OFF THE WALL · OUT OF THE BOX</small>
          </span>
        </Link>
        <button className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`} type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen((current) => !current)}><span /></button>
        <nav id="primary-navigation" aria-label="Primary navigation" className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}</Link>)}
        </nav>
        <div className={styles.desktopCta}><IntakeLink className="nav-cta" /></div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Image src="/brand/official/01_primary_corporate_logo.png" alt="BI POLARIZE ENTERPRISES, INC." width={250} height={194} />
          <p>Turning fragile human knowledge into durable institutional intelligence.</p>
          <Link href="/join" className={styles.joinEnterprise}>Join the Enterprise →</Link>
        </div>
        <div>
          <b>Explore</b>
          <Link href="/#products">Products</Link>
          <Link href="/services">Solutions</Link>
          <Link href="/#polar">P.O.L.A.R.</Link>
          <Link href="/about">About</Link>
          <Link href="/press">Press</Link>
          <Link href="/join">Join the Enterprise</Link>
        </div>
        <div>
          <b>Connect</b>
          <a href="tel:+18016868143">801-686-8143</a>
          <a href="mailto:YourThing@PolarPaw.Online">YourThing@PolarPaw.Online</a>
          <span>Open 24 / 7</span>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} BI POLARIZE ENTERPRISES, INC.</span>
        <span>OGDEN, UTAH · POWERED BY POLAR OS</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="polar-site">
      <PolarScrollExperience />
      <SiteHeader />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      <SiteFooter />
      <PolarAudioControl />
    </main>
  );
}
