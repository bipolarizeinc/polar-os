import "server-only";
import { cookies } from "next/headers";
import { FOUNDER_COOKIE, hashOpaqueToken } from "../polar-founder-auth";
import { founderPublicRpc } from "../polar-founder-public-db";
import type { EtsaReviewScore, StoredEtsaResponse } from "./engine";

export type ReviewDetail = {
  session: { id: string; user_id: string; status: string; assessment_version: string };
  responses: StoredEtsaResponse[];
  scores: EtsaReviewScore[];
};

export async function reviewerOperation<T>(operation: "queue" | "detail" | "score" | "finalize", assessmentId: string | null = null, payload: Record<string, unknown> = {}) {
  const token = (await cookies()).get(FOUNDER_COOKIE)?.value;
  if (!token) return { status: 401, error: "Founder authorization required.", data: undefined };
  return founderPublicRpc<{ status: number; error?: string; data?: T }>("etsa_reviewer_operation", {
    body: { p_session_hash: hashOpaqueToken(token), p_operation: operation, p_assessment_id: assessmentId, p_payload: payload }
  });
}
