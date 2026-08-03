"use client";

/**
 * Legacy compatibility shim.
 *
 * The global PolarExperience controller now owns first-visit introduction,
 * replay, accessibility, voice preference, and returning-visitor behavior.
 * Keeping this export avoids touching every page import while preventing a
 * second competing overlay from appearing after the P.O.L.A.R. greeting.
 */
export function BootSequence() {
  return null;
}
