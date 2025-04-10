const { Sequelize } = require('sequelize');
require('dotenv').config();

// Extract database connection info from the environment variable provided by Render
const databaseUrl = process.env.DATABASE_URL;

// Create sequelize instance with SSL configuration for production
const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false, // Set to false in production
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    retry: {
        max: 5 // Retry connection up to 5 times
    }
});

// Test the database connection but don't fail if it doesn't connect immediately
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

testConnection();

module.exports = sequelize;