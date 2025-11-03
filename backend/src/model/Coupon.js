const { Schema, default: mongoose } = require("mongoose");

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    minimumOrderValue: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true },
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
