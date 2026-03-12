---
name: ddd-context-map
description: Build a Domain-Driven Design (DDD) context map by interviewing the user about their bounded contexts, domains, and inter-context relationships, then generating a Turtle RDF file that can be queried with SPARQL. Use this skill when the user wants to create a context map, describe bounded contexts, map upstream/downstream relationships, model DDD patterns (Anti-Corruption Layer, Open Host Service, Shared Kernel, Partnership, Conformist, Published Language, Customer-Supplier), or document their system landscape in DDD terms — even if they just say "I want to describe my systems" or "help me map my domains".
license: MIT
compatibility: opencode
metadata:
  domain: domain-driven-design
  workflow: context-mapping
  output: turtle-rdf
  vocabulary: https://vocab.example/ddd-context-map#
---

## What I do

- Interview the user to capture all bounded contexts, teams, domains, and relationships in their system
- Guide classification of relationship patterns: Partnership, Shared Kernel, Customer-Supplier, Upstream-Downstream, Conformist, Anti-Corruption Layer, Open Host Service, Published Language, Separate Ways, Big Ball of Mud
- Optionally model the domain layer (Core / Supporting / Generic subdomains)
- Generate a valid Turtle RDF file using the `dddcm:` vocabulary that can be loaded and queried with SPARQL
- Use relative hash URIs so no external base URI is required

## When to use me

Use this skill when:
- User wants to create or document a DDD context map
- User describes systems, services, or contexts and their dependencies
- User asks about upstream/downstream relationships between systems
- User wants to model bounded contexts, teams, or subdomains
- User wants a machine-readable or queryable representation of their architecture

## Vocabulary reference

The generated TTL file uses this prefix:

```turtle
@prefix dddcm: <https://vocab.example/ddd-context-map#> .
```

The vocabulary file lives at:
`file:///workspace/.opencode/skills/ddd-context-map/ddd-context-map-vocab.ttl`

### Key classes

| Class | URI | Use for |
|---|---|---|
| `dddcm:ContextMap` | `dddcm:ContextMap` | The root map node |
| `dddcm:BoundedContext` | `dddcm:BoundedContext` | Each bounded context |
| `dddcm:Team` | `dddcm:Team` | A team (subclass of BoundedContext) |
| `dddcm:Domain` | `dddcm:Domain` | A top-level domain |
| `dddcm:Subdomain` | `dddcm:Subdomain` | A classified subdomain |
| `dddcm:Partnership` | `dddcm:Partnership` | Symmetric: mutual co-evolution |
| `dddcm:SharedKernel` | `dddcm:SharedKernel` | Symmetric: shared code/model artifact |
| `dddcm:SeparateWays` | `dddcm:SeparateWays` | Deliberate non-integration |
| `dddcm:BigBallOfMud` | `dddcm:BigBallOfMud` | Diagnostic: poorly-structured system |
| `dddcm:UpstreamDownstreamRelationship` | `dddcm:UpstreamDownstreamRelationship` | Generic asymmetric dependency |
| `dddcm:CustomerSupplierRelationship` | `dddcm:CustomerSupplierRelationship` | Negotiated upstream-downstream |

### Upstream/downstream role instances (use as object of `dddcm:upstreamRole` / `dddcm:downstreamRole`)

| Role | Property | Meaning |
|---|---|---|
| `dddcm:OpenHostService` | `dddcm:upstreamRole` | Upstream exposes a stable, general-purpose API |
| `dddcm:PublishedLanguage` | `dddcm:upstreamRole` | Upstream uses a standard interchange language |
| `dddcm:AntiCorruptionLayer` | `dddcm:downstreamRole` | Downstream translates/isolates from upstream model |
| `dddcm:Conformist` | `dddcm:downstreamRole` | Downstream adopts upstream model wholesale |

**Constraint:** `dddcm:AntiCorruptionLayer` and `dddcm:Conformist` are mutually exclusive on the same relationship.

### Domain classification instances

| Value | Use as object of `dddcm:subdomainType` |
|---|---|
| `dddcm:CoreDomain` | Primary competitive differentiator |
| `dddcm:SupportingDomain` | Necessary but not differentiating |
| `dddcm:GenericSubdomain` | Commodity — buy or adopt rather than build |

### Map metadata instances

| Value | Property |
|---|---|
| `dddcm:SystemLandscape` | `dddcm:mapType` |
| `dddcm:Organisational` | `dddcm:mapType` |
| `dddcm:AsIs` | `dddcm:mapState` |
| `dddcm:ToBe` | `dddcm:mapState` |

