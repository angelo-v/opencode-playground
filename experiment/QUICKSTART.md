# Quick Start Guide

## Your Experiment is Ready!

All infrastructure has been built and validated. You can start testing immediately.

## Quick Validation Test

### Test 1: RDF Query Works
```bash
npx comunica-sparql-file experiment/data/products.ttl \
  -q "SELECT (COUNT(?product) AS ?total) WHERE { ?product a schema:Product }"
```

**Expected output:** `[{"total":"\"250\"..."}]`

### Test 2: Markdown File Exists
```bash
head -20 experiment/data/products.md
```

**Expected:** Table of products starting with Electronics

### Test 3: Ground Truth Available
```bash
cat experiment/data/ground-truth.json | head -30
```

**Expected:** JSON with query results

---

## Running Your First Query

### Markdown Test (Example)

**Question:** "What is the price of product P001?"

1. Open agent session
2. Share `experiment/data/products.md`
3. Ask: "What is the price of product P001?"
4. **Expected answer:** $192.06
5. Record in `experiment/results/response-tracking.csv`

### RDF Test (Example)

**Question:** "What is the price of product P001?"

1. Open agent session
2. Tell agent to load `sparql-query-agent` skill
3. Provide context:
   ```
   Query this file: experiment/data/products.ttl
   Use: npx comunica-sparql-file <file> -q "QUERY"
   ```
4. Ask: "What is the price of product P001?"
5. Agent should:
   - Construct SPARQL: `SELECT ?price WHERE { :P001 schema:price ?price }`
   - Execute via Comunica
   - Parse result
   - Answer: "192.06"
6. **Expected answer:** 192.06 or $192.06
7. Record in tracking sheet

---

## File Locations

```
experiment/
├── data/
│   ├── products.md           ← Use this for Markdown tests
│   ├── products.ttl          ← Use this for RDF tests
│   ├── queries.json          ← 30 test questions
│   └── ground-truth.json     ← Correct answers
└── results/
    └── response-tracking.csv ← Record responses here
```

---

## 30 Test Questions (from queries.json)

### Simple Lookups (Q001-Q010)
1. What is the price of product P001?
2. What is the name of product P042?
3. List all products from the brand Sony.
4. Find all products in the Electronics category.
5. What is the stock level of product P010?
6. Is product P015 in stock or out of stock?
7. What brand makes product P025?
8. List all products with SKU starting with P01 (P010-P019).
9. Find all products priced under $50.
10. What products are out of stock?

### Aggregations (Q011-Q020)
11. How many total products are in the catalog?
12. What is the average price of all products?
13. What is the average price of Electronics products?
14. How many products are out of stock?
15. What is the total inventory value?
16. What is the most expensive product price?
17. What is the cheapest product price?
18. How many different brands are in the catalog?
19. How many products does the brand Apple have?
20. Which category has the most products?

### Relationship Traversal (Q021-Q030)
21. What products are related to product P001?
22. Find all products from the same brand as P010.
23. Find all products in the same category as P020.
24. Which brands make products in both Electronics and Clothing?
25. Find products with similar prices to P005 (within 10% range).
26. What products share related products with P001?
27. Find brands that have products priced over $1000.
28. Which products in the Electronics category are from the brand Canon?
29. Find the top 3 most expensive products in the Sports category.
30. How many products does each brand have, for brands with more than 5 products?

---

## Expected Time

- **5 queries × 3 runs × 2 formats** = 30 queries (1 hour) - Good for initial test
- **10 queries × 3 runs × 2 formats** = 60 queries (2 hours) - Moderate test
- **30 queries × 3 runs × 2 formats** = 180 queries (3-4 hours) - Full experiment

---

## Tips

1. **Start small:** Test with 5 queries to get comfortable
2. **Fresh sessions:** Don't reuse agent context between runs
3. **Record everything:** Even unexpected behaviors are valuable data
4. **Check ground truth:** Validate each answer against `ground-truth.json`
5. **Note patterns:** Does one format struggle with certain query types?

---

## Need Help?

- **README:** `experiment/README.md` - Full documentation
- **Queries:** `experiment/data/queries.json` - All questions with SPARQL
- **Ground Truth:** `experiment/data/ground-truth.json` - Correct answers
- **SPARQL Skill:** `.opencode/skills/sparql-query-agent/SKILL.md` - Agent guidance

---

## Sample Ground Truth Answers

**Q001:** Price of P001 = $192.06  
**Q011:** Total products = 250  
**Q016:** Most expensive = $2,988.25  
**Q017:** Cheapest = $12.34  
**Q018:** Different brands = 40  

Good luck with your experiment!
