const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');

// Cart item routes
router.get('/', cartItemController.getAllCartItems);
router.get('/cart/:cartId', cartItemController.getCartItemsByCartId);
router.get('/:id', cartItemController.getCartItemById);
router.post('/', cartItemController.createCartItem);
router.put('/:id', cartItemController.updateCartItem);
router.delete('/:id', cartItemController.deleteCartItem);

module.exports = router;