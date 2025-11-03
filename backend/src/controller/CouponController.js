const CouponService = require("../service/CouponService");

class CouponController {
  async createCoupon(req, res) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllCoupons(req, res) {
    try {
      const coupons = await CouponService.getAllCoupons();
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCoupon(req, res) {
    try {
      await CouponService.deleteCoupon(req.params.id);
      res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async applyCoupon(req, res) {
    try {
      const { code, orderValue, apply } = req.body; 
      const userId = req.user._id; 
       const applyBool = apply === true || apply === "true";
      const result = await CouponService.applyCoupon(
        code,
        orderValue,
        userId,
        applyBool,
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CouponController();
