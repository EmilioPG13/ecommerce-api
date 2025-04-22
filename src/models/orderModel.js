const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    total_amount: { // <-- CHANGED THIS NAME
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        // field: 'total_amount' // Optional: Explicitly map if needed
    },
    status: {
        type: DataTypes.STRING, // Match DB: varchar(255)
        allowNull: false,
        defaultValue: 'pending' // Match DB default
    },
    // Add other fields from DDL if you want Sequelize to manage them
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    billing_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    payment_method: {
        type: DataTypes.STRING, // Match DB: varchar(255)
        allowNull: true
    },
    payment_status: {
        type: DataTypes.STRING, // Match DB: varchar(255)
        allowNull: false,
        defaultValue: 'unpaid' // Match DB default
    },
    created_at: {
        type: DataTypes.DATE, // Or DataTypes.DATEONLY if no time needed
        defaultValue: DataTypes.NOW,
        allowNull: false // Match DB
    },
    updated_at: { // Add this field to match DB
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false // Match DB
    }
}, {
    timestamps: true, // Enable timestamps since DB has created_at/updated_at
    createdAt: 'created_at', // Map Sequelize's createdAt to DB column
    updatedAt: 'updated_at'  // Map Sequelize's updatedAt to DB column
    // If you don't want Sequelize to manage updated_at automatically,
    // set timestamps: false and remove the updated_at field definition above.
});

module.exports = Order;