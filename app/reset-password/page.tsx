"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../etsa/etsa.module.css";

export default function ResetPasswordPage() {
  const [accessToken, setAccessToken] = useState("");
  const [linkError, setLinkError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("access_token") ?? "";
    const recoveryLink = params.get("type") === "recovery";
    setAccessToken(token);
    setLinkError(!token || !recoveryLink);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirmation = String(data.get("confirmation") || "");
    if (password !== confirmation) {
      setBusy(false);
      setError("The passwords do not match.");
      return;
    }

    const response = await fetch("/api/etsa/auth/reset-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, password })
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(String(body.error || "Unable to update your password."));
      return;
    }
    setMessage(String(body.message));
  }

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>CUSTOMER ACCESS • PASSWORD RECOVERY</div>
    <h1 className={styles.title}>Choose a new password.</h1>
    <div className={styles.card}>
      {linkError ? <>
        <p className={styles.notice}>This recovery link is missing, invalid, or expired. Request a fresh link from the customer sign-in screen.</p>
        <div className={styles.actions}><Link className={styles.button} href="/welcome">RETURN TO SIGN IN</Link></div>
      </> : message ? <>
        <p className={styles.notice}>{message}</p>
        <div className={styles.actions}><Link className={styles.button} href="/welcome?mode=login">SIGN IN</Link></div>
      </> : <form className={styles.form} onSubmit={submit}>
        <div className={styles.field}><label htmlFor="password">New password</label><input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required /></div>
        <div className={styles.field}><label htmlFor="confirmation">Confirm password</label><input id="confirmation" name="confirmation" type="password" minLength={8} autoComplete="new-password" required /></div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.button} disabled={busy}>{busy ? "UPDATING…" : "UPDATE PASSWORD"}</button>
      </form>}
    </div>
  </div></main>;
}
