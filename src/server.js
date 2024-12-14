// Load environment variables from .env file
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in ${PORT} bro`);        
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});