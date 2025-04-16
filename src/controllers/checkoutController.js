const sequelize = require('../config/db');
const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemsModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.checkout = async (req, res) => {
    console.log("Starting checkout process..."); // Log start
    const transaction = await sequelize.transaction();
    console.log("Transaction started."); // Log after transaction start
    try {
        const userId = req.body.userId;
        console.log(`User ID received: ${userId}`);

        if (!userId) {
            console.log("User ID missing.");
            // No need to rollback if transaction hasn't been used yet
            return res.status(400).json({ error: 'User ID is required' });
        }

        // --- Optional User Check ---
        console.log("Attempting to find user...");
        const user = await User.findByPk(userId, { transaction });
        console.log(`User find result: ${user ? `Found User ID ${user.id}` : 'Not Found'}`); // Log user find result
        if (!user) {
            console.log("User not found, rolling back.");
            await transaction.rollback();
            return res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
        // --- End User Check ---

        // Find the user's cart
        console.log("Attempting to find cart...");
        const cart = await Cart.findOne({ where: { user_id: userId }, transaction });
        console.log(`Cart find result: ${cart ? `Found Cart ID ${cart.id}` : 'Not Found'}`); // Log cart find result
        if (!cart) {
            console.log("Cart not found, rolling back.");
            await transaction.rollback();
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find all items in the cart and include the associated Product to get the price
        console.log("Attempting to find cart items...");
        const cartItems = await CartItem.findAll({
            where: { cart_id: cart.id },
            include: [{ model: Product, as: 'Product' }], // Ensure 'Product' alias is correct
            transaction
        });
        console.log(`Cart items find result: Found ${cartItems ? cartItems.length : 'null/undefined'} items.`);

        if (!cartItems || cartItems.length === 0) {
            console.log("Cart is empty, rolling back.");
            await transaction.rollback();
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // --- Calculate total price AND prepare order items data ---
        let calculatedTotalPrice = 0;
        const orderItemsData = []; // Array to hold data for OrderItem.bulkCreate

        for (const item of cartItems) {
            console.log(`Processing item ID: ${item.id}, Product ID: ${item.product_id}`); // Log item start
            if (!item.Product || typeof item.Product.price === 'undefined' || item.Product.price === null) {
                console.error(`VALIDATION FAILED: Product or price missing/invalid for cart item ID ${item.id}, product_id: ${item.product_id}. Product data:`, item.Product);
                await transaction.rollback();
                return res.status(500).json({ error: `Product details missing or invalid for an item in your cart. Cannot complete checkout.` });
            }

            const quantity = item.quantity;
            const priceString = item.Product.price;
            console.log(`  Item ID ${item.id}: Quantity=${quantity}, PriceString='${priceString}'`);

            if (typeof quantity !== 'number' || quantity === null || quantity <= 0) {
                console.error(`VALIDATION FAILED: Invalid quantity for cart item ID ${item.id}. Quantity: ${quantity}`);
                await transaction.rollback();
                return res.status(500).json({ error: `Invalid quantity for an item in your cart. Cannot complete checkout.` });
            }

            const priceFloat = parseFloat(priceString);
            console.log(`  Item ID ${item.id}: PriceFloat=${priceFloat}`);

            if (isNaN(priceFloat)) {
                console.error(`VALIDATION FAILED: Price calculation resulted in NaN for cart item ID ${item.id}. Original price string: '${priceString}'`);
                await transaction.rollback();
                return res.status(500).json({ error: `Invalid price format for an item in your cart. Cannot complete checkout.` });
            }

            calculatedTotalPrice += quantity * priceFloat;
            console.log(`  Item ID ${item.id}: Subtotal=${quantity * priceFloat}, Running Total=${calculatedTotalPrice}`); // Log after calculation

            // Add data for this order item to the array
            orderItemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: priceFloat // Use the calculated float price
            });
        }

        console.log("Final Calculated Total Price:", calculatedTotalPrice);

        // --- Create the Order ---
        console.log("Attempting to create order...");
        const order = await Order.create({
            user_id: userId,
            total_price: calculatedTotalPrice,
            status: 'Pending'
        }, { transaction });
        console.log("Order created successfully:", order.id);

        // --- Create OrderItems in bulk ---
        const completeOrderItemsData = orderItemsData.map(itemData => ({
            ...itemData,
            order_id: order.id
        }));

        console.log("Attempting to create order items...");
        await OrderItem.bulkCreate(completeOrderItemsData, { transaction });
        console.log("Order items created successfully.");


        // --- Clear the cart ---
        console.log("Attempting to clear cart...");
        await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
        console.log("Cart cleared successfully.");

        // --- Commit the transaction ---
        console.log("Attempting to commit transaction...");
        await transaction.commit();
        console.log("Transaction committed successfully.");

        res.status(201).json(order); // Send back the created order details

    } catch (err) {
        console.error('Checkout error:', err); // Log the error first

        // Rollback only if transaction is still active
        if (transaction && !transaction.finished) {
            try {
                console.log("Attempting to rollback transaction...");
                await transaction.rollback();
                console.log("Transaction rolled back successfully.");
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        } else {
            console.log("Transaction already finished (likely due to prior error), no explicit rollback needed.");
        }

        res.status(500).json({ error: 'Checkout failed. Please try again later.', details: err.message });
    }
};