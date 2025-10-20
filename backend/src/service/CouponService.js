const Coupon = require("../model/Coupon");
const Cart = require("../model/cart");

class CouponService {
  async createCoupon(data) {
    const coupon = new Coupon(data);
    return await coupon.save();
  }

  async getAllCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  async deleteCoupon(id) {
    return await Coupon.findByIdAndDelete(id);
  }

  async applyCoupon(code, orderValue, userId, apply) {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems",
      populate: { path: "product" },
    });
    if (!cart) throw new Error("Cart not found");

    console.log("userId from token:", userId);
    console.log("cart found:", JSON.stringify(cart, null, 2)); 

    console.log("cart.cartItems count:", cart.cartItems.length);
    console.log("first item:", JSON.stringify(cart.cartItems[0], null, 2));

    if (apply) {
      const coupon = await Coupon.findOne({ code, isActive: true });
      if (!coupon) throw new Error("Invalid or inactive coupon");

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        throw new Error("Coupon has expired");
      }

      if (orderValue < coupon.minimumOrderValue) {
        throw new Error(
          `Minimum order value is Rs ${coupon.minimumOrderValue}`,
        );
      }

      // ✅ recalculate fresh total from cart items
      const freshTotal = cart.cartItems.reduce((sum, item) => {
        return sum + (item.sellingPrice || 0) * (item.quantity || 1);
      }, 0);

      console.log("freshTotal:", freshTotal); // 👈 check this in terminal

      const discount = Math.floor(
        (freshTotal * coupon.discountPercentage) / 100,
      );

      cart.couponCode = code;
      cart.couponPrice = discount;
      cart.totalSellingPrice = freshTotal - discount;
    } else {
      if (!cart.couponCode) throw new Error("No coupon applied");
      cart.totalSellingPrice = cart.totalSellingPrice + cart.couponPrice;
      cart.couponCode = null;
      cart.couponPrice = 0;
    }

    return await cart.save();
  }
}

module.exports = new CouponService();
