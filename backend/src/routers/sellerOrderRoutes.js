const express = require("express");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");
const requireActiveSellerStatus = require("../middlewares/sellerStatusMiddleware");
const orderController = require("../controller/orderController");
const router = express.Router();

router.get("/", sellerMiddleware, orderController.getSellersOrders);

router.patch(
  "/:orderId/status/:orderStatus",
  sellerMiddleware,
  requireActiveSellerStatus,
  orderController.updateOrderStatus,
);

module.exports = router;
