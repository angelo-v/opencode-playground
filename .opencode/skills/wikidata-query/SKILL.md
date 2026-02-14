---
name: wikidata-query
description: Answer factual questions about people, places, organizations, events, creative works, awards, and other real-world entities by querying Wikidata's knowledge base. Use for biographical info, geographic data, historical facts, lists, counts, and relationships between entities - even when users don't mention Wikidata.
license: MIT
compatibility: opencode
metadata:
  endpoint: https://query.wikidata.org/sparql
  query-gui: https://query.wikidata.org
  data-source: wikidata
---

# Skill: wikidata-query

## What I do

- Query Wikidata using SPARQL to retrieve facts about entities
- Construct SPARQL queries for specific data retrieval needs
- Format and present Wikidata query results in a readable way
- Help users explore relationships between Wikidata entities
- Provide example queries for common use cases
- Explain query results and Wikidata entity structure

## When to use me

**Use this skill proactively** whenever the user asks factual questions that could be answered by querying structured knowledge, even if they don't mention Wikidata.

Trigger this skill when the user asks about:

### Biographical information
- "Who was [person]?" - basic info about historical or notable people
- "When was [person] born/died?"
- "Where was [person] from?"
- "What did [person] do?" - occupation, achievements
- "List [occupation] from [country/time period]"
- Examples: "Who was Ada Lovelace?", "List French painters from the 19th century"

### Geographic and location data
- "What cities are in [country/region]?"
- "Where is [place] located?"
- "What is the population of [city]?"
- "List [type of place] in [location]"
- Examples: "What cities are in Germany?", "List universities in Paris"

### Organizations and institutions
- "What universities are in [location]?"
- "List [type of organization]"
- Examples: "What museums are in London?", "List space agencies"

### Creative works and cultural artifacts
- "What books did [author] write?"
- "What movies did [director] make?"
- "List films from [year/country]"
- Examples: "What books did Jane Austen write?", "List Pixar movies"

### Awards and achievements
- "Who won [award] in [year/category]?"
- "List [award] winners"
- Examples: "Who won the Nobel Prize in Physics in 2020?", "List Academy Award winners for Best Picture"

### Scientific and technical information
- "What programming languages are there?"
- "List [chemical elements/planets/etc.]"
- "What are the properties of [scientific entity]?"
- Examples: "List programming languages created after 2000", "What moons does Jupiter have?"

### Historical events and dates
- "When did [event] happen?"
- "What happened in [year/period]?"
- Examples: "When did World War II end?", "When was the Eiffel Tower built?"

### Relationships and connections
- "How are [entity A] and [entity B] related?"
- "What is the relationship between [entity A] and [entity B]?"
- Examples: "Who were the students of Albert Einstein?", "What companies did Steve Jobs found?"

### Counting and statistics
- "How many [type] are there in [category/location]?"
- "How many [items] [meet criteria]?"
- Examples: "How many countries are in Europe?", "How many Nobel Prize winners are from France?"

### General factual queries
- Any question starting with: "Who", "What", "When", "Where", "How many", "List", "Find"
- Questions about real-world entities, people, places, organizations, works, events
- Questions seeking verifiable, structured facts

**Important:** Use this skill even when:
- The user doesn't mention "Wikidata" or "SPARQL"
- The user doesn't know Wikidata exists
- The question seems simple - Wikidata often has comprehensive data
- You're unsure if the data exists - try querying and handle no results gracefully

**Don't use this skill for:**
- Opinion-based questions
- Current real-time data (stock prices, weather, current news)
- Questions about code, programming problems, or technical debugging
- Hypothetical scenarios
- Questions about the user's personal data or local files

## Best practices I follow

### 1. Use the Wikidata SPARQL endpoint

The primary endpoint for querying Wikidata is:
- **SPARQL Endpoint**: `https://query.wikidata.org/sparql`
- **Query GUI**: `https://query.wikidata.org/` (for testing and exploration)

Make HTTP GET requests with the query parameter `?query={SPARQL}` and use the header `Accept: application/sparql-results+json` to get JSON results.

### 2. Construct efficient SPARQL queries

**Basic query structure:**
```sparql
SELECT ?item ?itemLabel ?property
WHERE {
  ?item wdt:P31 wd:Q5 .           # instance of (P31) human (Q5)
  ?item wdt:P106 wd:Q901 .         # occupation (P106) scientist (Q901)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 10
```

**Key SPARQL patterns for Wikidata:**
- Use `wd:` prefix for entities (e.g., `wd:Q5` = human)
- Use `wdt:` prefix for direct property values (e.g., `wdt:P31` = instance of)
- Use `wikibase:label` service to get human-readable labels
- Always include a `LIMIT` clause to prevent overwhelming results
- Use `OPTIONAL` blocks for properties that may not exist

### 3. Common Wikidata properties to know

- `P31` - instance of (type/class)
- `P279` - subclass of
- `P106` - occupation
- `P27` - country of citizenship
- `P569` - date of birth
- `P570` - date of death
- `P19` - place of birth
- `P20` - place of death
- `P54` - member of sports team
- `P580` - start time
- `P582` - end time

Find more properties at: https://www.wikidata.org/wiki/Wikidata:List_of_properties

### 4. Handle query results appropriately

