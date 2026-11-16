"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function ServiceCheckoutForm({ slug }: { slug: string }) {
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const reset = () => { submitting.current = false; setPending(false); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    if (submitting.current) { event.preventDefault(); return; }
    submitting.current = true;
    setPending(true);
  }
  return <form action="/api/checkout" method="post" className="commerce-form" onSubmit={submit}>
    <input type="hidden" name="offer" value={slug} />
    <label className="commerce-consent"><input type="checkbox" name="terms" value="accepted" required /><span>I agree to the <Link href="/terms">service terms</Link> and understand the listed scope, separate third-party fees, and that expanded work requires approval.</span></label>
    <button className="primary-action" type="submit" disabled={pending}>{pending ? "OPENING SECURE CHECKOUT…" : "CONTINUE TO SECURE CHECKOUT →"}</button>
    <p aria-live="polite">{pending ? "Connecting to checkout. Please wait before submitting again." : "No account is required to purchase. Stripe collects your payment details securely."}</p>
  </form>;
}
