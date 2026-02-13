#!/bin/bash

# Generate ground truth answers by running SPARQL queries via Comunica

QUERIES_FILE="experiment/data/queries.json"
TTL_FILE="experiment/data/products.ttl"
OUTPUT_FILE="experiment/data/ground-truth.json"

echo "🔍 Generating ground truth answers..."
echo ""

# Start JSON output
echo "{" > "$OUTPUT_FILE"
echo '  "generated": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",' >> "$OUTPUT_FILE"
echo '  "source": "Comunica SPARQL queries on products.ttl",' >> "$OUTPUT_FILE"
echo '  "results": [' >> "$OUTPUT_FILE"

# Counter for comma handling
count=0
total=$(jq '.queries | length' "$QUERIES_FILE")

# Iterate through each query
jq -c '.queries[]' "$QUERIES_FILE" | while read -r query; do
  count=$((count + 1))
  
  id=$(echo "$query" | jq -r '.id')
  sparql=$(echo "$query" | jq -r '.sparql')
  question=$(echo "$query" | jq -r '.question')
  type=$(echo "$query" | jq -r '.type')
  
  echo "  Running $id: $question"
  
  # Execute SPARQL query
  result=$(npx comunica-sparql-file "$TTL_FILE" -q "$sparql" 2>/dev/null)
  
  # Build JSON entry
  echo "    {" >> "$OUTPUT_FILE"
  echo "      \"query_id\": \"$id\"," >> "$OUTPUT_FILE"
  echo "      \"question\": $(echo "$question" | jq -R .)," >> "$OUTPUT_FILE"
  echo "      \"type\": \"$type\"," >> "$OUTPUT_FILE"
  echo "      \"result\": $result" >> "$OUTPUT_FILE"
  
  if [ $count -lt $total ]; then
    echo "    }," >> "$OUTPUT_FILE"
  else
    echo "    }" >> "$OUTPUT_FILE"
  fi
done

# Close JSON
echo "  ]" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo ""
echo "✅ Ground truth generated: $OUTPUT_FILE"
echo ""
