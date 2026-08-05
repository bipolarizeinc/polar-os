"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import styles from "./intake.module.css";

type Result = {
  extractionId: string;
  recommendedModule: string;
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
          <p className={styles.status}>BLUEPRINT EXTRACTION REGISTERED</p>
          <h1>{result.extractionId}</h1>
          <p>Primary routing recommendation: <strong>{result.recommendedModule}</strong></p>
          <p>{result.persisted ? "Your intake is secured in the POLAR memory layer." : result.message}</p>
          <Link href="/" className={styles.button}>RETURN TO POLAR OS</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.status}>P.O.L.A.R. BLUEPRINT EXTRACTION // ACTIVE</p>
        <h1>TELL US ABOUT <em>YOUR THING.</em></h1>
        <p>Raw, incomplete, contradictory, and unconventional is welcome. POLAR needs the real version, not the polished bullshit.</p>
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
            <span>{String(index + 1).padStart(2, "0")} // {title}</span>
            <small>{help}</small>
            <textarea name={name} required={index < 5} rows={5} />
          </label>
        ))}

        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} disabled={submitting} type="submit">
          {submitting ? "POLAR IS PROCESSING..." : "INITIALIZE BLUEPRINT EXTRACTION"}
        </button>
      </form>
    </main>
  );
}
