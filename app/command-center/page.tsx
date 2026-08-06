"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import styles from "./command-center.module.css";

type Session = {
  extraction_id: string;
  status: string;
  founder_name: string | null;
  company_name: string | null;
  thing: string;
  audience: string;
  problem: string;
  blocker: string;
  desired_outcome: string;
  recommended_module: string | null;
  routing_reason: string | null;
  progress_percent: number;
  clarity_score: number | null;
  readiness_score: number | null;
  contradiction_flags: string[] | null;
  risk_flags: string[] | null;
  blueprint_brief: Record<string, unknown> | null;
  analysis_snapshot: {
    priorities?: string[];
  } | null;
  last_saved_at: string | null;
};

export default function CommandCenterPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function recover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/intake/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error ?? "POLAR could not recover this command session.");
      setLoading(false);
      return;
    }

    setSession(body.session);
    setLoading(false);
  }

  if (!session) {
    return (
      <main className={styles.shell}>
        <section className={styles.accessPanel}>
          <p className={styles.status}>POLAR COMMAND CENTER // SECURE ACCESS</p>
          <h1>RECOVER YOUR <em>BLUEPRINT.</em></h1>
          <p>Enter the extraction ID and one-time recovery credential issued when your intake was secured.</p>
          <form onSubmit={recover} className={styles.accessForm}>
            <label>EXTRACTION ID<input name="extractionId" required placeholder="BPX-20260805-XXXXXXXX" /></label>
            <label>RECOVERY TOKEN<input name="recoveryToken" required type="password" /></label>
            {error && <p className={styles.error}>{error}</p>}
            <button disabled={loading} type="submit">{loading ? "POLAR IS RETRIEVING..." : "ENTER COMMAND CENTER"}</button>
          </form>
          <Link href="/intake">START A NEW EXTRACTION →</Link>
        </section>
      </main>
    );
  }

  const priorities = session.analysis_snapshot?.priorities ?? [];

  return (
    <main className={styles.shell}>
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.status}>POLAR COMMAND CENTER // SESSION ACTIVE</p>
          <h1>{session.company_name || session.founder_name || "UNNAMED VENTURE"}</h1>
          <p>{session.extraction_id} · {session.status.toUpperCase()}</p>
        </div>
        <button onClick={() => setSession(null)}>LOCK SESSION</button>
      </header>

      <section className={styles.scoreGrid}>
        <article><span>PROGRESS</span><strong>{session.progress_percent}%</strong></article>
        <article><span>CLARITY</span><strong>{session.clarity_score ?? "—"}</strong></article>
        <article><span>READINESS</span><strong>{session.readiness_score ?? "—"}</strong></article>
        <article><span>PRIMARY MODULE</span><strong>{session.recommended_module ?? "Blueprint™"}</strong></article>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <span>THE THING</span>
          <h2>{session.thing}</h2>
          <p>{session.problem}</p>
        </article>
        <article className={styles.panel}>
          <span>DESIRED OUTCOME</span>
          <h2>{session.desired_outcome}</h2>
          <p>Primary blocker: {session.blocker}</p>
        </article>
        <article className={styles.panel}>
          <span>ROUTING LOGIC</span>
          <h2>{session.recommended_module ?? "Blueprint™"}</h2>
          <p>{session.routing_reason ?? "POLAR routing analysis is pending."}</p>
        </article>
        <article className={styles.panel}>
          <span>PRIORITY ACTIONS</span>
          {priorities.length ? <ol>{priorities.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No priorities recorded yet.</p>}
        </article>
        <article className={styles.panel}>
          <span>RISKS</span>
          {session.risk_flags?.length ? <ul>{session.risk_flags.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No immediate risks flagged.</p>}
        </article>
        <article className={styles.panel}>
          <span>CONTRADICTIONS</span>
          {session.contradiction_flags?.length ? <ul>{session.contradiction_flags.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No obvious contradictions detected.</p>}
        </article>
      </section>

      <footer className={styles.footer}>
        <span>LAST MEMORY WRITE: {session.last_saved_at ? new Date(session.last_saved_at).toLocaleString() : "NOT RECORDED"}</span>
        <Link href="/">RETURN TO POLAR OS →</Link>
      </footer>
    </main>
  );
}
