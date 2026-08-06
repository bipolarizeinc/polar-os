"use client";

import Link from "next/link";
import { CSSProperties, FormEvent, useMemo, useState } from "react";
import { PageShell } from "../components/SiteChrome";
import { activePrizes, Prize } from "./rewards";
import styles from "./join.module.css";

function choosePrize(): { prize: Prize; index: number } {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  const index = values[0] % activePrizes.length;
  return { prize: activePrizes[index], index };
}

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("");

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const wheelStyle = { "--wheel-rotation": `${rotation}deg` } as CSSProperties;

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setMessage("Enter a valid email address.");
      return;
    }
    if (!accepted) {
      setMessage("Accept the promotional terms before unlocking the wheel.");
      return;
    }

    const key = `bpei-wheel:${normalizedEmail}`;
    const existing = window.localStorage.getItem(key);
    if (existing) {
      const prior = JSON.parse(existing) as Prize;
      setPrize(prior);
      setMessage("This email has already used its spin. Your saved reward is shown below.");
      setEligible(false);
      return;
    }

    setEligible(true);
    setMessage("Newsletter signup recorded for this browser. One fair spin unlocked.");
  }

  function spin() {
    if (!eligible || spinning || prize) return;
    const result = choosePrize();
    const segment = 360 / activePrizes.length;
    const targetCenter = result.index * segment + segment / 2;
    const finalRotation = 1440 + (360 - targetCenter);

    setSpinning(true);
    setRotation(finalRotation);
    setMessage("P.O.L.A.R. is calculating a real result. No decorative fake prizes involved.");

    window.setTimeout(() => {
      setPrize(result.prize);
      setSpinning(false);
      setEligible(false);
      window.localStorage.setItem(`bpei-wheel:${normalizedEmail}`, JSON.stringify(result.prize));
      setMessage("Reward issued. Final redemption code will be verified by BPEI before use.");
    }, 1900);
  }

  return (
    <PageShell>
      <section className={styles.hero}>
        <p className="eyebrow">JOIN THE ENTERPRISE // PUBLIC ACCESS</p>
        <h1>ENTER THE NETWORK.<br /><em>EARN YOUR ADVANTAGE.</em></h1>
        <p>Subscribe for enterprise updates, practical founder intelligence, new Academy releases, and one transparent promotional reward spin.</p>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <span className={styles.index}>01 // NEWSLETTER + REWARD</span>
          <h2>Unlock one fair spin.</h2>
          <p>Every reward shown on the wheel is genuinely available. The removed cash and free-service prizes are not displayed as fake possibilities.</p>

          <form onSubmit={register} className={styles.form}>
            <label htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            <label className={styles.consent}>
              <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
              <span>I agree to receive BPEI updates and accept the promotional terms, eligibility limits, expiration rules, and verification process.</span>
            </label>
            <button type="submit">UNLOCK REWARD WHEEL</button>
          </form>

          <div className={styles.pointer} aria-hidden="true" />
          <div className={`${styles.wheel} ${spinning ? styles.spinning : ""}`} style={wheelStyle} aria-label="BPEI reward wheel">
            <div className={styles.wheelCore}>BPEI</div>
          </div>
          <button className={styles.spinButton} type="button" disabled={!eligible || spinning || Boolean(prize)} onClick={spin}>
            {spinning ? "SPINNING…" : prize ? "SPIN COMPLETE" : "SPIN ONCE"}
          </button>

          <p className={styles.status} role="status">{message}</p>
          {prize && <div className={styles.result}><small>POLAR VERIFIED REWARD</small><strong>{prize.label}</strong><code>{prize.code}</code></div>}
        </article>

        <article className={styles.panel}>
          <span className={styles.index}>02 // ETAS</span>
          <h2>Enterprise Talent Alignment System.</h2>
          <p>ETAS evaluates work style, strengths, operational compatibility, and potential placement within the BI POLARIZE enterprise architecture.</p>
          <p>Strong compatibility may lead to consideration for a possible BPEI employment, contractor, training, or enterprise opportunity. An assessment result does not guarantee an interview, engagement, or job offer.</p>
          <ul>
            <li>Role and division compatibility</li>
            <li>Operational strengths and development areas</li>
            <li>Potential training or Academy pathways</li>
            <li>Consent-based handling of assessment information</li>
          </ul>
          <Link href="/contact?path=etas" className={styles.action}>START ETAS PATH →</Link>
        </article>
      </section>

      <section className={styles.terms}>
        <h2>Promotion controls</h2>
        <p>One spin per verified participant. Rewards are subject to eligibility, availability, expiration, non-combination rules, and BPEI verification. This browser implementation prevents casual repeat spins; production launch requires server-side email verification and redemption tracking.</p>
      </section>
    </PageShell>
  );
}
