const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const paymentController = require("../controller/paymentController");
const orderController = require("../controller/orderController");
const router = express.Router();

router.post("/initiate", authMiddleware, paymentController.initiateKhaltiPayment);
router.post("/verify", authMiddleware, paymentController.verifyPayment);
router.post("/esewa/initiate", authMiddleware, paymentController.initiateEsewaPayment);
router.post("/esewa/verify", authMiddleware, paymentController.verifyEsewaPayment);
router.post("/cod/:orderId", authMiddleware, orderController.confirmCOD);

module.exports = router;
