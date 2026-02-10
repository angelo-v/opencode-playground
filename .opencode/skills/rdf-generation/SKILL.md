---
name: rdf-generation
description: Generate Turtle RDF from prose user input
license: MIT
compatibility: opencode
metadata:
  workflow: semantic-web
  audience: developers
  focus: solid-project
---

## What I do

- Convert prose descriptions into valid Turtle (TTL) RDF syntax
- Follow RDF best practices and semantic web standards
- Use appropriate ontologies including Solid project vocabularies (ACL, VCARD, LDP, etc.)
- Generate clean, well-formatted, and properly prefixed RDF
- Validate turtle syntax before output
- Suggest appropriate URIs and namespace conventions

## When to use me

Use this skill when:
- User asks to create RDF data
- User wants to convert data descriptions to Turtle format
- User needs semantic web/linked data representations
- User requests ontology definitions or vocabulary files

## Best practices I follow

### 1. Proper prefixes
Always declare common prefixes at the top. Include Solid project ontologies when relevant:
```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix vcard: <http://www.w3.org/2006/vcard/ns#> .
@prefix acl: <http://www.w3.org/ns/auth/acl#> .
@prefix solid: <http://www.w3.org/ns/solid/terms#> .
@prefix ldp: <http://www.w3.org/ns/ldp#> .
@prefix schema: <http://schema.org/> .
@prefix as: <https://www.w3.org/ns/activitystreams#> .
```

### 2. URI conventions
- Use meaningful, hierarchical URIs
- Prefer HTTPS when possible
- **Prefer hash URIs (#) for vocabulary terms and resources**
- Use fragment identifiers for clean, bookmark-able resources
- Example: `https://example.org/vocab#Person` rather than `https://example.org/vocab/Person`
- **For document-relative URIs, use `<#fragment>` or define a base URI with `@base` and use `:fragment` notation**
- When creating instance data, use hash URIs relative to the document (e.g., `<#order1>` or with `@base`, just `#order1`)

### 3. Literal datatypes
- Always specify datatypes for typed literals
- Common types: `xsd:string`, `xsd:integer`, `xsd:date`, `xsd:boolean`, `xsd:decimal`
- **Use language tags matching the user's input language** (e.g., `"Hello"@en`, `"Bonjour"@fr`, `"Hallo"@de`)
- Detect language from user's prose and apply appropriate tags
- Use `xsd:dateTime` with ISO 8601 format

### 4. Blank nodes
- Use blank nodes `[]` for complex nested structures
- Prefer named nodes for resources that need to be referenced
- Use blank node labels `_:b1` only when necessary for readability

### 5. Turtle syntax
- Use `;` to continue with same subject
- Use `,` to continue with same subject and predicate
- Use `.` to end statements
- Group related statements together
- Add blank lines between different entities for readability

### 6. Common patterns

**Classes:**
```turtle
:MyClass a rdfs:Class ;
    rdfs:label "My Class"@en ;
    rdfs:comment "Description of the class"@en ;
    rdfs:subClassOf :ParentClass .
```

**Properties:**
```turtle
:myProperty a rdf:Property ;
    rdfs:label "my property"@en ;
    rdfs:comment "Description of the property"@en ;
    rdfs:domain :DomainClass ;
    rdfs:range :RangeClass .
```

**Instances:**
```turtle
:instance1 a :MyClass ;
    rdfs:label "Instance 1"@en ;
    :myProperty :relatedInstance ;
    dcterms:created "2026-02-10T00:00:00Z"^^xsd:dateTime .
```

## Questions to ask

When the user request is ambiguous, ask:
1. What is the base URI/namespace for this data?
2. Are there existing ontologies or vocabularies to reuse?
3. What is the intended use case for this RDF data?
4. Are there specific properties or relationships needed?
5. Should this follow specific Solid conventions (e.g., WebID profiles, ACL rules)?

## Validation

Before finalizing output:
- Check all prefixes are declared
- Verify URIs are properly formatted
- Ensure all statements end with `.`
- Confirm datatypes are correct
- Test that blank nodes don't create orphaned data

## Output format

**CRITICAL: Always create a .ttl file when generating RDF data.**

Always output complete, valid Turtle files that can be:
- Parsed by standard RDF libraries (Apache Jena, RDFLib, etc.)
- Loaded into triple stores (Virtuoso, Blazegraph, GraphDB)
- Validated using online validators or CLI tools

**File creation requirements:**
- Save RDF data to a `.ttl` file with a meaningful filename
- Use kebab-case for filenames (e.g., `pizza-order.ttl`, `person-profile.ttl`)
- Place files in an appropriate location (ask user if unclear, default to current directory)

## Example workflow

User: "Create RDF for a person named John Smith who works at Acme Corp"

Response: I'll create a Turtle file with RDF for John Smith.

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix vcard: <http://www.w3.org/2006/vcard/ns#> .

<#john-smith> a foaf:Person ;
    foaf:name "John Smith"@en ;
    vcard:organization-name "Acme Corp"@en .
```

*Creates file: person-profile.ttl*

Note: 
- Language tags match the user's input language. This example uses @en because the user wrote in English.
- The resource uses a document-relative hash URI `<#john-smith>` instead of an external namespace prefix.
