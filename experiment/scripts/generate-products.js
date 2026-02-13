#!/usr/bin/env node

/**
 * Generate 200+ realistic e-commerce products for RDF vs Markdown experiment
 */

const fs = require('fs');
const path = require('path');

// Configuration
const NUM_PRODUCTS = 250;
const OUTPUT_DIR = path.join(__dirname, '..', 'data');

// Categories and their typical products
const categories = {
  'Electronics': {
    subcategories: ['Laptops', 'Headphones', 'Smartphones', 'Tablets', 'Cameras'],
    brands: ['Apple', 'Sony', 'Samsung', 'Lenovo', 'Dell', 'HP', 'Canon', 'Nikon', 'Bose', 'JBL'],
    priceRanges: { min: 99, max: 2999 }
  },
  'Clothing': {
    subcategories: ['Shirts', 'Pants', 'Dresses', 'Jackets', 'Shoes'],
    brands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s', 'Gap', 'Uniqlo', 'Puma'],
    priceRanges: { min: 19, max: 299 }
  },
  'Home & Garden': {
    subcategories: ['Furniture', 'Kitchen', 'Bedding', 'Decor', 'Tools'],
    brands: ['IKEA', 'KitchenAid', 'Cuisinart', 'Black & Decker', 'DeWalt', 'Bosch'],
    priceRanges: { min: 29, max: 1499 }
  },
  'Sports': {
    subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Cycling'],
    brands: ['Nike', 'Adidas', 'Under Armour', 'Wilson', 'Spalding', 'Coleman', 'REI'],
    priceRanges: { min: 15, max: 899 }
  },
  'Books': {
    subcategories: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography'],
    brands: ['Penguin', 'HarperCollins', 'Simon & Schuster', 'Random House', 'Oxford'],
    priceRanges: { min: 9, max: 79 }
  },
  'Toys': {
    subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Outdoor'],
    brands: ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Playmobil', 'Melissa & Doug'],
    priceRanges: { min: 9, max: 299 }
  }
};

