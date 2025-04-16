const sequelize = require('../config/db');
const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemsModel');
const Product = require('../models/productModel');
const User = require('../models/userModel'); // Assuming you added the User check

exports.checkout = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.body.userId;

        if (!userId) {
            // No need to rollback if transaction hasn't been used yet
            return res.status(400).json({ error: 'User ID is required' });
        }

        // --- Optional User Check ---
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
        // --- End User Check ---

        // Find the user's cart
        const cart = await Cart.findOne({ where: { user_id: userId }, transaction });
        if (!cart) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find all items in the cart and include the associated Product to get the price
        const cartItems = await CartItem.findAll({
            where: { cart_id: cart.id },
            include: [{ model: Product, as: 'Product' }], // Ensure 'Product' alias is correct
            transaction
        });

        console.log("Cart items found:", JSON.stringify(cartItems, null, 2));

        if (!cartItems || cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // --- Calculate total price AND prepare order items data ---
        let calculatedTotalPrice = 0;
        const orderItemsData = []; // Array to hold data for OrderItem.bulkCreate

        for (const item of cartItems) {
            console.log(`Processing item ID: ${item.id}, Product ID: ${item.product_id}`);
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

            const subtotal = quantity * priceFloat;
            calculatedTotalPrice += subtotal;
            console.log(`  Item ID ${item.id}: Subtotal=${subtotal}, Running Total=${calculatedTotalPrice}`);

            // Add data for this order item to the array
            orderItemsData.push({
                // order_id will be set after Order is created
                product_id: item.product_id,
                quantity: quantity,
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
        // Add the order_id to each item in orderItemsData
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
             console.log("Transaction already finished, no rollback needed.");
        }

        res.status(500).json({ error: 'Checkout failed. Please try again later.', details: err.message });
    }
};