"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./founder.module.css";

type AuthState = "checking" | "locked" | "authenticated";

type Connection = {
  key: string;
  label: string;
  status: "live-verified" | "code-ready" | "planned";
  action?: "zoho";
};

const CONNECTIONS: Connection[] = [
  { key: "gmail", label: "Gmail", status: "live-verified" },
  { key: "google-drive", label: "Google Drive", status: "live-verified" },
  { key: "google-calendar", label: "Google Calendar", status: "live-verified" },
  { key: "github", label: "GitHub", status: "live-verified" },
  { key: "supabase", label: "Supabase", status: "live-verified" },
  { key: "vercel", label: "Vercel", status: "live-verified" },
  { key: "zoho-mail", label: "Zoho Mail", status: "code-ready", action: "zoho" },
  { key: "facebook", label: "Facebook", status: "code-ready" },
  { key: "instagram", label: "Instagram", status: "code-ready" },
  { key: "tiktok", label: "TikTok", status: "code-ready" },
  { key: "linkedin", label: "LinkedIn", status: "code-ready" },
  { key: "cloudflare", label: "Cloudflare R2 / WAF", status: "code-ready" },
  { key: "google-business", label: "Google Business Profile", status: "planned" },
  { key: "google-voice", label: "Google Voice", status: "planned" },
  { key: "realtime-voice", label: "Realtime Voice", status: "planned" },
  { key: "speaker-identity", label: "Speaker Identity", status: "planned" },
  { key: "polar-mobile", label: "P.O.L.A.R. Mobile", status: "planned" },
];

export default function FounderControlPage() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const counts = useMemo(() => ({
    live: CONNECTIONS.filter((item) => item.status === "live-verified").length,
    ready: CONNECTIONS.filter((item) => item.status === "code-ready").length,
    planned: CONNECTIONS.filter((item) => item.status === "planned").length,
  }), []);

  useEffect(() => {
    fetch("/api/founder/auth/status", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          setAuth("locked");
          return;
        }
        setExpiresAt(body.expiresAt ?? null);
        setAuth("authenticated");
      })
      .catch(() => setAuth("locked"));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const bootstrapToken = String(data.get("bootstrapToken") ?? "").trim();
    const response = await fetch("/api/founder/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bootstrapToken }),
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.error ?? "Founder credential rejected.");
      setBusy(false);
      return;
    }
    form.reset();
    setExpiresAt(body.expiresAt ?? null);
    setAuth("authenticated");
    setBusy(false);
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/founder/auth/logout", { method: "POST", cache: "no-store" });
    setAuth("locked");
    setExpiresAt(null);
    setBusy(false);
  }

  async function connectZoho() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/founder/connections/zoho/start", {
      method: "POST",
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.authorizationUrl) {
      setError(body.error ?? "Zoho enrollment could not start.");
      setBusy(false);
      return;
    }
    window.location.assign(body.authorizationUrl);
  }

  if (auth === "checking") {
    return <main className={styles.shell}><p className={styles.eyebrow}>P.O.L.A.R. // VERIFYING FOUNDER AUTHORITY</p></main>;
  }

  if (auth === "locked") {
    return (
      <main className={styles.shell}>
        <section className={styles.lockPanel}>
          <p className={styles.eyebrow}>P.O.L.A.R. FOUNDER CONTROL // LOCKED</p>
          <h1>EXECUTIVE ACCESS</h1>
          <p>Enter a single-use founder bootstrap credential. Successful exchange creates an 8-hour HttpOnly session and permanently consumes the bootstrap credential.</p>
          <form onSubmit={login} className={styles.form} autoComplete="off">
            <label>FOUNDER BOOTSTRAP CREDENTIAL<input name="bootstrapToken" type="password" required minLength={32} autoComplete="off" /></label>
            <button disabled={busy}>{busy ? "VERIFYING..." : "UNLOCK FOUNDER CONTROL"}</button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>P.O.L.A.R. // FOUNDER AUTHORITY VERIFIED</p>
          <h1>FOUNDER CONTROL</h1>
          <p>Connector enrollment, authority state, and enterprise integration status.</p>
        </div>
        <button onClick={logout} disabled={busy} className={styles.secondary}>LOCK CONTROL</button>
      </header>

      <section className={styles.metrics}>
        <article><span>LIVE VERIFIED</span><strong>{counts.live}</strong></article>
        <article><span>CODE READY</span><strong>{counts.ready}</strong></article>
        <article><span>PLANNED</span><strong>{counts.planned}</strong></article>
        <article><span>SESSION</span><strong>{expiresAt ? "ACTIVE" : "VERIFIED"}</strong></article>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.grid}>
        {CONNECTIONS.map((connection) => (
          <article key={connection.key} className={styles.card}>
            <div>
              <span className={styles.status} data-status={connection.status}>{connection.status.replace("-", " ").toUpperCase()}</span>
              <h2>{connection.label}</h2>
            </div>
            {connection.action === "zoho" ? (
              <button onClick={connectZoho} disabled={busy}>CONNECT ZOHO</button>
            ) : (
              <p>{connection.status === "live-verified" ? "Authenticated and live-read verified." : connection.status === "code-ready" ? "Runtime wiring exists. Provider authorization remains." : "Subsystem architecture exists; activation is pending."}</p>
            )}
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <span>FOUNDER SESSION: HTTPONLY · SECURE · SAMESITE STRICT · 8H MAX</span>
        <span>CONSEQUENTIAL ACTIONS REMAIN APPROVAL-GATED</span>
      </footer>
    </main>
  );
}