### Key properties quick-reference

| Property | Domain | Notes |
|---|---|---|
| `dddcm:contains` | ContextMap | Links map → bounded contexts |
| `dddcm:hasRelationship` | ContextMap | Links map → relationships |
| `dddcm:mapType` | ContextMap | SystemLandscape or Organisational |
| `dddcm:mapState` | ContextMap | AsIs or ToBe |
| `dddcm:domainVisionStatement` | BoundedContext | 1–3 sentence purpose |
| `dddcm:implementationTechnology` | BoundedContext | e.g. "Node.js, PostgreSQL" |
| `dddcm:responsibility` | BoundedContext | Repeatable; one per aggregate/capability |
| `dddcm:contextType` | BoundedContext | FeatureContext, ApplicationContext, SystemContext, TeamContext |
| `dddcm:implementsDomain` | BoundedContext | → Domain or Subdomain |
| `dddcm:realizesContext` | Team | → the system BC the team builds |
| `dddcm:subdomainType` | Subdomain | CoreDomain, SupportingDomain, GenericSubdomain |
| `dddcm:upstream` | UpstreamDownstream | → BoundedContext |
| `dddcm:downstream` | UpstreamDownstream | → BoundedContext |
| `dddcm:upstreamRole` | UpstreamDownstream | → OpenHostService, PublishedLanguage |
| `dddcm:downstreamRole` | UpstreamDownstream | → AntiCorruptionLayer, Conformist |
| `dddcm:exposedAggregate` | UpstreamDownstream | String; repeatable |
| `dddcm:integrationTechnology` | ContextRelationship | e.g. "RESTful HTTP", "Kafka events" |
| `dddcm:participant` | SymmetricRelationship | Repeatable; both participants |
| `dddcm:sharedArtifact` | SharedKernel | Description of the shared code/schema |
| `dddcm:relationshipName` | ContextRelationship | Optional human label |

---

## Interview workflow

Follow these three phases. **Use the Question tool** for every multi-choice prompt. Gather all answers before generating any RDF.

---

### Phase 1 — Context map framing

Ask the following questions (can be combined into one Question tool call):

