const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load .env file

let sequelize;
const isProduction = process.env.NODE_ENV === 'production';

const productionSslOptions = {
    require: true,
    rejectUnauthorized: false // Necessary for Render databases
};

// Common Sequelize options (including SSL based on NODE_ENV and retry)
const commonOptions = {
    dialect: 'postgres',
    logging: false, // Disable logging by default
    dialectOptions: {
        // Apply SSL options ONLY if NODE_ENV is production
        ssl: isProduction ? productionSslOptions : false
    },
    retry: {
        max: 5 // Retry connection up to 5 times
    }
};

// --- Priority 1: Explicit Production Vars (for import script scenario) ---
if (isProduction && process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    console.log("Connecting using individual Production DB variables (NODE_ENV=production override)...");
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
// --- Priority 2: DATABASE_URL (Render default or explicit setting) ---
else if (process.env.DATABASE_URL) {
    console.log("Connecting using DATABASE_URL...");
    // Pass commonOptions here too, which includes the SSL logic based on NODE_ENV
    sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
}
// --- Priority 3: Local Dev Vars (fallback if no DATABASE_URL and not forced production) ---
else if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    console.log("Connecting using individual Local DB variables...");
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            ...commonOptions // SSL will be false here if NODE_ENV is not 'production'
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
        // Log only the error message for cleaner output during script runs
        console.error('Database connection error during initial test:', err.message);
        // Optionally log the full error for debugging: console.error(err);
    }
};

// Call the test function only if sequelize is defined
if (sequelize) {
    testConnection();
}

module.exports = sequelize;