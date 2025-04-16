const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load .env file for local dev if needed

let sequelize; // Define sequelize with let to allow conditional assignment
const isProduction = process.env.NODE_ENV === 'production';

// Define SSL options for production
const productionSslOptions = {
    require: true,
    rejectUnauthorized: false // Necessary for Render databases
};

// Common Sequelize options (including SSL based on NODE_ENV and retry)
const commonOptions = {
    dialect: 'postgres',
    logging: false, // Disable logging in production, enable for dev if needed
    dialectOptions: {
        // Apply SSL options ONLY if NODE_ENV is production
        ssl: isProduction ? productionSslOptions : false
    },
    retry: {
        max: 5 // Retry connection up to 5 times
    }
};

// --- Check for DATABASE_URL first (used by Render) ---
if (process.env.DATABASE_URL) {
    console.log("Connecting using DATABASE_URL...");
    sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
}
// --- Fallback to individual variables (used by local export or .env) ---
else if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    console.log("Connecting using individual DB variables...");
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD, // Password can be undefined/null if not set
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432, // Default port if not set
            ...commonOptions // Spread the common options (dialect, logging, ssl, retry)
        }
    );
}
// --- Error if no connection details found ---
else {
    console.error("Database connection details not found. Please set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME environment variables.");
    throw new Error("Missing database configuration."); 
}

// Test the database connection but don't fail if it doesn't connect immediately
const testConnection = async () => {
    try {
        // Ensure sequelize was actually initialized before testing
        if (sequelize) { 
            await sequelize.authenticate();
            console.log('Database connection established successfully');
        }
    } catch (err) {
        console.error('Database connection error during initial test:', err);
    }
};

// Call the test function only if sequelize is defined
if (sequelize) {
    testConnection();
}

module.exports = sequelize;