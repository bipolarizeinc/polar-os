"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import styles from "./intake.module.css";

type Analysis = {
  routingRationale: string;
  clarityScore: number;
  readinessScore: number;
  contradictionFlags: string[];
  risks: string[];
  priorities: string[];
  blueprintBrief: {
    concept: string;
    audience: string;
    problem: string;
    outcome: string;
    immediateNextStep: string;
  };
};

type Result = {
  extractionId: string;
  recoveryToken?: string;
  recommendedModule: string;
  analysis?: Analysis;
  persisted: boolean;
  message?: string;
};

const fields = [
  ["thing", "WHAT IS YOUR THING?", "Describe the idea, business, invention, project, problem, or transformation."],
  ["audience", "WHO IS IT FOR?", "Who needs it, uses it, buys it, or benefits from it?"],
  ["problem", "WHAT PROBLEM DOES IT SOLVE?", "What is broken, missing, inefficient, misunderstood, or ready to change?"],
  ["blocker", "WHAT IS BLOCKING IT RIGHT NOW?", "Name the confusion, risk, missing structure, resources, technology, funding, or bottleneck."],
  ["desiredOutcome", "WHAT SHOULD IT BECOME?", "Describe the functional outcome, business model, revenue goal, impact, or future."],
  ["existingAssets", "WHAT ALREADY EXISTS?", "Research, documents, prototypes, websites, branding, systems, partners, or prior work."],
  ["requestedHelp", "WHAT HELP DO YOU THINK YOU NEED?", "It is completely acceptable to be unsure."],
  ["constraints", "TIMELINE, BUDGET, OR CONSTRAINTS", "Deadlines, budget range, legal concerns, confidentiality needs, or non-negotiables."],
  ["additionalContext", "ANYTHING ELSE POLAR SHOULD KNOW?", "Contradictions, context, history, or details that do not fit neatly anywhere else."],
] as const;

export default function IntakePage() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error ?? "POLAR could not process this intake.");
      setSubmitting(false);
      return;
    }

    setResult(body);
    setSubmitting(false);
  }

  if (result) {
    return (
      <main className={styles.shell}>
        <section className={styles.confirmation}>
          <p className={styles.status}>BLUEPRINT EXTRACTION ANALYZED</p>
          <h1>{result.extractionId}</h1>
          <p>Primary routing recommendation: <strong>{result.recommendedModule}</strong></p>
          <p>{result.persisted ? "Your intake and analysis are secured in the POLAR memory layer." : result.message}</p>

          {result.analysis && (
            <>
              <div className={styles.identityGrid}>
                <div className={styles.question}><span>CLARITY SCORE</span><strong>{result.analysis.clarityScore}%</strong></div>
                <div className={styles.question}><span>READINESS SCORE</span><strong>{result.analysis.readinessScore}%</strong></div>
              </div>
              <div className={styles.question}>
                <span>ROUTING RATIONALE</span>
                <p>{result.analysis.routingRationale}</p>
              </div>
              <div className={styles.question}>
                <span>FIRST-PASS BLUEPRINT BRIEF</span>
                <p><strong>Concept:</strong> {result.analysis.blueprintBrief.concept}</p>
                <p><strong>Audience:</strong> {result.analysis.blueprintBrief.audience}</p>
                <p><strong>Problem:</strong> {result.analysis.blueprintBrief.problem}</p>
                <p><strong>Outcome:</strong> {result.analysis.blueprintBrief.outcome}</p>
                <p><strong>Next step:</strong> {result.analysis.blueprintBrief.immediateNextStep}</p>
              </div>
              {!!result.analysis.contradictionFlags.length && (
                <div className={styles.question}>
                  <span>CONTRADICTIONS REQUIRING RESOLUTION</span>
                  {result.analysis.contradictionFlags.map((flag) => <p key={flag}>• {flag}</p>)}
                </div>
              )}
              <div className={styles.question}>
                <span>POLAR PRIORITIES</span>
                {result.analysis.priorities.map((priority) => <p key={priority}>• {priority}</p>)}
              </div>
            </>
          )}

          {result.recoveryToken && (
            <div className={styles.question}>
              <span>SECURE RECOVERY TOKEN</span>
              <code>{result.recoveryToken}</code>
              <small>Save this token with your extraction ID. For security, POLAR cannot display it again.</small>
            </div>
          )}

          <div className={styles.identityGrid}>
            {result.recoveryToken && (
              <Link href="/command-center" className={styles.button}>ENTER COMMAND CENTER</Link>
            )}
            <Link href="/" className={styles.button}>RETURN TO POLAR OS</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.status}>P.O.L.A.R. BLUEPRINT EXTRACTION // ACTIVE</p>
        <h1>TELL US ABOUT <em>YOUR THING.</em></h1>
        <p>Raw, incomplete, contradictory, and unconventional is welcome. POLAR needs the real version, not a pitch-deck version cleaned up for somebody else.</p>
      </header>

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.identityGrid}>
          <label>NAME<input name="founderName" autoComplete="name" /></label>
          <label>EMAIL<input name="email" type="email" autoComplete="email" /></label>
          <label>PHONE<input name="phone" autoComplete="tel" /></label>
          <label>COMPANY OR PROJECT<input name="companyName" /></label>
        </div>

        {fields.map(([name, title, help], index) => (
          <label className={styles.question} key={name}>
            <span>{String(index + 1).padStart(2, "0")}{" // "}{title}</span>
            <small>{help}</small>
            <textarea name={name} required={index < 5} rows={5} />
          </label>
        ))}

        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} disabled={submitting} type="submit">
          {submitting ? "POLAR IS ANALYZING..." : "INITIALIZE BLUEPRINT EXTRACTION"}
        </button>
      </form>
    </main>
  );
}
