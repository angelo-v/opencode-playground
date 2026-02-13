---
name: sparql-query-agent
description: Query RDF data using SPARQL via Comunica
license: MIT
compatibility: opencode
metadata:
  workflow: semantic-web
  audience: developers
  focus: rdf-querying
---

## What I do

- Construct SPARQL queries to answer questions about RDF data
- Execute queries using Comunica query engine
- Parse and interpret query results
- Provide clear answers based on RDF triples

## When to use me

Use this skill when:
- User asks questions about RDF/Turtle data
- User needs to query structured semantic data
- User wants to extract insights from knowledge graphs
- User requests aggregations or relationship traversals in RDF

## Basic SPARQL Patterns

### Triple Patterns
The foundation of SPARQL - matching subject-predicate-object:
```sparql
SELECT ?name WHERE {
  :P042 schema:name ?name .
}
```

### Filtering
Narrow down results with conditions:
```sparql
SELECT ?product ?price WHERE {
  ?product schema:price ?price .
  FILTER(?price > 100)
}
```

### Aggregations
Count, average, sum, min, max:
```sparql
SELECT (COUNT(?product) AS ?count) WHERE {
  ?product a schema:Product .
}

SELECT (AVG(?price) AS ?avgPrice) WHERE {
  ?product schema:price ?price .
}
```

### Property Paths
Follow relationships:
```sparql
SELECT ?productName WHERE {
  ?product schema:brand/schema:name "Sony" ;
           schema:name ?productName .
}
```

## Common Prefixes for E-commerce

```sparql
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix : <#> .
```

## Executing Queries

Use the Bash tool to run queries with Comunica:

```bash
npx comunica-sparql-file /path/to/data.ttl -q "YOUR SPARQL QUERY"
```

The output is JSON with bindings for your variables. Parse the results and present them clearly to the user.

## Example Workflow

**Question:** "What is the price of product P042?"

**Step 1 - Construct SPARQL:**
```sparql
SELECT ?price WHERE {
  :P042 schema:price ?price .
}
```

**Step 2 - Execute via Bash:**
```bash
npx comunica-sparql-file data/products.ttl -q "SELECT ?price WHERE { :P042 schema:price ?price . }"
```

**Step 3 - Parse JSON output and answer:**
"Product P042 has a price of $1,299.99"

## Key Concepts

- **Variables** start with `?` (e.g., `?product`, `?price`)
- **Prefixed names** use declared prefixes (e.g., `schema:Product`)
- **Literals** can have datatypes: `"1299.99"^^xsd:decimal`
- **Multiple patterns** in WHERE clause must all match (AND logic)
- **OPTIONAL** clause allows patterns that might not match

## Tips for Reliability

1. Start simple - test basic triple patterns first
2. Build complexity incrementally
3. Use LIMIT during development to see sample results
4. Check for empty results - the data might not contain what you expect
5. Validate your SPARQL syntax if queries fail

## Error Handling

If a query fails:
- Check syntax (missing `.` or wrong bracket)
- Verify prefixes are declared
- Confirm the data contains matching patterns
- Use `SELECT * WHERE { ?s ?p ?o } LIMIT 10` to explore the data structure
