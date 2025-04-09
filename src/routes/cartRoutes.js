const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart routes
router.get('/', cartController.getCart);
router.get('/summary/:id', cartController.getCartSummary);
router.get('/user/:userId', cartController.getCartByUserId);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);

module.exports = router;