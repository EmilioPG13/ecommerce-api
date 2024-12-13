// Load environment variables from .env file
require('dotenv').config();

// filepath: /src/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});