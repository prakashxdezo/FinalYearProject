const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const CartController = require('../controller/CartController');

const router = express.Router();

router.get('/', authMiddleware, CartController.findUserCartHandler);
router.put('/add', authMiddleware, CartController.addItemToCart);
router.delete('/item/:cartItemId', authMiddleware, CartController.deleteCartItemHandler);
router.put('/item/:cartItemId', authMiddleware, CartController.updateCartItemHandler);

module.exports = router;