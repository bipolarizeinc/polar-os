"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./founder.module.css";
import securityStyles from "./security.module.css";

type AuthState = "checking" | "locked" | "authenticated";
type EnrollmentAction = "zoho" | "google-business" | "linkedin" | "tiktok";

type Connection = {
  key: string;
  label: string;
  status: "live-verified" | "code-ready" | "planned";
  action?: EnrollmentAction;
};

type Passkey = {
  id: string;
  label: string;
  transports: string[];
  lastUsedAt: string | null;
  createdAt: string;
  backupEligible: boolean | null;
  backupState: boolean | null;
};

type SecurityStatus = {
  activeSessions: number;
  recoveryCredentials: number;
  currentSessionExpiresAt: string;
  passkeys: Passkey[];
};

const CONNECTIONS: Connection[] = [
  { key: "gmail", label: "Gmail", status: "live-verified" },
  { key: "google-drive", label: "Google Drive", status: "live-verified" },
  { key: "google-calendar", label: "Google Calendar", status: "live-verified" },
  { key: "github", label: "GitHub", status: "live-verified" },
  { key: "supabase", label: "Supabase", status: "live-verified" },
  { key: "vercel", label: "Vercel", status: "live-verified" },
  { key: "zoho-mail", label: "Zoho Mail", status: "code-ready", action: "zoho" },
  { key: "google-business", label: "Google Business Profile", status: "code-ready", action: "google-business" },
  { key: "linkedin", label: "LinkedIn", status: "code-ready", action: "linkedin" },
  { key: "tiktok", label: "TikTok", status: "code-ready", action: "tiktok" },
  { key: "facebook", label: "Facebook", status: "code-ready" },
  { key: "instagram", label: "Instagram", status: "code-ready" },
  { key: "cloudflare", label: "Cloudflare R2 / WAF", status: "code-ready" },
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
  const [security, setSecurity] = useState<SecurityStatus | null>(null);

  const counts = useMemo(() => ({
    live: CONNECTIONS.filter((item) => item.status === "live-verified").length,
    ready: CONNECTIONS.filter((item) => item.status === "code-ready").length,
    planned: CONNECTIONS.filter((item) => item.status === "planned").length,
  }), []);

  async function loadSecurity() {
    const response = await fetch("/api/founder/security", { cache: "no-store" });
    if (!response.ok) return;
    const body = await response.json();
    setSecurity(body);
  }

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
        void loadSecurity();
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
    await loadSecurity();
    setBusy(false);
  }

  async function logout() {
    if (!window.confirm("Lock this Founder session now? You will need a passkey or recovery credential to return.")) return;
    setBusy(true);
    await fetch("/api/founder/auth/logout", { method: "POST", cache: "no-store" });
    setAuth("locked");
    setExpiresAt(null);
    setSecurity(null);
    setBusy(false);
  }

  async function securityAction(payload: Record<string, unknown>) {
    setBusy(true);
    setError("");
    const response = await fetch("/api/founder/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.error ?? "Security action failed.");
      setBusy(false);
      return false;
    }
    setBusy(false);
    return true;
  }

  async function renamePasskey(passkey: Passkey) {
    const label = window.prompt("Name this trusted device/passkey:", passkey.label)?.trim();
    if (!label || label === passkey.label) return;
    if (await securityAction({ action: "renamePasskey", passkeyId: passkey.id, label })) await loadSecurity();
  }

  async function revokePasskey(passkey: Passkey) {
    if (!window.confirm(`Revoke ${passkey.label}? That authenticator will no longer unlock Founder Control.`)) return;
    if (await securityAction({ action: "revokePasskey", passkeyId: passkey.id })) await loadSecurity();
  }

  async function lockAllSessions() {
    if (!window.confirm("LOCK ALL FOUNDER SESSIONS? This immediately signs out every active Founder session, including this one.")) return;
    if (await securityAction({ action: "lockAll" })) {
      setAuth("locked");
      setExpiresAt(null);
      setSecurity(null);
    }
  }

  async function connectProvider(action: EnrollmentAction) {
    setBusy(true);
    setError("");
    const endpoint = action === "zoho"
      ? "/api/founder/connections/zoho/start"
      : `/api/founder/connections/${action}/start`;
    const response = await fetch(endpoint, { method: "POST", cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.authorizationUrl) {
      setError(body.error ?? `${action} enrollment could not start.`);
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
          <p>Use an enrolled passkey for normal access. A valid single-use bootstrap credential remains the recovery path.</p>
          <button className={securityStyles.primaryWide} onClick={() => window.location.assign("/founder/passkey")}>UNLOCK WITH PASSKEY</button>
          <form onSubmit={login} className={styles.form} autoComplete="off">
            <label>RECOVERY BOOTSTRAP CREDENTIAL<input name="bootstrapToken" type="password" required minLength={32} autoComplete="off" /></label>
            <button disabled={busy}>{busy ? "VERIFYING..." : "USE RECOVERY CREDENTIAL"}</button>
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
          <p>Connector enrollment, security controls, authority state, and enterprise integration status.</p>
        </div>
        <button onClick={logout} disabled={busy} className={styles.secondary}>LOCK THIS SESSION</button>
      </header>

      <section className={styles.metrics}>
        <article><span>LIVE VERIFIED</span><strong>{counts.live}</strong></article>
        <article><span>CODE READY</span><strong>{counts.ready}</strong></article>
        <article><span>PLANNED</span><strong>{counts.planned}</strong></article>
        <article><span>SESSION</span><strong>{expiresAt ? "ACTIVE" : "VERIFIED"}</strong></article>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <section className={securityStyles.panel}>
        <div className={securityStyles.heading}>
          <div>
            <p className={styles.eyebrow}>SECURITY & LOGIN</p>
            <h2>FOUNDER ACCESS POLICY</h2>
          </div>
          <button className={securityStyles.button} onClick={() => window.location.assign("/founder/passkey")} disabled={busy}>ADD PASSKEY / DEVICE</button>
        </div>

        <div className={securityStyles.metrics}>
          <article><span>ACTIVE SESSIONS</span><strong>{security?.activeSessions ?? "—"}</strong></article>
          <article><span>ENROLLED PASSKEYS</span><strong>{security?.passkeys.length ?? "—"}</strong></article>
          <article><span>RECOVERY CREDENTIALS</span><strong>{security?.recoveryCredentials ?? "—"}</strong></article>
          <article><span>SESSION POLICY</span><strong>8 HOURS</strong></article>
        </div>

        <div className={securityStyles.list}>
          {(security?.passkeys ?? []).length === 0 ? (
            <div className={securityStyles.empty}>
              <strong>NO PASSKEY ENROLLED</strong>
              <p>Enroll this device before relying on recovery credentials alone.</p>
            </div>
          ) : security?.passkeys.map((passkey) => (
            <article key={passkey.id} className={securityStyles.row}>
              <div>
                <strong>{passkey.label}</strong>
                <span>Created {new Date(passkey.createdAt).toLocaleDateString()} · Last used {passkey.lastUsedAt ? new Date(passkey.lastUsedAt).toLocaleString() : "never"}</span>
              </div>
              <div className={securityStyles.actions}>
                <button onClick={() => renamePasskey(passkey)} disabled={busy} className={securityStyles.secondary}>RENAME</button>
                <button onClick={() => revokePasskey(passkey)} disabled={busy} className={securityStyles.criticalButton}>REVOKE</button>
              </div>
            </article>
          ))}
        </div>

        <div className={securityStyles.critical}>
          <div><strong>EMERGENCY SESSION CONTROL</strong><span>Immediately revoke every active Founder session.</span></div>
          <button onClick={lockAllSessions} disabled={busy} className={securityStyles.criticalButton}>LOCK ALL SESSIONS</button>
        </div>
      </section>

      <section className={styles.grid}>
        {CONNECTIONS.map((connection) => (
          <article key={connection.key} className={styles.card}>
            <div>
              <span className={styles.status} data-status={connection.status}>{connection.status.replace("-", " ").toUpperCase()}</span>
              <h2>{connection.label}</h2>
            </div>
            {connection.action ? (
              <button onClick={() => connectProvider(connection.action!)} disabled={busy}>
                CONNECT {connection.label.toUpperCase()}
              </button>
            ) : (
              <p>{connection.status === "live-verified" ? "Authenticated and live-read verified." : connection.status === "code-ready" ? "Runtime wiring exists. Provider authorization remains." : "Subsystem architecture exists; activation is pending."}</p>
            )}
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <span>FOUNDER SESSION: HTTPONLY · SECURE · SAMESITE STRICT · 8H MAX</span>
        <span>PASSKEY IS PRIMARY · RECOVERY CREDENTIAL IS BREAK-GLASS ACCESS</span>
      </footer>
    </main>
  );
}
