"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { customerDestination } from "../lib/customer-navigation";
import styles from "./CustomerAuthPanel.module.css";

export function CustomerAuthPanel({ nextPath = "/dashboard", initialMode = "login" }: { nextPath?: string; initialMode?: "register" | "login" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function requestReset() {
    const emailInput = document.querySelector<HTMLInputElement>("#customer-email");
    const email = emailInput?.value.trim() ?? "";
    if (!email) {
      setError("Enter your account email first, then request a reset link.");
      emailInput?.focus();
      return;
    }
    setLoading(true);
    setError("");
    const response = await fetch("/api/etsa/auth/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const body = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) setError(String(body.error || "Unable to request a reset link."));
    else setNotice(String(body.message));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData(event.currentTarget);
      const payload = mode === "register"
        ? {
            fullName: String(data.get("fullName") || "").trim(),
            email: String(data.get("email") || "").trim(),
            password: String(data.get("password") || ""),
          }
        : {
            email: String(data.get("email") || "").trim(),
            password: String(data.get("password") || ""),
          };

      const response = await fetch(`/api/etsa/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      setLoading(false);

      if (!response.ok) {
        const message = String(body.error || "Unable to continue.");
        if (mode === "login") {
          setError(message);
        } else if (/already registered|already exists/i.test(message)) {
          setMode("login");
          setError("An account already exists for that email. Sign in with the password you created.");
        } else {
          setError(message);
        }
        return;
      }

      if (body.confirmationRequired) {
        setMode("login");
        setNotice(body.message);
        return;
      }

      try {
        sessionStorage.setItem("bpei_dashboard_login", "1");
      } catch {}

      router.push(customerDestination(nextPath));
      router.refresh();
    } catch {
      setLoading(false);
      setError("The customer gateway could not reach the authentication service. Please try again.");
    }
  }

  return (
    <section className={styles.panel} aria-label="Customer access">
      <div className={styles.tabs} role="group" aria-label="Account access mode">
        <button type="button" data-active={mode === "register"} onClick={() => { setMode("register"); setError(""); }}>CREATE ACCOUNT</button>
        <button type="button" data-active={mode === "login"} onClick={() => { setMode("login"); setError(""); }}>SIGN IN</button>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>SECURE CUSTOMER ACCESS // P.O.L.A.R. GATE</p>
        <h2>{mode === "register" ? "CREATE YOUR ACCESS." : "WELCOME BACK."}</h2>
        <p>{mode === "register"
          ? "Create one account to unlock the customer portal, BPEI divisions, ETSA™, services, and P.O.L.A.R. systems."
          : "Use the same email and password attached to your BPEI customer account."}</p>
      </div>

      {notice && <p role="status">{notice}</p>}
      <form className={styles.form} onSubmit={submit}>
        {mode === "register" && <label>Full name<input name="fullName" autoComplete="name" required /></label>}
        <label>Email<input id="customer-email" name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
        {mode === "login" && <button className={styles.reset} type="button" onClick={requestReset} disabled={loading}>FORGOT PASSWORD?</button>}
        {error && <div className={styles.error} role="alert">{error}</div>}
        <button className={styles.submit} disabled={loading}>
          {loading ? "AUTHENTICATING…" : mode === "register" ? "CREATE ACCESS & ENTER DASHBOARD" : "SIGN IN & ENTER DASHBOARD"}
        </button>
      </form>
    </section>
  );
}
