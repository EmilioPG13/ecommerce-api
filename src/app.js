const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');
const session = require('express-session');
const cors = require('cors');

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'your-production-domain.com' : 'http://localhost:3001',
    credentials: true
}));

// Middleware
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.JWT_SECRET, // use existing secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24hours
    }
}));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import and use routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderItemRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/carts', cartItemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running, my dude.');
});

module.exports = app;