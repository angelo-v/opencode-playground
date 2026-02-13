#!/usr/bin/env node

/**
 * Convert products JSON to RDF Turtle format
 * Uses Schema.org vocabulary for e-commerce
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'data', 'products-for-rdf.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'products.ttl');

function escapeString(str) {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
}

function generateTurtle(data) {
  let ttl = '';
  
  // Prefixes
  ttl += '@prefix schema: <http://schema.org/> .\n';
  ttl += '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n';
  ttl += '@prefix : <#> .\n\n';
  
  // Create brand and category resources first
  const brands = new Set();
  const categories = new Set();
  const subcategories = new Set();
  
  data.products.forEach(p => {
    brands.add(p.brand);
    categories.add(p.category);
    subcategories.add(`${p.category}/${p.subcategory}`);
  });
  
  // Brand definitions
  ttl += '# Brands\n\n';
  for (const brand of Array.from(brands).sort()) {
    const brandId = brand.replace(/[^a-zA-Z0-9]/g, '');
    ttl += `:Brand${brandId} a schema:Brand ;\n`;
    ttl += `    schema:name "${escapeString(brand)}" .\n\n`;
  }
  
  // Category definitions
  ttl += '# Categories\n\n';
  for (const category of Array.from(categories).sort()) {
    const catId = category.replace(/[^a-zA-Z0-9]/g, '');
    ttl += `:Category${catId} a schema:Category ;\n`;
    ttl += `    schema:name "${escapeString(category)}" .\n\n`;
  }
  
  // Subcategory definitions
  ttl += '# Subcategories\n\n';
  for (const subcat of Array.from(subcategories).sort()) {
    const [cat, sub] = subcat.split('/');
    const subcatId = sub.replace(/[^a-zA-Z0-9]/g, '');
    const catId = cat.replace(/[^a-zA-Z0-9]/g, '');
    ttl += `:Subcategory${subcatId} a schema:Category ;\n`;
    ttl += `    schema:name "${escapeString(sub)}" ;\n`;
    ttl += `    schema:parentCategory :Category${catId} .\n\n`;
  }
  
  // Products
  ttl += '# Products\n\n';
  
  for (const product of data.products) {
    const brandId = product.brand.replace(/[^a-zA-Z0-9]/g, '');
    const catId = product.category.replace(/[^a-zA-Z0-9]/g, '');
    const subcatId = product.subcategory.replace(/[^a-zA-Z0-9]/g, '');
    
    ttl += `:${product.id} a schema:Product ;\n`;
    ttl += `    schema:sku "${product.id}" ;\n`;
    ttl += `    schema:name "${escapeString(product.name)}" ;\n`;
    
    if (product.description) {
      ttl += `    schema:description "${escapeString(product.description)}" ;\n`;
    }
    
    ttl += `    schema:price "${product.price.toFixed(2)}"^^xsd:decimal ;\n`;
    ttl += `    schema:priceCurrency "${product.currency}" ;\n`;
    ttl += `    schema:brand :Brand${brandId} ;\n`;
    ttl += `    schema:category :Category${catId} ;\n`;
    ttl += `    schema:subcategory :Subcategory${subcatId} ;\n`;
    
    // Use inventoryLevel for stock
    if (product.stock !== undefined) {
      ttl += `    schema:inventoryLevel "${product.stock}"^^xsd:integer ;\n`;
    }
    
    // Add availability based on stock
    if (product.stock > 0) {
      ttl += `    schema:availability schema:InStock ;\n`;
    } else {
      ttl += `    schema:availability schema:OutOfStock ;\n`;
    }
    
    // Related products
    if (product.related && product.related.length > 0) {
      ttl += `    schema:isRelatedTo `;
      ttl += product.related.map(r => `:${r}`).join(', ');
      ttl += ' ;\n';
    }
    
    // Remove trailing semicolon and add period
    ttl = ttl.slice(0, -2) + ' .\n\n';
  }
  
  return ttl;
}

function main() {
  console.log('🔄 Converting JSON to RDF Turtle...\n');
  
  // Read input
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  console.log(`   Read ${data.products.length} products from JSON`);
  
  // Generate Turtle
  const turtle = generateTurtle(data);
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, turtle);
  console.log(`   ✓ Generated ${OUTPUT_FILE}`);
  
  // Statistics
  const lines = turtle.split('\n').length;
  const triples = (turtle.match(/\./g) || []).length;
  console.log(`\n📊 RDF Statistics:`);
  console.log(`   Lines: ${lines}`);
  console.log(`   Approximate triples: ${triples}`);
  console.log(`   File size: ${(turtle.length / 1024).toFixed(2)} KB`);
  
  console.log('\n✅ RDF generation complete!\n');
}

main();
