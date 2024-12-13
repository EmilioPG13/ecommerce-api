// filepath: /src/app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running, my dude.');
});

module.exports = app;