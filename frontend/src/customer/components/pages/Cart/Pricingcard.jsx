import Divider from "@mui/material/Divider";
import React from "react";
import { useAppSelector } from "../../../../Redux Toolkit/store";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../../util/sumCartItemPrice";

const Pricingcard = () => {
  const cart = useAppSelector((store) => store.cart);
  const cartItems = cart.cart?.cartItems || [];
  const couponCode = cart.cart?.couponCode;
  const couponPrice = cart.cart?.couponPrice || 0;

  const subtotal = sumCartItemMrpPrice(cartItems);
  const sellingTotal = sumCartItemSellingPrice(cartItems);
  const productDiscount = subtotal - sellingTotal;
  const total = sellingTotal - couponPrice + 79;

  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>Rs {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span className="text-green-600">
            - Rs {productDiscount.toLocaleString()}
          </span>
        </div>

        {couponCode && (
          <div className="flex justify-between items-center text-green-600 font-medium">
            <span>Coupon ({couponCode})</span>
            <span>- Rs {couponPrice.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>Rs 79</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span className="text-green-600">Free</span>
        </div>
      </div>

      <Divider />

      <div className="font-medium px-5 py-3 flex justify-between items-center">
        <span>Total</span>
        <span className="text-lg font-bold">Rs {total.toLocaleString()}</span>
      </div>

      {(productDiscount > 0 || couponPrice > 0) && (
        <div className="px-5 pb-3">
          <p className="text-xs text-green-600 font-semibold bg-green-50 rounded px-3 py-1.5">
            🎉 You save Rs {(productDiscount + couponPrice).toLocaleString()} on
            this order
          </p>
        </div>
      )}
    </div>
  );
};

export default Pricingcard;
