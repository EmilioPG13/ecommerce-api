'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', { // Match the tableName from the Order model
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2), // Example: Allows up to 10 digits, 2 after decimal
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending' // Example default status
      },
      shipping_address: {
        type: Sequelize.TEXT, // Use TEXT for potentially long addresses
        allowNull: true // Or false if required
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: true // Or false if required
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true // Or false if required
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'unpaid'
      },
      stripe_payment_intent_id: { // If using Stripe
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};