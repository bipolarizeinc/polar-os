import "server-only";

export type PolarLearningKind =
  | "fact"
  | "preference"
  | "decision"
  | "relationship"
  | "procedure"
  | "lesson"
  | "open-loop";

export type PolarLearningCandidate = {
  kind: PolarLearningKind;
  content: string;
  sourceType: "conversation" | "email" | "document" | "calendar" | "research" | "system";
  sourceRef?: string;
  organizationId: string;
  clientId?: string;
  divisionKey?: string;
  classification: "public" | "internal" | "confidential" | "constitutional" | "restricted";
  confidence: number;
  observedAt: string;
  supersedesRef?: string;
};

export type PolarLearningDisposition =
  | "discard"
  | "session-only"
  | "candidate-memory"
  | "requires-validation"
  | "institutional-memory";

export function classifyLearningCandidate(candidate: PolarLearningCandidate): PolarLearningDisposition {
  const text = candidate.content.trim();
  if (!text) return "discard";
  if (candidate.confidence < 0.5) return "session-only";

  if (candidate.classification === "constitutional" || candidate.classification === "restricted") {
    return "requires-validation";
  }

  if (candidate.kind === "decision" || candidate.kind === "procedure") {
    return candidate.confidence >= 0.9 ? "requires-validation" : "candidate-memory";
  }

  if (candidate.kind === "fact" && candidate.confidence < 0.8) {
    return "candidate-memory";
  }

  return candidate.confidence >= 0.9 ? "institutional-memory" : "candidate-memory";
}

export function shouldRetrieveLearning(input: {
  organizationId: string;
  clientId?: string;
  candidateOrganizationId: string;
  candidateClientId?: string;
}) {
  if (input.organizationId !== input.candidateOrganizationId) return false;
  if (input.clientId && input.candidateClientId && input.clientId !== input.candidateClientId) return false;
  if (!input.clientId && input.candidateClientId) return false;
  return true;
}

export function learningPolicy() {
  return {
    principle: "P.O.L.A.R. learns by governed memory promotion, not uncontrolled model retraining.",
    pipeline: [
      "observe",
      "classify",
      "score confidence",
      "apply data boundary",
      "validate when required",
      "promote",
      "version",
      "retrieve selectively",
      "audit",
    ],
    neverStore: [
      "passwords",
      "raw OAuth access or refresh tokens",
      "recovery tokens",
      "private cryptographic keys",
      "biometric templates in model prompts",
    ],
  } as const;
}
