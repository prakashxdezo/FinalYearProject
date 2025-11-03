const express = require("express");
const router = express.Router();
const CouponController = require("../controller/CouponController");
const authMiddleware = require("../middlewares/authMiddleware");

// admin routes
router.post("/admin/create", CouponController.createCoupon);
router.get("/admin/all", CouponController.getAllCoupons);
router.delete("/admin/delete/:id", CouponController.deleteCoupon);

// customer route
router.post("/apply", authMiddleware, CouponController.applyCoupon);

module.exports = router;
