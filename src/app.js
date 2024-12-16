// filepath: /src/app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

//Import and use routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderItemRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/carts', cartItemRoutes);
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running, my dude.');
});

module.exports = app;