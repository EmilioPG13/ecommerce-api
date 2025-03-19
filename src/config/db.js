const { Sequelize } = require('sequelize');
require('dotenv').config();

// Enable logging during troubleshooting
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true, // Change to true to see SQL queries
    retry: {
        max: 3
    }
});

// Test the database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('We are connected boss');
        console.log('Connected to:', process.env.DATABASE_URL);
    } catch (err) {
        console.error('Your connection is cooked:', err);
    }
};

testConnection();

module.exports = sequelize;