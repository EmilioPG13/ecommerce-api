const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const Product = require('../models/productModel');

exports.getCart = async (req, res) => {
    try {
        const carts = await Cart.findAll({
            include: [{
                model: CartItem,
                as: 'CartItems',
                include: [{
                    model: Product,
                    as: 'Product'
                }]
            }]
        });
        
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

// Get cart by ID
exports.getCartById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Try to find cart by user ID
        const cart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'CartItems',
                include: [{
                    model: Product,
                    as: 'Product'
                }]
            }]
        });

        if (!cart) {
            // If no cart exists, create one for this user
            const newCart = await Cart.create({
                user_id: userId
            });
            
            // Return the new empty cart
            return res.status(200).json({
                id: newCart.id,
                user_id: newCart.user_id,
                created_at: newCart.created_at,
                CartItems: []
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in getCartById:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

// Get cart by user ID
exports.getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.params.userId },
            include: [{
                model: CartItem,
                as: 'CartItems',
                include: [{
                    model: Product,
                    as: 'Product'
                }]
            }]
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in getCartByUserId:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

// Create a new cart
exports.createCart = async (req, res) => {
    try {
        // Check if cart already exists for this user
        const existingCart = await Cart.findOne({
            where: { user_id: req.body.user_id }
        });
        
        if (existingCart) {
            return res.status(200).json(existingCart); // Return existing cart instead of error
        }
        
        const cart = await Cart.create({
            user_id: req.body.user_id
        });
        
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error in createCart:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

// Update cart item
exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findByPk(req.params.id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        await cart.update(req.body);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCartSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.params.id },
            include: [{
                model: CartItem,
                as: 'CartItems',
                include: [{
                    model: Product,
                    as: 'Product'
                }]
            }]
        });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        // Calculate totals
        let itemCount = 0;
        let subtotal = 0;
        
        cart.CartItems.forEach(item => {
            itemCount += item.quantity;
            subtotal += item.quantity * item.Product.price;
        });
        
        res.status(200).json({
            cart_id: cart.id,
            user_id: cart.user_id,
            item_count: itemCount,
            subtotal: subtotal,
            items: cart.CartItems
        });
    } catch (error) {
        console.error('Error in getCartSummary:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

// Remove cart
exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByPk(req.params.id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        await cart.destroy();
        res.json({ message: 'Cart deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};