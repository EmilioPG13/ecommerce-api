const sequelize = require('../config/db')
const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemsModel');
const Product = require('../models/productModel')

exports.checkout = async (req, res) => {
    // Start transaction
    const transaction = await sequelize.transaction();
    try {
        const userId = req.body.userId;

        if(!userId) {
            await transaction.rollback();
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ where: { user_id: userId }, transaction });
        if (!cart) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find all items in the cart and include the associated Product to get the price
        const cartItems = await CartItem.findAll({ 
            where: { cart_id: cart.id },
            include: [{ model: Product, as: 'Product' }],
            transaction
        });

        console.log("Cart items found:", JSON.stringify(cartItems, null, 2)); 

        if (!cartItems || cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total price using the price from the included Product model
        let calculatedTotalPrice = 0;
        for (const item of cartItems) {
            if (!item.Product || typeof item.Product.price === 'undefined') {
                // Handle case where product is missing or price is invalid
                console.error(`Product or price missing for cart item product_id: ${item.product_id}`);
                throw new Error(`Product details missing for item ID ${item.product_id}. Cannot complete checkout.`);
            }
            calculatedTotalPrice += item.quantity * parseFloat(item.Product.price);
        }

        // Create a new order
        const order = await Order.create({
            user_id: userId,
            total_price: calculatedTotalPrice,
            status: 'Pending'
        }, { transaction });

        // Create order items using the price from the included Product
        for(const cartItem of cartItems) {
            // Ensure product details were loaded correctly in the check above
            await OrderItem.create({
                order_id: order.id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                price: parseFloat(cartItem.Product.price) // Using price from product
            }, { transaction });
        }

        // Clear the cart (delete CartItems)
        await CartItem.destroy({ where: { cart_id: cart.id }, transaction });

        // If all succeeded, commit the transaction
        await transaction.commit();

        res.status(201).json(order); // Send back the created order details
    } catch (err) {
        // If any error occurred, rollback the transaction
        await transaction.rollback()
        console.error('Checkout error:', err);
        res.status(500).json({ error: 'Checkout failed. Please try again later.', details: err.message });
    }
};