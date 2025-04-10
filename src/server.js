// Load environment variables from .env file
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

// Use the PORT that Render provides or fallback to 3000
const PORT = process.env.PORT || 3000;

// Add error handling to the database connection
sequelize.sync()
  .then(() => {
    console.log('Database connected successfully');
    
    // Start the server and make sure it listens on the specified port
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT} bro`);
    });
    
    // Handle errors to prevent crashes
    server.on('error', (error) => {
      console.error('Server error:', error);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    // Don't exit - let the app keep trying to connect
    // Instead of process.exit(1);
  });