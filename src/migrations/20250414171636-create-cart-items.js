'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', { // Match the tableName from the CartItem model
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Carts', // Name of the Carts table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete cart item if cart is deleted
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Name of the Products table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete cart item if product is deleted (consider if this is desired)
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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

    // Add a unique constraint to prevent duplicate product entries within the same cart
    await queryInterface.addConstraint('CartItems', {
      fields: ['cart_id', 'product_id'],
      type: 'unique',
      name: 'cartitems_cart_id_product_id_unique_constraint'
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the unique constraint first
    await queryInterface.removeConstraint('CartItems', 'cartitems_cart_id_product_id_unique_constraint');
    await queryInterface.dropTable('CartItems');
  }
};