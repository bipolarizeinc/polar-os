import "server-only";

export function referralStorageReady() {
  return process.env.ETSA_REFERRALS_STORAGE_READY === "true";
}

export function referralsEnabled() {
  return referralStorageReady() && process.env.ETSA_OPPORTUNITY_REFERRALS_ENABLED === "true";
}

export function founderOfferStorageReady(){
  return referralStorageReady() && process.env.ETSA_FOUNDER_OFFER_STORAGE_READY === "true";
}
