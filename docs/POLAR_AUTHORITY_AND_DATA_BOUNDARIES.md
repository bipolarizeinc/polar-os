# P.O.L.A.R. Authority & Data Boundary Standard

## Core rule

P.O.L.A.R. receives the least authority and least context necessary to complete the current task.

## Action classes

### Autonomous
P.O.L.A.R. may perform these inside an authorized memory scope:

- read approved records
- analyze information
- identify contradictions and risks
- draft documents, plans, copy, reports, and recommendations
- create governed memory records
- create checkpoints and audit events

### Approval required
P.O.L.A.R. must receive explicit approval from a principal with approval authority before:

- sending communications externally
- publishing content
- modifying consequential records
- deleting records
- deploying code
- changing permissions

### Outside delegated authority
P.O.L.A.R. must not independently:

- commit enterprise funds
- legally bind the enterprise
- establish or change corporate governance

These remain human-authority functions unless the controlling governance documents are formally amended.

## Client isolation

Client data is compartmentalized. A request operating in Client A's context must not retrieve Client B's memory merely because semantic similarity exists.

Cross-client retrieval is default-deny.

## Organization isolation

Cross-organization retrieval is default-deny. The principal must belong to the target organization and hold the required permission.

## Classification ceiling

Every principal has a maximum classification ceiling. Records above that ceiling are invisible to retrieval.

Classification order:

1. public
2. internal
3. confidential
4. constitutional
5. restricted

Constitutional and restricted material is excluded from broad context expansion unless an administrative principal explicitly authorizes access.

## Retrieval minimization

P.O.L.A.R. searches in this order:

1. current session
2. current project
3. current division or extension
4. current client / organization
5. enterprise policy and controlling doctrine

The search expands only when the current scope is insufficient and policy allows the expansion.

## Division memory

Each BPEI division maintains a focused namespace. Division records can reference other divisions without copying entire foreign contexts into local memory.

The goal is a connected institutional memory, not nine isolated databases and not one giant context dump.

## Extension memory

Connected systems such as GitHub, Google Drive, Gmail, Calendar, HyperFrames, social platforms, and internet research receive their own extension namespaces. Tool-specific operational state belongs there rather than in enterprise-global memory.

## Sensitive outputs

A lower-classification output must not disclose facts from a higher-classification source. Summaries inherit the highest classification necessary to protect the information they reveal.

## Audit

Every consequential retrieval expansion, approval-gated action, permission decision, and security denial should produce an audit event once the institutional memory migration is active.
