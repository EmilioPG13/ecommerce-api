require('dotenv').config();
const axios = require('axios');
const Product = require('./src/models/productModel');

// Number of products to import
const PRODUCTS_TO_IMPORT = 50;

// Function to fetch products from external API
async function fetchProductsFromAPI() {
    try {
        // Using Fake Store API as an example - you can replace with any API
        const response = await axios.get(`https://fakestoreapi.com/products?limit=${PRODUCTS_TO_IMPORT}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products from API:', error.message);
        return [];
    }
}

// Function to transform external API data to match your product model
function transformProduct(apiProduct) {
    return {
        name: apiProduct.title,
        description: apiProduct.description,
        price: apiProduct.price,
        stock_quantity: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
        // You could add additional fields here if needed
    };
}

// Main function to import products
async function importProducts() {
    try {
        console.log('Fetching products from external API...');
        const apiProducts = await fetchProductsFromAPI();

        if (apiProducts.length === 0) {
            console.log('No products found to import.');
            return;
        }

        console.log(`Found ${apiProducts.length} products. Importing...`);

        // Transform and save each product
        for (const apiProduct of apiProducts) {
            const transformedProduct = transformProduct(apiProduct);

            // Check if product with similar name already exists
            const existingProduct = await Product.findOne({
                where: { name: transformedProduct.name }
            });

            if (existingProduct) {
                console.log(`Product "${transformedProduct.name}" already exists, skipping...`);
                continue;
            }

            // Create new product
            await Product.create(transformedProduct);
            console.log(`Imported: ${transformedProduct.name}`);
        }

        console.log('Product import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error importing products:', error);
        process.exit(1);
    }
}

// Run the import
importProducts();