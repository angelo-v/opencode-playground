---
name: data-flow-map
description: Build a data flow map by interviewing the user about data exchanges between bounded contexts, then generating a Turtle RDF file using the dflow: vocabulary. Use when the user wants to document data flows, message types (events/commands/queries), triggers, payloads, coordination styles, or transport channels between systems — even if they just say "describe what data moves between our services" or "map how data flows in our architecture". Complements the ddd-context-map skill.
license: MIT
compatibility: opencode
metadata:
  domain: domain-driven-design
  workflow: data-flow-mapping
  output: turtle-rdf
  vocabulary: https://vocab.example/data-flow#
---

## What I do

- Interview the user to capture all data flows between bounded contexts in their system
- Guide classification of message types: IntegrationEvent, Command, Query, Reply
- Capture flow direction (Push, Pull, RequestResponse) and coordination style (Orchestrated, Choreographed)
- Record trigger types: DomainEvent, IntegrationEvent, Scheduled, or Command-triggered
- Describe payloads at aggregate level using ubiquitous language
- Generate a valid Turtle RDF file using the `dflow:` vocabulary that can be loaded and queried with SPARQL
- Optionally link flows to an existing DDD context map via `dflow:refinesRelationship`

## When to use me

Use this skill when:
- User wants to document what data moves between services or bounded contexts
- User asks about events, commands, or queries crossing system boundaries
- User describes integration flows, message passing, or API contracts
- User wants to capture trigger conditions, payloads, or transport channels
- User wants a machine-readable or queryable representation of their data flows
- Used after `ddd-context-map` to add flow detail to relationships

## Vocabulary reference

The generated TTL file uses this prefix:

```turtle
@prefix dflow: <https://vocab.example/data-flow#> .
```

The vocabulary file lives at:
`file:///workspace/.opencode/skills/data-flow-map/data-flow-vocab.ttl`

### Key classes

| Class | URI | Use for |
|---|---|---|
| `dflow:DataFlowMap` | `dflow:DataFlowMap` | Root container for all flows |
| `dflow:DataFlow` | `dflow:DataFlow` | A single directional data exchange |
| `dflow:Payload` | `dflow:Payload` | The data object transferred |
| `dflow:IntegrationEvent` | `dflow:IntegrationEvent` | Versioned public fact broadcast |
| `dflow:Command` | `dflow:Command` | Directed write intent to one receiver |
| `dflow:Query` | `dflow:Query` | Read request expecting a reply |
| `dflow:Reply` | `dflow:Reply` | Response to a Query or Command |
| `dflow:Push` | `dflow:Push` | Sender initiates delivery |
| `dflow:Pull` | `dflow:Pull` | Receiver initiates the request |
| `dflow:RequestResponse` | `dflow:RequestResponse` | Synchronous call-and-wait |
| `dflow:Orchestrated` | `dflow:Orchestrated` | Explicit orchestrator controls sequence |
| `dflow:Choreographed` | `dflow:Choreographed` | Decentralised event reactions |
| `dflow:DomainEventTrigger` | `dflow:DomainEventTrigger` | Intra-context event translated outward |
| `dflow:IntegrationEventTrigger` | `dflow:IntegrationEventTrigger` | Incoming integration event subscription |
| `dflow:ScheduledTrigger` | `dflow:ScheduledTrigger` | Time-based schedule |
| `dflow:CommandTrigger` | `dflow:CommandTrigger` | Explicit user or system command |

### Key properties quick-reference

| Property | Domain | Notes |
|---|---|---|
| `dflow:describesMap` | DataFlowMap | Links to a `dddcm:ContextMap` if one exists |
| `dflow:hasFlow` | DataFlowMap | Links map → each DataFlow |
| `dflow:sender` | DataFlow | Originating bounded context |
| `dflow:receiver` | DataFlow | Receiving bounded context |
| `dflow:refinesRelationship` | DataFlow | Links to a `dddcm:ContextRelationship` |
| `dflow:messageType` | DataFlow | IntegrationEvent, Command, Query, or Reply |
| `dflow:direction` | DataFlow | Push, Pull, or RequestResponse |
| `dflow:coordinationStyle` | DataFlow | Orchestrated or Choreographed |
| `dflow:hasTrigger` | DataFlow | The trigger node |
| `dflow:triggerDescription` | DataFlow | Human-readable trigger summary |
| `dflow:channel` | DataFlow | Transport mechanism, e.g. "AMQP queue" |
| `dflow:flowName` | DataFlow | Optional short human label |
| `dflow:notes` | DataFlow | Free-text notes, open questions |
| `dflow:carries` | DataFlow | Links to the Payload node |
| `dflow:aggregateName` | Payload | Aggregate name in ubiquitous language |
| `dflow:payloadDescription` | Payload | Human-readable payload summary |
| `dflow:eventName` | EventTrigger | Event name in ubiquitous language |
| `dflow:schedule` | ScheduledTrigger | Human-readable schedule, e.g. "nightly at 02:00" |

