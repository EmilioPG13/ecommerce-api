const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Import models
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');
const CartItem = require('./models/cartItemModel');
const Order = require('./models/orderModel');
const OrderItem = require('./models/orderItemsModel');

// Set up model associations
// User and Cart
User.hasOne(Cart, {
    foreignKey: 'user_id',
    as: 'cart'
});
Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Cart and CartItem
Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    as: 'CartItems'  // Change from 'items' to 'CartItems' to match client expectations
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
});

// Product and CartItem
Product.hasMany(CartItem, {
    foreignKey: 'product_id',
    as: 'cartItems'
});

CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'Product'  // Capital P to match what client is expecting
});

// User and Order
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders'
});
Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Order and OrderItem
Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items'
});
OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
});

// Product and OrderItem
Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    as: 'orderItems'
});
OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// CORS configuration
// Define allowed origins
const allowedOrigins = [
    'http://localhost:3001', // Keep for local testing
];

// Add the frontend URL from environment variables if it exists
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests) or from allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.JWT_SECRET || 'your-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
app.use('/api/order-items', orderItemRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running, my dude.');
});

module.exports = app;