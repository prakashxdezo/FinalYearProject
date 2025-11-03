const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const orderController = require('../controller/orderController.js');
const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);

router.get('/user', authMiddleware, orderController.getUserOrderHistory);

router.put('/:orderId/cancel', authMiddleware, orderController.cancelOrder);

router.get('/:orderId', authMiddleware, orderController.getOrderById);

router.get('/item/:orderItemId', authMiddleware, orderController.getOrderItemById);



module.exports = router;