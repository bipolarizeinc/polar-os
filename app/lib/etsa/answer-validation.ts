import { ETSA_QUESTIONS } from "./questions";
export function validEtsaAnswer(questionId: number, value: unknown, text: unknown) {
  const question = ETSA_QUESTIONS.find(q => q.id === questionId);
  if (!question) return false;
  if (question.type === "text" || question.type === "challenge") {
    if (typeof text !== "string" || !text.trim() || text.length > 20_000) return false;
    return !question.maxWords || text.trim().split(/\s+/).length <= question.maxWords;
  }
  if (question.type === "multi") return Array.isArray(value) && value.length > 0 && new Set(value).size === value.length && value.every(v => typeof v === "string" && question.options?.includes(v));
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < (question.options?.length ?? 0);
}
