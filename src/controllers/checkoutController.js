const sequelize = require('../config/db');
const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemsModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.checkout = async (req, res) => {
    console.log("Starting checkout process...");
    try {
        const userId = req.body.userId;
        console.log(`User ID received: ${userId}`);

        if (!userId) {
            console.log("User ID missing.");
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Use sequelize.transaction with a callback
        const order = await sequelize.transaction(async (t) => { // 't' is the transaction object
            console.log("Transaction callback started.");

            // --- Optional User Check (Read - without explicit transaction object) ---
            console.log("Attempting to find user...");
            const user = await User.findByPk(userId); // Removed { transaction: t }
            console.log(`User find result: ${user ? `Found User ID ${user.id}` : 'Not Found'}`);
            if (!user) {
                console.log("User not found, throwing error to trigger rollback.");
                // Throwing an error inside the callback automatically triggers rollback
                throw new Error(`User with ID ${userId} not found.`);
            }

            // --- Find Cart (Read - without explicit transaction object) ---
            console.log("Attempting to find cart...");
            const cart = await Cart.findOne({ where: { user_id: userId } }); // Removed { transaction: t }
            console.log(`Cart find result: ${cart ? `Found Cart ID ${cart.id}` : 'Not Found'}`);
            if (!cart) {
                console.log("Cart not found, throwing error to trigger rollback.");
                throw new Error('Cart not found');
            }

            // --- Find Cart Items (Read - without explicit transaction object) ---
            console.log("Attempting to find cart items...");
            const cartItems = await CartItem.findAll({
                where: { cart_id: cart.id },
                include: [{ model: Product, as: 'Product' }] // Removed { transaction: t }
            });
            console.log(`Cart items find result: Found ${cartItems ? cartItems.length : 'null/undefined'} items.`);
            if (!cartItems || cartItems.length === 0) {
                console.log("Cart is empty, throwing error to trigger rollback.");
                throw new Error('Cart is empty');
            }

            // --- Calculate total price AND prepare order items data ---
            let calculatedTotalPrice = 0;
            const orderItemsData = [];
            for (const item of cartItems) {
                // ... (Keep existing detailed logging and validation inside loop) ...
                console.log(`Processing item ID: ${item.id}, Product ID: ${item.product_id}`);
                if (!item.Product || typeof item.Product.price === 'undefined' || item.Product.price === null) {
                    console.error(`VALIDATION FAILED: Product or price missing/invalid...`);
                    throw new Error(`Product details missing or invalid for an item in your cart.`);
                }
                const quantity = item.quantity;
                const priceString = item.Product.price;
                console.log(`  Item ID ${item.id}: Quantity=${quantity}, PriceString='${priceString}'`);
                if (typeof quantity !== 'number' || quantity === null || quantity <= 0) {
                    console.error(`VALIDATION FAILED: Invalid quantity...`);
                    throw new Error(`Invalid quantity for an item in your cart.`);
                }
                const priceFloat = parseFloat(priceString);
                console.log(`  Item ID ${item.id}: PriceFloat=${priceFloat}`);
                if (isNaN(priceFloat)) {
                    console.error(`VALIDATION FAILED: Price calculation resulted in NaN...`);
                    throw new Error(`Invalid price format for an item in your cart.`);
                }
                calculatedTotalPrice += quantity * priceFloat;
                console.log(`  Item ID ${item.id}: Subtotal=${quantity * priceFloat}, Running Total=${calculatedTotalPrice}`);
                orderItemsData.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: priceFloat
                });
            }
            console.log("Final Calculated Total Price:", calculatedTotalPrice);

            // --- Create the Order (Write - USE transaction object 't') ---
            console.log("Attempting to create order...");
            const createdOrder = await Order.create({
                user_id: userId,
                total_price: calculatedTotalPrice,
                status: 'Pending'
            }, { transaction: t }); // Pass transaction object 't' here
            console.log("Order created successfully:", createdOrder.id);

            // --- Create OrderItems in bulk (Write - USE transaction object 't') ---
            const completeOrderItemsData = orderItemsData.map(itemData => ({
                ...itemData,
                order_id: createdOrder.id
            }));
            console.log("Attempting to create order items...");
            await OrderItem.bulkCreate(completeOrderItemsData, { transaction: t }); // Pass 't'
            console.log("Order items created successfully.");

            // --- Clear the cart (Write - USE transaction object 't') ---
            console.log("Attempting to clear cart...");
            await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t }); // Pass 't'
            console.log("Cart cleared successfully.");

            console.log("Transaction callback finished successfully. Returning order.");
            return createdOrder; // Return value from the callback is the result of sequelize.transaction
        });

        // If the transaction callback completed without error, 'order' will have the createdOrder
        console.log("Transaction committed successfully.");
        res.status(201).json(order); // Send back the created order details

    } catch (err) {
        // Errors thrown inside the transaction callback are caught here
        console.error('Checkout error (caught outside transaction block):', err);
        // Sequelize automatically rolled back because the callback threw an error
        console.log("Transaction automatically rolled back due to error.");
        res.status(500).json({ error: 'Checkout failed. Please try again later.', details: err.message });
    }
};