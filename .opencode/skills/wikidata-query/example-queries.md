# Wikidata Query Examples

This file contains example SPARQL queries you can use with the wikidata-query skill.

## Example 1: Find Nobel Prize Winners

Find all Nobel Prize in Physics winners with their names and award years:

```sparql
SELECT ?person ?personLabel ?year
WHERE {
  ?person wdt:P31 wd:Q5 .                    # instance of human
  ?person p:P166 ?award_statement .          # award received
  ?award_statement ps:P166 wd:Q38104 .       # Nobel Prize in Physics
  ?award_statement pq:P585 ?year .           # point in time
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?year)
LIMIT 20
```

## Example 2: Find Cities in a Country

Find all cities in Germany:

```sparql
SELECT ?city ?cityLabel ?population
WHERE {
  ?city wdt:P31 wd:Q515 .           # instance of city
  ?city wdt:P17 wd:Q183 .           # country: Germany
  OPTIONAL { ?city wdt:P1082 ?population . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?population)
LIMIT 50
```

## Example 3: Find Information About a Specific Person

Get detailed information about Ada Lovelace (Q7259):

```sparql
SELECT ?property ?propertyLabel ?value ?valueLabel
WHERE {
  wd:Q7259 ?p ?value .
  ?property wikibase:directClaim ?p .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 50
```

## Example 4: Find Painters Born in a Time Period

Find painters born between 1850 and 1900:

```sparql
SELECT ?painter ?painterLabel ?birthDate ?birthPlaceLabel
WHERE {
  ?painter wdt:P31 wd:Q5 .              # instance of human
  ?painter wdt:P106 wd:Q1028181 .       # occupation: painter
  ?painter wdt:P569 ?birthDate .        # date of birth
  OPTIONAL { ?painter wdt:P19 ?birthPlace . }
  FILTER(?birthDate >= "1850-01-01T00:00:00Z"^^xsd:dateTime && 
         ?birthDate <= "1900-12-31T00:00:00Z"^^xsd:dateTime)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?birthDate
LIMIT 100
```

## Example 5: Count Items by Type

Count the number of movies in Wikidata:

```sparql
SELECT (COUNT(?movie) AS ?count)
WHERE {
  ?movie wdt:P31 wd:Q11424 .    # instance of film
}
```

## Example 6: Find Works by an Author

Find books written by Jane Austen (Q36322):

```sparql
SELECT ?book ?bookLabel ?publicationDate
WHERE {
  ?book wdt:P50 wd:Q36322 .         # author: Jane Austen
  OPTIONAL { ?book wdt:P577 ?publicationDate . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?publicationDate
```

## Example 7: Find Entities with Images

Find programming languages with their logos:

```sparql
SELECT ?language ?languageLabel ?logo
WHERE {
  ?language wdt:P31 wd:Q9143 .      # instance of programming language
  ?language wdt:P154 ?logo .        # logo image
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 30
```

## Example 8: Geographic Queries

Find universities in Paris:

```sparql
SELECT ?university ?universityLabel ?coordinates
WHERE {
  ?university wdt:P31 wd:Q3918 .        # instance of university
  ?university wdt:P131 wd:Q90 .         # located in Paris
  OPTIONAL { ?university wdt:P625 ?coordinates . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 50
```

## Executing Queries via curl

To execute any of these queries via command line:

```bash
curl -G "https://query.wikidata.org/sparql" \
  --data-urlencode "query=YOUR_SPARQL_QUERY_HERE" \
  -H "Accept: application/sparql-results+json"
```

## Common Property IDs

- P31 - instance of
- P279 - subclass of
- P106 - occupation
- P27 - country of citizenship
- P569 - date of birth
- P570 - date of death
- P19 - place of birth
- P50 - author
- P166 - award received
- P17 - country
- P131 - located in administrative territorial entity
- P625 - coordinate location
- P1082 - population
- P577 - publication date
- P154 - logo image

## Common Entity IDs

- Q5 - human
- Q515 - city
- Q3918 - university
- Q11424 - film
- Q1028181 - painter
- Q9143 - programming language
- Q183 - Germany
- Q90 - Paris
- Q38104 - Nobel Prize in Physics
