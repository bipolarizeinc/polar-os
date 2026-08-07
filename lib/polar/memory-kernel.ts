import { getSupabaseConfig, supabaseRequest } from "../../app/lib/polar-memory";

export type MemoryNamespaceType =
  | "enterprise"
  | "organization"
  | "division"
  | "extension"
  | "project"
  | "session";

export type MemoryClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted"
  | "constitutional";

export type MemoryRecordType =
  | "fact"
  | "decision"
  | "constraint"
  | "contradiction"
  | "preference"
  | "goal"
  | "risk"
  | "asset"
  | "relationship"
  | "instruction";

export type MemoryNamespace = {
  id: string;
  parent_id: string | null;
  organization_id: string | null;
  namespace_type: MemoryNamespaceType;
  slug: string;
  display_name: string;
  classification: MemoryClassification;
  inheritance_mode: "isolated" | "parent_read" | "bidirectional";
  retention_policy: string;
  is_active: boolean;
};

export type MemoryWriteInput = {
  namespaceId: string;
  organizationId?: string | null;
  founderId?: string | null;
  intakeSessionId?: string | null;
  recordType: MemoryRecordType;
  title: string;
  content: string;
  source: string;
  classification?: MemoryClassification;
  sensitivity?: "normal" | "sensitive" | "secret";
  confidence?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  actorId?: string;
  requestId?: string;
};

function requireMemoryConfig() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("POLAR memory is not configured.");
  return config;
}

export async function getMemoryNamespace(namespaceId: string) {
  const config = requireMemoryConfig();
  const query = new URLSearchParams({
    id: `eq.${namespaceId}`,
    is_active: "eq.true",
    select: "id,parent_id,organization_id,namespace_type,slug,display_name,classification,inheritance_mode,retention_policy,is_active",
    limit: "1",
  });
  const rows = await supabaseRequest<MemoryNamespace[]>(config, `polar_memory_namespaces?${query}`);
  return rows[0] ?? null;
}

export async function listChildNamespaces(parentId: string) {
  const config = requireMemoryConfig();
  const query = new URLSearchParams({
    parent_id: `eq.${parentId}`,
    is_active: "eq.true",
    select: "id,parent_id,organization_id,namespace_type,slug,display_name,classification,inheritance_mode,retention_policy,is_active",
    order: "display_name.asc",
  });
  return supabaseRequest<MemoryNamespace[]>(config, `polar_memory_namespaces?${query}`);
}

export async function writeMemory(input: MemoryWriteInput) {
  const config = requireMemoryConfig();
  const namespace = await getMemoryNamespace(input.namespaceId);
  if (!namespace) throw new Error("Memory namespace does not exist or is inactive.");

  const [record] = await supabaseRequest<Array<{ id: string; content_hash: string | null }>>(
    config,
    "polar_memory_records?select=id,content_hash",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        namespace_id: input.namespaceId,
        organization_id: input.organizationId ?? namespace.organization_id,
        founder_id: input.founderId ?? null,
        intake_session_id: input.intakeSessionId ?? null,
        record_type: input.recordType,
        title: input.title.trim(),
        content: input.content.trim(),
        source: input.source,
        classification: input.classification ?? namespace.classification,
        sensitivity: input.sensitivity ?? "normal",
        confidence: input.confidence ?? 1,
        tags: input.tags ?? [],
        metadata: input.metadata ?? {},
      }),
    },
  );

  await supabaseRequest(config, "polar_memory_audit_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      namespace_id: input.namespaceId,
      memory_record_id: record.id,
      actor_type: "agent",
      actor_id: input.actorId ?? "POLAR",
      action: "create",
      request_id: input.requestId ?? null,
      source: input.source,
      detail: { content_hash: record.content_hash },
    }),
  });

  return record;
}

export async function readActiveMemories(namespaceId: string, limit = 50) {
  const config = requireMemoryConfig();
  const safeLimit = Math.max(1, Math.min(limit, 200));
  const query = new URLSearchParams({
    namespace_id: `eq.${namespaceId}`,
    is_active: "eq.true",
    archived_at: "is.null",
    select: "id,record_type,title,content,source,confidence,tags,classification,sensitivity,content_hash,created_at,updated_at",
    order: "updated_at.desc",
    limit: String(safeLimit),
  });

  const records = await supabaseRequest<Array<Record<string, unknown>>>(config, `polar_memory_records?${query}`);

  await supabaseRequest(config, "polar_memory_audit_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      namespace_id: namespaceId,
      actor_type: "agent",
      actor_id: "POLAR",
      action: "read",
      source: "memory-kernel",
      detail: { result_count: records.length },
    }),
  });

  return records;
}

export async function recordMajorChangeCheckpoint(input: {
  checkpointKey: string;
  namespaceId?: string | null;
  changeType: string;
  changeSummary: string;
  sourceRef?: string | null;
  commitSha?: string | null;
  schemaVersion?: string | null;
  stateHash?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const config = requireMemoryConfig();
  const [checkpoint] = await supabaseRequest<Array<{ id: string }>>(
    config,
    "polar_change_checkpoints?select=id",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        checkpoint_key: input.checkpointKey,
        namespace_id: input.namespaceId ?? null,
        change_type: input.changeType,
        change_summary: input.changeSummary,
        source_ref: input.sourceRef ?? null,
        commit_sha: input.commitSha ?? null,
        schema_version: input.schemaVersion ?? null,
        state_hash: input.stateHash ?? null,
        metadata: input.metadata ?? {},
      }),
    },
  );
  return checkpoint;
}
