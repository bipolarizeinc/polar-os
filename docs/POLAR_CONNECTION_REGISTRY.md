# P.O.L.A.R. Connection Registry

External tools are registered capabilities, not global permissions.

Each connection declares:

- memory namespace
- data classification
- supported capabilities
- capabilities that require explicit approval
- secret references (names only, never secret values)
- divisions allowed to use the connection

## Initial registry

| Connection | Namespace | Default classification | Typical divisions | Write / side-effect posture |
| --- | --- | --- | --- | --- |
| GitHub | `github` | internal | Nexus, Cipher, Vault, Blueprint | changes/deployments require approval |
| Google Drive | `google-drive` | confidential | Dr.Docx, Vault, Blueprint, BrandForge | creates/edits/deletes require approval |
| Gmail | `gmail` | confidential | Nexus, LaunchPad, Blueprint | send/update/delete require approval |
| Google Calendar | `calendar` | confidential | Nexus, LaunchPad, Blueprint | create/update/delete require approval |
| HyperFrames | `hyperframes` | internal | Sav.VidzGen, BrandForge | render/update require approval |
| Web Research | `internet-research` | internal | all divisions | read/search only by default |
| Social | `social` | confidential | BrandForge, Sav.VidzGen, Pulse, Nexus | create/update/delete/publish require approval |

## Division tool minimization

A division should load only its own tools and the shared capabilities required for the task. This reduces prompt/tool clutter, accidental cross-system actions, and irrelevant operational context.

Division memory may reference an external artifact by durable reference rather than copying the entire external object's contents into multiple namespaces.

## Social connection standard

Social account connections are OAuth-backed provider adapters. Institutional memory stores only account references, scopes, approval/audit references, and resulting public post identifiers.

Raw access tokens and refresh tokens are secrets and must remain in approved secret infrastructure.

P.O.L.A.R. may:

- read approved account/public performance data when authorized
- draft posts
- assemble approved media/copy packages
- recommend schedule/campaign choices

P.O.L.A.R. may publish, update, schedule, or delete social content only after explicit approval has been recorded.

## Connector lifecycle

Before a new connector becomes active:

1. register its namespace and classification
2. define read/write capabilities
3. define approval requirements
4. isolate credentials in secret storage
5. test least-privilege scopes
6. create audit hooks
7. verify revocation behavior
8. create a checkpoint under the institutional security lifecycle
