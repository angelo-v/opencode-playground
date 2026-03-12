# OpenCode playground

This repository is just me messing around with OpenCode and exploring what it can do.

## Skills

| Skill | Description |
|---|---|
| **ansible-role** | Scaffolds Ansible roles with proper directory structure, idempotent tasks, and best-practice conventions. |
| **bdd-gherkin** | Generates domain-driven Gherkin/Cucumber BDD feature files focused on business requirements rather than implementation details. |
| **create-skill** | Guides creation of new OpenCode agent skills following the correct SKILL.md format and frontmatter conventions. |
| **rdf-generation** | Converts prose user input into well-formatted Turtle RDF files using appropriate ontologies. |
| **simple-html** | Generates clean, responsive, accessible single-file HTML5 pages with inline CSS. |
| **ddd-context-map** | Builds a DDD context map by interviewing the user about bounded contexts, teams, and inter-context relationships, then generating a Turtle RDF file using the `dddcm:` vocabulary. Supports all standard patterns: Partnership, Shared Kernel, Customer-Supplier, Upstream-Downstream, ACL, OHS, Conformist, Published Language, Separate Ways, and Big Ball of Mud. |
| **sparql-query-agent** | Constructs and executes SPARQL queries against local RDF files using the Comunica engine. |
| **wikidata-query** | Answers factual questions about real-world entities by querying the Wikidata knowledge base via SPARQL. |

## Tools

| Tool | Description |
|---|---|
| **rdflib_fetch** | Fetches RDF data from a URI and loads it into a persistent local N-Quads store, accumulating triples across calls. |
| **rdflib_match** | Queries the local RDF store using triple patterns, returning matching statements as structured JSON objects. |

## Context Map Viewer

`context-map-viewer.html` is a standalone browser app for visualising Turtle files produced by the **ddd-context-map** skill. Open it directly in a browser, load a `.ttl` file, and click nodes or edges to inspect details.
