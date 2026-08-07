import "server-only";
import { getSupabaseConfig, sha256, supabaseRequest } from "./polar-memory";

export type MemoryClassification =
  | "public"
  | "internal"
  | "confidential"
  | "constitutional"
  | "restricted";

export type AuthorityLevel =
  | "autonomous"
  | "recommendation"
  | "approval-required"
  | "prohibited";

export type MemoryRecordInput = {
  namespaceId: string;
  recordType:
    | "fact"
    | "decision"
    | "constraint"
    | "contradiction"
    | "preference"
    | "goal"
    | "risk"
    | "asset"
    | "relationship"
    | "instruction"
    | "policy"
    | "event"
    | "summary"
    | "artifact";
  title: string;
  contentText?: string;
  contentJson?: unknown;
  classification?: MemoryClassification;
  sourceType?: string;
  sourceRef?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdBy?: string;
};

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;

  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`);
  return `{${entries.join(",")}}`;
}

export function createIntegrityDigest(value: unknown) {
  return sha256(stableSerialize(value));
}

function requireMemoryConfig() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("POLAR institutional memory is not configured.");
  return config;
}

export async function writeMemoryRecord(input: MemoryRecordInput) {
  if (!input.contentText && input.contentJson === undefined) {
    throw new Error("A memory record requires text or structured content.");
  }

  const payload = {
    namespace_id: input.namespaceId,
    record_type: input.recordType,
    title: input.title,
    content_text: input.contentText ?? null,
    content_json: input.contentJson ?? null,
    source_type: input.sourceType ?? "system",
    source_ref: input.sourceRef ?? null,
    classification: input.classification ?? "internal",
    integrity_sha256: createIntegrityDigest({
      title: input.title,
      contentText: input.contentText ?? null,
      contentJson: input.contentJson ?? null,
      sourceType: input.sourceType ?? "system",
      sourceRef: input.sourceRef ?? null,
    }),
    tags: input.tags ?? [],
    metadata: input.metadata ?? {},
    created_by: input.createdBy ?? "polar-system",
  };

  const rows = await supabaseRequest<Array<{ id: string; integrity_sha256: string }>>(
    requireMemoryConfig(),
    "polar_memory_records_v2",
    { method: "POST", body: JSON.stringify(payload) },
  );

  return rows[0];
}

export async function appendAuditEvent(input: {
  namespaceId?: string;
  recordId?: string;
  actorType: "user" | "agent" | "service" | "system";
  actorKey: string;
  action: string;
  authorityLevel?: AuthorityLevel;
  outcome?: string;
  requestId?: string;
  details?: Record<string, unknown>;
}) {
  const canonical = {
    namespaceId: input.namespaceId ?? null,
    recordId: input.recordId ?? null,
    actorType: input.actorType,
    actorKey: input.actorKey,
    action: input.action,
    authorityLevel: input.authorityLevel ?? "autonomous",
    outcome: input.outcome ?? "recorded",
    requestId: input.requestId ?? null,
    details: input.details ?? {},
  };

  const rows = await supabaseRequest<Array<{ event_id: string; event_sha256: string }>>(
    requireMemoryConfig(),
    "polar_memory_audit_log",
    {
      method: "POST",
      body: JSON.stringify({
        namespace_id: input.namespaceId ?? null,
        record_id: input.recordId ?? null,
        actor_type: input.actorType,
        actor_key: input.actorKey,
        action: input.action,
        authority_level: input.authorityLevel ?? "autonomous",
        outcome: input.outcome ?? "recorded",
        request_id: input.requestId ?? null,
        details: input.details ?? {},
        event_sha256: createIntegrityDigest(canonical),
      }),
    },
  );

  return rows[0];
}

export async function createMajorMoveCheckpoint(input: {
  namespaceId?: string;
  createdBy: string;
  operation: string;
  artifacts?: Array<{ ref: string; sha256?: string }>;
  metadata?: Record<string, unknown>;
}) {
  const manifest = {
    protocol: "SECURE_SAVE_BACKUP_PROTECT_VERIFY",
    operation: input.operation,
    artifacts: input.artifacts ?? [],
    metadata: input.metadata ?? {},
    createdAt: new Date().toISOString(),
  };

  const manifestSha256 = createIntegrityDigest(manifest);
  const rows = await supabaseRequest<Array<{ id: string; manifest_sha256: string; status: string }>>(
    requireMemoryConfig(),
    "polar_memory_checkpoints",
    {
      method: "POST",
      body: JSON.stringify({
        namespace_id: input.namespaceId ?? null,
        checkpoint_type: "major-move",
        status: "created",
        manifest,
        manifest_sha256: manifestSha256,
        created_by: input.createdBy,
      }),
    },
  );

  await appendAuditEvent({
    namespaceId: input.namespaceId,
    actorType: "system",
    actorKey: input.createdBy,
    action: "memory.checkpoint.created",
    details: { checkpointId: rows[0]?.id, operation: input.operation, manifestSha256 },
  });

  return rows[0];
}

export async function markCheckpointBackedUp(input: {
  checkpointId: string;
  provider: string;
  externalRef: string;
}) {
  const query = new URLSearchParams({ id: `eq.${input.checkpointId}` });
  return supabaseRequest(
    requireMemoryConfig(),
    `polar_memory_checkpoints?${query}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: "backed-up",
        external_backup_provider: input.provider,
        external_backup_ref: input.externalRef,
        verified_at: new Date().toISOString(),
      }),
    },
  );
}
