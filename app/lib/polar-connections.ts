export type PolarConnectionKey =
  | "github"
  | "vercel"
  | "supabase"
  | "google-drive"
  | "gmail"
  | "google-calendar"
  | "zoho-mail"
  | "make"
  | "hyperframes"
  | "stripe"
  | "skip"
  | "trustpilot"
  | "web-research"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin";

export type PolarConnectionCapability =
  | "read"
  | "search"
  | "create"
  | "update"
  | "delete"
  | "send"
  | "publish"
  | "render"
  | "deploy"
  | "backup";

export type PolarConnectionDescriptor = {
  key: PolarConnectionKey;
  label: string;
  namespaceKey: string;
  classification: "internal" | "confidential" | "restricted";
  capabilities: PolarConnectionCapability[];
  approvalRequired: PolarConnectionCapability[];
  secretRefs: string[];
  allowedDivisions: string[] | "all";
};

const socialDivisions = ["brandforge", "sav-vidzgen", "pulse", "nexus", "blueprint"];
const socialCapabilities: PolarConnectionCapability[] = ["read", "search", "create", "update", "delete", "publish"];
const socialApproval: PolarConnectionCapability[] = ["create", "update", "delete", "publish"];

export const polarConnectionRegistry: Record<PolarConnectionKey, PolarConnectionDescriptor> = {
  github: {
    key: "github",
    label: "GitHub",
    namespaceKey: "github",
    classification: "internal",
    capabilities: ["read", "search", "create", "update", "delete", "deploy"],
    approvalRequired: ["create", "update", "delete", "deploy"],
    secretRefs: [],
    allowedDivisions: ["nexus", "cipher", "vault", "blueprint"],
  },
  vercel: {
    key: "vercel",
    label: "Vercel",
    namespaceKey: "deployment/vercel",
    classification: "internal",
    capabilities: ["read", "search", "deploy"],
    approvalRequired: ["deploy"],
    secretRefs: [],
    allowedDivisions: ["nexus", "cipher", "launchpad", "blueprint"],
  },
  supabase: {
    key: "supabase",
    label: "Supabase",
    namespaceKey: "data/supabase",
    classification: "restricted",
    capabilities: ["read", "search", "create", "update", "delete", "backup"],
    approvalRequired: ["create", "update", "delete"],
    secretRefs: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    allowedDivisions: ["nexus", "cipher", "vault", "blueprint"],
  },
  "google-drive": {
    key: "google-drive",
    label: "Google Drive",
    namespaceKey: "google-drive",
    classification: "confidential",
    capabilities: ["read", "search", "create", "update", "delete", "backup"],
    approvalRequired: ["create", "update", "delete"],
    secretRefs: [],
    allowedDivisions: ["dr-docx", "vault", "blueprint", "brandforge"],
  },
  gmail: {
    key: "gmail",
    label: "Gmail",
    namespaceKey: "gmail",
    classification: "confidential",
    capabilities: ["read", "search", "create", "send", "update", "delete"],
    approvalRequired: ["send", "update", "delete"],
    secretRefs: [],
    allowedDivisions: ["nexus", "launchpad", "blueprint"],
  },
  "google-calendar": {
    key: "google-calendar",
    label: "Google Calendar",
    namespaceKey: "calendar",
    classification: "confidential",
    capabilities: ["read", "search", "create", "update", "delete"],
    approvalRequired: ["create", "update", "delete"],
    secretRefs: [],
    allowedDivisions: ["nexus", "launchpad", "blueprint"],
  },
  "zoho-mail": {
    key: "zoho-mail",
    label: "Zoho Mail",
    namespaceKey: "zoho-mail",
    classification: "confidential",
    capabilities: ["read", "search", "create", "send", "update", "delete"],
    approvalRequired: ["send", "update", "delete"],
    secretRefs: [
      "ZOHO_CLIENT_ID",
      "ZOHO_CLIENT_SECRET",
      "POLAR_CONNECTION_ENCRYPTION_KEY",
    ],
    allowedDivisions: ["nexus", "launchpad", "blueprint"],
  },
  make: {
    key: "make",
    label: "Make.com",
    namespaceKey: "automation/make",
    classification: "restricted",
    capabilities: ["read", "create", "update"],
    approvalRequired: ["create", "update"],
    secretRefs: ["MAKE_API_BASE_URL", "MAKE_API_TOKEN", "MAKE_GOOGLE_BUSINESS_SCENARIO_ID"],
    allowedDivisions: ["nexus", "launchpad", "blueprint"],
  },
  hyperframes: {
    key: "hyperframes",
    label: "HyperFrames",
    namespaceKey: "hyperframes",
    classification: "internal",
    capabilities: ["read", "create", "render", "update"],
    approvalRequired: ["render", "update"],
    secretRefs: [],
    allowedDivisions: ["sav-vidzgen", "brandforge"],
  },
  stripe: {
    key: "stripe",
    label: "Stripe",
    namespaceKey: "payments/stripe",
    classification: "restricted",
    capabilities: ["read", "search", "create", "update"],
    approvalRequired: ["create", "update"],
    secretRefs: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "ETSA_REASSESSMENT_PAYMENT_URL"],
    allowedDivisions: ["launchpad", "nexus", "blueprint"],
  },
  skip: {
    key: "skip",
    label: "Skip",
    namespaceKey: "external-agents/skip",
    classification: "confidential",
    capabilities: ["read", "search", "create", "update"],
    approvalRequired: ["create", "update"],
    secretRefs: ["SKIP_AGENT_ID"],
    allowedDivisions: ["nexus", "launchpad", "blueprint"],
  },
  trustpilot: {
    key: "trustpilot",
    label: "Trustpilot",
    namespaceKey: "reputation/trustpilot",
    classification: "internal",
    capabilities: ["read", "search"],
    approvalRequired: [],
    secretRefs: [],
    allowedDivisions: ["brandforge", "pulse", "nexus"],
  },
  "web-research": {
    key: "web-research",
    label: "Real-Time Web Research",
    namespaceKey: "internet-research",
    classification: "internal",
    capabilities: ["search", "read"],
    approvalRequired: [],
    secretRefs: ["OPENAI_API_KEY"],
    allowedDivisions: "all",
  },
  facebook: {
    key: "facebook",
    label: "Facebook",
    namespaceKey: "social/facebook",
    classification: "confidential",
    capabilities: socialCapabilities,
    approvalRequired: socialApproval,
    secretRefs: ["META_FACEBOOK_OAUTH_CONNECTION"],
    allowedDivisions: socialDivisions,
  },
  instagram: {
    key: "instagram",
    label: "Instagram",
    namespaceKey: "social/instagram",
    classification: "confidential",
    capabilities: socialCapabilities,
    approvalRequired: socialApproval,
    secretRefs: ["META_INSTAGRAM_OAUTH_CONNECTION"],
    allowedDivisions: socialDivisions,
  },
  tiktok: {
    key: "tiktok",
    label: "TikTok",
    namespaceKey: "social/tiktok",
    classification: "confidential",
    capabilities: socialCapabilities,
    approvalRequired: socialApproval,
    secretRefs: ["TIKTOK_OAUTH_CONNECTION"],
    allowedDivisions: socialDivisions,
  },
  linkedin: {
    key: "linkedin",
    label: "LinkedIn",
    namespaceKey: "social/linkedin",
    classification: "confidential",
    capabilities: socialCapabilities,
    approvalRequired: socialApproval,
    secretRefs: ["LINKEDIN_OAUTH_CONNECTION"],
    allowedDivisions: socialDivisions,
  },
};

