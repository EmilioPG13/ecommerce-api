const CartItem = require('../models/cartItemModel');
const Product = require('../models/productModel');


exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            include: [{
                model: Product,
                as: 'Product'
            }]
        });
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id, {
            include: [{
                model: Product,
                as: 'Product'
            }]
        });
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCartItemsByCartId = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { cart_id: req.params.cartId },
            include: [{
                model: Product,
                as: 'Product'
            }]
        });
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCartItem = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug logging
        const { cart_id, product_id, quantity, price } = req.body;
        
        // Validate required fields
        if (!cart_id || !product_id || !price) {
            console.error('Missing required fields:', { cart_id, product_id, price });
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Check if item already exists in cart
        const existingItem = await CartItem.findOne({
            where: {
                cart_id,
                product_id
            }
        });
        
        if (existingItem) {
            // If item exists, update quantity
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json(existingItem);
        } else {
            // If item doesn't exist, create new item
            const cartItem = await CartItem.create({
                cart_id,
                product_id,
                quantity: quantity || 1,
                price
            });
            
            res.status(201).json(cartItem);
        }
    } catch (error) {
        console.error('Error in createCartItem:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        
        const cartItem = await CartItem.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        
        cartItem.quantity = quantity;
        await cartItem.save();
        
        res.status(200).json(cartItem);
    } catch (error) {
        console.error('Error in updateCartItem:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cartItem = await CartItem.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        
        await cartItem.destroy();
        
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error in deleteCartItem:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};