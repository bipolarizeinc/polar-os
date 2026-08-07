import "server-only";
import { assertConnectionCapability } from "./polar-connections";

export type PolarSocialPlatform = "facebook" | "instagram" | "linkedin" | "x" | "youtube" | "tiktok";

export type PolarSocialAccountRef = {
  platform: PolarSocialPlatform;
  accountRef: string;
  organizationId: string;
  clientId?: string;
  divisionKey?: string;
};

export type PolarSocialDraft = {
  account: PolarSocialAccountRef;
  text: string;
  mediaRefs?: string[];
  scheduledFor?: string;
  campaignRef?: string;
};

export type PolarSocialPublishRequest = PolarSocialDraft & {
  approvalId: string;
  approvedBy: string;
};

export interface PolarSocialProvider {
  listAccounts(): Promise<PolarSocialAccountRef[]>;
  publish(input: PolarSocialPublishRequest): Promise<{ externalId: string; url?: string }>;
  update?(input: PolarSocialPublishRequest & { externalId: string }): Promise<{ externalId: string; url?: string }>;
  remove?(input: {
    account: PolarSocialAccountRef;
    externalId: string;
    approvalId: string;
    approvedBy: string;
  }): Promise<void>;
}

export function validateSocialDraft(input: PolarSocialDraft) {
  const text = input.text.trim();
  if (!text && !(input.mediaRefs?.length)) throw new Error("A social draft needs text or approved media.");
  if (text.length > 10_000) throw new Error("Social draft exceeds the POLAR connector safety limit.");

  if (input.scheduledFor) {
    const scheduled = new Date(input.scheduledFor);
    if (Number.isNaN(scheduled.getTime())) throw new Error("Invalid social scheduling time.");
  }

  return { ...input, text };
}

export async function publishSocial(
  provider: PolarSocialProvider,
  input: PolarSocialPublishRequest,
) {
  const draft = validateSocialDraft(input);
  if (!input.approvalId.trim() || !input.approvedBy.trim()) {
    throw new Error("Social publishing requires an explicit approval record.");
  }

  assertConnectionCapability({
    connection: "social",
    capability: "publish",
    divisionKey: input.account.divisionKey,
    explicitApproval: true,
  });

  return provider.publish({ ...input, ...draft });
}

export function socialCredentialEnvironmentContract() {
  return {
    rule: "Store provider OAuth credentials in an approved secret store; memory stores references only.",
    forbidden: [
      "raw access tokens in Supabase memory",
      "raw refresh tokens in GitHub",
      "OAuth secrets in browser bundles",
      "credentials passed through agent prompts",
    ],
  } as const;
}
