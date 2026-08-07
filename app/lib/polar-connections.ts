export type PolarConnectionKey =
  | "github"
  | "google-drive"
  | "gmail"
  | "google-calendar"
  | "hyperframes"
  | "web-research"
  | "social";

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
  social: {
    key: "social",
    label: "Social Connections",
    namespaceKey: "social",
    classification: "confidential",
    capabilities: ["read", "search", "create", "update", "delete", "publish"],
    approvalRequired: ["create", "update", "delete", "publish"],
    secretRefs: ["SOCIAL_OAUTH_CONNECTION"],
    allowedDivisions: ["brandforge", "sav-vidzgen", "pulse", "nexus"],
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