---

## Interview workflow

Follow these three phases. **Use the Question tool** for every multi-choice prompt. Gather all answers before generating any RDF.

---

### Phase 1 — Map framing

Ask the following questions (can be combined into one Question tool call):

1. **Name**: What is the name of this data flow map? (used as `rdfs:label`)
2. **Context map link**: Is there an existing DDD context map TTL file to link this to? If yes, note the file path — flows can reference its relationships via `dflow:refinesRelationship`.

---

### Phase 2 — Data flows

For each flow the user describes, gather:

1. **Flow name**: A short human label, e.g. "Order Placed event to Inventory"
2. **Sender**: Which bounded context originates this data?
3. **Receiver**: Which bounded context receives it?
4. **Message type**: IntegrationEvent / Command / Query / Reply
5. **Direction**: Push (sender initiates) / Pull (receiver requests) / RequestResponse (synchronous)
6. **Coordination style**: Orchestrated (explicit coordinator) / Choreographed (decentralised reactions)
7. **Trigger**: What causes this flow?
   - Domain event (name the internal event)
   - Integration event arriving from another context (name the public event)
   - Scheduled (describe the schedule)
   - Explicit command or user action
8. **Trigger description**: A brief human-readable sentence describing what initiates the flow
9. **Payload**: What aggregate or data object is transferred? Give it a name from the ubiquitous language and a short description
10. **Channel**: Optional — transport mechanism, e.g. "AMQP queue `order.events`", "REST POST /invoices", "Kafka topic `payments`"
11. **Notes**: Any open questions, transformation logic, or special handling

After each flow, ask: "Is there another data flow to add?"

---

### Phase 3 — Review

Summarise all captured flows in a table before generating RDF, and ask the user to confirm or correct.

| Flow | Sender → Receiver | Message Type | Direction | Trigger |
|------|-------------------|--------------|-----------|---------|
| ...  | ...               | ...          | ...       | ...     |

---

## RDF generation

Once the interview is complete, use the `rdf-generation` skill to generate the Turtle file.

### URI conventions

- Use **relative hash URIs** throughout: `<#flow-map>`, `<#flow-order-to-inventory>`, `<#payload-order-summary>`, `<#trigger-order-placed>`
- Derive fragment names from concept names using kebab-case with a type prefix:
  - Flows: `flow-<kebab-description>`, e.g. `<#flow-order-to-inventory>`
  - Payloads: `payload-<aggregate-name>`, e.g. `<#payload-order-summary>`
  - Triggers: `trigger-<event-or-schedule>`, e.g. `<#trigger-order-placed>`

### Required file structure