When presenting results:
- Extract the most relevant information from the JSON response
- Format dates and values in a human-readable way
- Show entity labels (human-readable names) rather than Q-IDs when possible
- Limit the number of results shown to avoid overwhelming the user
- Provide a link to the query GUI for further exploration

### 5. Provide query explanations

When showing a query or results:
- Explain what the query is searching for
- Clarify any Wikidata-specific terminology (Q-IDs, P-IDs)
- Mention any limitations of the query
- Suggest how the query could be modified for different results

## Questions to ask

When the user request is ambiguous, ask:

1. **What specific information are you looking for?** (e.g., dates, locations, relationships, counts)
2. **Do you need all results or just a sample?** (affects LIMIT clause)
3. **Are you interested in a specific time period or location?** (helps filter results)
4. **Do you want additional related information?** (e.g., dates, descriptions, images)
5. **Should results be ordered in any particular way?** (e.g., by date, alphabetically)

## Example workflows

### Example 1: Finding information about a person

**User:** "Who was Ada Lovelace?"

**Workflow:**
1. Construct a SPARQL query to find Ada Lovelace's entity and basic information
2. Query for properties like birth date, death date, occupation, notable work
3. Execute the query against the Wikidata endpoint
4. Present the results in a clear, readable format

**Query:**
```sparql
SELECT ?property ?propertyLabel ?value ?valueLabel
WHERE {
  wd:Q7259 ?p ?value .
  ?property wikibase:directClaim ?p .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 20
```

### Example 2: Finding entities by criteria

**User:** "List Nobel Prize winners in Physics from France"

**Workflow:**
1. Identify the relevant Wikidata items: Nobel Prize in Physics (Q38104), France (Q142)
2. Construct query filtering by award received and country
3. Request names and award years
4. Execute and present sorted results

**Query:**
```sparql
SELECT ?person ?personLabel ?year
WHERE {
  ?person wdt:P31 wd:Q5 .                    # instance of human
  ?person wdt:P27 wd:Q142 .                  # country of citizenship: France
  ?person p:P166 ?award_statement .          # award received
  ?award_statement ps:P166 wd:Q38104 .       # Nobel Prize in Physics
  ?award_statement pq:P585 ?year .           # point in time
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?year
```

### Example 3: Counting and statistics

**User:** "How many cities are in Germany?"

**Workflow:**
1. Construct a COUNT query for cities in Germany
2. Use the appropriate properties for "instance of city" and "country: Germany"
3. Execute and return the count

**Query:**
```sparql
SELECT (COUNT(?city) AS ?count)
WHERE {
  ?city wdt:P31 wd:Q515 .       # instance of city
  ?city wdt:P17 wd:Q183 .       # country: Germany
}
```

## Common patterns and templates

### Find all instances of a type
```sparql
SELECT ?item ?itemLabel
WHERE {
  ?item wdt:P31 wd:Q_TYPE .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 100
```

### Find entities with a specific property
```sparql
SELECT ?item ?itemLabel ?value ?valueLabel
WHERE {
  ?item wdt:P_PROPERTY wd:Q_VALUE .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 100
```

### Find entities with dates
```sparql
SELECT ?item ?itemLabel ?date
WHERE {
  ?item wdt:P31 wd:Q_TYPE .
  ?item wdt:P_DATE_PROPERTY ?date .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?date
LIMIT 100
```

### Find entities in a geographic location
```sparql
SELECT ?item ?itemLabel ?location
WHERE {
  ?item wdt:P31 wd:Q_TYPE .
  ?item wdt:P17 wd:Q_COUNTRY .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 100
```

## Execution approach

When querying Wikidata:

1. **Use the Bash tool with curl** to make HTTP requests:
```bash
curl -G "https://query.wikidata.org/sparql" \
  --data-urlencode "query=SELECT ..." \
  -H "Accept: application/sparql-results+json"
```

2. **Parse the JSON response** to extract relevant fields from `results.bindings`

3. **Present results clearly** with proper formatting and context

## Troubleshooting

**Query timeout:**
- Reduce the scope of the query
- Add more specific filters
- Reduce the LIMIT or use OFFSET for pagination

**No results returned:**
- Verify Q-IDs and P-IDs are correct
- Check if the property exists for those entities
- Try making constraints OPTIONAL

**Too many results:**
- Add more filters to narrow down results
- Reduce LIMIT clause
- Add ORDER BY to get most relevant results first

**Entity IDs unknown:**
- Use the Wikidata search: https://www.wikidata.org/
- Search for the entity name and copy its Q-ID
- Look up properties at: https://www.wikidata.org/wiki/Wikidata:List_of_properties

## Validation

After executing a query:
- Verify the results make sense given the query
- Check if the number of results is reasonable
- Ensure labels are displaying correctly (not just Q-IDs)
- Confirm dates and values are formatted properly

## Resources

- **Query GUI**: https://query.wikidata.org/
- **SPARQL Tutorial**: https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial
- **Query Examples**: https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples
- **Property List**: https://www.wikidata.org/wiki/Wikidata:List_of_properties
- **Main SPARQL Endpoint**: https://query.wikidata.org/sparql
- **SPARQL 1.1 Spec**: https://www.w3.org/TR/sparql11-overview/
