const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemsModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemsModel');

exports.checkout = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find all items in the cart
        const cartItems = await CartItem.findAll({ where: { cart_id: cart.id } });

        // Create a new order
        const order = await Order.create({
            user_id: userId,
            total_price: cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
            status: 'Pending'
        });

        // Create order items
        for (const cartItem of cartItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                price: cartItem.price
            });
        }

        // Clear the cart
        await CartItem.destroy({ where: { cart_id: cart.id } });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};