```turtle
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix dddcm: <https://vocab.example/ddd-context-map#> .
@prefix dflow: <https://vocab.example/data-flow#> .

# --- Data Flow Map ---
<#flow-map>
    a dflow:DataFlowMap ;
    rdfs:label "<map name>"@en ;
    # dflow:describesMap <existing-context-map.ttl#map> ;  # if linking to a context map
    dflow:hasFlow <#flow-order-to-inventory>,
                  <#flow-payment-confirmed> .

# --- Flow 1: IntegrationEvent example (Push / Choreographed) ---
<#flow-order-to-inventory>
    a dflow:DataFlow ;
    dflow:flowName "Order Placed → Inventory Reservation"@en ;
    dflow:sender <#order-management> ;        # or a dddcm: URI if linking
    dflow:receiver <#inventory> ;
    dflow:messageType dflow:IntegrationEvent ;
    dflow:direction dflow:Push ;
    dflow:coordinationStyle dflow:Choreographed ;
    dflow:hasTrigger <#trigger-order-placed> ;
    dflow:triggerDescription "Customer places an order; Order Management publishes OrderPlaced."@en ;
    dflow:carries <#payload-order-summary> ;
    dflow:channel "Kafka topic 'order.events'"@en ;
    dflow:notes "Inventory must idempotently handle duplicate events."@en .

<#trigger-order-placed>
    a dflow:DomainEventTrigger ;
    dflow:eventName "OrderPlaced"@en .

<#payload-order-summary>
    a dflow:Payload ;
    dflow:aggregateName "OrderSummary"@en ;
    dflow:payloadDescription "Order ID, line items, quantities, and shipping address."@en .

# --- Flow 2: Command example (RequestResponse / Orchestrated) ---
<#flow-payment-confirmed>
    a dflow:DataFlow ;
    dflow:flowName "Charge Payment Command"@en ;
    dflow:sender <#order-management> ;
    dflow:receiver <#payments> ;
    dflow:messageType dflow:Command ;
    dflow:direction dflow:RequestResponse ;
    dflow:coordinationStyle dflow:Orchestrated ;
    dflow:hasTrigger <#trigger-checkout-confirmed> ;
    dflow:triggerDescription "Order saga orchestrator sends ChargePayment command after order is confirmed."@en ;
    dflow:carries <#payload-charge-request> ;
    dflow:channel "REST POST /payments/charge"@en .

<#trigger-checkout-confirmed>
    a dflow:CommandTrigger .

<#payload-charge-request>
    a dflow:Payload ;
    dflow:aggregateName "ChargeRequest"@en ;
    dflow:payloadDescription "Order ID, amount, currency, and payment method token."@en .

# --- Flow 3: Scheduled batch example ---
<#flow-monthly-settlement>
    a dflow:DataFlow ;
    dflow:flowName "Monthly Settlement Export"@en ;
    dflow:sender <#payments> ;
    dflow:receiver <#accounting> ;
    dflow:messageType dflow:IntegrationEvent ;
    dflow:direction dflow:Push ;
    dflow:coordinationStyle dflow:Orchestrated ;
    dflow:hasTrigger <#trigger-monthly-schedule> ;
    dflow:triggerDescription "Nightly job on the 1st of each month exports settlement data."@en ;
    dflow:carries <#payload-settlement-batch> ;
    dflow:channel "SFTP batch file"@en .

<#trigger-monthly-schedule>
    a dflow:ScheduledTrigger ;
    dflow:schedule "Monthly on the 1st at 02:00 CET"@en .

<#payload-settlement-batch>
    a dflow:Payload ;
    dflow:aggregateName "SettlementBatch"@en ;
    dflow:payloadDescription "All completed transactions for the month with amounts and references."@en .
```

### File naming

Use kebab-case based on the map name: `<map-name>-data-flow-map.ttl`
Example: `ecommerce-data-flow-map.ttl`

---

## Validation checklist

Before finalising the TTL file, verify:

- [ ] `@prefix dflow:` is declared
- [ ] `<#flow-map>` has `dflow:hasFlow` for every data flow
- [ ] Every `DataFlow` has `dflow:sender`, `dflow:receiver`, `dflow:messageType`, `dflow:direction`
- [ ] Every `DataFlow` has `dflow:hasTrigger` pointing to a typed trigger node
- [ ] Trigger nodes use the correct subclass: `DomainEventTrigger`, `IntegrationEventTrigger`, `ScheduledTrigger`, or `CommandTrigger`
- [ ] `dflow:eventName` is present on all `EventTrigger` nodes
- [ ] `dflow:schedule` is present on all `ScheduledTrigger` nodes
- [ ] Every `DataFlow` with a payload has `dflow:carries` pointing to a `dflow:Payload` node
- [ ] Every `Payload` has `dflow:aggregateName`
- [ ] `dflow:Reply` flows are paired with a corresponding `dflow:Query` or `dflow:Command` flow
- [ ] All statements end with `.`
- [ ] All prefixes used in the file are declared
- [ ] File saved as `<name>-data-flow-map.ttl`

Base directory for this skill: file:///workspace/.opencode/skills/data-flow-map
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
