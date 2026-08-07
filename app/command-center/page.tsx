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
  existing_assets?: string | null;
  requested_help?: string | null;
  constraints?: string | null;
  additional_context?: string | null;
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

type AgentMessage = {
  role: "founder" | "polar";
  content: string;
};

export default function CommandCenterPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([]);

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
    setMessages([]);
    setLoading(false);
  }

  async function askPolar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || agentLoading) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const message = String(data.get("message") ?? "").trim();
    if (!message) return;

    setAgentError("");
    setAgentLoading(true);
    setMessages((current) => [...current, { role: "founder", content: message }]);
    form.reset();

    const response = await fetch("/api/polar/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: {
          thing: session.thing,
          audience: session.audience,
          problem: session.problem,
          blocker: session.blocker,
          desiredOutcome: session.desired_outcome,
          existingAssets: session.existing_assets ?? undefined,
          requestedHelp: session.requested_help ?? undefined,
          constraints: session.constraints ?? undefined,
          additionalContext: session.additional_context ?? undefined,
        },
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setAgentError(body.error ?? "POLAR agent runtime failed.");
      setAgentLoading(false);
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "polar", content: body.output || "POLAR completed the run without a text response." },
    ]);
    setAgentLoading(false);
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
          <p className={styles.status}>POLAR COMMAND CENTER // AGENT ONLINE</p>
          <h1>{session.company_name || session.founder_name || "UNNAMED VENTURE"}</h1>
          <p>{session.extraction_id} · {session.status.toUpperCase()}</p>
        </div>
        <button onClick={() => { setSession(null); setMessages([]); }}>LOCK SESSION</button>
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

      <section className={styles.agentConsole}>
        <div className={styles.agentHeader}>
          <div>
            <span>LIVE AGENT CHANNEL</span>
            <h2>P.O.L.A.R.</h2>
          </div>
          <strong>{agentLoading ? "REASONING" : "READY"}</strong>
        </div>

        <div className={styles.transcript} aria-live="polite">
          {!messages.length && (
            <div className={styles.polarMessage}>
              <b>P.O.L.A.R.</b>
              <p>Session context loaded. Ask for architecture, priorities, contradictions, decisions, sequencing, or the next move.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === "polar" ? styles.polarMessage : styles.founderMessage}>
              <b>{message.role === "polar" ? "P.O.L.A.R." : "FOUNDER"}</b>
              <p>{message.content}</p>
            </div>
          ))}
          {agentLoading && <div className={styles.polarMessage}><b>P.O.L.A.R.</b><p>Analyzing institutional context...</p></div>}
        </div>

        <form className={styles.agentForm} onSubmit={askPolar}>
          <textarea name="message" required rows={3} placeholder="Tell P.O.L.A.R. what you need decided, built, clarified, or prioritized..." />
          <button disabled={agentLoading} type="submit">{agentLoading ? "POLAR IS THINKING..." : "SEND TO POLAR"}</button>
        </form>
        {agentError && <p className={styles.error}>{agentError}</p>}
      </section>

      <footer className={styles.footer}>
        <span>LAST MEMORY WRITE: {session.last_saved_at ? new Date(session.last_saved_at).toLocaleString() : "NOT RECORDED"}</span>
        <Link href="/">RETURN TO POLAR OS →</Link>
      </footer>
    </main>
  );
}
