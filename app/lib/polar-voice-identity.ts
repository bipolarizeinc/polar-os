import "server-only";

export type PolarSpeakerRole =
  | "founder"
  | "executive"
  | "employee"
  | "client"
  | "guest"
  | "unknown";

export type PolarVoiceIdentityEvidence = {
  speakerId?: string;
  role: PolarSpeakerRole;
  confidence: number;
  livenessVerified: boolean;
  trustedDevice: boolean;
  authenticatedSession: boolean;
  biometricConfirmed?: boolean;
};

export type PolarVoiceActionRisk = "low" | "moderate" | "high" | "critical";

export type PolarVoiceAuthorizationDecision = {
  allowed: boolean;
  reason: string;
  requiresBiometric: boolean;
  recognizedSpeaker: boolean;
};

export function evaluateVoiceAuthorization(input: {
  evidence: PolarVoiceIdentityEvidence;
  risk: PolarVoiceActionRisk;
  minimumConfidence?: number;
}): PolarVoiceAuthorizationDecision {
  const minimumConfidence = input.minimumConfidence ?? 0.82;
  const recognizedSpeaker =
    Boolean(input.evidence.speakerId) &&
    input.evidence.role !== "unknown" &&
    input.evidence.confidence >= minimumConfidence;

  if (!input.evidence.authenticatedSession) {
    return {
      allowed: false,
      reason: "An authenticated P.O.L.A.R. session is required.",
      requiresBiometric: input.risk === "high" || input.risk === "critical",
      recognizedSpeaker,
    };
  }

  if (input.risk === "low") {
    return {
      allowed: true,
      reason: recognizedSpeaker
        ? "Authenticated session with recognized-speaker context."
        : "Authenticated session is sufficient for low-risk assistance.",
      requiresBiometric: false,
      recognizedSpeaker,
    };
  }

  if (!recognizedSpeaker || !input.evidence.livenessVerified || !input.evidence.trustedDevice) {
    return {
      allowed: false,
      reason: "Moderate or higher-risk voice actions require recognized speaker, liveness, and a trusted device.",
      requiresBiometric: input.risk === "high" || input.risk === "critical",
      recognizedSpeaker,
    };
  }

  if (input.risk === "moderate") {
    return {
      allowed: true,
      reason: "Recognized live speaker on a trusted authenticated device.",
      requiresBiometric: false,
      recognizedSpeaker,
    };
  }

  if (!input.evidence.biometricConfirmed) {
    return {
      allowed: false,
      reason: "High-risk and critical actions require local biometric or PIN confirmation in addition to voice identity.",
      requiresBiometric: true,
      recognizedSpeaker,
    };
  }

  return {
    allowed: true,
    reason: "Voice identity, liveness, trusted device, authenticated session, and local biometric confirmation verified.",
    requiresBiometric: true,
    recognizedSpeaker,
  };
}

export function voiceIdentityStorageContract() {
  return {
    permitted: [
      "speaker profile identifier",
      "role and authority mapping",
      "non-reversible speaker embedding reference",
      "enrollment timestamp",
      "revocation state",
      "verification audit records",
    ],
    forbidden: [
      "raw voice recordings stored as identity credentials",
      "speaker embeddings exposed to browser code",
      "biometric templates placed in agent prompts",
      "voice identity used as the sole factor for high-risk actions",
    ],
  } as const;
}