// Product name templates
const productTemplates = {
  'Laptops': ['ThinkPad X1 Carbon', 'MacBook Pro', 'Dell XPS', 'HP Spectre', 'Surface Laptop', 'ASUS ZenBook'],
  'Headphones': ['WH-1000XM5', 'AirPods Pro', 'QuietComfort', 'Galaxy Buds', 'Studio Wireless', 'Elite'],
  'Smartphones': ['iPhone 15 Pro', 'Galaxy S24', 'Pixel 8', 'OnePlus 12', 'Xperia 5'],
  'Tablets': ['iPad Air', 'Galaxy Tab', 'Surface Pro', 'Fire HD'],
  'Cameras': ['EOS R5', 'Alpha A7', 'Z9', 'Lumix GH6', 'X-T5'],
  'Shirts': ['Classic Fit', 'Slim Fit', 'Oxford', 'Polo', 'T-Shirt', 'Flannel'],
  'Pants': ['Chinos', 'Jeans', 'Cargo', 'Dress Pants', 'Joggers'],
  'Dresses': ['Summer Dress', 'Evening Gown', 'Cocktail Dress', 'Maxi Dress'],
  'Jackets': ['Leather Jacket', 'Bomber', 'Denim Jacket', 'Windbreaker', 'Parka'],
  'Shoes': ['Running Shoes', 'Sneakers', 'Boots', 'Loafers', 'Sandals'],
  'Furniture': ['Sofa', 'Dining Table', 'Bed Frame', 'Bookshelf', 'Office Chair'],
  'Kitchen': ['Blender', 'Coffee Maker', 'Stand Mixer', 'Food Processor', 'Toaster'],
  'Bedding': ['Sheet Set', 'Comforter', 'Pillow', 'Duvet Cover', 'Mattress Pad'],
  'Decor': ['Wall Art', 'Vase', 'Mirror', 'Rug', 'Lamp'],
  'Tools': ['Drill', 'Saw', 'Wrench Set', 'Toolbox', 'Ladder'],
  'Fitness': ['Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Treadmill', 'Exercise Bike'],
  'Outdoor': ['Tent', 'Sleeping Bag', 'Backpack', 'Camping Stove', 'Hiking Boots'],
  'Team Sports': ['Basketball', 'Soccer Ball', 'Football', 'Baseball Glove', 'Tennis Racket'],
  'Water Sports': ['Kayak', 'Paddleboard', 'Wetsuit', 'Life Jacket', 'Snorkel Set'],
  'Cycling': ['Mountain Bike', 'Road Bike', 'Helmet', 'Bike Lock', 'Water Bottle'],
  'Fiction': ['Mystery Novel', 'Sci-Fi Epic', 'Romance', 'Thriller', 'Fantasy Series'],
  'Non-Fiction': ['Self-Help', 'Business Guide', 'Cookbook', 'Travel Guide', 'Memoir'],
  'Science': ['Physics Textbook', 'Biology Guide', 'Chemistry Reference', 'Astronomy Book'],
  'History': ['World War II', 'Ancient Rome', 'Medieval Europe', 'American History'],
  'Biography': ['Steve Jobs', 'Einstein', 'Churchill', 'Marie Curie', 'Nelson Mandela'],
  'Action Figures': ['Superhero Figure', 'Star Wars', 'Marvel Legends', 'Transformers'],
  'Dolls': ['Barbie', 'Baby Doll', 'Fashion Doll', 'Collector Doll'],
  'Board Games': ['Strategy Game', 'Party Game', 'Puzzle', 'Card Game', 'Trivia'],
  'Educational': ['STEM Kit', 'Learning Tablet', 'Building Blocks', 'Science Set'],
  'Outdoor': ['Swing Set', 'Trampoline', 'Water Gun', 'Frisbee', 'Kite']
};

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function generateProductName(subcategory, brand, index) {
  const templates = productTemplates[subcategory] || ['Product'];
  const template = randomChoice(templates);
  
  // Add variations
  const variations = ['', ' Plus', ' Pro', ' Max', ' Ultra', ' Elite', ' Premium', ' Deluxe'];
  const sizes = ['', ' Small', ' Medium', ' Large', ' XL'];
  const colors = ['', ' Black', ' White', ' Blue', ' Red', ' Silver'];
  const models = ['', ' Gen ' + randomInt(1, 5), ' v' + randomInt(1, 4), ' ' + randomInt(2020, 2026)];
  
  let name = `${brand} ${template}`;
  
  // Randomly add variations
  if (Math.random() > 0.7) name += randomChoice(variations);
  if (subcategory === 'Clothing' && Math.random() > 0.5) name += randomChoice(sizes);
  if (subcategory === 'Clothing' && Math.random() > 0.6) name += randomChoice(colors);
  if (subcategory === 'Electronics' && Math.random() > 0.6) name += randomChoice(models);
  
  return name;
}

function generateDescription(category, subcategory, brand, name) {
  const adjectives = ['premium', 'high-quality', 'durable', 'stylish', 'innovative', 'professional', 'reliable'];
  const features = {
    'Electronics': ['with advanced features', 'featuring latest technology', 'with long battery life', 'designed for professionals'],
    'Clothing': ['comfortable fit', 'made from quality materials', 'perfect for any occasion', 'timeless style'],
    'Home & Garden': ['space-saving design', 'easy to assemble', 'modern aesthetic', 'built to last'],
    'Sports': ['performance-oriented', 'designed for athletes', 'lightweight and durable', 'all-weather'],
    'Books': ['bestselling', 'critically acclaimed', 'comprehensive guide', 'expertly written'],
    'Toys': ['age-appropriate', 'safe and fun', 'promotes creativity', 'hours of entertainment']
  };
  
  const adj = randomChoice(adjectives);
  const feature = randomChoice(features[category] || ['high quality']);
  
  return `A ${adj} ${subcategory.toLowerCase()} from ${brand}, ${feature}.`;
}

