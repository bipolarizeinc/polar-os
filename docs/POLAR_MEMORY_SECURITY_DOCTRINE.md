# P.O.L.A.R. Memory & Security Doctrine

## Purpose
P.O.L.A.R. is an institutional operating system. Memory must remain useful without becoming a single undifferentiated data swamp. Every retained fact, decision, instruction, asset, risk, contradiction, preference, and relationship belongs to an explicit namespace and classification.

## Memory hierarchy
1. Enterprise memory — BI POLARIZE ENTERPRISES, INC. constitutional and enterprise-wide knowledge.
2. Organization memory — one client or internal organization. No cross-client leakage.
3. Division memory — Blueprint™, Dr.Docx™, BrandForge™, LaunchPad™, Nexus™, Pulse™, Vault™, Cipher™, Sav.VidzGen™.
4. Extension memory — a specific agent, integration, app, workflow, or plugin under a division.
5. Project memory — scoped work with a defined objective and lifecycle.
6. Session memory — short-lived working context that may be promoted upward only when it becomes institutionally useful.

## Retrieval rule
P.O.L.A.R. retrieves the narrowest relevant namespace first. Parent memory may be read only according to inheritance mode. Sibling and unrelated client namespaces are never searched by default. Cross-namespace retrieval requires a declared operational reason and authorization.

## Classification
- PUBLIC — safe for public release.
- INTERNAL — ordinary internal operations.
- CONFIDENTIAL — business-sensitive material.
- RESTRICTED — credentials, financial/security-sensitive records, or tightly limited client data.
- CONSTITUTIONAL — enterprise governance and immutable doctrine.

Secrets are not stored as normal memory content. API keys, passwords, tokens, private keys, and equivalent secrets belong in a secret manager or hosting environment variable store. Memory may retain only secret metadata such as provider, purpose, owner, rotation date, and reference name.

## Automatic major-move protocol
Every major creation, implementation, deployment, migration, permission change, integration, or policy change follows this lifecycle:

1. SECURE — classify data, check authority, validate boundaries, identify secrets, and apply least privilege.
2. SAVE — commit source/configuration changes and persist approved institutional decisions.
3. BACK UP — create or verify an independent recovery point appropriate to the asset.
4. PROTECT — verify firewall/rate limits, access controls, RLS/server boundaries, logging, and secret exposure.
5. CHECKPOINT — record the change, commit/reference, security status, backup status, and protection status in `polar_change_checkpoints`.

A major move is not considered complete while a required checkpoint remains pending or failed.

## Client data boundary
Each client is an organization-scoped namespace tree. P.O.L.A.R. may never merge client memory into enterprise memory merely because it is useful. Reusable knowledge must be abstracted into a non-identifying enterprise record before promotion. Client source data stays in the client namespace.

## Division memory boundary
Each division maintains its own operational memory. Enterprise memory contains only cross-division rules, shared identity, approved strategic decisions, and summarized institutional knowledge. This keeps specialist retrieval small and reduces irrelevant context.

## Auditability
Memory creates, reads, updates, archives, exports, denied accesses, checkpoints, and security events are auditable. Audit records should avoid raw secrets and unnecessary personal data.

## Browser boundary
Institutional memory is server-controlled. Browser clients do not receive Supabase service-role credentials and do not query protected memory tables directly. Public/client UI requests go through authenticated, rate-limited server routes that enforce namespace authorization.

## Backup doctrine
Database-local snapshots are useful checkpoints but are not independent backups. Production requires an external recovery mechanism such as Supabase managed backups/PITR or encrypted exports to approved durable storage. Backup verification must be recorded in the checkpoint ledger.

## Internet and connector boundary
Real-time web search, social platforms, plugins, and external connectors are tools, not trusted memory sources. Retrieved information is treated as unverified until source quality and relevance are evaluated. External content must never override constitutional policy, authority boundaries, or client isolation.

## Default deny
If P.O.L.A.R. cannot determine the namespace, classification, authority, or destination of sensitive data, it does not write, export, or execute. It escalates the decision instead.
