"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CustomerAuthPanel.module.css";

export function CustomerAuthPanel({ nextPath = "/dashboard" }: { nextPath?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

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
        setError("That email/password combination did not match. If this is your first visit, create a new customer account instead.");
      } else if (/already registered|already exists|user exists/i.test(message)) {
        setMode("login");
        setError("An account already exists for that email. Sign in with the password you created.");
      } else {
        setError(message);
      }
      return;
    }

    try {
      sessionStorage.setItem("bpei_dashboard_login", "1");
    } catch {
      // Session storage may be unavailable in strict privacy modes.
    }

    router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
    router.refresh();
  }

  return (
    <section className={styles.panel} aria-label="Customer access">
      <div className={styles.tabs} role="tablist" aria-label="Account access mode">
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

      <form className={styles.form} onSubmit={submit}>
        {mode === "register" && (
          <label>Full name<input name="fullName" autoComplete="name" required /></label>
        )}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
        {error && <div className={styles.error} role="alert">{error}</div>}
        <button className={styles.submit} disabled={loading}>
          {loading ? "AUTHENTICATING…" : mode === "register" ? "CREATE ACCESS & ENTER PORTAL" : "SIGN IN & ENTER PORTAL"}
        </button>
      </form>
    </section>
  );
}
