"use client";

import { useEffect, useState } from "react";

function fromB64url(value: string) {
  const pad = "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toB64url(value: ArrayBuffer) {
  const bytes = new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function FounderPasskeyPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [status, setStatus] = useState("Checking founder authority...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/founder/auth/status", { cache: "no-store" })
      .then((response) => {
        setAuthenticated(response.ok);
        setStatus(response.ok ? "Founder authority verified. Enroll this device as a passkey." : "Use an enrolled passkey to unlock Founder Control.");
      })
      .catch(() => setStatus("Founder authentication is unavailable."));
  }, []);

  async function enroll() {
    setBusy(true);
    setStatus("Preparing passkey enrollment...");
    try {
      const optionsResponse = await fetch("/api/founder/passkeys/register/options", { method: "POST", cache: "no-store" });
      const options = await optionsResponse.json();
      if (!optionsResponse.ok) throw new Error(options.error || "Enrollment options failed.");
      const challenge = options.challenge as string;
      const publicKey: PublicKeyCredentialCreationOptions = {
        ...options,
        challenge: fromB64url(options.challenge),
        user: { ...options.user, id: fromB64url(options.user.id) },
        excludeCredentials: (options.excludeCredentials || []).map((item: { id: string; type: PublicKeyCredentialType; transports?: AuthenticatorTransport[] }) => ({ ...item, id: fromB64url(item.id) })),
      };
      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential | null;
      if (!credential) throw new Error("Passkey enrollment was canceled.");
      const response = credential.response as AuthenticatorAttestationResponse;
      const publicKeySpki = response.getPublicKey?.();
      const authenticatorData = response.getAuthenticatorData?.();
      if (!publicKeySpki || !authenticatorData) throw new Error("This browser cannot export the WebAuthn verification material required by P.O.L.A.R.");
      const verifyResponse = await fetch("/api/founder/passkeys/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge,
          credentialId: toB64url(credential.rawId),
          clientDataJSON: toB64url(response.clientDataJSON),
          authenticatorData: toB64url(authenticatorData),
          publicKeySpki: toB64url(publicKeySpki),
          transports: response.getTransports?.() || [],
          label: navigator.userAgent.slice(0, 120),
        }),
      });
      const result = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(result.error || "Passkey enrollment failed.");
      setStatus("Passkey enrolled. Future Founder Control login can use this authenticator.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Passkey enrollment failed.");
    } finally {
      setBusy(false);
    }
  }

  async function login() {
    setBusy(true);
    setStatus("Waiting for passkey verification...");
    try {
      const optionsResponse = await fetch("/api/founder/passkeys/authenticate/options", { method: "POST", cache: "no-store" });
      const options = await optionsResponse.json();
      if (!optionsResponse.ok) throw new Error(options.error || "Passkey login is unavailable.");
      const challenge = options.challenge as string;
      const publicKey: PublicKeyCredentialRequestOptions = {
        ...options,
        challenge: fromB64url(options.challenge),
        allowCredentials: (options.allowCredentials || []).map((item: { id: string; type: PublicKeyCredentialType; transports?: AuthenticatorTransport[] }) => ({ ...item, id: fromB64url(item.id) })),
      };
      const credential = await navigator.credentials.get({ publicKey }) as PublicKeyCredential | null;
      if (!credential) throw new Error("Passkey login was canceled.");
      const response = credential.response as AuthenticatorAssertionResponse;
      const verifyResponse = await fetch("/api/founder/passkeys/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge,
          credentialId: toB64url(credential.rawId),
          clientDataJSON: toB64url(response.clientDataJSON),
          authenticatorData: toB64url(response.authenticatorData),
          signature: toB64url(response.signature),
        }),
      });
      const result = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(result.error || "Passkey verification failed.");
      setAuthenticated(true);
      setStatus("Founder passkey verified. Founder Control is unlocked.");
      window.location.assign("/founder");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Passkey login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#05070a", color: "#f6f7f8", padding: "10vh 7vw", fontFamily: "Arial, sans-serif" }}>
      <p style={{ letterSpacing: ".18em", opacity: .65 }}>P.O.L.A.R. // FOUNDER PASSKEY</p>
      <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)", margin: "1rem 0" }}>TRUSTED DEVICE ACCESS</h1>
      <p style={{ maxWidth: 720, lineHeight: 1.6 }}>{status}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
        {authenticated ? (
          <button onClick={enroll} disabled={busy} style={{ padding: "14px 20px", fontWeight: 800 }}>ENROLL PASSKEY</button>
        ) : (
          <button onClick={login} disabled={busy} style={{ padding: "14px 20px", fontWeight: 800 }}>UNLOCK WITH PASSKEY</button>
        )}
        <button onClick={() => window.location.assign("/founder")} disabled={busy} style={{ padding: "14px 20px" }}>FOUNDER CONTROL</button>
      </div>
      <p style={{ marginTop: 40, opacity: .55, maxWidth: 760 }}>Private keys remain with the authenticator. P.O.L.A.R. stores only the credential identifier, public verification key, counters, and audit metadata.</p>
    </main>
  );
}