1. **Name**: What is the name of this system or product? (used as the map's `rdfs:label`)
2. **State**: Is this an AS-IS map (current state) or TO-BE map (desired future state)?
3. **Type**: Is this a SYSTEM LANDSCAPE map (technical systems only) or an ORGANISATIONAL map (teams alongside systems)?

---

### Phase 2 — Bounded contexts

For each bounded context the user describes, gather:

1. **Name**: Short identifier (will become the hash URI fragment, e.g. `<#order-management>`)
2. **Vision statement**: 1–3 sentence description of its business purpose
3. **Context type**: Feature / Application / System / Team
4. **Responsibilities**: Key aggregates or data sets it owns (can be a comma-separated list)
5. **Implementation technology**: Optional — e.g. "Java, Spring Boot"

After each context, ask: "Is there another bounded context to add?"

**Domain layer (optional):** After all contexts are collected, ask:
> "Would you like to classify any subdomains as Core, Supporting, or Generic? This helps document strategic priorities."

If yes, for each subdomain ask:
- Subdomain name
- Classification: Core Domain / Supporting Domain / Generic Subdomain
- Which bounded context(s) implement it

---

### Phase 3 — Relationships

For each relationship, gather:

1. **Participants**: Which two bounded contexts are involved?
2. **Relationship category**:
   - **Symmetric** (equal standing): Partnership, Shared Kernel, Separate Ways, Big Ball of Mud
   - **Asymmetric** (one influences the other): Upstream-Downstream or Customer-Supplier
3. **For asymmetric relationships**, ask:
   - Which context is upstream (the one others depend on)?
   - Does the upstream expose a stable API to multiple consumers? → `dddcm:OpenHostService`
   - Does the upstream use a standard/published interchange format? → `dddcm:PublishedLanguage`
   - Does the downstream build a translation layer to protect its model? → `dddcm:AntiCorruptionLayer`
   - Does the downstream adopt the upstream model wholesale? → `dddcm:Conformist`
   - Is this a Customer-Supplier relationship (downstream has negotiating power over upstream planning)?
   - Which aggregates does the upstream expose to this downstream? (optional)
4. **For Shared Kernel**, ask: What is the shared artifact (library, schema, event contract, etc.)?
5. **Integration technology**: Optional — e.g. "RESTful HTTP", "Apache Kafka", "shared database"
6. **Relationship label**: Optional human-readable name for the relationship

After each relationship, ask: "Is there another relationship to add?"

---

## RDF generation

Once the interview is complete, use the `rdf-generation` skill to generate the Turtle file.

### URI conventions

- Use **relative hash URIs** throughout: `<#map>`, `<#order-management>`, `<#rel-orders-to-payments>`
- Derive fragment names from the concept name using kebab-case
- Relationship URIs: prefix with `rel-` followed by kebab-case description, e.g. `<#rel-orders-payments>`

### Required file structure

```turtle
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix dddcm: <https://vocab.example/ddd-context-map#> .

# --- Context Map ---
<#map>
    a dddcm:ContextMap ;
    rdfs:label "<map name>"@en ;
    dddcm:mapType dddcm:SystemLandscape ;   # or dddcm:Organisational
    dddcm:mapState dddcm:AsIs ;             # or dddcm:ToBe
    dddcm:contains <#context-a>, <#context-b> ;
    dddcm:hasRelationship <#rel-a-b> .

# --- Bounded Contexts ---
<#context-a>
    a dddcm:BoundedContext ;
    rdfs:label "<Name>"@en ;
    dddcm:domainVisionStatement "<vision>"@en ;
    dddcm:contextType dddcm:ApplicationContext ;
    dddcm:responsibility "Orders"@en, "Payments"@en ;
    dddcm:implementationTechnology "Java, Spring Boot"@en .

# --- Subdomains (if any) ---
<#subdomain-a>
    a dddcm:Subdomain ;
    rdfs:label "<Name>"@en ;
    dddcm:subdomainType dddcm:CoreDomain .

<#context-a>
    dddcm:implementsDomain <#subdomain-a> .

# --- Relationships ---

# Upstream-Downstream example:
<#rel-a-b>
    a dddcm:UpstreamDownstreamRelationship ;
    dddcm:upstream <#context-a> ;
    dddcm:downstream <#context-b> ;
    dddcm:upstreamRole dddcm:OpenHostService ;
    dddcm:downstreamRole dddcm:AntiCorruptionLayer ;
    dddcm:integrationTechnology "RESTful HTTP"@en ;
    dddcm:exposedAggregate "Order"@en .

# Customer-Supplier example:
<#rel-b-c>
    a dddcm:CustomerSupplierRelationship ;
    dddcm:upstream <#context-b> ;   # supplier
    dddcm:downstream <#context-c> ; # customer
    dddcm:integrationTechnology "Apache Kafka events"@en .

# Partnership example:
<#rel-c-d>
    a dddcm:Partnership ;
    dddcm:participant <#context-c>, <#context-d> ;
    dddcm:integrationTechnology "Shared deployment pipeline"@en .

# Shared Kernel example:
<#rel-d-e>
    a dddcm:SharedKernel ;
    dddcm:participant <#context-d>, <#context-e> ;
    dddcm:sharedArtifact "shared-domain-events npm package"@en .
```

### File naming

Use kebab-case based on the map name: `<map-name>-context-map.ttl`
Example: `ecommerce-context-map.ttl`

---

## Validation checklist

Before finalising the TTL file, verify:

- [ ] `@prefix dddcm:` is declared
- [ ] `<#map>` has `dddcm:contains` for every bounded context
- [ ] `<#map>` has `dddcm:hasRelationship` for every relationship
- [ ] Every bounded context has `a dddcm:BoundedContext` (or `dddcm:Team`) and `rdfs:label`
- [ ] Every asymmetric relationship has both `dddcm:upstream` and `dddcm:downstream`
- [ ] No relationship has both `dddcm:AntiCorruptionLayer` and `dddcm:Conformist` as downstream roles
- [ ] `OHS`/`PL` are only used as `dddcm:upstreamRole`, never `dddcm:downstreamRole`
- [ ] `ACL`/`CF` are only used as `dddcm:downstreamRole`, never `dddcm:upstreamRole`
- [ ] Symmetric relationships use `dddcm:participant`, not `dddcm:upstream`/`dddcm:downstream`
- [ ] All statements end with `.`
- [ ] All prefixes used in the file are declared
- [ ] File saved as `<name>-context-map.ttl`

Base directory for this skill: file:///workspace/.opencode/skills/ddd-context-map
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
