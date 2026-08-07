export type PolarClassification =
  | "public"
  | "internal"
  | "confidential"
  | "constitutional"
  | "restricted";

export type PolarAuthorityLevel =
  | "autonomous"
  | "recommendation"
  | "approval-required"
  | "prohibited";

export type PolarAction =
  | "read"
  | "analyze"
  | "draft"
  | "recommend"
  | "write-memory"
  | "send-communication"
  | "publish"
  | "modify-record"
  | "delete-record"
  | "deploy-code"
  | "change-permissions"
  | "commit-funds"
  | "bind-enterprise"
  | "change-governance";

export type PolarNamespaceContext = {
  namespaceId: string;
  namespaceType: "enterprise" | "client" | "division" | "extension" | "project" | "session" | "system";
  organizationId?: string | null;
  clientId?: string | null;
  classification: PolarClassification;
};

export type PolarPrincipal = {
  principalType: "user" | "agent" | "service" | "role";
  principalKey: string;
  organizationId?: string | null;
  clientIds?: string[];
  permissions?: Array<"read" | "write" | "approve" | "admin" | "backup">;
  maxClassification?: PolarClassification;
};

export type PolarPolicyDecision = {
  allowed: boolean;
  authorityLevel: PolarAuthorityLevel;
  reason: string;
  requiresApproval: boolean;
  retrievalScope: "current" | "parent" | "organization" | "enterprise" | "none";
};

const classificationRank: Record<PolarClassification, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  constitutional: 3,
  restricted: 4,
};

const actionAuthority: Record<PolarAction, PolarAuthorityLevel> = {
  read: "autonomous",
  analyze: "autonomous",
  draft: "autonomous",
  recommend: "autonomous",
  "write-memory": "autonomous",
  "send-communication": "approval-required",
  publish: "approval-required",
  "modify-record": "approval-required",
  "delete-record": "approval-required",
  "deploy-code": "approval-required",
  "change-permissions": "approval-required",
  "commit-funds": "prohibited",
  "bind-enterprise": "prohibited",
  "change-governance": "prohibited",
};

function principalCanSeeClassification(
  principal: PolarPrincipal,
  classification: PolarClassification,
) {
  const ceiling = principal.maxClassification ?? "internal";
  return classificationRank[classification] <= classificationRank[ceiling];
}

function sameOrganization(principal: PolarPrincipal, namespace: PolarNamespaceContext) {
  if (!namespace.organizationId) return namespace.namespaceType === "enterprise" || namespace.namespaceType === "system";
  return Boolean(principal.organizationId && principal.organizationId === namespace.organizationId);
}

function clientBoundaryAllows(principal: PolarPrincipal, namespace: PolarNamespaceContext) {
  if (!namespace.clientId) return true;
  return principal.clientIds?.includes(namespace.clientId) ?? false;
}

export function evaluatePolarPolicy(input: {
  principal: PolarPrincipal;
  action: PolarAction;
  namespace: PolarNamespaceContext;
  explicitApproval?: boolean;
}): PolarPolicyDecision {
  const { principal, action, namespace } = input;
  const baseline = actionAuthority[action];

  if (!principalCanSeeClassification(principal, namespace.classification)) {
    return {
      allowed: false,
      authorityLevel: "prohibited",
      reason: "Principal classification ceiling is below the namespace classification.",
      requiresApproval: false,
      retrievalScope: "none",
    };
  }

  if (!sameOrganization(principal, namespace)) {
    return {
      allowed: false,
      authorityLevel: "prohibited",
      reason: "Cross-organization access is denied by default.",
      requiresApproval: false,
      retrievalScope: "none",
    };
  }

  if (!clientBoundaryAllows(principal, namespace)) {
    return {
      allowed: false,
      authorityLevel: "prohibited",
      reason: "Client memory cannot cross client boundaries without an explicit membership grant.",
      requiresApproval: false,
      retrievalScope: "none",
    };
  }

  if (action === "read" || action === "analyze") {
    if (!(principal.permissions?.includes("read") || principal.permissions?.includes("admin"))) {
      return {
        allowed: false,
        authorityLevel: "prohibited",
        reason: "Read permission is required for retrieval or analysis.",
        requiresApproval: false,
        retrievalScope: "none",
      };
    }
  }

  if (action === "write-memory" || action === "modify-record" || action === "delete-record") {
    if (!(principal.permissions?.includes("write") || principal.permissions?.includes("admin"))) {
      return {
        allowed: false,
        authorityLevel: "prohibited",
        reason: "Write permission is required for memory mutation.",
        requiresApproval: false,
        retrievalScope: "none",
      };
    }
  }

  if (baseline === "prohibited") {
    return {
      allowed: false,
      authorityLevel: baseline,
      reason: `${action} is outside P.O.L.A.R.'s delegated autonomous authority.`,
      requiresApproval: false,
      retrievalScope: "none",
    };
  }

  if (baseline === "approval-required") {
    const canApprove = principal.permissions?.includes("approve") || principal.permissions?.includes("admin");
    const approved = Boolean(input.explicitApproval && canApprove);
    return {
      allowed: approved,
      authorityLevel: baseline,
      reason: approved
        ? "Explicit approval is present from a principal with approval authority."
        : "This action requires explicit approval from an authorized principal.",
      requiresApproval: !approved,
      retrievalScope: approved ? "current" : "none",
    };
  }

  return {
    allowed: true,
    authorityLevel: baseline,
    reason: "Action is permitted within the principal's organization, client, classification, and permission boundary.",
    requiresApproval: false,
    retrievalScope:
      namespace.namespaceType === "session"
        ? "parent"
        : namespace.namespaceType === "project" || namespace.namespaceType === "division"
          ? "organization"
          : "current",
  };
}

export function canExpandRetrievalScope(input: {
  principal: PolarPrincipal;
  from: PolarNamespaceContext;
  to: PolarNamespaceContext;
}) {
  if (!sameOrganization(input.principal, input.from) || !sameOrganization(input.principal, input.to)) return false;
  if (!clientBoundaryAllows(input.principal, input.from) || !clientBoundaryAllows(input.principal, input.to)) return false;
  if (!principalCanSeeClassification(input.principal, input.to.classification)) return false;

  // Restricted and constitutional memory should never be pulled merely because
  // a broad semantic search happened to match it.
  if (input.to.classification === "restricted" || input.to.classification === "constitutional") {
    return input.principal.permissions?.includes("admin") ?? false;
  }

  return input.principal.permissions?.includes("read") ?? false;
}
