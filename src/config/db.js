const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Disable logging; default: console.log
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('We are connected boss');
    })
    .catch(err => {
        console.error('Your connection is cooked', err);
    });

module.exports = sequelize;