export function getPolarConnection(key: PolarConnectionKey) {
  return polarConnectionRegistry[key];
}

export function connectionAllowsDivision(key: PolarConnectionKey, divisionKey: string) {
  const connection = getPolarConnection(key);
  return connection.allowedDivisions === "all" || connection.allowedDivisions.includes(divisionKey);
}

export function connectionRequiresApproval(
  key: PolarConnectionKey,
  capability: PolarConnectionCapability,
) {
  return getPolarConnection(key).approvalRequired.includes(capability);
}

export function assertConnectionCapability(input: {
  connection: PolarConnectionKey;
  capability: PolarConnectionCapability;
  divisionKey?: string;
  explicitApproval?: boolean;
}) {
  const descriptor = getPolarConnection(input.connection);
  if (!descriptor.capabilities.includes(input.capability)) {
    throw new Error(`${descriptor.label} does not expose ${input.capability} through P.O.L.A.R.`);
  }

  if (input.divisionKey && !connectionAllowsDivision(input.connection, input.divisionKey)) {
    throw new Error(`${descriptor.label} is not authorized for the ${input.divisionKey} division.`);
  }

  if (connectionRequiresApproval(input.connection, input.capability) && !input.explicitApproval) {
    throw new Error(`${descriptor.label} ${input.capability} requires explicit approval.`);
  }

  return descriptor;
}
