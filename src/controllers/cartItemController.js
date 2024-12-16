const CartItem = require('../models/cartItemsModel');

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll();
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.create(req.body);
        res.status(201).json(cartItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        await cartItem.update(req.body);
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        await cartItem.destroy();
        res.json({ message: 'Cart item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};