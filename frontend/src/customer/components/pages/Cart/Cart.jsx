import React, { useEffect, useState } from "react";
import CartItemCard from "./CartItemCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Pricingcard from "./Pricingcard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { fetchCart } from "../../../../Redux Toolkit/features/customer/cartSlice";
import { useNavigate } from "react-router";
import { api } from "../../../../config/api";
import { sumCartItemSellingPrice } from "../../../../util/sumCartItemPrice";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((store) => store.cart);

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchCart(localStorage.getItem("jwt")));
  }, [dispatch]);

  const cartItems = cart.cart?.cartItems || [];
  const appliedCoupon = cart.cart?.couponCode;

const handleApplyCoupon = async () => {
  if (!couponCode.trim()) return;
  setCouponMsg("");
  setCouponError("");
  setApplying(true);
  try {
   const cartTotal = sumCartItemSellingPrice(cartItems);
    await api.post(
      `/api/coupons/apply`,
      {
        code: couponCode.trim().toUpperCase(),
        orderValue: cartTotal,
        apply: true,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } },
    );
    setCouponMsg(`Coupon "${couponCode.toUpperCase()}" applied!`);
    dispatch(fetchCart(localStorage.getItem("jwt")));
  } catch (err) {
    setCouponError(err.response?.data?.message || "Invalid or expired coupon");
  } finally {
    setApplying(false);
  }
};

 const handleRemoveCoupon = async () => {
   try {
     await api.post(
       `/api/coupons/apply`,
       { code: appliedCoupon, orderValue: 0, apply: false },
       { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } },
     );
     setCouponMsg("");
     setCouponCode("");
     dispatch(fetchCart(localStorage.getItem("jwt")));
   } catch (err) {
     console.error("Remove coupon error:", err.response?.data); // 👈 change this line
   }
 };

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <CartItemCard key={item._id} item={item} />
            ))}
          </div>

          <div className="col-span-1 text-sm space-y-3">
            {/* Coupon Section */}
            <div className="border border-gray-300 rounded-md px-5 py-3 space-y-3">
              <div className="flex gap-2 text-sm items-center">
                <LocalOfferIcon color="primary" sx={{ fontSize: "17px" }} />
                <span>Apply Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                    <span className="text-green-700 font-semibold text-xs">
                      {appliedCoupon} applied
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 items-center">
                    <TextField
                      placeholder="Enter coupon code"
                      size="small"
                      fullWidth
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                        setCouponMsg("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleApplyCoupon}
                      disabled={applying || !couponCode.trim()}
                      sx={{ whiteSpace: "nowrap", minWidth: "60px" }}
                    >
                      {applying ? "..." : "Apply"}
                    </Button>
                  </div>
                  {couponMsg && (
                    <p className="text-xs text-green-600 font-medium">
                      {couponMsg}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-500 font-medium">
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Price Summary */}
            <section className="border rounded-md border-gray-300">
              <Pricingcard />
              <div className="p-5">
                <Button
                  onClick={() => navigate("/checkout/address")}
                  fullWidth
                  variant="contained"
                  sx={{ py: "11px" }}
                >
                  BUY NOW
                </Button>
              </div>
            </section>

            {/* Wishlist shortcut */}
            <div
              onClick={() => navigate("/account/wishlist")}
              className="border border-gray-300 rounded-md px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span>Add From Wishlist</span>
              <FavoriteBorderIcon color="primary" />
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-2xl text-center font-semibold">Cart is Empty</h1>
      )}
    </div>
  );
};

export default Cart;