// Generate products
function generateProducts() {
  const products = [];
  let productId = 1;
  
  // Distribute products across categories
  const categoriesArray = Object.keys(categories);
  const productsPerCategory = Math.floor(NUM_PRODUCTS / categoriesArray.length);
  
  for (const category of categoriesArray) {
    const categoryData = categories[category];
    const productsInCategory = category === categoriesArray[categoriesArray.length - 1] 
      ? NUM_PRODUCTS - products.length // Last category gets remaining products
      : productsPerCategory;
    
    for (let i = 0; i < productsInCategory; i++) {
      const subcategory = randomChoice(categoryData.subcategories);
      const brand = randomChoice(categoryData.brands);
      const name = generateProductName(subcategory, brand, i);
      const price = randomPrice(categoryData.priceRanges.min, categoryData.priceRanges.max);
      const stock = Math.random() > 0.05 ? randomInt(0, 100) : 0; // 5% out of stock
      const hasDescription = Math.random() > 0.1; // 10% missing description
      
      const product = {
        id: `P${String(productId).padStart(3, '0')}`,
        name: name,
        description: hasDescription ? generateDescription(category, subcategory, brand, name) : null,
        price: parseFloat(price),
        currency: 'USD',
        brand: brand,
        category: category,
        subcategory: subcategory,
        stock: stock,
        related: [] // Will be populated later
      };
      
      products.push(product);
      productId++;
    }
  }
  
  // Add related products
  products.forEach(product => {
    const sameCategory = products.filter(p => 
      p.category === product.category && 
      p.id !== product.id
    );
    
    // 60% chance of having related products
    if (Math.random() > 0.4 && sameCategory.length > 0) {
      const numRelated = randomInt(1, Math.min(3, sameCategory.length));
      for (let i = 0; i < numRelated; i++) {
        const related = randomChoice(sameCategory);
        if (!product.related.includes(related.id)) {
          product.related.push(related.id);
        }
      }
    }
  });
  
  return products;
}

// Generate markdown format
function generateMarkdown(products) {
  let md = '# Product Catalog\n\n';
  md += `Total Products: ${products.length}\n\n`;
  md += '---\n\n';
  
  const categoriesArray = [...new Set(products.map(p => p.category))];
  
  for (const category of categoriesArray) {
    md += `## ${category}\n\n`;
    
    const categoryProducts = products.filter(p => p.category === category);
    const subcategories = [...new Set(categoryProducts.map(p => p.subcategory))];
    
    for (const subcategory of subcategories) {
      md += `### ${subcategory}\n\n`;
      
      const subProducts = categoryProducts.filter(p => p.subcategory === subcategory);
      
      // Create table
      md += '| ID | Name | Brand | Price | Stock | Description |\n';
      md += '|---|---|---|---|---|---|\n';
      
      for (const product of subProducts) {
        const desc = product.description || 'N/A';
        const stock = product.stock > 0 ? `${product.stock} units` : 'Out of stock';
        md += `| ${product.id} | ${product.name} | ${product.brand} | $${product.price.toFixed(2)} | ${stock} | ${desc} |\n`;
      }
      
      md += '\n';
    }
  }
  
  return md;
}

// Save files
function saveFiles(products) {
  // Save master JSON
  const masterPath = path.join(OUTPUT_DIR, 'products-master.json');
  fs.writeFileSync(masterPath, JSON.stringify({ products }, null, 2));
  console.log(`✓ Generated ${masterPath}`);
  
  // Save markdown
  const markdown = generateMarkdown(products);
  const mdPath = path.join(OUTPUT_DIR, 'products.md');
  fs.writeFileSync(mdPath, markdown);
  console.log(`✓ Generated ${mdPath}`);
  
  // Save simplified JSON for RDF conversion
  const rdfPath = path.join(OUTPUT_DIR, 'products-for-rdf.json');
  fs.writeFileSync(rdfPath, JSON.stringify({ products }, null, 2));
  console.log(`✓ Generated ${rdfPath}`);
  
  // Print statistics
  console.log('\n📊 Statistics:');
  console.log(`   Total products: ${products.length}`);
  console.log(`   Categories: ${[...new Set(products.map(p => p.category))].length}`);
  console.log(`   Brands: ${[...new Set(products.map(p => p.brand))].length}`);
  console.log(`   Out of stock: ${products.filter(p => p.stock === 0).length}`);
  console.log(`   Missing descriptions: ${products.filter(p => !p.description).length}`);
  console.log(`   Price range: $${Math.min(...products.map(p => p.price)).toFixed(2)} - $${Math.max(...products.map(p => p.price)).toFixed(2)}`);
}

// Main
function main() {
  console.log('🏭 Generating product catalog...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const products = generateProducts();
  saveFiles(products);
  
  console.log('\n✅ Product generation complete!\n');
}

main();
