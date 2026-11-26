import "server-only";

export function referralsEnabled() {
  return process.env.ETSA_OPPORTUNITY_REFERRALS_ENABLED === "true";
}
